import { chromium } from "playwright";
const ids = process.argv.slice(2);
const b = await chromium.launch();
for (const ecran of [{ n: "tel", w: 390, h: 844, m: true }, { n: "ordi", w: 1440, h: 900, m: false }]) {
  const ctx = await b.newContext({ viewport: { width: ecran.w, height: ecran.h }, isMobile: ecran.m, hasTouch: ecran.m });
  for (const id of ids) {
    const p = await ctx.newPage();
    await p.goto(`http://localhost:3000/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(2600);
    const d = await p.evaluate((largeur) => {
      const out = [];
      for (const e of document.querySelectorAll("*")) {
        if (e.children.length > 0) continue;
        const t = (e.textContent ?? "").trim();
        if (t.length < 3) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 8 || r.height < 6 || r.top > 2400) continue;
        if (r.right > largeur + 20 || e.scrollWidth > e.clientWidth + 12) out.push(t.slice(0, 22));
      }
      return [...new Set(out)].slice(0, 2);
    }, ecran.w);
    await p.close();
    if (d.length) console.log(`${id.padEnd(12)} ${ecran.n.padEnd(5)} SANS SESSION : ${d.join(" · ")}`);
  }
  await ctx.close();
}
await b.close();
