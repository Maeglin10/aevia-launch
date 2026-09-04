import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${process.argv[2]}`, { waitUntil: "domcontentloaded", timeout: 90000 });
await p.waitForTimeout(3500);
console.log(await p.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll("body *")) {
    const b = e.getBoundingClientRect();
    if (b.top > 40 || b.height < 200 || b.height > 2000) continue;
    const s = getComputedStyle(e);
    out.push(`${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""} h=${Math.round(b.height)} top=${Math.round(b.top)} ov=${s.overflow} cls=${(e.className || "").toString().slice(0, 50)}`);
    if (out.length > 18) break;
  }
  return out.join("\n");
}));
await nav.close();
