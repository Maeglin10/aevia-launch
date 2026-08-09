// Le formulaire est-il agréable à remplir ?
//
//   node scripts/qa-wizard-ergonomie.mjs
//
// Tout le reste mesure ce que le client obtient. Ceci mesure ce qu'il traverse :
// combien d'étapes, combien de champs obligatoires, en combien de temps la page
// répond, et si l'on peut se tromper sans être bloqué.

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const b = await chromium.launch();
const defauts = [];

for (const ecran of [{ nom: "téléphone", w: 390, h: 844, mobile: true }, { nom: "ordinateur", w: 1440, h: 900, mobile: false }]) {
  const ctx = await b.newContext({ viewport: { width: ecran.w, height: ecran.h }, isMobile: ecran.mobile, hasTouch: ecran.mobile });
  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 80)));

  const debut = Date.now();
  await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(2500);
  const chargement = Date.now() - debut;

  const etat = await p.evaluate((largeur) => {
    const visible = (e) => {
      const s = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0;
    };
    const champs = [...document.querySelectorAll("input, select, textarea")].filter(visible);
    const boutons = [...document.querySelectorAll("button, [role='button']")].filter(visible);
    /* Une cible tactile trop petite se rate : quarante-quatre pixels est la règle. */
    const petites = boutons.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.height < 40 && (e.textContent ?? "").trim().length > 0;
    }).length;
    /* Un champ sans étiquette ni intitulé n'est lisible par personne. */
    const sansEtiquette = champs.filter((e) => {
      if (e.type === "hidden") return false;
      const id = e.getAttribute("id");
      const parLabel = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      return !parLabel && !e.getAttribute("aria-label") && !e.getAttribute("placeholder");
    }).length;
    const deborde = document.documentElement.scrollWidth - largeur;
    return {
      champs: champs.length, boutons: boutons.length, petites, sansEtiquette, deborde,
      titre: (document.querySelector("h1, h2")?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
      etape: (document.body.textContent ?? "").match(/étape (\d+) sur (\d+)|step (\d+) of (\d+)/i)?.[0] ?? "non affichée",
    };
  }, ecran.w);

  console.log(`${ecran.nom.padEnd(11)} chargement ${chargement} ms · ${etat.champs} champs · ${etat.boutons} boutons · « ${etat.titre} » · ${etat.etape}`);
  if (erreurs.length) { console.log(`  ERREUR ${erreurs[0]}`); defauts.push(`${ecran.nom} : erreur`); }
  if (chargement > 4000) defauts.push(`${ecran.nom} : ${chargement} ms de chargement`);
  if (etat.deborde > 16) defauts.push(`${ecran.nom} : la page déborde de ${etat.deborde} px`);
  /*
    La règle des quarante-quatre pixels vise le doigt, pas la souris : l'appliquer
    à l'écran d'ordinateur signalait six boutons parfaitement cliquables.
  */
  if (ecran.mobile && etat.petites > 0) defauts.push(`${ecran.nom} : ${etat.petites} bouton(s) sous 40 px de haut`);
  if (etat.sansEtiquette > 0) defauts.push(`${ecran.nom} : ${etat.sansEtiquette} champ(s) sans étiquette`);
  if (etat.etape === "non affichée") defauts.push(`${ecran.nom} : l'avancement n'est pas indiqué`);

  await p.close();
  await ctx.close();
}

await b.close();
console.log(defauts.length ? `\n${defauts.length} défaut(s) :\n  ${defauts.join("\n  ")}` : "\naucun défaut d'ergonomie mesuré");
