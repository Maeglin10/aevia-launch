import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const [theme, larg = "390", y = "0", etat = "vitrine"] = process.argv.slice(2);
const NOM = "Jardins Vivants";
const SESSION = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: +larg, height: 844 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused");
} catch {} });
if (etat === "client") {
  await ctx.route("**/api/sessions**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }));
}
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}${etat === "client" ? "?session=v" : ""}`, { waitUntil: "networkidle", timeout: 60000 });
await p.evaluate((y) => window.scrollTo(0, +y), y);
await p.waitForTimeout(2000);
const f = `captures/${theme}-${larg}-${y}-${etat}.png`;
await p.screenshot({ path: f });
console.log(f);
await nav.close();
