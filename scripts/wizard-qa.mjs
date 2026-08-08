// Le wizard, parcouru comme un client.
//
//   node scripts/wizard-qa.mjs [--mobile]
//
// Presque toute la vente se joue ici : un formulaire trop long fait fuir, un
// formulaire trop court ne donne pas de quoi bâtir le site. On parcourt donc les
// sept étapes en client, on capture chacune, et l'on relève ce qui se mesure
// d'une interface :
//
//   - le nombre de champs par étape, et combien sont obligatoires
//   - les champs sans étiquette : un lecteur d'écran n'a alors rien à dire
//   - les cibles trop petites pour un doigt (moins de 44 pixels)
//   - le texte sous seize pixels, illisible sur un téléphone
//   - le défilement nécessaire pour atteindre le bouton « Continuer »
//   - le contraste des textes
//
// Les captures partent dans /tmp/wizard/<étape>-<taille>.jpg.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const SORTIE = process.env.WQA_DIR ?? "/tmp/wizard";
const mobile = process.argv.includes("--mobile");
fs.mkdirSync(SORTIE, { recursive: true });

const vue = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const suffixe = mobile ? "mobile" : "bureau";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: vue, deviceScaleFactor: 1, locale: "fr-FR" });
const p = await ctx.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 120)));

async function releve(nom) {
  await p.waitForTimeout(700);
  const out = await p.evaluate((h) => {
    const res = {
      champs: 0, obligatoires: 0, sansEtiquette: [], petitesCibles: [], petitTexte: [],
      contraste: [], hauteur: document.body.scrollHeight, titre: "", boutons: [],
    };
    res.titre = (document.querySelector("h1, h2")?.innerText ?? "").replace(/\s+/g, " ").trim().slice(0, 70);

    for (const e of document.querySelectorAll("input, textarea, select")) {
      if (e.type === "hidden") continue;
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      res.champs++;
      if (e.required || e.getAttribute("aria-required") === "true") res.obligatoires++;
      const parLabel = e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`);
      const enveloppe = e.closest("label");
      const aria = e.getAttribute("aria-label") || e.getAttribute("aria-labelledby");
      if (!parLabel && !enveloppe && !aria) {
        res.sansEtiquette.push(`${e.tagName.toLowerCase()}[${e.name || e.placeholder || "?"}]`.slice(0, 40));
      }
    }

    for (const e of document.querySelectorAll("button, a[href], input[type=checkbox], input[type=radio], [role=button]")) {
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const s = getComputedStyle(e);
      if (s.visibility === "hidden" || s.display === "none") continue;
      if (r.height < 44 || r.width < 44) {
        res.petitesCibles.push(`${(e.innerText || e.getAttribute("aria-label") || e.type || "?").replace(/\s+/g, " ").trim().slice(0, 24)} ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      if (/continuer|suivant|générer|continue/i.test(e.innerText ?? "")) {
        res.boutons.push({ texte: e.innerText.replace(/\s+/g, " ").trim().slice(0, 30), y: Math.round(r.top + window.scrollY) });
      }
    }

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
    const fondDe = (e) => {
      for (let x = e; x; x = x.parentElement) {
        const s = getComputedStyle(x);
        if (s.backgroundImage && s.backgroundImage !== "none" && /url\(|gradient\(/.test(s.backgroundImage)) return null;
        const l = lum(s.backgroundColor);
        if (l !== null) return l;
      }
      return 1;
    };

    for (const e of document.querySelectorAll("h1,h2,h3,p,span,div,li,a,button,label")) {
      const propre = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 1);
      if (!propre) continue;
      const s = getComputedStyle(e);
      if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.3) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      const taille = parseFloat(s.fontSize);
      if (h && taille < 14 && e.innerText.trim().length > 12) {
        res.petitTexte.push(`${Math.round(taille)}px «${e.innerText.replace(/\s+/g, " ").trim().slice(0, 28)}»`);
      }
      const lt = lum(s.color);
      const lf = fondDe(e);
      if (lt !== null && lf !== null && res.contraste.length < 8) {
        const ratio = (Math.max(lt, lf) + 0.05) / (Math.min(lt, lf) + 0.05);
        if (ratio < 3) res.contraste.push(`«${e.innerText.replace(/\s+/g, " ").trim().slice(0, 26)}» ${ratio.toFixed(1)}:1`);
      }
    }
    res.petitesCibles = [...new Set(res.petitesCibles)].slice(0, 8);
    res.petitTexte = [...new Set(res.petitTexte)].slice(0, 6);
    return res;
  }, mobile);

  await p.screenshot({ path: path.join(SORTIE, `${nom}-${suffixe}.jpg`), type: "jpeg", quality: 68, fullPage: true });
  const defile = out.boutons.length ? Math.max(0, out.boutons[0].y + 60 - vue.height) : 0;
  console.log(
    `${nom.padEnd(14)} «${out.titre}»\n` +
    `   champs ${out.champs} (dont ${out.obligatoires} requis) · hauteur ${out.hauteur}px · défilement avant le bouton ${defile}px\n` +
    (out.sansEtiquette.length ? `   sans étiquette : ${out.sansEtiquette.join(", ")}\n` : "") +
    (out.petitesCibles.length ? `   cibles < 44px : ${out.petitesCibles.join(" · ")}\n` : "") +
    (out.petitTexte.length ? `   texte < 14px : ${out.petitTexte.join(" · ")}\n` : "") +
    (out.contraste.length ? `   contraste < 3:1 : ${out.contraste.slice(0, 3).join(" · ")}\n` : ""),
  );
  return out;
}

await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1800);
// Le client accepte les cookies avant de commencer : sans quoi le bandeau
// couvre le bas du formulaire sur toutes les captures.
for (const nom of ["Tout accepter", "Accept all"]) {
  const bouton = p.getByRole("button", { name: nom });
  if (await bouton.count()) { await bouton.first().click().catch(() => {}); break; }
}
await p.waitForTimeout(600);
const fiches = [];
fiches.push(await releve("etape-1-secteur"));

// On avance en client : premier secteur, premier métier, puis « Continuer ».
for (let etape = 1; etape <= 7; etape++) {
  /*
    Un client remplit d'abord ce qu'on lui demande, puis clique « Continuer ».
    Chercher le bouton d'abord faisait tourner en rond sur « Changer de domaine ».
  */
  const avance = await p.evaluate(() => {
    const vraiChoix = [...document.querySelectorAll("button, [role=button], label")]
      .filter((b) => {
        const r = b.getBoundingClientRect();
        if (r.height < 40 || r.width < 100) return false;
        const t = (b.innerText ?? "").replace(/\s+/g, " ").trim();
        if (!t || t.length > 40) return false;
        return !/continuer|suivant|générer|retour|changer|passer|accepter|refuser|personnaliser/i.test(t);
      });
    /*
      Un choix déjà fait ne se refait pas : sans cette garde, le parcours
      recliquait une carte de modèle à chaque tour et n'atteignait jamais
      l'étape suivante.
    */
    const dejaChoisi = vraiChoix.some((b) => b.getAttribute("aria-pressed") === "true" || /border-red|bg-red/.test(b.className));
    if (vraiChoix.length && !dejaChoisi) {
      const c = vraiChoix[0];
      c.click();
      return `choix « ${c.innerText.replace(/\s+/g, " ").trim().slice(0, 26)} »`;
    }
    return "remplir";
  });

  /*
    Les champs se remplissent par le clavier, pas par un événement fabriqué :
    React n'écoute pas un `input` synthétique posé sur la valeur, et le bouton
    « Continuer » restait grisé tour après tour.
  */
  if (avance === "remplir") {
    const champs = await p.$$("input[type=text], input[type=email], input[type=tel], input:not([type]), textarea");
    for (const champ of champs) {
      const dejaRempli = await champ.inputValue().catch(() => "x");
      if (dejaRempli) continue;
      const indice = ((await champ.getAttribute("placeholder")) ?? (await champ.getAttribute("name")) ?? "").toLowerCase();
      const valeur = /mail|@/.test(indice) ? "marie@ateliers-vidal.fr"
        : /t[ée]l|phone|06|04/.test(indice) ? "04 50 11 22 33"
        : /ville|city|lyon|paris/.test(indice) ? "Annecy"
        : /instagram|@/.test(indice) ? "ateliersvidal"
        : /siret|siren/.test(indice) ? "85254622500017"
        : /adresse|rue/.test(indice) ? "12 rue des Alpes, Annecy"
        : /accompagn|faites|activit/.test(indice) ? "Plomberie, chauffage et salles de bain à Annecy depuis 1998."
        : "Ateliers Vidal & Fils";
      await champ.fill(valeur).catch(() => {});
    }
    for (const c of await p.$$("input[type=checkbox]")) await c.check().catch(() => {});
    await p.waitForTimeout(300);
    const suite = await p.evaluate(() => {
      const b = [...document.querySelectorAll("button")]
        .find((x) => /continuer|suivant|générer/i.test(x.innerText) && !x.disabled && x.getAttribute("aria-disabled") !== "true");
      if (b) { b.click(); return "continuer"; }
      return null;
    });
    if (!suite) { console.log(`(bloqué à l'étape ${etape} : « Continuer » reste inactif)`); break; }
  }
  if (!avance) { console.log(`(bloqué à l'étape ${etape} : aucun bouton actif)`); break; }
  await p.waitForTimeout(1200);
  fiches.push(await releve(`etape-${etape + 1}`));
}

if (erreurs.length) console.log("erreurs js :", [...new Set(erreurs)].slice(0, 3).join(" | "));
await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
