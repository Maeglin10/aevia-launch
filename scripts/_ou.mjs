import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const [id, mot] = process.argv.slice(2);
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ", city:"Annecy", tagline:"ZZ" } }) });
const sid = (await r.json()).sessionId;
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`${BASE}/templates/${id}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4000);
const t = await p.evaluate(() => document.body.innerText);
let i=-1,n=0;
while((i=t.indexOf(mot,i+1))!==-1 && n++<3) console.log("…"+t.slice(Math.max(0,i-70),i+70).replace(/\n/g," ⏎ ")+"…");
if(n===0) console.log("absent du texte");
await b.close();
