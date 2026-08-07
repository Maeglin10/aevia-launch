import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const ids = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
for (const id of ids) {
  const formData = { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998", template: id };
  const r = await fetch(`${BASE}/api/sessions`, { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ formData }) });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil:"domcontentloaded", timeout:30000 });
  await p.waitForTimeout(2600);
  const t = await p.evaluate(() => {
    const flot = [...document.querySelectorAll("*")].filter(e=>["fixed","sticky"].includes(getComputedStyle(e).position));
    for (const h of document.querySelectorAll("h1")) {
      if (flot.some(f=>f.contains(h))) continue;
      const r = h.getBoundingClientRect();
      if (r.top > 900 || r.height < 20) continue;
      return (h.textContent??"").replace(/\s+/g," ").trim();
    }
    return "";
  });
  await p.close();
  const duClient = /plombier|annecy|vidal/i.test(t);
  console.log(`${duClient ? "ok " : "DEMO"} ${id.padEnd(12)} « ${t.slice(0,60)} »`);
}
await b.close();
