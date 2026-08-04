// Fait lire la session aux sous-pages des thèmes.
//
//   node scripts/wire-subpages-session.mjs [contact services …] [--dry]
//
// 557 sous-pages — /contact, /services, /à-propos, /tarifs — n'ont jamais lu la
// session : deux d'entre elles seulement interrogent `/api/sessions`, aucune
// n'appelle le contrat. Un client qui clique « Contact » depuis son propre site
// y trouve le téléphone et l'adresse d'une entreprise qui n'existe pas.
//
// Cette passe n'écrit aucune donnée : elle pose seulement le chargement de la
// session et les variables de module que les passes de câblage attendent —
// `fd`, `bp`, `c`, `sessionData` — dans la forme exacte utilisée par les pages
// d'accueil, pour que les mêmes outils puissent travailler ensuite.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const filtres = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const LOADER = `
// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;
`;

const CORPS = `  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(\`/api/sessions?id=\${id}\`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;
`;

let faits = 0;
const restants = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  for (const sous of fs.readdirSync(dossier)) {
    if (filtres.length && !filtres.includes(sous)) continue;
    const file = path.join(dossier, sous, "page.tsx");
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    if (/let sessionData: any = null;/.test(src)) continue;
    if (/api\/sessions/.test(src)) { restants.push(`${id}/${sous} (déjà)`); continue; }

    // La page doit être cliente pour poser un état et un effet.
    if (!/^\s*("use client"|'use client')/.test(src)) { restants.push(`${id}/${sous} (serveur)`); continue; }

    const exp = /export default function (\w+)\s*\([^)]*\)\s*\{/.exec(src);
    if (!exp) { restants.push(`${id}/${sous} (pas de composant exporté)`); continue; }

    // Les variables de module vont juste avant le composant exporté.
    src = src.slice(0, exp.index) + LOADER + "\n" + src.slice(exp.index);
    const exp2 = /export default function (\w+)\s*\([^)]*\)\s*\{/.exec(src);
    src = src.slice(0, exp2.index + exp2[0].length) + "\n" + CORPS + src.slice(exp2.index + exp2[0].length);

    // `useState` et `useEffect` doivent être importés.
    // Ni le point-virgule ni les guillemets doubles ne sont garantis : la
    // première version a posé un second import de React sur soixante-sept pages.
    const imp = /^import\s+(React,\s*)?\{([^}]*)\}\s*from\s*['"]react['"];?/m.exec(src);
    if (imp) {
      const noms = new Set((imp[2] ?? "").split(",").map((x) => x.trim()).filter(Boolean));
      noms.add("useState");
      noms.add("useEffect");
      const prefixe = imp[1] ? "import React, " : "import ";
      src = src.slice(0, imp.index) + `${prefixe}{ ${[...noms].sort().join(", ")} } from "react";` + src.slice(imp.index + imp[0].length);
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { useEffect, useState } from "react";\n' + src.slice(at);
    }

    if (!dry) fs.writeFileSync(file, src);
    faits++;
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} sous-page(s) reliée(s) à la session`);
if (restants.length) console.log(`restants (${restants.length}) : ${restants.slice(0, 20).join(", ")}`);
