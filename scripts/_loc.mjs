/* Où la marque s'affiche-t-elle vraiment ? (outil de travail) */
import { chromium } from "playwright";
const B = "http://127.0.0.1:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
for (const arg of process.argv.slice(2)) {
  const [page_, marque] = arg.split("|");
  const theme = page_.split("/")[0];
  const r = await fetch(`${B}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", businessType: "couvreur", city: "Annecy", email: "contact@ateliers-vidal.fr", instagram: "@ateliersvidal", template: theme } }) });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  const att = p.waitForResponse((x) => x.url().includes("/api/sessions"), { timeout: 25000 }).catch(() => null);
  await p.goto(`${B}/templates/${page_}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
  await att; await p.waitForTimeout(1200);
  const out = await p.evaluate(async (marque) => {
    const vus = [];
    const relever = () => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const t = n.nodeValue ?? "";
        if (!t.includes(marque)) continue;
        const e = n.parentElement;
        if (!e || e.closest("style,script")) continue;
        const cle = e.tagName + " :: " + t.trim().slice(0, 70);
        if (!vus.includes(cle)) vus.push(cle);
      }
    };
    relever();
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); relever(); }
    return vus.slice(0, 3);
  }, marque);
  console.log(`=== ${page_} « ${marque} »`);
  out.length ? out.forEach((x) => console.log("   ", x)) : console.log("    (absente à l'écran)");
  await p.close();
}
await nav.close();
