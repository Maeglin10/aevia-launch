/*
  Ce que le visiteur lit encore en anglais, thème par thème.

  Le balayage des pages rendues annonçait « 0 segment anglais » alors que
  l'écran affichait « Watch demo (3 min) », « Revenue processed », « $124.5K ».
  Il ne regardait que les libellés d'interface ; les textes de démonstration
  écrits en dur dans le JSX lui échappaient.

  Ici on lit la source : tout texte destiné à l'œil, qu'il vienne d'un nœud JSX
  ou d'une chaîne, puis on retire ce que le lexique et les traductions du thème
  couvrent déjà. Ce qui reste est ce qui s'affichera en anglais.
*/
import fs from "node:fs";
import path from "node:path";

const THEMES = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d));

/* Le lexique global : ce qui est déjà traduit au vol pour tous les thèmes. */
/* Les dictionnaires sont rangés par langue d'abord, phrase ensuite :
   `fr: { "log in": "Se connecter" }`. On lit le bloc français, qui les porte
   toutes — une phrase traduite en français l'est dans les quatre langues. */
function clefsDu(source, bloc = "fr") {
  const i = source.indexOf(`  ${bloc}: {`);
  if (i < 0) return [];
  /* Jusqu'à la fermeture du bloc, à la même indentation. */
  const fin = source.indexOf("\n  },", i);
  return [...source.slice(i, fin < 0 ? undefined : fin)
    .matchAll(/^\s*"((?:[^"\\]|\\.)+)":\s*"/gm)]
    /* La clé est lue dans la source : ses guillemets y sont échappés. Sans les
       défaire, une citation traduite passe pour non traduite. */
    .map((m) => m[1].replace(/\\(.)/g, "$1").toLowerCase());
}
const LEXIQUE = new Set(clefsDu(fs.readFileSync("app/templates/BrandColorVar.tsx", "utf8")));

/* Les mots qui ne se disent qu'en anglais. « Contact », « Note », « Menu »,
   « Format » s'écrivent pareil en français : ils ne prouvent rien. */
const ANGLAIS = /\b(the|and|our|your|you|we|with|for|from|about|more|all|get|see|watch|book|learn|read|start|join|discover|explore|view|shop|buy|order|find|meet|why|how|what|when|where|who|is|are|was|were|been|have|has|had|will|would|can|could|should|every|each|any|other|new|best|top|free|now|today|here|there|this|that|these|those|team|work|works|working|time|times|year|years|day|days|made|make|makes|built|build|design|designed|crafted|trusted|loved|worldwide|processed|revenue|growth|customer|customers|browse|try|sign|request|secure|gear|expedition|expeditions|download|upload|listen|submit|subscribe|schedule|grab|claim|unlock|enquire|book|shop|view|client|clients|people|story|stories|journey|approach|process|feature|features|benefit|benefits|pricing|price|plan|plans|review|reviews|question|questions|answer|answers|ready|let|us|me|my|their|his|her|its|into|over|under|through|between|without|within|before|after|again|also|only|just|than|then|but|or|so|if|because|while|during|since|until|up|down|out|off|on|in|at|to|of|by|as|it|he|she|they|them|do|does|did|done|be|being|am)\b/gi;

const rapport = [];
for (const theme of THEMES) {
  /* Ce que le thème sait déjà traduire. */
  const tp = path.join("app/templates", theme, "traductions.ts");
  const deja = new Set(fs.existsSync(tp) ? clefsDu(fs.readFileSync(tp, "utf8")) : []);

  let src = "";
  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (fs.existsSync(p)) src += fs.readFileSync(p, "utf8") + "\n";
  }
  if (!src) continue;

  /* Les textes vus par l'œil : nœuds JSX et chaînes de données. */
  const vus = new Set();
  /*
    Le texte d'un nœud JSX peut s'étaler sur plusieurs lignes :

        <Play … /> Watch demo (3 min)
        </button>

    En excluant le saut de ligne, la première version ne voyait jamais ces
    textes — et « Watch demo (3 min) » n'est entré dans aucun dictionnaire.
    On accepte le saut de ligne, puis on replie les blancs.
  */
  for (const m of src.matchAll(/>([^<>{}]{3,200})</g)) vus.add(m[1].replace(/\s+/g, " ").trim());
  for (const m of src.matchAll(/(?:label|title|name|desc|text|quote|role|q|a|caption|sub|subtitle|heading|cta|blurb|body|answer|question|value|stat|tag|badge|eyebrow|kicker)\s*:\s*"([^"\\]{3,160})"/g)) vus.add(m[1]);
  /*
    Les libellés en tableau nu : `["Expeditions", "Stories", "Gear"]`.
    Ni nœud JSX ni paire clé-valeur — la navigation d'impact-107 restait
    invisible, et « GEAR » s'affichait sur un site français.
  */
  for (const m of src.matchAll(/\[((?:\s*"[^"\\]{2,40}"\s*,?)+)\s*\]/g)) {
    for (const c of m[1].matchAll(/"([^"\\]{3,40})"/g)) vus.add(c[1]);
  }

  const restes = [];
  for (const brut of vus) {
    const t = brut.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
    if (t.length < 4 || !/[a-z]/i.test(t)) continue;
    if (/[éèêëàâäîïôöùûüçœÉÈÊÀÂÎÔÙÛÇ]/.test(t)) continue;      /* français accentué */
    /* Les jetons techniques pris dans les tableaux : offsets de défilement
       (« start start »), alignements, noms de police, classes utilitaires. */
    if (/^(start|end|center|left|right|top|bottom)([ -](start|end|center|left|right|top|bottom))?$/i.test(t)) continue;
    if (/^[a-z0-9-]+$/.test(t) && !t.includes(" ")) continue;
    if (deja.has(t.toLowerCase()) || LEXIQUE.has(t.toLowerCase())) continue;
    const mots = t.match(ANGLAIS) ?? [];
    /* Deux mots-outils anglais, ou un seul sur un texte court : c'est de l'anglais. */
    if (mots.length >= 2 || (mots.length === 1 && t.split(/\s+/).length <= 4)) restes.push(t);
  }
  if (restes.length) rapport.push({ theme, restes: [...new Set(restes)] });
}

const total = rapport.reduce((n, r) => n + r.restes.length, 0);
console.log(`${rapport.length} thèmes · ${total} textes encore en anglais\n`);
for (const r of rapport.slice(0, 12)) console.log(`  ${r.theme.padEnd(12)} ${r.restes.length}\t${r.restes.slice(0, 3).join(" | ").slice(0, 100)}`);
fs.writeFileSync("/tmp/anglais-restant.json", JSON.stringify(rapport, null, 1));
