/*
  Une commande passée sur le site d'un client doit AB-SO-LU-MENT donner lieu
  à un paiement réel — ou à un refus explicite.

  Six thèmes livraient un tunnel entièrement simulé : formulaire de livraison,
  attente de 1,6 seconde, numéro de commande tiré au hasard, écran « Commande
  confirmée ». Aucun paiement, aucune commande enregistrée, aucun email : le
  visiteur croyait avoir acheté, le commerçant ne voyait jamais rien passer.

  Cette fonction remplace la simulation : elle ouvre le vrai paiement (Stripe
  Connect du marchand) quand la boutique est activée, sinon elle dit
  franchement que la commande en ligne n'est pas disponible.
*/

export type LignePanier = { produitIndex: number; quantite: number };

export type ResultatCommande =
  | { etat: "redirige" }
  | { etat: "indisponible"; message: string };

/** Identifiant de session du site en cours (URL puis mémoire de l'onglet). */
export function sessionDuSite(): string | null {
  if (typeof window === "undefined") return null;
  const parUrl = new URLSearchParams(window.location.search).get("session");
  if (parUrl) return parUrl;
  try {
    return sessionStorage.getItem("apercu-session:" + window.location.pathname.split("/")[2]);
  } catch {
    return null;
  }
}

export async function commanderReellement(lignes: LignePanier[]): Promise<ResultatCommande> {
  const sessionId = sessionDuSite();
  if (!sessionId || lignes.length === 0) {
    return {
      etat: "indisponible",
      message: "La commande en ligne n'est pas disponible sur ce site. Contactez-nous directement, nous prenons votre commande.",
    };
  }
  try {
    const r = await fetch("/api/boutique/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, lignes }),
    });
    const d = (await r.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (r.ok && d?.url) {
      window.location.href = d.url;
      return { etat: "redirige" };
    }
    return {
      etat: "indisponible",
      message:
        d?.error ??
        "Le paiement en ligne n'est pas encore activé sur cette boutique. Contactez-nous, nous finalisons votre commande.",
    };
  } catch {
    return {
      etat: "indisponible",
      message: "Le paiement n'a pas pu démarrer. Réessayez dans un instant, ou contactez-nous.",
    };
  }
}
