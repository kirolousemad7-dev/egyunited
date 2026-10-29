import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9336;
const origin = "http://127.0.0.1:4173";
const profile = await mkdtemp(path.join(os.tmpdir(), "eu-visual-"));
const shots = path.join(process.cwd(), "static-site-preview");
await mkdir(shots, { recursive: true });

const browser = spawn(chrome, [
  "--headless=new",
  "--disable-extensions",
  "--no-first-run",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "--window-size=1440,900",
  "about:blank",
], { stdio: "ignore" });

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) break;
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
  let nextId = 1;
  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) {
      pending.get(payload.id)(payload.result);
      pending.delete(payload.id);
    }
  });
  function call(method, params = {}) {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout ${method}`)), 20000);
      pending.set(id, (result) => { clearTimeout(timer); resolve(result); });
    });
  }
  await call("Page.enable");
  await call("Runtime.enable");
  return { call };
}

async function evaluate(call, expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true });
  return result.result.value;
}

try {
  const { call } = await connect();
  await call("Page.navigate", { url: `${origin}/ar/` });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await evaluate(call, `localStorage.setItem("eu-lang","en")`);
  await call("Page.navigate", { url: `${origin}/?from=memory` });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const rootEn = await evaluate(call, `JSON.stringify({ href: location.href, lang: document.documentElement.lang, dir: document.documentElement.dir, stored: localStorage.getItem("eu-lang") })`);

  const shotsOut = [];
  for (const [locale, width] of [["ar", 1024], ["ar", 1440], ["en", 390]]) {
    await call("Page.navigate", { url: `${origin}/${locale}/` });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await new Promise((resolve) => setTimeout(resolve, 300));
    for (const id of ["home", "services", "projects", "quote", "contact"]) {
      await evaluate(call, `document.getElementById(${JSON.stringify(id)}).scrollIntoView()`);
      await new Promise((resolve) => setTimeout(resolve, 250));
      const shot = await call("Page.captureScreenshot", { format: "jpeg", quality: 60 });
      const file = path.join(shots, `${locale}-${width}-${id}.jpg`);
      await writeFile(file, Buffer.from(shot.data, "base64"));
      shotsOut.push(file);
    }
  }
  const assets = JSON.parse(await evaluate(call, `JSON.stringify(Array.from(document.images).map((img) => ({ src: img.getAttribute("src"), width: img.naturalWidth })))`));
  const fab = JSON.parse(await evaluate(call, `JSON.stringify({ call: getComputedStyle(document.querySelector(".fab-call")).display, wa: getComputedStyle(document.querySelector(".fab-wa")).display })`));
  console.log(JSON.stringify({ rootEn, fab, assets, shotsOut }, null, 2));
} finally {
  browser.kill();
}
