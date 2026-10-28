import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const pageUrl = process.argv[2] || "http://127.0.0.1:3000";
const profile = await mkdtemp(path.join(os.tmpdir(), "eu-clean-chrome-"));

const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-extensions",
    "--disable-component-extensions-with-background-pages",
    "--no-first-run",
    "--disable-sync",
    "--disable-default-apps",
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitForVersion() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Chrome DevTools did not start");
}

function send(socket, id, method, params = {}) {
  socket.send(JSON.stringify({ id, method, params }));
}

try {
  await waitForVersion();
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((target) => target.type === "page");
  if (!page) throw new Error("No browser page target");

  const messages = [];
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve);
    socket.addEventListener("error", reject);
  });

  const pending = new Map();
  let nextId = 1;
  function call(method, params) {
    const id = nextId;
    nextId += 1;
    send(socket, id, method, params);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 20000);
      pending.set(id, (result) => {
        clearTimeout(timer);
        resolve(result);
      });
    });
  }

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) {
      pending.get(payload.id)(payload.result);
      pending.delete(payload.id);
      return;
    }
    if (payload.method === "Runtime.consoleAPICalled") {
      const text = payload.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
      messages.push(`${payload.params.type}: ${text}`);
    }
    if (payload.method === "Runtime.exceptionThrown") {
      messages.push(`exception: ${payload.params.exceptionDetails.text}`);
    }
    if (payload.method === "Log.entryAdded") {
      messages.push(`log: ${payload.params.entry.level} ${payload.params.entry.text}`);
    }
  });

  console.error("cdp-ready");
  await call("Runtime.enable");
  await call("Log.enable");
  await call("Page.enable");
  if (process.argv.includes("--reduce")) {
    await call("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
  }
  console.error("navigating");
  await call("Page.navigate", { url: pageUrl });
  console.error("navigated");
  await new Promise((resolve) => setTimeout(resolve, 12000));

  const probe = await call("Runtime.evaluate", {
    expression: `(() => {
      const tagged = document.querySelectorAll("[fdprocessedid]").length;
      const button = document.querySelector("#projects button");
      return JSON.stringify({
        tagged,
        buttonExpanded: button ? button.getAttribute("aria-expanded") : null,
        buttonText: button ? button.textContent.trim() : null,
        fdOnButton: button ? button.hasAttribute("fdprocessedid") : false,
        dir: document.documentElement.dir,
        projects: document.querySelectorAll("#projects article").length
      });
    })()`,
    returnByValue: true,
  });

  const hydration = messages.filter((line) => /hydrat|fdprocessedid|did not match/i.test(line));
  console.log(JSON.stringify({ probe: JSON.parse(probe.result.value), hydration, messages }, null, 2));
  if (hydration.length) process.exitCode = 2;
  socket.close();
} finally {
  browser.kill();
  await new Promise((resolve) => setTimeout(resolve, 800));
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
