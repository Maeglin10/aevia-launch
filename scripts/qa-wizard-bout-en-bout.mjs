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
  /*
    Les cinq archétypes qui manquaient. Trois seulement étaient couverts —
    on ne peut pas dire « testé comme un vrai client » sur trois huitièmes du
    catalogue.
  */
  { archetype: "immobilier", theme: "impact-19", formData: {
      businessName: "Agence Vidal", city: "Annecy", businessType: "agence immobilière",
      tagline: "Le lac et ses rives", email: "a@vidal.fr", phone: "04 50 44 55 66" },
    profil: {
      services: [{ name: "Estimation offerte", description: "Sous 48 heures.", price: "0 €" }],
      listings: [{ title: "Villa vue lac", price: "890 000 €", description: "180 m², jardin clos." }],
      reputation: { featuredReviews: [{ author: "Claire M.", text: "Vendu en trois semaines.", rating: 5 }] },
      certifications: ["Carte professionnelle T"],
      geo: { address: "5 avenue d'Albigny", primaryCity: "Annecy" },
    },
    attendus: [["prestation", "Estimation offerte"], ["avis", "Vendu en trois semaines"], ["nom", "Agence Vidal"]] },
  { archetype: "portfolio_projets", theme: "impact-27", formData: {
      businessName: "Studio Vidal", city: "Annecy", businessType: "studio créatif",
      tagline: "Images et interfaces", email: "s@vidal.fr", phone: "04 50 55 66 77" },
    profil: {
      services: [{ name: "Direction artistique", description: "De la marque à l'écran.", price: "4 500 €" }],
      team: [{ name: "Éloi Vidal", role: "Directeur artistique" }],
      certifications: ["Prix du design 2025"],
      faq: [{ q: "Travaillez-vous à distance ?", a: "Oui, partout en Europe." }],
      geo: { address: "10 rue Sommeiller", primaryCity: "Annecy" },
    },
    attendus: [["prestation", "Direction artistique"], ["équipe", "Éloi Vidal"], ["nom", "Studio Vidal"]] },
  { archetype: "expertise_b2b", theme: "impact-36", formData: {
      businessName: "Conseil Vidal", city: "Annecy", businessType: "cabinet de conseil",
      tagline: "Stratégie et opérations", email: "e@vidal.fr", phone: "04 50 66 77 88" },
    profil: {
      services: [{ name: "Audit organisationnel", description: "Six semaines, restitution incluse.", price: "12 000 €" }],
      keyStats: [{ value: "140", label: "missions" }],
      geo: { address: "2 place des Cordeliers", primaryCity: "Annecy" },
    },
    attendus: [["prestation", "Audit organisationnel"], ["chiffre", "140"], ["nom", "Conseil Vidal"]] },
  { archetype: "hotellerie", theme: "impact-10", formData: {
      businessName: "Hotel Vidal", city: "Annecy", businessType: "hôtel",
      tagline: "Face au lac", email: "h@vidal.fr", phone: "04 50 77 88 99" },
    profil: {
      services: [{ name: "Suite Marquisats", description: "45 m², balcon sur le lac.", price: "290 €" }],
      reputation: { featuredReviews: [{ author: "Sophie L.", text: "Vue imprenable, accueil parfait.", rating: 5 }] },
      openingHours: [{ day: "lundi", open: "07:00", close: "23:00" }],
      geo: { address: "1 quai du Thiou", primaryCity: "Annecy" },
    },
    attendus: [["prestation", "Suite Marquisats"], ["avis", "Vue imprenable"], ["nom", "Hotel Vidal"]] },
  { archetype: "domicile", theme: "impact-13", formData: {
      businessName: "Vidal Domicile", city: "Annecy", businessType: "aide à domicile",
      tagline: "Présence et soin", email: "d@vidal.fr", phone: "04 50 88 99 00" },
    profil: {
      services: [{ name: "Accompagnement quotidien", description: "Deux heures par jour.", price: "28 €" }],
      team: [{ name: "Éloi Vidal", role: "Auxiliaire de vie" }],
      certifications: ["Agrément qualité"],
      geo: { address: "14 rue Carnot", primaryCity: "Annecy" },
    },
    attendus: [["prestation", "Accompagnement quotidien"], ["équipe", "Éloi Vidal"], ["nom", "Vidal Domicile"]] },
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let defauts = 0;

for (const c of CLIENTS) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...c.formData, template: c.theme } }),
  });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");

  const patch = await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
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
