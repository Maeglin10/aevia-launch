import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => { try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(3800);
  const r = await p.evaluate(() => {
    const t = (document.body.innerText || "").replace(/\s+/g, " ");
    const m = t.match(/.{0,40}(All rights reserved|Terms of Service|Privacy Policy|Made with).{0,20}/gi);
    return [...new Set(m || [])].slice(0, 3);
  });
  console.log(r.length ? `${theme} : ${JSON.stringify(r)}` : `${theme} | traduit`);
  await ctx.close();
}
await nav.close();
