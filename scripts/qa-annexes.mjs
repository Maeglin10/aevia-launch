/*
  Les pages annexes du catalogue, mesurées après les changements globaux.

    node scripts/qa-annexes.mjs [--parallele 4] [--par-theme 3]

  Mille trois cent soixante-dix-neuf pages vivent sous les thèmes — la carte,
  l'atelier, les mentions légales, le contact. Elles n'avaient pas été remesurées
  depuis que les passes globales touchent le contact, le copyright et la
  typographie de tout le catalogue.

  On y cherche ce qu'un visiteur subirait : une page qui ne charge pas, une
  erreur JavaScript, un défilement horizontal, ou le nom d'une autre entreprise
  que la sienne.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://127.0.0.1:3000";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const PARALLELE = Number(arg("parallele", 4));
const PAR_THEME = Number(arg("par-theme", 3));
const SORTIE = arg("sortie", "/tmp/annexes");
fs.mkdirSync(SORTIE, { recursive: true });

const FORM = {
  businessName: "Ateliers Vidal & Fils", businessType: "couvreur",
  tagline: "Zinc, ardoise et tuile plate depuis 1974", city: "Annecy",
  brandColor: "#7c3aed", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93",
};
const PROFIL = {
  services: [{ name: "Réfection complète de toiture", price: "à partir de 9 400 €", description: "Dépose, charpente vérifiée." }],
  menu: [{ name: "Réfection complète de toiture", price: "9 400 €", category: "Toiture" }],
  legal: { companyAddress: "14 route des Creuses, 74000 Annecy", companyName: "Ateliers Vidal & Fils" },
  reputation: { featuredReviews: [{ author: "Hélène Brunet", text: "Toiture refaite en huit jours.", rating: 5 }] },
};

const RACINE = path.join(process.cwd(), "app/templates");
const PAGES = [];
for (const t of fs.readdirSync(RACINE).filter((d) => /^impact-\d+$/.test(d)).sort()) {
  const annexes = fs.readdirSync(path.join(RACINE, t), { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(RACINE, t, e.name, "page.tsx")))
    .map((e) => e.name);
  for (const a of annexes.slice(0, PAR_THEME)) PAGES.push([t, a]);
}
console.log(`${PAGES.length} pages annexes à mesurer (${PAR_THEME} par thème au plus)`);

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
const sessions = new Map();

async function sessionDe(theme) {
  if (sessions.has(theme)) return sessions.get(theme);
  const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...FORM, template: theme } }) });
  const { sessionId } = await r.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ businessProfile: PROFIL }) });
  sessions.set(theme, sessionId);
  return sessionId;
}

const fiches = [];
let curseur = 0;
async function travailleur() {
  while (curseur < PAGES.length) {
    const [theme, annexe] = PAGES[curseur++];
    const defauts = [];
    try {
      const sid = await sessionDe(theme);
      const page = await ctx.newPage();
      const erreurs = [];
      page.on("pageerror", (e) => erreurs.push(String(e).slice(0, 100)));
      await page.goto(`${BASE}/templates/${theme}/${annexe}?session=${sid}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(2600);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
      });
      const vu = await page.evaluate(() => {
        const t = (document.body.textContent ?? "").replace(/\s+/g, " ");
        return { longueur: t.length, nom: t.includes("Ateliers Vidal"),
          deCote: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
          erreur: /couldn.t load|Application error|404|introuvable/i.test(t.slice(0, 160)) };
      });
      if (erreurs.length) defauts.push(`erreur JS: ${erreurs[0]}`);
      if (vu.erreur || vu.longueur < 300) defauts.push("page vide ou en erreur");
      if (vu.deCote) defauts.push("défile de côté");
      if (!vu.nom && vu.longueur >= 300) defauts.push("nom du client absent");
      await page.close();
    } catch (e) {
      defauts.push(`plantage: ${String(e).slice(0, 70)}`);
    }
    fiches.push({ page: `${theme}/${annexe}`, defauts });
    if (defauts.length) console.log(`${String(fiches.length).padStart(4)}/${PAGES.length} ${theme}/${annexe} ✗ ${defauts.join(" · ").slice(0, 110)}`);
    else if (fiches.length % 50 === 0) console.log(`${String(fiches.length).padStart(4)}/${PAGES.length} …`);
  }
}
await Promise.all(Array.from({ length: PARALLELE }, travailleur));
await navigateur.close();

const casses = fiches.filter((f) => f.defauts.length);
fs.writeFileSync(path.join(SORTIE, "resultat.json"), JSON.stringify({ total: fiches.length, casses }, null, 1));
console.log(`\n${fiches.length} pages · ${casses.length} avec au moins un défaut`);
