/* Toutes les photos du catalogue répondent-elles ?

   Les liens `pixabay.com/get/…` sont des adresses de diffusion éphémères : les
   trente-sept que portait le catalogue répondaient TOUTES 400, et vingt-six
   thèmes affichaient une image cassée sans que personne le sache. Le défaut
   avait été trouvé par hasard — une ligne « 1 image morte » dans un balayage.

   Ce script ne compte pas sur le hasard : il relève chaque URL de photo du
   catalogue et interroge les banques une fois par adresse.

     node scripts/verifier-photos-vivantes.mjs

   ⚠️ Une URL de photo ne finit pas par « .jpg » : elle porte une requête
   (« ?q=80&w=1600 »). On prend donc tout ce qui vient des trois banques,
   jusqu'au premier guillemet, espace ou parenthèse fermante.
*/
import fs from "node:fs";
import path from "node:path";

const MOTIF = /https:\/\/(?:images\.)?(?:unsplash|pexels|pixabay)\.com\/[^"'`)\s\\]+/g;

/* Un thème sur dix ne pose pas l'adresse en clair : il garde le préfixe dans
   une constante — `const PHOTO_BASE = 'https://images.unsplash.com/photo-'` —
   et n'écrit que l'identifiant. Le relevé brut voit alors le préfixe nu, la
   banque répond 404, et les vraies photos, elles, ne sont jamais interrogées.
   On résout donc les constantes du fichier avant de relever. */
const LITTERAL = /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*["'`]([^"'`\n]*)["'`]|function\s+([A-Za-z_$][\w$]*)\s*\(\s*\)\s*\{\s*return\s+["'`]([^"'`\n]*)["'`]/g;

function resoudre(src) {
  const vals = new Map();
  for (const m of src.matchAll(LITTERAL)) vals.set(m[1] ?? m[3], m[2] ?? m[4]);
  /* `PHOTO_BASE = PHOTO_BASE_LIVE()` : une indirection, pas deux. */
  for (const [k, v] of vals) if (vals.has(v)) vals.set(k, vals.get(v));
  return src.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (t, n) => (vals.get(n) ?? t));
}

function fichiers(racine) {
  const out = [];
  for (const e of fs.readdirSync(racine, { withFileTypes: true })) {
    const p = path.join(racine, e.name);
    if (e.isDirectory()) out.push(...fichiers(p));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const parUrl = new Map();
const interpolees = new Set();
for (const f of fichiers("app/templates")) {
  const s = resoudre(fs.readFileSync(f, "utf8"));
  for (const m of s.matchAll(MOTIF)) {
    const theme = f.split("/")[2];
    /* Une adresse construite à l'exécution — « …/${product.img}?w=600 » — n'est
       pas une URL : la banque répond 404 et le rapport ment. Ces images-là se
       vérifient sur la page rendue, pas dans le source. */
    if (m[0].includes("${")) { interpolees.add(f.split("/")[2]); continue; }
    /* « …/photo- » tout court est le préfixe déclaré, pas une adresse. */
    if (/\/photo-$/.test(m[0])) continue;
    if (!parUrl.has(m[0])) parUrl.set(m[0], new Set());
    parUrl.get(m[0]).add(theme);
  }
}
const urls = [...parUrl.keys()];
console.log(`${interpolees.size} thèmes construisent leur adresse à l'exécution : à vérifier sur la page rendue.`);
console.log(`${urls.length} URL distinctes, ${new Set([...parUrl.values()].flatMap((s) => [...s])).size} thèmes`);

const mortes = [];
const lot = 24;
for (let i = 0; i < urls.length; i += lot) {
  await Promise.all(urls.slice(i, i + lot).map(async (u) => {
    try {
      const r = await fetch(u, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (!r.ok) mortes.push({ code: r.status, url: u, themes: [...parUrl.get(u)] });
    } catch {
      mortes.push({ code: "ERR", url: u, themes: [...parUrl.get(u)] });
    }
  }));
  process.stdout.write(`  ${Math.min(i + lot, urls.length)}/${urls.length}\r`);
}

console.log(`\n${mortes.length} photo(s) morte(s)`);
const parTheme = {};
for (const m of mortes) for (const t of m.themes) (parTheme[t] ??= []).push(`${m.code} ${m.url.slice(0, 90)}`);
for (const [t, l] of Object.entries(parTheme)) console.log(`  ${t} : ${l.length}`);
fs.writeFileSync("captures/photos-mortes.json", JSON.stringify(mortes, null, 1));
