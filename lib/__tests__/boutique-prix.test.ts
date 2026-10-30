import { describe, it, expect } from "vitest";
import { achetableEnLigne, formaterCents, prixEnCents, totalEnCents } from "../boutique/prix";
import type { ProduitBoutique } from "../boutique/prix";

describe("prix d'une boutique", () => {
  it("accepte les formats que les marchands saisissent vraiment", () => {
    expect(prixEnCents("89")).toBe(8900);
    expect(prixEnCents("89,90 €")).toBe(8990);
    expect(prixEnCents("1250.00")).toBe(125000);
    expect(prixEnCents(" 12,5 ")).toBe(1250);
  });

  it("refuse ce qui n'est PAS un prix ferme — c'est ce qui protège du refus au paiement", () => {
    // Le serveur refuse ces produits ; si le panier les acceptait, le client
    // mettrait l'article au panier et se ferait jeter au checkout.
    expect(prixEnCents("sur devis")).toBeNull();
    expect(prixEnCents("à partir de 50 €")).toBeNull();
    expect(prixEnCents("")).toBeNull();
    expect(prixEnCents(undefined)).toBeNull();
    expect(prixEnCents("89,999")).toBeNull();
  });

  const p = (o: Partial<ProduitBoutique> = {}): ProduitBoutique => ({ name: "Article", price: "10", ...o });

  it("achetable en ligne : prix ferme, stock si déclaré, pas de lien externe", () => {
    expect(achetableEnLigne(p())).toBe(true);
    expect(achetableEnLigne(p({ price: "sur devis" }))).toBe(false);
    expect(achetableEnLigne(p({ stock: 0 }))).toBe(false);
    expect(achetableEnLigne(p({ stock: 3 }))).toBe(true);
    // Un stock non déclaré n'est pas un stock nul : sans ça, tout marchand qui
    // ne gère pas d'inventaire verrait sa boutique entière passer « épuisé ».
    expect(achetableEnLigne(p({ stock: undefined }))).toBe(true);
    // Le marchand a déjà son encaissement : on n'interpose pas notre panier.
    expect(achetableEnLigne(p({ paymentLink: "https://paypal.me/x" }))).toBe(false);
  });

  it("le total se calcule sur le CATALOGUE, jamais sur le panier", () => {
    const produits = [p({ price: "10" }), p({ price: "2,50" }), p({ price: "sur devis" })];
    expect(totalEnCents([{ produitIndex: 0, quantite: 3 }], produits)).toBe(3000);
    expect(
      totalEnCents([{ produitIndex: 0, quantite: 1 }, { produitIndex: 1, quantite: 2 }], produits),
    ).toBe(1500);
    // Une ligne sans prix ferme ne fait pas exploser le total, elle ne compte pas.
    expect(totalEnCents([{ produitIndex: 2, quantite: 9 }], produits)).toBe(0);
    // Un index hors catalogue (localStorage bricolé) ne plante pas.
    expect(totalEnCents([{ produitIndex: 99, quantite: 1 }], produits)).toBe(0);
  });

  it("formatage lisible", () => {
    expect(formaterCents(8990).replace(/ | /g, " ")).toBe("89,90 €");
  });
});

import { catalogueDuMarchand, paiementEnLigneActif } from "../boutique/catalogue";

describe("catalogue réel du marchand", () => {
  it("null quand le marchand n'a rien saisi — les thèmes gardent leur démo", () => {
    // Un catalogue vide affiché tel quel donnerait une boutique vide à un
    // prospect venu voir à quoi ressemble le produit.
    expect(catalogueDuMarchand(undefined)).toBeNull();
    expect(catalogueDuMarchand([])).toBeNull();
    expect(catalogueDuMarchand([{ name: "   " }])).toBeNull();
  });

  it("l'`id` EST l'index du paiement — c'est ce qui rend l'envoi juste par construction", () => {
    const c = catalogueDuMarchand([
      { name: "Bougie", price: "19,90" },
      { name: "Savon", price: "8" },
      { name: "Coffret", price: "sur devis" },
    ])!;
    expect(c.map((p) => p.id)).toEqual([0, 1, 2]);
    expect(c.map((p) => p.name)).toEqual(["Bougie", "Savon", "Coffret"]);
  });

  it("prix converti en unités ; un produit sans prix ferme vaut 0 et n'est pas achetable", () => {
    const c = catalogueDuMarchand([{ name: "Bougie", price: "19,90" }, { name: "Coffret", price: "sur devis" }])!;
    expect(c[0]).toMatchObject({ price: 19.9, achetable: true });
    expect(c[1]).toMatchObject({ price: 0, achetable: false });
  });

  it("épuisé et lien de paiement externe ne sont pas achetables chez nous", () => {
    const c = catalogueDuMarchand([
      { name: "Rupture", price: "10", stock: 0 },
      { name: "Externe", price: "10", paymentLink: "https://paypal.me/x" },
      { name: "Sans inventaire", price: "10" },
    ])!;
    expect(c.map((p) => p.achetable)).toEqual([false, false, true]);
  });

  it("aucune note inventée, aucune fausse catégorie", () => {
    const c = catalogueDuMarchand([{ name: "Bougie", price: "10" }])!;
    expect(c[0].rating).toBe(0);
    expect(c[0].category).toBe("Boutique");
    expect(c[0].image).toContain("data:image/svg+xml");
  });

  it("le paiement en ligne n'est actif qu'avec un compte Stripe du marchand", () => {
    expect(paiementEnLigneActif(undefined)).toBe(false);
    expect(paiementEnLigneActif("  ")).toBe(false);
    expect(paiementEnLigneActif("acct_123")).toBe(true);
  });
});
