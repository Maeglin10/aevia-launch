import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const NOM = "Jardins Vivants";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
  await ctx.addInitScript(() => { try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
  const p = await ctx.newPage();
  const appels = [];
  p.on("request", (r) => { if (r.url().includes("/api/sessions")) appels.push(r.url().slice(-40)); });
  await p.goto(`${BASE}/templates/${theme}?session=v`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(6000);
  const r = await p.evaluate((nom) => {
    const t = (document.body.innerText || "").replace(/\s+/g, " ");
    const barre = document.querySelector("header, nav");
    return { vu: t.includes(nom), barre: (barre?.innerText || "").replace(/\s+/g, " ").slice(0, 70),
             extrait: t.slice(0, 90) };
  }, NOM);
  console.log(theme, JSON.stringify({ ...r, appels: appels.length }));
  await ctx.close();
}
await nav.close();
