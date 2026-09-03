/* Les mots anglais restés dans les traductions françaises.

   Une traduction de masse laisse des calques : « préparé avec le rigor d'une
   tradition séculaire » était en production sur impact-126, côté français du
   dictionnaire. Le mot anglais est passé parce que la phrase, dans son
   ensemble, ressemblait à du français.

   On ne relit pas trois cents dictionnaires à la main : on cherche, dans le
   SEUL bloc `fr:`, les mots qui n'existent pas en français.

     node scripts/_calques-traduction.mjs

   ⚠️ Un nom propre, une marque ou un terme consacré — « Home staging »,
   « Campo de' Fiori » — n'est pas un calque. La liste ci-dessous ne retient
   que des mots courants dont le français a un équivalent évident.
*/
import fs from "node:fs";

const CALQUES = /\b(rigor|craftmanship|craftsmanship|awareness|insights?|features?|pricing|discover|journey|seamless|wellness|mindset|empowering|leverage|framework|workflow|onboarding|showcase|highlights?|our|your|with the|of the|and the|for the|in the)\b/gi;

const trouves = [];
for (const d of fs.readdirSync("app/templates")) {
  const f = `app/templates/${d}/traductions.ts`;
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  /* Le bloc français seulement : les clés sont anglaises par construction, et
     les blocs es/de/pt ont leurs propres faux amis. */
  const deb = src.indexOf("\n  fr: {");
  if (deb < 0) continue;
  const fin = src.indexOf("\n  },", deb);
  for (const ligne of src.slice(deb, fin).split("\n")) {
    /* La VALEUR, pas la clé : « "our story": "Notre histoire" » est correct. */
    const m = /^\s*"(?:[^"\\]|\\.)*"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(ligne);
    if (!m) continue;
    const mots = [...new Set((m[1].match(CALQUES) || []).map((x) => x.toLowerCase()))];
    if (mots.length) trouves.push({ theme: d, mots, phrase: m[1].slice(0, 100) });
  }
}

console.log(`${trouves.length} valeur(s) française(s) contenant un mot anglais`);
for (const t of trouves) console.log(`  ${t.theme} [${t.mots.join(",")}] ${t.phrase}`);
