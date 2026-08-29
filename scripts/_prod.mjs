/* Vérifier en production ce qu'on a mesuré en local. (outil de travail) */
import { chromium } from "playwright";
const B = "https://launch.aevia.services";
const FORM = { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", tagline: "Zinc, ardoise et tuile plate depuis 1974", city: "Annecy", brandColor: "#7c3aed", email: "contact@ateliers-vidal.fr", phone: "04 50 71 82 93", instagram: "@ateliersvidal" };
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
for (const arg of process.argv.slice(2)) {
  const [page_, marque] = arg.split("|");
  const r = await fetch(`${B}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...FORM, template: page_.split("/")[0] } }) });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  await p.goto(`${B}/templates/${page_}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForFunction(() => (document.body.innerText ?? "").includes("Ateliers Vidal"), { timeout: 25000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const v = await p.evaluate(async (marque) => {
    const m = [];
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); m.push(document.body.innerText ?? ""); }
    const t = m.join(" ").replace(/\s+/g, " ");
    const formes = [marque, marque.toUpperCase(), marque.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, a, b) => a + b.toUpperCase())];
    const trouve = formes.find((f) => new RegExp(`(?<![\\w])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`).test(t));
    return { nom: t.includes("Ateliers Vidal"), marque: trouve ?? null, deCote: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2 };
  }, marque);
  console.log(`${page_.padEnd(22)} nom client: ${v.nom ? "oui" : "NON"} · marque démo: ${v.marque ?? "absente"} · défile de côté: ${v.deCote ? "OUI" : "non"}`);
  await p.close();
}
await nav.close();
