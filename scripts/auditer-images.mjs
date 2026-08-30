/* Les images des thèmes : distinctes, et à leur place.

   Trois questions, mesurées sur le code, pas devinées :
     1. combien d'images distinctes chaque thème utilise-t-il ?
     2. une même image sert-elle dans plusieurs thèmes — et combien ?
     3. les deux banques (Unsplash, Pexels) sont-elles réellement employées,
        ou tout le catalogue tire-t-il d'une seule ?

   On identifie une image par son identifiant de banque, pas par son URL :
   la même photo apparaît sous vingt largeurs différentes. */
import fs from "node:fs";
import path from "node:path";

const racine = "app/templates";
const parTheme = new Map();      // thème -> Set d'identifiants
const parImage = new Map();      // identifiant -> Set de thèmes
const banques = new Map();       // banque -> nombre d'usages

function identifiant(url) {
  let m = /images\.unsplash\.com\/(?:photo-)?([A-Za-z0-9_-]{6,})/.exec(url);
  if (m) return "unsplash:" + m[1];
  m = /images\.pexels\.com\/photos\/(\d+)/.exec(url);
  if (m) return "pexels:" + m[1];
  return null;
}

function parcourir(d, theme) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) parcourir(p, theme);
    else if (e.name.endsWith(".tsx")) {
      const src = fs.readFileSync(p, "utf8");
      /* Deux écritures coexistent : l'URL entière, et le raccourci
         photo("1519681393784-…") qui la compose. La première version de cette
         jauge ne voyait que la première, et rendait « photo- » comme un
         identifiant partagé par 35 thèmes — un artefact, pas une photo. */
      const sources = [
        ...[...src.matchAll(/https:\/\/images\.(?:unsplash|pexels)\.com\/[^"'`\s)]+/g)].map((m) => m[0]),
        ...[...src.matchAll(/photo\(\s*["'`]([0-9]{10,}-[A-Za-z0-9_-]{6,})["'`]/g)].map((m) => "unsplash-id:" + m[1]),
      ];
      for (const u of sources) {
        const id = u.startsWith("unsplash-id:") ? "unsplash:" + u.slice(12) : identifiant(u);
        if (!id || id === "unsplash:photo-") continue;
        banques.set(id.split(":")[0], (banques.get(id.split(":")[0]) ?? 0) + 1);
        if (!parTheme.has(theme)) parTheme.set(theme, new Set());
        parTheme.get(theme).add(id);
        if (!parImage.has(id)) parImage.set(id, new Set());
        parImage.get(id).add(theme);
      }
    }
  }
}

const themes = fs.readdirSync(racine).filter((x) => /^impact-\d+$/.test(x))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
for (const t of themes) parcourir(path.join(racine, t), t);

console.log("=== banques ===");
for (const [b, n] of [...banques].sort((a, b) => b[1] - a[1])) console.log(`  ${b} : ${n} usages`);

console.log("\n=== combien d'images distinctes par thème ===");
const compte = [...parTheme].map(([t, s]) => [t, s.size]).sort((a, b) => a[1] - b[1]);
const pauvres = compte.filter(([, n]) => n <= 3);
console.log(`  médiane : ${compte[Math.floor(compte.length / 2)][1]}`);
console.log(`  thèmes avec 3 images ou moins : ${pauvres.length}`);
pauvres.slice(0, 12).forEach(([t, n]) => console.log(`     ${t} : ${n}`));
const sans = themes.filter((t) => !parTheme.has(t));
if (sans.length) console.log(`  thèmes SANS aucune image de banque : ${sans.length} — ${sans.slice(0, 10).join(", ")}`);

console.log("\n=== images partagées entre thèmes ===");
const partagees = [...parImage].filter(([, s]) => s.size > 1).sort((a, b) => b[1].size - a[1].size);
console.log(`  ${partagees.length} images servent dans plus d'un thème`);
partagees.slice(0, 10).forEach(([id, s]) => console.log(`     ${id} : ${s.size} thèmes`));

console.log("\n=== thèmes les plus « recopiés » ===");
const chevauchement = themes.map((t) => {
  const s = parTheme.get(t) ?? new Set();
  const empruntees = [...s].filter((id) => parImage.get(id).size > 1).length;
  return [t, s.size, empruntees];
}).filter(([, n]) => n > 0).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]));
chevauchement.slice(0, 10).forEach(([t, n, e]) => console.log(`  ${t} : ${e}/${n} images partagées avec d'autres`));

fs.writeFileSync("captures/contact/audit-images.json", JSON.stringify({
  parTheme: Object.fromEntries([...parTheme].map(([t, s]) => [t, [...s]])),
  partagees: partagees.map(([id, s]) => [id, [...s]]),
}, null, 2));
