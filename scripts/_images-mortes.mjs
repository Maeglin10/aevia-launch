/* Les images qui ne répondent pas, et lesquelles. */
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
for (const t of process.argv.slice(2)) {
  const p = await (await nav.newContext({ viewport:{width:1280,height:900}, locale:"fr-FR" })).newPage();
  const mortes = [];
  p.on("response", (r) => { if (/unsplash|pexels|pixabay|\.(jpg|png|webp|avif)/i.test(r.url()) && r.status() >= 400) mortes.push(`${r.status()} ${r.url().slice(0, 110)}`); });
  try {
    await p.goto(`${BASE}/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(6000);
    console.log(`${t} : ${mortes.length ? mortes.join("\n     ") : "aucune"}`);
  } catch { console.log(t, "ERREUR"); }
  await p.close();
}
await nav.close();
