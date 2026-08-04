import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const id = process.argv[2];
const d = {
  formData: { businessName: "Maison Test", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier à Annecy", email: `contact@${id}.fr`, phone: "04 50 11 22 33",
    brandColor: "#c2410c", template: id },
  businessProfile: {
    services: [{ name: `Prestation ${id}`, price: "137 €", description: "d" }],
    keyStats: [{ value: "18", label: "années d'expérience" }],
    faq: [{ q: `Question ${id} ?`, a: "r" }],
  },
  generatedContent: { heroHeadline: "Votre plombier à Annecy" },
};
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: d.formData }) });
const { sessionId } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" },
  body: JSON.stringify({ businessProfile: d.businessProfile, generatedContent: d.generatedContent }) });
const b = await chromium.launch();
const p = await b.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(String(e).slice(0, 200)));
await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
await p.waitForTimeout(2500);
const t = await p.evaluate(() => document.body.innerText);
console.log("session", sessionId, "| erreurs:", erreurs.join(" | ") || "aucune");
console.log("contient 18 :", /18/.test(t), "| contient 137 :", /137/.test(t));
if (process.argv[3] === "--haut") {
  for (const l of t.split("\n").slice(0, 16)) console.log("  ·", l.slice(0, 110));
} else {
  const motif = new RegExp(process.argv[3] || "année|137|€", "i");
  for (const l of t.split("\n")) if (motif.test(l)) console.log("  ·", l.slice(0, 100));
}
await b.close();
