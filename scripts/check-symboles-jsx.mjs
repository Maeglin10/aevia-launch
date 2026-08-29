/*
  Un composant employé sans être défini.

    node scripts/check-symboles-jsx.mjs

  Les thèmes portent `@ts-nocheck` : le build ne vérifie plus rien. Un `<Monitor />`
  dont l'import a disparu — parce qu'un codemod a réécrit le bloc, ou parce que
  la ligne a été retirée à la main — passe le build sans un mot et sert une page
  d'erreur au visiteur. C'est la seule catégorie de panne que ni le build, ni les
  contrôles du contrat ne voyaient.

  On relève donc chaque `<Symbole` majuscule du fichier et l'on vérifie qu'il
  est importé, déclaré, ou défini comme fonction ou constante dans le fichier.
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

/* React et les fragments ne s'importent pas dans une application Next moderne. */
const CONNUS = new Set(["React", "Fragment", "Suspense", "Image", "Link"]);

const manquants = [];
for (const p of parcourir("app/templates")) {
  const s = fs.readFileSync(p, "utf8");

  const definis = new Set(CONNUS);
  /* Ce que le fichier importe, sous toutes les formes. */
  for (const m of s.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+["'][^"']+["']/g)) {
    for (const n of m[1].matchAll(/[A-Za-z_$][\w$]*/g)) definis.add(n[0]);
  }
  /* Ce qu'il déclare lui-même. */
  for (const m of s.matchAll(/(?:function|const|let|var|class)\s+([A-Z][\w$]*)/g)) definis.add(m[1]);
  /* Ce qu'il reçoit ou déstructure — y compris dans les paramètres d'une
     fonction fléchée : `.map(({ Icon, label }) => …)` est la forme la plus
     répandue du catalogue. */
  for (const m of s.matchAll(/\{([^{}]*)\}\s*(?:=|=>|\))/g)) {
    for (const n of m[1].matchAll(/[A-Za-z_$][\w$]*/g)) definis.add(n[0]);
  }

  /* Les paramètres d'une fonction fléchée, nommés sans accolades :
     `{[Globe, Globe].map((Icon, i) => <Icon … />)}` est courant dans le
     catalogue. */
  for (const m of s.matchAll(/\(\s*([A-Z][\w$]*)\s*(?:,[^)]*)?\)\s*=>/g)) definis.add(m[1]);
  /* Un argument de type générique n'est pas un composant :
     `createContext<CartContextValue>`, `useState<Look[]>`. */
  for (const m of s.matchAll(/<([A-Z][\w$]*)(?:\[\])?\s*(?:\||>)/g)) definis.add(m[1]);
  /* Une interface décrit un type, jamais un composant. */
  for (const m of s.matchAll(/\binterface\s+([A-Z][\w$]*)/g)) definis.add(m[1]);
  /* Le renommage à la déstructuration : `{ icon: Icon }` — la forme employée
     par la moitié du catalogue pour passer une icône en propriété. */
  for (const m of s.matchAll(/[\w$]+\s*:\s*([A-Z][\w$]*)\s*[,}]/g)) definis.add(m[1]);
  /* Un objet qui porte un composant en propriété : `{ Icon: Sparkles }`, lu
     plus loin comme `<Icon … />` après déstructuration dans un `.map`. */
  for (const m of s.matchAll(/\b([A-Z][\w$]*)\s*:/g)) definis.add(m[1]);

  /* `useRef<HTMLButtonElement>(null)` n'est pas du JSX : les types du DOM et
     les génériques se reconnaissent à leur nom, ou au mot qui les précède. */
  const employes = new Set(
    [...s.matchAll(/(\w*)\s*<([A-Z][\w$.]*)[\s/>]/g)]
      .filter((m) => !/^(useRef|useState|useMemo|Ref|Array|Record|Promise|Partial|Set|Map)$/.test(m[1]))
      .map((m) => m[2])
      .filter((n) => !/^(HTML|SVG)\w*Element$/.test(n)),
  );
  for (const e of employes) {
    if (!definis.has(e) && !definis.has(e.split(".")[0])) {
      manquants.push(`${p.slice("app/templates/".length)}  <${e}>`);
    }
  }
}

manquants.forEach((m) => console.log(m));
console.log(manquants.length ? `\n${manquants.length} symbole(s) JSX sans définition` : "aucun symbole JSX sans définition");
process.exit(manquants.length ? 1 : 0);
