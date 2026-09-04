import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 390, height: 844 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/impact-317`, { waitUntil: "domcontentloaded", timeout: 90000 });
await p.waitForTimeout(3800);
console.log(await p.evaluate(() => {
  const h = document.querySelector("#hero");
  const b = h.getBoundingClientRect();
  const out = [];
  for (const x of h.querySelectorAll("*")) {
    const r = x.getBoundingClientRect();
    if (r.height < 8 || r.bottom - b.bottom <= 2) continue;
    out.push(`${x.tagName.toLowerCase()} cls="${(x.className||"").toString().slice(0,50)}" box=${Math.round(r.top)}..${Math.round(r.bottom)} (héros finit ${Math.round(b.bottom)}) txt="${(x.textContent||"").trim().slice(0,30)}"`);
  }
  return out.slice(0, 6).join("\n");
}));
await nav.close();
