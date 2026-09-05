// L'audit final : chaque thème, avec des données différentes à chaque fois.
//
//   node scripts/final-audit.mjs impact-01 impact-02 …
//   node scripts/final-audit.mjs --tranche 0 5      (une tranche sur cinq)
//
// Les balayages précédents semaient la même session pour les 373 thèmes. Deux
// défauts leur échappaient : une donnée qui ne s'affiche que pour un métier
// donné, et une image ou une couleur qui ne bouge pas parce qu'on lui redonnait
// la même valeur.
//
// Ici chaque thème reçoit sa propre entreprise — nom, ville, métier, couleur,
// prestations, tarifs, avis, horaires — et ses propres images, tirées des deux
// banques. On vérifie ensuite trois choses sur la page rendue :
//
//   ce qui doit apparaître  — le nom, la ville, l'accroche, les prestations…
//   ce qui doit disparaître — la ville, l'e-mail et le téléphone de démonstration
//   ce qui ne doit pas casser — une page blanche, une erreur, un « NaN »
//
// La couleur de marque est vérifiée sur le rendu calculé, pas dans le source :
// un thème peut la lire et ne jamais la peindre.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";

const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  console.error("usage: node scripts/final-audit.mjs impact-01 … | --tranche 0 5");
  process.exit(1);
}

// De quoi donner à chaque thème une entreprise qui ne ressemble pas aux autres.
const VILLES = ["Annecy", "Chambéry", "Grenoble", "Lyon", "Valence", "Aix-les-Bains", "Voiron", "Albertville"];
const METIERS = ["plombier", "coiffeur", "avocat", "restaurateur", "photographe", "architecte", "kinésithérapeute", "fleuriste"];
const COULEURS = ["#c2410c", "#0e7490", "#4d7c0f", "#7e22ce", "#be123c", "#1d4ed8", "#a16207", "#0f766e"];

async function imagesDe(metier, n) {
  try {
    const r = await fetch(`${BASE}/api/stock?q=${encodeURIComponent(metier)}&n=${n}`);
    const { images } = await r.json();
    return (images ?? []).map((x) => x.url).filter(Boolean);
  } catch {
    return [];
  }
}

function donneesPour(id, i) {
  const ville = VILLES[i % VILLES.length];
  const metier = METIERS[i % METIERS.length];
  const couleur = COULEURS[i % COULEURS.length];
  const nom = `Maison ${id.replace("impact-", "M")}`;
  return {
    nom, ville, metier, couleur,
    formData: {
      businessName: nom,
      city: ville,
      businessType: metier,
      tagline: `Votre ${metier} à ${ville}`,
      email: `contact@${id}.fr`,
      phone: "04 50 11 22 33",
      brandColor: couleur,
      template: id,
    },
    businessProfile: {
      services: [
        { name: `Prestation ${id}`, price: "137 €", description: "La première, décrite en une phrase." },
        { name: `Seconde prestation ${id}`, price: "249 €", description: "La seconde." },
      ],
      reputation: { featuredReviews: [{ author: `Client ${id}`, text: `Travail impeccable chez ${nom}.`, rating: 5 }] },
      keyStats: [{ value: "18", label: "années d'expérience" }],
      certifications: [`Label ${id}`],
      faq: [{ q: `Question ${id} ?`, a: "La réponse." }],
      team: [{ name: `Équipier ${id}`, role: "Responsable" }],
      openingHours: [
        { day: "Lundi", open: "08:30", close: "18:00" },
        { day: "Dimanche", closed: true },
      ],
      geo: { primaryCity: ville, address: `${(i % 40) + 1} rue des Alpes, ${ville}`, serviceAreas: [ville] },
      beforeAfter: [{ beforeUrl: "", afterUrl: "", caption: `Chantier ${id}` }],
      paymentMethods: ["Carte bancaire"],
      bookingSystem: { url: `https://rdv.example/${id}` },
      contacts: { general: { email: `contact@${id}.fr`, phone: "04 50 11 22 33" } },
    },
    generatedContent: { heroHeadline: `Votre ${metier} à ${ville}`, aboutTitle: `À propos de ${nom}` },
  };
}

const VILLES_DEMO = ["Paris", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier", "Nice"];

/*
  Ce qu'un thème déclare afficher. Sans ce filtre, l'audit réclame une équipe à
  un thème qui n'en montre pas et le compte en échec pour un bloc absent par
  construction.
*/
const capabilites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const MANIFESTE = {};
for (const m of capabilites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  MANIFESTE[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}
const BLOC_DE = {
  prestation: "prestations", prix: "tarifs", avis: "avis",
  chiffre: "chiffres", equipier: "equipe", label: "engagements", question: "faq",
};

/*
  Certaines données n'ont pas de bloc déclaré au manifeste : un téléphone, une
  adresse, des horaires s'affichent là où le thème a prévu de les montrer, et
  beaucoup n'en montrent aucun. On ne les compte donc pas en manque — on note ce
  qui est affiché, pour dire ce qui est personnalisable et non ce qui manque.
*/
const OPTIONNELS = new Set(["telephone", "email", "adresse", "horaires", "realisation"]);

// Les vues intérieures de chaque thème, pour y chercher les photos du client.
const SOUS_PAGES = {};
for (const id of fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(process.cwd(), "app/templates", id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  SOUS_PAGES[id] = fs.readdirSync(dossier)
    .filter((s) => s !== "legal" && fs.existsSync(path.join(dossier, s, "page.tsx")));
}

const EMPLACEMENTS = fs.readFileSync(path.join(process.cwd(), "lib/templates/photoSlots.ts"), "utf8");
const SANS_PHOTO = new Set();
for (const m of EMPLACEMENTS.matchAll(/"(impact-[\w-]+)":\s*\{[^}]*?total:\s*(\d+)/g)) {
  if (Number(m[2]) === 0) SANS_PHOTO.add(m[1]);
}

// Les retouches offertes par thème, pour dire ce que le client peut encore changer.
let RETOUCHES = {};
try {
  const m = /RETOUCHES: Record<string, RetouchePossible\[\]> = (\{[\s\S]*?\n\});/.exec(
    fs.readFileSync(path.join(process.cwd(), "lib/templates/sectionManifest.ts"), "utf8"),
  );
  if (m) RETOUCHES = JSON.parse(m[1]);
} catch { /* le manifeste n'a pas encore été généré */ }

const fiches = [];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let n = 0;

for (const id of ids) {
  const d = donneesPour(id, n++);
  const photos = await imagesDe(d.metier, 6);

  const post = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...d.formData, photoUrls: photos } }),
  });
  const { sessionId, editToken } = await post.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
    body: JSON.stringify({ businessProfile: d.businessProfile, generatedContent: d.generatedContent }),
  });

  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 90)));
  try {
    /*
      Trois essais avant de conclure. Cinq tranches mesurent en parallèle ; il
      arrive qu'une page n'ait rien rendu à l'échéance, et une page vide fait
      manquer tous les blocs à la fois — impact-02 et impact-04 sont passés
      ainsi pour vides alors qu'ils affichent tout. Le nom de l'entreprise sert
      de témoin : aucun thème ne l'omet.
    */
    let vus = "", texte = "", images = [], couleurVue = false;
    for (let essai = 0; essai < 3; essai++) {
      await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await p.waitForTimeout(2600);
      /*
        Le texte se récolte pendant la descente, pas à l'arrivée. Un compteur animé
        qui remonte hors du champ se remet à zéro : impact-69 et impact-214
        affichaient bien « 18 » au passage, et « 0 » une fois revenu en haut, d'où
        deux chiffres comptés absents pendant deux campagnes de mesure.
      */
      vus = await p.evaluate(async () => {
        const morceaux = [];
        for (let y = 0; y < document.body.scrollHeight; y += 900) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 260));
          morceaux.push(document.body.innerText);
        }
        window.scrollTo(0, 0);
        return morceaux.join("\n");
      });
      /*
        Un compteur animé part de zéro quand il entre dans le champ. Cinq cents
        millisecondes après le défilement, six thèmes affichaient encore « 0 » et
        passaient pour ne pas montrer les chiffres du client. Mille quatre cents ne
        suffisaient pas non plus : impact-69 et impact-214 comptent lentement et
        passaient encore pour muets. Deux mille cinq cents les rattrapent.
      */
      await p.waitForTimeout(2500);

      ({ texte, images, couleurVue } = await p.evaluate((couleur) => {
        const hex = couleur.replace("#", "").toLowerCase();
        const rgb = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
        const cible = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        /*
          La couleur de marque se pose rarement en aplat : le plus souvent dans un
          dégradé, un liseré, un remplissage de svg, une ombre. Ne regarder que
          `color`, `background-color` et `border-color` faisait conclure qu'un
          thème ne la peignait pas alors qu'elle était partout.
        */
        let vue = false;
        const cibleCourte = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        for (const e of document.querySelectorAll("*")) {
          const s = getComputedStyle(e);
          const tout = [s.color, s.backgroundColor, s.borderColor, s.backgroundImage,
            s.boxShadow, s.outlineColor, s.fill, s.stroke, s.textDecorationColor].join(" ");
          if (tout.includes(cible) || tout.includes(cibleCourte)) { vue = true; break; }
        }
        /*
          Une photo peut être une image ou un fond CSS. Ne regarder que les
          balises `img` faisait conclure qu'un thème n'affichait pas les photos du
          client alors qu'il les peignait en arrière-plan.
        */
        const fonds = [...document.querySelectorAll("*")]
          .map((e) => getComputedStyle(e).backgroundImage)
          .filter((v) => v && v !== "none");
        return {
          texte: document.body.innerText,
          images: [...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src).concat(fonds),
          couleurVue: vue,
        };
      }, d.couleur));

      if (texte.toLowerCase().includes(d.nom.toLowerCase())) break;
      await p.waitForTimeout(1500);
    }

    const bas = `${vus}\n${texte}`.toLowerCase();
    const manquent = Object.entries({
      nom: d.nom, ville: d.ville, accroche: d.formData.tagline,
      prestation: `Prestation ${id}`, prix: "137 €", avis: `Travail impeccable chez ${d.nom}`,
      chiffre: "18", equipier: `Équipier ${id}`, label: `Label ${id}`, question: `Question ${id}`,
      // Ce que le thème affiche seulement s'il a une section pour le montrer.
      telephone: "04 50 11 22 33", email: `contact@${id}.fr`,
      adresse: "rue des Alpes", horaires: "08:30", realisation: `Chantier ${id}`,
    })
      .filter(([k]) => !BLOC_DE[k] || (MANIFESTE[id] ?? []).includes(BLOC_DE[k]))
      .filter(([, v]) => !bas.includes(String(v).toLowerCase()))
      .map(([k]) => k);
    const obligatoires = manquent.filter((k) => !OPTIONNELS.has(k));
    const affiches = Object.entries({
      telephone: "04 50 11 22 33", email: `contact@${id}.fr`,
      adresse: "rue des Alpes", horaires: "08:30", realisation: `Chantier ${id}`,
    }).filter(([, v]) => bas.includes(String(v).toLowerCase())).map(([k]) => k);

    // Les restes se cherchent dans tout ce qu'on a vu, pas seulement dans la vue finale.
    const tout = `${vus}\n${texte}`;
    const restes = [];
    for (const v of VILLES_DEMO) {
      if (v === d.ville) continue;
      const m = new RegExp(`\\b${v}\\b`, "i").exec(tout);
      if (!m) continue;
      restes.push(v);
      if (process.env.CONTEXTE) {
        console.log(`   ↳ ${v} : …${tout.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\n/g, " ⏎ ")}…`);
      }
    }
    for (const m of texte.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) ?? [])
      if (m !== d.formData.email) restes.push(m);
    if (/\bNaN\b|undefined/.test(texte)) restes.push("NaN/undefined");

    /*
      `next/image` réécrit l'adresse en `/_next/image?url=…%2F…`. Comparer les
      chaînes entières concluait que la photo du client n'était pas affichée
      alors qu'elle l'était : on cherche l'identifiant de la photo dans ce que
      le navigateur a réellement chargé.
    */
    const empreinte = (u) => (u.match(/\/([\w-]{6,})\.(jpe?g|png|webp)/i)?.[1] ?? u.split("/").pop() ?? "").slice(0, 24);
    // Un fond CSS contient des parenthèses et des guillemets que `decodeURIComponent`
    // refuse : on décode ce qui se décode, on garde le reste tel quel.
    const brut = images.join(" ");
    let decode = brut;
    try { decode = decodeURIComponent(brut); } catch { /* adresse non décodable */ }
    const chargees = brut + " " + decode;
    // Un thème sans emplacement photo n'a rien à montrer : ce n'est pas un manque.
    let photosVues = SANS_PHOTO.has(id) || photos.length === 0
      ? "—"
      : photos.some((u) => chargees.includes(empreinte(u))) ? "oui" : "non";
    /*
      Un thème peut ne montrer aucune photo sur son accueil et les réserver à ses
      vues intérieures : impact-14 tient ses douze emplacements dans « la flotte »,
      « les destinations » et « l'expérience », et passait pour ne pas afficher
      celles du client alors qu'il les affiche toutes, une page plus loin.
    */
    if (photosVues === "non") {
      for (const sous of SOUS_PAGES[id] ?? []) {
        try {
          await p.goto(`${BASE}/templates/${id}/${sous}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
          await p.waitForTimeout(1800);
          const vues = await p.evaluate(() =>
            [...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src).concat(
              [...document.querySelectorAll("*")].map((e) => getComputedStyle(e).backgroundImage).filter((x) => x && x !== "none"),
            ).join(" "));
          let decodeSous = vues;
          try { decodeSous = decodeURIComponent(vues); } catch { /* adresse non décodable */ }
          if (photos.some((u) => `${vues} ${decodeSous}`.includes(empreinte(u)))) { photosVues = "oui"; break; }
        } catch { /* sous-page injoignable */ }
      }
    }
    if (process.env.CONTEXTE === "photos" && photosVues === "non") {
      console.log(`   ↳ ${id} demandées : ${photos.map(empreinte).join(", ") || "aucune"}`);
      console.log(`   ↳ ${id} chargées  : ${images.filter((u) => /http|_next/.test(u)).slice(0, 4).join(" ").slice(0, 220) || "aucune"}`);
    }

    fiches.push({
      id, manquent: obligatoires, affiches, restes: [...new Set(restes)],
      photos: photosVues, couleur: couleurVue, plantee: /couldn.t load/i.test(texte),
      retouches: (RETOUCHES[id] ?? []).length,
    });
    console.log(
      `${id.padEnd(12)} manquent:${obligatoires.join(",") || "rien"}` +
      ` | affiche:${affiches.join(",") || "—"}` +
      ` | restes:${[...new Set(restes)].slice(0, 3).join(",") || "rien"}` +
      ` | photos:${photosVues} | couleur:${couleurVue ? "oui" : "non"}` +
      (/couldn.t load/i.test(texte) ? " | PAGE PLANTÉE" : "") +
      (erreurs.length ? ` | ERREUR ${erreurs[0]}` : ""),
    );
  } catch (e) {
    console.log(`${id.padEnd(12)} ÉCHEC ${String(e).slice(0, 80)}`);
  } finally {
    await p.close();
  }
}

await b.close();

if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
