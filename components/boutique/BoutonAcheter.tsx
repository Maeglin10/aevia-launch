"use client";

/**
 * Le bouton d'achat d'un produit.
 *
 * Il se tait dans trois cas, et c'est volontaire :
 *  - aucun fournisseur de panier monté → la boutique est une vitrine ;
 *  - le marchand a son propre lien de paiement → on ouvre SON lien, on ne
 *    s'interpose pas entre lui et son encaissement ;
 *  - pas de prix ferme, ou stock épuisé → on affiche l'état au lieu d'un
 *    bouton qui échouerait au paiement.
 *
 * Aucun style imposé : les thèmes ont chacun leur identité, le bouton reçoit
 * sa classe et ne décide de rien d'autre que du comportement.
 */

import { usePanier } from "./PanierProvider";
import { prixEnCents } from "@/lib/boutique/prix";

export function BoutonAcheter({
  produitIndex,
  className,
  libelle = "Ajouter au panier",
  children,
}: {
  produitIndex: number;
  className?: string;
  libelle?: string;
  children?: React.ReactNode;
}) {
  const panier = usePanier();
  if (!panier) return null;

  const produit = panier.produits[produitIndex];
  if (!produit) return null;

  if (produit.paymentLink) {
    return (
      <a
        href={produit.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children ?? "Acheter"}
      </a>
    );
  }

  const epuise = typeof produit.stock === "number" && produit.stock <= 0;
  if (epuise) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        Épuisé
      </button>
    );
  }

  // Un produit « sur devis » ou « à partir de » reste visible et n'est pas
  // achetable : on ne propose rien plutôt que de promettre un paiement qui
  // serait refusé côté serveur.
  if (prixEnCents(produit.price) === null) return null;

  return (
    <button
      type="button"
      className={className}
      onClick={() => panier.ajouter(produitIndex)}
      aria-label={`${libelle} : ${produit.name}`}
    >
      {children ?? libelle}
    </button>
  );
}
