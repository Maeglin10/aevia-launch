import { chromium } from "playwright";
const t=process.argv[2], w=+(process.argv[3]||390);
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:w,height:844}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${t}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4000);
console.log(await p.evaluate(() => {
  const n=document.querySelector("nav,header"), h=document.querySelector("h1");
  const r=(e)=>e?{y:Math.round(e.getBoundingClientRect().y),h:Math.round(e.getBoundingClientRect().height),pos:getComputedStyle(e).position}:null;
  return { defilement: window.scrollY, nav:r(n), h1:r(h), h1txt:(h?.innerText||"").slice(0,40) };
}));
await nav.close();
