// Pourquoi la section reste-t-elle muette ? On regarde la page, pas le code.
//
//   node scripts/_diag-team.mjs impact-01 impact-19
//
// Jetable : sert à trancher entre « le thème n'affiche pas la donnée » et
// « l'instrument cherche au mauvais endroit ».

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ids = process.argv.slice(2);

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });

for (const id of ids) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy", template: id,
    } }),
  });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée");
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: {
      team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
      reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Intervention nette, chantier laissé propre.", rating: 5 }] },
      services: [{ name: "Détartrage Vidal", description: "En moins d'une heure." }],
    } }),
  });

  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(3000);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1500);

  const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  const dit = (v) => (t.includes(v) ? "OUI" : "non");
  /*
    Les noms de la démonstration disent l'autre moitié : si « Léa Fontaine »
    reste à l'écran, la liste du client n'a pas remplacé la sienne.
  */
  console.log(
    id.padEnd(12),
    "Éloi Vidal:", dit("Éloi Vidal"),
    "· Perrine:", dit("Perrine Anselme"),
    "· Détartrage:", dit("Détartrage Vidal"),
    "| démo restée — Léa Fontaine:", dit("Léa Fontaine"),
  );
  await p.close();
}

await b.close();
