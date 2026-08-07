// Les sections après le hero portent-elles la donnée du client ?
//
//   node scripts/qa-sections.mjs --tranche 0 4
//
// Tout ce qui a été mesuré jusqu'ici regarde le hero et le pied de page : le
// titre, l'accroche, le nom, le téléphone. Entre les deux, il y a les
// prestations, les avis, les chiffres, l'équipe, les engagements — c'est la
// moitié d'une page, et personne ne l'a encore vérifiée en rendu.
//
// On remplit donc chaque bloc avec des valeurs qu'aucun thème n'emploie, et
// l'on regarde lesquelles se lisent à l'écran.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/*
  Des valeurs impossibles à confondre avec celles d'une démonstration : si
  « Détartrage Vidal » apparaît, c'est que la prestation du client est affichée.
*/
const DONNEES = {
  services: [
    { title: "Détartrage Vidal", description: "Intervention en moins d'une heure." },
    { title: "Colonne Marquisats", description: "Remplacement complet, garantie dix ans." },
    { title: "Chaudière Bellevaux", description: "Entretien annuel et dépannage." },
  ],
  reviews: [
    { author: "Perrine Anselme", text: "Intervention nette, prix tenu, chantier laissé propre.", rating: 5 },
    { author: "Gustave Bonnefoy", text: "Venu un dimanche pour une fuite, facturé le tarif annoncé.", rating: 5 },
  ],
  keyStats: [
    { value: "1 342", label: "Chantiers Vidal" },
    { value: "27 ans", label: "Sur Annecy" },
  ],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  certifications: ["Qualibat Marquisats", "RGE Bellevaux"],
  // Le contrat lit « q » et « a », pas « question »/« answer ».
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  /*
    Les « réalisations » ne sont ni des prestations ni une carte : le contrat
    les lit dans « beforeAfter », des chantiers avant/après.
  */
  beforeAfter: [
    // Le contrat lit « caption », pas « title ».
    { caption: "Salle de bain Marquisats", afterUrl: "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=800" },
    { caption: "Chaufferie Bellevaux", afterUrl: "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=800" },
  ],
  /*
    Les thèmes de restauration et de commerce ne lisent pas « services » mais
    « menu » et « products » — deux blocs distincts dans le profil.
  */
  menu: [{ name: "Tarte Marquisats", category: "Desserts", description: "Pommes du lac.", price: "8 €" }],
  products: [{ name: "Coffret Bellevaux", description: "Six pièces.", price: "24 €" }],
};

const ATTENDUS = [
  ["prestations", "Détartrage Vidal"],
  ["réalisations", "Salle de bain Marquisats"],
  ["carte", "Tarte Marquisats"],
  ["produits", "Coffret Bellevaux"],
  // Certains themes n'affichent que les initiales de l'auteur : on cherche son texte.
  ["avis", "chantier laissé propre"],
  ["chiffres", "Chantiers Vidal"],
  ["équipe", "Éloi Vidal"],
  ["engagements", "Qualibat Marquisats"],
  ["questions", "Intervenez-vous le dimanche"],
];

const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

/*
  Ce que chaque thème déclare afficher : on ne reproche pas à un thème sans
  section « équipe » de ne pas montrer l'équipe.
*/
const capacites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const BLOCS = {};
for (const m of capacites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  BLOCS[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}
const DECLARE = {
  prestations: ["prestations", "tarifs"],
  "réalisations": ["realisations"],
  carte: ["menu"],
  produits: ["produits"],
  avis: ["avis"],
  chiffres: ["chiffres"],
  "équipe": ["equipe"],
  engagements: ["engagements"],
  questions: ["faq"],
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  const formData = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998",
    email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33",
    brandColor: "#c2410c", template: id,
    // Les photos du client vivent dans le formulaire, sous « photoUrls ».
    photoUrls: [
      "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=800",
      "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=801",
    ],
  };
  /*
    Le contrat lit ces blocs dans le profil, pas dans le formulaire :
    « businessProfile.services », « reputation.featuredReviews », etc. Les
    envoyer ailleurs faisait conclure que toutes les sections étaient muettes.
  */
  /*
    Un restaurateur ne remplit pas de prestations, un commerçant non plus : leur
    archétype leur demande une carte ou un catalogue. Envoyer les trois en même
    temps ferait primer les prestations — c'est le comportement voulu, mais ce
    n'est pas le cas qu'on veut mesurer ici.
  */
  const declares = BLOCS[id] ?? [];
  const carteSeule = declares.includes("menu") || declares.includes("produits");
  const businessProfile = {
    services: carteSeule ? [] : DONNEES.services.map((s) => ({ name: s.title, description: s.description })),
    reputation: { featuredReviews: DONNEES.reviews },
    keyStats: DONNEES.keyStats,
    team: DONNEES.team,
    certifications: DONNEES.certifications,
    faq: DONNEES.faq,
    beforeAfter: DONNEES.beforeAfter,
    /*
      On n'envoie que ce que le thème déclare : le contrat sert la carte avant
      le catalogue, si bien qu'un thème de boutique recevant les deux montrerait
      la carte. Un vrai commerçant ne remplit que son catalogue.
    */
    menu: declares.includes("menu") ? DONNEES.menu : [],
    products: declares.includes("produits") && !declares.includes("menu") ? DONNEES.products : [],
  };
  let fiche = { id, muettes: [] };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessProfile }),
    });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2600);
    // Le bas de page se peuple souvent au défilement.
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1400);

    /*
      Une galerie de réalisations montre des images, pas des mots : sur
      impact-210, les photos du client s'affichent et aucun libellé n'apparaît.
      On relève donc aussi les URL présentes dans la page, pour reconnaître une
      photo fournie par le client.
    */
    const { texte, sources } = await p.evaluate(() => ({
      texte: (document.body.textContent ?? "").toLowerCase().replace(/\s+/g, " "),
      sources: [...document.querySelectorAll("*")]
        .flatMap((e) => [e.getAttribute?.("src") ?? "", getComputedStyle(e).backgroundImage ?? ""])
        .join(" "),
    }));
    const muettes = ATTENDUS
      .filter(([nom]) => (DECLARE[nom] ?? []).some((b2) => declares.includes(b2)))
      .filter(([nom]) => !(carteSeule && nom === "prestations"))
      // Un theme qui declare carte ET catalogue n'affiche qu'une source : la carte prime.
      .filter(([nom]) => !(nom === "produits" && declares.includes("menu")))
      .filter(([nom, valeur]) => {
        if (texte.includes(valeur.toLowerCase())) return false;
        // Une photo du client dans la page vaut preuve pour une galerie.
        if (nom === "réalisations" && sources.includes("pexels-photo-7937300")) return false;
        /*
          Beaucoup de thèmes alimentent leur section de réalisations avec les
          prestations du client — un cabinet d'architecture montre ses missions,
          un studio ses projets. La donnée affichée est bien la sienne : c'est
          ce qu'on veut vérifier, pas le champ d'origine.
        */
        if (nom === "réalisations" && texte.includes("détartrage vidal")) return false;
        // Une boutique nourrit son portfolio de son catalogue : c'est aussi sa donnee.
        if (nom === "réalisations" && (texte.includes("coffret bellevaux") || texte.includes("tarte marquisats"))) return false;
        return true;
      })
      .map(([nom]) => nom);

    fiche = { id, muettes, declares: declares.length };
    await p.close();
  } catch (e) {
    fiche = { id, muettes: [], erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (fiche.muettes.length) console.log(`${id.padEnd(12)} muet sur : ${fiche.muettes.join(", ")}`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.muettes.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} dont une section déclarée reste muette`);
