/*
  Une seule requête de session par page, partagée par tous les composants.

  Mesuré : neuf composants du catalogue (couleur de marque, images, analytics,
  identité légale, garde des certifications, boutique, éditeur, métadonnées…)
  plus la page du thème elle-même demandaient CHACUN la session, en parallèle,
  avec leur propre boucle de reprise. Sur un téléphone en 4G cela fait autant
  d'allers-retours concurrents qui retardent le premier rendu, et cela frôle
  le limiteur de l'API (30 requêtes/minute/IP) dès qu'un visiteur ouvre
  plusieurs pages.

  Ce module fait la requête une fois et rend la même promesse à tout le monde,
  avec les mêmes tentatives de reprise qu'avant (le stockage est cohérent à
  terme : une session tout juste créée peut n'être pas encore lisible).
*/

/* Volontairement souple : chaque composant lit les champs dont il a besoin,
   comme il le faisait avec sa propre requête. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Session = any | null;

const enCours = new Map<string, Promise<Session>>();
const resolues = new Map<string, Session>();

/** L'identifiant de session du site affiché (URL, puis mémoire de l'onglet). */
export function idSessionCourante(): string | null {
  if (typeof window === "undefined") return null;
  let id = new URLSearchParams(window.location.search).get("session");
  try {
    const cle = "apercu-session:" + window.location.pathname.split("/")[2];
    if (id) sessionStorage.setItem(cle, id);
    else id = sessionStorage.getItem(cle);
  } catch {
    /* stockage indisponible : on se contente de l'URL */
  }
  return id;
}

async function charger(id: string): Promise<Session> {
  for (const attente of [0, 500, 1500, 3000, 6000]) {
    if (attente) await new Promise((r) => setTimeout(r, attente));
    try {
      const r = await fetch(`/api/sessions?id=${encodeURIComponent(id)}`);
      if (!r.ok) continue;
      const donnees = (await r.json()) as Session;
      if (donnees) {
        resolues.set(id, donnees);
        return donnees;
      }
    } catch {
      /* on réessaie */
    }
  }
  return null;
}

/** La session du site, chargée au plus une fois par page. */
export function sessionPartagee(id?: string | null): Promise<Session> {
  const cle = id ?? idSessionCourante();
  if (!cle) return Promise.resolve(null);
  if (resolues.has(cle)) return Promise.resolve(resolues.get(cle) ?? null);
  let p = enCours.get(cle);
  if (!p) {
    p = charger(cle);
    enCours.set(cle, p);
  }
  return p;
}
