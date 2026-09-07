/*
  Les commandes d'une boutique, stockées comme les sessions : un JSON par
  commande dans Vercel Blob, sous le préfixe du site. Pas de base de données à
  provisionner — le jour où le volume l'exige, ce module est le seul à changer.
*/
import { put, list } from "@vercel/blob";

export interface LigneCommande {
  /** Index du produit dans businessProfile.products au moment de l'achat. */
  produitIndex: number;
  nom: string;
  /** Prix unitaire en centimes, tel que revalidé côté serveur. */
  prixCents: number;
  quantite: number;
}

export interface Commande {
  id: string;
  sessionId: string;
  lignes: LigneCommande[];
  totalCents: number;
  devise: string;
  /** Email de l'acheteur, collecté par Stripe Checkout. */
  emailAcheteur?: string;
  nomAcheteur?: string;
  adresseLivraison?: unknown;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  creeLe: string;
  statut: "payee" | "remboursee";
}

export async function enregistrerCommande(commande: Commande): Promise<void> {
  /* Suffixe aléatoire : le blob est public — un chemin prévisible rendrait
     noms et adresses d'acheteurs lisibles avec le seul lien d'aperçu. */
  await put(
    `orders/${commande.sessionId}/${commande.id}.json`,
    JSON.stringify(commande),
    { access: "public", addRandomSuffix: true, contentType: "application/json" },
  );
}

export async function listerCommandes(sessionId: string): Promise<Commande[]> {
  const { blobs } = await list({ prefix: `orders/${sessionId}/` });
  const resultats: Commande[] = [];
  for (const b of blobs) {
    try {
      const r = await fetch(b.url, { cache: "no-store" });
      if (r.ok) resultats.push((await r.json()) as Commande);
    } catch {
      /* une commande illisible ne doit pas cacher les autres */
    }
  }
  return resultats.sort((a, b) => (a.creeLe < b.creeLe ? 1 : -1));
}
