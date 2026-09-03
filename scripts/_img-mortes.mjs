import { chromium } from "playwright";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const ko = [];
  p.on("response", (r) => { if (r.request().resourceType() === "image" && !r.ok()) ko.push(`${r.status()} ${r.url().slice(0, 130)}`); });
  p.on("requestfailed", (r) => { if (r.resourceType() === "image") ko.push(`ECHEC ${r.url().slice(0, 130)}`); });
  await p.goto(`http://localhost:3100/templates/${theme}`, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
  await p.waitForTimeout(3000);
  console.log(`\n== ${theme}`);
  for (const l of [...new Set(ko)]) console.log("  " + l);
  await ctx.close();
}
await nav.close();
