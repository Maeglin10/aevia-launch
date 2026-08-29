/* Vérifier en production ce qu'on a mesuré en local. (outil de travail) */
import fs from "node:fs";
import { chromium } from "playwright";
const B = "https://launch.aevia.services";
const qa = fs.readFileSync("scripts/qa-annexes.mjs", "utf8");
const FORM = eval("(" + qa.match(/const FORM = (\{[\s\S]*?\n\});/)[1] + ")");
const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
let ok = 0, ko = 0;
for (const page_ of process.argv.slice(2)) {
  const theme = page_.split("/")[0];
  const r = await fetch(`${B}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...FORM, template: theme } }) });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  await p.goto(`${B}/templates/${page_}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForFunction(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!(n.nodeValue ?? "").includes("Ateliers Vidal")) continue;
      const e = n.parentElement;
      if (!e || e.closest("style,script")) continue;
      const rc = e.getBoundingClientRect();
      if (rc.width >= 1 && rc.height >= 1) return true;
    }
    return false;
  }, { timeout: 25000 }).catch(() => {});
  const v = await p.evaluate((marque) => {
    const m = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = (n.nodeValue ?? "").trim();
      if (!t) continue;
      const e = n.parentElement;
      if (!e || e.closest("style,script,noscript,template")) continue;
      const rc = e.getBoundingClientRect();
      if (rc.width < 1 || rc.height < 1) continue;
      m.push(t);
    }
    const vu = m.join(" ").replace(/\s+/g, " ");
    const i = marque ? vu.toLowerCase().indexOf(marque.toLowerCase()) : -1;
    return { autour: i < 0 ? "" : vu.slice(Math.max(0, i - 70), i + 60), nom: vu.includes("Ateliers Vidal"), marque: i >= 0 ? marque : null,
             deCote: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2 };
  }, MARQUES[theme] ?? null);
  const bon = v.nom && !v.marque && !v.deCote;
  bon ? ok++ : ko++;
  console.log(`${bon ? "✓" : "✗"} ${page_.padEnd(22)} nom:${v.nom ? "oui" : "NON"} marque:${v.marque ?? "—"}`); if (v.autour) console.log("      …" + v.autour + "…");
  await p.close();
}
console.log(`\n${ok} conformes · ${ko} en défaut`);
await nav.close();
