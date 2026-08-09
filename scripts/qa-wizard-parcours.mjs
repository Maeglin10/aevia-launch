// Le formulaire, traversé comme le ferait un client.
//
//   node scripts/qa-wizard-parcours.mjs [--telephone]
//
// On clique réellement : le métier, le modèle, les champs, jusqu'au bout. On
// note ce qui bloque, ce qui met trop de temps, et si la page finale porte bien
// ce qui a été saisi.

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const telephone = process.argv.includes("--telephone");
const b = await chromium.launch();
const ctx = await b.newContext(
  telephone
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
    : { viewport: { width: 1440, height: 900 } },
);
const p = await ctx.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 90)));

const etapes = [];
const noter = (nom, debut) => etapes.push(`${nom} ${Date.now() - debut} ms`);

let t = Date.now();
await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(2200);
noter("arrivée", t);

/* Étape 1 — le domaine, puis le métier. */
t = Date.now();
const domaine = p.getByText("Artisanat & Bâtiment", { exact: false }).first();
if (await domaine.count()) await domaine.click();
else await p.locator("button").filter({ hasText: /bâtiment|artisan/i }).first().click();
await p.waitForTimeout(900);
const metier = p.locator("button").filter({ hasText: /^Plombier/i }).first();
if (!(await metier.count())) throw new Error("le métier « Plombier » ne se trouve pas à l'étape 1");
await metier.click();
await p.waitForTimeout(1400);
noter("métier choisi", t);

/* Étape 2 — le modèle. */
t = Date.now();
const modeles = p.locator("button[aria-pressed]");
const combien = await modeles.count();
if (combien < 5) throw new Error(`seulement ${combien} modèles proposés au plombier`);
await modeles.first().click();
await p.waitForTimeout(600);
const continuer = p.getByRole("button", { name: /continuer/i }).first();
await continuer.click();
await p.waitForTimeout(1200);
noter(`modèle choisi parmi ${combien}`, t);

/* Étape 3 — l'entreprise. */
t = Date.now();
const remplir = async (etiquette, valeur) => {
  const champ = p.locator(`input, textarea`).filter({ hasNot: p.locator("[type=hidden]") });
  const cible = p.getByLabel(etiquette, { exact: false }).first();
  if (await cible.count()) { await cible.fill(valeur); return true; }
  const parPlaceholder = p.getByPlaceholder(etiquette, { exact: false }).first();
  if (await parPlaceholder.count()) { await parPlaceholder.fill(valeur); return true; }
  return false;
};
/*
  Tout ce que le formulaire réclame, dans l'ordre où il le réclame. Remplir à
  moitié bloquait sur « Continuer » et l'on ne voyait jamais la suite.
*/
const champsRemplis = [];
for (const [etiquette, valeur] of [
  ["Nom de l'entreprise", "Ateliers Vidal & Fils"],
  ["Ce que vous faites", "Plomberie, chauffage et énergies renouvelables à Annecy"],
  ["Ville", "Annecy"],
  ["Service principal", "Dépannage d'urgence en moins d'une heure"],
  ["Gamme de prix", "À partir de 90 €"],
  ["Adresse e-mail", "contact@ateliers-vidal.fr"],
  ["Téléphone", "04 50 11 22 33"],
]) if (await remplir(etiquette, valeur)) champsRemplis.push(etiquette);

/* Les avantages sont trois champs de même intitulé. */
const avantages = p.getByPlaceholder(/avantage/i);
for (let i = 0; i < await avantages.count() && i < 3; i++) {
  await avantages.nth(i).fill(["Intervention en 1 h", "Devis gratuit", "Garantie décennale"][i]);
}
await p.waitForTimeout(400);
noter(`entreprise remplie (${champsRemplis.length} champs)`, t);

/* On avance tant qu'un bouton « Continuer » est proposé. */
for (let i = 0; i < 6; i++) {
  const suivant = p.getByRole("button", { name: /continuer|générer/i }).first();
  if (!(await suivant.count())) break;
  const libelle = (await suivant.textContent())?.trim() ?? "";
  const avant = Date.now();
  await suivant.click().catch(() => {});
  await p.waitForTimeout(1400);
  /*
    Un message d'erreur, et non l'indication « (requis) » que porte chaque
    étiquette : les compter ensemble faisait croire à un blocage alors que le
    formulaire avançait normalement.
  */
  const bloque = await p.locator("text=/est requis|est requise|Choisissez votre activité|Sélectionnez un design|Saisissez une adresse/i").count();
  noter(`« ${libelle} » ${bloque ? `(${bloque} champ(s) requis)` : ""}`, avant);
  if (bloque) break;
}

const fin = await p.evaluate(() => ({
  url: location.pathname,
  titre: (document.querySelector("h1, h2")?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
}));

await b.close();
console.log(`écran : ${telephone ? "téléphone" : "ordinateur"}`);
for (const e of etapes) console.log(`  ${e}`);
console.log(`  arrivée finale : ${fin.url} — « ${fin.titre} »`);
if (erreurs.length) console.log(`  ERREUR ${erreurs[0]}`);
