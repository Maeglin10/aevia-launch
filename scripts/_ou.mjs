import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4200);
console.log(await p.evaluate((mot) => {
  const out=[]; const m=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  for(let n=m.nextNode();n;n=m.nextNode()){
    if((n.nodeValue||"").trim()!==mot) continue;
    const e=n.parentElement; const r=e.getBoundingClientRect();
    out.push({balise:e.tagName, classe:(e.className||"").toString().slice(0,40), parent:(e.parentElement?.textContent||"").replace(/\s+/g," ").slice(0,90), y:Math.round(r.y)});
  }
  return out;
}, process.argv[3]));
await nav.close();
