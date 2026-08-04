// Which BusinessCore/Catalogues fields each niche archetype's wizard step
// asks for. Drives which fields render in Phase 2 of the funnel — see
// WIZARD_DESIGN.local.md § "12 archétypes (A-L)" for the full audit this
// table is derived from. Pilot = the 4 niches wired end-to-end first.
export type ArchetypeId =
  | "service_rdv" | "food" | "produits" | "portfolio_projets"
  | "expertise_b2b" | "immobilier" | "hotellerie" | "domicile";

export interface ArchetypeConfig {
  id: ArchetypeId;
  catalogueFields: Array<keyof import("@/lib/sessions").Catalogues>;
  coreFields: Array<keyof import("@/lib/sessions").BusinessCore>;
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeConfig> = {
  service_rdv: {
    id: "service_rdv",
    catalogueFields: ["services", "team", "beforeAfter"],
    coreFields: ["bookingSystem", "openingHours", "reputation", "certifications"],
  },
  food: {
    id: "food",
    catalogueFields: ["menu"],
    coreFields: ["openingHours", "bookingSystem", "reputation"],
  },
  produits: {
    id: "produits",
    catalogueFields: ["products", "commerce"],
    coreFields: ["reputation", "openingHours", "geo", "paymentMethods"],
  },
  immobilier: {
    id: "immobilier",
    catalogueFields: ["listings", "team"],
    coreFields: ["geo", "keyStats", "faq"],
  },
  /*
    Les quatre archétypes suivants étaient des ébauches — une seule liste de
    prestations, alors que leurs thèmes montrent un portfolio, une grille
    d'honoraires ou des zones d'intervention. Ils demandent maintenant ce que
    leurs sections affichent.
  */
  portfolio_projets: {
    id: "portfolio_projets",
    catalogueFields: ["services", "beforeAfter", "team"],
    coreFields: ["certifications", "geo", "keyStats", "reputation"],
  },
  expertise_b2b: {
    id: "expertise_b2b",
    catalogueFields: ["services", "team"],
    coreFields: ["keyStats", "faq", "certifications", "reputation", "openingHours"],
  },
  hotellerie: {
    id: "hotellerie",
    catalogueFields: ["services", "products"],
    coreFields: ["openingHours", "bookingSystem", "geo", "reputation", "paymentMethods"],
  },
  domicile: {
    id: "domicile",
    catalogueFields: ["services", "beforeAfter"],
    coreFields: ["geo", "faq", "emergency", "certifications", "openingHours", "reputation"],
  },
};

// Pilot niche id (sectors.ts) → archetype. Extend this map as more niches
// move from design to implementation.
/*
  Chaque niche mène à un archétype — il n'y a pas de wizard générique.

  Onze niches sur soixante-huit étaient reliées ; les cinquante-sept autres
  tombaient sur le formulaire commun, qui ne demande ni la carte d'un
  boulanger, ni les zones d'intervention d'un serrurier, ni le portfolio d'un
  architecte. Le client remplissait alors un questionnaire qui ne parlait pas de
  son métier, et son site gardait les sections du thème.
*/
export const NICHE_ARCHETYPE: Record<string, ArchetypeId> = {
  agent_immobilier: "immobilier",
  architecte: "portfolio_projets",
  assurance: "expertise_b2b",
  audioprothesiste: "service_rdv",
  auto_ecole: "service_rdv",
  avocat: "expertise_b2b",
  bijouterie: "produits",
  boulangerie: "food",
  boutique_mode: "produits",
  brasserie: "food",
  btp_construction: "portfolio_projets",
  cafe_bar: "food",
  caviste: "food",
  coach: "service_rdv",
  coiffeur: "service_rdv",
  commerce_bouche: "food",
  comptable: "expertise_b2b",
  controle_technique: "service_rdv",
  couture: "produits",
  couvreur: "portfolio_projets",
  creche: "service_rdv",
  cuisiniste: "portfolio_projets",
  decorateur_interieur: "portfolio_projets",
  demenageur: "domicile",
  dentiste: "service_rdv",
  ecole_musique: "service_rdv",
  electricien: "domicile",
  fleuriste: "produits",
  formation: "service_rdv",
  garage_auto: "service_rdv",
  gestion_patrimoine: "expertise_b2b",
  hotel: "hotellerie",
  infirmier: "service_rdv",
  institut_beaute: "service_rdv",
  kine: "service_rdv",
  laboratoire: "service_rdv",
  location_materiel: "produits",
  mariage: "portfolio_projets",
  medecin: "service_rdv",
  menage: "domicile",
  menuisier: "portfolio_projets",
  notaire: "expertise_b2b",
  opticien: "service_rdv",
  osteo: "service_rdv",
  paysagiste: "domicile",
  peintre: "portfolio_projets",
  pharmacie: "service_rdv",
  photographe: "portfolio_projets",
  pisciniste: "domicile",
  plombier: "domicile",
  podologue: "service_rdv",
  pompes_funebres: "domicile",
  pressing: "service_rdv",
  producteur: "food",
  recrutement: "expertise_b2b",
  restaurant: "food",
  restauration_rapide: "food",
  sage_femme: "service_rdv",
  salle_reception: "portfolio_projets",
  salle_sport: "service_rdv",
  securite: "expertise_b2b",
  serrurier: "domicile",
  studio_creatif: "portfolio_projets",
  tatoueur: "service_rdv",
  toiletteur: "service_rdv",
  veterinaire: "service_rdv",
  vitrier: "domicile",
  vtc: "domicile",
};

// Niches within the service_rdv archetype that get the santé extension
// (practitioner specialty/credentials fields + emergency contact) on top of
// the base ServiceRdvStep — see components/wizard/steps/ServiceRdvStep.tsx.
export const SANTE_NICHES = new Set(["medecin", "dentiste", "kine", "osteo"]);
