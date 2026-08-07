// Le titre mélange-t-il la phrase du client et celle de la démonstration ?
//
//   node scripts/qa-titre-mixte.mjs --tranche 0 4
//
// Sur impact-01, un plombier lisait « Plombier internet's best. » : le thème a
// deux titres, l'un branché sur le client, l'autre resté en dur. Le résultat
// n'est ni sa phrase ni celle du thème — c'est un collage, et il se voit.
//
// On compare donc le hero sans session et avec : tout mot du titre d'origine qui
// survit à côté de la donnée du client trahit un fragment oublié.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

/** Le texte des titres du premier écran, tel qu'il s'affiche. */
const titresDuHero = () => {
  const flottants = [...document.querySelectorAll("*")]
    .filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position));
  const out = [];
  for (const h of document.querySelectorAll("h1, h2")) {
    if (flottants.some((f) => f.contains(h))) continue;
    const r = h.getBoundingClientRect();
    if (r.top > 900 || r.height < 20) continue;
    out.push((h.textContent ?? "").replace(/\s+/g, " ").trim());
  }
  return out.join(" ").toLowerCase();
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, restes: [] };
  try {
    // Le titre du thème, sans aucune donnée.
    const p1 = await ctx.newPage();
    await p1.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p1.waitForTimeout(2200);
    const nu = await p1.evaluate(titresDuHero);
    await p1.close();

    // Le même, avec un client dont la phrase n'a rien de commun avec le thème.
    const formData = {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy depuis 1998",
      email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33", template: id,
    };
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId } = await r.json();
    const p2 = await ctx.newPage();
    await p2.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p2.waitForTimeout(2600);
    const avec = await p2.evaluate(titresDuHero);
    await p2.close();

    /*
      Le titre porte-t-il la donnée du client ? Si non, le thème garde le sien
      entier — c'est un autre sujet, mesuré ailleurs. Ici on ne cherche que le
      collage : de la donnée du client ET des mots du thème.
    */
    const duClient = /plombier|annecy|vidal/.test(avec);
    if (!duClient) { fiches.push({ id, restes: [] }); continue; }

    /*
      Les mots du titre d'origine qui survivent. On ignore les mots courts et
      les mots que le client emploie aussi — seul un mot propre au thème est un
      reste.
    */
    const motsClient = new Set("votre plombier de confiance à annecy depuis 1998 ateliers vidal fils".split(" "));
    const restes = [...new Set(nu.split(/[^\p{L}\p{N}']+/u))]
      .filter((m) => m.length >= 4 && !motsClient.has(m) && avec.includes(m));

    fiche = { id, restes: restes.slice(0, 5), nu: nu.slice(0, 40), avec: avec.slice(0, 40) };
  } catch (e) {
    fiche = { id, restes: [], erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (fiche.restes.length) console.log(`${id.padEnd(12)} reste du thème : ${fiche.restes.join(", ")} — « ${fiche.avec} »`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.restes.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} dont le titre mêle le client et la démonstration`);
