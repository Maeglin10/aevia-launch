/* Les images réellement affichées, thème par thème.

   L'audit sur le code se trompe : une même photo s'écrit de vingt façons, et
   certaines arrivent par un raccourci. On lit donc ce que le navigateur charge
   vraiment — <img>, background-image, et le srcset retenu — puis on demande :

     · combien d'images distinctes ce thème montre-t-il ?
     · lesquelles servent aussi ailleurs, et dans combien de thèmes ?
     · quelle banque, et l'image répond-elle (une 404 est une image morte) ?

   L'identité d'une photo est son identifiant de banque, jamais son URL. */
import { chromium } from "playwright";
import fs from "node:fs";

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

function identifiant(u) {
  /* next/image réécrit tout en « /_next/image?url=<encodé> ». La première
     version de cette jauge jetait ces URL comme du bruit interne et annonçait
     146 thèmes sans photo — alors que la photo était là, derrière l'optimiseur.
     On déballe donc le paramètre avant d'identifier. */
  const opt = /\/_next\/image\?[^ ]*url=([^&]+)/.exec(u);
  if (opt) { try { u = decodeURIComponent(opt[1]); } catch {} }
  let m = /images\.unsplash\.com\/photo-([A-Za-z0-9_-]{8,})/.exec(u);
  if (m) return "unsplash:" + m[1];
  m = /images\.pexels\.com\/photos\/(\d+)/.exec(u);
  if (m) return "pexels:" + m[1];
  m = /^https?:\/\/[^/]+(\/[^?]*)/.exec(u);
  return m ? "autre:" + m[1] : null;
}

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 1200 } });
const parTheme = {}, parImage = new Map(), mortes = new Map();

for (const t of themes) {
  const p = await ctx.newPage();
  const codes = new Map();
  p.on("response", (r) => {
    const u = r.url();
    if (/images\.(unsplash|pexels)\.com/.test(u)) codes.set(u, r.status());
  });
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(2500);
    /* Défiler : la moitié des photos n'est chargée qu'à l'approche. */
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(1800);
    const urls = await p.evaluate(() => {
      const out = new Set();
      for (const im of document.querySelectorAll("img")) if (im.currentSrc || im.src) out.add(im.currentSrc || im.src);
      for (const el of document.querySelectorAll("*")) {
        const b = getComputedStyle(el).backgroundImage;
        if (b && b !== "none") for (const m of b.matchAll(/url\("?([^")]+)"?\)/g)) out.add(m[1]);
      }
      return [...out];
    });
    const ids = new Set();
    for (const u of urls) {
      const id = identifiant(u);
      if (!id || id.startsWith("autre:/_next")) continue;   // ce qui reste vraiment interne
      ids.add(id);
      if (!parImage.has(id)) parImage.set(id, new Set());
      parImage.get(id).add(t);
    }
    for (const [u, code] of codes) if (code >= 400) mortes.set(t, (mortes.get(t) ?? 0) + 1);
    parTheme[t] = [...ids];
    process.stdout.write(".");
  } catch (e) { console.log(`\n${t} : ${String(e).split("\n")[0].slice(0, 50)}`); }
  await p.close();
}
await nav.close();

const tailles = Object.entries(parTheme).map(([t, v]) => [t, v.length]).sort((a, b) => a[1] - b[1]);
const banque = (id) => id.split(":")[0];
const usages = {};
for (const [id, s] of parImage) usages[banque(id)] = (usages[banque(id)] ?? 0) + s.size;

console.log(`\n\n=== ${themes.length} thèmes rendus ===`);
console.log("banques :", Object.entries(usages).map(([b, n]) => `${b} ${n}`).join(" · "));
console.log(`images distinctes au total : ${parImage.size}`);
console.log(`médiane par thème : ${tailles[Math.floor(tailles.length / 2)][1]}`);
const vides = tailles.filter(([, n]) => n === 0);
console.log(`thèmes SANS aucune photo : ${vides.length}${vides.length ? " — " + vides.slice(0, 12).map(([t]) => t).join(", ") : ""}`);
const maigres = tailles.filter(([, n]) => n > 0 && n <= 2);
console.log(`thèmes avec 1 ou 2 photos : ${maigres.length}`);
const partagees = [...parImage].filter(([, s]) => s.size > 1).sort((a, b) => b[1].size - a[1].size);
console.log(`images vues dans plus d'un thème : ${partagees.length}`);
partagees.slice(0, 8).forEach(([id, s]) => console.log(`   ${id} : ${s.size} thèmes`));
if (mortes.size) console.log(`thèmes avec au moins une image en erreur : ${mortes.size} — ${[...mortes.keys()].slice(0, 10).join(", ")}`);

fs.writeFileSync("captures/contact/audit-images-rendu.json", JSON.stringify({
  parTheme, partagees: partagees.map(([id, s]) => [id, [...s]]), mortes: [...mortes],
}, null, 2));
