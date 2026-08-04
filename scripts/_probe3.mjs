import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ-ENTREPRISE", city:"ZZVILLE", businessType:"couvreur", tagline:"ZZACCROCHE" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ team:[{name:"ZZEQUIPIER",role:"ZZROLE"}], reputation:{featuredReviews:[{author:"ZZAUTEUR",text:"ZZAVIS x",rating:5}]} } }) });
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto(`${BASE}/templates/${process.argv[2]}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4000);
const html = await p.evaluate(() => document.body.innerHTML);
for (const w of ["ZZVILLE","ZZ-ENTREPRISE","impact-01","ZZEQUIPIER","ZZAUTEUR"])
  console.log(w.padEnd(14), "html:", html.includes(w));
console.log("pied présent:", html.includes("PIED_MINIMAL") || /footer/i.test(html));
await b.close();
