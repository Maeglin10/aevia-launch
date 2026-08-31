import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const t = process.argv[2];
await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(5000);
await p.screenshot({ path: `captures/revue/${t}-vue.png` });
console.log(await p.evaluate(() => ({
  texte: (document.body.innerText || "").slice(0, 160).replace(/\s+/g, " "),
  balises: document.body.querySelectorAll("*").length,
  img: document.querySelectorAll("img").length,
  svg: document.querySelectorAll("svg").length,
})));
await nav.close();
