/*
  Les avis Google du client, via l'API Business Profile.

  Le bouton « Connecter Google » de l'aperçu ne demandait qu'Analytics et Search
  Console. Les avis, eux, vivent derrière `business.manage` et l'API v4
  `mybusiness.googleapis.com` — qui n'est pas ouverte : il faut déposer une
  demande motivée auprès de Google, instruite sous quatorze jours. Tant qu'elle
  n'est pas accordée, le scope est refusé et l'API renvoie 403.

  Le code est donc écrit en entier et tenu par un drapeau. Le jour où l'accès
  arrive, on pose `GOOGLE_BUSINESS_REVIEWS=1` et le bouton existant demande le
  scope en plus ; rien d'autre à écrire.

  Trois appels, dans cet ordre imposé par Google :
    1. les comptes    — mybusinessaccountmanagement/v1/accounts
    2. les fiches     — mybusinessbusinessinformation/v1/{account}/locations
    3. les avis       — mybusiness/v4/{account}/{location}/reviews   (l'API fermée)

  Ce sont les données du client, obtenues avec son consentement : on peut les
  conserver. C'est ce qui distingue cette voie de l'API Places, dont le contenu
  ne peut pas être stocké au-delà de trente jours.
*/

export interface AvisGoogle {
  author: string;
  text: string;
  rating: number;
  source: string;
}

/** L'accès Business Profile est-il ouvert sur cette installation ? */
export function avisGoogleActif(): boolean {
  return process.env.GOOGLE_BUSINESS_REVIEWS === "1";
}

/** Le scope à demander en plus, quand l'accès est ouvert. */
export const SCOPE_AVIS = "https://www.googleapis.com/auth/business.manage";

/* Google note les étoiles en toutes lettres. */
const ETOILES: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

async function lire<T>(url: string, jeton: string): Promise<T> {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${jeton}` } });
  if (!r.ok) {
    const corps = (await r.text()).slice(0, 200);
    /*
      403 avant l'approbation, et c'est le cas normal tant que la demande est en
      instruction : on le dit tel quel plutôt que de laisser un échec muet.
    */
    throw new Error(`${r.status} ${corps}`);
  }
  return (await r.json()) as T;
}

/**
 * Les avis de la première fiche du compte connecté.
 *
 * Un artisan n'a qu'un établissement dans l'immense majorité des cas. Une
 * enseigne à plusieurs adresses demanderait un choix à l'écran — on ne le
 * devine pas ici, on prend la première et on laisse le client corriger.
 */
export async function avisDuClient(jeton: string, maximum = 20): Promise<AvisGoogle[]> {
  const comptes = await lire<{ accounts?: { name: string }[] }>(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    jeton,
  );
  const compte = comptes.accounts?.[0]?.name;
  if (!compte) return [];

  const fiches = await lire<{ locations?: { name: string }[] }>(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${compte}/locations?readMask=name&pageSize=1`,
    jeton,
  );
  const fiche = fiches.locations?.[0]?.name;
  if (!fiche) return [];

  /* L'API des avis est restée en v4 : elle attend `accounts/X/locations/Y`. */
  const bruts = await lire<{
    reviews?: {
      reviewer?: { displayName?: string };
      starRating?: string;
      comment?: string;
    }[];
  }>(
    `https://mybusiness.googleapis.com/v4/${compte}/${fiche}/reviews?pageSize=${maximum}`,
    jeton,
  );

  return (bruts.reviews ?? [])
    .map((a) => ({
      author: (a.reviewer?.displayName ?? "").trim(),
      /* Google colle parfois sa traduction après le texte d'origine. */
      text: (a.comment ?? "").split("\n(Translated by Google)")[0].trim(),
      rating: ETOILES[a.starRating ?? ""] ?? 0,
      source: "Google",
    }))
    /* Une note sans commentaire n'a rien à afficher sur un site. */
    .filter((a) => a.text && a.rating >= 1);
}
