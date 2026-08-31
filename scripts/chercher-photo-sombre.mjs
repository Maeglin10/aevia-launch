/* Une photo assez sombre pour porter un titre clair.

   La diversification a remplacé des photos sans regarder leur luminosité :
   six héros sont devenus illisibles. On mesure donc chaque candidate — on la
   télécharge, on calcule sa luminosité moyenne — et on garde la plus sombre.
   Le seuil vient du calcul de contraste du WCAG, pas d'une impression. */
import fs from "node:fs";
import { createRequire } from "module";
const sharp = createRequire(import.meta.url)("sharp");

const cle = (n) => {
  for (const f of [".env.local", ".env"]) {
    if (!fs.existsSync(f)) continue;
    const m = new RegExp(`^${n}=(.*)$`, "m").exec(fs.readFileSync(f, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
};
const PEXELS = cle("PEXELS_API_KEY");
const clair = process.argv.includes("--clair");

const dejaVues = new Set();
(function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) { scan(p); continue; }
    if (!e.name.endsWith(".tsx")) continue;
    for (const m of fs.readFileSync(p, "utf8").matchAll(/images\.pexels\.com\/photos\/(\d+)/g)) dejaVues.add(m[1]);
  }
})("app/templates");

async function luminosite(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const st = await sharp(buf).resize(80).stats();
    const [rr, gg, bb] = st.channels.slice(0, 3).map((c) => c.mean);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rr) + 0.7152 * f(gg) + 0.0722 * f(bb);
  } catch { return null; }
}

const demandes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const sortie = {};
for (const [theme, termes] of Object.entries(demandes)) {
  let meilleure = null;
  for (const q of termes) {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=14&locale=fr-FR&orientation=landscape`,
      { headers: { Authorization: PEXELS } });
    if (!r.ok) continue;
    const d = await r.json();
    for (const p of d.photos ?? []) {
      if (dejaVues.has(String(p.id))) continue;
      const url = `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
      const L = await luminosite(url);
      if (L == null) continue;
      /* Un titre blanc a besoin d'un fond sous 0,18 pour dépasser 3:1. */
      /* Un titre NOIR demande l'inverse : la photo la plus CLAIRE. Le sens se
         donne par « --clair ». Mesuré : impact-136 a un titre noir, et
         l'assombrir l'avait rendu illisible. */
      const mieux = clair ? L > (meilleure?.L ?? -1) : L < (meilleure?.L ?? 2);
      if (mieux) meilleure = { id: p.id, url, L, alt: p.alt || q };
      if (clair ? meilleure.L > 0.55 : meilleure.L < 0.10) break;
    }
    if (meilleure && (clair ? meilleure.L > 0.55 : meilleure.L < 0.10)) break;
  }
  if (meilleure) { dejaVues.add(String(meilleure.id)); sortie[theme] = meilleure; }
  console.log(`${theme} : ${meilleure ? `pexels:${meilleure.id} · luminosité ${meilleure.L.toFixed(3)} · ${meilleure.alt.slice(0,44)}` : "AUCUNE"}`);
}
/* Fichier de sortie paramétré : la première version écrasait toujours le même
   et un second appel effaçait le premier résultat. Deux fois le même piège
   dans la même session. */
fs.writeFileSync(process.argv[3] ?? "captures/contact/photos-sombres.json", JSON.stringify(sortie, null, 2));
