/*
  Le code de parrainage du visiteur, retenu de son arrivée jusqu'à son paiement.

  Le vendeur partage un lien — « launch.aevia.services/?ref=DAVID » — et le
  visiteur clique, regarde les thèmes, revient le lendemain, remplit le
  formulaire, paye. Entre le clic et le paiement il y a des dizaines de
  navigations : le paramètre disparaît à la première.

  On le retient donc dès qu'on le voit, et on le rend au moment du paiement.
  C'est le seul endroit qui compte : le code ne change pas le prix, il dit qui a
  amené ce client, et c'est le moteur de commissions d'Inbox qui en tirera les
  conséquences quand Stripe confirmera l'encaissement.

  PREMIER VU, PREMIER SERVI
  -------------------------
  Un code déjà retenu n'est jamais remplacé. La réattribution rétroactive est la
  première source de litige entre vendeurs : un deuxième lien cliqué la veille de
  l'achat ne doit pas effacer celui qui a réellement amené la personne. Inbox
  applique la même règle côté serveur, où elle est opposable.

  `localStorage` plutôt que `sessionStorage` : le parcours s'étale sur
  plusieurs jours, et un onglet fermé ne doit pas effacer l'attribution.
*/

const CLE = "aevia-parrainage";

/**
 * Normalisé comme Inbox le stocke : majuscules, lettres et chiffres.
 *
 * Un code dicté au téléphone arrive en minuscules, avec un espace de trop,
 * parfois avec un tiret. Vingt-quatre caractères au plus : au-delà, ce n'est
 * plus un code.
 */
export function normaliserCodeParrainage(brut: string | null | undefined): string {
  if (typeof brut !== "string") return "";
  return brut.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 24);
}

/** Retient le `?ref=` de l'adresse courante, s'il y en a un et qu'aucun n'est déjà retenu. */
export function retenirLeParrainage(): void {
  if (typeof window === "undefined") return;
  try {
    const vu = normaliserCodeParrainage(new URLSearchParams(window.location.search).get("ref"));
    if (!vu) return;
    if (window.localStorage.getItem(CLE)) return; // premier vu, premier servi
    window.localStorage.setItem(CLE, vu);
  } catch {
    /* Navigation privée, stockage refusé : le parrainage se perd, la vente non. */
  }
}

/** Le code retenu, ou une chaîne vide. */
export function codeParrainageRetenu(): string {
  if (typeof window === "undefined") return "";
  try {
    return normaliserCodeParrainage(window.localStorage.getItem(CLE));
  } catch {
    return "";
  }
}
