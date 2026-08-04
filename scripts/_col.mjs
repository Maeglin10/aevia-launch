import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ", city:"Annecy", tagline:"ZZ", brandColor:"#c2410c" } }) });
const sid = (await r.json()).sessionId;
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`${BASE}/templates/${process.argv[2]}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4500);
const v = await p.evaluate(() => ({
  brand: getComputedStyle(document.documentElement).getPropertyValue("--brand"),
  inline: document.documentElement.style.getPropertyValue("--brand"),
}));
console.log(JSON.stringify(v));
await b.close();
