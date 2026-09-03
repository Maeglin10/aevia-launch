/* Le texte anglais exactement là où le balayage le voit.

   Le balayage lit `document.body.innerText` sur QUATRE rendus — vitrine et
   client, 1280 et 390. Un relevé fait sur le seul rendu vitrine à 1280 ne
   trouve rien et laisse croire à un faux signalement : la fuite peut ne
   paraître qu'avec une session, ou que sur mobile.

     BASE_URL=http://localhost:3100 node scripts/_anglais-brut.mjs impact-06 …
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const NOM = "Jardins Vivants";
const S = {
  id: "v",
  formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: {
    identity: { name: NOM },
    contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" },
  },
  generatedContent: {},
};
const MOTS = "home|about|our|your|book now|view all|read more|learn more|contact us|get started|sign in|discover|welcome|opening hours";

const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  for (const [etat, larg] of [["vitrine", 1280], ["vitrine", 390], ["client", 1280], ["client", 390]]) {
    const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: larg, height: 900 } });
    if (etat === "client") {
      await ctx.route("**/api/sessions**", (r) =>
        r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
    }
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
        localStorage.setItem("site-analytics-consent", "refused");
      } catch {}
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/templates/${theme}${etat === "client" ? "?session=v" : ""}`, { waitUntil: "domcontentloaded", timeout: 120000 });
      await p.waitForTimeout(3800);
      const r = await p.evaluate((mots) => {
        const t = (document.body.innerText || "").replace(/\s+/g, " ");
        const re = new RegExp(`.{0,45}\\b(${mots})\\b.{0,25}`, "gi");
        return [...new Set(t.match(re) || [])].slice(0, 4);
      }, MOTS);
      if (r.length) {
        console.log(`${theme} ${etat}${larg} :`);
        for (const x of r) console.log("   ", JSON.stringify(x));
      }
    } catch (e) {
      console.log(`${theme} ${etat}${larg} | échec ${String(e).slice(0, 50)}`);
    }
    await ctx.close();
  }
}
await nav.close();
