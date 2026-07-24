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
});
