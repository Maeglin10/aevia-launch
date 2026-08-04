// Mesure ce qu'un thème affiche réellement d'une session client.
//
//   node scripts/theme-audit.mjs impact-351 [impact-352 …]
//   node scripts/theme-audit.mjs --range 1 40
//
// À lancer sur un build de production servi avec BLOB_READ_WRITE_TOKEN :
//   npm run build && (set -a; . ./.env.local; set +a; npx next start -p 3411)
// Sans le jeton, /api/sessions répond 404, le thème retombe sur sa démonstration
// et l'audit conclut à tort que le câblage ne marche pas.
//
// La session est semée de valeurs témoins improbables (« ZZSERVICE-UN »). Une
// valeur témoin absente du DOM veut dire que la section correspondante montre
// encore autre chose que la donnée du client — c'est le seul constat qui compte,
// et il ne dépend d'aucune supposition sur les noms de constantes du thème.

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";

const args = process.argv.slice(2);
let ids = [];
if (args[0] === "--range") {
  const [from, to] = [Number(args[1]), Number(args[2])];
  for (let n = from; n <= to; n++) ids.push(`impact-${String(n).padStart(2, "0")}`);
} else {
  ids = args;
}
if (ids.length === 0) {
  console.error("usage: node scripts/theme-audit.mjs impact-351 [...] | --range 1 40");
  process.exit(1);
}

const WITNESS = {
  businessName: "ZZ-ENTREPRISE",
  city: "ZZVILLE",
  service1: "ZZSERVICE-UN",
  service2: "ZZSERVICE-DEUX",
  price1: "ZZ8137 €",
  review: "ZZAVIS le chantier fut impeccable",
  author: "ZZAUTEUR",
  stat: "9911",
  cert: "ZZCERTIF",
  faq: "ZZQUESTION",
  member: "ZZEQUIPIER",
  area: "ZZZONE",
  headline: "ZZACCROCHE",
};

/*
  /api/sessions limite à 30 requêtes par minute et par IP. Le harnais en
  consommait trois par thème et se faisait étrangler au dixième : les thèmes
  audités ensuite paraissaient ne rien afficher, alors que c'est la mesure qui
  échouait. On respecte la limite plutôt que d'affaiblir le limiteur.
*/
const MIN_INTERVAL_MS = Number(process.env.AUDIT_INTERVAL_MS ?? 2100);
let lastCall = 0;
async function throttled(url, init) {
  const wait = MIN_INTERVAL_MS - (Date.now() - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
  let res = await fetch(url, init);
  for (let n = 0; res.status === 429 && n < 4; n++) {
    await new Promise((r) => setTimeout(r, 15_000));
    lastCall = Date.now();
    res = await fetch(url, init);
  }
  if (res.status === 429) throw new Error("429 persistant : limiteur de débit");
  return res;
}

/*
  Une seule session pour tout le balayage.

  Le harnais en créait une par thème. Sans jeton Blob elles vivent en mémoire
  dans le processus du serveur, si bien qu'un balayage de 373 thèmes se ralentit
  lui-même — de 5 secondes à plus de 30 par page en fin de course. On sème une
  fois, puis on ne change que le template.
*/
let sessionUnique = null;

async function seed(templateId) {
  if (sessionUnique) {
    await throttled(`${BASE}/api/sessions?id=${sessionUnique}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: { template: templateId } }),
    });
    return sessionUnique;
  }
  return (sessionUnique = await semer(templateId));
}

async function semer(templateId) {
  const post = await throttled(`${BASE}/api/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      formData: {
        template: templateId,
        businessName: WITNESS.businessName,
        city: WITNESS.city,
        // `tagline` — « ce que vous faites » — est obligatoire dans le wizard :
        // le harnais doit l'envoyer comme un vrai client, sans quoi les thèmes
        // qui la lisent paraissent ne rien afficher.
        tagline: WITNESS.headline,
        sector: "couvreur",
        industry: "services",
        businessType: "couvreur",
        email: "audit@example.com",
        phone: "04 00 00 00 00",
        mainService: WITNESS.service1,
        benefits: ["a", "b", "c"],
        brandColor: "#7c3aed",
      },
    }),
  });
  const { sessionId } = await post.json();

  await throttled(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      businessProfile: {
        services: [
          { name: WITNESS.service1, price: WITNESS.price1, description: "desc un" },
          { name: WITNESS.service2, price: "ZZ222 €", description: "desc deux" },
        ],
        reputation: {
          featuredReviews: [
            { author: WITNESS.author, text: WITNESS.review, rating: 5, source: "ZZSOURCE" },
          ],
        },
        keyStats: [{ value: WITNESS.stat, label: "ZZLIBELLE" }],
        certifications: [WITNESS.cert],
        faq: [{ q: WITNESS.faq, a: "ZZREPONSE" }],
        team: [{ name: WITNESS.member, role: "ZZROLE" }],
        geo: { serviceAreas: [WITNESS.area], primaryCity: WITNESS.city },
      },
      generatedContent: {
        heroHeadline: WITNESS.headline,
        heroSubline: "ZZSOUS-TITRE",
        aboutTitle: "ZZAPROPOS",
        aboutText: "ZZTEXTE",
        services: [{ title: WITNESS.service1, description: "desc un" }],
        testimonials: [
          { name: WITNESS.author, role: "ZZROLE", text: WITNESS.review, rating: 5 },
        ],
        ctaText: "ZZCTA",
        metaTitle: "ZZMETA",
        metaDescription: "ZZMETADESC",
      },
    }),
  });
  return sessionId;
}

/*
  Le navigateur est recyclé tous les quarante thèmes.

  Une seule instance pour les 373 accumule assez de mémoire pour faire passer la
  mesure de 5 à 30 secondes par page — un balayage complet de trente minutes à
  trois heures. Ce n'est pas le thème qui ralentit, c'est l'instrument.
*/
const PAR_LOT = Number(process.env.AUDIT_PAR_LOT ?? 25);
let browser = null;
let ctx = null;

async function ouvrir() {
  browser = await chromium.launch();
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.setDefaultTimeout(15000);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem(
        "aevia-cookie-consent",
        JSON.stringify({ essential: true, analytics: false, ts: Date.now() }),
      );
    } catch {}
  });
}
await ouvrir();

function ligne(t) {
  if (t.erreur) return `${t.id}  ERREUR  ${t.erreur}`;
  if (t.plantee) return `${t.id}  PAGE PLANTÉE`;
  const flags = [
    t.absents.length ? `absents: ${t.absents.join(",")}` : "tous les témoins vus",
    t.debordement ? "DÉBORDEMENT" : "",
    t.invisibles?.length ? `invisibles: ${t.invisibles.join(",")}` : "",
    t.cassees?.length ? `cassées: ${t.cassees.join(",")}` : "",
  ].filter(Boolean);
  return `${t.id}  ${flags.join("  |  ")}`;
}

const report = [];
let n = 0;
for (const id of ids) {
  if (n > 0 && n % PAR_LOT === 0) {
    // Fermer le navigateur suffit : il ferme ses contextes. Fermer les deux
    // ajoutait une attente à chaque recyclage.
    await browser.close();
    await ouvrir();
  }
  n++;
  const page = await ctx.newPage();
  try {
    const sid = await seed(id);
    await page.goto(`${BASE}/templates/${id}?session=${sid}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2500);
    // Dérouler la page : beaucoup de sections n'apparaissent qu'au défilement.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const r = await page.evaluate((W) => {
      const text = document.body.innerText;
      // Un thème qui anime ses chiffres lit un nombre, pas une chaîne : « 9911 »
      // y arrive sous la forme d'un compteur, et le libellé du client est la
      // seule autre preuve que la donnée est passée. De même un tarif rendu
      // sans son symbole reste un tarif affiché.
      const ALT = { stat: ["9911", "ZZLIBELLE"], price1: ["ZZ8137 €", "ZZ8137", "8137"] };
      const vu = Object.fromEntries(
        Object.entries(W).map(([k, v]) => [k, (ALT[k] ?? [v]).some((x) => text.includes(x))]),
      );
      // Chargée mais jamais peinte : une image dont un ancêtre proche s'est
      // effondré à moins de 2 px. C'est le seul contrôle qui attrape un hero
      // vide, puisque l'image répond 200 et que naturalWidth est correct.
      /*
        Chargée mais jamais peinte : un ancêtre proche s'est effondré à moins de
        2 px alors que la section qui le contient, elle, occupe la page. C'est la
        signature du défaut PushBlur — un panneau en position absolue dans un
        conteneur sans hauteur, dont l'overflow:hidden masquait tout.

        Le contrôle naïf — « un ancêtre est à zéro » — signalait cinq thèmes qui
        n'avaient rien : ce sont des thèmes multi-pages, et une page inactive est
        entièrement à zéro, images comprises. On exige donc que l'effondrement
        soit local : au moins un ancêtre plus haut doit avoir une taille.
      */
      const invisibles = [...document.querySelectorAll("img")]
        .filter((img) => img.naturalWidth > 0)
        .filter((img) => {
          let e = img;
          let effondre = false;
          for (let k = 0; k < 10 && e && e !== document.body; k++) {
            const b = e.getBoundingClientRect();
            if (b.height < 2 || b.width < 2) effondre = true;
            else if (effondre) return true; // un parent visible au-dessus : local
            e = e.parentElement;
          }
          return false;
        })
        .map((img) => (img.currentSrc || img.src).split("/").pop().slice(0, 40));
      const cassees = [...document.querySelectorAll("img")]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => (img.currentSrc || img.src).split("/").pop().slice(0, 40));
      /*
        Une page qui plante rend « This page couldn't load » et rien d'autre. Sans
        ce contrôle, l'audit la rapporte comme « aucune donnée client affichée »,
        ce qui envoie chercher un câblage manquant là où il y a une exception —
        l'erreur React #130 a coûté une journée pour cette raison.
      */
      const plantee = /couldn.t load|Application error|Unhandled Runtime/i.test(text);
      return {
        plantee,
        vu,
        debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
        invisibles,
        cassees,
        hauteur: document.body.scrollHeight,
      };
    }, WITNESS);

    const absents = Object.entries(r.vu)
      .filter(([, ok]) => !ok)
      .map(([k]) => k);
    const row = { id, absents, ...r, vu: undefined };
    report.push(row);
    // Écrire au fil de l'eau : un balayage de 373 thèmes dure une demi-heure, et
    // n'imprimer qu'à la fin fait perdre tout le travail au moindre incident.
    console.log(ligne(row));
  } catch (e) {
    const row = { id, erreur: String(e).slice(0, 140) };
    report.push(row);
    console.log(ligne(row));
  }
  await page.close();
}
await browser.close();

const ko = report.filter((t) => t.erreur || t.absents?.length).length;
console.log(`\n${report.length} thèmes mesurés, ${report.length - ko} sans aucun manque`);

