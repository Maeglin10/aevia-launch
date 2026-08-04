import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ", city:"Annecy", tagline:"ZZ", brandColor:"#c2410c" } }) });
const sid = (await r.json()).sessionId;
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`${BASE}/templates/${process.argv[2]}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4500);
const v = await p.evaluate(() => {
  const cible = "rgb(194, 65, 12)"; const n = [];
  for (const e of document.querySelectorAll("*")) {
    const s = getComputedStyle(e);
    const tout = [s.color, s.backgroundColor, s.borderColor, s.backgroundImage, s.boxShadow, s.fill, s.stroke].join(" ");
    if (tout.includes(cible)) n.push(e.tagName);
    if (n.length > 3) break;
  }
  return n;
});
console.log("éléments peints:", JSON.stringify(v));
await b.close();
