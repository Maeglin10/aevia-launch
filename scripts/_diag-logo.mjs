import { chromium } from "playwright";
import fs from "node:fs";
const NOM = "Zarbotil Quenvale";
const S = { id: "v", formData: { businessName: NOM }, businessProfile: { identity: { name: NOM } }, generatedContent: {} };
const themes = JSON.parse(fs.readFileSync("captures/contact/noms-entete.json", "utf8")).map((x) => x[0]);
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const p = await ctx.newPage();
for (const t of themes) {
  try {
    await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(3500);
    const html = await p.evaluate(() => {
      const barres = [...document.querySelectorAll("header, nav")].filter((e) => e.getBoundingClientRect().top < 140);
      const b = barres[0]; if (!b) return "(pas de barre)";
      /* le premier élément de texte de la barre = le logo */
      const cand = [...b.querySelectorAll("span, div, a, h1, p")]
        .filter((e) => (e.innerText || "").trim().length > 1 && e.children.length <= 2)
        .sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left)[0];
      return cand ? cand.outerHTML.slice(0, 260) : "(pas de logo)";
    });
    console.log(`${t} :: ${html.replace(/\s+/g, " ")}`);
  } catch (e) { console.log(`${t} :: ERREUR ${String(e).split("\n")[0].slice(0, 50)}`); }
}
await nav.close();
