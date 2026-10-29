import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9335;
const origin = "http://127.0.0.1:4173";
const profile = await mkdtemp(path.join(os.tmpdir(), "eu-static-"));
const shots = path.join(profile, "shots");
await mkdir(shots);

const browser = spawn(chrome, [
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
], { stdio: "ignore" });

function send(socket, id, method, params = {}) {
  socket.send(JSON.stringify({ id, method, params }));
}

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) break;
    } catch {}
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
  const failed = [];
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
      messages.push(`exception: ${payload.params.exceptionDetails.text} ${payload.params.exceptionDetails.exception?.description || ""}`);
    }
    if (payload.method === "Network.responseReceived") {
      const status = payload.params.response.status;
      if (status >= 400) failed.push(`${status} ${payload.params.response.url}`);
    }
    if (payload.method === "Network.loadingFailed") {
      failed.push(`failed ${payload.params.errorText} ${payload.params.requestId}`);
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
  return { call, messages, failed, socket };
}

async function evaluate(call, expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function open(call, url) {
  await call("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 1800));
}

try {
  const { call, messages, failed } = await connect();
  const report = { pages: {}, overflow: [], shots: [] };

  await open(call, `${origin}/?src=test#projects`);
  report.pages.root = JSON.parse(await evaluate(call, `JSON.stringify({ href: location.href, lang: document.documentElement.lang, dir: document.documentElement.dir, hash: location.hash, search: location.search })`));

  await open(call, `${origin}/ar/`);
  report.pages.arabic = JSON.parse(await evaluate(call, `JSON.stringify({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    hero: document.querySelector("#hero-title")?.textContent,
    projects: document.querySelectorAll(".project").length,
    visible: document.querySelectorAll(".project:not([hidden])").length,
    faqs: document.querySelectorAll(".faq button").length,
    firstFaq: document.querySelector(".faq button")?.getAttribute("aria-expanded"),
    images: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc),
    fonts: document.fonts.check("800 48px 'Cairo Local'"),
    wa: document.querySelector(".fab-wa")?.href,
    phones: document.querySelectorAll("a[href^='tel:']").length,
    options: document.querySelectorAll("#lead-governorate option").length
  })`));

  report.pages.projects = JSON.parse(await evaluate(call, `(() => {
    const more = document.querySelector(".more");
    const before = document.querySelectorAll(".project:not([hidden])").length;
    more.click();
    const after = document.querySelectorAll(".project:not([hidden])").length;
    const filter = document.querySelector(".filters button[data-filter]:not([data-filter='all'])");
    filter.click();
    const filtered = document.querySelectorAll(".project:not([hidden])").length;
    const category = filter.getAttribute("data-filter");
    document.querySelector(".filters button[data-filter='all']").click();
    const faq = document.querySelectorAll(".faq button")[1];
    faq.click();
    const menu = document.querySelector(".menu-btn");
    menu.click();
    const open = !document.querySelector(".mobile-nav").hidden;
    menu.click();
    return JSON.stringify({ before, after, category, filtered, faqOpen: faq.getAttribute("aria-expanded"), menuOpened: open, menuClosed: document.querySelector(".mobile-nav").hidden });
  })()`));

  report.pages.invalidForm = JSON.parse(await evaluate(call, `(() => {
    document.querySelector("#quote form").requestSubmit();
    return JSON.stringify(Array.from(document.querySelectorAll("#quote .error")).map((node) => node.textContent).filter(Boolean));
  })()`));

  report.pages.validForm = JSON.parse(await evaluate(call, `(() => {
    const set = (id, value) => {
      const node = document.getElementById(id);
      node.value = value;
      node.dispatchEvent(new Event("change", { bubbles: true }));
    };
    set("lead-name", "أحمد محمود");
    set("lead-phone", "٠١٠١٢٣٤٥٦٧٨");
    set("lead-governorate", "giza");
    set("lead-service", "repair");
    set("lead-building", "hospital");
    set("lead-details", "مصعد واحد في مستشفى يحتاج إصلاح عطل.");
    window.__opened = "";
    window.open = (url) => { window.__opened = String(url); return { closed: false }; };
    document.querySelector("#quote form").requestSubmit();
    return JSON.stringify({ opened: window.__opened, status: document.querySelector(".status")?.textContent || "" });
  })()`));

  await open(call, `${origin}/en/#quote`);
  report.pages.english = JSON.parse(await evaluate(call, `JSON.stringify({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    hero: document.querySelector("#hero-title")?.textContent,
    hash: location.hash,
    visible: document.querySelectorAll(".project:not([hidden])").length
  })`));

  report.pages.englishForm = JSON.parse(await evaluate(call, `(() => {
    const set = (id, value) => { document.getElementById(id).value = value; };
    set("lead-name", "Omar Hassan");
    set("lead-phone", "+20 121 044 2451");
    set("lead-governorate", "cairo");
    set("lead-service", "supply");
    set("lead-building", "residential");
    set("lead-details", "Two elevators for a residential building.");
    window.__opened = "";
    window.open = (url) => { window.__opened = String(url); return { closed: false }; };
    document.querySelector("#quote form").requestSubmit();
    return JSON.stringify({ opened: decodeURIComponent(window.__opened), status: document.querySelector(".status")?.textContent || "" });
  })()`));

  report.pages.languageMemory = JSON.parse(await evaluate(call, `(() => {
    const link = document.querySelector(".desktop-nav [data-lang='ar']");
    return JSON.stringify({ href: link.href, stored: localStorage.getItem("eu-lang") });
  })()`));

  for (const locale of ["ar", "en"]) {
    await open(call, `${origin}/${locale}/`);
    for (const width of [360, 390, 768, 1024, 1440]) {
      await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await new Promise((resolve) => setTimeout(resolve, 200));
      const metrics = JSON.parse(await evaluate(call, `JSON.stringify({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        dir: document.documentElement.dir,
        desktopNav: getComputedStyle(document.querySelector(".desktop-nav")).display,
        menu: getComputedStyle(document.querySelector(".menu-btn")).display,
        callFab: getComputedStyle(document.querySelector(".fab-call")).display
      })`));
      report.overflow.push({ locale, width, ...metrics });
      if ([360, 768, 1440].includes(width)) {
        const shot = await call("Page.captureScreenshot", { format: "png" });
        const file = path.join(shots, `${locale}-${width}.png`);
        await writeFile(file, Buffer.from(shot.data, "base64"));
        report.shots.push(file);
      }
    }
  }

  report.console = messages;
  report.failed = [...new Set(failed)];
  console.log(JSON.stringify(report, null, 2));
} finally {
  browser.kill();
}
