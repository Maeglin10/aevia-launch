// Le parcours d'un client, du premier écran jusqu'à son site.
//
//   node scripts/parcours-client.mjs plombier coiffeur restaurant
//   node scripts/parcours-client.mjs --tous
//
// Le harnais pose les données dans la session par l'interface de programmation :
// il dit si un thème sait les afficher, pas si le client sait les saisir. Ici on
// remplit le wizard au clavier, écran par écran, comme le ferait quelqu'un qui
// achète — puis on vérifie que ce qu'il a écrit se retrouve sur son site.
//
// Chaque métier reçoit sa propre entreprise et ses propres photos, différentes
// de celles des thèmes : c'est la seule façon de voir ce qui n'a pas bougé.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const SORTIE = process.env.PARCOURS_DIR ?? "/tmp/parcours";
fs.mkdirSync(SORTIE, { recursive: true });

const args = process.argv.slice(2);
let metiers = args.filter((a) => !a.startsWith("--"));
if (args.includes("--tous")) {
  const src = fs.readFileSync(path.join(process.cwd(), "lib/wizard/archetypes.ts"), "utf8");
  const bloc = src.slice(src.indexOf("NICHE_ARCHETYPE"));
  metiers = [...new Set([...bloc.matchAll(/(\w+):\s*"\w+"/g)].map((m) => m[1]))];
}
if (metiers.length === 0) metiers = ["plombier"];

// Une entreprise par métier, et des mots qu'aucun thème n'emploie.
const ENTREPRISES = {
  plombier: { nom: "Ateliers Vidal & Fils", ville: "Annecy", quoi: "Plomberie, chauffage et salles de bain depuis 1998" },
  coiffeur: { nom: "Maison Bonnefoy", ville: "Chambéry", quoi: "Coupe, couleur et soins du cheveu, sur rendez-vous" },
  restaurant: { nom: "Le Comptoir des Alpes", ville: "Valence", quoi: "Cuisine de saison, produits des fermes voisines" },
  avocat: { nom: "Cabinet Ferrand & Associés", ville: "Grenoble", quoi: "Droit du travail et droit des sociétés" },
  photographe: { nom: "Studio Margaux Vernet", ville: "Voiron", quoi: "Portraits, mariages et reportages d'entreprise" },
  architecte: { nom: "Atelier Roux Architecture", ville: "Albertville", quoi: "Maisons individuelles et réhabilitation" },
  hotel: { nom: "Les Terrasses du Lac", ville: "Aix-les-Bains", quoi: "Dix-huit chambres face au lac, table d'hôtes" },
  fleuriste: { nom: "Racines & Compagnie", ville: "Rumilly", quoi: "Bouquets de saison et compositions pour événements" },
};
const parDefaut = (m) => ({
  nom: `Maison ${m[0].toUpperCase()}${m.slice(1)}`, ville: "Annecy",
  quoi: `Notre métier : ${m}, à Annecy et alentour`,
});

// id → libellé affiché, et id → domaine, lus dans la source des niches.
const LIBELLES = {};
const DOMAINE_DE = {};
{
  const src = fs.readFileSync(path.join(process.cwd(), "lib/templates/sectors.ts"), "utf8");
  const debut = src.indexOf("export const INDUSTRIES");
  const bloc = src.slice(debut, src.indexOf("\n];", debut));
  let domaine = null;
  for (const ligne of bloc.split("\n")) {
    // Le domaine s'ouvre par son identifiant, seul sur sa ligne.
    const dom = /^\s*id:\s*'([\w_-]+)',\s*$/.exec(ligne);
    if (dom) { domaine = dom[1]; continue; }
    const domLabel = /^\s*label:\s*'((?:[^'\\]|\\.)*)',\s*$/.exec(ligne);
    if (domLabel && domaine && !LIBELLES[domaine]) { LIBELLES[domaine] = domLabel[1].replace(/\\'/g, "'"); continue; }
    // Une spécialité tient sur une ligne : identifiant puis libellé.
    const spec = /\{\s*id:\s*'([\w_-]+)',\s*label:\s*'((?:[^'\\]|\\.)*)'/.exec(ligne);
    if (spec) {
      LIBELLES[spec[1]] = spec[2].replace(/\\'/g, "'");
      DOMAINE_DE[spec[1]] = domaine;
    }
  }
}

const b = await chromium.launch();
const fiches = [];

for (const metier of metiers) {
  const e = ENTREPRISES[metier] ?? parDefaut(metier);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "fr-FR" });
  const p = await ctx.newPage();
  const griefs = [];
  const erreurs = [];
  p.on("pageerror", (x) => erreurs.push(String(x.message).slice(0, 90)));

  try {
    await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(1800);
    for (const nom of ["Tout accepter", "Accept all"]) {
      const bouton = p.getByRole("button", { name: nom });
      if (await bouton.count()) { await bouton.first().click().catch(() => {}); break; }
    }
    await p.waitForTimeout(500);

    /*
      Le client choisit son domaine puis son métier. On clique le libellé exact
      plutôt que la première carte venue : c'est ce métier-là qu'on teste.
    */
    /*
      Les boutons de l'en-tête — « Produits », « Connexion » — sont des boutons
      comme les autres pour un automate : sans les écarter, le parcours quittait
      le tunnel dès le premier clic. On ne regarde donc que les cartes du
      formulaire, celles qui portent un libellé de domaine ou de métier.
    */
    /*
      Les libellés se lisent dans la source des niches : les recopier ici, c'est
      les voir se démoder dès qu'un métier s'ajoute.
    */
    const cible = LIBELLES[metier] ?? metier;
    const domaineDe = DOMAINE_DE[metier];

    const cliqueDansLeFormulaire = async (motif) => p.evaluate((m) => {
      const norm = (s) => (s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const cherche = norm(m);
      const cartes = [...document.querySelectorAll("button")].filter((b) => {
        if (b.closest("header, nav, footer")) return false;
        const r = b.getBoundingClientRect();
        return r.height >= 36 && r.width >= 80;
      });
      const c = cartes.find((b) => norm(b.innerText).startsWith(cherche.slice(0, 7)));
      if (c) { c.click(); return true; }
      return false;
    }, motif);

    let choisi = false;
    if (domaineDe && LIBELLES[domaineDe]) {
      if (await cliqueDansLeFormulaire(LIBELLES[domaineDe])) {
        await p.waitForTimeout(900);
        choisi = await cliqueDansLeFormulaire(cible);
      }
    }
    if (!choisi) {
      const domaines = Object.values(LIBELLES).slice(0, 40);
      for (const d of domaines) {
        if (!(await cliqueDansLeFormulaire(d))) continue;
        await p.waitForTimeout(900);
        if (await cliqueDansLeFormulaire(cible)) { choisi = true; break; }
        const retour = p.getByRole("button", { name: /changer de domaine/i });
        if (await retour.count()) await retour.first().click().catch(() => {});
        await p.waitForTimeout(500);
      }
    }
    if (!choisi) griefs.push(`métier « ${cible} » introuvable dans le wizard`);
    await p.waitForTimeout(1400);

    // Le design : la première proposition, puis on avance.
    await p.evaluate(() => {
      const c = [...document.querySelectorAll("button[aria-pressed]")][0];
      if (c) c.click();
    });
    await p.waitForTimeout(600);

    // On remplit tout ce qui se présente, écran après écran.
    const saisi = {};
    for (let ecran = 0; ecran < 10; ecran++) {
      const champs = await p.$$("input[type=text], input[type=email], input[type=tel], input[type=url], input:not([type]), textarea");
      for (const champ of champs) {
        const deja = await champ.inputValue().catch(() => "x");
        if (deja) continue;
        /*
          L'étiquette d'abord, le repère de saisie ensuite : « Ville » se lit dans
          le libellé, tandis que le repère dit « Lyon, France » — et le parcours
          y écrivait le nom de l'entreprise. Les étiquettes sont liées à leur
          champ depuis la passe d'accessibilité ; autant s'en servir.
        */
        const etiquette = await champ.evaluate((el) => {
          const par = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          const dans = el.closest("label");
          return (par?.innerText ?? dans?.innerText ?? el.getAttribute("aria-label") ?? "").trim();
        }).catch(() => "");
        const repere = (await champ.getAttribute("placeholder")) ?? "";
        const indice = `${etiquette} ${repere}`.toLowerCase();
        let valeur = e.nom;
        if (/mail|@/.test(indice)) valeur = `contact@${metier}-test.fr`;
        else if (/t[ée]l|phone|04|06/.test(indice)) valeur = "04 50 11 22 33";
        else if (/ville|city|lyon|paris/.test(indice)) valeur = e.ville;
        else if (/adresse|rue/.test(indice)) valeur = `12 rue des Alpes, ${e.ville}`;
        else if (/prix|€|tarif/.test(indice)) valeur = "137 €";
        else if (/dur[ée]e/.test(indice)) valeur = "1 h";
        else if (/question/.test(indice)) valeur = `Intervenez-vous le week-end ?`;
        else if (/r[ée]ponse/.test(indice)) valeur = "Oui, sur rendez-vous.";
        else if (/ann[ée]es|chiffre|nombre/.test(indice)) valeur = "27";
        else if (/label|certif/.test(indice)) valeur = "Label Qualité";
        else if (/nom de la prestation|prestation|ex\./.test(indice)) valeur = `Prestation ${metier}`;
        else if (/faites|activit|accompagn|description/.test(indice)) valeur = e.quoi;
        else if (/lien|http/.test(indice)) valeur = "https://exemple.fr/rendez-vous";
        await champ.fill(valeur).catch(() => {});
        saisi[indice.slice(0, 24) || "champ"] = valeur;
      }
      for (const c of await p.$$("input[type=checkbox]")) await c.check().catch(() => {});

      const avance = await p.evaluate(() => {
        const btn = [...document.querySelectorAll("button")]
          .find((x) => /continuer|générer mon site|generate/i.test(x.innerText) && !x.disabled && x.getAttribute("aria-disabled") !== "true");
        if (!btn) return null;
        const dernier = /générer|generate/i.test(btn.innerText);
        btn.click();
        return dernier ? "génération" : "suivant";
      });
      if (!avance) { griefs.push(`bloqué à l'écran ${ecran + 1}`); break; }
      if (avance === "génération") break;
      await p.waitForTimeout(1200);
    }

    // Le site du client, enfin.
    await p.waitForURL(/\/preview\//, { timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(4000);
    const url = p.url();
    if (!/\/preview\//.test(url)) griefs.push("l'aperçu n'a pas été atteint");

    /*
      L'aperçu montre le site dans un cadre : lire le corps de la page d'aperçu
      ne donne que la barre d'outils, et le nom du client y paraissait absent
      alors qu'il s'affiche en grand dans le cadre.
    */
    const lire = async (cadre) => cadre.evaluate(async () => {
      const bouts = [];
      for (let y = 0; y < document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
        bouts.push(document.body.innerText);
      }
      return bouts.join("\n");
    }).catch(() => "");
    let texte = await lire(p);
    for (const cadre of p.frames()) {
      if (cadre === p.mainFrame()) continue;
      texte += `\n${await lire(cadre)}`;
    }
    const plat = texte.toLowerCase().replace(/\s+/g, " ");

    // Ce que le client a écrit doit se lire sur son site.
    for (const [quoi, valeur] of Object.entries({ nom: e.nom, ville: e.ville })) {
      if (!plat.includes(valeur.toLowerCase())) griefs.push(`${quoi} absent de l'aperçu`);
    }
    if (erreurs.length) griefs.push(`erreur js : ${erreurs[0]}`);

    await p.screenshot({ path: path.join(SORTIE, `${metier}.jpg`), type: "jpeg", quality: 62, fullPage: true }).catch(() => {});
    fiches.push({ metier, url, griefs, champs: Object.keys(saisi).length });
  } catch (x) {
    griefs.push(`parcours interrompu : ${String(x.message).slice(0, 70)}`);
    fiches.push({ metier, griefs, champs: 0 });
  }
  await ctx.close();
  const f = fiches[fiches.length - 1];
  console.log(`${metier.padEnd(16)} ${f.champs} champs remplis · ${f.griefs.length ? f.griefs.join(" · ") : "site conforme"}`.slice(0, 175));
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.griefs.length);
console.log(`\n${fiches.length} parcours · ${fiches.length - ko.length} conformes · ${ko.length} à revoir`);
