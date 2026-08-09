// Les pages annexes tiennent-elles debout, et portent-elles le nom du client ?
//
//   node scripts/qa-sous-pages.mjs
//
// Un thème ne se limite pas à son accueil : la carte, le contact, l'atelier,
// les réalisations. Quatre cent quarante-six pages annexes que personne n'avait
// ouvertes avec une session — c'est là qu'on a trouvé cent cinquante et un
// en-têtes au nom d'une autre entreprise.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ROOT = path.join(process.cwd(), "app/templates");

/* Toutes les pages annexes, hors pages légales (vérifiées ailleurs). */
const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);
const pages = [];
for (const theme of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, theme);
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    if (!entree.isDirectory() || LEGALES.has(entree.name)) continue;
    if (fs.existsSync(path.join(dossier, entree.name, "page.tsx"))) pages.push({ theme, route: entree.name });
  }
}

const args = process.argv.slice(2);
let choisies = pages;
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  choisies = pages.filter((_, i) => i % n === k);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

/* Une session par thème : inutile d'en créer une par page annexe. */
const sessions = new Map();
async function sessionPour(theme) {
  if (sessions.has(theme)) return sessions.get(theme);
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy", email: "c@vidal.fr", phone: "04 50 11 22 33",
      template: theme,
    } }),
  });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");
  sessions.set(theme, sessionId);
  return sessionId;
}

for (const { theme, route } of choisies) {
  let fiche = { theme, route, plante: false, marque: true };
  try {
    const sid = await sessionPour(theme);
    const p = await ctx.newPage();
    const erreurs = [];
    p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 70)));
    await p.goto(`${BASE}/templates/${theme}/${route}?session=${sid}`, { waitUntil: "domcontentloaded", timeout: 30000 });

    await p.waitForTimeout(3200);
    const d = await p.evaluate(() => {
      const texte = (document.body.textContent ?? "").replace(/\s+/g, " ");
      const entete = document.querySelector("header, nav");
      return { texte: texte.slice(0, 600), entete: (entete?.textContent ?? "").replace(/\s+/g, " ").slice(0, 120) };
    });
    await p.close();
    const plante = erreurs.length > 0 || /couldn.t load|Application error/i.test(d.texte);
    /* L'en-tête d'une page annexe doit porter le nom du client, pas celui du modèle. */
    const marque = d.entete.length === 0 || d.entete.includes("Vidal");
    fiche = { theme, route, plante, marque, erreur: erreurs[0], entete: d.entete.slice(0, 50) };
  } catch (e) {
    fiche = { theme, route, plante: true, marque: true, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  if (fiche.plante) console.log(`${theme}/${route} PLANTE — ${fiche.erreur ?? "message à l'écran"}`);
  else if (!fiche.marque) console.log(`${theme}/${route} en-tête sans le nom du client : « ${fiche.entete} »`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
console.log(`\n${fiches.length} pages annexes · ${fiches.filter((f) => f.plante).length} qui plantent · ${fiches.filter((f) => !f.marque).length} sans le nom du client`);
