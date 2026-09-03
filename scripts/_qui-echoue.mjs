/* Quel élément exactement manque de contraste — et avec quoi derrière lui.

   « barre 2.24 » ne dit pas quoi corriger. Ce relevé nomme l'élément : son
   texte, sa couleur calculée, et le contraste mesuré sur les PIXELS réellement
   peints derrière lui.

     BASE_URL=http://localhost:3100 node scripts/_qui-echoue.mjs impact-15 [390] [barre|tout]

   ⚠️ Deux pièges déjà payés :
   — le fond d'un ancêtre ne dit rien quand ce fond est un dégradé ou une photo
     (impact-177 : la barre est un dégradé sombre sur le héros, et la lecture
     par ancêtre annonçait « blanc cassé sur blanc cassé », soit 1,04 sur une
     barre parfaitement lisible) ;
   — un tiroir mobile fermé porte son opacité sur un ANCÊTRE : mesurer ses
     liens, c'est corriger un texte que personne ne voit.
*/
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const [theme, larg = "1280", ou = "barre"] = process.argv.slice(2);

const lum = (r, g, b) => {
  const f = (v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/*
  La MOYENNE des pixels sous un texte compte les lettres elles-mêmes : du blanc
  sur un aplat vert donnait 3,7 au lieu de 4,9, et l'on serait allé « corriger »
  un bouton déjà lisible. On prend donc la couleur DOMINANTE — le fond occupe
  toujours plus de surface que les glyphes — quantifiée par paliers de 16 pour
  que le dégradé d'une photo se regroupe au lieu de s'émietter.
*/
async function fondDominant(png, texte) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const n = info.channels;
  const seaux = new Map();
  for (let i = 0; i < data.length; i += n) {
    const cle = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const s = seaux.get(cle) ?? [0, 0, 0, 0];
    s[0] += data[i]; s[1] += data[i + 1]; s[2] += data[i + 2]; s[3]++;
    seaux.set(cle, s);
  }
  /* Sur un grand titre, ce sont les LETTRES qui occupent le plus de surface :
     la dominante devenait la couleur du texte et le rapport tombait à 1,00 sur
     un titre parfaitement lisible. On écarte donc les seaux qui sont, à peu de
     chose près, la couleur du texte — et l'on garde le suivant. Un vrai défaut
     reste visible : du blanc sur crème laisse une dominante crème, pas blanche. */
  const proche = (s) => texte && [0, 1, 2].every((i) => Math.abs(s[i] / s[3] - texte[i]) < 24);
  const tries = [...seaux.values()].sort((a, b) => b[3] - a[3]);
  const mieux = tries.find((s) => !proche(s)) ?? tries[0];
  return [mieux[0] / mieux[3], mieux[1] / mieux[3], mieux[2] / mieux[3]];
}

const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: +larg, height: 900 } });
/* Le bandeau cookies couvre le bas de l'écran et se fait mesurer à la place
   du contenu : on répond avant le premier rendu, avec les clés du site. */
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {}
});
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(2500);

const candidats = await p.evaluate((ou) => {
  /* `getComputedStyle().color` ne rend plus toujours du « rgb() » : Tailwind 4
     écrit ses couleurs en `lab()` / `oklch()`, et lire les trois premiers
     nombres d'un lab() donnait « rgb(85, 0, -2) » — un texte clair compté
     comme noir, donc 1,04 sur un fond sombre. On laisse le navigateur convertir. */
  const pot = document.createElement("canvas").getContext("2d");
  const enRGB = (couleur) => {
    pot.fillStyle = "#000";
    pot.fillStyle = couleur;
    const h = pot.fillStyle;
    if (h.startsWith("#")) return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return (h.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  };
  const barre = document.querySelector("header, nav, [class*='fixed'][class*='top']");
  const racine = ou === "tout" ? document.body : barre;
  const out = [];
  for (const e of racine ? racine.querySelectorAll("*") : []) {
    const t = (e.textContent || "").replace(/\s+/g, " ").trim();
    if (!t || t.length > 60) continue;
    const propre = [...e.childNodes].some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 1);
    if (!propre) continue;
    let cache = false;
    for (let n = e; n; n = n.parentElement) {
      const a = getComputedStyle(n);
      if (parseFloat(a.opacity) < 0.05 || a.visibility === "hidden" || a.display === "none") { cache = true; break; }
    }
    if (cache) continue;
    const b = e.getBoundingClientRect();
    if (b.width < 12 || b.height < 6 || b.y < -20 || b.y > innerHeight - 4) continue;
    out.push({
      t, couleur: getComputedStyle(e).color, c: enRGB(getComputedStyle(e).color),
      classe: (e.className?.toString() || "").slice(0, 90),
      x: Math.max(0, b.x), y: Math.max(0, b.y),
      w: Math.min(b.width, innerWidth - Math.max(0, b.x)), h: Math.min(b.height, 120),
    });
  }
  return out;
}, ou);

const sous = [];
for (const e of candidats) {
  try {
    const png = await p.screenshot({ clip: { x: e.x, y: e.y, width: Math.max(8, e.w), height: Math.max(8, e.h) } });
    const [rr, gg, bb] = await fondDominant(png, e.c);
    const L1 = lum(e.c[0], e.c[1], e.c[2]), L2 = lum(rr, gg, bb);
    const k = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (!Number.isFinite(k) || k > 21.5 || k < 1) continue;
    if (k < 4.5) sous.push({ t: e.t, couleur: e.couleur, derriere: `rgb(${[rr, gg, bb].map(Math.round)})`, k: +k.toFixed(2), classe: e.classe });
  } catch {}
}
console.log(`${theme} @${larg}px (${ou}) — ${sous.length} sur ${candidats.length} sous 4.5`);
for (const x of sous.sort((a, b) => a.k - b.k)) console.log(" ", JSON.stringify(x));
await nav.close();
