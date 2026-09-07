import { describe, expect, it } from "vitest";
import { prixEnCents } from "@/app/api/boutique/checkout/route";
import { hasherJeton, jetonEditionValide, aJetonEdition } from "@/lib/sessions";

describe("prixEnCents — le prix vient du catalogue, jamais du panier", () => {
  it("lit les formes usuelles", () => {
    expect(prixEnCents("89")).toBe(8900);
    expect(prixEnCents("89,90 €")).toBe(8990);
    expect(prixEnCents("1250.00")).toBe(125000);
    expect(prixEnCents("120 €")).toBe(12000);
  });
  it("refuse tout ce qui n'est pas un prix ferme", () => {
    expect(prixEnCents(undefined)).toBeNull();
    expect(prixEnCents("")).toBeNull();
    expect(prixEnCents("Sur devis")).toBeNull();
    expect(prixEnCents("89-120")).toBeNull();
    expect(prixEnCents("-5")).toBeNull();
    expect(prixEnCents("1e9")).toBeNull();
  });
});

describe("jeton d'édition — hash seul au repos", () => {
  const base = { id: "s1", formData: {}, createdAt: new Date() } as unknown as Parameters<typeof jetonEditionValide>[0];
  it("valide par hash", () => {
    const s = { ...base, editTokenHash: hasherJeton("secret") };
    expect(jetonEditionValide(s, "secret")).toBe(true);
    expect(jetonEditionValide(s, "faux")).toBe(false);
    expect(jetonEditionValide(s, null)).toBe(false);
  });
  it("accepte le clair hérité (sessions d'avant migration)", () => {
    const s = { ...base, editToken: "ancien" };
    expect(jetonEditionValide(s, "ancien")).toBe(true);
    expect(jetonEditionValide(s, "faux")).toBe(false);
  });
  it("le hash prime sur un clair résiduel", () => {
    const s = { ...base, editToken: "ancien", editTokenHash: hasherJeton("nouveau") };
    expect(jetonEditionValide(s, "nouveau")).toBe(true);
    expect(jetonEditionValide(s, "ancien")).toBe(false);
  });
  it("aJetonEdition reflète l'une ou l'autre forme", () => {
    expect(aJetonEdition(base)).toBe(false);
    expect(aJetonEdition({ ...base, editToken: "x" })).toBe(true);
    expect(aJetonEdition({ ...base, editTokenHash: "y" })).toBe(true);
  });
});
