import { chromium } from "playwright";
const t = process.argv[2], w = +(process.argv[3]||390);
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: w, height: 900 }, locale: "fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(4500);
console.log(await p.evaluate(() => {
  const h = document.querySelector("h1");
  if (!h) return "pas de h1";
  const s = getComputedStyle(h), r = h.getBoundingClientRect();
  let n = h.parentElement, fonds = [];
  for (let i=0;i<5&&n;i++){ const cs=getComputedStyle(n); fonds.push(cs.backgroundColor+" | "+cs.backgroundImage.slice(0,60)); n=n.parentElement; }
  return { texte: (h.innerText||"").slice(0,60), couleur: s.color, taille: s.fontSize, rect: {y:Math.round(r.y),h:Math.round(r.height)}, fonds };
}));
await nav.close();
