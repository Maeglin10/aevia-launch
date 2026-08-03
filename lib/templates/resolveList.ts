// Single contract every template uses to read business data instead of
// mutating hardcoded const arrays by index. Returns the real array when the
// client provided one (non-empty), otherwise the template's own demo data —
// so untouched templates keep rendering exactly as before.
//
// Les deux tableaux n'ont pas la même forme, et c'est voulu : le thème passe
// soit sa propre projection de la donnée client, soit — pour les sections où
// les noms de champs coïncident — le tableau du contrat tel quel, dont la forme
// ne peut pas être celle de la démonstration. Contraindre les deux au même
// paramètre de type produisait 66 erreurs qui ne décrivaient aucun défaut : le
// rendu retombe sur le champ manquant, il ne casse pas.
export function resolveList<T>(real: readonly unknown[] | undefined, demo: T[]): T[] {
  return real && real.length > 0 ? (real as unknown as T[]) : demo;
}
