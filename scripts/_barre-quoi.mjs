/* Quel élément de la barre la jauge mesure-t-elle, et de quelle couleur ? */
import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
for (const t of process.argv.slice(2)) {
  await p.goto(`http://localhost:3000/templates/${t}`,{waitUntil:"domcontentloaded",timeout:120000});
  await p.waitForTimeout(4200);
  const r = await p.evaluate(() => {
    const c=[...document.querySelectorAll("header, nav")].filter(e=>e.getBoundingClientRect().top<140)[0];
    if(!c) return "pas de barre";
    const el=[...c.querySelectorAll("a, span, div, p, button, h1, h2, strong")].filter(e=>{
      const propre=[...e.childNodes].some(n=>n.nodeType===3&&(n.textContent||"").trim().length>1);
      return propre && e.children.length<=2;
    }).sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0];
    if(!el) return "aucun texte";
    const s=getComputedStyle(el);
    return { txt:(el.textContent||"").trim().slice(0,30), color:s.color, bg:s.backgroundColor, taille:s.fontSize, gras:s.fontWeight };
  });
  console.log(t, JSON.stringify(r));
}
await nav.close();
