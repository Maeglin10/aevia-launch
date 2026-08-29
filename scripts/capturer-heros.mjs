/* Capture le héros de chaque thème en litige, pour comparer deux versions.

   Le héros seulement : on cadre la première fenêtre, sans défiler. Deux
   passes, une par version, dans le même arbre de travail — jamais deux
   serveurs, qui ne compileraient pas le même code. */
import { chromium } from "playwright";
import fs from "node:fs";

const dossier = process.argv[2];
const themes = fs.readFileSync("/private/tmp/claude-501/-Users-milliandvalentin-skybot-inbox/8d5d04e6-ff0e-4585-8a48-1ecf36587a30/scratchpad/heros27.txt", "utf8").trim().split("\n");
const NOM = "Atelier Vérification";
const S = {
  id: "cmp",
  formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@atelier-verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } },
  generatedContent: {},
};

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const p = await ctx.newPage();
for (const t of themes) {
  try {
    await p.goto(`http://localhost:3000/templates/${t}?session=cmp`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(4200);
    await p.screenshot({ path: `captures/comparaison/${dossier}/${t}.png` });
    process.stdout.write(".");
  } catch (e) { console.log(`\n${t} : ${String(e).split("\n")[0].slice(0, 50)}`); }
}
console.log(`\n${themes.length} héros capturés dans ${dossier}`);
await nav.close();
