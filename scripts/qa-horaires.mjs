// Les horaires du client s'affichent-ils là où le thème en montre ?
//
//   node scripts/qa-horaires.mjs --tranche 0 4
//
// Cent dix-huit thèmes affichent des jours et des heures ; vingt-sept
// seulement les tirent de ce que le client a saisi. Les autres gardent
// « Lundi 9h–18h » de leur démonstration — un cabinet fermé le lundi affiche
// donc qu'il ouvre, et son téléphone sonne pour rien.
//
// On donne au client des horaires reconnaissables entre mille — ouverture à
// 5 h 55, fermeture à 23 h 45 — et l'on regarde si la page les porte.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const HORAIRES = JOURS.map((day, i) => (i === 0
  ? { day, closed: true }
  : { day, open: "05:55", close: "23:45" }));

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, montre: false, porte: false };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy", template: id,
      } }),
    });
    const { sessionId, editToken } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile: { openingHours: HORAIRES } }),
    });

    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(2600);
    /*
      On déroule la page : les horaires vivent presque toujours en pied de page
      ou dans la section contact, hors du premier écran.
    */
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1400);
    /*
      Ce que la page montre, et non ce qu'elle transporte : le JSON-LD et les
      données d'hydratation vivent dans des <script> et contiennent des heures
      ; les compter faisait passer trois thèmes sains pour fautifs.
    */
    const texte = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("body *")) {
        if (e.children.length > 0) continue;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(e.tagName)) continue;
        out.push((e.textContent ?? "").replace(/\s+/g, " "));
      }
      return out.join(" · ").toLowerCase();
    });
    await p.close();

    // Le thème parle-t-il d'horaires ? Deux jours de la semaine suffisent à le dire.
    /*
      Un jour et une heure doivent se toucher pour annoncer une ouverture.
      « Formule brunch 10h–14h … sur réservation dès le jeudi » contient les
      deux à trente mots d'écart et ne dit rien des horaires du commerce.
    */
    const proches = new RegExp(
      `\\b(${JOURS.join("|")}|lun|mar|mer|jeu|ven|sam|dim)\\b[^·]{0,24}?\\d{1,2}\\s?[h:]`
      + `|\\d{1,2}\\s?[h:]\\d{0,2}[^·]{0,24}?\\b(${JOURS.join("|")})\\b`,
      "i",
    );
    const montre = proches.test(texte) || /\bhoraires\b|ouvert du|opening hours/.test(texte);
    const porte = /5\s*h\s*55|05\s*:\s*55|5:55/.test(texte) && /23\s*h\s*45|23\s*:\s*45|23:45/.test(texte);
    fiche = { id, montre, porte };
  } catch (e) {
    fiche = { id, montre: false, porte: true, erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (fiche.montre && !fiche.porte) console.log(`${id.padEnd(12)} affiche des horaires, pas ceux du client`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.montre && !f.porte);
console.log(`\n${fiches.length} thèmes · ${fiches.filter((f) => f.montre).length} affichent des horaires · ${ko.length} en démonstration`);
