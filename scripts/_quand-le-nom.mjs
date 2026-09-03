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
  const t0 = Date.now();
  await p.goto(`${BASE}/templates/${theme}?session=v`, { waitUntil: "domcontentloaded", timeout: 90000 });
  const points = [];
  for (const t of [500, 1000, 2000, 4000, 6000, 9000, 12000]) {
    await p.waitForTimeout(t - (Date.now() - t0) > 0 ? t - (Date.now() - t0) : 0);
    points.push(`${t}ms:${await p.evaluate((n) => (document.body.innerText || "").includes(n), NOM) ? "vu" : "-"}`);
  }
  console.log(theme, points.join(" "));
  await ctx.close();
}
await nav.close();
