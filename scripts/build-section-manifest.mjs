// Dresse la liste des retouches possibles, thème par thème.
//
//   node scripts/build-section-manifest.mjs
//
// Les codemods ont posé des clés dans les thèmes — `clientText(sessionData,
// "contact.titre")`, `clientList(sessionData, "engagements.liste1")`. Sans
// inventaire, elles sont invisibles : le client ne peut pas retoucher ce qu'il ne
// voit pas proposé.
//
// Ce fichier lit les clés dans le source et écrit `lib/templates/sectionManifest.ts`,
// que le panneau d'édition de l'aperçu déroule pour le thème choisi. L'aperçu du
// texte d'origine sert d'étiquette : « Nos engagements » plutôt que
// « engagements.titre ».

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const SORTIE = path.join(process.cwd(), "lib/templates/sectionManifest.ts");

function apercu(src, apres) {
  // Le texte d'origine suit le `??` : `?? (<>Nos engagements</>)`.
  const m = /\?\?\s*\(<>([\s\S]{0,200}?)<\/>\)/.exec(src.slice(apres, apres + 900));
  if (!m) return "";
  const nettoye = m[1]
    .replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  /* Une étiquette faite d'accolades et d'espaces ne dit rien : elle vaut vide. */
  if (/[\p{L}\p{N}]/u.test(nettoye)) return nettoye;
  /*
    Certains thèmes n'écrivent pas le texte en clair mais une expression :
    `{c?.heroHeadline ?? "Votre piscine, sans mauvaise surprise."}`. Retirer les
    accolades ne laisse alors rien, et le client voyait « hero.titre » comme
    étiquette. On va chercher la chaîne de repli à l'intérieur — c'est elle que
    la page affiche quand le client n'a rien rempli, donc c'est bien elle qu'il
    reconnaîtra.
  */
  const litteral = /\?\?\s*["']([^"']{2,80})["']/.exec(m[1]);
  return litteral ? litteral[1].trim().slice(0, 60) : "";
}

function apercuListe(src, apres) {
  const m = /\?\?\s*\[([\s\S]{0,400}?)\]/.exec(src.slice(apres, apres + 900));
  if (!m) return "";
  return [...m[1].matchAll(/["']([^"']{2,40})["']/g)].map((x) => x[1]).slice(0, 3).join(" · ");
}

const manifeste = {};

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const entrees = [];
  const vues = new Set();

  for (const m of src.matchAll(/clientText\(\s*sessionData\s*,\s*"([^"]+)"\s*\)/g)) {
    if (vues.has(m[1])) continue;
    vues.add(m[1]);
    entrees.push({ cle: m[1], type: "texte", apercu: apercu(src, m.index + m[0].length) });
  }
  for (const m of src.matchAll(/clientList\(\s*sessionData\s*,\s*"([^"]+)"\s*\)/g)) {
    if (vues.has(m[1])) continue;
    vues.add(m[1]);
    entrees.push({ cle: m[1], type: "liste", apercu: apercuListe(src, m.index + m[0].length) });
  }

  if (entrees.length) manifeste[id] = entrees;
}

const total = Object.values(manifeste).reduce((n, v) => n + v.length, 0);

const contenu = `// Généré par scripts/build-section-manifest.mjs — ne pas modifier à la main.
//
// Ce que le client peut retoucher, thème par thème : la clé posée dans le
// source, le type de champ à lui présenter, et un aperçu du texte d'origine qui
// sert d'étiquette dans le panneau d'édition.
//
// ${total} retouches possibles sur ${Object.keys(manifeste).length} thèmes.

export interface RetouchePossible {
  /** La clé lue par le thème : « contact.titre ». */
  cle: string;
  type: "texte" | "liste";
  /** Le texte d'origine, pour que le client reconnaisse la section. */
  apercu: string;
}

export const RETOUCHES: Record<string, RetouchePossible[]> = ${JSON.stringify(manifeste, null, 2)};

/** Les retouches d'un thème, vide si le thème n'en propose aucune. */
export function retouchesDe(templateId: string | undefined): RetouchePossible[] {
  return (templateId && RETOUCHES[templateId]) || [];
}
`;

fs.writeFileSync(SORTIE, contenu);
console.log(`${total} retouches sur ${Object.keys(manifeste).length} thèmes → lib/templates/sectionManifest.ts`);
