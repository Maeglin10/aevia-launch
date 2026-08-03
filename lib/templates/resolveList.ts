/**
 * Le tableau du client, complété champ par champ par celui du thème.
 *
 * Les thèmes ne se contentent pas d'afficher un titre et une description : leurs
 * lignes portent une icône, un identifiant, une couleur, une image. Beaucoup les
 * rendent directement — `const ActiveIcon = treatments[active].icon` suivi de
 * `<ActiveIcon />`. Rendre le tableau du client tel quel laissait donc `icon`
 * indéfini, et React levait l'erreur #130 : **la page d'un vrai client ne
 * s'affichait pas du tout**, remplacée par « This page couldn't load ».
 *
 * Une version précédente de ce fichier affirmait que « le rendu retombe sur le
 * champ manquant, il ne casse pas ». C'était faux. Le défaut ne se voyait que
 * dans le cas réel : sans profil client, le thème servait sa démonstration et
 * tout allait bien, ce qui est exactement le cas qu'on ne teste pas. 219 appels
 * dans 123 thèmes étaient concernés.
 *
 * D'où la fusion : la ligne de démonstration fournit les champs de présentation,
 * celle du client écrase tout ce qu'il a renseigné. Si le client a plus
 * d'entrées que la démonstration, on boucle sur cette dernière — mieux vaut
 * répéter une icône que n'en avoir aucune.
 */
const isPlainObject = (v: unknown): v is object =>
  typeof v === "object" && v !== null && !Array.isArray(v) && !("$$typeof" in (v as object));

export function resolveList<T>(real: readonly unknown[] | undefined, demo: T[]): T[] {
  if (!real || real.length === 0) return demo;
  if (demo.length === 0) return real as unknown as T[];
  return real.map((row, i) => {
    const base = demo[i % demo.length];
    /*
      La fusion ne vaut que pour des objets. Plusieurs sections sont des tableaux
      de chaînes — ENGAGEMENT, les certifications, les zones — et étaler une
      chaîne la transforme en objet indexé par caractère : « Décennale » devient
      { 0: "D", 1: "é", … }. Le premier correctif faisait exactement cela et a
      cassé plus de sections qu'il n'en réparait.
    */
    if (!isPlainObject(row) || !isPlainObject(base)) return row as T;
    return { ...base, ...row } as T;
  });
}
