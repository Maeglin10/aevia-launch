import { chromium } from "playwright";
const nav = await chromium.launch();
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } }, generatedContent: {} };
const ctx = await nav.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const p = await ctx.newPage();
const vus = new Set();
p.on("console", async (m) => {
  if (m.type() !== "error") return;
  if (!/same key/i.test(m.text())) return;
  const vals = [];
  for (const a of m.args()) { try { vals.push(String(await a.jsonValue())); } catch { vals.push("?"); } }
  const cle = vals.slice(1).join(" ").slice(0, 120);
  const loc = m.location();
  const l = `${cle} @ ${loc.url?.split("/").pop()}:${loc.lineNumber}`;
  if (!vus.has(l)) { vus.add(l); console.log("CLÉ DUPLIQUÉE :", l); }
});
for (const t of process.argv.slice(2)) {
  console.log("── " + t);
  await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 180000 });
  await p.waitForTimeout(6000);
}
await nav.close();
