import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: +(process.env.W || 1280), height: 900 } });
  await ctx.addInitScript(() => { try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => {
    const txt = (document.body.innerText || "").replace(/\s+/g, " ");
    const re = /.{55}\b(home|about|our|your|book now|view all)\b.{25}/gi;
    return [...new Set(txt.match(re) || [])].slice(0, 5);
  });
  console.log(`== ${theme}`); for (const x of r) console.log("   ", JSON.stringify(x));
  await ctx.close();
}
await nav.close();
