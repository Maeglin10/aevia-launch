// Les 15 pages du groupe C portent-elles la donnée du client ?
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const PAGES = [
  ["impact-11","tarifs",["Détartrage Vidal"]],          // PLANS rendu (filtre: services avec prix)
  ["impact-11","mentoring",["Éloi Vidal"]],             // INSTRUCTORS rendu
  ["impact-27","studio",["Éloi Vidal"]],                // crew
  ["impact-27","contact",["Intervenez-vous le dimanche"]],
  ["impact-30","team",["Éloi Vidal"]],
  ["impact-30","soins",["Détartrage Vidal"]],
  ["impact-32","contact",["Éloi Vidal","Intervenez-vous le dimanche"]],
  ["impact-35","community",["chantier laissé propre"]],
  ["impact-38","contact",["Intervenez-vous le dimanche"]], // ateliers dans un onglet, vérifiés par clic
  ["impact-38","abonnement",["chantier laissé propre"]],
  ["impact-42","production",["Détartrage Vidal"]],
  ["impact-42","studios",["Détartrage Vidal"]],
  ["impact-56","visite",["Détartrage Vidal"]],
];
const PROFIL = {
  services: [{ name: "Détartrage Vidal", description: "En moins d'une heure.", price: "45€" }],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Intervention nette, chantier laissé propre.", rating: 5 }] },
};
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let defauts = 0;
for (const [theme, route, preuves] of PAGES) {
  const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: theme } }) });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée");
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: PROFIL }) });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(2800);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  const absentes = preuves.filter((x) => !t.includes(x));
  if (absentes.length) { defauts++; console.log(`${theme}/${route}  manque : ${absentes.join(" · ")}`); }
  await p.close();
}
// Témoin : sans profil, la page doit rester en démonstration.
{
  const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { businessName: "Témoin Sans Profil", city: "Annecy", businessType: "plombier", tagline: "x", template: "impact-11" } }) });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/impact-11/tarifs?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(2500);
  const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  console.log(t.includes("Sarah")||t.length>3000 ? "témoin sain : la démonstration reste sans profil" : "TÉMOIN MORT : démonstration absente sans profil");
  await p.close();
}
await b.close();
console.log(`\n${PAGES.length} pages · ${defauts} en défaut`);
