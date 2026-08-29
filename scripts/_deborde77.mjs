import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", tagline: "Zinc, ardoise et tuile plate depuis 1974", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93", template: "impact-77" } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
for (const [nom, largeur] of [["bureau", 1440], ["téléphone", 390]]) {
  const p = await (await b.newContext({ viewport: { width: largeur, height: 900 } })).newPage();
  await p.goto(`${BASE}/templates/impact-77/anatomy?session=${sessionId}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(4500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
  const d = await p.evaluate(() => {
    const doc = document.documentElement;
    const large = doc.clientWidth;
    const out = [];
    for (const e of document.querySelectorAll("*")) {
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.right <= large + 2) continue;
      const s = getComputedStyle(e);
      out.push({
        balise: e.tagName.toLowerCase(),
        classe: String(e.className).slice(0, 40),
        droite: Math.round(r.right), largeur: Math.round(r.width),
        position: s.position, transform: s.transform.slice(0, 26),
        texte: (e.textContent ?? "").trim().slice(0, 40),
      });
      if (out.length >= 6) break;
    }
    return { ecran: large, document: doc.scrollWidth, defile: doc.scrollWidth > large + 2, coupables: out };
  });
  console.log(`${nom} ${d.ecran} → document ${d.document} · défile ${d.defile ? "OUI" : "non"}`);
  d.coupables.forEach((c) => console.log(`   ${c.balise}.${c.classe} droite=${c.droite} largeur=${c.largeur} ${c.position} ${c.transform} « ${c.texte} »`));
  await p.close();
}
await b.close();
