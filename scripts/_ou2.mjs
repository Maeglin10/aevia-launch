import { chromium } from "playwright";
const BASE = "http://localhost:3411";
const [id, mot] = process.argv.slice(2);
const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"},
  body: JSON.stringify({ formData:{ businessName:"Maison M128", city:"Annecy", tagline:"Votre plombier à Annecy", email:"contact@x.fr", brandColor:"#c2410c" } }) });
const sid = (await r.json()).sessionId;
await fetch(`${BASE}/api/sessions?id=${sid}`, { method:"PATCH", headers:{"content-type":"application/json"},
  body: JSON.stringify({ businessProfile:{ services:[{name:"Prestation A",price:"137 €",description:"d"}],
    reputation:{featuredReviews:[{author:"Client A",text:"Impeccable.",rating:5}]},
    keyStats:[{value:"18",label:"ans"}], certifications:["Label A"], faq:[{q:"Q ?",a:"R"}],
    team:[{name:"Équipier A",role:"Chef"}], geo:{primaryCity:"Annecy",address:"3 rue des Alpes, Annecy"} } }) });
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`${BASE}/templates/${id}?session=${sid}`, { waitUntil:"domcontentloaded" });
await p.waitForTimeout(4000);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=900){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
const t = await p.evaluate(() => document.body.innerText);
let i=-1,n=0;
while((i=t.indexOf(mot,i+1))!==-1 && n++<3) console.log("…"+t.slice(Math.max(0,i-70),i+70).replace(/\n/g," ⏎ ")+"…");
if(n===0) console.log("absent");
await b.close();
