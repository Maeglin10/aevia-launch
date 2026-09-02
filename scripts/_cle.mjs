import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4000);
console.log(await p.evaluate((frag) => {
  const e=[...document.querySelectorAll("h1,h2,h3,p,span,blockquote")].find(x=>(x.textContent||"").includes(frag));
  if(!e) return "introuvable";
  const t=(e.textContent||"").replace(/\s+/g," ").trim();
  return { balise:e.tagName, cle:t.toLowerCase(), longueur:t.length };
}, process.argv[3]));
await nav.close();
