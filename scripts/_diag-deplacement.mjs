// La passe tactile déplace-t-elle quelque chose ? On compare les positions
// de tous les blocs de texte, passe désactivée puis activée.
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

async function positions(neutraliser) {
  const p = await ctx.newPage();
  if (neutraliser) {
    // On empêche la passe d'agir : elle saute ce qui est déjà marqué.
    await p.addInitScript(() => {
      const mark = () => { for (const e of document.querySelectorAll("button, a, [role=button]")) e.dataset.cibleAgrandie = "1"; };
      document.addEventListener("DOMContentLoaded", mark);
      setTimeout(mark, 0); setTimeout(mark, 50); setTimeout(mark, 200);
    });
  }
  await p.goto(`${BASE}/templates/${theme}/${route}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(4600);
  const r = await p.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll("h1,h2,h3,p,li,span,img")) {
      const t = (e.textContent ?? "").trim().slice(0, 30);
      const b = e.getBoundingClientRect();
      if (b.width === 0) continue;
      out.push(`${t}|${Math.round(b.left)},${Math.round(b.top)}`);
    }
    return { blocs: out, hauteur: document.body.scrollHeight };
  });
  await p.close();
  return r;
}

const sans = await positions(true);
const avec = await positions(false);
let bouges = 0;
for (let i = 0; i < Math.min(sans.blocs.length, avec.blocs.length); i++) {
  if (sans.blocs[i] !== avec.blocs[i]) bouges++;
}
console.log(`${theme}/${route} · blocs comparés ${Math.min(sans.blocs.length, avec.blocs.length)} · déplacés ${bouges} · hauteur ${sans.hauteur} → ${avec.hauteur}`);
await b.close();
