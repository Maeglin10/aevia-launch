/*
  Voir le héros — la seule vérité de ce chantier.

  Les jauges de ressemblance se sont trompées trois fois ; l'écran, jamais.
  Ce script ouvre chaque thème en 1280 et en 390, capture le premier écran
  (pas la page entière : c'est ce qu'un visiteur voit avant de juger), et
  refuse silencieusement de mentir : il relève aussi le débordement
  horizontal réel et les erreurs de page.

    node scripts/voir-hero.mjs 329 330 331
    node scripts/voir-hero.mjs 329-343
    SORTIE=/tmp/heros node scripts/voir-hero.mjs 340

  Sortie : <SORTIE>/impact-NNN-1280.png et -390.png, plus un verdict par thème.
*/
import { chromium } from "playwright";
import { promises as fs } from "fs";
import path from "path";

const BASE = `http://localhost:${process.env.PORT || 3000}`;
const SORTIE = process.env.SORTIE || "/tmp/heros";

const ECRANS = [
  { nom: "1280", width: 1280, height: 860 },
  { nom: "390", width: 390, height: 844 },
];

const CACHER_DEV = `
  nextjs-portal, [data-nextjs-portal], #__next-build-watcher,
  [data-nextjs-toast], button[data-nextjs-errors-close-button],
  #aevia-webchat-root { display: none !important; }
`;

/** « 329-343 » et « 329 330 » désignent la même chose. */
function ids(args) {
  const out = [];
  for (const a of args.flatMap((x) => x.split(","))) {
    const plage = a.match(/^(\d+)-(\d+)$/);
    if (plage) { for (let n = +plage[1]; n <= +plage[2]; n++) out.push(`impact-${n}`); continue; }
    if (a.trim()) out.push(`impact-${a.trim().replace(/^impact-/, "")}`);
  }
  return out;
}

const cibles = ids(process.argv.slice(2));
if (!cibles.length) { console.error("usage : node scripts/voir-hero.mjs 329-343"); process.exit(1); }

await fs.mkdir(SORTIE, { recursive: true });
const navigateur = await chromium.launch({ headless: true });
let fautes = 0;

for (const id of cibles) {
  for (const e of ECRANS) {
    const ctx = await navigateur.newContext({ viewport: { width: e.width, height: e.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const erreurs = [];
    page.on("pageerror", (err) => erreurs.push(err.message.split("\n")[0]));
    /* Le bruit de mesure : analytics bloqué en local, favicon absente, avis
       de React. Ce ne sont pas des fautes de page ; les compter faisait
       passer 100 % des thèmes pour cassés. */
    const bruit = /favicon|404|Download the React|google-analytics|googletagmanager|doubleclick|ERR_BLOCKED|net::ERR/i;
    page.on("console", (m) => { if (m.type() === "error" && !bruit.test(m.text())) erreurs.push(m.text().slice(0, 120)); });
    try {
      await page.addInitScript(() => {
        const c = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: 1 });
        localStorage.setItem("aevia-cookie-consent", c);
        localStorage.setItem("aevia-consent", c);
      });
      await page.goto(`${BASE}/templates/${id}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.addStyleTag({ content: CACHER_DEV });
      await page.waitForTimeout(2400);

      /* Le débordement se mesure sur le document, pas sur un élément choisi :
         une mesure ciblée avait déjà annoncé « 0 px » sur une page qui
         débordait de 40. */
      const debord = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      await page.screenshot({ path: path.join(SORTIE, `${id}-${e.nom}.png`) });

      const souci = [];
      if (debord > 0) souci.push(`débord ${debord}px`);
      if (erreurs.length) souci.push(`erreur : ${erreurs[0]}`);
      if (souci.length) fautes++;
      console.log(`${id} ${e.nom.padEnd(4)} ${souci.length ? `⚠ ${souci.join(" · ")}` : "ok"}`);
    } catch (err) {
      fautes++;
      console.log(`${id} ${e.nom.padEnd(4)} ⚠ ${err.message.split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
}

await navigateur.close();
console.log(`\n${cibles.length} thèmes · ${fautes} écran(s) fautif(s) · images dans ${SORTIE}`);
process.exit(fautes ? 1 : 0);
