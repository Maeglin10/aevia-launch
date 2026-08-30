/* Sans client, chaque thème montre-t-il une démonstration DIFFÉRENTE ?

   Un visiteur qui parcourt le catalogue ne doit pas voir la même entreprise
   inventée sur trente pages. On rend donc chaque thème SANS session — l'état
   de la vitrine — et on lit le nom porté par la barre du haut. */
import { chromium } from "playwright";
import fs from "node:fs";

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
const noms = {};
for (const t of themes) {
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(2200);
    noms[t] = await p.evaluate(() => {
      const barres = [...document.querySelectorAll("header, nav")]
        .filter((e) => e.getBoundingClientRect().top < 140 && e.getBoundingClientRect().height > 20);
      const b = barres[0];
      if (!b) return "(pas de barre)";
      const cand = [...b.querySelectorAll("span, div, a, h1, p")]
        .filter((e) => (e.innerText || "").trim().length > 1 && e.children.length <= 2)
        .sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left)[0];
      return ((cand?.innerText ?? b.innerText) || "").trim().split("\n")[0].replace(/\s+/g, " ").slice(0, 46);
    });
  } catch (e) { noms[t] = "(erreur)"; }
  await p.close();
}
await nav.close();

const parNom = new Map();
for (const [t, n] of Object.entries(noms)) {
  const cle = n.toLowerCase().replace(/\s+/g, " ").trim();
  if (!parNom.has(cle)) parNom.set(cle, []);
  parNom.get(cle).push(t);
}
const repetes = [...parNom].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
console.log(`${themes.length} thèmes rendus SANS session`);
console.log(`noms distincts : ${parNom.size}`);
console.log(`noms portés par plusieurs thèmes : ${repetes.length}`);
repetes.slice(0, 15).forEach(([n, v]) => console.log(`   « ${n} » : ${v.length} thèmes — ${v.slice(0, 8).join(", ")}`));
fs.writeFileSync("captures/contact/noms-demo.json", JSON.stringify({ noms, repetes }, null, 2));
