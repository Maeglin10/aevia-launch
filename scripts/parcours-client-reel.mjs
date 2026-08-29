/*
  Le parcours d'un vrai client, de bout en bout.

    node scripts/parcours-client-reel.mjs "Santé" [--payer]

  Toutes les autres mesures créent la session par l'API. Ce n'est pas ce que
  fait un client : il ouvre /configure, choisit son secteur puis son métier,
  remplit sept étapes, choisit un design, attend la génération, regarde
  l'aperçu, commande, paie. Chaque étape peut casser sans que la mesure par
  l'API s'en aperçoive.

  On chronomètre, on photographie ce qu'il voit à chaque étape, et l'on relève
  les erreurs de page et les réponses en échec.
*/
import { chromium } from "playwright";
import fs from "node:fs";
import { clientPour } from "./clients-types.mjs";

const BASE = process.env.BASE ?? "https://launch.aevia.services";
const domaine = process.argv[2] ?? "Services & Artisanat";
const PAYER = process.argv.includes("--payer");
/* Le code d'un vendeur, pour éprouver le parrainage de bout en bout. */
const PARRAINAGE = process.env.PARRAINAGE ?? "DAVID2";
const client = clientPour(domaine);
const SORTIE = `/tmp/parcours/${domaine.replace(/[^A-Za-z]+/g, "-")}`;
fs.mkdirSync(SORTIE, { recursive: true });

const t0 = Date.now();
const jalon = (nom) => console.log(`  ${((Date.now() - t0) / 1000).toFixed(1).padStart(6)} s  ${nom}`);

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 1000 }, locale: "fr-FR" });
const p = await ctx.newPage();
const soucis = [];
p.on("pageerror", (e) => soucis.push("ERREUR DE PAGE : " + String(e).slice(0, 130)));
p.on("response", (r) => {
  if (r.status() >= 400 && !/favicon|auth\/me/.test(r.url())) soucis.push(`${r.status()} ${r.url().replace(BASE, "").slice(0, 80)}`);
});

let n = 0;
const photo = async (nom) => { await p.screenshot({ path: `${SORTIE}/${String(++n).padStart(2, "0")}-${nom}.png`, fullPage: true }); };

/** Cliquer un élément dont le texte est exactement celui-là. */
async function cliquer(texte, { exact = false } = {}) {
  const cible = exact ? p.getByText(texte, { exact: true }) : p.getByText(texte).first();
  await cible.click({ timeout: 8000 });
}

console.log(`\n=== ${domaine} · ${client.form.businessName} · ${BASE} ===`);
await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1500);

/* Le bandeau de cookies couvre le bas de l'écran : un client clique dessus. */
await cliquer("Tout accepter").catch(() => {});
await p.waitForTimeout(500);
jalon("cookies acceptés");
await photo("etape1-secteur");

/* Étape 1 — le secteur. */
await cliquer(domaine);
await p.waitForTimeout(1200);
jalon(`secteur « ${domaine} » choisi`);
await photo("etape1b-metier");

/* Étape 1b — le métier. La première carte de la grille, jamais un bouton de
   navigation : « Continuer » n'est pas un métier. */
const NAV = /continuer|suivant|retour|accepter|refuser|personnaliser|connexion|produits|templates|tarifs|changer|voir le th[èe]me|fran[çc]ais|english|espa|deutsch|portug|mentions|cgv|confidentialit|cookies|contact/i;
/*
  Les cartes du formulaire, et elles seules.

  Une recherche sur toute la page attrapait le sélecteur de langue de l'en-tête
  — « 🇫🇷 FR » a été choisi comme métier. On reste donc dans la colonne du
  formulaire, hors en-tête et hors pied de page.
*/
async function choisirUneCarte() {
  const dans = p.locator("#main-content, main").first();
  const portee = (await dans.count().catch(() => 0)) ? dans : p.locator("body");
  const boutons = await portee.locator("button:visible").elementHandles();
  for (const b of boutons) {
    const t = ((await b.innerText().catch(() => "")) ?? "").trim();
    if (!t || t.length > 90 || NAV.test(t)) continue;
    /* « Changer » ramène au choix du design : ce n'est pas une carte. */
    if (/^changer/i.test(t)) continue;
    if (/[\u{1F1E6}-\u{1F1FF}]/u.test(t)) continue; // un drapeau n'est pas un métier
    const dansEntete = await b.evaluate((e) => Boolean(e.closest("header, footer, nav"))).catch(() => false);
    if (dansEntete) continue;
    await b.click().catch(() => {});
    return t;
  }
  return null;
}
const metier = await choisirUneCarte();
await p.waitForTimeout(800);
jalon(`métier « ${metier ?? "?"} » choisi`);

/** Avancer d'une étape. Rend faux si le bouton n'existe pas ou reste inerte. */
/*
  Avancer d'une étape.

  Le bouton vit dans une barre flottante, parfois en double dans le document —
  une version pour l'ordinateur, une pour le téléphone. Prendre la première
  tombait sur celle qui est masquée, déclarée inerte, et le parcours s'arrêtait
  à l'étape trois en croyant le formulaire bloqué.
*/
async function continuer() {
  for (const nom of ["Continuer", "Suivant", "Personnaliser et commander", "Générer mon site", "Générer", "C'est parti", "Valider", "Payer", "Commander"]) {
    /* Certains « boutons » sont des liens : /order propose « Personnaliser et
       commander » en <a>, et une recherche par rôle bouton ne le voit pas. */
    const tous = [
      ...(await p.getByRole("button", { name: new RegExp(nom, "i") }).elementHandles()),
      ...(await p.getByRole("link", { name: new RegExp(nom, "i") }).elementHandles()),
    ];
    for (const b of tous) {
      if (!(await b.isVisible().catch(() => false))) continue;
      if (!(await b.isEnabled().catch(() => false))) continue;
      /* Le bouton reste rouge vif mais porte aria-disabled tant que l'étape
         n'est pas satisfaite : `isEnabled` ne regarde que la propriété DOM. */
      if ((await b.getAttribute("aria-disabled").catch(() => null)) === "true") continue;
      await b.scrollIntoViewIfNeeded().catch(() => {});
      await b.click().catch(() => {});
      return true;
    }
  }
  return false;
}

/*
  Remplir les champs visibles avec la fiche du client.

  Le repère est l'étiquette affichée — « Nom de l'entreprise », « Ce que vous
  faites », « Ville » — et non l'attribut `name`, que ce formulaire n'emploie
  pas. Chercher par attribut ne remplissait rien et le parcours s'arrêtait à la
  troisième étape en croyant le bouton cassé.
*/
async function remplir() {
  const fiche = {
    nom: client.form.businessName,
    metier: client.form.businessType,
    ville: client.form.city,
    courriel: client.form.email,
    tel: client.form.phone,
    adresse: client.form.address,
    slogan: client.form.tagline,
    presta: client.profil.services.map((x) => x.name).join(", "),
  };

  const remplis = await p.evaluate((f) => {
    const faits = [];
    for (const c of document.querySelectorAll("input, textarea")) {
      const type = (c.getAttribute("type") ?? "text").toLowerCase();
      if (["checkbox", "radio", "file", "hidden", "submit", "color", "range"].includes(type)) continue;
      const r = c.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (String(c.value ?? "").trim()) continue;

      /* L'étiquette : celle qui pointe vers lui, ou le texte juste au-dessus. */
      let etiquette = "";
      if (c.id) etiquette = document.querySelector(`label[for="${CSS.escape(c.id)}"]`)?.textContent ?? "";
      if (!etiquette) etiquette = c.closest("label")?.textContent ?? "";
      if (!etiquette) {
        let n = c.previousElementSibling;
        while (n && !etiquette) { etiquette = (n.textContent ?? "").trim(); n = n.previousElementSibling; }
      }
      if (!etiquette) etiquette = c.parentElement?.textContent ?? "";
      const cle = (etiquette + " " + (c.placeholder ?? "")).toLowerCase();

      let v = "";
      if (/mail|courriel/.test(cle)) v = f.courriel;
      else if (/t[ée]l[ée]?phone|portable/.test(cle)) v = f.tel;
      else if (/ville|city|commune/.test(cle)) v = f.ville;
      else if (/adresse|rue|voie/.test(cle)) v = f.adresse;
      else if (/instagram|facebook|linkedin|site|url|web/.test(cle)) v = "";
      else if (/ce que vous faites|activit|m[ée]tier|description|pr[ée]sent|propos/.test(cle)) v = f.metier + " — " + f.slogan;
      else if (/prestation|service|offre/.test(cle)) v = f.presta;
      else if (/slogan|accroche|phrase/.test(cle)) v = f.slogan;
      else if (/nom|entreprise|soci[ée]t[ée]|raison|cabinet/.test(cle)) v = f.nom;
      if (!v) continue;

      const proto = c instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
      const poser = Object.getOwnPropertyDescriptor(proto.prototype, "value").set;
      poser.call(c, v);
      c.dispatchEvent(new Event("input", { bubbles: true }));
      c.dispatchEvent(new Event("change", { bubbles: true }));
      faits.push(etiquette.replace(/\s+/g, " ").trim().slice(0, 26));
    }
    return faits;
  }, fiche);
  if (remplis.length) jalon(`  rempli : ${remplis.join(" · ")}`);
}

/* Les étapes suivantes : remplir, avancer, photographier — jusqu'à l'aperçu. */
for (let etape = 1; etape <= 12; etape++) {
  await p.waitForTimeout(900);
  await remplir();
  await photo(`etape-${String(etape).padStart(2, "0")}`);
  const titre = await p.locator("text=/étape \\d sur \\d/").first().innerText().catch(() => "");
  const avance = await continuer();
  jalon(`${titre || "étape " + etape} · ${avance ? "avancé" : "AUCUN BOUTON ACTIF"}`);
  if (!avance) {
    /* L'étape attend un choix. Les modèles ne sont pas des <button> mais des
       cartes cliquables : on vise leur titre. */
    const modele = p.getByText(/^Modèle 1$/).first();
    if (await modele.count().catch(() => 0)) {
      await modele.click().catch(() => {});
      await p.waitForTimeout(900);
      jalon("  design « Modèle 1 » choisi");
      if (await continuer()) continue;
    }
    const carte = await choisirUneCarte();
    if (carte) {
      jalon(`  carte « ${carte.replace(/\n/g, " ").slice(0, 40)} » choisie`);
      await p.waitForTimeout(800);
      if (await continuer()) continue;
    }
    const pourquoi = await p.evaluate(() => {
      const t = document.body.innerText;
      return /S[ée]lectionnez[^\n]*/.exec(t)?.[0] ?? /requis|obligatoire|remplis/.exec(t)?.[0] ?? "";
    });
    jalon(`  BLOQUÉ${pourquoi ? " — l'écran dit : " + pourquoi : " sans explication à l'écran"}`);
    break;
  }
  if (/\/preview\//.test(p.url())) { jalon("aperçu atteint"); break; }
}

/* ── La commande, si on la demande ────────────────────────────────── */
if (PAYER && /\/preview\//.test(p.url())) {
  await photo("apercu");
  await p.getByText(/Je veux ce site/i).first().click().catch(() => {});
  await p.waitForTimeout(2500);
  jalon(`commande ouverte · ${p.url().replace(BASE, "")}`);
  await photo("commande");

  /* Le formulaire de commande : mêmes règles, plus le code de parrainage. */
  for (let i = 0; i < 8; i++) {
    await p.waitForTimeout(900);
    await remplir();
    const champ = p.locator("#parrainage");
    if (await champ.count().catch(() => 0)) {
      await champ.fill(PARRAINAGE).catch(() => {});
      jalon(`  code de parrainage saisi : ${PARRAINAGE}`);
    }
    /* Les conditions générales. */
    for (const c of await p.$$("input[type=checkbox]:visible")) {
      if (!(await c.isChecked().catch(() => true))) await c.check().catch(() => {});
    }
    await photo(`commande-${i}`);
    if (!(await continuer())) {
      const payer = p.getByRole("button", { name: /payer|commander|proc[ée]der|valider/i }).last();
      if (await payer.count().catch(() => 0)) { await payer.click().catch(() => {}); jalon("  paiement lancé"); }
      break;
    }
    jalon(`  commande, écran ${i + 1}`);
  }

  await p.waitForTimeout(6000);
  jalon(`redirigé vers ${p.url().slice(0, 60)}`);
  await photo("stripe");

  /* Le paiement Stripe, avec le code à 100 % : aucune carte n'est demandée. */
  if (/checkout\.stripe\.com/.test(p.url())) {
    const promo = p.getByText(/code promo|promotion code|add promotion/i).first();
    if (await promo.count().catch(() => 0)) { await promo.click().catch(() => {}); await p.waitForTimeout(800); }
    const champPromo = p.locator("#promotionCode, input[name='promotionCode']").first();
    if (await champPromo.count().catch(() => 0)) {
      await champPromo.fill(process.env.CODE_PROMO ?? "TESTFINAL100").catch(() => {});
      await p.getByRole("button", { name: /appliquer|apply/i }).first().click().catch(() => {});
      await p.waitForTimeout(3500);
      await p.waitForTimeout(1500);
      const total = await p.evaluate(() => (document.body.innerText.match(/Montant total dû[^\n]*/) ?? [""])[0]);
      const refus = await p.evaluate(() => /n.est pas valide|not valid/i.test(document.body.innerText));
      jalon(`  code appliqué · ${refus ? "REFUSÉ" : "accepté"} · ${total}`);
      await photo("stripe-promo");
    }
    const mail = p.locator("#email").first();
    if (await mail.count().catch(() => 0)) await mail.fill(client.form.email).catch(() => {});
    await p.getByRole("button", { name: /payer|pay|s.abonner|commander/i }).last().click().catch(() => {});
    await p.waitForTimeout(12000);
    jalon(`  après paiement : ${p.url().slice(0, 70)}`);
    await photo("apres-paiement");
  }
}

await photo("final");
console.log(`\n  adresse : ${p.url()}`);
const vu = (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 260);
console.log(`  à l'écran : ${vu}`);
console.log(soucis.length ? `\n  ${soucis.length} soucis :\n    ` + [...new Set(soucis)].slice(0, 8).join("\n    ") : "\n  aucun souci");
await nav.close();
