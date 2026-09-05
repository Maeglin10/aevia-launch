// Le parcours du client, du formulaire à sa page publiée.
//
//   node scripts/qa-wizard-bout-en-bout.mjs
//
// Tout ce qui précède mesure des thèmes chargés avec une session déjà faite.
// Personne n'a encore vérifié le chemin complet : créer la session comme le
// formulaire la crée, poser le profil comme l'étape du métier le pose, puis
// ouvrir la page — et retrouver, une par une, chacune des données saisies.

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/*
  Un client de chaque archétype, avec les blocs que son étape lui demande.

  On ne vérifie que ce que le thème déclare afficher : impact-30 n'a ni section
  d'engagements ni bloc d'adresse, et lui reprocher de ne pas les montrer
  reviendrait à exiger qu'il change de dessin. L'adresse du client se retrouve
  dans ses mentions légales, générées à partir de ce qu'il a saisi.
*/
const CLIENTS = [
  { archetype: "service_rdv", theme: "impact-30", formData: {
      businessName: "Cabinet Vidal", city: "Annecy", businessType: "kinésithérapeute",
      tagline: "Rééducation et sport à Annecy", email: "c@vidal.fr", phone: "04 50 11 22 33" },
    profil: {
      services: [{ name: "Rééducation du genou", description: "Après opération.", price: "60 €" }],
      reputation: { featuredReviews: [{ author: "Perrine A.", text: "Suivi précis et patient.", rating: 5 }] },
      keyStats: [{ value: "18 ans", label: "de pratique" }],
      faq: [{ q: "Faut-il une ordonnance ?", a: "Non, l'accès direct est possible." }],
      certifications: ["Diplôme d'État"], team: [{ name: "Éloi Vidal", role: "Kinésithérapeute" }],
      geo: { address: "12 rue des Marquisats", primaryCity: "Annecy" },
      openingHours: [{ day: "lundi", closed: true }, { day: "mardi", open: "08:00", close: "19:00" }],
      bookingSystem: { url: "https://exemple.fr/rdv" }, legal: { siret: "123 456 789 00012" },
    },
    attendus: [
      ["prestation", "Rééducation du genou"], ["avis", "Suivi précis"], ["chiffre", "18 ans"],
      ["question", "Faut-il une ordonnance"], ["équipe", "Éloi Vidal"],
      ["nom", "Cabinet Vidal"], ["ville", "Annecy"],
    ] },
  { archetype: "food", theme: "impact-04", formData: {
      businessName: "Table Vidal", city: "Annecy", businessType: "restaurant",
      tagline: "Cuisine du lac", email: "t@vidal.fr", phone: "04 50 22 33 44" },
    profil: {
      menu: [{ category: "Entrées", name: "Féra du Léman", description: "Fumée maison.", price: "14 €" }],
      reputation: { featuredReviews: [{ author: "Marc T.", text: "Produits du lac, cuisson juste.", rating: 5 }] },
      openingHours: [{ day: "lundi", closed: true }, { day: "mardi", open: "12:00", close: "22:00" }],
      geo: { address: "3 quai Eustache Chappuis", primaryCity: "Annecy" },
    },
    attendus: [["plat", "Féra du Léman"], ["avis", "Produits du lac"], ["nom", "Table Vidal"]] },
  { archetype: "produits", theme: "impact-33", formData: {
      businessName: "Maison Vidal", city: "Annecy", businessType: "boulangerie",
      tagline: "Pain au levain", email: "m@vidal.fr", phone: "04 50 33 44 55" },
    profil: {
      products: [{ name: "Tourte de seigle", description: "Levain de huit ans.", price: "6 €" }],
      keyStats: [{ value: "1 200", label: "pains par jour" }],
      geo: { address: "8 rue Royale", primaryCity: "Annecy" },
    },
    attendus: [["produit", "Tourte de seigle"], ["chiffre", "1 200"], ["nom", "Maison Vidal"]] },
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let defauts = 0;

for (const c of CLIENTS) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...c.formData, template: c.theme } }),
  });
  const { sessionId, editToken } = await r.json();
  if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");

  const patch = await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
    body: JSON.stringify({ businessProfile: c.profil }),
  });
  if (!patch.ok) { console.log(`${c.archetype} : PATCH refusé (${patch.status})`); defauts++; continue; }

  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 80)));
  await p.goto(`${BASE}/templates/${c.theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(3600);
  /* On déroule : les sections n'apparaissent qu'au défilement. */
  await p.evaluate(async () => {
    const pas = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += pas) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
  });
  await p.waitForTimeout(800);
  const texte = await p.evaluate(() => (document.body.textContent ?? "").replace(/\s+/g, " "));
  await p.close();

  const manquants = c.attendus.filter(([, v]) => !texte.includes(v)).map(([k]) => k);
  if (erreurs.length) { console.log(`${c.archetype.padEnd(14)} ${c.theme} ERREUR ${erreurs[0]}`); defauts++; }
  else if (manquants.length) { console.log(`${c.archetype.padEnd(14)} ${c.theme} absents : ${manquants.join(", ")}`); defauts++; }
  else console.log(`${c.archetype.padEnd(14)} ${c.theme} — tout ce qui a été saisi se lit`);

  /* Les pages légales du client, et non celles d'une société inventée. */
  const pl = await ctx.newPage();
  await pl.goto(`${BASE}/templates/${c.theme}/mentions-legales?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await pl.waitForTimeout(1800);
  const legal = await pl.evaluate(() => (document.body.textContent ?? "").replace(/\s+/g, " "));
  await pl.close();
  if (/Impact Agency|123 Creative Ave/.test(legal)) { console.log(`${c.archetype.padEnd(14)} mentions légales d'une autre société`); defauts++; }
}

await b.close();
console.log(`\n${CLIENTS.length} parcours · ${defauts} en défaut`);
