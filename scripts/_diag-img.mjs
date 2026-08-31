import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 1200 } })).newPage();
const reps = [];
p.on("response", (r) => { if (/pexels|unsplash|_next\/image/.test(r.url())) reps.push(`${r.status()} ${r.url().slice(0, 90)}`); });
for (const t of process.argv.slice(2)) {
  reps.length = 0;
  await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForTimeout(3000);
  const n = await p.evaluate(() => ({
    img: document.querySelectorAll("img").length,
    avecSrc: [...document.querySelectorAll("img")].filter((i) => i.currentSrc || i.src).length,
    fond: [...document.querySelectorAll("*")].filter((e) => /url\(/.test(getComputedStyle(e).backgroundImage)).length,
  }));
  console.log(`${t} :: ${JSON.stringify(n)} · ${reps.length} réponses image`);
  reps.slice(0, 3).forEach((r) => console.log("     " + r));
}
await nav.close();
