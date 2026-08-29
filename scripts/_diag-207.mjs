import { chromium } from "playwright";
const NOM = "Zarbotil Quenvale", TEL = "+33 4 78 12 34 56";
const S = { id: "v", formData: { businessName: NOM, phone: TEL }, businessProfile: { identity: { name: NOM }, contacts: { general: { phone: TEL } } }, generatedContent: {} };
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const p = await ctx.newPage();
for (const t of ["impact-207", "impact-209", "impact-131"]) {
  await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(4500);
  const r = await p.evaluate(() => {
    const t = document.body.innerText || "";
    const i = t.search(/(?<![\d\-])(?:\+33[\s.]?|0)[1-9](?:[\s.]?\d{2}){4}(?![\d\-])/);
    return { sien: t.includes("78 12 34 56"), contexte: i >= 0 ? t.slice(Math.max(0, i - 60), i + 30).replace(/\s+/g, " ") : "(aucun)" };
  });
  console.log(`${t} : le sien ${r.sien ? "OK" : "ABSENT"} · « …${r.contexte}… »`);
}
await nav.close();
