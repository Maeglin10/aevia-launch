// Le titre du hero parle enfin du client.
//
//   node scripts/wire-hero-lines.mjs [--dry] [impact-01 …]
//
// Deux cent quarante-deux thèmes sur trois cent soixante-treize affichaient, en
// haut de page et en très gros, une phrase qui ne parlait pas de l'entreprise :
// « We build the internet's best. » sur le site d'un plombier d'Annecy, « TAME
// YOUR BIOLOGY. » sur celui d'un coiffeur. Le nom était bon dans l'en-tête,
// l'accroche bonne sous le titre — mais la première chose que le visiteur lit
// venait d'ailleurs.
//
// Un titre de hero est rarement une chaîne : c'est deux, trois ou quatre lignes,
// chacune avec sa couleur, sa graisse et son animation. On repère ces lignes et
// on branche chacune sur `clientHeroLine(sessionData, rang, total)`, qui répartit
// l'accroche du client sur le même nombre de lignes. Le thème garde tout le
// reste : ses styles, ses animations, son découpage.
//
// Trois formes, dans l'ordre où on les essaie :
//
//   <TextReveal text="We Build" /> <TextReveal text="The Future" />
//   <h1>Apprenez les<br/><span>compétences</span><br/>de demain</h1>
//   <h1>The art of quiet luxury.</h1>
//
// Sans accroche saisie, chaque ligne rend celle du thème : le repli est le texte
// d'origine, mot pour mot.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

function finBalise(s, i) {
  let prof = 0, guil = null;
  for (let k = i; k < s.length; k++) {
    const ch = s[k];
    if (guil) { if (ch === guil) guil = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { guil = ch; continue; }
    if (ch === "{") prof++;
    else if (ch === "}") prof--;
    else if (ch === ">" && prof === 0) return k;
  }
  return -1;
}

function fermeElement(s, i, tag) {
  const ouvre = new RegExp(`<${tag}\\b`, "g");
  const clot = new RegExp(`</${tag}\\s*>`, "g");
  let prof = 1, k = i;
  while (k < s.length) {
    ouvre.lastIndex = k; clot.lastIndex = k;
    const a = ouvre.exec(s), b = clot.exec(s);
    if (!b) return -1;
    if (a && a.index < b.index) { prof++; k = a.index + a[0].length; continue; }
    prof--; k = b.index + b[0].length;
    if (prof === 0) return b.index;
  }
  return -1;
}

// Un morceau de JSX n'est du texte que s'il ne porte aucune ponctuation de code :
// « )} », « ?? », « {' '} » sont de la syntaxe, pas des mots à remplacer.
const estDuTexte = (x) =>
  texteNet(x).length >= 2 && !/[{}()?]/.test(x) && /\p{L}/u.test(texteNet(x));

const texteNet = (x) =>
  x.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

let faits = 0;
const touches = [];
const refus = {};
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) { refus["pas de session"] = (refus["pas de session"] ?? 0) + 1; continue; }
  if (src.includes("clientHeroLine")) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }

  // Le titre du hero : le premier h1 de la page. À défaut, le premier h2.
  const t = /<((?:motion|m)\.)?(h1)\b/.exec(src) ?? /<((?:motion|m)\.)?(h2)\b/.exec(src);
  if (!t) { refus["pas de titre"] = (refus["pas de titre"] ?? 0) + 1; continue; }
  const finOuv = finBalise(src, t.index + t[0].length);
  if (finOuv === -1 || src[finOuv - 1] === "/") { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }
  const finFerm = fermeElement(src, finOuv + 1, t[0].slice(1).replace(".", "\\."));
  if (finFerm === -1) { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }
  const dedans = src.slice(finOuv + 1, finFerm);

  /*
    Un titre déjà branché — sur l'accroche, sur le nom, ou rendu retouchable par
    la passe des sections — n'est pas repris. Le manquer coûtait cher : le
    codemod prenait le « )} » qui referme `clientText(…) ?? (<> … </>)` pour un
    morceau de texte et le remplaçait, cassant quatre-vingt-onze fichiers.
  */
  if (/client(Tagline|HeroLine|Name)/.test(dedans)) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }

  /*
    Quatre-vingt-sept titres ont été rendus retouchables par la passe des
    sections : leur texte vit dans le repli de `clientText(…) ?? (<> … </>)`. Le
    client pouvait le réécrire à la main, mais son accroche n'y entrait pas —
    « Reach the Beyond. » restait sur le site d'un plombier. On travaille alors à
    l'intérieur du repli, en laissant la retouche par-dessus : ce que le client
    écrit lui-même passe toujours en premier.
  */
  let decalage = 0;
  let corps = dedans;
  const retouche = /client(?:Text|List)\([^)]*\)\s*\?\?\s*\(<>/.exec(dedans);
  if (retouche) {
    const debut = retouche.index + retouche[0].length;
    const fin = dedans.lastIndexOf("</>)");
    if (fin <= debut) { refus["repli illisible"] = (refus["repli illisible"] ?? 0) + 1; continue; }
    corps = dedans.slice(debut, fin);
    decalage = debut;
    if (/client[A-Z]/.test(corps)) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }
  }
  if (/\.map\(/.test(dedans)) { refus["map"] = (refus["map"] ?? 0) + 1; continue; }

  // Forme 1 — des composants d'animation qui reçoivent chacun leur ligne.
  const props = [...corps.matchAll(/\btext=(["'])((?:(?!\1).)*)\1/g)];
  let remplacements = null;
  if (props.length >= 1 && props.every((m) => texteNet(m[2]).length >= 2)) {
    remplacements = props.map((m, i) => ({
      deb: m.index + m[0].indexOf(m[1]),
      fin: m.index + m[0].length,
      original: texteNet(m[2]),
      neuf: `{clientHeroLine(sessionData, ${i}, ${props.length}, GABARIT) ?? ${JSON.stringify(m[2])}}`,
    }));
  }

  // Forme 2 — des morceaux de texte séparés par des sauts de ligne ou des balises.
  if (!remplacements) {
    const morceaux = [];
    let curseur = 0;
    for (const m of corps.matchAll(/<[^>]*>/g)) {
      const avant = corps.slice(curseur, m.index);
      if (estDuTexte(avant)) morceaux.push({ deb: curseur, fin: m.index, texte: avant });
      curseur = m.index + m[0].length;
    }
    const queue = corps.slice(curseur);
    if (estDuTexte(queue)) morceaux.push({ deb: curseur, fin: dedans.length, texte: queue });
    if (morceaux.length >= 1) {
      remplacements = morceaux.map((x, i) => ({
        deb: finOuv + 1 + decalage + x.deb,
        fin: finOuv + 1 + decalage + x.fin,
        original: texteNet(x.texte),
        neuf: `{clientHeroLine(sessionData, ${i}, ${morceaux.length}, GABARIT) ?? ${JSON.stringify(texteNet(x.texte))}}`,
      }));
    }
  }

  if (!remplacements || remplacements.length === 0) { refus["rien à couper"] = (refus["rien à couper"] ?? 0) + 1; continue; }

  /*
    Un titre d'un seul mot n'est pas une accroche : « Menu », « Contact ». On
    compte les mots sur les textes retenus, pas sur le contenu brut du titre :
    celui d'un thème animé ne vit que dans des attributs `text=`, et le mesurer
    à vide écartait cent quarante-trois titres qui avaient tout à gagner.
  */
  const total = remplacements.map((r) => r.original).join(" ").trim();
  if (total.split(/\s+/).filter(Boolean).length < 2) { refus["titre trop court"] = (refus["titre trop court"] ?? 0) + 1; continue; }

  /*
    Le gabarit : la plus longue ligne que le thème a dessinée. C'est elle qui
    décide, pas le total — un titre en cent soixante-seize pixels casse à cinq
    caractères, et « Plombier à Annecy » y tenait sur le papier tout en couvrant
    l'écran à l'écran.
  */
  const maxLigne = Math.max(...remplacements.map((r) => r.original.length));
  for (const r of remplacements) r.neuf = r.neuf.replace("GABARIT", String(maxLigne));

  /*
    Deux cent six titres sont enveloppés dans `{c?.heroHeadline ?? <> … </>}` :
    la phrase écrite par le modèle passait devant celle que le client a saisie au
    wizard. `clientHeroLine` lit déjà `heroHeadline` en dernier recours — l'ordre
    juste est donc accroche saisie, puis phrase du modèle, puis texte du thème —,
    et cette enveloppe n'a plus lieu d'être.
  */
  const enveloppe = /\{\s*c\??\.?heroHeadline\s*\?\?\s*<>/;
  const besoins = new Set(["clientHeroLine"]);

  // Pour la forme 1, les positions sont relatives au contenu du titre.
  const base = remplacements[0].deb < finOuv ? finOuv + 1 + decalage : 0;
  for (const r of [...remplacements].sort((a, b) => b.deb - a.deb)) {
    const deb = base + r.deb;
    const fin = base + r.fin;
    src = src.slice(0, deb) + r.neuf + src.slice(fin);
  }

  {
    const tete = src.slice(finOuv, finOuv + 200);
    const m = enveloppe.exec(tete);
    if (m) {
      const deb = finOuv + m.index;
      src = src.slice(0, deb) + "{<>" + src.slice(deb + m[0].length);
    }
  }

  /*
    Le sous-titre portait souvent l'accroche, lui aussi : le hero la répétait
    deux fois de suite, en très gros puis en petit. Puisque le titre la prend
    désormais, la ligne du dessous annonce ce que l'entreprise fait.
  */
  {
    const suite = src.slice(finFerm, finFerm + 2200);
    // Deux écritures pour la même chose : l'appel au contrat, ou la lecture
    // directe du champ du wizard.
    const m = /clientTagline\(\s*(?:sessionData|session)\s*\)|\bfd\??\.(?:tagline|slogan)\b/.exec(suite);
    if (m) {
      const deb = finFerm + m.index;
      src = src.slice(0, deb) + "clientHeroSubtitle(sessionData)" + src.slice(deb + m[0].length);
      besoins.add("clientHeroSubtitle");
    }
  }

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      for (const x of besoins) noms.add(x);
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + `import { ${[...besoins].sort().join(", ")} } from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${id} (${remplacements.length})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) de hero branchés sur l'accroche du client`);
console.log(touches.slice(0, 14).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
