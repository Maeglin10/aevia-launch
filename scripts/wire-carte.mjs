// La carte et le catalogue du client s'affichent — repérés par ce qu'ils rendent.
//
//   node scripts/wire-carte.mjs --dry impact-299 …
//
// Un premier codemod cherchait « la constante qui a des prix » et a confondu la
// barre de navigation d'impact-112 avec une carte. On part donc du rendu : le
// navigateur dit quel plat s'affiche, on retrouve la constante qui le contient,
// et c'est celle-là qu'on branche.
//
// Les plats du client passent devant, ceux du thème restent dessous — pour
// combler une liste plus courte, et pour qui ne remplit rien.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) { console.error("usage: node scripts/wire-carte.mjs impact-299 …"); process.exit(1); }

const capacites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const BLOCS = {};
for (const m of capacites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  BLOCS[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let faits = 0;
const touches = [];
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) { restes.push(`${id} (pas de page)`); continue; }
  let src = fs.readFileSync(f, "utf8");
  const fonction = (BLOCS[id] ?? []).includes("menu") ? "clientMenu" : "clientProducts";
  if (new RegExp(`\\b${fonction}\\s*\\(`).test(src)) { restes.push(`${id} (déjà branché)`); continue; }

  /*
    Le rendu d'abord : on cherche, dans la page sans session, une ligne qui
    ressemble à une entrée de carte — un intitulé suivi d'un prix. Son texte
    servira de sonde dans le source.
  */
  const p = await ctx.newPage();
  let sondes = [];
  try {
    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2200);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1200);
    sondes = await p.evaluate(() => {
      const prix = /(\d+[,.]?\d*)\s*(€|EUR|\$)/;
      const out = [];
      for (const e of document.querySelectorAll("*")) {
        if (e.children.length === 0) continue;
        const t = (e.innerText ?? "").trim();
        if (t.length < 6 || t.length > 120) continue;
        if (!prix.test(t)) continue;
        // Le nom est la première ligne, le prix vient après.
        const ligne = t.split("\n")[0].trim();
        if (ligne.length >= 4 && ligne.length <= 48 && !prix.test(ligne)) out.push(ligne);
      }
      return [...new Set(out)].slice(0, 6);
    });
  } catch { /* la page n'a pas répondu */ }
  await p.close();

  if (sondes.length === 0) { restes.push(`${id} (aucune entrée avec un prix à l'écran)`); continue; }

  /*
    La constante qui contient cette entrée. On refuse tout ce qui ressemble à
    une navigation : c'est l'erreur qu'a commise le premier codemod.
  */
  let cible = null;
  for (const m of src.matchAll(/^(const|let)\s+([A-Za-z_][\w]*)\s*(?::[^=]+)?=\s*\[/gm)) {
    const nom = m[2];
    if (/NAV|LINK|MENU_LINKS|ROUTES|ONGLET|TABS/i.test(nom)) continue;
    const debut = m.index + m[0].length - 1;
    const fin = src.indexOf("\n];", debut);
    if (fin < 0 || fin - debut > 20000) continue;
    const corps = src.slice(debut, fin);
    if (!sondes.some((s) => corps.includes(s))) continue;
    cible = { nom, motCle: m[1], debut, fin, sonde: sondes.find((s) => corps.includes(s)) };
    break;
  }
  if (!cible) { restes.push(`${id} («${sondes[0].slice(0, 22)}» hors d'une constante)`); continue; }
  if (!/^let sessionData: any = null;/m.test(src)) { restes.push(`${id} (pas de session)`); continue; }
  const pose = /(\n\s*sessionData\s*=\s*session;)/;
  if (!pose.test(src)) { restes.push(`${id} (pas de point de pose)`); continue; }

  // La constante devient un repli nommé, et une variable vivante la remplace.
  const enTete = new RegExp(`^${cible.motCle}(\\s+${cible.nom}\\s*(?::[^=]+)?=\\s*\\[)`, "m");
  src = src.replace(enTete, `const ${cible.nom}_DEMO$1`.replace(`${cible.nom}_DEMO ${cible.nom}`, `${cible.nom}_DEMO`));
  const finBloc = src.indexOf("\n];", src.indexOf(`const ${cible.nom}_DEMO`));
  src = src.slice(0, finBloc + 3) + `\nlet ${cible.nom} = ${cible.nom}_DEMO;` + src.slice(finBloc + 3);
  src = src.replace(pose, `$1\n  ${cible.nom} = resolveList(${fonction}(sessionData), ${cible.nom}_DEMO);`);

  for (const [nom, chemin] of [["resolveList", "@/lib/templates/resolveList"], [fonction, "@/lib/templates/clientContent"]]) {
    if (new RegExp(`import \\{[^}]*\\b${nom}\\b`, "s").test(src)) continue;
    const imp = new RegExp(`import \\{([^}]*)\\} from "${chemin.replace(/[/@]/g, "\\$&")}";`).exec(src);
    if (imp) src = src.replace(imp[0], imp[0].replace("import {", `import {\n  ${nom},`));
    else {
      const dcl = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = dcl ? dcl.index + dcl[0].length : 0;
      src = src.slice(0, at) + `import { ${nom} } from "${chemin}";\n` + src.slice(at);
    }
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${cible.nom} ← «${cible.sonde.slice(0, 18)}»)`);
}

await b.close();
console.log(`${dry ? "[à blanc] " : ""}${faits} carte(s) ou catalogue(s) branchés`);
touches.forEach((t) => console.log("   " + t));
if (restes.length) console.log(`laissés tels quels :\n   ${restes.join("\n   ")}`);
