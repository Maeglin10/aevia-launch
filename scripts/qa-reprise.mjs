/*
  Contrôle mesuré des thèmes repris, avec les données d'un vrai client.

    node scripts/qa-reprise.mjs impact-316 impact-317 …

  Trois choses qu'une capture seule ne dit pas, et qu'on mesure donc dans le
  DOM :

  1. le contenu du client a-t-il remplacé celui de la démonstration ;
  2. quelque chose déborde-t-il horizontalement — le rognage ressemble à un
     cadrage voulu sur une image, il faut comparer les rectangles ;
  3. reste-t-il un texte illisible, une erreur de rendu, un titre vide.

  Le navigateur est celui du conteneur (`CHROME_PATH`), pas celui que
  Playwright voudrait télécharger : les versions ne coïncident pas ici.

  Les photographies ne chargent pas (le mandataire bloque les banques
  d'images). C'est voulu : une page doit se tenir sans elles.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium";
const args = process.argv.slice(2);
const sortie = args.includes("--sortie") ? args[args.indexOf("--sortie") + 1] : "/tmp/vue-reprise";
const ids = args.filter((a) => a.startsWith("impact-"));

fs.mkdirSync(sortie, { recursive: true });

/*
  Un client ordinaire mais complet : un nom un peu long, une accroche d'une
  ligne et demie, et de quoi remplir chaque section. Les valeurs sont
  reconnaissables à l'œil — c'est ce qui permet de dire si la page affiche le
  client ou la démonstration.
*/
const FORM = {
  businessName: "Ateliers Vidal & Fils",
  businessType: "couvreur",
  tagline: "Zinc, ardoise et tuile plate depuis 1974, sur toute la Haute-Savoie",
  city: "Annecy",
  mainService: "Réfection de toiture",
  benefits: ["Devis sous 48 h", "Garantie décennale", "Chantier laissé propre"],
  priceRange: "€€",
  targetAudience: "Propriétaires et syndics",
  brandColor: "#7c3aed",
  tone: "professionnel",
  template: "impact-000",
  email: "contact@ateliers-vidal.fr",
  phone: "04 50 71 82 93",
};

const PROFIL = {
  services: [
    { name: "Réfection complète de toiture", price: "à partir de 9 400 €", duration: "5 à 12 jours", description: "Dépose, charpente vérifiée, écran sous-toiture, couverture neuve." },
    { name: "Zinguerie et gouttières", price: "à partir de 780 €", duration: "1 à 2 jours", description: "Chéneaux, descentes et solins en zinc naturel ou prépatiné." },
    { name: "Démoussage et traitement", price: "à partir de 640 €", duration: "1 jour", description: "Brossage, traitement fongicide, contrôle des points singuliers." },
    { name: "Isolation des combles", price: "à partir de 2 900 €", duration: "2 jours", description: "Soufflage ou panneaux, avec attestation pour les aides." },
    { name: "Intervention d'urgence", price: "180 € le déplacement", duration: "sous 24 h", description: "Bâchage et mise hors d'eau après tempête." },
    { name: "Fenêtres de toit", price: "à partir de 1 250 €", duration: "1 jour", description: "Pose et raccord d'étanchéité, volet roulant en option." },
  ],
  keyStats: [
    { value: "51", label: "ans d'exploitation" },
    { value: "2 300", label: "toitures reprises" },
    { value: "48 h", label: "délai de devis" },
    { value: "10 ans", label: "garantie décennale" },
  ],
  certifications: ["Qualibat 3112", "RGE Éco Artisan", "Garantie décennale AXA", "Charte Zinc de France"],
  reputation: {
    featuredReviews: [
      { author: "Hélène Brunet", text: "Toiture refaite en huit jours, chantier impeccable et devis respecté au centime.", rating: 5, source: "Google" },
      { author: "Syndic Léman Gestion", text: "Trois immeubles traités sans une plainte de copropriétaire. C'est rare.", rating: 5, source: "Google" },
      { author: "Marc Delaunay", text: "Intervenus le lendemain de la tempête, bâchage posé avant la nuit.", rating: 5, source: "PagesJaunes" },
    ],
  },
  faq: [
    { q: "Intervenez-vous hors de la Haute-Savoie ?", a: "Jusqu'à 60 km d'Annecy, au-delà sur devis." },
    { q: "Vos devis sont-ils payants ?", a: "Non, le déplacement de métrage est offert." },
  ],
  team: [
    { name: "Julien Vidal", role: "Gérant, couvreur-zingueur" },
    { name: "Sofiane Merad", role: "Chef d'équipe zinguerie" },
  ],
  geo: { address: "14 route des Creuses, 74000 Annecy", primaryCity: "Annecy", serviceAreas: ["Annecy", "Rumilly", "Thonon-les-Bains", "La Roche-sur-Foron"] },
  openingHours: [
    { day: "Lundi", open: "07:30", close: "18:00" },
    { day: "Mardi", open: "07:30", close: "18:00" },
    { day: "Mercredi", open: "07:30", close: "18:00" },
    { day: "Jeudi", open: "07:30", close: "18:00" },
    { day: "Vendredi", open: "07:30", close: "17:00" },
    { day: "Samedi", closed: true },
    { day: "Dimanche", closed: true },
  ],
  paymentMethods: ["Virement", "Chèque", "Carte bancaire", "Paiement en 3 fois"],
  legal: { legalForm: "SARL", siret: "412 875 336 00027", companyAddress: "14 route des Creuses, 74000 Annecy" },
  bookingSystem: { url: "https://exemple-reservation.fr/vidal" },
};

async function creerSession(templateId) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...FORM, template: templateId } }),
  });
  if (!r.ok) throw new Error(`POST /api/sessions ${r.status}`);
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée");
  const p = await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: PROFIL }),
  });
  if (!p.ok) throw new Error(`PATCH /api/sessions ${p.status}`);
  return sessionId;
}

/*
  Ce qu'on cherche dans la page. `debordements` compare chaque élément à la
  largeur du document : on écarte ce qui déborde à dessein — bandeaux qui
  défilent, éléments en `position: fixed`, diapositives de carrousel, et les
  animations d'entrée encore en cours (transform actif).
*/
const MESURE = () => {
  const doc = document.documentElement;
  const largeurPage = doc.clientWidth;
  /*
    `innerText` rend le texte tel qu'il est peint : une section en
    `text-transform: uppercase` renvoie « ZINGUERIE », pas « Zinguerie ». Un
    marqueur sensible à la casse a fait passer pour absentes des prestations
    et des avis qui étaient bien à l'écran. On compare donc sans casse ni
    accent, et les espaces des nombres — fine, insécable — sont ramenés à
    l'espace ordinaire.
  */
  const aplatir = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[   ]/g, " ")
      .toLowerCase();
  const texte = document.body.innerText;
  const plat = aplatir(texte);
  const contient = (...aiguilles) => aiguilles.some((a) => plat.includes(aplatir(a)));

  const estVolontaire = (el) => {
    let n = el;
    for (let i = 0; i < 6 && n; i += 1) {
      const s = getComputedStyle(n);
      if (s.position === "fixed") return true;
      if (s.overflowX === "auto" || s.overflowX === "scroll" || s.overflowX === "hidden" || s.overflowX === "clip") return true;
      if (s.transform && s.transform !== "none") return true;
      if ((n.className || "").toString().match(/marquee|defil|carousel|slider|ticker/i)) return true;
      n = n.parentElement;
    }
    return false;
  };

  const debordements = [];
  document.querySelectorAll("body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right <= largeurPage + 1 && r.left >= -1) return;
    if (estVolontaire(el)) return;
    debordements.push({
      balise: el.tagName.toLowerCase(),
      classe: (el.className || "").toString().slice(0, 40),
      texte: (el.textContent || "").trim().slice(0, 50),
      droite: Math.round(r.right),
      gauche: Math.round(r.left),
    });
  });

  const titres = [...document.querySelectorAll("h1, h2")].map((h) => (h.textContent || "").trim()).filter(Boolean);
  const h1 = (document.querySelector("h1")?.textContent || "").trim();

  return {
    largeurPage,
    largeurDocument: Math.round(doc.scrollWidth),
    debordePage: doc.scrollWidth > largeurPage + 1,
    debordements: debordements.slice(0, 12),
    nbDebordements: debordements.length,
    h1,
    nbTitres: titres.length,
    longueurTexte: texte.length,
    // Marqueurs du client — s'ils manquent, la page montre encore la démo.
    client: {
      nom: contient("Vidal"),
      ville: contient("Annecy"),
      prestation: contient("Zinguerie", "Réfection", "Démoussage", "Isolation des combles"),
      tarif: contient("9 400", "780", "640", "2 900", "1 250"),
      avis: contient("Brunet", "Delaunay", "Léman"),
      chiffre: contient("2 300", "48 h", "10 ans"),
      telephone: contient("04 50 71 82 93"),
      courriel: contient("contact@ateliers-vidal.fr"),
      adresse: contient("route des Creuses"),
      siret: contient("412 875 336"),
    },
    // Ce qui trahit une page cassée.
    panne: /This page couldn't load|Application error|Unhandled Runtime/i.test(texte),
    vide: texte.trim().length < 400,
  };
};

const brut = [];
const navigateur = await chromium.launch({ executablePath: CHROME });

for (const id of ids) {
  const fiche = { id, bureau: null, telephone: null, erreurs: [] };
  try {
    const sessionId = await creerSession(id);
    for (const [nom, largeur, hauteur] of [["bureau", 1440, 900], ["telephone", 390, 844]]) {
      const ctx = await navigateur.newContext({ viewport: { width: largeur, height: hauteur }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      page.on("pageerror", (e) => fiche.erreurs.push(`${nom}: ${String(e).slice(0, 120)}`));
      // Les banques d'images sont injoignables ici ; on coupe net plutôt que
      // d'attendre leur expiration, la page doit tenir sans elles.
      await page.route("**/*", (route) => {
        const u = route.request().url();
        if (/images\.unsplash\.com|images\.pexels\.com|source\.unsplash/.test(u)) return route.abort();
        return route.continue();
      });
      await page.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(4200); // laisser passer les entrées et les repasses de BrandColorVar
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);
      fiche[nom] = await page.evaluate(MESURE);
      await page.screenshot({ path: path.join(sortie, `${id}-${nom}.png`), fullPage: false });
      await page.screenshot({ path: path.join(sortie, `${id}-${nom}-entier.png`), fullPage: true });
      await ctx.close();
    }
  } catch (e) {
    fiche.erreurs.push(String(e).slice(0, 200));
  }
  brut.push(fiche);

  const b = fiche.bureau;
  const t = fiche.telephone;
  const manquants = b ? Object.entries(b.client).filter(([, v]) => !v).map(([k]) => k) : ["—"];
  console.log(
    `${id} | ${b ? (b.panne ? "PANNE" : b.vide ? "VIDE" : "ok") : "ÉCHEC"}` +
    ` | déborde ${b?.nbDebordements ?? "?"}/${t?.nbDebordements ?? "?"}` +
    ` | client manquant: ${manquants.length ? manquants.join(",") : "rien"}` +
    ` | h1: ${(b?.h1 ?? "").slice(0, 46)}` +
    (fiche.erreurs.length ? ` | ERREURS ${fiche.erreurs.length}` : ""),
  );
}

await navigateur.close();
fs.writeFileSync(path.join(sortie, "mesures.json"), JSON.stringify(brut, null, 2));
console.log(`\nCaptures et mesures dans ${sortie}`);
