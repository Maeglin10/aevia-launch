// Vérifie au navigateur que le wizard parle la langue du métier choisi et ne
// demande que ce que le thème sait afficher.
//
// À lancer sur un build de production (`npm run build && npx next start`), pas
// sur le serveur de développement, qui meurt sous la charge :
//   node scripts/wizard-lexicon-check.mjs
//
// Les assertions se font sur le texte rendu : le CSS met les titres en
// majuscules, donc une comparaison sur la casse d'origine échoue toujours.

import { chromium } from "playwright";

const BASE = "http://localhost:3411";
const CASES = [
  { key: "couvreur", industry: "Services & Artisanat", specialty: "Couvreur-zingueur" },
  { key: "notaire", industry: "Droit & Finance", specialty: "Notaire" },
  { key: "pharmacie", industry: "Santé", specialty: "Pharmacie" },
  { key: "restaurant", industry: "Restauration", specialty: "Restaurant" },
  { key: "medecin", industry: "Santé", specialty: "Médecin" },
  { key: "coiffeur", industry: "Beauté", specialty: "Coiffeur" },
  { key: "pompes_funebres", industry: "Services & Artisanat", specialty: "Pompes funèbres" },
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 } });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem(
      "aevia-cookie-consent",
      JSON.stringify({ essential: true, analytics: false, ts: Date.now() }),
    );
  } catch {}
});
ctx.setDefaultTimeout(4000);

const out = [];
for (const c of CASES) {
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: c.industry, exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: c.specialty, exact: false }).first().click();
    await page.waitForTimeout(700);

    // thème : les vignettes sont en alt="" ; la carte est un bouton « impact-NNN … »
    const grid = page.locator("button:has(img)");
    const card = grid.nth((await grid.count()) > 1 ? 1 : 0); // 0 = logo d'en-tête
    const themeId = (await card.innerText().catch(() => "")).split("\n")[0].slice(0, 40);
    await card.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);

    for (let step = 0; step < 5; step++) {
      const heading = await page.locator("h2").first().innerText().catch(() => "");
      if (/offre|prestation|carte|menu|votre activité|vos soins/i.test(heading)) break;
      const inputs = page.locator(
        "input[type=text]:visible, input:not([type]):visible, textarea:visible",
      );
      for (let k = 0; k < (await inputs.count()); k++) {
        const el = inputs.nth(k);
        if ((await el.inputValue().catch(() => "x")) === "")
          await el.fill("Test", { timeout: 1500 }).catch(() => {});
      }
      const next = page.getByRole("button", { name: /Continuer|Suivant/i });
      if ((await next.count()) === 0) break;
      await next.first().click().catch(() => {});
      await page.waitForTimeout(800);
    }

    out.push({
      metier: c.key,
      theme: themeId,
      ...(await page.evaluate(() => ({
        titre: document.querySelector("h2")?.innerText ?? "",
        labels: [...document.querySelectorAll("p")]
          .map((p) => p.textContent.trim())
          .filter((t) => /^(Vos |Votre |Questions )/.test(t) && t.length < 70),
        ph: [...document.querySelectorAll("input")].map((i) => i.placeholder).filter(Boolean),
      }))),
    });
  } catch (e) {
    out.push({ metier: c.key, erreur: String(e).slice(0, 150) });
  }
  await page.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
