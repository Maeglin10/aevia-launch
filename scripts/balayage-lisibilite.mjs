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

/* Par défaut le serveur de développement ; BASE_URL permet de mesurer sur la
   version construite, bien plus rapide et plus proche de la production. */
const BASE = process.env.BASE_URL || "http://localhost:3000";
const sharp = createRequire(import.meta.url)("sharp");

const LISTE = process.argv.slice(2);
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } },
                     geo: { address: "12 rue des Capucins, 69001 Lyon" } }, generatedContent: {} };

/*
  La MOYENNE des pixels sous un texte compte les lettres elles-mêmes : du blanc
  sur un aplat vert donnait 3,7 au lieu de 4,9, et trois thèmes ont été signalés
  pour des boutons parfaitement lisibles. On prend donc la couleur DOMINANTE —
  le fond occupe toujours plus de surface que les glyphes — quantifiée par
  paliers de 16 pour que le dégradé d'une photo se regroupe au lieu de
  s'émietter en autant de nuances que de pixels.
*/
async function fondDominant(png, textes) {
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
  /* Un titre porte souvent un mot d'une AUTRE couleur — « sans mauvaise
     surprise. » en ambre au milieu d'un titre blanc. Cet ambre est du texte,
     pas un fond : compté comme dominante, il faisait tomber le rapport à 2,15
     sur un titre parfaitement lisible. On écarte donc toutes les couleurs de
     texte de l'élément ET de ses descendants. */
  const proche = (s) => (textes || []).some((t) => [0, 1, 2].every((i) => Math.abs(s[i] / s[3] - t[i]) < 24));
  const tries = [...seaux.values()].sort((a, b) => b[3] - a[3]);
  const mieux = tries.find((s) => !proche(s)) ?? tries[0];
  return [mieux[0] / mieux[3], mieux[1] / mieux[3], mieux[2] / mieux[3]];
}

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
    /* Le bandeau cookies couvre le bas de l'écran et fausse la mesure. Le
       refermer par un clic ne suffisait pas : ses libellés se coupent sur deux
       lignes. On pose le consentement AVANT le chargement, comme un visiteur
       déjà venu. */
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
        localStorage.setItem("site-analytics-consent", "refused");
      } catch {}
    });
    const p = await ctx.newPage();
    const morts = [];
    p.on("response", (r) => { if (/unsplash|pexels|pixabay/.test(r.url()) && r.status() >= 400) morts.push(r.status()); });
    const erreurs = [];
    p.on("pageerror", (e) => erreurs.push(String(e).split("\n")[0].slice(0, 70)));
    await p.goto(`${BASE}/templates/${t}${url}`, { waitUntil: "domcontentloaded", timeout: 180000 });
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
    /* Même attente que la fiche : sous charge, la session arrive après. */
    if (url) {
      await p.waitForFunction((nom) => (document.body.innerText || "").toLowerCase().includes(nom.toLowerCase()),
        NOM, { timeout: 6000 }).catch(() => {});
    }

    const r = await p.evaluate((nomClient) => {
      /* Un bloc de code EST anglais, et doit le rester : « npm install … # Initialize
         in your project » n'est pas une fuite de traduction. On l'écarte du relevé
         plutôt que d'aller le « corriger ». De même « Home staging » est le terme
         consacré en immobilier français — pas un anglicisme oublié. */
      const sansCode = document.body.cloneNode(true);
      for (const c of sansCode.querySelectorAll("code, pre, kbd, samp")) c.remove();
      /* `innerText` rend une chaîne vide sur un nœud détaché — il lui faut une
         mise en page. `textContent` colle les mots, ce qui ne gêne pas la
         recherche d'un mot anglais entre délimiteurs. */
      const txt = (sansCode.textContent || "")
        .replace(/\s+/g, " ")
        .replace(/home staging/gi, "");
      /* `getComputedStyle().color` ne rend plus toujours du « rgb() » :
         Tailwind 4 écrit ses couleurs en `lab()` / `oklch()`. Le canevas
         CONSERVE la notation telle quelle dans `fillStyle` — il ne convertit
         pas —, et lire les trois premiers nombres de `lab(48 -2 -16.6)`
         donnait « rgb(48, -2, -16) » : un gris moyen compté comme noir, donc
         1,05 sur un fond sombre, et sept textes parfaitement lisibles
         signalés sur impact-141. On PEINT la couleur et on relit le pixel :
         c'est le seul chemin qui force la conversion en sRGB. */
      const potDeCouleur = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const enRGB = (couleur) => {
        potDeCouleur.clearRect(0, 0, 1, 1);
        potDeCouleur.fillStyle = couleur;
        potDeCouleur.fillRect(0, 0, 1, 1);
        const [r, g, b] = potDeCouleur.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };
      /* Toutes les couleurs de texte de l'élément et de ses descendants : le
         fond dominant ne doit être aucune d'elles. */
      const couleursTexte = (e) => {
        const v = [enRGB(getComputedStyle(e).color)];
        for (const d of e.querySelectorAll("*")) {
          const t = (d.textContent || "").trim();
          if (t) v.push(enRGB(getComputedStyle(d).color));
        }
        return v.slice(0, 12);
      };
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
      const boite = (e) => { if (!e || invisible(e)) return null;
        /* Un titre en DÉGRADÉ s'écrit « text-transparent » + « bg-clip-text » :
           sa couleur calculée est rgba(0,0,0,0), et la mesurer revient à
           comparer du noir aux pixels du dégradé lui-même. impact-08, 09 et
           113 étaient signalés à 1,5-2,4 sur des titres parfaitement lisibles.
           Ces titres-là ne se mesurent pas ainsi ; on ne les invente pas. */
        const enDegrade = (n) => (getComputedStyle(n).color.match(/[\d.]+/g) || [])[3] === "0";
        if (enDegrade(e) || [...e.querySelectorAll("*")].some(enDegrade)) return null;
 const b = e.getBoundingClientRect();
        return { x: Math.max(0, b.x), y: Math.max(0, b.y), w: Math.min(b.width, innerWidth), h: Math.min(b.height, 300), c: couleursTexte(e) }; };
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
        const [rr, gg, bb] = await fondDominant(png, b?.c ?? e.c);
        /* `b.c` porte désormais TOUTES les couleurs de texte de l'élément ; la
           première est la sienne, celle qui doit se lire. */
        const L1 = lum(...b.c[0]), L2 = lum(rr, gg, bb);
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
