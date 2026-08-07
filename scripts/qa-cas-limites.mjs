// Ce qu'un vrai client apporte : une photo verticale, un nom à rallonge.
//
//   node scripts/qa-cas-limites.mjs --tranche 0 4 [--cas nom-long]
//
// Les mesures précédentes utilisaient une entreprise commode : nom court,
// photos au bon format, trois prestations bien rangées. La production n'est pas
// commode. Un client téléverse la photo verticale prise avec son téléphone,
// s'appelle « Établissements Vidal-Marquisats & Fils Réunis », saisit douze
// prestations ou une seule.
//
// On rejoue donc chaque thème avec ces cas-là, et l'on regarde ce qui casse :
// une page qui déborde, un texte qui sort de l'écran, une photo écrasée.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/*
  Des images réelles, aux formats que les clients envoient vraiment : le
  portrait du téléphone tenu droit, le panoramique d'une devanture, et une
  vignette de mauvaise définition tirée d'un vieux site.
*/
const PHOTOS = {
  verticale: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop",
  panoramique: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1600&h=500&fit=crop",
  minuscule: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=180&h=180&fit=crop",
};

const CAS = {
  "nom-long": {
    formData: {
      businessName: "Établissements Vidal-Marquisats & Fils Réunis depuis 1912",
      tagline: "Plomberie, chauffage, climatisation, énergies renouvelables et dépannage d'urgence dans toute la Haute-Savoie, sept jours sur sept, depuis plus d'un siècle",
      city: "Saint-Jorioz-sur-le-Lac",
    },
  },
  "photo-verticale": {
    formData: { photoUrls: [PHOTOS.verticale, PHOTOS.verticale, PHOTOS.verticale, PHOTOS.verticale] },
  },
  "photo-panoramique": {
    formData: { photoUrls: [PHOTOS.panoramique, PHOTOS.panoramique, PHOTOS.panoramique] },
  },
  "photo-minuscule": {
    formData: { photoUrls: [PHOTOS.minuscule, PHOTOS.minuscule, PHOTOS.minuscule] },
  },
  "beaucoup-de-prestations": {
    profil: {
      services: Array.from({ length: 12 }, (_, i) => ({
        name: `Prestation numéro ${i + 1} au libellé délibérément long`,
        description: "Une description qui prend de la place, comme en écrivent les clients qui veulent tout dire.",
        price: `${90 + i * 15} €`,
      })),
    },
  },
  "une-seule-prestation": {
    profil: { services: [{ name: "Dépannage", description: "Vingt-quatre heures sur vingt-quatre.", price: "90 €" }] },
  },

  /*
    Ce qui arrive vraiment en production, et qu'aucun formulaire n'empêche.
  */

  // Une adresse de photo morte : le client a supprimé le fichier, ou le lien a expiré.
  "photo-cassee": {
    formData: { photoUrls: ["https://images.pexels.com/photos/00000000/inexistante.jpeg", "https://exemple.invalide/photo.jpg"] },
  },

  // Il n'en a téléversé aucune. Le thème doit rester présentable.
  "aucune-photo": { formData: { photoUrls: [] } },

  /*
    Un prix qui n'est pas un nombre. « Sur devis » est la réponse la plus
    courante des artisans, et elle casse tout calcul.
  */
  "prix-en-toutes-lettres": {
    profil: {
      services: [
        { name: "Rénovation complète", description: "Chaque chantier est différent.", price: "Sur devis" },
        { name: "Diagnostic", description: "Sans engagement.", price: "Gratuit" },
        { name: "Dépannage", description: "Déplacement compris.", price: "à partir de 90 €" },
      ],
    },
  },

  /*
    Une apostrophe dans le nom de ville, une esperluette et un accent dans celui
    de l'entreprise : c'est le quotidien français, et c'est ce qui casse les
    chaînes mal échappées.
  */
  "apostrophes-et-accents": {
    formData: {
      businessName: "L'Atelier d'Élise & Frères",
      city: "L'Isle-sur-la-Sorgue",
      tagline: "L'eau, l'air, l'énergie — depuis 1987 « au service des Provençaux »",
    },
  },

  // Un nom de deux lettres : les thèmes qui coupent le titre en lignes n'ont plus rien à couper.
  "nom-minuscule": {
    formData: { businessName: "Bo", tagline: "Vite.", city: "Ay" },
  },

  // Une description de prestation qui fait un paragraphe entier.
  "description-fleuve": {
    profil: {
      services: [{
        name: "Installation de pompe à chaleur",
        description: "Nous étudions d'abord votre logement, son isolation, son exposition et vos habitudes de chauffe, puis nous dimensionnons la machine au plus juste — une pompe surdimensionnée coûte plus cher à l'achat et s'use plus vite, une pompe trop petite tire sur la résistance électrique tout l'hiver. L'étude est comprise dans le devis et vous reste acquise même si vous ne signez pas.",
        price: "Sur devis",
      }],
    },
  },

  // Aucun avis : le carrousel de témoignages doit tenir sans rien.
  "aucun-avis": { profil: { reputation: { featuredReviews: [] } } },

  // Un seul avis là où le thème en fait défiler quatre.
  "un-seul-avis": {
    profil: { reputation: { featuredReviews: [{ author: "Perrine A.", text: "Rapide et propre.", rating: 5 }] } },
  },

  // Une couleur de marque très claire : le texte blanc posé dessus disparaît.
  "couleur-tres-claire": { formData: { brandColor: "#f5e663" } },

  // Le client pressé : il n'a rempli que son nom.
  "presque-rien": {
    formData: { businessName: "Vidal", tagline: "", city: "", phone: "", email: "", photoUrls: [] },
    profil: { services: [], reputation: { featuredReviews: [] }, keyStats: [], team: [] },
  },

  /*
    Une photographie presque noire, puis une presque blanche. Le texte posé
    dessus a été pensé pour l'image du thème, pas pour celle-là : dans un sens
    il s'efface, dans l'autre il éblouit.
  */
  "photo-tres-sombre": {
    formData: { photoUrls: Array(4).fill("https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg?auto=compress&cs=tinysrgb&w=1400") },
  },
  "photo-tres-claire": {
    formData: { photoUrls: Array(4).fill("https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1400") },
  },

  // Le client qui remplit tout, jusqu'au dernier champ.
  "tout-au-maximum": {
    formData: {
      businessName: "Ateliers Vidal & Fils",
      tagline: "Plomberie, chauffage et énergies renouvelables à Annecy depuis 1998",
      photoUrls: Array(8).fill("https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    },
    profil: {
      services: Array.from({ length: 8 }, (_, i) => ({ name: `Prestation ${i + 1}`, description: "Description courte et nette.", price: `${90 + i * 20} €` })),
      reputation: { featuredReviews: Array.from({ length: 6 }, (_, i) => ({ author: `Client ${i + 1}`, text: "Travail soigné, délais tenus, prix conforme au devis.", rating: 5 })) },
      keyStats: Array.from({ length: 4 }, (_, i) => ({ value: `${100 * (i + 1)}+`, label: `Indicateur ${i + 1}` })),
      team: Array.from({ length: 4 }, (_, i) => ({ name: `Éloi Vidal ${i + 1}`, role: "Maître plombier" })),
      certifications: ["Qualibat", "RGE", "Qualigaz", "Assurance décennale"],
      faq: Array.from({ length: 5 }, (_, i) => ({ q: `Question numéro ${i + 1} ?`, a: "Une réponse claire et complète." })),
      geo: { address: "12 rue des Marquisats", primaryCity: "Annecy", serviceAreas: ["Annecy", "Seynod", "Cran-Gevrier", "Épagny"] },
    },
  },

  /*
    Un commerce fermé toute la semaine : c'est le cas d'un artisan qui n'ouvre
    que sur rendez-vous, et le tableau des horaires doit rester lisible.
  */
  "toujours-ferme": {
    profil: {
      openingHours: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
        .map((day) => ({ day, closed: true })),
    },
  },

  // Une accroche criée, sans ponctuation : les thèmes qui mettent déjà en capitales doublent l'effet.
  "accroche-en-capitales": {
    formData: { tagline: "PLOMBERIE CHAUFFAGE CLIMATISATION URGENCE 24H SUR 24 DANS TOUTE LA HAUTE-SAVOIE" },
  },
};

const args = process.argv.slice(2);
const casVoulu = args.includes("--cas") ? args[args.indexOf("--cas") + 1] : null;
const casTestes = casVoulu ? [casVoulu] : Object.keys(CAS);

let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const fiches = [];

for (const nomCas of casTestes) {
  const cas = CAS[nomCas];
  for (const ecran of [{ nom: "téléphone", w: 390, h: 844, mobile: true }, { nom: "ordinateur", w: 1440, h: 900, mobile: false }]) {
    const ctx = await b.newContext({ viewport: { width: ecran.w, height: ecran.h }, isMobile: ecran.mobile, hasTouch: ecran.mobile });

    for (const id of ids) {
      const formData = {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy depuis 1998",
        email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33",
        brandColor: "#c2410c", template: id,
        photoUrls: [PHOTOS.verticale],
        ...(cas.formData ?? {}),
      };
      const profil = {
        services: [{ name: "Détartrage Vidal", description: "En moins d'une heure.", price: "90 €" }],
        ...(cas.profil ?? {}),
      };

      let fiche = { id, cas: nomCas, ecran: ecran.nom, soucis: [] };
      try {
        const r = await fetch(`${BASE}/api/sessions`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ formData }),
        });
        const { sessionId } = await r.json();
        await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
          method: "PATCH", headers: { "content-type": "application/json" },
          body: JSON.stringify({ businessProfile: profil }),
        });

        const p = await ctx.newPage();
        await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
        await p.waitForTimeout(2600);

        fiche = await p.evaluate(({ identifiant, nom, nomEcran, largeur }) => {
          const soucis = [];

          const deborde = document.documentElement.scrollWidth - largeur;
          if (deborde > 16) soucis.push(`la page déborde de ${deborde} px`);

          for (const e of document.querySelectorAll("*")) {
            if (e.children.length > 0) continue;
            const t = (e.textContent ?? "").trim();
            if (t.length < 3) continue;
            const s = getComputedStyle(e);
            if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
            const r = e.getBoundingClientRect();
            if (r.width < 8 || r.height < 6 || r.top > 2400) continue;

            if (r.right > largeur + 20 && r.left < largeur) {
              let contenu = false;
              let n = e.parentElement;
              for (let i = 0; i < 5 && n && !contenu; i++) {
                const sn = getComputedStyle(n);
                if (sn.overflow !== "visible" || sn.overflowX !== "visible") contenu = true;
                n = n.parentElement;
              }
              if (!contenu) soucis.push(`« ${t.slice(0, 20)} » sort de ${Math.round(r.right - largeur)} px`);
            }
          }

          /*
            Une photographie écrasée : le rapport entre sa largeur affichée et sa
            hauteur s'écarte trop de celui du fichier. C'est ce qui arrive quand
            un thème taillé pour du paysage reçoit un portrait.
          */
          for (const img of document.querySelectorAll("img")) {
            const r = img.getBoundingClientRect();
            if (r.width < 60 || r.height < 60) continue;
            const nat = img.naturalWidth / Math.max(1, img.naturalHeight);
            const vu = r.width / r.height;
            if (!img.naturalWidth) continue;
            const s = getComputedStyle(img);
            if (s.objectFit === "cover" || s.objectFit === "contain") continue;
            if (Math.abs(nat - vu) / Math.max(nat, vu) > 0.35) {
              soucis.push(`photo déformée (${nat.toFixed(2)} → ${vu.toFixed(2)})`);
            }
          }

          return { id: identifiant, cas: nom, ecran: nomEcran, soucis: [...new Set(soucis)].slice(0, 3) };
        }, { identifiant: id, nom: nomCas, nomEcran: ecran.nom, largeur: ecran.w });

        await p.close();
      } catch (e) {
        fiche = { id, cas: nomCas, ecran: ecran.nom, soucis: [], erreur: String(e.message).slice(0, 40) };
      }

      fiches.push(fiche);
      if (fiche.soucis.length) console.log(`${id.padEnd(12)} ${nomCas.padEnd(22)} ${ecran.nom.padEnd(11)} ${fiche.soucis.join(" · ")}`);
    }
    await ctx.close();
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.soucis.length);
console.log(`\n${fiches.length} mesures · ${ko.length} en défaut`);
