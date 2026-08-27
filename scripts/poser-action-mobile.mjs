/*
  Pose l'appel à l'action de barre sur téléphone, dans chaque thème.

  Trois gestes par fichier, tous ancrés sur des repères stables :

    1. l'import de lib/templates/ActionMobile ;
    2. une ligne dans la media query qui fait déjà paraître le bouton de menu
       — pas un seuil écrit en dur : les thèmes vont de 900 à 1000 px, et le
       bouton d'action doit paraître EXACTEMENT avec le menu ;
    3. le composant lui-même, juste avant le bouton de menu.

  L'encre du libellé n'est pas devinée : on la lit dans le thème. On cherche
  la couleur que le thème pose lui-même sur son accent — « background: C.accent,
  color: X ». Un accent clair veut une encre sombre, et l'inverse ; se
  contenter de blanc rendrait illisible un bouton doré.

    node scripts/poser-action-mobile.mjs 328 383
    node scripts/poser-action-mobile.mjs 328 383 --voir
*/
import fs from "node:fs";

const [aArg, bArg, ...opts] = process.argv.slice(2);
const min = Number(aArg ?? 328), max = Number(bArg ?? 383);
const voir = opts.includes("--voir");

/** L'encre que le thème pose lui-même sur son accent, si elle se lit. */
function encreSurAccent(src) {
  /* « background: C.accent, color: C.onAccent » et ses variantes d'ordre. */
  const formes = [
    /background:\s*C\.accent(?:Dark)?\s*,\s*color:\s*([^,\n}]+)/,
    /color:\s*([^,\n}]+),\s*background:\s*C\.accent(?:Dark)?\s*[,\n}]/,
    /background:\s*`?\$\{?C\.accent[^`,\n]*`?\s*,\s*color:\s*([^,\n}]+)/,
  ];
  for (const re of formes) {
    const m = re.exec(src);
    if (m) {
      const v = m[1].trim().replace(/["']/g, "");
      /* On ne retient qu'une valeur exploitable : un jeton du thème ou un hex. */
      if (/^C\.\w+$/.test(v) || /^#[0-9a-fA-F]{3,8}$/.test(v)) return v.startsWith("C.") ? v : `"${v}"`;
    }
  }
  return null;
}

/** Le jeton d'accent réellement défini par le thème. */
function jetonAccent(src) {
  if (/\baccentDark:\s*/.test(src) && !/\baccent:\s*/.test(src)) return "C.accentDark";
  return "C.accent";
}

const rapport = [];

for (let n = min; n <= max; n++) {
  const f = `app/templates/impact-${n}/page.tsx`;
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  const L = src.split("\n");

  if (src.includes("ActionMobile")) { rapport.push([n, "déjà posé"]); continue; }

  /* ── 1. le repère : la ligne qui porte la classe du bouton de menu ────── */
  const iClasse = L.findIndex((l) => l.includes(`className="i${n}-burger"`));
  if (iClasse < 0) { rapport.push([n, "PAS DE BOUTON DE MENU"]); continue; }
  /* La balise ouvrante est sur la même ligne, ou juste au-dessus. */
  const iBouton = L[iClasse].includes("<button") ? iClasse : iClasse - 1;
  if (!L[iBouton].includes("<button")) { rapport.push([n, "OUVRANTE INTROUVABLE"]); continue; }
  const indent = (L[iBouton].match(/^(\s*)/) ?? ["", "        "])[1];

  /* ── 2. la règle d'apparition, dans la media query du bouton de menu ──── */
  const iRegle = L.findIndex((l) => new RegExp(`\\.i${n}-burger \\{ display: flex`).test(l));
  if (iRegle < 0) { rapport.push([n, "PAS DE RÈGLE D'APPARITION"]); continue; }

  const accent = jetonAccent(src);
  const encre = encreSurAccent(src) ?? '"#fff"';

  if (voir) { rapport.push([n, `bouton l.${iBouton + 1} · règle l.${iRegle + 1} · ${accent} / ${encre}`]); continue; }

  /* Insertion du composant. On écrit d'abord la ligne la plus basse pour ne
     pas décaler l'index de l'autre. */
  const bloc = [
    `${indent}{/* L'appel à l'action sous le pouce : la barre est fixe, mais son`,
    `${indent}    bouton vit dans le menu déroulant, en display:none sous le point`,
    `${indent}    de rupture. Celui-ci paraît exactement avec le bouton de menu. */}`,
    `${indent}<ActionMobile href={telHref} fond={${accent}} encre={${encre}}>`,
    `${indent}  Appeler`,
    `${indent}</ActionMobile>`,
  ];

  const apres = [...L];
  apres.splice(iBouton, 0, ...bloc);
  /* La règle CSS : après l'insertion JSX si elle est plus bas, sinon avant. */
  const decalage = iRegle > iBouton ? bloc.length : 0;
  apres.splice(
    iRegle + decalage + 1,
    0,
    `          .aevia-action-mobile { display: inline-flex !important; }`,
  );

  let sortie = apres.join("\n");

  /* ── 3. l'import, accroché au dernier import de lib/templates ─────────── */
  const importsTemplates = [...sortie.matchAll(/^import .+ from "@\/lib\/templates\/[^"]+";$/gm)];
  if (!importsTemplates.length) { rapport.push([n, "PAS D'IMPORT lib/templates"]); continue; }
  const dernier = importsTemplates[importsTemplates.length - 1];
  sortie =
    sortie.slice(0, dernier.index + dernier[0].length) +
    `\nimport { ActionMobile } from "@/lib/templates/ActionMobile";` +
    sortie.slice(dernier.index + dernier[0].length);

  fs.writeFileSync(f, sortie);
  rapport.push([n, `posé · ${accent} / ${encre}`]);
}

for (const [n, msg] of rapport) console.log(`impact-${n} : ${msg}`);
const rates = rapport.filter(([, m]) => /PAS |INTROUVABLE/.test(m)).length;
console.log(`\n${rapport.length} thèmes · ${rates} en échec`);
