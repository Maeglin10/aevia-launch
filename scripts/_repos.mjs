import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
for (const t of [4000, 9000]) {
  await p.waitForTimeout(t===4000?4000:5000);
  const r = await p.evaluate(() => {
    const e=[...document.querySelectorAll("h1,h2")].find(x=>(x.textContent||"").trim().length>8);
    if(!e) return "aucun titre";
    const s=getComputedStyle(e);
    return { txt:(e.innerText||"").replace(/\s+/g," ").slice(0,45), color:s.color, opacity:s.opacity };
  });
  console.log(t+"ms", JSON.stringify(r));
}
await nav.close();
