/* Chercher de vraies photos, par métier, dans les banques dont on a la clé.

   Le catalogue tire 84 % de ses images d'Unsplash, dont il n'existe pas de
   clé ici : on ne peut donc pas y chercher, seulement y laisser ce qui s'y
   trouve. Pexels et Pixabay répondent, et c'est aussi ce qu'il faut pour
   rééquilibrer.

   Trois règles :
     · la requête vient du registre — nom, catégorie, mots-clés — traduite en
       termes français ; on ne devine pas le métier ;
     · une photo déjà employée AILLEURS dans le catalogue est écartée : c'est
       tout l'objet ;
     · on vérifie que l'image répond avant de la retenir. Une photo morte est
       pire qu'une photo répétée.

     node scripts/chercher-photos.mjs <fichier-de-demandes.json>
   où le fichier est { "impact-03": ["boulangerie artisanale", "pain"], … }
*/
import fs from "node:fs";

const cle = (n) => {
  for (const f of [".env.local", ".env"]) {
    if (!fs.existsSync(f)) continue;
    const m = new RegExp(`^${n}=(.*)$`, "m").exec(fs.readFileSync(f, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
};
const PEXELS = cle("PEXELS_API_KEY");
const PIXABAY = cle("PIXABAY_API_KEY");

/* Ce que le catalogue emploie déjà — pour ne jamais le reproposer. */
const dejaVues = new Set();
(function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) { scan(p); continue; }
    if (!e.name.endsWith(".tsx")) continue;
    const src = fs.readFileSync(p, "utf8");
    for (const m of src.matchAll(/images\.pexels\.com\/photos\/(\d+)/g)) dejaVues.add("pexels:" + m[1]);
    for (const m of src.matchAll(/pixabay\.com\/[^"'`]*?(\d{6,})/g)) dejaVues.add("pixabay:" + m[1]);
  }
})("app/templates");

async function pexels(q, n) {
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${n}&locale=fr-FR&orientation=landscape`,
    { headers: { Authorization: PEXELS } });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.photos ?? []).map((p) => ({
    id: "pexels:" + p.id,
    url: `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
    alt: p.alt || q,
  }));
}

async function pixabay(q, n) {
  const r = await fetch(`https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(q)}&per_page=${Math.max(3, n)}&lang=fr&image_type=photo&orientation=horizontal&safesearch=true`);
  if (!r.ok) return [];
  const d = await r.json();
  return (d.hits ?? []).map((h) => ({
    id: "pixabay:" + h.id,
    url: h.largeImageURL,
    alt: h.tags || q,
  }));
}

/** Une image qui ne répond pas ne sert à rien. */
async function repond(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.ok;
  } catch { return false; }
}

const demandes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const resultat = {};
let retenues = 0, ecartees = 0;

for (const [theme, requetes] of Object.entries(demandes)) {
  const combien = requetes.combien ?? 4;
  const termes = requetes.termes ?? requetes;
  const prises = [];
  for (const q of termes) {
    if (prises.length >= combien) break;
    for (const source of [pexels, pixabay]) {
      if (prises.length >= combien) break;
      let lot = [];
      try { lot = await source(q, 12); } catch {}
      for (const p of lot) {
        if (prises.length >= combien) break;
        if (dejaVues.has(p.id)) { ecartees++; continue; }
        if (prises.some((x) => x.id === p.id)) continue;
        if (!(await repond(p.url))) { ecartees++; continue; }
        dejaVues.add(p.id);
        prises.push({ ...p, requete: q });
        retenues++;
      }
    }
  }
  resultat[theme] = prises;
  console.log(`${theme} : ${prises.length}/${combien} — ${prises.map((p) => p.id).join(" ")}`);
}

/* Un fichier de sortie par appel : la première version écrasait toujours le
   même, et le deuxième lot a effacé le premier — 140 photos perdues. */
const sortie = process.argv[3] ?? "captures/contact/photos-trouvees.json";
fs.writeFileSync(sortie, JSON.stringify(resultat, null, 2));
console.log(`écrit dans ${sortie}`);
console.log(`\n${retenues} photos retenues · ${ecartees} écartées (déjà employées ou muettes)`);
