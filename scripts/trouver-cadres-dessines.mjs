/* Un cadre qui attend une photo, et contient un dessin.

   Beaucoup de SVG d'un thème sont des icônes ou des ornements : les
   remplacer serait une faute. On cherche donc une forme précise, au rendu :
   un bloc à proportions fixes, assez grand pour être une illustration, dont
   le contenu visible se résume à un dessin — aucune image dedans. */
import { chromium } from "playwright";
import fs from "node:fs";

const themes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 1000 } });
const trouves = {};

for (const t of themes) {
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(2500);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(900);
    trouves[t] = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("div, figure, section")) {
        const b = e.getBoundingClientRect();
        if (b.width < 200 || b.height < 200) continue;
        const st = getComputedStyle(e);
        if (st.aspectRatio === "auto" && Math.abs(b.width / b.height - 1) > 0.9) continue;
        if (e.querySelector("img")) continue;
        const svgs = e.querySelectorAll("svg");
        if (!svgs.length) continue;
        /* le dessin occupe vraiment le cadre */
        const gros = [...svgs].some((s) => {
          const sb = s.getBoundingClientRect();
          return sb.width > b.width * 0.5 && sb.height > b.height * 0.4;
        });
        if (!gros) continue;
        out.push({ w: Math.round(b.width), h: Math.round(b.height), cls: (e.className || "").toString().slice(0, 40) });
      }
      return out.slice(0, 3);
    });
  } catch { trouves[t] = []; }
  await p.close();
}
await nav.close();
const avec = Object.entries(trouves).filter(([, v]) => v.length);
avec.forEach(([t, v]) => console.log(`${t} : ${v.length} cadre(s) — ${v.map((x) => `${x.w}×${x.h}`).join(" ")}`));
console.log(`\n${themes.length} thèmes · ${avec.length} avec un cadre dessiné`);
fs.writeFileSync("captures/contact/cadres-dessines.json", JSON.stringify(trouves, null, 2));
