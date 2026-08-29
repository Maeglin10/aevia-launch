/*
  Le jeton d'édition d'une session vit côté client dans le localStorage du
  navigateur qui l'a créée (frappé au POST /api/sessions). Le créateur peut donc
  éditer sa session ; personne d'autre, même avec le lien d'aperçu, ne le peut.

  Une seule source pour lire/écrire le jeton + poser l'en-tête PATCH, afin que
  le wizard, l'autosave et l'éditeur d'aperçu l'envoient tous de la même façon.
*/
const storageKey = (id: string) => `aevia-edit-token-${id}`;

export function saveEditToken(id: string, token: string | undefined | null): void {
  if (typeof window === "undefined" || !id || !token) return;
  try {
    window.localStorage.setItem(storageKey(id), token);
  } catch {
    /* localStorage indisponible (mode privé strict) — l'édition retombera en 403,
       jamais une panne. */
  }
}

export function getEditToken(id: string): string | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    return window.localStorage.getItem(storageKey(id));
  } catch {
    return null;
  }
}

/** En-tête à fusionner dans un PATCH ; vide si aucun jeton connu (sessions anciennes). */
export function editTokenHeader(id: string): Record<string, string> {
  const token = getEditToken(id);
  return token ? { "x-edit-token": token } : {};
}
