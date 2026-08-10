// La zone étendue est-elle réellement cliquable ?
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}/${route}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(4600);
const out = await p.evaluate(() => {
  const res = [];
  for (const e of document.querySelectorAll("[data-cible-agrandie]")) {
    const r = e.getBoundingClientRect();
    const mx = parseFloat(getComputedStyle(e).getPropertyValue("--cible-x")) || 0;
    const my = parseFloat(getComputedStyle(e).getPropertyValue("--cible-y")) || 0;
    // Un point juste hors de la boîte, dans l'axe réellement étendu.
    const px = mx > 0 ? r.left - mx / 2 : r.left + r.width / 2;
    const py = mx > 0 ? r.top + r.height / 2 : r.top - my / 2;
    const cible = document.elementFromPoint(px, py);
    const atteint = cible === e || e.contains(cible);
    res.push({ t: ((e.textContent ?? "").trim() || e.tagName).slice(0, 18),
      boite: `${Math.round(r.width)}x${Math.round(r.height)}`,
      etendue: `${Math.round(r.width + 2 * mx)}x${Math.round(r.height + 2 * my)}`,
      atteint });
  }
  return res;
});
console.log(theme + "/" + route);
for (const o of out.slice(0, 6)) console.log(`   ${JSON.stringify(o.t)} boîte ${o.boite} → zone ${o.etendue} · atteignable hors boîte : ${o.atteint ? "OUI" : "non"}`);
console.log("   total agrandies :", out.length, "· atteignables :", out.filter((x) => x.atteint).length);
await b.close();
