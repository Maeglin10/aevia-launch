import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:390,height:844}, locale:"fr-FR" })).newPage();
await p.goto("http://localhost:3000/templates/impact-211",{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4000);
console.log(await p.evaluate(() => {
  const sec = document.querySelector("section") || document.body;
  return [...sec.children].map(e => { const s=getComputedStyle(e); const r=e.getBoundingClientRect();
    return `${e.tagName}.${(e.className||"").toString().slice(0,20)} z=${s.zIndex} pos=${s.position} y=${Math.round(r.y)} h=${Math.round(r.height)} bg=${s.background.slice(0,40)}`; });
}));
await nav.close();
