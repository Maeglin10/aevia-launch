// Le regard sur chaque thème : capture et défauts visibles.
//
//   node scripts/visual-qa.mjs --tranche 0 5
//   node scripts/visual-qa.mjs impact-01 impact-02
//
// La mesure précédente disait *ce que la page affiche*. Elle ne dit rien de ce
// qu'on voit : un titre de client plus long que celui du thème qui déborde de sa
// bande, une photo qui ne charge pas et laisse un carré vide, un texte sombre
// tombé sur un fond sombre, une page qui défile de côté sur un mobile.
//
// Chaque thème reçoit ici la même chose qu'au wizard — nom, ville, métier,
// couleur, prestations, avis, chiffres, horaires, photos des banques — puis on
// capture le rendu et l'on relève ce qui se mesure :
//
//   - défilement horizontal (la page est plus large que la fenêtre)
//   - image cassée (chargée, mais de largeur nulle)
//   - texte qui sort de son cadre alors que le cadre le coupe
//   - texte dont le contraste avec son fond descend sous 3:1
//   - hauteur de page anormale (une section effondrée, ou dix fois trop haute)
//
// Les captures partent dans /tmp/qa/<id>-<vue>.jpg, la fiche dans /tmp/qa.json.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const SORTIE = process.env.QA_DIR ?? "/tmp/qa";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  console.error("usage: node scripts/visual-qa.mjs impact-01 … | --tranche 0 5");
  process.exit(1);
}
fs.mkdirSync(SORTIE, { recursive: true });

const VILLES = ["Annecy", "Chambéry", "Grenoble", "Lyon", "Valence", "Aix-les-Bains", "Voiron", "Albertville"];
const METIERS = ["plombier", "coiffeur", "avocat", "restaurateur", "photographe", "architecte", "kinésithérapeute", "fleuriste"];
const COULEURS = ["#c2410c", "#0e7490", "#4d7c0f", "#7e22ce", "#be123c", "#1d4ed8", "#a16207", "#0f766e"];
// Des noms d'entreprise plus longs que ceux des thèmes : c'est là que ça déborde.
const NOMS = [
  "Ateliers Vidal & Fils", "Maison Bonnefoy", "Clinique du Lac Bleu",
  "Charpentes Traditionnelles de Savoie", "Studio Margaux Vernet", "Le Comptoir des Alpes",
];

async function imagesDe(metier, n) {
  try {
    const r = await fetch(`${BASE}/api/stock?q=${encodeURIComponent(metier)}&n=${n}`);
    const { images } = await r.json();
    return (images ?? []).map((x) => x.url).filter(Boolean);
  } catch {
    return [];
  }
}

function donneesPour(id, i) {
  const ville = VILLES[i % VILLES.length];
  const metier = METIERS[i % METIERS.length];
  const couleur = COULEURS[i % COULEURS.length];
  const nom = NOMS[i % NOMS.length];
  return {
    nom, ville, metier, couleur,
    formData: {
      businessName: nom, city: ville, businessType: metier,
      tagline: `Votre ${metier} de confiance à ${ville} depuis 1998`,
      email: `contact@${id}.fr`, phone: "04 50 11 22 33",
      brandColor: couleur, template: id,
    },
    businessProfile: {
      services: [
        { name: "Rénovation complète de salle de bain", price: "2 400 €", description: "Dépose, plomberie, carrelage et pose des équipements, en une semaine." },
        { name: "Dépannage d'urgence", price: "137 €", description: "Intervention sous deux heures, sept jours sur sept." },
        { name: "Entretien annuel", price: "89 €", description: "Contrôle complet de l'installation et détartrage." },
      ],
      reputation: { featuredReviews: [
        { author: "Marie-Claude Fontaine", text: "Travail soigné, délais tenus, et un chantier laissé propre. Je recommande sans réserve.", rating: 5 },
        { author: "Julien Perret", text: "Rapides et honnêtes sur le devis.", rating: 5 },
      ] },
      keyStats: [
        { value: "27", label: "années d'expérience" },
        { value: "1 400+", label: "chantiers livrés" },
      ],
      certifications: ["RGE Qualibat", "Garantie décennale"],
      faq: [{ q: "Intervenez-vous le week-end ?", a: "Oui, y compris les jours fériés, avec une majoration annoncée au devis." }],
      team: [{ name: "Sébastien Vidal", role: "Fondateur et chef de chantier" }],
      openingHours: [
        { day: "Lundi", open: "08:30", close: "18:00" },
        { day: "Dimanche", closed: true },
      ],
      geo: { primaryCity: null, address: null, serviceAreas: [] },
      beforeAfter: [{ beforeUrl: "", afterUrl: "", caption: "Réfection d'une toiture de 180 m²" }],
      contacts: { general: { email: `contact@${id}.fr`, phone: "04 50 11 22 33" } },
    },
    generatedContent: {},
  };
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const fiches = [];
let n = 0;

for (const id of ids) {
  const d = donneesPour(id, n++);
  d.businessProfile.geo = { primaryCity: d.ville, address: `12 rue des Alpes, ${d.ville}`, serviceAreas: [d.ville] };
  const photos = await imagesDe(d.metier, 8);

  const post = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...d.formData, photoUrls: photos } }),
  });
  const { sessionId } = await post.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: d.businessProfile, generatedContent: d.generatedContent }),
  });

  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 90)));
  const fiche = { id, nom: d.nom, ville: d.ville, metier: d.metier, couleur: d.couleur, defauts: [], erreurs };

  try {
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2600);
    // La bandeau cookies couvre le bas du hero sur toutes les captures.
    for (const nom of ["Tout accepter", "Accept all", "Aceptar todo", "Alle akzeptieren"]) {
      const bouton = p.getByRole("button", { name: nom });
      if (await bouton.count()) { await bouton.first().click().catch(() => {}); break; }
    }
    await p.waitForTimeout(500);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(1200);

    const releve = await p.evaluate(() => {
      const out = { largeurDoc: 0, largeurVue: 0, hauteur: 0, cassees: [], deborde: [], contraste: [] };
      out.largeurDoc = document.documentElement.scrollWidth;
      out.largeurVue = document.documentElement.clientWidth;
      out.hauteur = document.body.scrollHeight;

      for (const img of document.querySelectorAll("img")) {
        if (!img.complete) continue;
        const r = img.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        if (img.naturalWidth === 0) out.cassees.push((img.currentSrc || img.src || "").slice(0, 90));
      }

      /*
        La couleur se lit par le navigateur, pas à la regex. Ces thèmes écrivent
        leurs teintes en `lab()` : lire « 65.6, 1.5, -5.4 » comme du rouge-vert-
        bleu donnait des rapports de contraste inventés, et cinq faux défauts par
        page. Un canevas d'un pixel rend la vraie couleur, quelle que soit la
        notation — lab, oklch, color().
      */
      const pinceau = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const lum = (c) => {
        if (!c || c === "transparent") return null;
        pinceau.clearRect(0, 0, 1, 1);
        pinceau.fillStyle = "#000";
        pinceau.fillStyle = c;
        pinceau.fillRect(0, 0, 1, 1);
        const [r, g, bl, a] = pinceau.getImageData(0, 0, 1, 1).data;
        if (a < 102) return null;
        const v = [r, g, bl].map((x) => {
          const s = x / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
      };
      /*
        Le fond d'un texte n'est une couleur que si aucun ancêtre ne porte une
        image ou un dégradé : sur une photo de héros, comparer un texte blanc au
        `backgroundColor` transparent du body donnait « 1,1:1 » sur des titres
        parfaitement lisibles. Dans ce cas on ne juge pas.
      */
      /*
        Le fond d'un texte est le premier aplat rencontré en remontant. Une image
        rencontrée avant met fin à la recherche : on ne sait pas de quelle
        couleur elle est à cet endroit. Et si le seul aplat trouvé est celui de
        la page alors que le texte est posé sur une photo, c'est la photo qu'on
        voit, pas l'aplat — on s'abstient encore.
      */
      const fondDe = (e) => {
        for (let x = e; x; x = x.parentElement) {
          const s = getComputedStyle(x);
          if (s.backgroundImage && s.backgroundImage !== "none" && /url\(|gradient\(/.test(s.backgroundImage)) return null;
          const l = lum(s.backgroundColor);
          if (l === null) continue;
          if (x === document.body || x === document.documentElement) return { l, page: true };
          return { l, page: false };
        }
        return { l: 1, page: true };
      };

      /*
        Une photo de hero est presque toujours une sœur du texte, pas une aïeule :
        remonter les ancêtres ne la voyait pas, le fond trouvé était l'aplat du
        body, et cent quatre-vingt-onze en-têtes parfaitement lisibles — blanc sur
        photo — passaient pour illisibles. On relève donc les rectangles de tout
        ce qui porte une image, et l'on s'abstient de juger un texte posé dessus.
      */
      const surImage = [];
      for (const e of document.querySelectorAll("img, [style*='background'], *")) {
        const s = getComputedStyle(e);
        const porte = e.tagName === "IMG" || (s.backgroundImage && s.backgroundImage !== "none" && /url\(/.test(s.backgroundImage));
        if (!porte) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 60 || r.height < 60) continue;
        surImage.push(r);
      }
      /*
        Un recouvrement, pas une inclusion : l'en-tête déborde souvent de
        quelques pixels au-dessus de la photo du hero, et exiger qu'il y tienne
        tout entier faisait juger un texte blanc contre le blanc de la page —
        soixante-sept en-têtes parfaitement lisibles comptés illisibles.
      */
      const posePar = (r) => {
        const aire = Math.max(1, r.width * r.height);
        return surImage.some((z) => {
          const l = Math.max(0, Math.min(r.right, z.right) - Math.max(r.left, z.left));
          const h = Math.max(0, Math.min(r.bottom, z.bottom) - Math.max(r.top, z.top));
          return (l * h) / aire >= 0.6;
        });
      };

      for (const e of document.querySelectorAll("h1, h2, h3, p, span, div, li, a, button")) {
        const propre = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 2);
        if (!propre) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.3) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;

        // Le texte sort de son cadre alors que le cadre le coupe.
        if (/hidden|clip/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 6 && e.clientHeight > 12) {
          out.deborde.push(`${e.tagName.toLowerCase()} «${e.textContent.trim().slice(0, 40)}» ${e.scrollHeight}>${e.clientHeight}`);
        }
        // Le contraste, seulement sur du texte qu'on lit vraiment.
        if (parseFloat(s.fontSize) >= 11 && out.contraste.length < 6) {
          const lt = lum(s.color);
          const fond = fondDe(e);
          const lf = fond && !(fond.page && posePar(r)) ? fond.l : null;
          if (lt !== null && lf !== null) {
            const ratio = (Math.max(lt, lf) + 0.05) / (Math.min(lt, lf) + 0.05);
            if (ratio < 2.2) {
              // Où le texte se trouve : l'en-tête, le premier écran, la suite.
              const zone = r.top < 120 ? "en-tête" : r.top < 900 ? "hero" : "corps";
              out.contraste.push(`«${e.textContent.trim().slice(0, 34)}» ${ratio.toFixed(1)}:1 [${zone}]`);
            }
          }
        }
      }
      /*
        Le plus gros texte du premier écran : c'est le titre que le visiteur lit.
        S'il se retrouve mot pour mot dans le source du thème, c'est celui de la
        démonstration — impact-02 annonçait « Elena Korr. » sur le site d'une
        entreprise qui s'appelle autrement.
      */
      let plusGros = null;
      for (const e of document.querySelectorAll("h1, h2, h3, div, span, p")) {
        const r = e.getBoundingClientRect();
        if (r.top > 900 || r.bottom < 0) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.3) continue;
        const taille = parseFloat(s.fontSize);
        if (!(taille >= 34)) continue;
        const texte = e.innerText?.trim() ?? "";
        if (texte.length < 3 || texte.length > 120) continue;
        if (!plusGros || taille > plusGros.taille) plusGros = { taille, texte };
      }
      out.titreHero = plusGros?.texte ?? "";

      out.deborde = out.deborde.slice(0, 6);
      return out;
    });

    if (releve.largeurDoc > releve.largeurVue + 2) {
      fiche.defauts.push(`défile de côté (${releve.largeurDoc} > ${releve.largeurVue})`);
    }
    if (releve.cassees.length) fiche.defauts.push(`${releve.cassees.length} image(s) cassée(s)`);
    if (releve.deborde.length) fiche.defauts.push(`${releve.deborde.length} texte(s) coupé(s) : ${releve.deborde[0]}`);
    /*
      Le contraste n'entre plus dans les défauts. Sur un fond photographique, le
      calculer depuis le DOM revient à deviner : la photo est une sœur du texte,
      l'en-tête devient opaque au défilement puis redevient transparent, et
      trois campagnes de suite ont signalé des en-têtes blancs sur photo,
      parfaitement lisibles, comme illisibles. Le relevé reste consultable dans
      la fiche — il se juge à l'œil, sur la capture, pas au calcul.
    */
    if (releve.contraste.length) fiche.contrasteVu = releve.contraste.slice(0, 4);
    if (releve.hauteur < 1400) fiche.defauts.push(`page très courte (${releve.hauteur}px)`);
    if (erreurs.length) fiche.defauts.push(`erreur js : ${erreurs[0]}`);
    fiche.titreHero = releve.titreHero;
    if (releve.titreHero && !releve.titreHero.toLowerCase().includes(d.nom.toLowerCase())) {
      const source = fs.readFileSync(path.join(process.cwd(), "app/templates", id, "page.tsx"), "utf8");
      const plat = source.replace(/\s+/g, " ");
      const cherche = releve.titreHero.replace(/\s+/g, " ").trim();
      if (cherche.length >= 4 && plat.includes(cherche)) {
        fiche.defauts.push(`titre de démonstration : « ${cherche} »`);
      }
    }
    fiche.hauteur = releve.hauteur;
    fiche.cassees = releve.cassees.slice(0, 3);
    fiche.deborde = releve.deborde;
    fiche.contraste = releve.contraste.slice(0, 3);

    await p.screenshot({ path: path.join(SORTIE, `${id}-haut.jpg`), type: "jpeg", quality: 62 });
    await p.screenshot({ path: path.join(SORTIE, `${id}-page.jpg`), type: "jpeg", quality: 52, fullPage: true });
  } catch (e) {
    fiche.defauts.push(`capture impossible : ${String(e.message).slice(0, 80)}`);
  }
  await p.close();

  fiches.push(fiche);
  console.log(`${id.padEnd(12)} ${fiche.defauts.length ? fiche.defauts.join(" | ") : "rien à signaler"}`.slice(0, 190));
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const avec = fiches.filter((f) => f.defauts.length).length;
console.log(`\n${fiches.length} thèmes capturés, ${avec} avec au moins un défaut mesurable`);
