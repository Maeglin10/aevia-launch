/*
  Les deux questions du premier contact :

    1. Un appel à l'action est-il visible SANS défiler ?  (premier écran)
    2. En reste-t-il un quand on défile ?                  (barre fixe/sticky)

  On mesure à l'écran, pas dans la source : un bouton présent dans le code
  peut être hors du cadre, recouvert, ou démonté par une media query.

  Est compté comme appel à l'action : un lien tel:/mailto:, ou un lien/bouton
  dont le libellé engage (réserver, rendez-vous, devis, appeler, contact…).

    node scripts/verifier-cta.mjs 328-383
*/
import { chromium } from "playwright";

const BASE = `http://localhost:${process.env.PORT || 3000}`;

const ECRANS = [
  { nom: "1280", width: 1280, height: 860 },
  { nom: "390", width: 390, height: 844 },
];

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
if (!cibles.length) { console.error("usage : node scripts/verifier-cta.mjs 328-383"); process.exit(1); }

/* Ce qui se lit comme un engagement, dans le libellé ou la cible. */
const RELEVE = `
  (() => {
    const MOTS = /(r[ée]serv|rendez|devis|appel|contact|rappel|essai|inscri|demande|commander|joindre|visite|bilan|estimation|chiffrer|parler|organiser|bloquer|confier|panier|course|place|projet|audit|d[ée]gustation|urgence|recrutement|trajet)/i;
    const clicable = [...document.querySelectorAll('a[href], button')];
    const actions = clicable.filter((el) => {
      const href = (el.getAttribute('href') || '').toLowerCase();
      const texte = (el.textContent || '').trim();
      if (href.startsWith('tel:') || href.startsWith('mailto:')) return true;
      return texte.length > 2 && texte.length < 60 && MOTS.test(texte);
    });
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 18) return false;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity < 0.2) return false;
      /* recouvert ? on sonde le centre */
      const x = Math.max(0, Math.min(innerWidth - 1, r.left + r.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2));
      const dessus = document.elementFromPoint(x, y);
      return dessus === el || el.contains(dessus) || (dessus && dessus.contains(el));
    };
    const fixe = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const p = getComputedStyle(n).position;
        if (p === 'fixed' || p === 'sticky') return true;
      }
      return false;
    };
    const vus = actions.filter(visible);
    return {
      total: vus.length,
      horsFixe: vus.filter((el) => !fixe(el)).map((el) => (el.textContent || '').trim().slice(0, 32)),
      dansFixe: vus.filter(fixe).map((el) => (el.textContent || '').trim().slice(0, 32)),
    };
  })()
`;

const navigateur = await chromium.launch({ headless: true });
let manqueHaut = 0, manqueSticky = 0;

console.log("thème         écran  sans-défiler          après-défilement (fixe)");
for (const id of cibles) {
  for (const e of ECRANS) {
    const ctx = await navigateur.newContext({ viewport: { width: e.width, height: e.height } });
    const page = await ctx.newPage();
    try {
      await page.addInitScript(() => {
        const c = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: 1 });
        localStorage.setItem("aevia-cookie-consent", c);
        localStorage.setItem("aevia-consent", c);
      });
      await page.goto(`${BASE}/templates/${id}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast],#aevia-webchat-root{display:none!important}" });
      await page.waitForTimeout(1800);

      /* 1 — premier écran, sans défiler */
      const haut = await page.evaluate(RELEVE);

      /* 2 — après un vrai défilement, que reste-t-il d'épinglé ? */
      await page.evaluate(() => window.scrollTo(0, Math.min(2400, document.body.scrollHeight * 0.45)));
      await page.waitForTimeout(700);
      const bas = await page.evaluate(RELEVE);

      const okHaut = haut.total > 0;
      const okSticky = bas.dansFixe.length > 0;
      if (!okHaut) manqueHaut++;
      if (!okSticky) manqueSticky++;
      console.log(
        `${id.padEnd(13)} ${e.nom.padEnd(5)} ${(okHaut ? `oui (${haut.total})` : "NON").padEnd(21)} ${okSticky ? `oui — ${bas.dansFixe[0]}` : "NON"}`,
      );
    } catch (err) {
      console.log(`${id.padEnd(13)} ${e.nom.padEnd(5)} erreur : ${err.message.split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
}
await navigateur.close();
console.log(`\n${cibles.length} thèmes · écrans sans CTA au premier regard : ${manqueHaut} · écrans sans CTA épinglé après défilement : ${manqueSticky}`);
