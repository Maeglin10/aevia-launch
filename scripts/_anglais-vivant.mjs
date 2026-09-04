/* Le mot anglais tel que le balayage le voit — DOM vivant, sans code ni caché. */
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const NOM = "Jardins Vivants";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  for (const [etat, larg] of [["vitrine", 1280], ["vitrine", 390], ["client", 1280], ["client", 390]]) {
    const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: larg, height: 900 } });
    if (etat === "client") await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
    await ctx.addInitScript(() => { try {
      localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
      localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${theme}${etat === "client" ? "?session=v" : ""}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(4200);
    const r = await p.evaluate(() => {
      const out = [];
      const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = m.nextNode(); n; n = m.nextNode()) {
        const e = n.parentElement; if (!e) continue;
        if (e.closest("code, pre, kbd, samp, style, script, noscript, template")) continue;
        let cache = false;
        for (let a = e; a; a = a.parentElement) { const s = getComputedStyle(a);
          if (parseFloat(s.opacity) < 0.05 || s.visibility === "hidden" || s.display === "none") { cache = true; break; } }
        if (cache) continue;
        const t = (n.nodeValue || "").replace(/\s+/g, " ").trim();
        if (/\b(home|about|our|your|book now|view all)\b/i.test(t.replace(/home staging|smart home/gi, "")))
          out.push(`<${e.tagName.toLowerCase()}> ${t.slice(0, 80)}`);
      }
      return [...new Set(out)].slice(0, 5);
    });
    if (r.length) { console.log(`${theme} ${etat}${larg} :`); for (const x of r) console.log("   ", x); }
    await ctx.close();
  }
}
await nav.close();
