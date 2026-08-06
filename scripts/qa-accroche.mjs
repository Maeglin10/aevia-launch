// La phrase du client se lit-elle une fois, et une seule ?
//
//   node scripts/qa-accroche.mjs --tranche 0 4
//
// Sur impact-182, l'accroche s'affichait deux fois de suite, dont une en gris
// sur une photo grise. Sur impact-123, trois fois. Sur impact-19, pas du tout —
// le client avait écrit une phrase que son site ne montrait nulle part.
//
// On remplit donc le wizard comme un client, et l'on compte. Zéro est un défaut
// autant que trois : ce qu'il a écrit doit se lire, et ne se lire qu'une fois.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ACCROCHE = "Votre plombier de confiance à Annecy depuis 1998";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  const formData = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: ACCROCHE, email: `contact@${id}.fr`, phone: "04 50 11 22 33",
    brandColor: "#c2410c", template: id,
  };
  let fiche = { id, fois: -1 };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId } = await r.json();
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2200);
    fiche = await p.evaluate(({ identifiant, accroche }) => {
      /*
        Beaucoup de thèmes mettent leurs paragraphes en capitales par la feuille
        de style, et « innerText » rend le texte tel qu'il s'affiche. Comparer
        au caractère près faisait donc conclure que la phrase du client était
        absente d'impact-06, 07, 08 et de vingt autres — alors qu'elle s'y lit,
        en majuscules.
      */
      /*
        Un titre répartit la phrase sur plusieurs lignes — « Votre plombier / de
        confiance à Annecy / depuis 1998 » — et « innerText » y met des sauts de
        ligne. Chercher la phrase telle qu'elle a été saisie ne la trouvait donc
        pas, alors qu'elle se lit entièrement à l'écran.
      */
      const texte = (document.body.innerText ?? "").toLowerCase().replace(/\s+/g, " ");
      const cherche = accroche.toLowerCase().replace(/\s+/g, " ");
      let fois = 0, i = 0;
      while ((i = texte.indexOf(cherche, i)) >= 0) { fois++; i += cherche.length; }

      /*
        Zéro n'est pas toujours un défaut : quand le gabarit du titre est trop
        étroit, le contrat n'en garde qu'un morceau — « Votre plombier de
        confiance » — et c'est très bien ainsi. On cherche donc aussi le début
        de la phrase.
      */
      const debut = cherche.slice(0, 26);
      const partiel = texte.includes(debut);
      return { id: identifiant, fois, partiel };
    }, { identifiant: id, accroche: ACCROCHE });
    await p.close();
  } catch (e) {
    fiche = { id, fois: -1, erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (fiche.fois > 1) console.log(`${id.padEnd(12)} l'accroche s'affiche ${fiche.fois} fois`);
  else if (fiche.fois === 0 && !fiche.partiel) console.log(`${id.padEnd(12)} l'accroche ne s'affiche nulle part`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const doubles = fiches.filter((f) => f.fois > 1).length;
const absentes = fiches.filter((f) => f.fois === 0 && !f.partiel).length;
console.log(`\n${fiches.length} thèmes · ${doubles} en double ou plus · ${absentes} où elle ne se lit nulle part`);
