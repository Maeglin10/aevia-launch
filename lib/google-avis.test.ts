import { describe, expect, it, vi, afterEach } from "vitest";
import { avisDuClient, avisGoogleActif } from "./google-avis";

/*
  L'API n'est pas ouverte : on ne peut pas l'appeler pour de vrai. On vérifie
  donc ce qui, le jour de l'approbation, décidera si les avis arrivent — la
  chaîne des trois appels, la traduction des étoiles, et le fait qu'un 403 se
  dise au lieu de passer pour un compte sans avis.
*/
const repondre = (corps: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => corps, text: async () => JSON.stringify(corps) }) as Response;

afterEach(() => vi.unstubAllGlobals());

describe("avisDuClient", () => {
  it("enchaîne comptes → fiches → avis et traduit les étoiles", async () => {
    const appels: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      appels.push(url);
      if (url.includes("accountmanagement")) return repondre({ accounts: [{ name: "accounts/1" }] });
      if (url.includes("businessinformation")) return repondre({ locations: [{ name: "locations/9" }] });
      return repondre({
        reviews: [
          { reviewer: { displayName: "Marie L." }, starRating: "FIVE", comment: "Toiture refaite en trois jours." },
          { reviewer: { displayName: "Paul V." }, starRating: "FOUR", comment: "Rapides et propres." },
        ],
      });
    }));

    const avis = await avisDuClient("jeton");
    expect(appels[2]).toContain("accounts/1/locations/9/reviews");
    expect(avis).toHaveLength(2);
    expect(avis[0]).toMatchObject({ author: "Marie L.", rating: 5, source: "Google" });
    expect(avis[1].rating).toBe(4);
  });

  it("coupe la traduction que Google colle après le texte d'origine", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) =>
      url.includes("accountmanagement") ? repondre({ accounts: [{ name: "accounts/1" }] })
      : url.includes("businessinformation") ? repondre({ locations: [{ name: "locations/9" }] })
      : repondre({ reviews: [{ reviewer: { displayName: "Ana" }, starRating: "FIVE",
          comment: "Trabajo impecable.\n(Translated by Google)\nImpeccable work." }] })));

    const avis = await avisDuClient("jeton");
    expect(avis[0].text).toBe("Trabajo impecable.");
  });

  it("écarte une note sans commentaire : rien à afficher sur un site", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) =>
      url.includes("accountmanagement") ? repondre({ accounts: [{ name: "accounts/1" }] })
      : url.includes("businessinformation") ? repondre({ locations: [{ name: "locations/9" }] })
      : repondre({ reviews: [{ reviewer: { displayName: "X" }, starRating: "FIVE" }] })));

    expect(await avisDuClient("jeton")).toEqual([]);
  });

  it("remonte le 403 d'avant l'approbation au lieu de rendre une liste vide", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => repondre({ error: "insufficient permissions" }, false, 403)));
    await expect(avisDuClient("jeton")).rejects.toThrow(/403/);
  });

  it("rend une liste vide quand le compte Google n'a aucune fiche", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) =>
      url.includes("accountmanagement") ? repondre({ accounts: [{ name: "accounts/1" }] })
      : repondre({ locations: [] })));
    expect(await avisDuClient("jeton")).toEqual([]);
  });
});

describe("avisGoogleActif", () => {
  it("reste éteint tant que le drapeau n'est pas posé", () => {
    delete process.env.GOOGLE_BUSINESS_REVIEWS;
    expect(avisGoogleActif()).toBe(false);
    process.env.GOOGLE_BUSINESS_REVIEWS = "1";
    expect(avisGoogleActif()).toBe(true);
    delete process.env.GOOGLE_BUSINESS_REVIEWS;
  });
});
