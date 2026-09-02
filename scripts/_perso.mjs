import { chromium } from "playwright";
const NOM="Atelier Vérification";
const S={id:"v",formData:{businessName:NOM,phone:"+33 4 78 12 34 56",email:"bonjour@verif.fr"},
  businessProfile:{identity:{name:NOM},contacts:{general:{phone:"+33 4 78 12 34 56"}}},generatedContent:{}};
const nav=await chromium.launch();
for (const t of process.argv.slice(2)) {
  const ctx=await nav.newContext({viewport:{width:1280,height:900},locale:"fr-FR"});
  await ctx.route("**/api/sessions**",(r)=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify(S)}));
  const p=await ctx.newPage();
  await p.goto(`http://localhost:3000/templates/${t}?session=v`,{waitUntil:"domcontentloaded",timeout:120000});
  await p.waitForTimeout(5000);
  const r=await p.evaluate((nom)=>{
    const txt=(document.body.innerText||"").replace(/\s+/g," ");
    return { nom: txt.toLowerCase().includes(nom.toLowerCase()),
             tel: txt.includes("78 12 34 56")||[...document.querySelectorAll('a[href^="tel:"]')].some(a=>a.href.replace(/\D/g,"").endsWith("478123456")),
             extrait: txt.slice(0,90) };
  }, NOM);
  console.log(t, "nom:", r.nom?"ok":"ABSENT", "· tél:", r.tel?"ok":"ABSENT", "·", r.extrait.slice(0,60));
  await ctx.close();
}
await nav.close();
