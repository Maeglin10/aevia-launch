import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p.goto("http://localhost:3000/templates/impact-28", { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const k = [...document.querySelectorAll("div")].find(e => /Founded 2008/i.test(e.textContent||"") && e.children.length===0);
  const chaine = [];
  let n = k;
  for (let i=0;i<6 && n;i++){ const r=n.getBoundingClientRect(); chaine.push(`${n.tagName}.${(n.className||"").toString().slice(0,90)} y=${Math.round(r.y)} h=${Math.round(r.height)}`); n=n.parentElement; }
  return chaine;
}));
await nav.close();
