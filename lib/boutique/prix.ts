/**
 * Le prix d'un produit de boutique, en centimes.
 *
 * Une seule implémentation, volontairement. Elle vivait dans
 * `app/api/boutique/checkout/route.ts` et le panier en avait besoin AUSSI,
 * pour savoir s'il peut proposer un bouton Acheter et pour afficher un total.
 * Deux copies auraient divergé au premier format de prix exotique, et c'est le
 * serveur qui décide : un prix que lui refuse doit être un produit que le
 * panier n'accepte pas, sinon le client met un article au panier et se fait
 * refuser au paiement.
 *
 * `null` = pas un prix ferme (« sur devis », « à partir de 50 € », vide). Ces
 * produits restent AFFICHÉS — ils ne sont simplement pas achetables en ligne.
 */
export function prixEnCents(brut: string | undefined): number | null {
  if (!brut) return null;
  const nettoye = brut.replace(/[€$\s]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(nettoye)) return null;
  return Math.round(parseFloat(nettoye) * 100);
}

/** Produit de boutique tel que la session le stocke (lib/sessions.ts). */
export interface ProduitBoutique {
  name: string;
  price?: string;
  description?: string;
  photoUrl?: string;
  stock?: number;
  paymentLink?: string;
}

/**
 * Achetable en ligne ? Trois conditions, dans l'ordre où elles coûtent cher :
 * un prix ferme, du stock quand le marchand en déclare, et pas de lien de
 * paiement externe (dans ce cas le bouton ouvre SON lien, pas notre panier).
 */
export function achetableEnLigne(p: ProduitBoutique): boolean {
  if (p.paymentLink) return false;
  if (prixEnCents(p.price) === null) return false;
  if (typeof p.stock === "number" && p.stock <= 0) return false;
  return true;
}

/** Ligne de panier : exactement ce que POST /api/boutique/checkout attend. */
export interface LignePanier {
  produitIndex: number;
  quantite: number;
}

export const MAX_LIGNES = 50;
export const MAX_QUANTITE = 99;

/**
 * Total d'affichage, en centimes. Les prix viennent du catalogue, jamais du
 * panier — le panier ne transporte que des index et des quantités. C'est la
 * même règle que côté serveur, et c'est ce qui rend un rejeu sans effet.
 */
export function totalEnCents(lignes: readonly LignePanier[], produits: readonly ProduitBoutique[]): number {
  return lignes.reduce((somme, l) => {
    const cents = prixEnCents(produits[l.produitIndex]?.price);
    return cents === null ? somme : somme + cents * l.quantite;
  }, 0);
}

export function formaterCents(cents: number, devise = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: devise }).format(cents / 100);
}
