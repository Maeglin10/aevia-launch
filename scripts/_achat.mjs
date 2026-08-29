/* Un achat complet, du formulaire à l'encaissement, avec le code promo. */
import { chromium } from "playwright";
const B = process.env.BASE ?? "https://aevia-launch-p6mh4mq1k-valentins-projects-7cad2c95.vercel.app";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
p.on("console", (m) => { if (m.type() === "error") console.log("  console:", m.text().slice(0, 90)); });
const appels = [];
p.on("response", (r) => { if (/\/api\/(checkout|sessions|webhook)/.test(r.url())) appels.push(`${r.status()} ${r.url().split("/api/")[1].slice(0, 30)}`); });

await p.goto(`${B}/onboarding`, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
/* Le bandeau cookies recouvre le bouton d'avance. */
const cookies = await p.$('button:has-text("Tout accepter")');
if (cookies) { await cookies.click(); await p.waitForTimeout(600); }
console.log("étape 1 —", (await p.title()).slice(0, 60));

/* Remplir tout champ visible, étape par étape, puis avancer. */
for (let etape = 1; etape <= 8; etape++) {
  const champs = await p.$$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea');
  for (const c of champs) {
    if (!(await c.isVisible().catch(() => false))) continue;
    const ph = (await c.getAttribute("placeholder")) ?? "";
    const deja = await c.inputValue().catch(() => "");
    if (deja) continue;
    let v = "Ateliers Vidal & Fils";
    if (/@ha|instagram/i.test(ph)) v = "@ateliersvidal";
    else if (/contact@|email/i.test(ph)) v = "v.milliand@gmail.com";
    else if (/\+33|téléphone/i.test(ph)) v = "04 50 71 82 93";
    else if (/https?:/i.test(ph)) v = "";
    else if (/rue|adresse/i.test(ph)) v = "14 route des Creuses, 74000 Annecy";
    else if (/service|prestation/i.test(ph)) v = "Réfection complète de toiture";
    else if (/description courte/i.test(ph)) v = "Dépose, charpente vérifiée, zinc ou tuile.";
    else if (/décrivez|histoire|ambiance|tout ce qui/i.test(ph)) v = "Couvreur zingueur à Annecy depuis 1974.";
    else if (/excellence|slogan/i.test(ph)) v = "Zinc, ardoise et tuile plate depuis 1974";
    if (v) await c.fill(v).catch(() => {});
  }
  /* Les listes déroulantes : secteur d'activité, thème, formule. */
  for (const sel of await p.$$("select")) {
    if (!(await sel.isVisible().catch(() => false))) continue;
    const valeurs = await sel.$$eval("option", (os) => os.map((o) => o.value).filter(Boolean));
    if (valeurs.length) await sel.selectOption(valeurs[0]).catch(() => {});
  }
  /* Les listes en boutons (Base UI, div cliquables). */
  const boutonsChoix = await p.$$('[role=option], [role=radio], button[data-value]');
  if (boutonsChoix.length) {
    for (const b of boutonsChoix.slice(0, 1)) if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
  }
  for (const cb of await p.$$('input[type=checkbox]')) {
    if (await cb.isVisible().catch(() => false)) await cb.check().catch(() => {});
  }
  const suivant = await p.$('button:has-text("Suivant"), button:has-text("Continuer"), button:has-text("Valider"), button:has-text("Payer"), button:has-text("Commander"), button:has-text("Finaliser"), button:has-text("Générer"), button:has-text("Procéder au paiement")');
  if (!suivant) {
    const boutons = await p.$$eval("button", (bs) => bs.filter((b) => b.offsetParent).map((b) => (b.textContent ?? "").trim().slice(0, 30)).slice(0, 10));
    console.log(`étape ${etape} : aucun bouton d'avance · boutons visibles : ${boutons.join(" | ")}`);
    break;
  }
  const texte = (await suivant.textContent() ?? "").trim();
  const actif = await suivant.isEnabled();
  console.log(`étape ${etape} : bouton « ${texte} » ${actif ? "actif" : "INACTIF"}`);
  if (!actif) {
    const aide = await p.$('text=/Il reste à renseigner/');
    if (aide) console.log("   ", (await aide.textContent() ?? "").slice(0, 110));
    break;
  }
  await suivant.click();
  await p.waitForTimeout(2500);
  if (/stripe\.com/.test(p.url())) { console.log("→ arrivé sur Stripe :", p.url().slice(0, 60)); break; }
}
console.log("URL finale :", p.url().slice(0, 80));
console.log("appels API :", appels.join(" | ") || "aucun");
await p.screenshot({ path: "/tmp/achat.png", fullPage: false });
await nav.close();
