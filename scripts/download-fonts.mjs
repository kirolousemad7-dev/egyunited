import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../static-site/assets/fonts");
await mkdir(dir, { recursive: true });

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const css = await (await fetch("https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&family=Inter:wght@400;700;800&display=swap", {
  headers: { "User-Agent": ua },
})).text();

const blocks = css.split("/*").slice(1);
const want = [];
for (const block of blocks) {
  const label = block.slice(0, block.indexOf("*/")).trim();
  const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1];
  const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1];
  const url = (block.match(/url\(([^)]+)\)/) || [])[1];
  if (!family || !weight || !url) continue;
  if (family === "Cairo" && label === "arabic") {
    want.push([weight === "400" ? "cairo-arabic.woff2" : `cairo-arabic-${weight}.woff2`, url]);
  }
  if (family === "Cairo" && label === "latin") {
    want.push([weight === "400" ? "cairo-latin.woff2" : `cairo-latin-${weight}.woff2`, url]);
  }
  if (family === "Inter" && label === "latin") {
    want.push([`inter-${weight}.woff2`, url]);
  }
}

if (!want.length) {
  console.error(css.slice(0, 500));
  throw new Error("No font files matched");
}

const cache = new Map();
for (const [name, url] of want) {
  let buf = cache.get(url);
  if (!buf) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    buf = Buffer.from(await res.arrayBuffer());
    cache.set(url, buf);
  }
  await writeFile(path.join(dir, name), buf);
  console.log(name, buf.length);
}
