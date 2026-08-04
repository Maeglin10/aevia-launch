import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ", city:"Annecy", tagline:"ZZ" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ services:[{name:"A",price:"1 €",description:"d"}],
    reputation:{featuredReviews:[{author:"B",text:"C",rating:5}]}, keyStats:[{value:"18",label:"ans"}],
    team:[{name:"D",role:"E"}], certifications:["F"], faq:[{q:"G",a:"H"}],
    beforeAfter:[{beforeUrl:"",afterUrl:"",caption:"I"}] } }) });
const b = await chromium.launch(); const p = await b.newPage();
const errs=[]; p.on("pageerror", e=>errs.push(e.message));
await p.goto(`${BASE}/templates/${process.argv[2]}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(5000);
console.log("ERREUR:", errs[0]?.slice(0,150) ?? "aucune");
await b.close();
