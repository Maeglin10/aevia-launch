import { chromium } from "playwright";
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
for (const t of process.argv.slice(2)) {
  const p = await ctx.newPage();
  await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForTimeout(2500);
  console.log(t, "::", await p.evaluate(() => {
    const b = [...document.querySelectorAll("header, nav")].filter((e) => e.getBoundingClientRect().top < 140 && e.getBoundingClientRect().height > 20)[0];
    return b ? (b.innerText || "").replace(/\s+/g, " ").slice(0, 90) : "(pas de barre)";
  }));
  await p.close();
}
await nav.close();
