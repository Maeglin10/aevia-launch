/* Le contenu du héros dépasse-t-il le bas de l'écran ?

   Sur impact-71, la phrase d'accroche est tranchée en plein mot et les deux
   boutons d'appel à l'action tombent SOUS la ligne de flottaison : le visiteur
   arrive sur une page dont l'action principale est invisible. Le héros mesure
   100 vh et porte `overflow: hidden` — ce qui dépasse est coupé net, sans
   barre de défilement pour le signaler.

     BASE_URL=http://localhost:3100 node scripts/_heros-deborde.mjs impact-71 …

   On mesure deux choses, et la seconde est la plus grave :
     — le contenu déborde la BOÎTE du héros (coupé si `overflow: hidden`) ;
     — un bouton se trouve sous le bas de l'ÉCRAN, donc invisible à l'arrivée.
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const LARGEUR = Number(process.env.W || 1280);
const NOM = "Jardins Vivants";
const SESSION = {
  id: "v",
  formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: {
    identity: { name: NOM },
    contacts: { general: { phone: "+33 4 78 12 34 56" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" },
  },
  generatedContent: {},
};
const ETAT = process.env.ETAT || "vitrine";

const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: LARGEUR, height: LARGEUR === 390 ? 844 : 900 } });
  if (ETAT === "client") {
    await ctx.route("**/api/sessions**", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }));
  }
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
      localStorage.setItem("site-analytics-consent", "refused");
    } catch {}
  });
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${theme}${ETAT === "client" ? "?session=v" : ""}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(3800);
    const r = await p.evaluate(() => {
      const visible = (e) => {
        for (let n = e; n; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (parseFloat(s.opacity) < 0.05 || s.visibility === "hidden" || s.display === "none") return false;
        }
        return true;
      };
      /*
        Le test décisif tient en une comparaison : un conteneur qui COUPE
        (`overflow` autre que `visible`) et dont le contenu est plus haut que
        lui-même tranche ce qui dépasse, sans barre de défilement pour le
        signaler. Sur impact-71, la phrase d'accroche est tranchée en plein mot
        et les deux boutons tombent hors du cadre.
      */
      const coupes = [];
      for (const e of document.querySelectorAll("section, div")) {
        if (!visible(e)) continue;
        const b = e.getBoundingClientRect();
        /* Le héros ne commence pas toujours à zéro : une barre en flux le
           pousse vers le bas. On accepte jusqu'au quart de l'écran. */
        /* Le bloc doit être un HÉROS, pas la racine de la page : sans plafond
           de hauteur, on mesurait le document entier (8 193 px) et le moindre
           élément en position fixe, remonté par une animation, comptait comme
           « coupé ». */
        if (b.top > innerHeight * 0.25 || b.height < innerHeight * 0.45 || b.height > innerHeight * 1.6) continue;
        const st = getComputedStyle(e);
        if (st.overflow === "visible" && st.overflowY === "visible") continue;
        /*
          `scrollHeight` ne suffit pas : dans un conteneur centré
          (`justify-center`), le contenu trop haut déborde des DEUX côtés, et
          `scrollHeight` n'en compte que le bas. impact-71 passait ainsi pour
          intact alors que sa phrase d'accroche est tranchée en plein mot. On
          compare donc chaque enfant à la boîte, des deux côtés.
        */
        let manque = 0;
        const perdus = [];
        for (const x of e.querySelectorAll("a, button, [role='button'], p, h1, h2, span")) {
          if (!visible(x)) continue;
          const r = x.getBoundingClientRect();
          if (r.height < 8 || r.width < 8) continue;
          /* Une lettre de 192 px à 5 % d'opacité est un filigrane décoratif :
             la couper est voulu. Seul le contenu compte. */
          if (parseFloat(getComputedStyle(x).opacity) <= 0.12) continue;
          const dessous = r.bottom - b.bottom;
          if (dessous <= 2) continue;
          manque = Math.max(manque, Math.round(dessous));
          const t = (x.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34);
          if (t) perdus.push(t);
        }
        if (!manque) continue;
        coupes.push({
          bloc: `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0].slice(0, 24)}`,
          manque,
          perdus: [...new Set(perdus)].slice(0, 4),
        });
        break;
      }
      return coupes[0] ?? null;
    });
    if (!r) console.log(`${theme} | rien`);
    else console.log(`${theme} | COUPÉ ${r.manque}px dans ${r.bloc}` +
      (r.perdus.length ? ` · perdu : ${JSON.stringify(r.perdus)}` : ""));
  } catch (e) {
    console.log(`${theme} | échec ${String(e).slice(0, 60)}`);
  }
  await ctx.close();
}
await nav.close();
