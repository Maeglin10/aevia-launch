import { chromium } from "playwright";
const NOM = "Zarbotil Quenvale", TEL = "+33 4 78 12 34 56";
const SESSION = { id: "v", formData: { businessName: NOM, phone: TEL }, businessProfile: { identity: { name: NOM }, contacts: { general: { phone: TEL } } }, generatedContent: {} };
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }));
const p = await ctx.newPage();
for (const n of ["impact-30", "impact-300", "impact-305", "impact-317", "impact-375", "impact-379"]) {
  await p.goto(`http://localhost:3000/templates/${n}?session=v`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(4000);
  const r = await p.evaluate((nom) => {
    const t = document.body.innerText || "";
    return { nom: t.toLowerCase().includes(nom.toLowerCase()), tel: t.includes("78 12 34 56") || [...document.querySelectorAll('a[href^="tel:"]')].some(a => a.href.replace(/\D/g,"").endsWith("478123456")), debut: t.trim().slice(0, 70).replace(/\s+/g, " ") };
  }, NOM);
  console.log(`${n} : nom ${r.nom ? "OK" : "ABSENT"} · tel ${r.tel ? "OK" : "ABSENT"} · « ${r.debut} »`);
}
await nav.close();
