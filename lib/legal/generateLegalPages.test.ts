import { describe, it, expect } from "vitest";
import { generateLegalPages } from "./generateLegalPages";
import type { FormData } from "@/lib/sessions";

const fd = {
  businessName: "Institut Test",
  email: "contact@institut-test.fr",
} as FormData;

describe("generateLegalPages", () => {
  it("includes all 4 legal fields verbatim when present", () => {
    const pages = generateLegalPages(fd, {
      legalForm: "SARL",
      siret: "123 456 789 00012",
      companyAddress: "10 Rue de la Paix, 75002 Paris",
      capitalSocial: "5 000 €",
    });

    expect(pages.mentionsLegales).toContain("SARL");
    expect(pages.mentionsLegales).toContain("123 456 789 00012");
    expect(pages.mentionsLegales).toContain("10 Rue de la Paix, 75002 Paris");
    expect(pages.mentionsLegales).toContain("5 000 €");
  });

  it("omits the capital social clause instead of rendering undefined when absent", () => {
    const pages = generateLegalPages(fd, {
      legalForm: "Auto-entrepreneur",
      siret: "123 456 789 00012",
      companyAddress: "10 Rue de la Paix, 75002 Paris",
      // no capitalSocial — common for auto-entreprise
    });

    expect(pages.mentionsLegales).not.toContain("undefined");
    expect(pages.mentionsLegales).not.toContain("Capital social");
  });

  it("returns all 4 documents", () => {
    const pages = generateLegalPages(fd, { legalForm: "SARL" });
    expect(pages.mentionsLegales).toBeTruthy();
    expect(pages.cgv).toBeTruthy();
    expect(pages.confidentialite).toBeTruthy();
    expect(pages.cgu).toBeTruthy();
  });

  it("never renders undefined even with no legal data at all", () => {
    const pages = generateLegalPages(fd, undefined);
    for (const doc of Object.values(pages)) {
      expect(doc).not.toContain("undefined");
    }
  });

  // ── Sector-aware CGV (legal archetypes) ──────────────────────────────────
  it("restaurant CGV: catering exemption + allergens, no 14-day withdrawal", () => {
    const { cgv } = generateLegalPages(fd, undefined, "restaurant");
    expect(cgv).toContain("Allergènes");
    expect(cgv).toContain("L.221-28");
    expect(cgv).not.toContain("quatorze (14) jours");
  });

  it("e-commerce CGV: 14-day withdrawal + delivery + legal guarantees", () => {
    const { cgv } = generateLegalPages(fd, undefined, "boutique_mode");
    expect(cgv).toContain("quatorze (14) jours");
    expect(cgv).toContain("Livraison");
    expect(cgv).toContain("L.217-3");
  });

  it("at-home trade CGV: quote + deposit + works withdrawal", () => {
    const { cgv } = generateLegalPages(fd, undefined, "plombier");
    expect(cgv).toContain("devis");
    expect(cgv).toContain("acompte");
    expect(cgv).toContain("hors établissement");
  });

  it("appointment service CGV: no-show deposit + no withdrawal", () => {
    const { cgv } = generateLegalPages(fd, undefined, "coiffeur");
    expect(cgv).toContain("acompte");
    expect(cgv).toContain("L.221-28");
    expect(cgv).not.toContain("quatorze (14) jours");
  });

  it("real-estate CGV: loi Hoguet + mandat", () => {
    const { cgv } = generateLegalPages(fd, undefined, "agent_immobilier");
    expect(cgv).toContain("Hoguet");
    expect(cgv).toContain("mandat");
  });

  it("every archetype CGV carries the médiateur mention and no undefined", () => {
    for (const niche of [
      "restaurant", "boutique_mode", "plombier", "coiffeur",
      "agent_immobilier", "hotel", "avocat", "photographe", "unknown_niche",
    ]) {
      const { cgv } = generateLegalPages(fd, undefined, niche);
      expect(cgv).toContain("médiateur de la consommation");
      expect(cgv).not.toContain("undefined");
      expect(cgv).toContain("Institut Test");
    }
  });
});
