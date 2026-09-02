import { chromium } from "playwright";
const t = process.argv[2], w = +(process.argv[3] || 1280);
const nav = await chromium.launch();
const p = await (await nav.newContext({ viewport: { width: w, height: 900 }, locale: "fr-FR" })).newPage();
await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(4500);
console.log((await p.evaluate(() => {
  const EN = /\b(home|about|our|your|the|and|with|from|book|view|read more|learn more|contact us|services|team|reviews|pricing|discover|get started|sign in|say|every|where|welcome|opening|hours|story|more|offset|programs|impact|journey|money|goes|now|log in|tons|trees|plan|business|individual|monthly|yearly|start)\b/i;
  const out = [];
  const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = m.nextNode(); n; n = m.nextNode()) {
    const s = (n.nodeValue||"").trim();
    if (!s || !EN.test(s)) continue;
    const e = n.parentElement;
    if (!e || e.closest("style,script,noscript")) continue;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    out.push(s);
  }
  return [...new Set(out)];
})).join("\n"));
await nav.close();
