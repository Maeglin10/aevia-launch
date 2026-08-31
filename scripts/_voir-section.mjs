import { chromium } from "playwright";
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const [t, ancre] = process.argv.slice(2);
await p.goto(`http://localhost:3000/templates/${t}${ancre ? "#" + ancre : ""}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(4000);
if (ancre) { await p.evaluate((a) => document.getElementById(a)?.scrollIntoView(), ancre); await p.waitForTimeout(1500); }
await p.screenshot({ path: `captures/revue/${t}-${ancre ?? "haut"}.png` });
console.log("capturé");
await nav.close();
