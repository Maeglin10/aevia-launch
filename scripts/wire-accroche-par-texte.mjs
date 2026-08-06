// Brancher le paragraphe du hero en partant de ce qu'il affiche.
//
//   node scripts/wire-accroche-par-texte.mjs impact-19 impact-37 [--dry]
//
// Le script qui branche les sous-titres travaille sur la structure du source :
// il cherche un paragraphe après un titre lui-même branché. Sur huit thèmes, il
// ne trouve rien — le titre n'est pas branché, ou le paragraphe vit dans un
// composant, ou il n'y a pas de balise « p » du tout. Et le client, lui, écrit
// une accroche que son site n'affiche nulle part.
//
// On part donc du rendu : le navigateur dit quel texte s'affiche sous le titre,
// et l'on branche la balise qui porte ce texte. Le texte du thème reste en
// repli, mot pour mot.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) { console.error("usage: node scripts/wire-accroche-par-texte.mjs impact-19 …"); process.exit(1); }

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let faits = 0;
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) { restes.push(`${id} (pas de page)`); continue; }

  const p = await ctx.newPage();
  let rendu = null;
  try {
    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2000);
    rendu = await p.evaluate(() => {
      const flottants = [...document.querySelectorAll("*")]
        .filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position));
      const dans = (n) => flottants.some((e) => e.contains(n));
      const titre = [...document.querySelectorAll("h1, h2")].find((x) => {
        const r = x.getBoundingClientRect();
        return !dans(x) && r.height >= 20 && r.top < 420;
      });
      if (!titre) return null;
      const basTitre = titre.getBoundingClientRect().bottom;
      for (const e of document.querySelectorAll("p, div, span")) {
        if (e.children.length > 0 || dans(e)) continue;
        const t = (e.innerText ?? "").trim();
        if (t.length < 34 || t.length > 230) continue;
        const r = e.getBoundingClientRect();
        if (r.top < basTitre - 10 || r.top > basTitre + 230) continue;
        return t;
      }
      return null;
    });
  } catch { /* la page n'a pas répondu : on la laisse telle quelle */ }
  await p.close();

  if (!rendu) { restes.push(`${id} (pas de paragraphe sous le titre)`); continue; }

  let src = fs.readFileSync(f, "utf8");
  if (/clientHeroSubtitle\(/.test(src)) { restes.push(`${id} (déjà branché)`); continue; }

  /*
    Le rendu met parfois le texte en capitales, et le source le coupe en
    fragments JSX. On cherche donc les premiers mots, sans tenir compte de la
    casse, en tolérant du balisage entre eux.
  */
  const debut = rendu.split(/\s+/).slice(0, 4).join(" ");
  const motif = debut
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "[\\s\\S]{0,40}");
  const m = new RegExp(motif, "i").exec(src);
  if (!m) { restes.push(`${id} («${debut.slice(0, 22)}» absent du source)`); continue; }

  // La balise ouverte juste avant ce texte porte le paragraphe.
  const avant = src.slice(0, m.index);
  const ouverture = [...avant.matchAll(/<(?:motion\.)?(?:p|div|span)\b[^>]*>/g)].pop();
  if (!ouverture) { restes.push(`${id} (aucune balise avant le texte)`); continue; }
  const debutTexte = ouverture.index + ouverture[0].length;
  const finTexte = src.indexOf("</", m.index);
  if (finTexte < 0 || finTexte - debutTexte > 600) { restes.push(`${id} (fragment trop large)`); continue; }

  const contenu = src.slice(debutTexte, finTexte);
  src = src.slice(0, debutTexte)
    + `{/* ACCROCHE_HERO */ clientHeroSubtitle(sessionData) ?? <>${contenu}</>}`
    + src.slice(finTexte);

  const imp = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
  if (imp && !/\bclientHeroSubtitle\b/.test(imp[1])) {
    src = src.replace(imp[0], imp[0].replace("import {", "import {\n  clientHeroSubtitle,"));
  } else if (!imp) {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientHeroSubtitle } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
}

await b.close();
console.log(`${dry ? "[à blanc] " : ""}${faits} paragraphe(s) de hero branchés sur l'accroche du client`);
if (restes.length) console.log(`laissés tels quels : ${restes.join("  ·  ")}`);
