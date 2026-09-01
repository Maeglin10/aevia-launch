/* Le même instrument que la fiche, passé sur une LISTE de thèmes.

   Il ne juge pas : il dit lesquels méritent qu'on aille les regarder. Chaque
   thème signalé est ensuite ouvert un par un, à l'œil, avec sa fiche.

     node scripts/balayage-lisibilite.mjs impact-17 impact-25 …
*/
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

const LISTE = process.argv.slice(2);
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
                     geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };

const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };

const nav = await chromium.launch();
const signales = [];
for (const t of LISTE) {
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
    /* Le bandeau cookies couvre le bas de l'écran. La jauge lit la couleur du
       fond DANS la capture : un titre caché derrière le bandeau se mesurait
       contre le bandeau — impact-363 tombait ainsi à 1,13 alors qu'il est noir
       sur blanc. On le referme avant de mesurer, comme le ferait un visiteur. */
    for (const libelle of ["Tout refuser", "Tout accepter"]) {
      const b = p.locator(`button:has-text("${libelle}")`).first();
      if (await b.count().then((n) => n > 0).catch(() => false)) {
        await b.click({ timeout: 2000 }).catch(() => {});
        break;
      }
    }
    await p.waitForTimeout(900);

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
      /* Un élément à opacité nulle — le titre d'une surimpression qui n'apparaît
         qu'au défilement — se mesurait contre ce qu'il ne cache pas encore.
         impact-211 tombait ainsi à 1,5 sur un titre que personne ne voit. */
      const invisible = (e) => { for (let n = e; n; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (parseFloat(s.opacity) < 0.05 || s.visibility === "hidden" || s.display === "none") return true; } return false; };
      const boite = (e) => { if (!e || invisible(e)) return null; const b = e.getBoundingClientRect();
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
    rapport.push({ etat, largeur: nom, ...r, cTitre, cBarre, morts: morts.length, erreurs: [...new Set(erreurs)].slice(0, 2) });
    await ctx.close();
  }
}

const motifs = [];
for (const r of rapport) {
  if (r.cTitre !== null && r.cTitre < 4.5) motifs.push(`titre ${r.cTitre} (${r.etat}${r.largeur})`);
  if (r.cBarre !== null && r.cBarre < 4.5) motifs.push(`barre ${r.cBarre} (${r.etat}${r.largeur})`);
  if (r.apostrophes) motifs.push(`apostrophes ${r.apostrophes}`);
  if (r.debord > 2) motifs.push(`débord ${r.debord} (${r.largeur})`);
  if (r.anglais.length) motifs.push(`anglais ${r.anglais.join(",")}`);
  if (r.morts) motifs.push(`${r.morts} images mortes`);
  if (r.erreurs.length) motifs.push(`erreur ${r.erreurs[0]}`);
  if (r.etat === "client" && !r.nomVu) motifs.push("nom du client absent");
}
if (motifs.length) { signales.push(t); console.log(`${t} | ${[...new Set(motifs)].join(" ; ")}`); }
else console.log(`${t} | rien`);
fs.appendFileSync("captures/revue/balayage.jsonl", JSON.stringify({ theme: t, rapport }) + "\n");
}
await nav.close();
console.log(`\n${signales.length} thèmes à regarder : ${signales.join(" ")}`);
