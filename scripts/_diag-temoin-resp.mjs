import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const NOM = "Ateliers Vidal Marquisats Bellevaux et Fils Réunis Plomberie Chauffage Sanitaire depuis Mille Neuf Cent Douze Maison Fondée à Annecy Haute Savoie France Européenne Internationale Mondiale Universelle";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: NOM, city: "Annecy", businessType: "plombier", tagline: "x", template: "impact-99" } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/impact-99/carte?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(4600);

const avant = await p.evaluate((nom) => {
  const t = document.body.textContent ?? "";
  return { nomAffiche: t.includes(nom.slice(0, 40)), largeurDoc: document.documentElement.scrollWidth };
}, NOM);
console.log("le nom long est affiché :", avant.nomAffiche ? "OUI" : "non", "| largeur du document :", avant.largeurDoc);

// On injecte un débordement volontaire portant la donnée du client.
const vu = await p.evaluate((nom) => {
  const d = document.createElement("div");
  d.style.cssText = "position:relative;width:900px;white-space:nowrap;font-size:20px";
  d.textContent = nom;
  document.body.appendChild(d);
  const marge = 2, largeur = 390;
  const r = d.getBoundingClientRect();
  return { dehors: r.right > largeur + marge, docDefile: document.documentElement.scrollWidth > largeur + marge };
}, NOM);
console.log("débordement injecté détecté :", vu.dehors ? "OUI" : "NON — instrument mort", "| le document défile :", vu.docDefile ? "OUI" : "non");
await b.close();
