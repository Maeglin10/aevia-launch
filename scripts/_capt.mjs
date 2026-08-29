import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const [theme, annexe] = process.argv[2].split("/");
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", tagline: "Zinc, ardoise et tuile plate depuis 1974", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93", template: theme } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(`${BASE}/templates/${theme}/${annexe}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1200);
await p.screenshot({ path: process.argv[3], fullPage: true });
console.log("capture :", process.argv[3]);
await b.close();
