import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${process.argv[2]}`,{waitUntil:"domcontentloaded",timeout:120000});
await p.waitForTimeout(4500);
const lire = () => p.evaluate(() => {
  const h=[...document.querySelectorAll("h1,h2")].find(x=>(x.textContent||"").trim().length>8);
  const sp=[...h.querySelectorAll("span")].slice(0,6);
  return sp.map(s=>getComputedStyle(s).opacity).join(",") || getComputedStyle(h).opacity;
});
console.log("avant défilement :", await lire());
await p.evaluate(() => window.scrollBy(0, 2));
await p.waitForTimeout(1500);
console.log("après 2 px       :", await lire());
await nav.close();
