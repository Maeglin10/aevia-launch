import { chromium } from "playwright";
const t=process.argv[2], w=+(process.argv[3]||390);
const NOM="Atelier Vérification";
const S={id:"v",formData:{businessName:NOM,phone:"+33 4 78 12 34 56"},businessProfile:{identity:{name:NOM}},generatedContent:{}};
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport:{width:w,height:844}, locale:"fr-FR" });
await ctx.route("**/api/sessions**",(r)=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify(S)}));
const p = await ctx.newPage();
await p.goto(`http://localhost:3000/templates/${t}?session=v`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const n=document.querySelector("nav,header"), h=document.querySelector("h1");
  const r=(e)=>e?{y:Math.round(e.getBoundingClientRect().y),h:Math.round(e.getBoundingClientRect().height),pos:getComputedStyle(e).position,z:getComputedStyle(e).zIndex}:null;
  return { defilement: window.scrollY, nav:r(n), h1:r(h), h1txt:(h?.innerText||"").slice(0,40) };
}));
await nav.close();
