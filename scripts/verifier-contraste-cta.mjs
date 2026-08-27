/*
  Le contraste RÉEL du bouton d'appel de barre, mesuré au navigateur.

  L'encre a été apprise de chaque thème, mais un jeton peut valoir
  « var(--brand, …) » et se résoudre autrement à l'écran. On lit donc les
  couleurs calculées et on applique le rapport de contraste WCAG.

    node scripts/verifier-contraste-cta.mjs 328-383
*/
import { chromium } from "playwright";

const BASE = `http://localhost:${process.env.PORT || 3000}`;
function ids(args) {
  const out = [];
  for (const a of args.flatMap((x) => x.split(","))) {
    const m = a.match(/^(\d+)-(\d+)$/);
    if (m) { for (let n = +m[1]; n <= +m[2]; n++) out.push(`impact-${n}`); continue; }
    if (a.trim()) out.push(`impact-${a.trim().replace(/^impact-/, "")}`);
  }
  return out;
}
const cibles = ids(process.argv.slice(2));
const b = await chromium.launch({ headless: true });
let faibles = 0, absents = 0;

for (const id of cibles) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "networkidle", timeout: 30000 });
    await p.waitForTimeout(1400);
    const r = await p.evaluate(() => {
      const el = document.querySelector(".aevia-action-mobile");
      if (!el) return { absent: true };
      const box = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      const lum = (c) => {
        const m = c.match(/[\d.]+/g).map(Number);
        const [r, g, bl] = m.slice(0, 3).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      };
      const l1 = lum(st.backgroundColor), l2 = lum(st.color);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return {
        visible: box.width > 20 && box.height > 20 && box.top >= 0 && box.top < innerHeight,
        w: Math.round(box.width), h: Math.round(box.height), top: Math.round(box.top),
        fond: st.backgroundColor, encre: st.color, ratio: Math.round(ratio * 100) / 100,
      };
    });
    if (r.absent) { absents++; console.log(`${id.padEnd(13)} ABSENT du DOM`); continue; }
    const alerte = !r.visible ? "INVISIBLE" : r.ratio < 4.5 ? "CONTRASTE FAIBLE" : "";
    if (alerte) faibles++;
    console.log(`${id.padEnd(13)} ${r.w}×${r.h} top:${String(r.top).padStart(3)} · ${String(r.ratio).padStart(5)}:1 · ${r.fond} / ${r.encre} ${alerte}`);
  } catch (e) {
    console.log(`${id.padEnd(13)} erreur : ${e.message.split("\n")[0]}`);
  } finally { await ctx.close(); }
}
await b.close();
console.log(`\n${cibles.length} thèmes · ${absents} absents · ${faibles} à corriger (invisible ou contraste < 4,5:1)`);
