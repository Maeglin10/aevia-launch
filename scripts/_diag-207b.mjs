import { chromium } from "playwright";
const NOM = "Zarbotil Quenvale", TEL = "+33 4 78 12 34 56";
const S = { id: "v", formData: { businessName: NOM, phone: TEL, email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: TEL, email: "bonjour@verif.fr" } } }, generatedContent: {} };
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const p = await ctx.newPage();
await p.goto("http://localhost:3000/templates/impact-207?session=v", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(5000);
console.log(await p.evaluate(() => {
  const t = document.body.innerText || "";
  const i = t.indexOf("SALES HOTLINE");
  const j = t.indexOf("78 12 34 56");
  return "bloc contact : « " + t.slice(i - 120, i + 160).replace(/\s+/g, " ") + " »\n"
       + "le sien vu à : « " + (j < 0 ? "nulle part" : t.slice(Math.max(0, j - 70), j + 20).replace(/\s+/g, " ")) + " »";
}));
await nav.close();
