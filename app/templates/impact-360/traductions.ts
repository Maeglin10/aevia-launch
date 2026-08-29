/*
  La prose de démonstration de ce thème, dans les langues que nous proposons.

  Ces phrases sont écrites en dur dans le thème : elles ne viennent d'aucun
  champ du formulaire, et disparaissent dès que le client remplit le bloc
  correspondant. Les traduire est ce qui tient la page tant qu'il ne l'a pas
  fait — un site français ne montre pas de paragraphe anglais.

  Chargé par BrandColorVar avec ce thème et avec lui seul.
*/
export const TRADUCTIONS: Record<string, Record<string, string>> = {
  fr: {
    "dont on se souvient": "that we remember.",
    "on porte le reste.": "we carry the rest.",
  },
  es: {
    "dont on se souvient": "de lo que recordamos.",
    "on porte le reste.": "llevamos el resto.",
  },
  de: {
    "dont on se souvient": "an das wir uns erinnern.",
    "on porte le reste.": "wir tragen den Rest.",
  },
  pt: {
    "dont on se souvient": "do que nos lembramos.",
    "on porte le reste.": "levamos o resto.",
  },
};
