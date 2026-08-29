import { chromium } from "playwright";
import { clientPour } from "./clients-types.mjs";
const B = "http://127.0.0.1:3000";
const c = clientPour("Services & Artisanat");
const profil = { ...c.profil, methode: [
  { name: "Le repérage", desc: "Nous montons sur le toit et photographions chaque désordre." },
  { name: "Le devis", desc: "Un chiffrage ligne par ligne, sans poste flou, sous huit jours." },
  { name: "Le chantier", desc: "Une équipe dédiée, un chef de chantier joignable, un planning tenu." },
  { name: "La réception", desc: "Visite commune, réserves levées, garantie décennale remise." },
] };
const nav = await chromium.launch(); const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
for (const theme of process.argv.slice(2)) {
  const r = await fetch(`${B}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...c.form, locale: "fr", template: theme } }) });
  const { sessionId } = await r.json();
  await fetch(`${B}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ businessProfile: profil }) });
  const p = await ctx.newPage();
  await p.goto(`${B}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(6000);
  const v = await p.evaluate(() => {
    const t = document.body.innerText;
    return { repérage: t.includes("Le repérage"), devis: t.includes("Le devis"), demo: /Discover|Design|Build|Launch|Consultation initiale/.test(t) };
  });
  console.log(`${theme.padEnd(12)} méthode du client : ${v.repérage && v.devis ? "oui" : "NON"} · reste de la démo : ${v.demo ? "oui" : "non"}`);
  await p.close();
}
await nav.close();
