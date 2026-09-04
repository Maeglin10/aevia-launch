/* Les planches de revue : ce que je dois REGARDER, thème par thème.

   Aucune jauge ici. Trois images par thème, parce que trois défauts se logent
   à trois endroits différents :
     — le héros à 1280, où se jouent la lisibilité et le contraste ;
     — le héros à 390, où la mise en page bascule et où les boutons tombent ;
     — la page entière réduite, où se voient les sections vides, les blocs
       décalés, les photos qui n'ont rien à faire là.

     BASE_URL=http://localhost:3100 node scripts/_planches.mjs impact-01 …
*/
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
fs.mkdirSync("captures/revue", { recursive: true });

const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  for (const [nom, w, h] of [["desktop", 1280, 900], ["mobile", 390, 844]]) {
    const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: w, height: h } });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
        localStorage.setItem("site-analytics-consent", "refused");
      } catch {}
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 120000 });
      /* La traduction et les textes du client arrivent en plusieurs passes. */
      await p.waitForTimeout(4200);
      await p.screenshot({ path: `captures/revue/${theme}-${nom}.png` });
      if (nom === "desktop") {
        /* La page entière, réduite : on n'y lit pas le texte, on y voit la
           structure — une section vide, un bloc décalé, une photo hors sujet. */
        await p.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 90));
          }
          window.scrollTo(0, 0);
        });
        await p.waitForTimeout(700);
        await p.screenshot({ path: `captures/revue/${theme}-page.jpeg`, fullPage: true, type: "jpeg", quality: 55, scale: "css" });
      }
    } catch (e) {
      console.log(`${theme} ${nom} | échec ${String(e).slice(0, 60)}`);
    }
    await ctx.close();
  }
  console.log(theme);
}
await nav.close();
