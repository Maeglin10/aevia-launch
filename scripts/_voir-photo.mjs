import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
for (const t of process.argv.slice(2)) {
  await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForTimeout(3500);
  const ok = await p.evaluate(() => {
    const im = [...document.querySelectorAll("img")].find((i) => (i.currentSrc || i.src) && i.getBoundingClientRect().width > 120);
    if (!im) return null;
    im.scrollIntoView({ block: "center" });
    return (im.currentSrc || im.src).slice(0, 70);
  });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `captures/revue/${t}-photo.png` });
  console.log(`${t} :: ${ok ?? "(aucune image large)"}`);
}
await nav.close();
