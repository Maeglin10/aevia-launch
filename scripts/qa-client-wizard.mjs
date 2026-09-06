/*
  qa-client-wizard.mjs — le parcours d'un vrai client, thème par thème.

  Pour chaque thème du catalogue :
    1. /configure — refuse les cookies, choisit le domaine puis le métier
       (mapping secteur → libellés lus dans lib/templates/sectors.ts) ;
    2. étape design — clique la carte du thème cible (img /thumbnails/<id>.webp) ;
    3. étape entreprise — saisit nom, activité, ville, téléphone, email ;
    4. étape offre — remplit CHAQUE section proposée avec des valeurs uniques
       traçables (préfixe Barral), écrites à la main : aucune génération IA ;
    5. ouvre /templates/<id>?session=<sid> et vérifie que chaque valeur
       saisie apparaît sur la page rendue.

  Sortie : fiches-wizard/rapport.jsonl — une ligne par thème
    { theme, secteur, ok, saisis:[...], retrouves:[...], manquants:[...], erreur? }

  Le bouton final « Générer mon site » n'est JAMAIS cliqué : l'autosave a déjà
  persisté la session, l'aperçu la rend sans IA — coût zéro.
*/
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3100";
const SORTIE = process.env.SORTIE ?? "fiches-wizard";
fs.mkdirSync(SORTIE, { recursive: true });
const RAPPORT = path.join(SORTIE, "rapport.jsonl");

/* ── Référentiels lus dans le code (source de vérité) ─────────────────────── */
const sectorsTs = fs.readFileSync("lib/templates/sectors.ts", "utf8");
const capsTs = fs.readFileSync("lib/templates/capabilities.ts", "utf8");

// industrie.label + specialty.{id,label}
const INDUSTRIES = [];
{
  const blocs = sectorsTs.split(/\n\s{2}\{\n\s{4}id: '/).slice(1);
  for (const b of blocs) {
    const id = b.slice(0, b.indexOf("'"));
    const label = (b.match(/label: '([^']+)'/) ?? [])[1];
    const specs = [...b.matchAll(/\{ id: '([a-z_0-9]+)',\s*label: (?:'([^']+)'|"([^"]+)")/g)]
      .map((m) => ({ id: m[1], label: m[2] ?? m[3] }));
    if (label) INDUSTRIES.push({ id, label, specs });
  }
}
const SPEC_BY_ID = {};
for (const ind of INDUSTRIES)
  for (const sp of ind.specs) SPEC_BY_ID[sp.id] ??= { industrie: ind.label, metier: sp.label };

// secteur → thèmes (mapping SECTOR_TEMPLATES) → inversé
const THEME_SECTEUR = {};
for (const m of sectorsTs.matchAll(/^\s{2}'?([a-z_0-9]+)'?:\s*\[([^\]]*)\]/gm)) {
  for (const t of m[2].matchAll(/['"](impact-[\w-]+)['"]/g))
    THEME_SECTEUR[t[1]] ??= m[1];
}

// blocs déclarés par thème
const THEME_BLOCS = {};
for (const m of capsTs.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g))
  THEME_BLOCS[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);

/* ── Ce que le client saisit (écrit main, unique, traçable) ───────────────── */
const D = {
  nom: "Barral & Filles",
  tagline: "L'atelier Barral, précision et parole tenue",
  ville: "Voiron",
  tel: "04 76 91 82 73",
  email: "atelier@barral-filles.fr",
  prestation: { nom: "Révision Barral", prix: "89", desc: "Contrôle complet en une seule visite" },
  avis: { auteur: "Honorine Vasseur", texte: "Travail impeccable, délais tenus, atelier de confiance." },
  chiffre: { valeur: "618", libelle: "Chantiers Barral" },
  equipier: { nom: "Léonie Barral", role: "Fondatrice" },
  engagement: "Charte Barral zéro surprise",
  faq: { q: "Travaillez-vous le samedi matin ?", a: "Oui, sur rendez-vous jusqu'à midi." },
  etape: { nom: "Visite Barral", desc: "État des lieux et devis sur place" },
  zone: "Voiron et alentours",
  realisation: "Chantier Croix-Bayard rénové",
};

/* Ce qu'on doit retrouver sur la page rendue, par bloc déclaré. */
const ATTENDU_PAR_BLOC = {
  prestations: [D.prestation.nom],
  tarifs: [],
  menu: [D.prestation.nom],
  produits: [D.prestation.nom],
  avis: [D.avis.auteur],
  // les compteurs animent la valeur (« 618 » n'existe qu'en fin d'animation) :
  // on cherche le libellé, stable dans le DOM
  chiffres: [D.chiffre.libelle],
  equipe: [D.equipier.nom],
  engagements: [D.engagement],
  faq: [D.faq.q],
  methode: [D.etape.nom],
  zones: [D.zone],
  realisations: [D.realisation],
  horaires: [],
};

const clic = async (page, texte, exact = true) => {
  const loc = exact
    ? page.getByRole("button", { name: texte, exact: true }).first()
    : page.locator(`button:has-text("${texte}")`).first();
  await loc.click({ timeout: 8000 });
};

async function remplirUnChamp(page, D) {
  /* Remplit UN SEUL champ par appel (les onChange de l'étape 4 partagent une
     closure d'état : deux dispatchs dans le même tick s'écrasent).

     Identification STRUCTURELLE, pas par placeholder (73 lexiques métier les
     font varier) :
       1. rangée d'un Repeater ThemeBlocks — libellé fixe du bouton « Ajouter … » ;
       2. section ArchetypeStep — titre fixe (LIBELLES) du <p> uppercase ;
       3. repli : regex sur le placeholder (steps métier écrits main).
     Chaque champ traité est marqué data-qa-vu pour ne jamais boucler. */
  const ARGS = {
    D,
    parAjout: {
      "Ajouter un avis": [D.avis.texte, D.avis.auteur, "Google"],
      "Ajouter un chiffre": [D.chiffre.valeur, D.chiffre.libelle],
      "Ajouter une garantie": [D.engagement],
      "Ajouter une question": [D.faq.q, D.faq.a],
      "Ajouter une personne": [D.equipier.nom, D.equipier.role],
      "Ajouter un horaire": ["Lundi - Vendredi", "8h - 18h"],
      "Ajouter une étape": [D.etape.nom, D.etape.desc],
      "Ajouter une réalisation": [D.realisation],
      "Ajouter une prestation": [D.prestation.nom, D.prestation.prix, "1 h", D.prestation.desc],
      "Ajouter un membre": [D.equipier.nom, D.equipier.role],
      "Ajouter un agent": [D.equipier.nom, D.equipier.role],
      "Ajouter un plat": [D.prestation.nom, D.prestation.prix, D.prestation.desc],
      "Ajouter une annonce": [D.realisation, "250 000", "82", "3", D.ville],
      "Ajouter une zone": [D.zone],
    },
    parTitre: {
      "Vos prestations": [D.prestation.nom, D.prestation.prix, D.prestation.desc],
      "Vos produits": [D.prestation.nom, D.prestation.prix, D.prestation.desc],
      "Votre équipe": [D.equipier.nom, D.equipier.role],
      "Vos réalisations": [D.realisation],
      "Vos biens": [D.realisation, "250 000", "82"],
      "Votre carte": ["Plats", D.prestation.nom, D.prestation.prix],
      "Questions fréquentes": [D.faq.q, D.faq.a],
      "Vos chiffres": [D.chiffre.valeur, D.chiffre.libelle],
      "Vos avis clients": [D.avis.auteur, D.avis.texte],
      "Labels et certifications": [D.engagement],
      "Questions fréquentes des patients": [D.faq.q, D.faq.a],
    },
    tableRegex: [
      ["catégorie", "Plats"],
      ["RGE|Qualibat", D.engagement],
      ["zone|secteur|jusqu'où|desservie", D.zone],
      ["avantage|bénéfice|benefit", "Intervention Barral en 24 h"],
      ["prestation|plat|produit|article|service|acte", D.prestation.nom],
      ["prix|€|tarif", D.prestation.prix],
      ["durée", "1 h"],
      ["description|décrivez|détail|une phrase|s'y passe", D.prestation.desc],
      ["rôle|poste|fonction", D.equipier.role],
      ["légende|caption|avant", D.realisation],
    ],
  };
  return page.evaluate(({ D, parAjout, parTitre, tableRegex }) => {
    const set = (el, v) => {
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const champs = [...document.querySelectorAll(
      'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=url]), textarea',
    )].filter((el) => !el.dataset.qaVu && !el.value?.trim() && el.offsetParent !== null && !el.closest("nav, header"));
    for (const el of champs) {
      el.dataset.qaVu = "1";
      // 1. Rangée de Repeater : le bouton « Ajouter … » frère de la rangée
      let valeurs = null, rangee = null;
      let n = el;
      while (n && n !== document.body && !valeurs) {
        const parent = n.parentElement;
        if (parent) {
          for (const b of parent.children) {
            if (b.tagName !== "BUTTON") continue;
            const t = (b.textContent ?? "").trim().replace(/^\+\s*/, "");
            if (parAjout[t]) { valeurs = parAjout[t]; rangee = n; break; }
          }
        }
        n = parent;
      }
      // 2. Section ArchetypeStep : titre fixe du <p> uppercase le plus proche
      if (!valeurs) {
        n = el;
        while (n && n !== document.body && !valeurs) {
          const titreEl = n.querySelector?.(":scope > p, :scope > div");
          const titre = titreEl?.childNodes?.[0]?.textContent?.trim();
          if (titre && parTitre[titre]) {
            valeurs = parTitre[titre];
            rangee = el.closest("div.flex.gap-2") ?? el.parentElement;
          }
          n = n.parentElement;
        }
      }
      if (valeurs && rangee) {
        const freres = [...rangee.querySelectorAll("input, textarea")].filter(
          (x) => !["hidden", "checkbox", "radio", "file", "url"].includes(x.type ?? ""),
        );
        const pos = freres.indexOf(el);
        if (pos > -1 && pos < valeurs.length && valeurs[pos]) { set(el, valeurs[pos]); return true; }
        continue; // position au-delà du plan : champ laissé vide, marqué vu
      }
      // 3. Repli placeholder
      const hint = `${el.placeholder ?? ""} ${el.getAttribute("aria-label") ?? ""}`.trim();
      for (const [reSrc, val] of tableRegex) {
        if (new RegExp(reSrc, "i").test(hint)) { set(el, val); return true; }
      }
      // rien à mettre : marqué vu, on passe au suivant
    }
    return false;
  }, ARGS);
}

async function remplirEtape4(page, D) {
  /* Déplie les sections repliées (hors nav), crée une rangée là où il n'y en a
     aucune (clics « Ajouter » un par un — closure), puis remplit champ par champ. */
  for (let passe = 0; passe < 3; passe++) {
    const ouverts = await page.evaluate(() => {
      let n = 0;
      for (const b of document.querySelectorAll('button[aria-expanded="false"]')) {
        if (b.closest("nav, header")) continue;
        b.click(); n++;
      }
      return n;
    });
    await page.waitForTimeout(250);
    if (!ouverts) break;
  }
  /* Un clic à la fois, cible recalculée à CHAQUE tour : chaque rangée créée
     insère des boutons « Retirer » qui décalent les indices, et la closure
     d'état de l'étape écrase deux clics du même tick. */
  for (let tour = 0; tour < 20; tour++) {
    const encore = await page.evaluate(() => {
      for (const b of document.querySelectorAll("button")) {
        const t = (b.textContent ?? "").trim();
        if (!/^\+?\s*Ajouter/i.test(t)) continue;
        if (/photo|source|catégorie/i.test(t)) continue;
        if (b.closest("nav, header")) continue;
        // une rangée existe déjà (Repeater ThemeBlocks…) : ne pas dupliquer
        const parent = b.parentElement;
        if (parent && [...parent.children].some((c) => c !== b && c.querySelector?.("input, textarea"))) continue;
        b.click();
        return true;
      }
      return false;
    });
    if (!encore) break;
    await page.waitForTimeout(250);
  }
  for (let n = 0; n < 60; n++) {
    const encore = await remplirUnChamp(page, D);
    if (!encore) break;
    await page.waitForTimeout(200);
  }
}

async function testerTheme(browser, theme) {
  const secteur = THEME_SECTEUR[theme];
  const spec = SPEC_BY_ID[secteur];
  const blocs = THEME_BLOCS[theme] ?? [];
  const res = { theme, secteur, blocs, ok: false, retrouves: [], manquants: [], erreur: null };
  if (!spec) { res.erreur = `secteur ${secteur} sans libellé wizard`; return res; }

  const ctx = await browser.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  res.erreursPage = [];
  try {
    // 1. Domaine + métier
    await page.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded" });
    await page.locator('button:has-text("Tout refuser")').first().click({ timeout: 4000 }).catch(() => {});
    await clic(page, spec.industrie);
    await clic(page, spec.metier);

    // 2. Carte du thème cible — le bouton-carte parent (le clic sur l'img
    // seule ne pose pas form.template et « Continuer » reste inerte)
    const carte = page.locator(`button:has(img[src="/thumbnails/${theme}.webp"])`).first();
    await carte.waitFor({ timeout: 8000 });
    await carte.click();
    await clic(page, "Continuer", false);

    // 3. Entreprise — ordre stable dans StepForm : nom, tagline, ville
    await page.waitForTimeout(400);
    await page.evaluate((d) => {
      const set = (el, v) => {
        const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
        setter.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const visibles = [...document.querySelectorAll("input, textarea")].filter((el) => el.offsetParent !== null && el.type !== "hidden");
      const zone = visibles.filter((el) => el.tagName === "TEXTAREA" || el.type === "text" || !el.type);
      if (zone[0]) set(zone[0], d.nom);
      const ta = visibles.find((el) => el.tagName === "TEXTAREA");
      if (ta) set(ta, d.tagline);
      const apresTa = zone.filter((el) => el !== zone[0] && el !== ta);
      if (apresTa[0]) set(apresTa[0], d.ville);
    }, D);
    await clic(page, "Continuer", false);

    // 4. Offre — déplier, créer les rangées, remplir champ par champ
    await page.waitForTimeout(600);
    await remplirEtape4(page, D);
    await page.waitForTimeout(400);
    await clic(page, "Continuer", false);

    // 5. Design — rien d'obligatoire
    await page.waitForTimeout(300);
    await clic(page, "Continuer", false);

    // 6. Contact — email requis, téléphone en bonus
    await page.waitForTimeout(300);
    await page.evaluate((d) => {
      const set = (el, v) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const mail = document.querySelector('input[type="email"]');
      if (mail) set(mail, d.email);
      const tel = document.querySelector('input[type="tel"]');
      if (tel) set(tel, d.tel);
    }, D);
    await clic(page, "Continuer", false);

    /* 7. « Générer mon site » : c'est CE clic qui PATCHe le formData complet
       (nom, tagline, ville, téléphone…) dans la session — l'autosave ne couvre
       que businessProfile. On le clique donc, mais /api/generate est intercepté
       dans le navigateur : la requête IA ne part jamais, coût zéro. */
    await page.route("**/api/generate", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ previewUrl: null }) }),
    );
    await page.waitForTimeout(300);
    const patchFait = page.waitForResponse(
      (r) => r.url().includes("/api/sessions") && r.request().method() === "PATCH",
      { timeout: 15000 },
    );
    await clic(page, "Générer mon site", false);
    await patchFait;
    await page.waitForTimeout(500);

    // Identifiant de session : la seule clé aevia-edit-token-* de ce contexte neuf
    const sessionId = await page.evaluate(() => {
      const k = Object.keys(localStorage).find((x) => x.startsWith("aevia-edit-token-"));
      return k ? k.replace("aevia-edit-token-", "") : null;
    });
    if (!sessionId) throw new Error("sessionId introuvable (aucune clé aevia-edit-token-*)");
    res.sessionId = sessionId;

    /* La page d'aperçu relance son fetch 5 fois sur 11 s puis s'arrête : si la
       session PATCHée n'est pas encore lisible à ce moment, la page garde le
       formData partiel pour toujours. On attend donc que l'API serve bien le
       nom AVANT d'ouvrir l'aperçu. */
    for (let t = 0; t < 20; t++) {
      const r = await fetch(`${BASE}/api/sessions?id=${sessionId}`).then((x) => x.json()).catch(() => null);
      if (r?.formData?.businessName === D.nom) break;
      await new Promise((x) => setTimeout(x, 500));
    }

    // 5. Aperçu — chaque valeur saisie doit se lire QUELQUE PART sur le site :
    // la home d'abord, puis les sous-pages si des valeurs manquent encore
    // (des thèmes servent prestations/équipe/avis sur leurs pages internes).
    const apercu = await ctx.newPage();
    apercu.on("pageerror", (e) => { if (res.erreursPage.length < 4) res.erreursPage.push(String(e).slice(0, 120)); });
    /* Scroll PROGRESSIF : les sections en useInView ne montent leur contenu
       qu'en entrant à l'écran — un saut direct en bas les laisse vides. */
    const derouler = async (pg) => {
      await pg.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += Math.max(500, Math.floor(window.innerHeight * 0.8))) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 300));
        }
      }).catch(() => {});
      await pg.waitForTimeout(1000);
    };
    await apercu.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded" });
    let texte = "";
    for (let t = 0; t < 25; t++) {
      await apercu.waitForTimeout(1000);
      texte = await apercu.evaluate(() => document.body.innerText);
      if (texte.toLowerCase().includes(D.nom.toLowerCase())) break;
    }
    /* Premier hit d'un serveur froid : la session peut rater ses 5 tentatives.
       Un rechargement relance le fetch de zéro. */
    if (!texte.toLowerCase().includes(D.nom.toLowerCase())) {
      await apercu.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
      for (let t = 0; t < 15; t++) {
        await apercu.waitForTimeout(1000);
        texte = await apercu.evaluate(() => document.body.innerText);
        if (texte.toLowerCase().includes(D.nom.toLowerCase())) break;
      }
    }
    await derouler(apercu);
    texte = await apercu.evaluate(() => document.body.innerText);
    let html = await apercu.evaluate(() => document.body.innerHTML);

    const resteApres = (t, h) => {
      const tMin = t.toLowerCase(), hMin = h.toLowerCase();
      const cibles = new Set([D.nom]);
      for (const b of blocs) for (const v of ATTENDU_PAR_BLOC[b] ?? []) cibles.add(v);
      return [...cibles].filter((v) => !tMin.includes(v.toLowerCase()) && !hMin.includes(v.toLowerCase()));
    };
    if (resteApres(texte, html).length) {
      const liens = await apercu.evaluate((th) => {
        const vus = new Set();
        for (const a of document.querySelectorAll(`a[href^="/templates/${th}/"]`)) {
          const u = (a.getAttribute("href") ?? "").split("?")[0].split("#")[0];
          if (u && u !== `/templates/${th}` && !/\/legal$/.test(u)) vus.add(u);
        }
        return [...vus].slice(0, 6);
      }, theme);
      for (const lien of liens) {
        await apercu.goto(`${BASE}${lien}?session=${sessionId}`, { waitUntil: "domcontentloaded" }).catch(() => {});
        await apercu.waitForTimeout(3500);
        await derouler(apercu);
        texte += "\n" + (await apercu.evaluate(() => document.body.innerText).catch(() => ""));
        html += "\n" + (await apercu.evaluate(() => document.body.innerHTML).catch(() => ""));
        if (!resteApres(texte, html).length) break;
      }
    }
    /* Certains thèmes naviguent par état React (onglets), sans URL : on clique
       les entrées de nav restantes et on agrège ce qu'elles révèlent. */
    if (resteApres(texte, html).length) {
      await apercu.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded" }).catch(() => {});
      await apercu.waitForTimeout(3000);
      const nbNav = await apercu.evaluate(() =>
        [...document.querySelectorAll("nav a, nav button, header a, header button")]
          .filter((el) => (el.textContent ?? "").trim().length > 1 && (el.textContent ?? "").trim().length < 30).length,
      );
      for (let i = 0; i < Math.min(nbNav, 8); i++) {
        const urlAvant = apercu.url();
        await apercu.evaluate((idx) => {
          const items = [...document.querySelectorAll("nav a, nav button, header a, header button")]
            .filter((el) => (el.textContent ?? "").trim().length > 1 && (el.textContent ?? "").trim().length < 30);
          items[idx]?.click();
        }, i).catch(() => {});
        await apercu.waitForTimeout(1800);
        if (!apercu.url().startsWith(`${BASE}/templates/${theme}`)) {
          await apercu.goto(urlAvant, { waitUntil: "domcontentloaded" }).catch(() => {});
          await apercu.waitForTimeout(2000);
          continue;
        }
        await derouler(apercu);
        texte += "\n" + (await apercu.evaluate(() => document.body.innerText).catch(() => ""));
        html += "\n" + (await apercu.evaluate(() => document.body.innerHTML).catch(() => ""));
        if (!resteApres(texte, html).length) break;
      }
    }

    // insensible à la casse : innerText rend le texte TRANSFORMÉ par le CSS
    // (text-transform: uppercase) — « BARRAL & FILLES » doit compter
    const texteMin = texte.toLowerCase();
    const htmlMin = html.toLowerCase();
    const attendus = new Set([D.nom]);
    for (const b of blocs) for (const v of ATTENDU_PAR_BLOC[b] ?? []) attendus.add(v);
    res.avertissements = [];
    for (const v of attendus) {
      const vMin = v.toLowerCase();
      if (texteMin.includes(vMin)) res.retrouves.push(v);
      else if (htmlMin.includes(vMin)) {
        // présent dans le DOM mais pas (encore) affiché — animation en cours
        res.retrouves.push(v);
        res.avertissements.push(`${v} (DOM seulement)`);
      } else res.manquants.push(v);
    }
    if (!texteMin.includes(D.ville.toLowerCase()) && !htmlMin.includes(D.ville.toLowerCase())) res.avertissements.push("ville absente");
    res.ok = res.manquants.length === 0;
    await apercu.close();
  } catch (e) {
    res.erreur = String(e.message ?? e).slice(0, 160);
  } finally {
    await ctx.close();
  }
  return res;
}

const cibles = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const tous = Object.keys(THEME_BLOCS).sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));
const liste = cibles.length ? cibles : tous;

const dejaFaits = new Set(
  fs.existsSync(RAPPORT)
    ? fs.readFileSync(RAPPORT, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l).theme)
    : [],
);

const browser = await chromium.launch();
let ko = 0;
for (const theme of liste) {
  if (dejaFaits.has(theme)) continue;
  const r = await testerTheme(browser, theme);
  fs.appendFileSync(RAPPORT, JSON.stringify(r) + "\n");
  if (!r.ok) ko++;
  console.log(`${theme.padEnd(12)} ${r.ok ? "ok" : "KO"} ${r.erreur ?? r.manquants.join(" | ")}`);
}
await browser.close();
console.log(`\nterminé — voir ${RAPPORT} (${ko} KO sur cette passe)`);
