import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9334;
const origin = process.argv[2] || "http://127.0.0.1:3000";
const profile = await mkdtemp(path.join(os.tmpdir(), "eu-i18n-"));
const shots = path.join(profile, "shots");
await mkdir(shots);

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
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" },
);

function send(socket, id, method, params = {}) {
  socket.send(JSON.stringify({ id, method, params }));
}

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) break;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((target) => target.type === "page");
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve);
    socket.addEventListener("error", reject);
  });
  const pending = new Map();
  let nextId = 1;
  const messages = [];
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
  });
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
  await call("Runtime.enable");
  await call("Page.enable");
  await call("Network.enable");
  return { call, messages, socket };
}

async function evaluate(call, expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true });
  return result.result.value;
}

async function open(call, url, headers) {
  if (headers) await call("Network.setExtraHTTPHeaders", { headers });
  await call("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

try {
  const { call, messages } = await connect();
  const report = { messages: [], pages: {}, overflow: [], shots: [] };

  await open(call, `${origin}/`, { "Accept-Language": "en-US,en;q=0.9" });
  report.pages.rootWithEnglishBrowser = await evaluate(
    call,
    `JSON.stringify({ href: location.href, lang: document.documentElement.lang, dir: document.documentElement.dir, cookie: document.cookie })`,
  );

  await open(call, `${origin}/ar#projects`);
  report.pages.arabic = JSON.parse(
    await evaluate(
      call,
      `JSON.stringify({
        href: location.href,
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        title: document.title,
        hero: document.querySelector("#hero-title")?.textContent,
        nav: Array.from(document.querySelectorAll("header nav a")).map((node) => node.textContent.trim()),
        switcher: document.querySelector("[aria-label='اختيار اللغة'], [aria-label='Language']")?.textContent,
        canonical: document.querySelector("link[rel='canonical']")?.href,
        alternates: Array.from(document.querySelectorAll("link[rel='alternate']")).map((node) => node.hreflang + " " + node.href),
        projects: document.querySelectorAll("#projects article").length,
        form: document.querySelector("label[for='lead-name']")?.textContent.trim(),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        fd: document.querySelectorAll("[fdprocessedid]").length
      })`,
    ),
  );

  const switched = await evaluate(
    call,
    `(() => {
      const link = Array.from(document.querySelectorAll("header a")).find((node) => node.textContent.trim() === "EN");
      if (!link) return "missing-en";
      link.click();
      return "clicked";
    })()`,
  );
  await new Promise((resolve) => setTimeout(resolve, 2500));
  report.pages.afterEnglishClick = JSON.parse(
    await evaluate(
      call,
      `JSON.stringify({ click: ${JSON.stringify(switched)}, href: location.href, lang: document.documentElement.lang, dir: document.documentElement.dir, hero: document.querySelector("#hero-title")?.textContent, hash: location.hash })`,
    ),
  );

  await open(call, `${origin}/`);
  report.pages.rootAfterEnglish = await evaluate(
    call,
    `JSON.stringify({ href: location.href, lang: document.documentElement.lang, dir: document.documentElement.dir })`,
  );

  await open(call, `${origin}/en`);
  const form = await evaluate(
    call,
    `(() => {
      const set = (id, value) => {
        const node = document.getElementById(id);
        const prototype = node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, "value").set.call(node, value);
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.dispatchEvent(new Event("change", { bubbles: true }));
      };
      set("lead-name", "Omar Hassan");
      set("lead-phone", "01012345678");
      set("lead-governorate", "cairo");
      set("lead-service", "supply");
      set("lead-building", "residential");
      set("lead-details", "Two elevators for a residential building.");
      window.__opened = "";
      window.open = (url) => { window.__opened = url; return { closed: false }; };
      document.querySelector("#quote form").requestSubmit();
      return "submitted";
    })()`,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  report.pages.englishForm = JSON.parse(
    await evaluate(
      call,
      `JSON.stringify({ submit: ${JSON.stringify(form)}, opened: window.__opened || "", status: document.querySelector("#quote [role='status']")?.textContent || "", errors: Array.from(document.querySelectorAll("#quote [role='alert']")).map((node) => node.textContent) })`,
    ),
  );

  await open(call, `${origin}/no-such-page`);
  report.pages.invalid = await evaluate(
    call,
    `JSON.stringify({ href: location.href, text: document.body.innerText.slice(0, 240) })`,
  );

  for (const locale of ["ar", "en"]) {
    await open(call, `${origin}/${locale}`);
    for (const width of [360, 390, 768, 1024, 1440, 1920]) {
      await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await new Promise((resolve) => setTimeout(resolve, 250));
      const metrics = JSON.parse(
        await evaluate(
          call,
          `JSON.stringify({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, dir: document.documentElement.dir, lang: document.documentElement.lang })`,
        ),
      );
      report.overflow.push({ locale, width, ...metrics });
      if (width === 390 || width === 1440) {
        const shot = await call("Page.captureScreenshot", { format: "png" });
        const file = path.join(shots, `${locale}-${width}.png`);
        await writeFile(file, Buffer.from(shot.data, "base64"));
        report.shots.push(file);
      }
    }
  }

  report.hydration = messages.filter((line) => /hydrat|did not match|fdprocessedid/i.test(line));
  console.log(JSON.stringify(report, null, 2));
} finally {
  browser.kill();
}
