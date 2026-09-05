/* Vérification en production : la traduction se fait dans le navigateur,
   curl ne peut rien voir. */
import { chromium } from "playwright";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`https://launch.aevia.services/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(4500);
  const t = await p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " ").slice(0, 300));
  console.log(`══ ${theme}\n${t}\n`);
  await ctx.close();
}
await nav.close();
