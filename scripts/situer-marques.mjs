/*
  Où, exactement, la marque de démonstration s'affiche-t-elle ?

    node scripts/situer-marques.mjs impact-08 impact-102 …
    node scripts/situer-marques.mjs --tous          (lit /tmp/contacts/resultat.json)

  Cent vingt et un accueils portent encore le nom de la démonstration à côté de
  celui du client. Savoir « il est là » ne suffit pas à corriger : selon qu'il
  s'agisse d'un pied de page, d'un témoignage ou d'un mot ordinaire du français
  (« Terre », « Bureau », « Atlas »), la conduite à tenir est opposée. On relève
  donc la phrase autour et la balise qui la porte.
*/
import fs from "node:fs";
import { chromium } from "playwright";

const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));
const BASE = process.env.AUDIT_BASE ?? "http://127.0.0.1:3000";

let themes = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (process.argv.includes("--tous")) {
  const d = JSON.parse(fs.readFileSync("/tmp/contacts/resultat.json", "utf8"));
  themes = d.casses.filter((f) => f.fuites.some((x) => x.startsWith("marque"))).map((f) => f.page.split("/")[0]);
}

const FORM = {
  businessName: "Ateliers Vidal & Fils", businessType: "couvreur",
  tagline: "Zinc, ardoise et tuile plate depuis 1974", city: "Annecy",
  brandColor: "#7c3aed", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93",
};

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
const releves = [];
let curseur = 0;

async function travailleur() {
  while (curseur < themes.length) {
    const theme = themes[curseur++];
    const marque = MARQUES[theme];
    if (!marque) continue;
    try {
      const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...FORM, template: theme } }) });
      const { sessionId } = await r.json();
      const page = await ctx.newPage();
      await page.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(2400);
      await page.waitForFunction(() => (document.body.textContent ?? "").includes("Ateliers Vidal"), { timeout: 6000 }).catch(() => {});
      const trouves = await page.evaluate(async (marque) => {
        const vus = [];
        const bas = marque.toLowerCase();
        const relever = () => {
          const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
            const t = n.nodeValue ?? "";
            const i = t.toLowerCase().indexOf(bas);
            if (i < 0) continue;
            const e = n.parentElement;
            if (!e || e.closest("style,script")) continue;
            const chemin = [];
            for (let x = e; x && x !== document.body; x = x.parentElement) {
              chemin.unshift(x.tagName.toLowerCase() + (x.className && typeof x.className === "string" ? "." + x.className.trim().split(/\s+/)[0] : ""));
              if (chemin.length >= 3) break;
            }
            const cle = chemin.join(">") + "|" + t.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, " ").trim();
            if (!vus.includes(cle)) vus.push(cle);
          }
        };
        relever();
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
          relever();
        }
        return vus.slice(0, 4);
      }, marque);
      releves.push({ theme, marque, trouves });
      console.log(`${theme} · « ${marque} »`);
      for (const t of trouves) console.log(`    ${t}`);
      await page.close();
    } catch (e) {
      console.log(`${theme} ✗ ${String(e).slice(0, 80)}`);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, travailleur));
await navigateur.close();
fs.writeFileSync("/tmp/marques-situees.json", JSON.stringify(releves, null, 1));
console.log(`\n${releves.length} thèmes situés → /tmp/marques-situees.json`);
