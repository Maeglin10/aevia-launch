import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
async function pos(neutraliser) {
  const p = await ctx.newPage();
  if (neutraliser) await p.addInitScript(() => {
    const mark = () => { for (const e of document.querySelectorAll("button, a, [role=button]")) e.dataset.cibleAgrandie = "1"; };
    document.addEventListener("DOMContentLoaded", mark);
    setTimeout(mark, 0); setTimeout(mark, 50); setTimeout(mark, 200);
  });
  await p.goto(`${BASE}/templates/${theme}/${route}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(4600);
  const r = await p.evaluate(() => [...document.querySelectorAll("h1,h2,h3,p,li,span,img")].map((e) => {
    const b = e.getBoundingClientRect();
    return { t: (e.textContent ?? "").trim().slice(0, 24), l: Math.round(b.left), y: Math.round(b.top) };
  }));
  await p.close();
  return r;
}
const a = await pos(true), c = await pos(false);
for (let i = 0; i < Math.min(a.length, c.length); i++) {
  if (a[i].l !== c[i].l || a[i].y !== c[i].y) console.log(`« ${a[i].t} »  ${a[i].l},${a[i].y} → ${c[i].l},${c[i].y}`);
}
await b.close();
