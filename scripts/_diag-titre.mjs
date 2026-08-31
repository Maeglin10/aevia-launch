import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
for (const t of process.argv.slice(2)) {
  await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForTimeout(3000);
  console.log(t, JSON.stringify(await p.evaluate(() => {
    const h = document.querySelector("h1"); if (!h) return null;
    const b = h.getBoundingClientRect();
    return { couleur: getComputedStyle(h).color, haut: Math.round(b.top), texte: (h.innerText||"").slice(0,34) };
  })));
}
await nav.close();
