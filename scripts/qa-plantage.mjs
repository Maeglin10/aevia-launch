// La page tient-elle debout avec les données d'un client ?
//
//   node scripts/qa-plantage.mjs --tranche 0 4
//
// Sur impact-37, la page affichait « This page couldn't load » dès que le client
// donnait une accroche : la condition testait « c?.heroSubline », la branche
// lisait « c.heroSubline ». Sans contenu généré, la lecture échouait et tout
// l'écran disparaissait. Le pire défaut possible — le client remplit le wizard
// et n'obtient rien.
//
// On charge donc chaque thème avec une session ordinaire et l'on écoute ce que
// le navigateur signale, plutôt que de relire le code en espérant voir le
// point d'interrogation manquant.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
const fiches = [];

for (const id of ids) {
  const formData = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998",
    email: `contact@${id}.fr`, phone: "04 50 11 22 33", brandColor: "#c2410c",
    services: [{ title: "Dépannage 24h/24", description: "Fuite, panne, urgence." }],
    template: id,
  };
  let fiche = { id, plante: false };
  const erreurs = [];
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId, editToken } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");
    /*
      Le profil aussi, et pas seulement le formulaire : les passes qui
      réécrivent la page — horaires, marque, réservation — ne se déclenchent
      qu'avec ces données-là. Sans elles, la mesure ne voyait pas les quatre
      thèmes que ces passes faisaient disparaître.
    */
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile: {
        openingHours: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
          .map((day, i) => (i === 0 ? { day, closed: true } : { day, open: "05:55", close: "23:45" })),
        services: [{ name: "Dépannage d'urgence", description: "Une heure sur place.", price: "90 €" }],
        bookingSystem: { url: "https://exemple.fr/rendez-vous" },
        geo: { address: "12 rue des Marquisats", primaryCity: "Annecy" },
        legal: { siret: "123 456 789 00012" },
        paymentMethods: ["Carte bancaire", "Virement"],
      } }),
    });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 90)));
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(3600);
    const texte = await p.evaluate(() => (document.body.innerText ?? "").slice(0, 400));
    /*
      Deux signes : le message d'erreur de Next, et une page qui ne montre
      presque rien. Une page vide n'est pas toujours un plantage — certains
      thèmes ouvrent sur une animation — mais méritait d'être signalée.
    */
    const message = /couldn.t load|Application error|Unhandled Runtime/i.test(texte);
    fiche = { id, plante: message || erreurs.length > 0, vide: texte.trim().length < 40, erreur: erreurs[0] };
    await p.close();
  } catch (e) {
    fiche = { id, plante: true, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  if (fiche.plante) console.log(`${id.padEnd(12)} PLANTE — ${fiche.erreur ?? "message d'erreur à l'écran"}`);
  else if (fiche.vide) console.log(`${id.padEnd(12)} page presque vide`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
console.log(`\n${fiches.length} thèmes · ${fiches.filter((f) => f.plante).length} qui plantent · ${fiches.filter((f) => !f.plante && f.vide).length} presque vides`);
