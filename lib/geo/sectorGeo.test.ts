import { describe, it, expect } from "vitest";
import { sectorGeoFor, SECTOR_GEO } from "./sectorGeo";
import { buildLocalBusinessSchema, buildFaqSchemaForSession } from "../seo";
import type { SessionData } from "../sessions";

const base = (niche?: string): SessionData =>
  ({
    id: "s1",
    formData: { businessName: "Test", businessType: "restaurant" },
    generatedContent: { metaDescription: "d", services: [], testimonials: [] },
    businessProfile: niche ? { niche } : undefined,
  }) as unknown as SessionData;

describe("sectorGeo", () => {
  it("returns sector keywords + FAQ for a known niche", () => {
    const g = sectorGeoFor("restaurant");
    expect(g.keywords).toContain("réservation table");
    expect(g.faq.length).toBeGreaterThanOrEqual(2);
  });

  it("falls back gracefully for an unknown niche", () => {
    const g = sectorGeoFor("licorne_spatiale");
    expect(g.keywords).toEqual([]);
    expect(g.faq.length).toBeGreaterThan(0);
  });

  it("every niche entry has non-empty keywords and >=2 FAQ", () => {
    for (const [niche, g] of Object.entries(SECTOR_GEO)) {
      expect(g.keywords.length, niche).toBeGreaterThan(0);
      expect(g.faq.length, niche).toBeGreaterThanOrEqual(2);
      for (const f of g.faq) {
        expect(f.q, niche).toBeTruthy();
        expect(f.a, niche).toBeTruthy();
      }
    }
  });

  it("LocalBusiness schema gets sector keywords pre-loaded", () => {
    const schema = buildLocalBusinessSchema(base("coiffeur"));
    expect(String(schema.keywords)).toContain("salon de coiffure");
  });

  it("FAQPage falls back to the sector FAQ when the client has none", () => {
    const faq = buildFaqSchemaForSession(base("plombier"));
    expect(faq).not.toBeNull();
    expect(faq!["@type"]).toBe("FAQPage");
    expect(JSON.stringify(faq)).toContain("urgence");
  });

  it("client FAQ overrides the sector default", () => {
    const s = base("plombier");
    (s.businessProfile as { faq?: { q: string; a: string }[] }).faq = [
      { q: "Question client ?", a: "Réponse client." },
    ];
    const faq = buildFaqSchemaForSession(s);
    expect(JSON.stringify(faq)).toContain("Question client");
  });
});
