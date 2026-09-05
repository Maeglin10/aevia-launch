/*
  Les trois contrôles qui manquaient avant de vendre.

    node scripts/qa-final.mjs photos
    node scripts/qa-final.mjs vitesse
    node scripts/qa-final.mjs safari

  · photos  — le client envoie ses images depuis le wizard, et on vérifie
              qu'elles arrivent sur la page. Jamais exercé jusqu'ici : toutes
              les mesures précédentes ont tourné sur les photos du thème.
  · vitesse — combien de temps avant que la page soit utilisable, et combien
              pèse-t-elle. Aucun chiffre n'existait.
  · safari  — le moteur de Safari (WebKit) sur un échantillon : il refuse
              régulièrement ce que Chrome accepte, et la moitié des visiteurs
              d'un site d'artisan arrive d'un iPhone.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const QUOI = process.argv[2] ?? "photos";

const FORM = {
  businessName: "Ateliers Vidal & Fils", businessType: "couvreur",
  tagline: "Zinc, ardoise et tuile plate depuis 1974", city: "Annecy",
  brandColor: "#7c3aed", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93",
};
const PROFIL = {
  services: [
    { name: "Réfection complète de toiture", price: "à partir de 9 400 €", description: "Dépose, charpente vérifiée." },
    { name: "Zinguerie et gouttières", price: "à partir de 780 €", description: "Chéneaux et solins." },
  ],
  keyStats: [{ value: "51", label: "ans d'exploitation" }],
  reputation: { featuredReviews: [{ author: "Hélène Brunet", text: "Toiture refaite en huit jours.", rating: 5 }] },
  legal: { companyAddress: "14 route des Creuses, 74000 Annecy" },
};

async function creerSession(theme, extra = {}) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...FORM, ...extra, template: theme } }),
  });
  const { sessionId, editToken } = await r.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
    body: JSON.stringify({ businessProfile: PROFIL }),
  });
  return sessionId;
}

/* ── Les photos du client ────────────────────────────────────────────────── */

/* Un PNG minuscule d'une couleur franche : reconnaissable à l'œil et au pixel. */
function fabriquerImage(chemin, couleur) {
  const png = Buffer.from(
    couleur === "rouge"
      ? "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
      : "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );
  fs.writeFileSync(chemin, png);
  return chemin;
}

async function testPhotos() {
  const dossier = "/tmp/photos-client";
  fs.mkdirSync(dossier, { recursive: true });
  const img = fabriquerImage(path.join(dossier, "toiture.png"), "rouge");

  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  p.on("pageerror", (e) => console.log("ERREUR PAGE:", String(e).slice(0, 120)));

  await p.goto(`${BASE}/onboarding?theme=impact-331&type=vitrine`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2500);
  await p.locator('button:has-text("Tout accepter")').first().click().catch(() => {});

  await p.locator("input[type=text]").first().fill("Toitures Béranger & Fille");
  const secteur = p.locator("select").first();
  const options = await secteur.locator("option").evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
  if (options.length) await secteur.selectOption(options[0]);
  await p.locator('button:has-text("Continuer")').first().click();
  await p.waitForTimeout(2200);

  /* L'étape des visuels : logo et photos. */
  const entrees = p.locator('input[type="file"]');
  const combien = await entrees.count();
  console.log(`étape « vos visuels » : ${combien} champ(s) de fichier`);
  if (!combien) { console.log("AUCUN CHAMP DE FICHIER — le client ne peut pas envoyer d'image depuis le wizard"); await b.close(); return; }

  for (let i = 0; i < Math.min(combien, 3); i++) {
    await entrees.nth(i).setInputFiles(img).catch((e) => console.log(`champ ${i} refusé : ${String(e).slice(0, 80)}`));
    await p.waitForTimeout(2500);
  }
  const apres = await p.evaluate(() => document.body.innerHTML.length);
  console.log(`après envoi : page de ${apres} caractères`);

  /* Ce que le wizard a retenu : une adresse d'image, ou rien ? */
  const traces = await p.evaluate(() =>
    [...document.querySelectorAll("img")].map((i) => i.src).filter((s) => s.startsWith("blob:") || s.includes("blob.vercel") || s.startsWith("data:")).length,
  );
  console.log(`aperçus d'image affichés dans le wizard : ${traces}`);
  await p.screenshot({ path: "/tmp/photos-client/wizard.png", fullPage: true });
  await b.close();
}

/* ── La vitesse ──────────────────────────────────────────────────────────── */

async function testVitesse() {
  const themes = ["impact-01", "impact-56", "impact-160", "impact-331", "impact-352"];
  const b = await chromium.launch();
  for (const t of themes) {
    const sessionId = await creerSession(t);
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    let octets = 0;
    p.on("response", async (r) => {
      const l = Number(r.headers()["content-length"] ?? 0);
      if (Number.isFinite(l)) octets += l;
    });
    const debut = Date.now();
    await p.goto(`${BASE}/templates/${t}?session=${sessionId}`, { waitUntil: "load", timeout: 60000 });
    const charge = Date.now() - debut;
    const mesures = await p.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0];
      const peint = performance.getEntriesByName("first-contentful-paint")[0];
      return { dom: Math.round(n?.domContentLoadedEventEnd ?? 0), premierPixel: Math.round(peint?.startTime ?? 0) };
    });
    await p.waitForTimeout(3500);
    const images = await p.evaluate(() => document.images.length);
    console.log(`${t.padEnd(12)} chargement ${String(charge).padStart(5)} ms · premier pixel ${String(mesures.premierPixel).padStart(5)} ms · ${images} images · ~${(octets / 1024 / 1024).toFixed(1)} Mo annoncés`);
    await ctx.close();
  }
  await b.close();
}

/* ── Safari ──────────────────────────────────────────────────────────────── */

async function testSafari() {
  const themes = ["impact-01", "impact-05", "impact-56", "impact-160", "impact-213", "impact-331", "impact-347", "impact-352", "impact-373", "impact-380"];
  const b = await webkit.launch();
  for (const t of themes) {
    const sessionId = await creerSession(t);
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const erreurs = [];
    p.on("pageerror", (e) => erreurs.push(String(e).slice(0, 90)));
    try {
      await p.goto(`${BASE}/templates/${t}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(4000);
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
      });
      const vu = await p.evaluate(() => ({
        texte: (document.body.textContent ?? "").length,
        deCote: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        nom: (document.body.textContent ?? "").includes("Ateliers Vidal"),
      }));
      console.log(`${t.padEnd(12)} texte ${String(vu.texte).padStart(6)} · nom ${vu.nom ? "✓" : "✗"} · défile de côté ${vu.deCote ? "OUI" : "non"} · erreurs ${erreurs.length}${erreurs[0] ? " — " + erreurs[0] : ""}`);
    } catch (e) {
      console.log(`${t.padEnd(12)} ÉCHEC : ${String(e).slice(0, 90)}`);
    }
    await ctx.close();
  }
  await b.close();
}

if (QUOI === "photos") await testPhotos();
else if (QUOI === "vitesse") await testVitesse();
else if (QUOI === "safari") await testSafari();
else console.error("photos | vitesse | safari");
