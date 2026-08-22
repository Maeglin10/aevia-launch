/*
  Régénère lib/templates/templateTier.ts depuis les comptes de <section> des
  pages d'accueil — la règle d'origine du fichier (<=3 landing, 4-5 essentiel,
  6-7 pro, 8+ premium), appliquée cette fois aux 373 thèmes.

  La carte précédente s'arrêtait à 315 entrées et le sélecteur replie sur
  « pro » : les 58 thèmes 326-383, devenus 8+ sections à la reprise, étaient
  vendus 899 € au lieu de 1499 €.

    node scripts/generer-paliers.mjs          # écrit le fichier, résume l'écart
*/
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const DOSSIER = path.join(RACINE, "app/templates");
const CIBLE = path.join(RACINE, "lib/templates/templateTier.ts");

const ancien = fs.readFileSync(CIBLE, "utf8");
const ancienTier = (id) => ancien.match(new RegExp(`"${id}":\\s*"(\\w+)"`))?.[1] ?? null;

const palier = (n) => (n <= 3 ? "landing" : n <= 5 ? "essentiel" : n <= 7 ? "pro" : "premium");

const themes = fs.readdirSync(DOSSIER).filter((d) => d.startsWith("impact-"))
  .filter((d) => fs.existsSync(path.join(DOSSIER, d, "page.tsx")))
  .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

const lignes = [];
const changements = [];
for (const id of themes) {
  const src = fs.readFileSync(path.join(DOSSIER, id, "page.tsx"), "utf8");
  const n = (src.match(/<section/g) ?? []).length;
  const t = palier(n);
  lignes.push(`  "${id}": "${t}", // ${n} sections`);
  const avant = ancienTier(id);
  if (avant !== t) changements.push(`${id}: ${avant ?? "absent"} -> ${t} (${n} sections)`);
}

const sortie = `// AUTO-GENERATED — do not hand-edit. Regenerate with: node scripts/generer-paliers.mjs
// Tier by number of visual <section> blocks in the theme's home page:
// <=3 landing(399), 4-5 essentiel(599), 6-7 pro(899), 8+ premium(1499).
export type SiteTier = 'landing' | 'essentiel' | 'pro' | 'premium';
export const TIER_PRICE: Record<SiteTier, number> = { landing: 399, essentiel: 599, pro: 899, premium: 1499 };
export const TEMPLATE_TIER: Record<string, SiteTier> = {
${lignes.join("\n")}
};
`;

fs.writeFileSync(CIBLE, sortie);
console.log(`${themes.length} thèmes inscrits · ${changements.length} palier(s) changé(s) :`);
for (const c of changements) console.log("  " + c);
