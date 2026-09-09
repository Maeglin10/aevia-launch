/*
  Sommes-nous servis sur le domaine d'Aevia, ou sur celui d'un client ?

  La question se posait déjà dans le middleware (réécriture du domaine acheté)
  mais la liste y était enfermée. robots.txt et sitemap.xml en ont besoin eux
  aussi : servis tels quels sur le domaine d'un client, ils déclaraient
  launch.aevia.services comme hôte canonique et ne listaient que les pages
  d'Aevia. Autrement dit, le site que le client paie annonçait lui-même à
  Google qu'il est un miroir de notre catalogue, et ne lui soumettait aucune de
  ses propres pages — pendant qu'on lui vend du référencement.
*/

export const HOTES_PLATEFORME = new Set([
  'aevia-launch.vercel.app',
  'launch.aevia.services',
  'localhost',
]);

/** Retire le port, qui n'appartient jamais à un nom de domaine acheté. */
export function normaliserHote(hote: string | null | undefined): string {
  return (hote ?? '').toLowerCase().replace(/:\d+$/, '');
}

/** true quand l'hôte est un domaine d'Aevia (ou un aperçu Vercel). */
export function estHotePlateforme(hote: string | null | undefined): boolean {
  const h = normaliserHote(hote);
  if (!h) return true; // sans information, on reste sur le comportement d'Aevia
  return HOTES_PLATEFORME.has(h) || h.endsWith('.vercel.app');
}

/** L'origine à déclarer aux moteurs pour la requête en cours. */
export function origineDeLaRequete(hote: string | null | undefined): string {
  const h = normaliserHote(hote);
  if (!h || estHotePlateforme(h)) return 'https://launch.aevia.services';
  return `https://${h}`;
}
