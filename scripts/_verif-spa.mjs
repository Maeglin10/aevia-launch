/* Le clic de navigation SPA fonctionne-t-il vraiment ?
   On clique chaque lien de barre et on vérifie que la page change. */
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
const p = await ctx.newPage();
for (const theme of process.argv.slice(2)) {
  await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(2500);
  const liens = await p.evaluate(() =>
    [...document.querySelectorAll("header a[href^='#'], nav a[href^='#']")].map(a => (a.textContent || "").trim()).filter(Boolean).slice(0, 5));
  const resultats = [];
  for (const lib of liens) {
    await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(1800);
    const avant = await p.evaluate(() => document.body.innerText.slice(0, 400));
    try {
      await p.click(`header a:has-text("${lib}"), nav a:has-text("${lib}")`, { timeout: 3000 });
      await p.waitForTimeout(1200);
      const apres = await p.evaluate(() => ({ t: document.body.innerText.slice(0, 400), y: window.scrollY }));
      const change = apres.t !== avant || apres.y > 50;
      resultats.push(`${lib}:${change ? "ok" : "INERTE"}`);
    } catch { resultats.push(`${lib}:?`); }
  }
  console.log(theme, "|", resultats.join(" "));
}
await nav.close();
