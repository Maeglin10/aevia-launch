// Fabrique, pour chaque thème, la fiche que la revue humaine lira :
//   - une image 3 panneaux (héros / milieu / pied) AVEC les données du client
//   - le texte rendu (textContent visible), pour juger ce qui porte
//
//   SESSIONS_RATE_LIMIT=100000 next start -p 3100
//   AUDIT_BASE=http://localhost:3100 node scripts/_fiche-theme.mjs --sortie DIR [impact-01 ...]
//
// Le profil envoyé est celui de qa-sections (mêmes conteneurs, mêmes champs,
// même logique carte/catalogue) — valeurs impossibles à confondre avec une démo.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3100";
const args = process.argv.slice(2);
const iSortie = args.indexOf("--sortie");
const SORTIE = iSortie >= 0 ? args[iSortie + 1] : "fiches";
fs.mkdirSync(SORTIE, { recursive: true });

let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));
if (ids.length === 0) ids = tous;

const capacites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const BLOCS = {};
for (const m of capacites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  BLOCS[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}

const PHOTO_CLIENT = "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=800";
const DONNEES = {
  services: [
    { name: "Détartrage Vidal", description: "Intervention en moins d'une heure." },
    { name: "Colonne Marquisats", description: "Remplacement complet, garantie dix ans." },
    { name: "Chaudière Bellevaux", description: "Entretien annuel et dépannage." },
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
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  beforeAfter: [
    { caption: "Salle de bain Marquisats", afterUrl: PHOTO_CLIENT },
    { caption: "Chaufferie Bellevaux", afterUrl: PHOTO_CLIENT },
  ],
  menu: [{ name: "Tarte Marquisats", category: "Desserts", description: "Pommes du lac.", price: "8 €" }],
  products: [{ name: "Coffret Bellevaux", description: "Six pièces.", price: "24 €" }],
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });
await ctx.addInitScript(() => { try { localStorage.setItem("aevia-cookie-consent", "accepted"); } catch {} });

for (const id of ids) {
  const formData = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998",
    email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33",
    brandColor: "#c2410c", template: id,
    photoUrls: [PHOTO_CLIENT, PHOTO_CLIENT.replace("w=800", "w=801")],
  };
  const declares = BLOCS[id] ?? [];
  const carteSeule = declares.includes("menu") || declares.includes("produits");
  const businessProfile = {
    services: carteSeule ? [] : DONNEES.services,
    reputation: { featuredReviews: DONNEES.reviews },
    keyStats: DONNEES.keyStats,
    team: DONNEES.team,
    certifications: DONNEES.certifications,
    faq: DONNEES.faq,
    beforeAfter: DONNEES.beforeAfter,
    menu: declares.includes("menu") ? DONNEES.menu : [],
    products: declares.includes("produits") && !declares.includes("menu") ? DONNEES.products : [],
  };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId, editToken } = await r.json();
    if (!sessionId) throw new Error("session non créée");
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile }),
    });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2600);
    const H = await p.evaluate(() => document.body.scrollHeight);
    const shots = [];
    for (const y of [0, Math.max(0, H / 2 - 450), Math.max(0, H - 900)]) {
      await p.evaluate((yy) => window.scrollTo(0, yy), y);
      await p.waitForTimeout(1100);
      shots.push(await p.screenshot({ type: "jpeg", quality: 55 }));
    }
    const panneaux = await Promise.all(shots.map((s) => sharp(s).resize({ width: 640 }).toBuffer()));
    const metas = await Promise.all(panneaux.map((buf) => sharp(buf).metadata()));
    const totalH = metas.reduce((a, m) => a + m.height, 0);
    let y = 0;
    const composite = panneaux.map((buf, i) => { const c = { input: buf, left: 0, top: y }; y += metas[i].height; return c; });
    await sharp({ create: { width: 640, height: totalH, channels: 3, background: "#fff" } })
      .composite(composite).jpeg({ quality: 70 }).toFile(path.join(SORTIE, `${id}.jpg`));
    const { texte, srcs } = await p.evaluate(() => ({
      texte: (document.body.innerText ?? "").replace(/\n{3,}/g, "\n\n"),
      srcs: [...new Set([...document.querySelectorAll("*")].flatMap((e) => {
        const out = [];
        const s = e.getAttribute?.("src"); if (s && /pexels|unsplash/.test(s)) out.push(s.slice(0, 90));
        const bg = getComputedStyle(e).backgroundImage; if (bg && /pexels|unsplash/.test(bg)) out.push(bg.slice(0, 110));
        return out;
      }))].join("\n"),
    }));
    fs.writeFileSync(path.join(SORTIE, `${id}.txt`),
      `déclare: ${declares.join(",") || "(rien)"}\n\n== TEXTE ==\n${texte}\n\n== IMAGES ==\n${srcs}\n`);
    await p.close();
    console.log(id, "ok");
  } catch (e) {
    fs.writeFileSync(path.join(SORTIE, `${id}.txt`), `ERREUR: ${String(e.message)}\n`);
    console.log(id, "ERREUR", String(e.message).slice(0, 60));
  }
}
await b.close();
