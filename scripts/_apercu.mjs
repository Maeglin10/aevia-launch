/* L'aperçu sur un téléphone : que voit-on du thème ? (outil de travail) */
import { chromium } from "playwright";
const B = "https://aevia-launch-gd6w6iaij-valentins-projects-7cad2c95.vercel.app";
const r = await fetch(`${B}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", email: "contact@ateliers-vidal.fr", template: "impact-47" } }) });
const { sessionId } = await r.json();
console.log("session créée :", sessionId);
/* Le stockage distant met un instant à rendre la session lisible. */
for (let i = 0; i < 10; i++) {
  const g = await fetch(`${B}/api/sessions?id=${sessionId}`);
  if (g.ok && (await g.json())?.formData?.businessName) { console.log("lisible après", i, "tentative(s)"); break; }
  await new Promise((r) => setTimeout(r, 1500));
}
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
await p.goto(`${B}/preview/${sessionId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(4000);
const mesure = async (etiquette) => {
  const v = await p.evaluate(() => {
    const f = document.querySelector("iframe");
    const r = f?.getBoundingClientRect();
    return { hautDuSite: r ? Math.round(r.top) : null, ecran: window.innerHeight };
  });
  console.log(`${etiquette} : le site commence à ${v.hautDuSite} px sur ${v.ecran} px d'écran`);
};
await mesure("panneau ouvert");
await p.screenshot({ path: "/tmp/apercu-ouvert.png" });
const reduire = await p.$('button[aria-label*="Réduire"], button[title="Réduire"]');
if (!reduire) { console.log("✗ bouton Réduire introuvable"); await nav.close(); process.exit(1); }
await reduire.click();
await p.waitForTimeout(900);
await mesure("panneau réduit ");
await p.screenshot({ path: "/tmp/apercu-reduit.png" });
/* La pastille rouvre-t-elle ? */
const pastille = await p.$('button[aria-label*="compléter"]');
console.log("pastille présente :", !!pastille);
if (pastille) { await pastille.click(); await p.waitForTimeout(700); await mesure("rouvert       "); }
await nav.close();
