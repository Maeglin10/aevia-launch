import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", phone: "04 50 11 22 33", email: "contact@ateliers-vidal.fr", template: "impact-14" } }) });
const { sessionId, editToken } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
  body: JSON.stringify({ businessProfile: { geo: { address: "12 rue des Marquisats, 74000 Annecy" } } }) });
const b = await chromium.launch();
for (const route of ["contact", "experience", "fleet"]) {
  const p = await b.newPage();
  await p.goto(`${BASE}/templates/impact-14/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(3200);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1000);
  const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  console.log(`impact-14/${route}`.padEnd(22),
    "adresse du client:", t.includes("12 rue des Marquisats") ? "OUI" : "non",
    "· téléphone:", t.includes("04 50 11 22 33") ? "OUI" : "non",
    "| adresse mi-vraie « Rue du Rhône … Annecy »:", /Rue du Rhône[^.]{0,30}Annecy/.test(t) ? "RESTE" : "partie",
    "| Monaco démo:", t.includes("Port Hercules") ? "reste" : "parti");
  await p.close();
}
await b.close();
