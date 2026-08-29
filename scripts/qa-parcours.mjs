/*
  Le parcours d'un vrai client, de bout en bout.

    node scripts/qa-parcours.mjs [--secteurs plombier,dentiste] [--tous]

  Tout ce qui a été mesuré jusqu'ici partait d'une session fabriquée à la main.
  Personne n'avait suivi le chemin que suit un client : /configure, ses sept
  étapes, le choix du design, puis l'aperçu. C'est pourtant là que se décide ce
  qu'il reçoit — et c'est là qu'on a découvert qu'entrer par la mauvaise porte
  livrait un site générique sans sections.

  On remplit donc chaque étape comme un client consciencieux, secteur par
  secteur, et l'on regarde ce qui s'affiche.
*/
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };

const CLIENT = {
  nom: "Ateliers Vidal & Fils",
  accroche: "Zinc, ardoise et tuile plate depuis 1974",
  description: "Trois générations de couvreurs zingueurs, à Annecy et dans tout le bassin annécien.",
  ville: "Annecy",
  telephone: "04 50 71 82 93",
  courriel: "contact@ateliers-vidal.fr",
  adresse: "14 route des Creuses, 74000 Annecy",
  instagram: "@ateliersvidal",
};

/* Remplir un champ selon ce qu'il demande, jamais au hasard. */
function valeurPour(indice) {
  const t = indice.toLowerCase();
  if (/instagram|@ha/.test(t)) return CLIENT.instagram;
  /* Ce qu'un client laisse vide : les champs techniques et facultatifs. Les
     remplir au nom de l'entreprise, comme le faisait ce script, produit des
     données absurdes et bloque parfois l'étape. */
  if (/linkedin|url|https?:|analytics|search console|gtm|g-|tag manager|facultatif|optionnel/.test(t)) return "";
  if (/mail|contact@/.test(t)) return CLIENT.courriel;
  if (/tél|phone|\+33|06 |0 6/.test(t)) return CLIENT.telephone;
  if (/adresse|rue|siège/.test(t)) return CLIENT.adresse;
  if (/ville|city/.test(t)) return CLIENT.ville;
  if (/prix|tarif|€|montant/.test(t)) return "à partir de 9 400 €";
  if (/durée/.test(t)) return "3 jours";
  if (/nom du service|prestation|service/.test(t)) return "Réfection complète de toiture";
  if (/description courte|desc/.test(t)) return "Dépose, charpente vérifiée, couverture neuve garantie dix ans.";
  if (/accroche|slogan|tagline/.test(t)) return CLIENT.accroche;
  if (/décrivez|histoire|à propos|présent/.test(t)) return CLIENT.description;
  if (/nom|entreprise|société|company/.test(t)) return CLIENT.nom;
  if (/avis|témoignage|client dit/.test(t)) return "Toiture refaite en huit jours, chantier impeccable.";
  if (/auteur|prénom/.test(t)) return "Hélène Brunet";
  if (/question/.test(t)) return "Intervenez-vous en urgence ?";
  if (/réponse/.test(t)) return "Oui, sous 24 h sur le bassin annécien.";
  if (/horaire|ouvert/.test(t)) return "8h – 19h";
  if (/siret|siren/.test(t)) return "852 546 225 00018";
  return CLIENT.nom;
}

async function remplirEtape(page) {
  /*
     Les listes se créent avant de se remplir : prestations, réalisations,
     équipe, produits, avis, questions. Un client clique « Ajouter » puis écrit.
     Sans ce geste, l'étape se franchit vide — et le site reçoit l'exemple du
     thème, ce qui est précisément le défaut qu'on cherche.
  */
  for (const a of await page.$$('#main-content button:has-text("Ajouter")')) {
    if (!(await a.isVisible().catch(() => false))) continue;
    await a.click().catch(() => {});
    await page.waitForTimeout(250);
  }
  for (const c of await page.$$("input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), textarea")) {
    if (!(await c.isVisible().catch(() => false))) continue;
    if (await c.inputValue().catch(() => "")) continue;
    /*
       L'indice, c'est d'abord ce que le client lit : l'étiquette au-dessus du
       champ. Se fier au seul « placeholder » écrivait le nom de l'entreprise
       dans « Google Analytics » et « Instagram », faute d'indice.
    */
    const indice = await c.evaluate((el) => {
      const bouts = [el.getAttribute("placeholder"), el.getAttribute("name"), el.getAttribute("aria-label")];
      if (el.id) {
        const l = document.querySelector(`label[for="${el.id}"]`);
        if (l) bouts.push(l.textContent);
      }
      let parent = el.parentElement;
      for (let i = 0; i < 3 && parent; i++, parent = parent.parentElement) {
        const l = parent.querySelector("label");
        if (l) { bouts.push(l.textContent); break; }
        /* Beaucoup d'étapes n'emploient pas <label> : l'étiquette est le texte
           du bloc qui précède immédiatement le champ. */
        const prec = el.previousElementSibling;
        if (prec && !prec.querySelector("input,textarea")) bouts.push(prec.textContent);
      }
      return bouts.filter(Boolean).join(" ").slice(0, 160);
    });
    const v = valeurPour(indice || "nom");
    if (v) await c.fill(v).catch(() => {});
  }
  for (const s of await page.$$("select")) {
    if (!(await s.isVisible().catch(() => false))) continue;
    if (await s.inputValue().catch(() => "")) continue;
    const vs = await s.$$eval("option", (os) => os.map((o) => o.value).filter(Boolean));
    if (vs.length) await s.selectOption(vs[0]).catch(() => {});
  }
  for (const cb of await page.$$("input[type=checkbox]")) {
    if (await cb.isVisible().catch(() => false)) await cb.check().catch(() => {});
  }
}

export async function parcours(page, { domaine, secteur } = {}) {
  await page.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const ck = await page.$('button:has-text("Tout accepter")');
  if (ck) { await ck.click(); await page.waitForTimeout(500); }

  const journal = [];
  let theme = null;

  /* Cliquer une carte dont le texte contient l'étiquette voulue, sinon la première. */
  const cliquerCarte = async (etiquette) => {
    /* Uniquement le corps du formulaire : l'en-tête porte le sélecteur de
       langue, que le premier balayage cliquait en boucle. */
    const cartes = await page.$$("#main-content button:not(header button)");
    const visibles = [];
    for (const c of cartes) {
      if (!(await c.isVisible().catch(() => false))) continue;
      const t = ((await c.textContent()) ?? "").trim();
      if (!t || /Suivant|Continuer|Retour|Tout accepter|Connexion|Produits|Changer|Ajouter/i.test(t)) continue;
      visibles.push([c, t]);
    }
    if (!visibles.length) return null;
    const choix = etiquette
      ? visibles.find(([, t]) => t.toLowerCase().includes(etiquette.toLowerCase())) ?? visibles[0]
      : visibles[0];
    await choix[0].click().catch(() => {});
    await page.waitForTimeout(1400);
    return choix[1];
  };

  for (let etape = 1; etape <= 12; etape++) {
    await remplirEtape(page);

    const suivant = await page.$('#main-content button:has-text("Suivant"), #main-content button:has-text("Continuer"), #main-content button:has-text("Terminer"), #main-content button:has-text("Créer mon site"), #main-content button:has-text("Générer")');

    /* Certaines étapes se franchissent d'un clic sur une carte : le domaine, le
       métier, le design. Le bouton n'y est pas, ou reste inactif tant que rien
       n'est choisi. On choisit d'abord, on avance ensuite. */
    if (!suivant || !(await suivant.isEnabled())) {
      const etiquette = etape === 1 ? domaine : etape === 2 ? secteur : null;
      const pris = await cliquerCarte(etiquette);
      if (pris) {
        journal.push(`${etape}:${pris.slice(0, 26)}`);
        if (/impact-/.test(pris)) theme = (pris.match(/impact-\d+/) ?? [])[0] ?? null;
        const encore = await page.$('#main-content button:has-text("Continuer"), #main-content button:has-text("Suivant")');
        if (encore && (await encore.isEnabled())) { await encore.click(); await page.waitForTimeout(2600); }
        if (/\/preview\//.test(page.url())) { journal.push(`aperçu à l'étape ${etape}`); break; }
        continue;
      }
      const manque = await page.$$eval("#main-content", (n) =>
        ((n[0]?.innerText ?? "").match(/[^\n]*(requis|obligatoire|renseigner|manque|choisis)[^\n]*/i) ?? [""])[0]);
      journal.push(`étape ${etape} : bloqué${manque ? " — " + manque.slice(0, 70) : ""}`);
      break;
    }

    await suivant.click();
    await page.waitForTimeout(2800);
    if (/\/preview\//.test(page.url())) { journal.push(`aperçu à l'étape ${etape}`); break; }
  }

  /* Le thème réellement retenu, lu dans la session. */
  const id = (page.url().match(/\/preview\/([\w-]+)/) ?? [])[1];
  if (id) {
    try {
      const r = await fetch(`${BASE}/api/sessions?id=${id}`);
      if (r.ok) theme = (await r.json())?.formData?.template ?? theme;
    } catch {}
  }
  /* Ce que le client voit à l'arrivée : son thème, son nom, et ce qui manque. */
  let rendu = null;
  if (/\/preview\//.test(page.url())) {
    await page.waitForTimeout(3500);
    rendu = await page.evaluate(() => {
      const f = document.querySelector("iframe");
      const pastille = document.querySelector('button[aria-label*="compléter"], button[aria-label*="fill"]');
      const manques = document.querySelectorAll("li.rounded-full").length;
      return {
        cadre: f?.getAttribute("src") ?? null,
        erreur: /pas été enregistré/.test(document.body.innerText),
        manques: pastille ? Number((pastille.textContent ?? "").match(/\d+/)?.[0] ?? 0) : manques,
      };
    });
    if (rendu.cadre) {
      const cadre = page.frames().find((x) => x.url().includes("/templates/"));
      if (cadre) {
        await page.waitForTimeout(1500);
        rendu.nomVisible = await cadre.evaluate(() => document.body.innerText.includes("Ateliers Vidal")).catch(() => false);
        rendu.sections = await cadre.evaluate(() => document.querySelectorAll("section, [id]").length).catch(() => 0);
      }
    }
  }
  return { url: page.url(), journal, theme, sessionId: id ?? null, rendu };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const nav = await chromium.launch();
  const page = await (await nav.newContext({ viewport: { width: 1440, height: 950 } })).newPage();
  const r = await parcours(page, { domaine: arg("domaine", null), secteur: arg("secteur", null) });
  console.log(r.journal.join(" | "));
  console.log("URL :", r.url.slice(0, 90), "· thème :", r.theme ?? "aucun");
  if (r.rendu) console.log("rendu :", JSON.stringify(r.rendu));
  await page.screenshot({ path: "/tmp/parcours.png", fullPage: false });
  await nav.close();
}
