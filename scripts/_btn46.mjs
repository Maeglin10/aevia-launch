import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto("http://localhost:3000/templates/impact-46",{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(5000);
console.log(await p.evaluate(() => {
  const e=[...document.querySelectorAll("*")].find(x=>(x.textContent||"").trim()==="Consultation gratuite" && x.children.length===0);
  if(!e) return "introuvable";
  const s=getComputedStyle(e);
  return { balise:e.tagName, bg:s.backgroundColor, color:s.color, parent:e.parentElement.tagName, parentBg:getComputedStyle(e.parentElement).backgroundColor };
}));
await nav.close();
