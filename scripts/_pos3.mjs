import { chromium } from "playwright";
const NOM="Atelier Vérification";
const S={id:"v",formData:{businessName:NOM,phone:"+33 4 78 12 34 56"},businessProfile:{identity:{name:NOM}},generatedContent:{}};
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport:{width:390,height:844}, locale:"fr-FR" });
await ctx.route("**/api/sessions**",(r)=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify(S)}));
const p = await ctx.newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}?session=v`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const n=document.querySelector("nav");
  return [...n.children].map(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);
    return `${e.tagName}#${e.id||""}.${(e.className||"").toString().slice(0,18)} y=${Math.round(r.y)} h=${Math.round(r.height)} w=${Math.round(r.width)} disp=${s.display} txt=${(e.innerText||"").replace(/\s+/g," ").slice(0,40)}`;});
}));
await nav.close();
