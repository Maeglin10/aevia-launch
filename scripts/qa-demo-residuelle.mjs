// Que reste-t-il de la démonstration quand le client a tout rempli ?
//
//   node scripts/qa-demo-residuelle.mjs --tranche 0 4
//
// Les vérifications précédentes partaient du contrat : telle section lit-elle
// telle fonction. Elles ne voient donc que ce qui est déjà câblé, et ratent une
// section entière restée en dur — la carte d'impact-99, les bureaux
// d'impact-14, trouvés à la main faute d'instrument.
//
// Celui-ci part de la page, pas du code : on donne au client de quoi remplir
// chaque bloc, et l'on relève ce que la démonstration continue d'afficher. Un
// nom de plat, une ville, un prix qui survivent à un profil complet désignent
// une section que le client ne peut pas s'approprier.
//
// Ce qui ne compte pas, par dessein : les textes d'ambiance du thème (une
// accroche, un manifeste), les articles de blog, les libellés de navigation.
// On ne relève que les LISTES — ce qu'un client remplit au formulaire.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const RACINE = path.join(process.cwd(), "app/templates");
const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);

/*
  Le client remplit tout ce que le contrat sait lire. S'il reste de la
  démonstration après ça, c'est qu'une section ne la lit pas.
*/
const PROFIL = {
  services: [
    { name: "Détartrage Vidal", description: "Intervention en moins d'une heure.", price: "45 €" },
    { name: "Colonne Marquisats", description: "Remplacement complet, garantie dix ans.", price: "1 250 €" },
    { name: "Chaudière Bellevaux", description: "Entretien annuel et dépannage.", price: "180 €" },
  ],
  menu: [
    { name: "Tarte Marquisats", category: "Desserts", price: "8 €", description: "Pommes du lac." },
    { name: "Féra du Léman", category: "Poissons", price: "26 €", description: "Beurre blanc." },
  ],
  products: [{ name: "Coffret Bellevaux", price: "24 €", description: "Six pièces." }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  keyStats: [{ value: "1 342", label: "Chantiers Vidal" }, { value: "27 ans", label: "Sur Annecy" }],
  certifications: ["Qualibat Marquisats", "RGE Bellevaux"],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  beforeAfter: [{ caption: "Salle de bain Marquisats" }],
  reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Intervention nette, chantier laissé propre.", rating: 5 }] },
  geo: { address: "12 rue des Marquisats, 74000 Annecy" },
  openingHours: [{ day: "lundi", closed: true }, { day: "mardi", open: "05:55", close: "23:45" }],
};

/* Les listes du fichier, et la première valeur textuelle de chaque entrée. */
function temoinsDeDemonstration(src) {
  const out = [];
  const re = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*\[\s*\{/g;
  for (const m of [...src.matchAll(re)]) {
    const brut = m[1];
    /*
      Une liste câblée garde sa démonstration sous `X_DEMO_ANNEXE` et rend `X`.
      Sans reconnaître ce nom, l'instrument cesse de regarder les pages qu'on
      vient de corriger — et annonce zéro parce qu'il ne mesure plus rien.
      C'est précisément ainsi qu'un instrument ment.
    */
    const nom = brut.replace(/_DEMO_ANNEXE$/, "");
    // Seules les listes rendues comptent : une constante morte n'est pas un défaut.
    if (!new RegExp(`\\{\\s*${nom}\\s*\\.(map|slice)|${nom}\\.(map|slice)\\(`).test(src)) continue;
    /*
      Une liste déjà câblée n'est plus un défaut, même si son témoin réapparaît
      ailleurs dans la page : « FWA of the Day » vit aussi dans une frise
      chronologique d'impact-27, « Tyrant GT » dans un paragraphe d'impact-08.
      Chercher la chaîne partout faisait déclarer fautives des sections qui
      affichent bel et bien la donnée du client — vérifié à la main sur les deux.
    */
    if (new RegExp(`\\b${nom}\\s*=\\s*resolveList\\(|function\\s+${nom}_LIVE\\b`).test(src)) continue;
    // Navigation, réseaux, colonnes de pied de page : au thème, par dessein.
    if (/^(NAV|LINKS?|SOCIAL|FOOTER|MENU_PAGES|PAGES|ROUTES|positions|socials|footerCols|navItems)/i.test(nom)) continue;
    // Les articles de blog ne sont pas remplis au formulaire.
    if (/BLOG|POSTS|JOURNAL|ARTICLES/i.test(nom)) continue;

    const debut = m.index + m[0].length - 1;
    const bloc = src.slice(debut, debut + 900);
    const v = bloc.match(/(?:name|title|label|q|author|caption|city)\s*:\s*['"`]([^'"`\n]{8,50})['"`]/);
    if (v && !/\$\{|clientC|client[A-Z]/.test(v[1])) out.push({ nom, temoin: v[1] });
  }
  return out;
}

const pages = [];
for (const theme of fs.readdirSync(RACINE).filter((d) => d.startsWith("impact-")).sort()) {
  for (const e of fs.readdirSync(path.join(RACINE, theme), { withFileTypes: true })) {
    if (!e.isDirectory() || LEGALES.has(e.name)) continue;
    const f = path.join(RACINE, theme, e.name, "page.tsx");
    if (!fs.existsSync(f)) continue;
    const temoins = temoinsDeDemonstration(fs.readFileSync(f, "utf8"));
    if (temoins.length) pages.push({ theme, route: e.name, temoins });
  }
}

const args = process.argv.slice(2);
let choisies = pages;
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  choisies = pages.filter((_, i) => i % n === k);
} else if (args.length) {
  choisies = pages.filter((p) => args.includes(p.theme) || args.includes(`${p.theme}/${p.route}`));
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const { theme, route, temoins } of choisies) {
  let fiche = { theme, route };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy", email: "contact@ateliers-vidal.fr",
        phone: "04 50 11 22 33", template: theme,
      } }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessProfile: PROFIL }),
    });

    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(3400);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1200);
    const texte = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
    await p.close();

    const restants = temoins.filter((t) => texte.includes(t.temoin));
    fiche = { theme, route, restants: restants.map((t) => `${t.nom}: ${t.temoin}`) };
  } catch (e) {
    fiche = { theme, route, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  if (fiche.restants?.length) console.log(`${theme}/${route}  démonstration restée : ${fiche.restants.slice(0, 3).join(" · ")}`);
  if (fiche.erreur) console.log(`${theme}/${route}  ERREUR ${fiche.erreur}`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.restants?.length);
console.log(`\n${fiches.length} pages · ${ko.length} affichent encore une liste de démonstration · ${ko.reduce((n, f) => n + f.restants.length, 0)} listes`);
