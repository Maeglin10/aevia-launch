import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const [pg, marque] = process.argv.slice(2);
const [theme, annexe] = pg.split("/");
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", template: theme } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(`${BASE}/templates/${theme}/${annexe}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
console.log(JSON.stringify(await p.evaluate((m) => {
  const out = [];
  for (const e of document.querySelectorAll("*")) {
    if (e.children.length) continue;
    const t = (e.textContent ?? "").trim();
    if (!t.toLowerCase().includes(m.toLowerCase())) continue;
    out.push(`${e.tagName.toLowerCase()}.${String(e.className).slice(0, 26)} « ${t.slice(0, 70)} »`);
    if (out.length >= 4) break;
  }
  return out;
}, marque), null, 1));
await b.close();
