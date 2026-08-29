/*
  Un recalcul sans sa fonction.

    node scripts/check-live-orphelins.mjs

  Le dégel d'une constante pose deux choses : une fonction `X_LIVE()` et une
  ligne `X = X_LIVE();` après l'arrivée de la session. Quand la première est
  retirée sans la seconde — parce qu'on a réparé un dégel abusif à la main —
  la page ne plante qu'à l'exécution : les thèmes portent `@ts-nocheck`, le
  build reste vert, et le visiteur reçoit une page d'erreur.

  C'est arrivé deux fois dans la même journée : `HERO_BOUQUETS_DEMO_SOURCE_LIVE`
  sur impact-47, puis `n_LIVE` sur impact-275. Aucun contrôle ne les voyait.
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

const orphelins = [];
for (const p of parcourir("app/templates")) {
  const s = fs.readFileSync(p, "utf8");
  const definis = new Set([...s.matchAll(/function\s+([A-Za-z_$][\w$]*_LIVE)\s*\(/g)].map((m) => m[1]));
  for (const m of new Set([...s.matchAll(/\b([A-Za-z_$][\w$]*_LIVE)\s*\(/g)].map((x) => x[1]))) {
    if (!definis.has(m)) orphelins.push(`${p.slice("app/templates/".length)}  ${m}`);
  }
}

orphelins.forEach((o) => console.log(o));
console.log(orphelins.length ? `\n${orphelins.length} recalcul(s) sans fonction` : "aucun recalcul orphelin");
process.exit(orphelins.length ? 1 : 0);
