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
    coreFields: ["reputation"],
  },
  immobilier: {
    id: "immobilier",
    catalogueFields: ["listings", "team"],
    coreFields: ["geo", "keyStats", "faq"],
  },
  // portfolio_projets, expertise_b2b, hotellerie, domicile:
  // same shape, filled when those niches move from design to implementation
  // (see WIZARD_DESIGN.local.md table — not pilot niches, stub only).
  portfolio_projets: { id: "portfolio_projets", catalogueFields: ["services"], coreFields: ["certifications", "geo"] },
  expertise_b2b:      { id: "expertise_b2b",      catalogueFields: ["services"], coreFields: ["keyStats", "faq"] },
  hotellerie:         { id: "hotellerie",         catalogueFields: ["services"], coreFields: ["openingHours", "bookingSystem"] },
  domicile:           { id: "domicile",           catalogueFields: ["services"], coreFields: ["geo", "faq"] },
};

// Pilot niche id (sectors.ts) → archetype. Extend this map as more niches
// move from design to implementation.
export const NICHE_ARCHETYPE: Record<string, ArchetypeId> = {
  institut_beaute: "service_rdv",
  coiffeur: "service_rdv",
  restaurant: "food",
  agent_immobilier: "immobilier",
  medecin: "service_rdv",
  dentiste: "service_rdv",
};
