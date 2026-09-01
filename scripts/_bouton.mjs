import { chromium } from "playwright";
const t=process.argv[2], mot=process.argv[3];
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${t}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
console.log(await p.evaluate((mot) => {
  const e=[...document.querySelectorAll("a,button")].find(x=>(x.textContent||"").trim().toUpperCase().startsWith(mot));
  if(!e) return "introuvable";
  const s=getComputedStyle(e);
  return { balise:e.tagName, texte:(e.textContent||"").trim().slice(0,30), color:s.color, bg:s.backgroundColor, bgi:s.backgroundImage.slice(0,60), parentBg:getComputedStyle(e.parentElement).backgroundColor };
}, mot));
await nav.close();
