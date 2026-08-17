/*
  Mesurer les bandes vides d'une page, sans se fier à la capture.

    node scripts/sonder-vides.mjs impact-244

  Une capture pleine page aplatit les sections épinglées : ce qui se dévoile au
  défilement paraît vide sur l'image. On ne peut donc pas conclure d'une bande
  noire sur la photo. On descend la page comme un visiteur, et l'on relève à
  chaque palier ce qui est réellement peint dans la fenêtre.
*/
import { chromium } from "playwright";
import fs from "node:fs";
import { clientPour } from "./clients-types.mjs";

const BASE = "http://127.0.0.1:3000";
const SECTEURS = JSON.parse(fs.readFileSync("/tmp/theme-secteurs.json", "utf8"));
const DOMAINES = JSON.parse(fs.readFileSync("/tmp/secteur-domaine.json", "utf8"));
const CONTENU = JSON.parse(fs.readFileSync("/tmp/contenu-genere.json", "utf8"));

for (const theme of process.argv.slice(2).filter((a) => a.startsWith("impact-"))) {
  const domaine = (SECTEURS[theme] ?? []).map((s) => DOMAINES[s]).find(Boolean) ?? "Services & Artisanat";
  const client = clientPour(domaine);
  const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...client.form, template: theme } }) });
  const { sessionId } = await r.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ businessProfile: client.profil, generatedContent: CONTENU[domaine] }) });

  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForTimeout(4000);

  const hauteur = await p.evaluate(() => document.body.scrollHeight);
  const vides = [];
  for (let y = 0; y < hauteur; y += 900) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(700);
    const peint = await p.evaluate(() => {
      let n = 0;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let x = w.nextNode(); x; x = w.nextNode()) {
        if (!(x.nodeValue ?? "").trim()) continue;
        const e = x.parentElement;
        if (!e || e.closest("style,script,noscript,template")) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        n++;
      }
      const images = [...document.querySelectorAll("img,video,canvas,svg")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < window.innerHeight;
      }).length;
      return { n, images };
    });
    if (peint.n === 0 && peint.images === 0) vides.push(y);
  }
  console.log(`${theme.padEnd(12)} ${hauteur} px · ${vides.length} paliers vides sur ${Math.ceil(hauteur / 900)}${vides.length ? " → " + vides.join(", ") : ""}`);
  await nav.close();
}
