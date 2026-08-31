/* La revue d'UN thème. Un seul, jamais un lot.

   Elle ne juge rien : elle rapporte ce qu'un œil doit ensuite regarder —
   la capture, le texte visible, les apostrophes échappées, les mots anglais
   dans une page française, et si le contenu du client passe bien. */
import { chromium } from "playwright";
import fs from "node:fs";

const t = process.argv[2];
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } }, generatedContent: {} };

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));

/* Deux passages : sans client (la vitrine) puis avec (la personnalisation). */
for (const [suffixe, url] of [["vitrine", ""], ["client", "?session=v"]]) {
  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e).split("\n")[0].slice(0, 90)));
  p.on("console", (m) => { if (m.type() === "error" && !/favicon|404/.test(m.text())) erreurs.push(m.text().slice(0, 90)); });
  await p.goto(`http://localhost:3000/templates/${t}${url}`, { waitUntil: "domcontentloaded", timeout: 180000 });
  await p.waitForTimeout(4000);
  const r = await p.evaluate(() => {
    const txt = (document.body.innerText || "").replace(/\s+/g, " ");
    const ANGLAIS = /\b(home|about|our|your|the|and|with|from|book|view|read more|learn more|contact us|services|team|reviews|menu|pricing|discover|get started|sign in|say|every|where|table|welcome|opening|hours|story|more)\b/gi;
    return {
      barre: (document.querySelector("header, nav")?.innerText || "").replace(/\s+/g, " ").slice(0, 70),
      titre: (document.querySelector("h1")?.innerText || "").replace(/\s+/g, " ").slice(0, 80),
      apostrophes: (txt.match(/\\'/g) || []).length,
      anglais: [...new Set((txt.match(ANGLAIS) || []).map((x) => x.toLowerCase()))].slice(0, 12),
      motsTotal: txt.split(" ").length,
      images: document.querySelectorAll("img").length,
      debord: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  await p.screenshot({ path: `captures/revue/${t}-${suffixe}.png` });
  console.log(`${suffixe.padEnd(8)} barre « ${r.barre} »`);
  console.log(`         titre « ${r.titre} »`);
  console.log(`         apostrophes échappées ${r.apostrophes} · images ${r.images} · débord ${r.debord}px · ${erreurs.length} erreur(s)`);
  if (r.anglais.length) console.log(`         mots anglais : ${r.anglais.join(", ")}`);
  if (erreurs.length) console.log(`         ${[...new Set(erreurs)].slice(0, 2).join(" | ")}`);
  await p.close();
}
await nav.close();
