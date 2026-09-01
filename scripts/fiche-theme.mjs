/* La fiche de contrôle d'UN thème. Un seul, jamais un lot.

   Quatre rendus : vitrine et client, en 1280 et en 390. Pour chacun :
     · les apostrophes échappées visibles à l'écran ;
     · les mots anglais dans une page qui se veut française ;
     · le nom du client, présent ou non — la personnalisation ;
     · le débordement horizontal, qui casse la lecture sur téléphone ;
     · le contraste du titre et de la barre sur leur fond réel, au WCAG ;
     · les images qui ne répondent pas.
   Elle ne juge pas : elle rapporte, et l'œil tranche sur la capture. */
import { chromium } from "playwright";
import fs from "node:fs";
import { createRequire } from "module";
const sharp = createRequire(import.meta.url)("sharp");

const t = process.argv[2];
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
                     geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };

const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };

const nav = await chromium.launch();
const rapport = [];

for (const [etat, url] of [["vitrine", ""], ["client", "?session=v"]]) {
  for (const [nom, w, h] of [["1280", 1280, 900], ["390", 390, 844]]) {
    /* Le navigateur de mesure parlait anglais : les thèmes qui se traduisent
       à l'exécution restaient donc en anglais sous l'objectif, et l'on croyait
       à un défaut du thème. La boutique est française — on mesure en français. */
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, locale: "fr-FR" });
    await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
    const p = await ctx.newPage();
    const morts = [];
    p.on("response", (r) => { if (/unsplash|pexels|pixabay/.test(r.url()) && r.status() >= 400) morts.push(r.status()); });
    const erreurs = [];
    p.on("pageerror", (e) => erreurs.push(String(e).split("\n")[0].slice(0, 70)));
    await p.goto(`http://localhost:3000/templates/${t}${url}`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(3800);

    const r = await p.evaluate((nomClient) => {
      const txt = (document.body.innerText || "").replace(/\s+/g, " ");
      const ANGLAIS = /\b(home|about|our|your|book now|view all|read more|learn more|contact us|get started|sign in|discover|welcome|opening hours|our story|our team|our services|see more|find out)\b/gi;
      const h1 = document.querySelector("h1");
      const conteneur = [...document.querySelectorAll("header, nav")].filter((e) => e.getBoundingClientRect().top < 140)[0];
      /* La couleur du CONTENEUR n'est pas celle du texte : elle est souvent
         héritée et sombre alors que les libellés sont blancs. On prend donc le
         premier élément qui porte vraiment du texte. Sans cela la jauge
         annonçait 1,48 sur une barre parfaitement lisible. */
      const barre = conteneur
        /* « sans enfant » était trop strict : « Jardins Vivants » vit dans un
           span accompagné d'une icône, et la jauge retombait alors sur le
           conteneur — dont la couleur EST celle du fond, d'où un rapport de 1
           sur un texte parfaitement lisible. On accepte deux enfants et on
           exige que l'élément porte lui-même du texte. */
        ? [...conteneur.querySelectorAll("a, span, div, p, button, h1, h2, strong")]
            .filter((e) => {
              const propre = [...e.childNodes].some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 1);
              return propre && e.children.length <= 2;
            })
            .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? conteneur
        : null;
      const boite = (e) => { if (!e) return null; const b = e.getBoundingClientRect();
        return { x: Math.max(0, b.x), y: Math.max(0, b.y), w: Math.min(b.width, innerWidth), h: Math.min(b.height, 300), c: getComputedStyle(e).color.match(/\d+/g).map(Number) }; };
      return {
        apostrophes: (txt.match(/\\'/g) || []).length,
        anglais: [...new Set((txt.match(ANGLAIS) || []).map((x) => x.toLowerCase()))].slice(0, 8),
        nomVu: txt.toLowerCase().includes(nomClient.toLowerCase()),
        telVu: txt.includes("78 12 34 56") || [...document.querySelectorAll('a[href^="tel:"]')].some((a) => a.href.replace(/\D/g, "").endsWith("478123456")),
        debord: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        images: document.querySelectorAll("img").length,
        titre: boite(h1), barreB: boite(barre),
        titreTxt: (h1?.innerText || "").replace(/\s+/g, " ").slice(0, 60),
      };
    }, NOM);

    /* Le contraste, mesuré sur les pixels réellement derrière le texte. */
    const contraste = async (b) => {
      if (!b || b.w < 20 || b.h < 8) return null;
      try {
        const png = await p.screenshot({ clip: { x: b.x, y: b.y, width: Math.max(8, b.w), height: Math.max(8, b.h) } });
        const st = await sharp(png).stats();
        const [rr, gg, bb] = st.channels.slice(0, 3).map((c) => c.mean);
        const L1 = lum(b.c[0], b.c[1], b.c[2]), L2 = lum(rr, gg, bb);
        /* Le rapport de contraste ne peut pas dépasser 21 : au-delà, c'est que
           la mesure a échoué — une couleur non analysable rend NaN, et la
           division donnait des milliards. On refuse plutôt que d'inventer. */
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        if (!Number.isFinite(ratio) || ratio > 21.5 || ratio < 1) return null;
        return Number(ratio.toFixed(2));
      } catch { return null; }
    };
    const cTitre = await contraste(r.titre), cBarre = await contraste(r.barreB);
    await p.screenshot({ path: `captures/revue/${t}-${etat}-${nom}.png` });
    rapport.push({ etat, largeur: nom, ...r, cTitre, cBarre, morts: morts.length, erreurs: [...new Set(erreurs)].slice(0, 2) });
    await ctx.close();
  }
}
await nav.close();

console.log(`\n══ ${t} ══`);
for (const r of rapport) {
  const al = r.anglais.length ? ` · anglais: ${r.anglais.join(",")}` : "";
  console.log(`${r.etat.padEnd(8)}${r.largeur.padEnd(5)} apo ${r.apostrophes} · débord ${r.debord} · img ${r.images}${r.morts ? " (" + r.morts + " mortes)" : ""} · titre ${r.cTitre ?? "?"} · barre ${r.cBarre ?? "?"}${al}`);
  if (r.etat === "client" && (!r.nomVu || !r.telVu)) console.log(`         PERSONNALISATION : nom ${r.nomVu ? "ok" : "ABSENT"} · téléphone ${r.telVu ? "ok" : "ABSENT"}`);
  if (r.erreurs.length) console.log(`         ${r.erreurs.join(" | ")}`);
}
fs.appendFileSync("captures/revue/journal.jsonl", JSON.stringify({ theme: t, rapport }) + "\n");
