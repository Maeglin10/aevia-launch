import { chromium } from "playwright";
const BASE = "http://localhost:3007";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: "impact-03" } }) });
const { sessionId } = await r.json();
const b = await chromium.launch();
const p = await b.newPage();
const err = [];
p.on("pageerror", (e) => err.push((e.stack ?? e.message).split("\n").slice(0, 14).join("\n")));
await p.goto(`${BASE}/templates/impact-03?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(6000);
await p.evaluate(() => { [...document.querySelectorAll("header button, nav button")].find((e) => (e.textContent ?? "").trim() === "Boutique")?.click(); });
await p.waitForTimeout(4000);
console.log(err.length ? [...new Set(err)].slice(0, 3).join("\n---\n") : "aucune erreur");
await b.close();
