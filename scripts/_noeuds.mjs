import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4000);
console.log(await p.evaluate((frag) => {
  const e=[...document.querySelectorAll("h1,h2,h3,p")].find(x=>(x.textContent||"").includes(frag));
  if(!e) return "introuvable";
  const out=[]; const m=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  for(let n=m.nextNode();n;n=m.nextNode()) out.push(JSON.stringify(n.nodeValue));
  return out;
}, process.argv[3]));
await nav.close();
