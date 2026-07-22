// Generates the "Débuter en Extensions de Cils" ebook PDF for Maison Maria,
// styled to match the site's design tokens (app/maison-maria/ebook/page.tsx `C`).
// Usage: node scripts/gen-maison-maria-ebook-pdf.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "content/maison-maria/ebook.md");
const OUT_DIR = path.join(ROOT, "public/maison-maria");
const OUT_PATH = path.join(OUT_DIR, "debuter-extensions-cils.pdf");

const C = {
  bg: "#fdfaf5",
  dark: "#1a1412",
  rose: "#c4847a",
  roseLight: "#e8b4ad",
  roseDark: "#9d5f56",
  ivoryDark: "#ede4d6",
  text: "#2d2220",
  textMuted: "#8a7570",
};

// Native PDF page margins (applied by Chromium to EVERY physical page,
// including overflow continuations) — this is what keeps top spacing and
// footer position consistent regardless of how much content a section has,
// unlike CSS padding/absolute-positioning which only respects logical
// section boundaries, not physical page breaks.
const MARGIN_TOP = "28mm";
const MARGIN_BOTTOM = "26mm";
const MARGIN_SIDE = "24mm";

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderSection(raw) {
  const lines = raw.split("\n").map((l) => l.trim());
  let html = "";
  let inParagraph = [];
  const flushParagraph = () => {
    if (inParagraph.length) {
      html += `<p>${inParagraph.map(escapeHtml).join("<br/>")}</p>\n`;
      inParagraph = [];
    }
  };
  let bulletBuf = [];
  const flushBullets = () => {
    if (bulletBuf.length) {
      html += `<ul>${bulletBuf.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>\n`;
      bulletBuf = [];
    }
  };

  for (const line of lines) {
    if (!line) {
      flushParagraph();
      flushBullets();
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushBullets();
      html += `<h3>${escapeHtml(line.slice(4))}</h3>\n`;
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushBullets();
      html += `<h2>${escapeHtml(line.slice(3))}</h2>\n`;
    } else if (line.startsWith("# ")) {
      flushParagraph();
      flushBullets();
      html += `<h1>${escapeHtml(line.slice(2))}</h1>\n`;
    } else if (line.startsWith("• ")) {
      flushParagraph();
      bulletBuf.push(line.slice(2));
    } else {
      flushBullets();
      inParagraph.push(line);
    }
  }
  flushParagraph();
  flushBullets();

  return `<section class="page">${html}</section>`;
}

const SHARED_FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />`;

function buildCoverHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
${SHARED_FONTS}
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 210mm;
    height: 297mm;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: linear-gradient(160deg, ${C.dark} 0%, #2d1a17 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 24mm;
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500;
    font-size: 40pt;
    line-height: 1.25;
    color: #fff;
    margin: 0 0 10mm;
    max-width: 90%;
  }
  h2 {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 13pt;
    line-height: 1.6;
    color: ${C.roseLight};
    margin: 0 0 14mm;
    max-width: 85%;
  }
  p {
    font-size: 12pt;
    line-height: 1.9;
    color: rgba(255,255,255,0.85);
    margin: 0 0 3mm;
  }
</style>
</head>
<body>
${renderSection.__coverBody}
</body>
</html>`;
}

function buildContentHtml(sections) {
  const pages = sections
    .map((s, i) => {
      const html = renderSection(s);
      const isLast = i === sections.length - 1;
      return isLast ? html.replace('class="page"', 'class="page last"') : html;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
${SHARED_FONTS}
<style>
  /* No @page margin here on purpose — the JS-level page.pdf({ margin }) option
     is what actually controls spacing; an explicit @page margin here would
     silently override/conflict with it and collapse the top/bottom gap. */
  @page { size: A4; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    color: ${C.text};
    background: ${C.bg};
  }
  .page {
    padding: 0 24mm;
    page-break-after: always;
    background: ${C.bg};
  }
  .page.last { page-break-after: auto; }

  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500;
    font-size: 24pt;
    line-height: 1.3;
    color: ${C.rose};
    letter-spacing: 0.01em;
    margin: 0 0 10mm;
    padding-bottom: 4mm;
    border-bottom: 1px solid ${C.ivoryDark};
  }
  h2 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 600;
    font-size: 15pt;
    color: ${C.roseDark};
    margin: 8mm 0 4mm;
  }
  h3 {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 11pt;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${C.textMuted};
    margin: 6mm 0 3mm;
  }
  p {
    font-size: 11pt;
    line-height: 1.8;
    color: ${C.text};
    margin: 0 0 4mm;
  }
  ul {
    margin: 0 0 4mm;
    padding: 0;
    list-style: none;
  }
  li {
    font-size: 11pt;
    line-height: 1.8;
    color: ${C.text};
    padding-left: 6mm;
    position: relative;
    margin-bottom: 1.5mm;
  }
  li::before {
    content: "•";
    color: ${C.rose};
    position: absolute;
    left: 0;
  }
</style>
</head>
<body>
${pages}
</body>
</html>`;
}

// Chromium's native header/footer templates repeat identically on every
// PHYSICAL page (unlike a CSS absolute-positioned div, which only respects
// one logical container and breaks if a section's content overflows past
// one page) — this is what keeps the footer pinned to the true page bottom
// no matter how content reflows, and top margin consistent everywhere.
const FOOTER_TEMPLATE = `
<div style="width:100%; font-family:'DM Sans', system-ui, sans-serif; font-size:8pt; letter-spacing:0.08em; text-transform:uppercase; color:${C.textMuted}; display:flex; justify-content:space-between; padding:0 24mm; border-top:1px solid ${C.ivoryDark}; padding-top:3mm; margin:0;">
  <span>Maison Maria</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

async function renderPdfBuffer(browser, html, pdfOptions) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  const buffer = await page.pdf(pdfOptions);
  await page.close();
  return buffer;
}

async function main() {
  const raw = readFileSync(MD_PATH, "utf-8");
  const rawSections = raw.split(/\n---\n/g).map((s) => s.trim()).filter(Boolean);
  const [coverRaw, ...contentSections] = rawSections;

  renderSection.__coverBody = renderSection(coverRaw)
    .replace('<section class="page">', "")
    .replace("</section>", "");

  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  const coverBuffer = await renderPdfBuffer(browser, buildCoverHtml(), {
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });

  const contentBuffer = await renderPdfBuffer(browser, buildContentHtml(contentSections), {
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: FOOTER_TEMPLATE,
    margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: "0", right: "0" },
  });

  await browser.close();

  const merged = await PDFDocument.create();
  const coverDoc = await PDFDocument.load(coverBuffer);
  const contentDoc = await PDFDocument.load(contentBuffer);
  const [coverPage] = await merged.copyPages(coverDoc, [0]);
  merged.addPage(coverPage);
  const contentPages = await merged.copyPages(contentDoc, contentDoc.getPageIndices());
  contentPages.forEach((p) => merged.addPage(p));

  const finalBytes = await merged.save();
  writeFileSync(OUT_PATH, finalBytes);

  console.log("PDF written to:", OUT_PATH);
  console.log("Total pages:", merged.getPageCount());
}

main();
