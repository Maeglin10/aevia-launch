import { describe, expect, it } from "vitest";
import { clientReviews } from "./clientContent";

/*
  Sans avis du client, la place des avis ne doit jamais être tenue par les
  personnages de démonstration du thème : sur le site d'un commerce réel, ce
  sont de faux avis nominatifs que ce commerce publie.
*/
describe("clientReviews sans avis du client", () => {
  it("tient la place sans nommer personne dès qu'il y a un client", () => {
    const r = clientReviews({ formData: { locale: "fr" } } as never);
    expect(r).toBeDefined();
    expect(r!.length).toBeGreaterThan(0);
    expect(r!.every((x) => x.author === "Avis à venir")).toBe(true);
    expect(r!.every((x) => x.rating === undefined)).toBe(true);
  });

  it("parle la langue du site", () => {
    expect(clientReviews({ formData: { locale: "de" } } as never)![0].author).toBe("Bewertung folgt");
    expect(clientReviews({ formData: { locale: "es" } } as never)![0].author).toBe("Opinión por llegar");
  });

  it("laisse la galerie publique montrer les avis du thème", () => {
    expect(clientReviews(undefined)).toBeUndefined();
    expect(clientReviews({} as never)).toBeUndefined();
  });

  it("rend les avis du client dès qu'il en a", () => {
    const r = clientReviews({
      formData: { locale: "fr" },
      businessProfile: { reputation: { featuredReviews: [
        { author: "Marie L.", text: "Toiture refaite en trois jours.", rating: 5, source: "Google" },
      ] } },
    } as never);
    expect(r).toHaveLength(1);
    expect(r![0].author).toBe("Marie L.");
  });

  it("écarte un témoignage généré nominatif sans source vérifiable", () => {
    const r = clientReviews({
      formData: { locale: "fr" },
      generatedContent: { testimonials: [
        { name: "J. Dubois", role: "Propriétaire à Annecy", text: "Excellent travail.", rating: 5 },
      ] },
    } as never);
    expect(r!.every((x) => x.author === "Avis à venir")).toBe(true);
  });
});
