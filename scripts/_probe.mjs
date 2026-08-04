import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const W = { businessName:"ZZ-ENTREPRISE", city:"ZZVILLE", service1:"ZZSERVICE-UN", price1:"ZZ8137", review:"ZZAVIS", author:"ZZAUTEUR", stat:"9911", cert:"ZZCERTIF", faq:"ZZQUESTION", member:"ZZEQUIPIER", headline:"ZZACCROCHE" };
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:W.businessName, city:W.city, businessType:"couvreur", tagline:W.headline, email:"a@b.fr", phone:"04 00 00 00 00", brandColor:"#7c3aed" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ services:[{name:W.service1,price:"ZZ8137 €",description:"d1"},{name:"ZZSERVICE-DEUX",price:"ZZ222 €",description:"d2"}],
    reputation:{ featuredReviews:[{author:W.author,text:"ZZAVIS le chantier fut impeccable",rating:5,source:"ZZSOURCE"}] },
    keyStats:[{value:"9911",label:"ZZLIBELLE"}], certifications:[W.cert], faq:[{q:W.faq,a:"ZZREPONSE"}],
    team:[{name:W.member,role:"ZZROLE"}], geo:{serviceAreas:["ZZZONE"],primaryCity:W.city} },
    generatedContent:{ heroHeadline:W.headline, aboutTitle:"ZZAPROPOS", aboutText:"ZZTEXTE", ctaText:"ZZCTA" } }) });
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1440,height:900} });
for (const id of process.argv.slice(2)) {
  await p.goto(`${BASE}/templates/${id}?session=${sid}`, { waitUntil:"domcontentloaded" });
  await p.waitForTimeout(3000);
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));} window.scrollTo(0,0); });
  await p.waitForTimeout(600);
  const t = await p.evaluate(() => document.body.innerText);
  const manque = Object.entries(W).filter(([k,v]) => !t.includes(v)).map(([k]) => k);
  console.log(id.padEnd(12), "manquent:", manque.join(",") || "rien");
}
await b.close();
