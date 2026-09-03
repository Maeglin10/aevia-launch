import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const h=document.querySelector("h1"); if(!h) return "pas de h1";
  const s=getComputedStyle(h), r=h.getBoundingClientRect();
  const sp=[...h.querySelectorAll("span")].map(x=>({t:(x.innerText||"").slice(0,18), c:getComputedStyle(x).color}));
  let n=h.parentElement, ch=[];
  for(let i=0;i<4&&n;i++){const cs=getComputedStyle(n); ch.push(`${n.tagName} color=${cs.color} bg=${cs.backgroundColor} op=${cs.opacity}`); n=n.parentElement;}
  return { color:s.color, opacity:s.opacity, rect:{y:Math.round(r.y),h:Math.round(r.height)}, spans:sp, chaine:ch };
}));
await nav.close();
