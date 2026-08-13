/*
  Le catalogue entier, avec quatre clients différents.

    node scripts/qa-catalogue.mjs --profil artisan
    node scripts/qa-catalogue.mjs --profil restaurant --debut 200 --fin 250

  Pourquoi celui-ci et pas `qa-reprise.mjs` : ce dernier photographie tout, ce
  qui coûte une minute par thème — six heures pour le catalogue, vingt-quatre
  pour quatre profils. Ici on MESURE, et on ne photographie qu'en cas de défaut.
  Quatre pages en parallèle, une seule instance de navigateur.

  Ce qu'on regarde, thème par thème, en 1440 et en 390 :
    · la page se charge-t-elle (erreur JavaScript, corps vide) ;
    · défile-t-elle horizontalement — le seul débordement que le visiteur subit ;
    · la donnée du client s'affiche-t-elle (nom, ville, prestation, contact) ;
    · la page a-t-elle un titre de niveau 1.

  Les pièges déjà payés, et évités ici : on mesure une fois si les banques
  d'images répondent au lieu de le supposer ; on attend les images avec une
  échéance ; on défile progressivement pour déclencher les animations d'entrée.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`);
  return i >= 0 ? process.argv[i + 1] : defaut;
};
const PROFIL_NOM = arg("profil", "artisan");
const DEBUT = Number(arg("debut", 1));
const FIN = Number(arg("fin", 999));
const PARALLELE = Number(arg("parallele", 4));
const SORTIE = arg("sortie", `/tmp/catalogue-${PROFIL_NOM}`);

fs.mkdirSync(SORTIE, { recursive: true });

/* ── Les quatre clients ──────────────────────────────────────────────────── */

const CLIENTS = {
  /* Celui de tous les balayages précédents : sert de référence. */
  artisan: {
    formData: {
      businessName: "Ateliers Vidal & Fils", businessType: "couvreur",
      tagline: "Zinc, ardoise et tuile plate depuis 1974, sur toute la Haute-Savoie",
      city: "Annecy", mainService: "Réfection de toiture", brandColor: "#7c3aed",
      email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93",
    },
    businessProfile: {
      services: [
        { name: "Réfection complète de toiture", price: "à partir de 9 400 €", description: "Dépose, charpente vérifiée, couverture neuve." },
        { name: "Zinguerie et gouttières", price: "à partir de 780 €", description: "Chéneaux, descentes et solins en zinc." },
        { name: "Démoussage et traitement", price: "à partir de 640 €", description: "Brossage, traitement fongicide." },
      ],
      keyStats: [{ value: "51", label: "ans d'exploitation" }, { value: "2 300", label: "toitures reprises" }],
      certifications: ["Qualibat 3112", "RGE Éco Artisan"],
      faq: [{ q: "Intervenez-vous hors Haute-Savoie ?", a: "Jusqu'à 60 km d'Annecy." }],
      team: [{ name: "Julien Vidal", role: "Gérant, couvreur-zingueur" }],
      reputation: { featuredReviews: [{ author: "Hélène Brunet", text: "Toiture refaite en huit jours.", rating: 5 }] },
      legal: { companyAddress: "14 route des Creuses, 74000 Annecy" },
      geo: { address: "14 route des Creuses, 74000 Annecy" },
    },
  },
  /* Une carte, pas des prestations : le repli que trente-deux thèmes rataient. */
  restaurant: {
    formData: {
      businessName: "Le Comptoir des Trois Chênes", businessType: "restaurant",
      tagline: "Cuisine de marché, ardoise changée chaque matin",
      city: "Bourg-en-Bresse", mainService: "Cuisine française", brandColor: "#b45309",
      email: "salle@trois-chenes.fr", phone: "04 74 22 18 05",
    },
    businessProfile: {
      menu: [
        { name: "Quenelle de brochet, sauce Nantua", price: "24 €", category: "Plats" },
        { name: "Poularde de Bresse à la crème", price: "32 €", category: "Plats" },
        { name: "Tarte aux pralines", price: "9 €", category: "Desserts" },
      ],
      openingHours: { lundi: "fermé", mardi: "12h-14h · 19h-22h" },
      keyStats: [{ value: "1962", label: "maison fondée" }],
      reputation: { featuredReviews: [{ author: "Pierre Ligier", text: "La quenelle vaut le détour.", rating: 5 }] },
      legal: { companyAddress: "3 place Bernard, 01000 Bourg-en-Bresse" },
    },
  },
  /* Un catalogue de produits, et un nom volontairement très long. */
  commerce: {
    formData: {
      businessName: "Établissements Marquisat-Delaunay & Compagnie Réunis",
      businessType: "magasin de vélos",
      tagline: "Vélos, réparation et location au pied du col, depuis trois générations",
      city: "Saint-Jean-de-Maurienne", mainService: "Vente et réparation", brandColor: "#0f766e",
      email: "atelier@marquisat-delaunay.fr", phone: "04 79 64 12 88",
    },
    businessProfile: {
      products: [
        { name: "Vélo de route carbone Aravis", price: "2 890 €" },
        { name: "VTT électrique Galibier", price: "3 450 €" },
      ],
      services: [{ name: "Révision complète", price: "89 €", description: "Transmission, freins, roues." }],
      keyStats: [{ value: "3", label: "générations" }],
      legal: { companyAddress: "22 avenue de la Maurienne, 73300 Saint-Jean-de-Maurienne" },
    },
  },
  /* Le client qui ne remplit presque rien : le thème doit tenir tel quel. */
  minimal: {
    formData: { businessName: "Roux", businessType: "plombier", city: "Lyon", template: "" },
    businessProfile: {},
  },
};

const CLIENT = CLIENTS[PROFIL_NOM];
if (!CLIENT) {
  console.error(`profil inconnu : ${PROFIL_NOM} (${Object.keys(CLIENTS).join(", ")})`);
  process.exit(1);
}

/* ── L'état du réseau, mesuré une fois ───────────────────────────────────── */

const BANQUES = await fetch(
  "https://images.pexels.com/photos/792034/pexels-photo-792034.jpeg?auto=compress&cs=tinysrgb&w=60",
  { signal: AbortSignal.timeout(8000) },
).then((r) => r.ok).catch(() => false);

/* ── La liste des thèmes ─────────────────────────────────────────────────── */

const THEMES = fs
  .readdirSync(path.join(process.cwd(), "app/templates"))
  .filter((d) => /^impact-\d+$/.test(d))
  .filter((d) => {
    const n = Number(d.split("-")[1]);
    return n >= DEBUT && n <= FIN;
  })
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

/* Les pages annexes de chaque thème, pour aller y chercher la donnée du client. */
const ANNEXES = Object.fromEntries(
  THEMES.map((t) => [
    t,
    fs
      .readdirSync(path.join(process.cwd(), "app/templates", t), { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(process.cwd(), "app/templates", t, e.name, "page.tsx")))
      .map((e) => e.name),
  ]),
);

console.log(`${THEMES.length} thèmes · profil « ${PROFIL_NOM} » · banques d'images ${BANQUES ? "joignables" : "hors de portée"}`);

/* ── La mesure ───────────────────────────────────────────────────────────── */

async function creerSession(theme) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...CLIENT.formData, template: theme } }),
  });
  if (!r.ok) throw new Error(`session ${r.status}`);
  const { sessionId } = await r.json();
  if (Object.keys(CLIENT.businessProfile).length) {
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessProfile: CLIENT.businessProfile }),
    });
  }
  return sessionId;
}

async function mesurerUneVue(ctx, theme, sessionId, largeur, hauteur) {
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e).slice(0, 120)));
  await page.setViewportSize({ width: largeur, height: hauteur });
  try {
    await page.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3200);
    /*
      On descend, et on NE REMONTE PAS avant d'avoir lu.

      Certains thèmes ne montent une section qu'à son entrée dans l'écran et la
      démontent en sortant : remonter en haut avant de lire vidait leur texte du
      document. Trente-six thèmes ont été déclarés « prestation absente » sur
      cette seule erreur, alors qu'ils les affichent tous.
    */
    await page.evaluate(async () => {
      window.__texteVu = "";
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
        window.__texteVu += " " + (document.body.textContent ?? "");
      }
    });
    /* Les images, avec une échéance : sans elle, un hôte muet fige le balayage. */
    await page.evaluate(
      () => new Promise((fini) => {
        const limite = Date.now() + 9000;
        const voir = () =>
          [...document.images].some((i) => !i.complete) && Date.now() < limite
            ? setTimeout(voir, 200)
            : fini();
        voir();
      }),
    ).catch(() => {});
    await page.waitForTimeout(700);

    const vu = await page.evaluate(() => {
      const doc = document.documentElement;
      /*
        Le texte accumulé pendant la descente, et non celui de l'instant : une
        section démontée en sortant de l'écran a tout de même été affichée.
      */
      const texte = ((window.__texteVu ?? "") + " " + (document.body.textContent ?? "")).replace(/\s+/g, " ");
      return {
        texte,
        longueur: texte.length,
        defileDeCote: doc.scrollWidth > doc.clientWidth + 2,
        h1: (document.querySelector("h1")?.textContent ?? "").trim().slice(0, 60),
        titreErreur: /couldn.t load|Application error|Page introuvable/i.test(texte.slice(0, 200)),
      };
    });
    return { ...vu, erreurs };
  } catch (e) {
    return { texte: "", longueur: 0, defileDeCote: false, h1: "", titreErreur: true, erreurs: [...erreurs, String(e).slice(0, 100)] };
  } finally {
    await page.close().catch(() => {});
  }
}

const attendus = () => {
  const f = CLIENT.formData, p = CLIENT.businessProfile;
  const l = [["nom", f.businessName], ["ville", f.city]];
  if (f.phone) l.push(["téléphone", f.phone]);
  if (f.email) l.push(["courriel", f.email]);
  const presta = p.services?.[0]?.name ?? p.menu?.[0]?.name ?? p.products?.[0]?.name;
  if (presta) l.push(["prestation", presta]);
  return l;
};

async function mesurerUnTheme(ctx, theme) {
  const fiche = { theme, defauts: [] };
  let sessionId;
  try {
    sessionId = await creerSession(theme);
  } catch (e) {
    fiche.defauts.push(`session impossible (${e.message})`);
    return fiche;
  }

  const bureau = await mesurerUneVue(ctx, theme, sessionId, 1440, 900);
  if (bureau.titreErreur || bureau.longueur < 400) fiche.defauts.push("page vide ou en erreur");
  if (bureau.erreurs.length) fiche.defauts.push(`erreur JS: ${bureau.erreurs[0]}`);
  if (bureau.defileDeCote) fiche.defauts.push("défile de côté en 1440");
  if (!bureau.h1) fiche.defauts.push("aucun titre de niveau 1");
  /*
    Sans tenir compte de la casse : impact-61 affiche la prestation du client en
    capitales (`toUpperCase()` en JavaScript, donc jusque dans le texte du
    document). Comparer strictement l'a fait passer pour absente.
  */
  const vuBureau = bureau.texte.toLowerCase();
  for (const [quoi, valeur] of attendus()) {
    if (valeur && !vuBureau.includes(valeur.toLowerCase())) fiche.defauts.push(`${quoi} absent`);
  }

  /*
    Une donnée absente de l'accueil n'est pas une donnée perdue : beaucoup de
    thèmes rangent les prestations sur une page annexe — impact-56 les met sur
    « /visite ». On va donc les y chercher avant d'accuser, sinon on compte
    trente-six défauts qui n'existent pas.
  */
  const manquantes = fiche.defauts.filter((d) => d.endsWith(" absent"));
  if (manquantes.length && ANNEXES[theme]?.length) {
    for (const annexe of ANNEXES[theme].slice(0, 9)) {
      if (!fiche.defauts.some((d) => d.endsWith(" absent"))) break;
      const vue = await mesurerUneVue(ctx, `${theme}/${annexe}`, sessionId, 1440, 900);
      for (const [quoi, valeur] of attendus()) {
        if (valeur && vue.texte.toLowerCase().includes(valeur.toLowerCase())) {
          fiche.defauts = fiche.defauts.filter((d) => d !== `${quoi} absent`);
        }
      }
    }
  }

  const tel = await mesurerUneVue(ctx, theme, sessionId, 390, 844);
  if (tel.titreErreur || tel.longueur < 400) fiche.defauts.push("page vide en 390");
  if (tel.erreurs.length) fiche.defauts.push(`erreur JS en 390: ${tel.erreurs[0]}`);
  if (tel.defileDeCote) fiche.defauts.push("défile de côté en 390");

  fiche.h1 = bureau.h1;
  return fiche;
}

/* ── La boucle, quatre pages à la fois ───────────────────────────────────── */

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
if (!BANQUES) {
  await ctx.route("**/*", (route) =>
    /images\.(unsplash|pexels)\.com|source\.unsplash/.test(route.request().url()) ? route.abort() : route.continue(),
  );
}

const fiches = [];
let curseur = 0;
async function travailleur() {
  while (curseur < THEMES.length) {
    const theme = THEMES[curseur++];
    const f = await mesurerUnTheme(ctx, theme).catch((e) => ({ theme, defauts: [`plantage du balayage: ${String(e).slice(0, 80)}`] }));
    fiches.push(f);
    const marque = f.defauts.length ? `✗ ${f.defauts.join(" · ")}` : "ok";
    console.log(`${String(fiches.length).padStart(3)}/${THEMES.length} ${theme.padEnd(12)} ${marque}`);
  }
}
await Promise.all(Array.from({ length: PARALLELE }, travailleur));
await navigateur.close();

const casses = fiches.filter((f) => f.defauts.length);
fs.writeFileSync(path.join(SORTIE, "resultat.json"), JSON.stringify({ profil: PROFIL_NOM, total: fiches.length, casses }, null, 1));
console.log(`\n${fiches.length} thèmes · ${casses.length} avec au moins un défaut · détail dans ${SORTIE}/resultat.json`);
