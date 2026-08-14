/*
  Le pipeline complet, du wizard au site livré, paiement compris.

    node scripts/qa-paiement.mjs

  Ce que ça fait, dans l'ordre, comme un vrai client :
    1. remplit les trois étapes du wizard ;
    2. clique « Procéder au paiement » et suit la redirection vers Stripe ;
    3. paie avec la carte de test 4242 4242 4242 4242 ;
    4. relit la session de paiement chez Stripe (clé de test) ;
    5. rejoue l'événement `checkout.session.completed` vers notre webhook,
       signé avec le SDK — Stripe ne peut pas joindre localhost, et c'est la
       seule partie simulée : le contenu de l'événement, lui, vient de Stripe ;
    6. ouvre le site livré et vérifie que les données du client y sont.

  Rien n'est écrit en dur : le brief part par le wizard, revient par le blob,
  et c'est bien ce chemin-là qu'on veut voir fonctionner.
*/
import { chromium } from "playwright";
import Stripe from "stripe";
import fs from "node:fs";

const BASE = "http://127.0.0.1:3000";

/* Les clés viennent de .env.local, jamais de la ligne de commande. */
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" });

const CLIENT = {
  nom: "Charpentes Beaumont & Filles",
  accroche: "Charpente traditionnelle et couverture ardoise en Morvan",
  service: "Réfection de charpente",
  description: "Dépose, pièces de bois taillées à l'atelier, couverture ardoise posée au crochet.",
  courriel: "contact@charpentes-beaumont.fr",
  telephone: "03 86 41 22 70",
  adresse: "5 route du Haut-Folin, 58120 Château-Chinon",
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("  erreur page :", String(e).slice(0, 120)));

/* ── 1 et 2 · le wizard ──────────────────────────────────────────────────── */
console.log("1. wizard");
await p.goto(`${BASE}/onboarding?theme=impact-352&type=vitrine`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
await p.locator('button:has-text("Tout accepter")').first().click().catch(() => {});

await p.locator("input[type=text]").first().fill(CLIENT.nom);
const secteur = p.locator("select").first();
const opts = await secteur.locator("option").evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
await secteur.selectOption(opts[0]);
await p.locator("input[type=text]").nth(1).fill(CLIENT.accroche);
await p.locator("textarea").first().fill(CLIENT.description);
await p.locator('button:has-text("Continuer")').first().click();
await p.waitForTimeout(2200);
await p.locator('button:has-text("Continuer")').first().click();
await p.waitForTimeout(2200);

await p.locator('input[placeholder^="Nom du service"]').first().fill(CLIENT.service);
await p.locator('input[placeholder^="Description courte"]').first().fill(CLIENT.description);
await p.locator('input[placeholder^="contact@"]').first().fill(CLIENT.courriel);
await p.locator('input[placeholder^="+33"]').first().fill(CLIENT.telephone);
await p.locator('input[placeholder^="12 rue"]').first().fill(CLIENT.adresse);
for (const c of await p.locator('input[type="checkbox"]').all()) await c.check().catch(() => {});
await p.waitForTimeout(600);

console.log("2. redirection vers Stripe");
p.on("response", (r) => { if (r.url().includes("/api/checkout")) console.log(`   /api/checkout → ${r.status()}`); });
await p.locator('button:has-text("Procéder au paiement")').first().click();
await p.waitForTimeout(6000);
const erreurAffichee = await p.locator("text=/erreur|Erreur|échou/i").first().textContent().catch(() => null);
if (erreurAffichee) console.log("   message affiché au client : " + erreurAffichee.slice(0, 120));
await p.waitForURL(/checkout\.stripe\.com/, { timeout: 45000 });
const urlStripe = p.url();
console.log("   " + urlStripe.slice(0, 72) + "…");

/* ── 3 · le paiement, carte de test ──────────────────────────────────────── */
console.log("3. paiement (carte de test 4242)");
await p.waitForTimeout(4000);
const remplir = async (sel, valeur) => {
  const c = p.locator(sel).first();
  if (await c.count()) { await c.fill(valeur); return true; }
  return false;
};
await remplir('input[name="email"]', CLIENT.courriel);
await remplir('input[name="cardNumber"]', "4242424242424242");
await remplir('input[name="cardExpiry"]', "12/34");
await remplir('input[name="cardCvc"]', "123");
await remplir('input[name="billingName"]', "Camille Beaumont");
const cp = p.locator('input[name="billingPostalCode"]').first();
if (await cp.count()) await cp.fill("58120");
await p.waitForTimeout(800);
await p.locator('button[type="submit"]').first().click();
await p.waitForURL((u) => !String(u).includes("checkout.stripe.com"), { timeout: 90000 }).catch(() => {});
await p.waitForTimeout(3000);
console.log("   après paiement, le client atterrit sur : " + p.url().slice(0, 80));

/* ── 4 · relire la session chez Stripe ───────────────────────────────────── */
console.log("4. lecture de la session chez Stripe");
const sessions = await stripe.checkout.sessions.list({ limit: 3 });
const session = sessions.data.find((s) => s.payment_status === "paid") ?? sessions.data[0];
console.log(`   ${session.id} · ${session.payment_status} · ${(session.amount_total ?? 0) / 100} ${String(session.currency).toUpperCase()}`);
console.log(`   metadata : ${Object.keys(session.metadata ?? {}).join(", ") || "(vide)"}`);

/* ── 5 · rejouer l'événement vers notre webhook ──────────────────────────── */
console.log("5. webhook");
const complet = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });
const evenement = {
  id: `evt_test_${Date.now()}`,
  object: "event",
  api_version: "2025-01-27.acacia",
  created: Math.floor(Date.now() / 1000),
  type: "checkout.session.completed",
  data: { object: complet },
};
const corps = JSON.stringify(evenement);
const entete = stripe.webhooks.generateTestHeaderString({ payload: corps, secret: env.STRIPE_WEBHOOK_SECRET });
const rep = await fetch(`${BASE}/api/webhook`, {
  method: "POST",
  headers: { "content-type": "application/json", "stripe-signature": entete },
  body: corps,
});
console.log(`   réponse du webhook : ${rep.status} ${(await rep.text()).slice(0, 120)}`);

/* ── 6 · le site livré ───────────────────────────────────────────────────── */
console.log("6. site livré");
await new Promise((r) => setTimeout(r, 4000));
const meta = complet.metadata ?? {};
const theme = meta.theme ?? "impact-352";
const sessionId = meta.previewSessionId ?? meta.sessionId ?? null;
console.log(`   thème ${theme} · session ${sessionId ?? "(à retrouver dans les journaux)"}`);
if (sessionId) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6000);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } });
  const txt = (await page.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  for (const [quoi, v] of Object.entries({ nom: CLIENT.nom, accroche: CLIENT.accroche.slice(0, 28), prestation: CLIENT.service, courriel: CLIENT.courriel, téléphone: CLIENT.telephone, adresse: "route du Haut-Folin" }))
    console.log(`   ${txt.toLowerCase().includes(v.toLowerCase()) ? "✓" : "MANQUE"} ${quoi}`);
  await page.screenshot({ path: "/tmp/site-livre.png", fullPage: true });
}
await b.close();
