/* L'achat complet, code promo compris, jusqu'à la page de confirmation. */
import { chromium } from "playwright";
const B = "https://aevia-launch-hdkrqqu28-valentins-projects-7cad2c95.vercel.app";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
const appels = [];
p.on("response", (r) => { if (/\/api\/(checkout|sessions)/.test(r.url())) appels.push(`${r.status()} ${r.url().split("/api/")[1].slice(0, 20)}`); });

await p.goto(`${B}/onboarding`, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
const ck = await p.$('button:has-text("Tout accepter")'); if (ck) { await ck.click(); await p.waitForTimeout(600); }

for (let etape = 1; etape <= 8; etape++) {
  for (const c of await p.$$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea')) {
    if (!(await c.isVisible().catch(() => false))) continue;
    if (await c.inputValue().catch(() => "")) continue;
    const ph = (await c.getAttribute("placeholder")) ?? "";
    let v = "Ateliers Vidal & Fils";
    if (/@ha|instagram/i.test(ph)) v = "@ateliersvidal";
    else if (/contact@|email/i.test(ph)) v = "v.milliand@gmail.com";
    else if (/\+33|téléphone/i.test(ph)) v = "04 50 71 82 93";
    else if (/https?:/i.test(ph)) v = "";
    else if (/rue|adresse/i.test(ph)) v = "14 route des Creuses, 74000 Annecy";
    else if (/service|prestation/i.test(ph)) v = "Réfection complète de toiture";
    else if (/description courte/i.test(ph)) v = "Dépose, charpente vérifiée.";
    else if (/décrivez|histoire|ambiance|tout ce qui/i.test(ph)) v = "Couvreur zingueur à Annecy depuis 1974.";
    else if (/excellence|slogan/i.test(ph)) v = "Zinc, ardoise et tuile plate depuis 1974";
    if (v) await c.fill(v).catch(() => {});
  }
  for (const sel of await p.$$("select")) {
    if (!(await sel.isVisible().catch(() => false))) continue;
    const vs = await sel.$$eval("option", (os) => os.map((o) => o.value).filter(Boolean));
    if (vs.length) await sel.selectOption(vs[0]).catch(() => {});
  }
  for (const cb of await p.$$('input[type=checkbox]')) if (await cb.isVisible().catch(() => false)) await cb.check().catch(() => {});
  const b = await p.$('button:has-text("Continuer"), button:has-text("Procéder au paiement")');
  if (!b || !(await b.isEnabled())) break;
  await b.click();
  await p.waitForTimeout(3000);
  if (/stripe\.com/.test(p.url())) break;
}
if (!/stripe\.com/.test(p.url())) { console.log("bloqué avant Stripe :", p.url().slice(0, 70), "·", appels.join(" | ")); await nav.close(); process.exit(1); }
console.log("✓ arrivé sur Stripe ·", appels.join(" | "));

/* Le code promo. */
const lien = await p.$('text=/code promo|Ajouter un code/i');
if (lien) { await lien.click(); await p.waitForTimeout(1200); }
const champ = await p.$('#promotionCode, input[name="promotionCode"], input[placeholder*="ode"]');
if (!champ) { console.log("✗ champ code promo introuvable"); await p.screenshot({ path: "/tmp/stripe.png" }); await nav.close(); process.exit(1); }
await champ.fill("LANCEMENT100");
const appliquer = await p.$('button:has-text("Appliquer"), button:has-text("Apply")');
if (appliquer) await appliquer.click();
await p.waitForTimeout(3500);
const total = await p.evaluate(() => (document.body.innerText.match(/Total[^\n]*/i) ?? [""])[0].slice(0, 40));
console.log("après le code :", total);

/* Stripe réclame l'adresse même à zéro euro. */
const mail = await p.$('input[type=email], #email');
if (mail) await mail.fill("v.milliand@gmail.com");
await p.waitForTimeout(800);
const payer = await p.$('button[type=submit], button:has-text("Complete order"), button:has-text("Payer")');
if (payer) { await payer.click(); await p.waitForTimeout(15000); }
console.log("URL finale :", p.url().slice(0, 90));
await p.screenshot({ path: "/tmp/apres-achat.png" });
await nav.close();
