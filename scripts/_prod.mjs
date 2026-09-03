import { chromium } from "playwright";
const base = process.argv[2];
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
for (const t of process.argv.slice(3)) {
  await p.goto(`${base}/templates/${t}`, { waitUntil:"domcontentloaded", timeout:120000 });
  await p.waitForTimeout(5000);
  const r = await p.evaluate(() => {
    const txt=(document.body.innerText||"").replace(/\s+/g," ");
    return { en: /Reserve Your Table|What our guests|Our carte/i.test(txt), extrait: txt.slice(0,110) };
  });
  console.log(`${t} · anglais: ${r.en ? "OUI" : "non"} · ${r.extrait}`);
}
await nav.close();
