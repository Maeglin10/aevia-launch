import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const els=[...document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li,div")].filter(e=>{
    const t=[...e.childNodes].some(n=>n.nodeType===3&&(n.textContent||"").trim().length>1);
    const r=e.getBoundingClientRect();
    return t && r.width>10 && r.height>6 && r.top>=0 && r.top<900;
  });
  const out=[];
  for(let i=0;i<els.length;i++) for(let j=i+1;j<els.length;j++){
    const a=els[i], b=els[j];
    if(a.contains(b)||b.contains(a)) continue;
    const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
    const ox=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left);
    const oy=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);
    if(ox>18 && oy>10){
      const sa=getComputedStyle(a), sb=getComputedStyle(b);
      if(parseFloat(sa.opacity)<0.15||parseFloat(sb.opacity)<0.15) continue;
      out.push(`${(a.textContent||"").trim().slice(0,28)} ⨯ ${(b.textContent||"").trim().slice(0,28)} (${Math.round(ox)}×${Math.round(oy)})`);
    }
  }
  return [...new Set(out)].slice(0,10);
}));
await nav.close();
