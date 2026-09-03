import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const NOM = "Jardins Vivants";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };
const nav = await chromium.launch();
const theme = process.argv[2];
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
await ctx.addInitScript((nom) => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {}
  window.__journal = [];
  const demarrer = () => {
    new MutationObserver((lots) => {
      for (const l of lots) {
        if (l.type === "characterData") {
          const av = l.oldValue || "", ap = l.target.nodeValue || "";
          if (av.includes(nom) && !ap.includes(nom))
            window.__journal.push(`texte « ${av.slice(0, 40)} » -> « ${ap.slice(0, 40)} »`);
        }
        for (const n of l.removedNodes)
          if ((n.textContent || "").includes(nom))
            window.__journal.push(`retiré « ${(n.textContent || "").slice(0, 50)} » de <${l.target.nodeName}>`);
      }
    }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
  };
  if (document.documentElement) demarrer(); else document.addEventListener("DOMContentLoaded", demarrer);
}, NOM);
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}?session=v`, { waitUntil: "domcontentloaded", timeout: 90000 });
await p.waitForTimeout(9000);
const j = await p.evaluate(() => window.__journal.slice(0, 12));
console.log(theme, j.length ? "" : "aucune suppression observée");
for (const x of j) console.log("  ", x);
await nav.close();
