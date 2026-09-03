import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const [theme, larg = "390", y = "0"] = process.argv.slice(2);
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: +larg, height: 844 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused");
} catch {} });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
await p.evaluate((y) => window.scrollTo(0, +y), y);
await p.waitForTimeout(2000);
const f = `captures/${theme}-${larg}-${y}.png`;
await p.screenshot({ path: f });
console.log(f);
await nav.close();
