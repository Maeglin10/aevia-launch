import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ-ENTREPRISE", city:"ZZVILLE", tagline:"ZZACCROCHE" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ services:[{name:"ZZSERVICE-UN",price:"ZZ8137 €",description:"d1"}] } }) });
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`${BASE}/templates/${process.argv[2]}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4000);
const t = await p.evaluate(() => document.body.innerText);
const i = t.indexOf("ZZSERVICE-UN");
console.log("ZZSERVICE-UN:", i !== -1);
console.log("ZZ8137:", t.includes("ZZ8137"));
if (i !== -1) console.log("contexte:", JSON.stringify(t.slice(Math.max(0,i-60), i+120).replace(/\n/g," | ")));
await b.close();
