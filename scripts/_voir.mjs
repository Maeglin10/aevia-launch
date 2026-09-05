import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const [theme, annexe] = process.argv[2].split("/");
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", tagline: "Zinc, ardoise et tuile plate depuis 1974", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93", template: theme } }) });
const { sessionId, editToken } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
  body: JSON.stringify({ businessProfile: { services: [{ name: "Réfection complète de toiture", description: "Dépose, charpente vérifiée, couverture neuve." }, { name: "Zinguerie et gouttières", description: "Chéneaux et solins en zinc." }], legal: { companyAddress: "14 route des Creuses, 74000 Annecy" } } }) });
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(`${BASE}/templates/${theme}/${annexe}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
const t = (await p.evaluate(() => document.body.innerText ?? "")).replace(/\s+/g, " ");
console.log(`${theme}/${annexe} → nom:${t.includes("Ateliers Vidal") ? "✓" : "✗"} · ${t.slice(0, 190)}`);
await b.close();
