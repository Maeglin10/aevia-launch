import { TEMPLATES_REGISTRY, type TemplateMetadata } from "./registry";
import { SOUS_SEUIL } from "./catalogueGate";
import { TEMPLATE_TIER, TIER_PRICE, type SiteTier } from "./templateTier";
import { TEMPLATE_PAGE_TYPE } from "./pageType";
import { SECTOR_TEMPLATES, SECTORS, TEMPLATE_CITY_LABELS } from "./sectors";

/**
 * Ce qu'il faut pour donner une page à chacun des 373 modèles.
 *
 * Pourquoi ce fichier existe : le catalogue décrit 373 modèles — nom, catégorie,
 * style, étiquettes, nombre de sections, palier tarifaire, métiers visés — et
 * aucune URL ne les présente. La galerie `/themes` est un composant client qui
 * affiche tout dans une grille : pour un moteur de recherche il n'y a qu'une
 * seule page, et « modèle de site pour dentiste » n'a rien à indexer. Mesuré le
 * 30/08/2026 : 73 pages uniques pour les quatre produits de la suite.
 *
 * Tout ce qui suit est dérivé de données déjà en dépôt. Rien n'est inventé, et
 * surtout rien n'est traduit à la volée : les descriptions de `registry.ts` sont
 * rédigées en anglais malgré leur place de « source française », et poser un
 * paragraphe anglais sur une page destinée au marché français serait pire que
 * de ne rien poser. La copie française est donc construite à partir des seules
 * données structurées — qui, elles, sont bien en français : les métiers, le
 * palier, le nombre de sections, la ville.
 */

/**
 * Modèles dont le dossier n'existe pas. La galerie les masque déjà
 * (`HIDDEN_IMPACT` dans app/themes/page.tsx) ; leur donner une page produirait
 * 5 liens vers du vide. À tenir en phase avec la galerie.
 */
const SANS_PAGE = new Set(["impact-202", "impact-203", "impact-204", "impact-205", "impact-206"]);

/**
 * Les modèles qui méritent une page indexable.
 *
 * La barrière qualité du catalogue (score < 40/100) sert ici de barrière
 * d'indexation, et pour la même raison : un modèle qu'on refuse de vendre est
 * un modèle qu'on ne veut pas voir remonter dans les résultats. Publier des
 * pages minces ou des démonstrations anglophones vendues à un métier français
 * abîme le domaine entier, pas seulement la page.
 */
export const MODELES_INDEXABLES: TemplateMetadata[] = TEMPLATES_REGISTRY.filter(
  (t) => !SANS_PAGE.has(t.id) && !(t.id in SOUS_SEUIL),
);

export function modeleParId(id: string): TemplateMetadata | undefined {
  return MODELES_INDEXABLES.find((t) => t.id === id);
}

/** Métiers auxquels un modèle est rattaché — l'inverse de SECTOR_TEMPLATES. */
const METIERS_PAR_MODELE: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [secteur, ids] of Object.entries(SECTOR_TEMPLATES)) {
    for (const id of ids) (map[id] ??= []).push(secteur);
  }
  return map;
})();

export interface MetierDuModele {
  id: string;
  /** Libellé du catalogue, parfois double : « Coiffeur / Barbier ». */
  label: string;
  /**
   * Le premier métier seul. Un titre qui annonce « modèle de site pour studio
   * créatif / audiovisuel » se lit mal et dilue la requête ; la liste du
   * catalogue, elle, continue d'afficher les deux — même arbitrage que
   * `libelleDuSecteur` dans sectors.ts.
   */
  labelCourt: string;
  emoji: string;
}

/**
 * Les métiers d'un modèle, en français, dans l'ordre du catalogue.
 *
 * C'est la donnée la plus utile de tout le fichier : « dentiste »,
 * « plombier », « boulangerie » sont ce que les gens tapent réellement, quand
 * « Luxury » ou « Editorial » ne sont que nos étiquettes internes.
 */
export function metiersDuModele(id: string, locale = "fr"): MetierDuModele[] {
  return (METIERS_PAR_MODELE[id] ?? [])
    .map((secteurId) => {
      const s = SECTORS.find((x) => x.id === secteurId);
      if (!s) return null;
      const label = (locale !== "fr" && s.labels?.[locale]) || s.label;
      return {
        id: s.id,
        label,
        labelCourt: label.split(" / ")[0].trim(),
        emoji: s.emoji,
      };
    })
    .filter((x): x is MetierDuModele => x !== null);
}

/** Catégories du registre, en français. Vingt valeurs, écrites à la main. */
const CATEGORIE_FR: Record<string, string> = {
  Tech: "tech",
  Luxury: "luxe",
  Editorial: "éditorial",
  Creative: "créatif",
  Minimal: "minimaliste",
  Free: "gratuit",
  Corporate: "entreprise",
  "E-Commerce": "boutique en ligne",
  Health: "santé",
  Hospitality: "hôtellerie",
  Services: "services",
  Education: "formation",
  Finance: "finance",
  "Food & Drink": "restauration",
  SaaS: "logiciel",
  "Real Estate": "immobilier",
  Sports: "sport",
  Automotive: "automobile",
  Beauty: "beauté",
  Events: "événementiel",
};

const STYLE_FR: Record<string, string> = {
  Dark: "sombre",
  Light: "clair",
  Vibrant: "coloré",
  Brutalist: "brutaliste",
};

const PALIER_FR: Record<SiteTier, string> = {
  landing: "Page unique",
  essentiel: "Essentiel",
  pro: "Pro",
  premium: "Premium",
};

export function categorieFr(c: string): string {
  return CATEGORIE_FR[c] ?? c.toLowerCase();
}
export function styleFr(s: string): string {
  return STYLE_FR[s] ?? s.toLowerCase();
}
export function palierFr(t: SiteTier): string {
  return PALIER_FR[t];
}

export interface FicheModele {
  id: string;
  nom: string;
  categorie: string;
  categorieFr: string;
  styleFr: string;
  tags: string[];
  palier: SiteTier;
  palierLabel: string;
  prix: number;
  /** Nombre de blocs visuels, lu du commentaire de templateTier (source unique). */
  sections?: number;
  multiPages: boolean;
  metiers: MetierDuModele[];
  villeDemo?: string;
  vignette: string;
  urlApercu: string;
  url: string;
}

const BASE = "https://launch.aevia.services";

export function ficheModele(t: TemplateMetadata, locale = "fr"): FicheModele {
  const palier = TEMPLATE_TIER[t.id] ?? "essentiel";
  return {
    id: t.id,
    nom: t.name,
    categorie: t.category,
    categorieFr: categorieFr(t.category),
    styleFr: styleFr(t.style),
    tags: t.tags,
    palier,
    palierLabel: palierFr(palier),
    prix: TIER_PRICE[palier],
    sections: t.sections,
    multiPages: TEMPLATE_PAGE_TYPE[t.id] === "fullsite",
    metiers: metiersDuModele(t.id, locale),
    villeDemo: TEMPLATE_CITY_LABELS[t.id],
    vignette: `/thumbnails/${t.id}.webp`,
    urlApercu: `/templates/${t.id}`,
    url: `${BASE}/themes/modele/${t.id}`,
  };
}

/**
 * Le titre de la page.
 *
 * Le métier passe avant la catégorie quand il existe : « modèle de site pour
 * dentiste » est une requête, « modèle de site santé » n'en est pas une.
 */
export function titreModele(f: FicheModele): string {
  const quoi = f.metiers[0]?.labelCourt ?? f.categorieFr;
  return `${f.nom} — modèle de site pour ${quoi.toLowerCase()}`;
}

/**
 * La description, construite des seules données mesurables du modèle.
 *
 * Deux modèles ne produisent jamais la même phrase : le nom, le métier, le
 * nombre de sections, le palier et le style diffèrent. C'est ce qui sépare une
 * page produit d'une page satellite.
 */
export function descriptionModele(f: FicheModele): string {
  const forme = f.multiPages ? "site multi-pages" : "site en page unique";
  const metier = f.metiers[0]?.labelCourt?.toLowerCase();
  const pour = metier ? ` pour ${metier}` : "";
  const blocs = f.sections ? `${f.sections} sections` : `gamme ${f.palierLabel.toLowerCase()}`;
  return `${f.nom} : ${forme}${pour}, ${blocs}, thème ${f.styleFr}. Livré en 2 h avec votre contenu, votre domaine, Search Console et Analytics. ${f.prix} € une fois, sans abonnement.`;
}
