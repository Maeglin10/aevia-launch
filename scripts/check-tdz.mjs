/*
  Une donnée lue avant d'exister.

    node scripts/check-tdz.mjs

  Le dégel d'une constante appelle sa fonction `X_LIVE()` dès l'import. Si le
  corps de cette fonction lit une constante déclarée plus bas dans le fichier,
  JavaScript refuse : « Cannot access 'Z' before initialization ». La page est
  blanche, et le build — les thèmes portant `@ts-nocheck` — n'en dit rien.
  Cinq pages d'impact-99 en sont mortes sans que rien ne le signale.
*/
import fs from "node:fs";
import path from "node:path";

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

const fautes = [];
for (const p of parcourir("app/templates")) {
  const s = fs.readFileSync(p, "utf8");
  /* Où chaque constante de module est déclarée. */
  const declarees = new Map();
  for (const m of s.matchAll(/^(?:const|let)\s+([A-Za-z_$][\w$]*)/gm)) {
    if (!declarees.has(m[1])) declarees.set(m[1], m.index);
  }
  for (const m of s.matchAll(/^let\s+([A-Za-z_$][\w$]*)[^=\n]*=\s*\1_LIVE\(\);/gm)) {
    const nom = m[1];
    const debut = s.indexOf(`function ${nom}_LIVE(`);
    if (debut < 0) continue;
    let i = s.indexOf("{", debut), prof = 0, fin = i;
    while (fin < s.length) {
      if (s[fin] === "{") prof++;
      else if (s[fin] === "}") { prof--; if (prof === 0) break; }
      fin++;
    }
    const corps = s.slice(i, fin);
    /* Toutes les constantes de module, pas seulement celles en capitales : la
       session elle-même (`let sessionData: any = null;`) était déclarée sous
       l'appel, et c'est elle que les cinq pages d'impact-99 lisaient trop tôt. */
    for (const u of new Set([...corps.matchAll(/\b([A-Za-z_$][\w$]{2,})\b/g)].map((x) => x[1]))) {
      const ou = declarees.get(u);
      if (ou !== undefined && ou > m.index) {
        fautes.push(`${p.slice("app/templates/".length)}  ${nom}_LIVE() lit ${u}, déclarée plus bas`);
      }
    }
  }
}

fautes.forEach((f) => console.log(f));
console.log(fautes.length ? `\n${fautes.length} lecture(s) avant déclaration` : "aucune lecture avant déclaration");
process.exit(fautes.length ? 1 : 0);
