import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:390,height:844}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4000);
console.log(await p.evaluate(() => {
  const h=document.querySelector("h1"); if(!h) return "pas de h1";
  const r=h.getBoundingClientRect(), s=getComputedStyle(h);
  const chain=[]; let n=h.parentElement;
  for(let i=0;i<5&&n;i++){const cs=getComputedStyle(n);chain.push(`${n.tagName}.${(n.className||"").toString().slice(0,26)} bg=${cs.backgroundColor} img=${cs.backgroundImage.slice(0,52)}`);n=n.parentElement;}
  return { txt:(h.innerText||"").slice(0,40), color:s.color, y:Math.round(r.y), h:Math.round(r.height), chain };
}));
await nav.close();
