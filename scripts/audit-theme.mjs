/**
 * Deep per-theme audit.
 *
 * Walks every route a theme exposes (its own directory tree) at desktop and
 * mobile, and measures the defects that actually lose clients:
 *
 *   FOLD          hero taller than the viewport, so the CTA needs a scroll
 *   CTA_HIDDEN    hero has CTAs but none are visible on first paint
 *   OVERLAP       two text elements physically overlapping
 *   CONTRAST      text over a photo below WCAG AA (4.5:1)
 *   HSCROLL       the page scrolls sideways
 *   GAP           a dead vertical band with nothing painted in it
 *   OFFCENTER     a "centred" block whose side margins differ by >6%
 *   TINY          text under 12px
 *   TAP           interactive target under 44px
 *   BROKEN_IMG    an image that failed to load
 *   DEAD_LINK     an internal href with no route behind it
 *
 * Usage: node scripts/audit-theme.mjs 33 [--shots]
 */
import { chromium } from "playwright";
import fs from "fs";
import sharp from "sharp";
import path from "path";

const ID = process.argv[2];
const SHOTS = process.argv.includes("--shots");
if (!ID) { console.error("usage: node scripts/audit-theme.mjs <id> [--shots]"); process.exit(1); }

const BASE = `http://localhost:${process.env.PORT || 3000}`;
const TPL = `impact-${String(ID).replace(/^impact-/, "")}`;
const ROOT = path.join("app", "templates", TPL);
const OUT = process.env.OUT_DIR || `/tmp/audit/${TPL}`;

/** Every route this theme owns, derived from its page.tsx files. */
function routes() {
  const found = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), rel ? `${rel}/${e.name}` : e.name);
      else if (e.name === "page.tsx") found.push(rel ? `/templates/${TPL}/${rel}` : `/templates/${TPL}`);
    }
  })(ROOT, "");
  return [...new Set(found)].sort((a, b) => a.length - b.length);
}

const BREAKPOINTS = [
  { name: "mobile", width: 375, height: 667 },
  { name: "desktop", width: 1440, height: 900 },
];

const probe = () => {
  const vw = innerWidth, vh = innerHeight;
  const issues = [];
  const push = (kind, detail) => issues.push({ kind, ...detail });

  const vis = (e) => {
    const s = getComputedStyle(e);
    if (s.display === "none" || s.visibility === "hidden" || +s.opacity < 0.08) return false;
    const r = e.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const textOf = (e) => (e.textContent || "").trim().replace(/\s+/g, " ");
  /** direct text, ignoring text that belongs to a child */
  const ownText = (e) => [...e.childNodes]
    .filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();

  if (document.documentElement.scrollWidth > vw + 2)
    push("HSCROLL", { by: Math.round(document.documentElement.scrollWidth - vw) });

  // ── fold / CTA ───────────────────────────────────────────────────────────
  // Only a declared hero gets fold/CTA rules. On a content subpage the first
  // <section> is simply the page body, where being taller than the viewport is
  // correct, not a defect.
  const hero = document.querySelector("#hero, [data-hero]");
  const nav = document.querySelector("nav, header");
  const navBottom = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().bottom : 0;
  if (hero) {
    const hb = hero.getBoundingClientRect();
    const over = Math.round(hb.top + hb.height - vh);
    if (over > 8) push("FOLD", { over, heroH: Math.round(hb.height) });

    const ctas = [...hero.querySelectorAll("a,button")].filter((e) => {
      if (nav && nav.contains(e)) return false;
      const r = e.getBoundingClientRect();
      const t = textOf(e);
      return vis(e) && r.height >= 28 && r.width >= 70 && t.length > 2 && t.length < 60;
    });
    if (ctas.length) {
      const onScreen = ctas.filter((e) => {
        const r = e.getBoundingClientRect();
        return r.top >= navBottom - 2 && r.bottom <= vh + 2;
      });
      if (!onScreen.length)
        push("CTA_HIDDEN", { first: textOf(ctas[0]).slice(0, 32), top: Math.round(ctas[0].getBoundingClientRect().top) });
    }

    // dead band between the navbar and the first painted hero content
    let firstTop = null;
    for (const e of hero.querySelectorAll("h1,h2,h3,p,span,a,button,img,svg")) {
      if (!vis(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.height < 8 || r.width < 24) continue;
      const isImg = e.tagName === "IMG" || e.tagName === "SVG";
      if (isImg && r.height > vh * 0.55) continue;      // full-bleed backdrop
      if (!isImg && !textOf(e)) continue;
      if (firstTop === null || r.top < firstTop) firstTop = r.top;
    }
    if (firstTop !== null && firstTop - navBottom > 200)
      push("GAP", { where: "hero-top", px: Math.round(firstTop - navBottom) });
  }

  // ── overlap of real text ────────────────────────────────────────────────
  const texts = [...document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li")]
    .filter((e) => vis(e) && ownText(e).length > 2)
    .filter((e) => { const r = e.getBoundingClientRect(); return r.top < vh && r.bottom > 0; });
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 3 && oy > 3) {
        const pct = Math.round((ox * oy) / Math.min(ra.width * ra.height, rb.width * rb.height) * 100);
        if (pct > 22)
          push("OVERLAP", { a: ownText(a).slice(0, 26), b: ownText(b).slice(0, 26), pct });
      }
    }
  }

  // ── tiny text / tap targets ─────────────────────────────────────────────
  for (const e of texts) {
    const fs2 = parseFloat(getComputedStyle(e).fontSize);
    if (fs2 && fs2 < 12) push("TINY", { t: ownText(e).slice(0, 26), px: Math.round(fs2 * 10) / 10 });
  }
  if (vw < 600) {
    for (const e of document.querySelectorAll("a,button,[role=button]")) {
      if (!vis(e)) continue;
      // An inline link inside running text is not a tap target; only controls
      // that present as controls (own background, border, or an explicit role)
      // are held to 44px.
      const st = getComputedStyle(e);
      const looksLikeControl =
        e.tagName === "BUTTON" || e.getAttribute("role") === "button" ||
        (st.backgroundColor !== "rgba(0, 0, 0, 0)" && st.backgroundColor !== "transparent") ||
        parseFloat(st.borderTopWidth) > 0 || st.display.includes("flex") ||
        st.display === "inline-block" || st.display === "block";
      if (!looksLikeControl) continue;
      const inRunningText = e.parentElement && /^(P|LI|SPAN)$/.test(e.parentElement.tagName);
      if (inRunningText) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 300 && (r.height < 40 || r.width < 40) && textOf(e))
        push("TAP", { t: textOf(e).slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
    }
  }

  // ── broken images ───────────────────────────────────────────────────────
  for (const im of document.querySelectorAll("img"))
    if (im.complete && im.naturalWidth === 0) push("BROKEN_IMG", { src: (im.currentSrc || im.src || "").slice(-70) });

  // ── off-centre "centred" blocks ─────────────────────────────────────────
  for (const e of document.querySelectorAll("section > div, main > div, header > div")) {
    if (!vis(e)) continue;
    const s = getComputedStyle(e);
    if (s.marginLeft !== "auto" || s.marginRight !== "auto") continue;
    const r = e.getBoundingClientRect();
    if (r.width < vw * 0.3) continue;
    const l = r.left, rt = vw - r.right;
    if (Math.abs(l - rt) > vw * 0.06) push("OFFCENTER", { left: Math.round(l), right: Math.round(rt) });
  }

  const links = [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/templates/"));

  return { issues, links: [...new Set(links)] };
};

/** Candidates: text that actually sits on top of imagery. */
const contrastProbe = async (page) => page.evaluate(() => {
  const out = [];
  const overImage = (e) => {
    let n = e;
    while (n && n !== document.body) {
      if (/url\(/.test(getComputedStyle(n).backgroundImage)) return true;
      n = n.parentElement;
    }
    const r = e.getBoundingClientRect();
    for (const im of document.querySelectorAll("img,video")) {
      const ri = im.getBoundingClientRect();
      if (r.left < ri.right && r.right > ri.left && r.top < ri.bottom && r.bottom > ri.top) return true;
    }
    return false;
  };
  for (const e of document.querySelectorAll("h1,h2,h3,p,span,a,button")) {
    const t = (e.textContent || "").trim();
    if (t.length < 3 || t.length > 90) continue;
    const s = getComputedStyle(e);
    if (s.display === "none" || +s.opacity < 0.3) continue;
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = e.getBoundingClientRect();
    if (r.height < 8 || r.width < 20 || r.top > innerHeight - 4 || r.bottom < 4) continue;
    if (!overImage(e)) continue;
    out.push({
      t: t.slice(0, 40), color: s.color, size: parseFloat(s.fontSize), weight: s.fontWeight,
      shadow: s.textShadow && s.textShadow !== "none",
      box: { x: Math.round(r.left), y: Math.round(Math.max(r.top, 0)),
             w: Math.round(r.width), h: Math.round(Math.min(r.height, innerHeight - Math.max(r.top, 0))) },
    });
  }
  return out;
});

const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const parseRGB = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

/** Any CSS colour -> [r,g,b], via a 1x1 canvas so oklab/oklch/hsl all work. */
const toRGB = async (page, colors) => page.evaluate((cols) => {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  return cols.map((c) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  });
}, colors);


/**
 * The background a glyph sits on is the *light* part of its box when the text
 * is dark, and the *dark* part when the text is light — averaging the whole box
 * mixes glyph pixels into the reading and hides real failures. So take a
 * percentile away from the text colour instead.
 */
async function bgUnder(sharpImg, box, textIsLight) {
  const { data, info } = await sharpImg
    .extract({ left: Math.max(0, box.x), top: Math.max(0, box.y),
               width: Math.max(1, box.w), height: Math.max(1, box.h) })
    .raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels)
    px.push([data[i], data[i + 1], data[i + 2]]);
  px.sort((a, b) => lum(a) - lum(b));
  // light text -> its background is the darker end, and vice versa
  const idx = textIsLight ? Math.floor(px.length * 0.35) : Math.floor(px.length * 0.65);
  return px[Math.min(px.length - 1, Math.max(0, idx))];
}

const b = await chromium.launch();
fs.mkdirSync(OUT, { recursive: true });
const report = { template: TPL, routes: [], generated: new Date().toISOString() };
const allLinks = new Set();

// HOME_ONLY trades depth for breadth: a first pass over all 315 themes at
// full depth would take many hours, so the catalogue sweep checks each
// homepage and the per-theme run then goes deep on the worst offenders.
const ROUTE_LIST = process.env.HOME_ONLY ? [`/templates/${TPL}`] : routes();
for (const route of ROUTE_LIST) {
  for (const bp of BREAKPOINTS) {
    const page = await b.newPage({ viewport: { width: bp.width, height: bp.height } });
    const consoleErrors = [];
    page.on("pageerror", (e) => consoleErrors.push(e.message.slice(0, 120)));
    try {
      await page.addInitScript(() => {
        const c = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: Date.now() });
        localStorage.setItem("aevia-cookie-consent", c);
        localStorage.setItem("aevia-consent", c);
      });
      const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 });
      await page.addStyleTag({ content:
        `nextjs-portal,[data-nextjs-portal],[data-nextjs-toast],#__next-build-watcher,#aevia-webchat-root{display:none!important}` });
      await page.waitForTimeout(1800);

      const { issues, links } = await page.evaluate(probe);
      links.forEach((l) => allLinks.add(l.split("#")[0].split("?")[0].replace(/\/$/, "")));

      // contrast is measured on the composited pixels, not the CSS chain,
      // because the failures that matter are text over photographs.
      const cands = await contrastProbe(page);
      if (cands.length) {
        const buf = await page.screenshot();
        const img = sharp(buf);
        const fgs = await toRGB(page, cands.map((c) => c.color));
        for (let ci = 0; ci < cands.length; ci++) {
          const c = cands[ci];
          const fg = fgs[ci];
          if (fg.length < 3 || c.box.w < 4 || c.box.h < 4) continue;
          const textIsLight = lum(fg) > 0.5;
          let bg;
          try { bg = await bgUnder(img, c.box, textIsLight); } catch { continue; }
          const L1 = lum(fg), L2 = lum(bg);
          const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const large = c.size >= 24 || (c.size >= 18.66 && +c.weight >= 700);
          const need = large ? 3 : 4.5;
          if (ratio < need && !c.shadow)
            issues.push({ kind: "CONTRAST", t: c.t, ratio: Math.round(ratio * 10) / 10,
                          need, size: Math.round(c.size) });
        }
      }

      // Nav links are tested by CLICKING them, not by reading href. Many
      // templates navigate client-side and leave href as a no-JS fallback, so
      // judging them on href alone reports working navigation as broken.
      if (route.split("/").length === 3 && bp.name === "desktop") {
        const labels = await page.evaluate(() =>
          [...document.querySelectorAll("nav a, header a")]
            .map((a) => (a.textContent || "").trim())
            // "Accueil"/"Home" correctly does nothing when you are already on
            // the homepage, and tel:/mailto: links never change the page.
            .filter((t) => t.length > 2 && t.length < 30)
            .filter((t) => !/^(accueil|home|retour|logo)$/i.test(t))
            .filter((t) => !/^[+\d][\d\s().-]{6,}$/.test(t) && !/@/.test(t))
            .slice(0, 6));
        for (const label of labels) {
          const before = await page.evaluate(() => ({
            h: (document.querySelector("h1,h2")?.textContent || "").trim(),
            len: document.body.innerText.length, url: location.pathname }));
          await page.evaluate((t) => {
            const a = [...document.querySelectorAll("a,button")]
              .find((x) => (x.textContent || "").trim() === t);
            a && a.click();
          }, label);
          await page.waitForTimeout(1400);
          const after = await page.evaluate(() => ({
            h: (document.querySelector("h1,h2")?.textContent || "").trim(),
            len: document.body.innerText.length, url: location.pathname,
            y: Math.round(scrollY) }));
          const moved = after.url !== before.url || after.h !== before.h ||
                        Math.abs(after.len - before.len) > 60 || after.y > 120;
          if (!moved) issues.push({ kind: "NAV_DEAD", label });
          if (after.url !== before.url) {
            await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 40000 });
            await page.waitForTimeout(900);
          } else {
            await page.evaluate(() => window.scrollTo(0, 0));
          }
        }
      }

      if (resp && resp.status() >= 400) issues.push({ kind: "HTTP", status: resp.status() });
      consoleErrors.forEach((m) => issues.push({ kind: "JS_ERROR", m }));

      report.routes.push({ route, bp: bp.name, issues });
      const tag = issues.length ? issues.map((i) => i.kind).join(",") : "clean";
      console.log(`${route} @${bp.name} :: ${tag}`);

      if (SHOTS) {
        const safe = route.replace(/\//g, "_").replace(/^_/, "");
        await page.screenshot({ path: `${OUT}/${safe}.${bp.name}.png`, fullPage: true });
      }
    } catch (e) {
      report.routes.push({ route, bp: bp.name, issues: [{ kind: "LOAD_FAIL", m: e.message.slice(0, 90) }] });
      console.log(`${route} @${bp.name} :: LOAD_FAIL`);
    }
    await page.close();
  }
}

// dead internal links, checked against the filesystem
const dead = [];
for (const l of allLinks) {
  const p = path.join("app", l.replace(/^\//, ""), "page.tsx");
  if (!fs.existsSync(p)) dead.push(l);
}
report.deadLinks = dead;
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));

const counts = {};
report.routes.forEach((r) => r.issues.forEach((i) => { counts[i.kind] = (counts[i.kind] || 0) + 1; }));
console.log("\n──", TPL, "──");
console.log("routes:", ROUTE_LIST.length, "| dead links:", dead.length, dead.slice(0, 6));
console.log("issues:", Object.keys(counts).length ? counts : "none");
await b.close();
