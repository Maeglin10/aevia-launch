import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"ZZ-ENTREPRISE", city:"ZZVILLE", businessType:"couvreur", tagline:"ZZACCROCHE", email:"client@exemple.fr", phone:"04 78 00 00 00" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ services:[{name:"ZZSERVICE-UN",price:"ZZ8137 €",description:"d1"},{name:"ZZSERVICE-DEUX",price:"ZZ222 €",description:"d2"}],
    reputation:{ featuredReviews:[{author:"ZZAUTEUR",text:"ZZAVIS le chantier fut impeccable",rating:5}] },
    keyStats:[{value:"9911",label:"ZZLIBELLE"}], certifications:["ZZCERTIF"], faq:[{q:"ZZQUESTION",a:"ZZREPONSE"}],
    team:[{name:"ZZEQUIPIER",role:"ZZROLE"}], geo:{serviceAreas:["ZZZONE"],primaryCity:"ZZVILLE"} },
    generatedContent:{ heroHeadline:"ZZACCROCHE", aboutTitle:"ZZAPROPOS" } }) });
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1440,height:900} });
for (const id of process.argv.slice(2)) {
  await p.goto(`${BASE}/templates/${id}?session=${sid}`, { waitUntil:"domcontentloaded" });
  await p.waitForTimeout(3500);
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=900){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} });
  const t = await p.evaluate(() => document.body.innerText);
  const manque = Object.entries({businessName:"ZZ-ENTREPRISE",city:"ZZVILLE",headline:"ZZACCROCHE",service1:"ZZSERVICE-UN",price1:"ZZ8137",review:"ZZAVIS",author:"ZZAUTEUR",stat:"9911",member:"ZZEQUIPIER"})
    .filter(([k,v]) => !t.includes(v)).map(([k]) => k);
  console.log(id.padEnd(12), "manquent:", manque.join(",") || "rien");
}
await b.close();
