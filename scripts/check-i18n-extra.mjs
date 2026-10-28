import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9335;
const origin = "http://127.0.0.1:3000";
const profile = await mkdtemp(path.join(os.tmpdir(), "eu-i18n-extra-"));
const browser = spawn(chrome, ["--headless=new", "--disable-extensions", "--no-first-run", `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, "--window-size=390,800", "about:blank"], { stdio: "ignore" });

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) })).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((target) => target.type === "page");
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve);
    socket.addEventListener("error", reject);
  });
  const pending = new Map();
  let id = 1;
  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) pending.get(payload.id)(payload.result);
  });
  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const current = id++;
      const timer = setTimeout(() => reject(new Error(method)), 20000);
      pending.set(current, (result) => {
        clearTimeout(timer);
        resolve(result);
      });
      socket.send(JSON.stringify({ id: current, method, params }));
    });
  await call("Runtime.enable");
  await call("Page.enable");
  return call;
}

const evalJson = async (call, expression) => JSON.parse((await call("Runtime.evaluate", { expression, returnByValue: true })).result.value);

try {
  const call = await connect();
  await call("Network.setExtraHTTPHeaders", { headers: { "Accept-Language": "en-US,en;q=0.9" } });
  await call("Page.navigate", { url: `${origin}/fr` });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const invalidLocale = await evalJson(call, `JSON.stringify({ href: location.href, text: document.body.innerText.includes("404") })`);

  await call("Page.navigate", { url: `${origin}/ar` });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 800, deviceScaleFactor: 1, mobile: true });
  await call("Runtime.evaluate", { expression: `document.querySelector("header button").click()` });
  await new Promise((resolve) => setTimeout(resolve, 300));
  const menu = await evalJson(
    call,
    `JSON.stringify({ open: Boolean(document.querySelector("#mobile-nav")), text: document.querySelector("#mobile-nav")?.innerText || "" })`,
  );

  await call("Runtime.evaluate", {
    expression: `(() => {
      const set = (id, value) => {
        const node = document.getElementById(id);
        const prototype = node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, "value").set.call(node, value);
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.dispatchEvent(new Event("change", { bubbles: true }));
      };
      set("lead-name", "عمر حسن");
      set("lead-phone", "٠١٠١٢٣٤٥٦٧٨");
      set("lead-governorate", "giza");
      set("lead-service", "repair");
      set("lead-building", "villa");
      set("lead-details", "مصعد واحد في فيلا بحاجة إلى فحص العطل.");
      window.open = (url) => { window.__opened = url; return { closed: false }; };
      document.querySelector("#quote form").requestSubmit();
      return "submitted";
    })()`,
  });
  await new Promise((resolve) => setTimeout(resolve, 600));
  const result = await evalJson(
    call,
    `JSON.stringify({ opened: decodeURIComponent(window.__opened || ""), errors: Array.from(document.querySelectorAll("#quote [role='alert']")).map((node) => node.textContent) })`,
  );
  console.log(JSON.stringify({ invalidLocale, menu, result }, null, 2));
} finally {
  browser.kill();
}
