/**
 * Le catalogue RÉEL d'un marchand, dans la forme que les thèmes attendent.
 *
 * Le défaut que ce fichier corrige : les trois thèmes e-commerce appelaient
 * chacun un `generateProducts()` privé et affichaient six produits de
 * DÉMONSTRATION — « Premium Collection Item », « Modular Object 01 » — en
 * ignorant `formData.products`, c'est-à-dire ce que le marchand a saisi dans
 * l'assistant. On vendait donc un palier « E-Commerce » qui montrait le
 * catalogue de personne.
 *
 * La clé du câblage : **`id` vaut l'index dans `businessProfile.products`**.
 * Les thèmes passent déjà leur produit à `addToCart`, et le serveur de paiement
 * attend un `produitIndex`. En faisant coïncider les deux, l'index envoyé au
 * paiement est juste par construction — pas par une correspondance à maintenir
 * quelque part.
 *
 * `null` quand le marchand n'a saisi aucun produit : dans ce cas les thèmes
 * gardent leurs produits de démonstration, ce qui est la bonne chose pour une
 * page d'aperçu ou de démo. Un catalogue vide affiché tel quel donnerait une
 * boutique vide à un prospect venu voir à quoi ça ressemble.
 */
import { prixEnCents, type ProduitBoutique } from "./prix";

/** Champs communs à tous les thèmes. */
export interface ProduitAffiche {
  /** Index dans `businessProfile.products` — c'est AUSSI le `produitIndex` du paiement. */
  id: number;
  name: string;
  /** En unités (euros), comme les thèmes l'attendent. 0 si pas de prix ferme. */
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  ref: string;
  /** Certains thèmes de démonstration nomment ainsi leur catégorie courte. */
  cat?: string;
  /** Vrai si ce produit peut partir au paiement en ligne. */
  achetable: boolean;
  stock?: number;
  paymentLink?: string;
}

const IMAGE_REPLI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#f3f3f3"/></svg>',
  );

/**
 * Les produits du marchand, ou `null` s'il n'en a aucun.
 *
 * `category` : le modèle de session n'a pas de catégorie par produit. On en met
 * une seule, neutre, plutôt que d'inventer un classement — un filtre qui range
 * les articles dans de fausses familles est pire que pas de filtre.
 */
export function catalogueDuMarchand(
  produits: ProduitBoutique[] | undefined,
  options: { categorie?: string } = {},
): ProduitAffiche[] | null {
  const liste = (produits ?? []).filter((p) => p && typeof p.name === "string" && p.name.trim());
  if (liste.length === 0) return null;

  return liste.map((p, index) => {
    const cents = prixEnCents(p.price);
    return {
      id: index,
      name: p.name.trim(),
      // Les thèmes affichent un nombre. Un produit « sur devis » vaut 0 ici et
      // porte `achetable: false` : au thème de montrer « sur devis » plutôt
      // qu'un « 0 € » qui serait un mensonge sur le prix.
      price: cents === null ? 0 : cents / 100,
      image: p.photoUrl?.trim() || IMAGE_REPLI,
      description: p.description?.trim() || "",
      category: options.categorie ?? "Boutique",
      // Aucune note client n'existe dans le modèle. On n'en invente pas : les
      // thèmes qui affichent des étoiles doivent masquer le bloc quand c'est 0.
      rating: 0,
      ref: `P-${String(index + 1).padStart(2, "0")}`,
      cat: options.categorie ?? "Boutique",
      achetable: cents !== null && !p.paymentLink && !(typeof p.stock === "number" && p.stock <= 0),
      stock: p.stock,
      paymentLink: p.paymentLink,
    };
  });
}

/** La boutique accepte-t-elle réellement un paiement en ligne ? */
export function paiementEnLigneActif(stripeAccountId: string | undefined): boolean {
  return typeof stripeAccountId === "string" && stripeAccountId.trim().length > 0;
}

/**
 * Les produits de démonstration d'un thème, ramenés à la même forme.
 *
 * Sans ça, `catalogueDuMarchand(...) ?? generateProducts(...)` rend un type
 * UNION et TypeScript perd l'inférence sur les `.map((p, i) => …)` des thèmes —
 * les paramètres repassent en `any` implicite. Un seul type en sortie règle le
 * problème à la source plutôt qu'en annotant chaque rappel.
 *
 * Ils portent `achetable: false` : une démo ne se vend pas. C'est aussi ce qui
 * garantit qu'un aperçu ne peut pas créer un paiement.
 */
export function demoVersAffichage(
  demo: ReadonlyArray<Record<string, unknown>>,
): ProduitAffiche[] {
  return demo.map((p, index) => ({
    id: typeof p.id === "number" ? p.id : index,
    name: typeof p.name === "string" ? p.name : `Article ${index + 1}`,
    price: typeof p.price === "number" ? p.price : 0,
    image: typeof p.image === "string" ? p.image : IMAGE_REPLI,
    description:
      typeof p.description === "string" ? p.description : typeof p.desc === "string" ? p.desc : "",
    category: typeof p.category === "string" ? p.category : "Boutique",
    rating: typeof p.rating === "number" ? p.rating : 0,
    ref: typeof p.ref === "string" ? p.ref : `P-${String(index + 1).padStart(2, "0")}`,
    cat: typeof p.cat === "string" ? p.cat : undefined,
    achetable: false,
  }));
}
