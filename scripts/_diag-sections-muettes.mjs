// Une section « muette » l'est-elle vraiment, ou n'existe-t-elle pas ?
//
//   node scripts/_diag-sections-muettes.mjs
//
// `qa-sections` ne charge que la page d'accueil. Il signale donc « muet » aussi
// bien la section qui affiche la démonstration à la place du client (vrai
// défaut) que la section qui n'existe pas sur l'accueil parce qu'elle vit sur
// une page annexe (pas un défaut du tout).
//
// On distingue les deux : on envoie la donnée du client, puis on regarde si la
// DÉMONSTRATION du thème est visible sur l'accueil. Si ni l'une ni l'autre n'y
// est, il n'y a pas de section à cet endroit.

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

const CIBLES = [
  ["impact-11", "equipe"], ["impact-14", "prestations"],
  ["impact-16", "prestations"], ["impact-16", "engagements"],
  ["impact-17", "equipe"], ["impact-19", "equipe"], ["impact-21", "engagements"],
  ["impact-27", "engagements"], ["impact-27", "faq"], ["impact-34", "prestations"],
  ["impact-35", "prestations"], ["impact-35", "avis"], ["impact-35", "equipe"],
  ["impact-36", "prestations"], ["impact-38", "faq"], ["impact-42", "equipe"],
  ["impact-56", "prestations"], ["impact-57", "engagements"],
];

const PROFIL = {
  services: [{ name: "Détartrage Vidal", description: "En moins d'une heure.", price: "45 €" }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  certifications: ["Qualibat Marquisats"],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui." }],
  reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Chantier laissé propre.", rating: 5 }] },
};
const PREUVE = {
  prestations: "Détartrage Vidal", equipe: "Éloi Vidal", engagements: "Qualibat Marquisats",
  faq: "Intervenez-vous le dimanche", avis: "Chantier laissé propre",
};

/*
  Un mot du vocabulaire de chaque section, tel que les thèmes l'écrivent. Sa
  présence dit qu'il y a bien une section de ce genre sur l'accueil.
*/
const VOCABULAIRE = {
  prestations: /prestation|service|offre|accompagn/i,
  equipe: /équipe|equipe|team|collaborateur|fondateur/i,
  engagements: /certifi|agrément|label|garantie|award|distinction/i,
  faq: /question|faq/i,
  avis: /avis|témoign|temoign|client dit|review/i,
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let vrais = 0, inexistantes = 0;

for (const [theme, bloc] of CIBLES) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance", template: theme,
    } }),
  });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée");
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: PROFIL }),
  });

  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForTimeout(3400);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  const texte = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  await p.close();

  const duClient = texte.includes(PREUVE[bloc]);
  const sectionPresente = VOCABULAIRE[bloc].test(texte);

  if (duClient) console.log(`${theme.padEnd(12)} ${bloc.padEnd(13)} la donnée du client s'affiche`);
  else if (sectionPresente) { vrais++; console.log(`${theme.padEnd(12)} ${bloc.padEnd(13)} DÉFAUT : section présente sur l'accueil, mais en démonstration`); }
  else { inexistantes++; console.log(`${theme.padEnd(12)} ${bloc.padEnd(13)} pas de section de ce genre sur l'accueil (elle vit ailleurs)`); }
}

await b.close();
console.log(`\n${CIBLES.length} couples · ${vrais} vrais défauts · ${inexistantes} sections absentes de l'accueil`);
