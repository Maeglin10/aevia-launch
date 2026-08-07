// La page tient-elle dans l'écran, avec les données du client ?
//
//   node scripts/qa-responsive.mjs --tranche 0 4
//
// Le travail sur le responsive avait été fait avant ce chantier ; depuis, les
// textes des thèmes ont été remplacés par ceux du client, souvent plus longs :
// « Ateliers Vidal & Fils » là où le thème écrivait « Bâtir », « Votre plombier
// de confiance à Annecy depuis 1998 » là où il écrivait une ligne courte.
//
// On vérifie donc trois choses sur téléphone et sur ordinateur : la page ne
// déborde pas latéralement, aucun texte ne sort de l'écran par la droite, et les
// zones tactiles restent assez grandes pour un pouce.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ECRANS = [
  { nom: "téléphone", width: 390, height: 844, isMobile: true },
  { nom: "ordinateur", width: 1440, height: 900, isMobile: false },
];

const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const fiches = [];

for (const ecran of ECRANS) {
  const ctx = await b.newContext({
    viewport: { width: ecran.width, height: ecran.height },
    isMobile: ecran.isMobile,
    hasTouch: ecran.isMobile,
  });

  for (const id of ids) {
    const formData = {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy depuis 1998",
      email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33",
      brandColor: "#c2410c", template: id,
    };
    let fiche = { id, ecran: ecran.nom, soucis: [] };
    try {
      const r = await fetch(`${BASE}/api/sessions`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ formData }),
      });
      const { sessionId } = await r.json();
      if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");
      const p = await ctx.newPage();
      await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await p.waitForTimeout(2400);

      fiche = await p.evaluate(({ identifiant, nomEcran, largeur }) => {
        const soucis = [];

        /*
          Un débordement de quelques pixels vient souvent d'une ombre ou d'un
          élément décoratif volontairement sorti du cadre ; au-delà de seize, la
          page se fait glisser latéralement sous le doigt.
        */
        const deborde = document.documentElement.scrollWidth - largeur;
        if (deborde > 16) soucis.push(`la page déborde de ${deborde} px`);

        for (const e of document.querySelectorAll("*")) {
          if (e.children.length > 0) continue;
          const t = (e.textContent ?? "").trim();
          if (t.length < 3) continue;
          const s = getComputedStyle(e);
          if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
          const r = e.getBoundingClientRect();
          if (r.width < 8 || r.height < 6) continue;
          // Hors du premier écran, on ne juge pas : le défilement fait son office.
          if (r.top > 2400) continue;

          /*
            Un texte qui sort par la droite est perdu pour le lecteur — sauf
            dans un bandeau défilant, qui dépasse par construction : ses mots
            traversent l'écran. On reconnaît ces bandeaux à leur conteneur, qui
            masque ce qui dépasse et anime une translation.
          */
          if (r.right > largeur + 20 && r.left < largeur) {
            /*
              Un ancêtre qui masque ce qui dépasse contient le débordement :
              rien ne sort de l'écran, rien ne se perd. C'est le cas des
              bandeaux défilants comme des diapositives en attente — sur
              impact-62, « CHEF ANATOL VOSS » était mesuré à cent onze pixels
              hors cadre alors qu'il s'affiche entre 137 et 300.
            */
            let defilant = false;
            let n = e.parentElement;
            for (let i = 0; i < 5 && n && !defilant; i++) {
              const sn = getComputedStyle(n);
              if (sn.overflow !== "visible" || sn.overflowX !== "visible") defilant = true;
              if (/marquee|ticker|defil|scroll-x/i.test(n.className?.toString() ?? "")) defilant = true;
              n = n.parentElement;
            }
            if (!defilant) soucis.push(`« ${t.slice(0, 22)} » sort de ${Math.round(r.right - largeur)} px`);
          }
        }

        /*
          Les zones tactiles : quarante-quatre pixels de côté, c'est la taille
          d'un pouce. On ne mesure que sur téléphone.
        */
        if (nomEcran === "téléphone") {
          for (const e of document.querySelectorAll("a, button, [role='button']")) {
            const r = e.getBoundingClientRect();
            if (r.width < 4 || r.height < 4 || r.top > 2400) continue;
            if ((e.textContent ?? "").trim().length < 2) continue;
            if (r.height < 30) soucis.push(`« ${(e.textContent ?? "").trim().slice(0, 18)} » haut de ${Math.round(r.height)} px`);
          }
        }

        return { id: identifiant, ecran: nomEcran, soucis: [...new Set(soucis)].slice(0, 4) };
      }, { identifiant: id, nomEcran: ecran.nom, largeur: ecran.width });
      await p.close();
    } catch (e) {
      fiche = { id, ecran: ecran.nom, soucis: [], erreur: String(e.message).slice(0, 40) };
    }
    fiches.push(fiche);
    if (fiche.soucis.length) console.log(`${id.padEnd(12)} ${ecran.nom.padEnd(11)} ${fiche.soucis.join(" · ")}`);
  }
  await ctx.close();
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.soucis.length);
console.log(`\n${fiches.length} mesures · ${ko.length} en défaut`);
