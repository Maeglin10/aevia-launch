/*
  Vérifier quelques thèmes, sans refaire les trois cent soixante-treize.

    node scripts/verifier-marques.mjs impact-131 impact-188 …

  Après une correction ciblée, relancer le balayage entier coûte quarante
  minutes pour vérifier cinq pages. On refait les cinq.
*/
import { chromium } from "playwright";
import fs from "node:fs";
import { clientPour } from "./clients-types.mjs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const SECTEURS = JSON.parse(fs.readFileSync("/tmp/theme-secteurs.json", "utf8"));
const DOMAINES = JSON.parse(fs.readFileSync("/tmp/secteur-domaine.json", "utf8"));
const CONTENU = JSON.parse(fs.readFileSync("/tmp/contenu-genere.json", "utf8"));
const themes = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

const nav = await chromium.launch();
for (const theme of themes) {
  const domaine = (SECTEURS[theme] ?? []).map((s) => DOMAINES[s]).find(Boolean) ?? "Services & Artisanat";
  const client = clientPour(domaine);
  const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...client.form, template: theme } }) });
  const { sessionId, editToken } = await r.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken }, body: JSON.stringify({ businessProfile: client.profil, generatedContent: CONTENU[domaine] }) });

  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForTimeout(5000);
  const texte = await p.evaluate(() => {
    const bouts = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = (n.nodeValue ?? "").trim();
      if (!t) continue;
      const e = n.parentElement;
      if (!e || e.closest("style,script,noscript,template")) continue;
      const rc = e.getBoundingClientRect();
      if (rc.width < 1 || rc.height < 1) continue;
      bouts.push(t);
    }
    return bouts.join(" | ");
  });
  console.log(`\n=== ${theme} · ${client.form.businessName} ===`);
  console.log("  " + texte.slice(0, 260).replace(/\s+/g, " "));
  await ctx.close();
}
await nav.close();
