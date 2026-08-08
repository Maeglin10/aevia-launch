// Où la ville de démonstration se lit-elle, dans la page rendue ?
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const VILLES = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Nice", "Strasbourg", "Rennes", "Montpellier"];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

for (const id of ids) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy", template: id, brandColor: "#c2410c",
    } }),
  });
  const { sessionId } = await r.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: { geo: { primaryCity: "Annecy", address: "12 rue des Alpes, Annecy" } } }),
  });
  await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2200);
  const texte = await p.evaluate(async () => {
    const bouts = [];
    for (let y = 0; y < document.body.scrollHeight; y += 900) {
      window.scrollTo(0, y);
      await new Promise((x) => setTimeout(x, 200));
      bouts.push(document.body.innerText);
    }
    return bouts.join("\n");
  });
  for (const v of VILLES) {
    if (v === "Annecy") continue;
    const m = new RegExp(`.{0,60}\\b${v}\\b.{0,40}`, "i").exec(texte);
    if (m) console.log(`${id.padEnd(12)} ${v} → …${m[0].replace(/\s+/g, " ").trim()}…`.slice(0, 175));
  }
}
await b.close();
