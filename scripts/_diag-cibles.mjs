import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route] = process.argv.slice(2);
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: theme } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(4600);
const out = await p.evaluate(() => {
  const res = [];
  for (const e of document.querySelectorAll("a, button, [role=button], input, select")) {
    const s = getComputedStyle(e);
    if (s.display === "none" || s.visibility === "hidden" || s.pointerEvents === "none") continue;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (Math.min(r.width, r.height) >= 32) continue;
    res.push({ t: ((e.textContent ?? "").trim() || e.tagName).slice(0, 26), w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top), tag: e.tagName, cls: (e.className ?? "").toString().slice(0, 40) });
  }
  return res;
});
console.log(theme + "/" + route);
for (const o of out) console.log("  ", o.tag, JSON.stringify(o.t), `${o.w}x${o.h}`, "y=" + o.y, o.cls);
await b.close();
