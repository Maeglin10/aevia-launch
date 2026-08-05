// Le harnais : chaque thème passe l'épreuve, deux fois, avec deux entreprises.
//
//   node scripts/harnais.mjs --tranche 0 5 --essais 2
//   node scripts/harnais.mjs impact-01 --essais 5
//
// Un thème est reçu quand il rend, pour chaque entreprise qu'on lui confie :
//
//   - tous les blocs qu'il déclare afficher, portant la donnée du client
//   - ses photos, quand il a des emplacements
//   - la couleur de marque, quand il n'est pas monochrome
//   - aucun reste de la démonstration — ville, adresse ou courriel d'exemple
//   - un nom et un numéro qu'on peut lire, mesurés sur les pixels
//   - et pas la moindre erreur de rendu
//
// Le résultat s'écrit dans un registre : un thème reçu deux fois de suite sort
// de la liste, un thème recalé y reste avec la raison. C'est ce registre qui
// dit ce qu'il reste à faire.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const args = process.argv.slice(2);
const essais = Number(args[args.indexOf("--essais") + 1] || 2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (args.includes("--depuis")) {
  const registre = JSON.parse(fs.readFileSync(args[args.indexOf("--depuis") + 1], "utf8"));
  const recales = new Set(registre.filter((x) => !x.recu).map((x) => x.id));
  ids = ids.filter((x) => recales.has(x));
}
if (ids.length === 0) {
  console.error("usage: node scripts/harnais.mjs --tranche 0 5 [--essais 2] [--depuis registre.json]");
  process.exit(1);
}

// Ce que chaque thème déclare montrer, et ce qu'il n'a pas.
const capacites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const MANIFESTE = {};
for (const m of capacites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  MANIFESTE[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}
const BLOC_DE = {
  prestation: "prestations", prix: "tarifs", avis: "avis", chiffre: "chiffres",
  equipier: "equipe", label: "engagements", question: "faq",
};
const emplacements = fs.readFileSync(path.join(process.cwd(), "lib/templates/photoSlots.ts"), "utf8");
const PHOTOS_DE = {};
for (const m of emplacements.matchAll(/"(impact-[\w-]+)":\s*\{\s*n:\s*\d+,\s*total:\s*(\d+)/g)) {
  PHOTOS_DE[m[1]] = Number(m[2]);
}

// Les thèmes qui lisent la couleur de marque quelque part dans leur source :
// les autres sont monochromes, et c'est leur dessin.
const LIT_LA_COULEUR = new Set();
for (const id of fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(process.cwd(), "app/templates", id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const lu = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(dossier, f))
    .filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("");
  /*
    Un seul `var(--brand)` ne fait pas un thème en couleur : impact-02 en a un,
    sur une quarantaine de teintes écrites en dur, et son dessin est noir et
    blanc. On demande donc qu'il existe une teinte franche — ni grise, ni
    presque noire, ni presque blanche — répétée au moins trois fois.
  */
  const franche = {};
  for (const m of lu.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const hex = m[0].toLowerCase();
    const n = parseInt(hex.slice(1), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const max = Math.max(r, g, bl), min = Math.min(r, g, bl);
    if (max - min < 26 || max < 40 || min > 225) continue;
    franche[hex] = (franche[hex] ?? 0) + 1;
  }
  const dominante = Math.max(0, ...Object.values(franche));
  if (/var\(--brand/.test(lu) && dominante >= 3) LIT_LA_COULEUR.add(id);
}

// Cinq entreprises, cinq métiers, cinq villes : deux essais n'en voient jamais
// la même, et un thème qui ne tient qu'avec un jeu de données ne tient pas.
const ENTREPRISES = [
  { nom: "Ateliers Vidal & Fils", ville: "Annecy", metier: "plombier", couleur: "#c2410c" },
  { nom: "Maison Bonnefoy", ville: "Chambéry", metier: "coiffeur", couleur: "#0e7490" },
  { nom: "Clinique du Lac Bleu", ville: "Grenoble", metier: "kinésithérapeute", couleur: "#4d7c0f" },
  { nom: "Le Comptoir des Alpes", ville: "Valence", metier: "restaurateur", couleur: "#7e22ce" },
  { nom: "Studio Margaux Vernet", ville: "Voiron", metier: "photographe", couleur: "#be123c" },
];
const VILLES_DEMO = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Nice", "Strasbourg", "Rennes", "Montpellier"];

async function imagesDe(metier, n) {
  try {
    const r = await fetch(`${BASE}/api/stock?q=${encodeURIComponent(metier)}&n=${n}`);
    const { images } = await r.json();
    return (images ?? []).map((x) => x.url).filter(Boolean);
  } catch {
    return [];
  }
}

function donneesPour(id, e) {
  return {
    formData: {
      businessName: e.nom, city: e.ville, businessType: e.metier,
      tagline: `Votre ${e.metier} de confiance à ${e.ville}`,
      email: `contact@${id}.fr`, phone: "04 50 11 22 33",
      brandColor: e.couleur, template: id,
    },
    businessProfile: {
      services: [
        { name: `Prestation ${id}`, price: "137 €", description: "La première, décrite en une phrase." },
        { name: `Seconde prestation ${id}`, price: "249 €", description: "La seconde." },
      ],
      reputation: { featuredReviews: [{ author: `Client ${id}`, text: `Travail impeccable chez ${e.nom}.`, rating: 5 }] },
      keyStats: [{ value: "18", label: "années d'expérience" }],
      certifications: [`Label ${id}`],
      faq: [{ q: `Question ${id} ?`, a: "La réponse." }],
      team: [{ name: `Équipier ${id}`, role: "Responsable" }],
      openingHours: [{ day: "Lundi", open: "08:30", close: "18:00" }, { day: "Dimanche", closed: true }],
      geo: { primaryCity: e.ville, address: `12 rue des Alpes, ${e.ville}`, serviceAreas: [e.ville] },
      beforeAfter: [{ beforeUrl: "", afterUrl: "", caption: `Chantier ${id}` }],
      contacts: { general: { email: `contact@${id}.fr`, phone: "04 50 11 22 33" } },
    },
    generatedContent: {},
  };
}

const luminance = (r, g, b) => {
  const v = [r, g, b].map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};

async function rapportDe(png) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const lum = [];
  for (let i = 0; i < data.length; i += info.channels) lum.push(luminance(data[i], data[i + 1], data[i + 2]));
  if (lum.length < 40) return null;
  lum.sort((a, b) => a - b);
  const mediane = lum[Math.floor(lum.length * 0.5)];
  const marge = Math.max(2, Math.floor(lum.length * 0.005));
  const bas = lum[marge];
  const haut = lum[lum.length - 1 - marge];
  const texte = Math.abs(haut - mediane) >= Math.abs(mediane - bas) ? haut : bas;
  return (Math.max(texte, mediane) + 0.05) / (Math.min(texte, mediane) + 0.05);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const registre = [];

for (const id of ids) {
  const griefs = [];
  const couleurs = {};
  for (let essai = 0; essai < essais; essai++) {
    const e = ENTREPRISES[(ids.indexOf(id) + essai) % ENTREPRISES.length];
    const d = donneesPour(id, e);
    const photos = await imagesDe(e.metier, 8);

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
    p.on("pageerror", (x) => erreurs.push(String(x.message).slice(0, 90)));
    try {
      // Trois essais de rendu : une page vide fait manquer tous les blocs.
      let vus = "", texte = "", images = [], couleurVue = false;
      for (let tour = 0; tour < 3; tour++) {
        await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
        await p.waitForTimeout(2400);
        vus = await p.evaluate(async () => {
          const bouts = [];
          for (let y = 0; y < document.body.scrollHeight; y += 900) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 240));
            bouts.push(document.body.innerText);
          }
          window.scrollTo(0, 0);
          return bouts.join("\n");
        });
        await p.waitForTimeout(1200);
        ({ texte, images, couleurVue } = await p.evaluate((couleur) => {
          const hex = couleur.replace("#", "").toLowerCase();
          const rgb = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
          const cible = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const courte = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
          let vue = false;
          for (const el of document.querySelectorAll("*")) {
            const s = getComputedStyle(el);
            const tout = [s.color, s.backgroundColor, s.borderColor, s.backgroundImage,
              s.boxShadow, s.outlineColor, s.fill, s.stroke].join(" ");
            if (tout.includes(cible) || tout.includes(courte)) { vue = true; break; }
          }
          const fonds = [...document.querySelectorAll("*")]
            .map((el) => getComputedStyle(el).backgroundImage).filter((v) => v && v !== "none");
          return {
            texte: document.body.innerText,
            images: [...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src).concat(fonds),
            couleurVue: vue,
          };
        }, e.couleur));
        if (texte.toLowerCase().includes(e.nom.toLowerCase())) break;
        await p.waitForTimeout(1200);
      }

      const tout = `${vus}\n${texte}`;
      /*
        Les blancs se réduisent avant la comparaison : le titre coupe l'accroche
        en trois lignes, et chercher la phrase entière dans un texte qui porte
        ses sauts de ligne la déclarait absente alors qu'elle s'y lit.
      */
      const bas = tout.toLowerCase().replace(/\s+/g, " ");

      // 1. Les blocs déclarés portent-ils la donnée du client ?
      const temoins = {
        nom: e.nom, ville: e.ville, accroche: d.formData.tagline,
        prestation: `Prestation ${id}`, prix: "137 €", avis: `Travail impeccable chez ${e.nom}`,
        chiffre: "18", equipier: `Équipier ${id}`, label: `Label ${id}`, question: `Question ${id}`,
      };
      for (const [cle, valeur] of Object.entries(temoins)) {
        if (BLOC_DE[cle] && !(MANIFESTE[id] ?? []).includes(BLOC_DE[cle])) continue;
        if (!bas.includes(String(valeur).toLowerCase().replace(/\s+/g, " "))) griefs.push(`${cle} absent`);
      }

      // 2. Les photos du client, quand le thème a des emplacements.
      if ((PHOTOS_DE[id] ?? 0) > 0 && photos.length) {
        const empreinte = (u) => (u.match(/\/([\w-]{6,})\.(jpe?g|png|webp)/i)?.[1] ?? u.split("/").pop() ?? "").slice(0, 24);
        const brut = images.join(" ");
        let decode = brut;
        try { decode = decodeURIComponent(brut); } catch { /* adresse non décodable */ }
        const chargees = `${brut} ${decode}`;
        if (!photos.some((u) => chargees.includes(empreinte(u)))) {
          // Le thème réserve peut-être ses photos à ses vues intérieures.
          let trouvee = false;
          const dossier = path.join(process.cwd(), "app/templates", id);
          for (const sous of fs.readdirSync(dossier)) {
            if (sous === "legal" || !fs.existsSync(path.join(dossier, sous, "page.tsx"))) continue;
            try {
              await p.goto(`${BASE}/templates/${id}/${sous}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 20000 });
              await p.waitForTimeout(1600);
              const vues = await p.evaluate(() =>
                [...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src).join(" "));
              if (photos.some((u) => vues.includes(empreinte(u)))) { trouvee = true; break; }
            } catch { /* sous-page injoignable */ }
          }
          if (!trouvee) griefs.push("photos non prises");
        }
      }

      /*
        3. La couleur, quand le thème en a une à peindre. Vingt et un thèmes sont
        monochromes par dessein — noirs, blancs et gris, aucun accent — et leur
        en réclamer un reviendrait à leur demander de changer de dessin.
      */
      if (!couleurVue && LIT_LA_COULEUR.has(id)) griefs.push("couleur non peinte");

      // 4. Ce qui reste de la démonstration.
      for (const v of VILLES_DEMO) {
        if (v === e.ville) continue;
        if (new RegExp(`\\b${v}\\b`, "i").test(tout)) { griefs.push(`reste : ${v}`); break; }
      }

      // 5. Le nom et le numéro, lisibles sur les pixels.
      await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await p.waitForTimeout(2200);
      const cibles = await p.evaluate((nom) => {
        const out = [];
        for (const el of document.querySelectorAll("h1,h2,h3,p,a,span,div,button,li")) {
          const propre = [...el.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 2);
          if (!propre) continue;
          const t = el.innerText.replace(/\s+/g, " ").trim();
          if (!t.includes(nom) && !t.includes("04 50 11 22 33")) continue;
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.4) continue;
          const r = el.getBoundingClientRect();
          if (r.top < 0 || r.bottom > innerHeight || r.width < 30 || r.height < 10 || r.height > 200) continue;
          out.push({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), t: t.slice(0, 30), couleur: s.color });
          if (out.length >= 4) break;
        }
        return out;
      }, e.nom);
      for (const c of cibles) {
        let png;
        try {
          png = await p.screenshot({ clip: { x: c.x, y: c.y, width: Math.min(c.w, 600), height: c.h } });
        } catch { continue; }
        const rapport = await rapportDe(png);
        if (rapport !== null && rapport < 2.5) {
          griefs.push(`illisible : «${c.t}» ${rapport.toFixed(1)}:1`);
          // La couleur rendue, pour que le correctif sache de quel côté éclairer.
          (couleurs[c.t] ??= c.couleur);
        }
      }

      // 6. Le rendu s'est-il passé sans casse ?
      if (/couldn.t load/i.test(tout)) griefs.push("page plantée");
      if (erreurs.length) griefs.push(`erreur js : ${erreurs[0]}`);
    } catch (x) {
      griefs.push(`épreuve impossible : ${String(x.message).slice(0, 70)}`);
    }
    await p.close();
  }

  const uniques = [...new Set(griefs)];
  registre.push({ id, recu: uniques.length === 0, griefs: uniques, couleurs });
  console.log(`${id.padEnd(12)} ${uniques.length === 0 ? "reçu" : `recalé — ${uniques.slice(0, 3).join(" · ")}`}`.slice(0, 180));
}

await b.close();
if (process.env.REGISTRE) fs.writeFileSync(process.env.REGISTRE, JSON.stringify(registre, null, 1));
const recus = registre.filter((x) => x.recu).length;
console.log(`\n${registre.length} thèmes · ${recus} reçus · ${registre.length - recus} recalés`);
