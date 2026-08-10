// Un hook appelé dans le JSX démonte la page au changement de vue.
//
//   node scripts/check-hooks-dans-jsx.mjs
//
// impact-03 appelait `useTransform` dans le JSX de sa galerie, une section
// rendue seulement sur la vue d'accueil. Au clic sur « Boutique » la section
// disparaît, le hook cesse d'être appelé, et React démonte toute la page :
// « Rendered fewer hooks than expected » (#300). La boutique du client
// s'effondrait au premier clic — et aucune campagne ne l'avait vu, parce
// qu'elles chargeaient les adresses sans jamais cliquer.
//
// On cherche donc tout appel de hook à l'intérieur d'un attribut JSX ou d'un
// bloc d'accolades imbriqué, plutôt qu'en tête de composant.

import fs from "node:fs";
import { globSync } from "glob";

const HOOKS = "use(State|Effect|Memo|Ref|Callback|Transform|Scroll|Spring|Reduced|Motion|Animate|InView|Context)";

/*
  La signature du défaut, et elle seule : un hook en valeur d'une propriété
  d'objet — `y: useTransform(...)`, `width: useSpring(...)`. C'est du style
  passé à un élément, donc du JSX, donc un hook dont l'appel dépend de la vue
  affichée.

  Un premier jet acceptait tout ce qui n'était pas une déclaration en tête de
  composant : 124 remontées, presque toutes légitimes — `React.useEffect(`,
  `return useTransform(...)` au corps d'un hook maison, `useRef` dans un
  sous-composant. L'instrument sur-déclarait, exactement comme la table des
  capacités avant ses cinq resserrements.
*/
const suspects = [];
for (const fichier of globSync("app/templates/impact-*/**/page.tsx")) {
  const src = fs.readFileSync(fichier, "utf8");
  const lignes = src.split("\n");
  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) continue;
    if (!new RegExp(`^\\s+[A-Za-z_$][\\w$]*\\s*:\\s*(React\\.)?${HOOKS}\\s*\\(`).test(l)) continue;
    suspects.push({ fichier: fichier.replace("app/templates/", ""), ligne: i + 1, texte: l.trim().slice(0, 90) });
  }
}

for (const s of suspects) console.log(`${s.fichier}:${s.ligne}  ${s.texte}`);
console.log(`\n${suspects.length} appels de hook hors du corps du composant`);
process.exit(suspects.length ? 1 : 0);
