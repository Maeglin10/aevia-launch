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
    "— avis clients": "— Client avis",
    "on s'occupe du reste.": "Nous nous occupons du reste.",
  },
  es: {
    "— avis clients": "— Opiniones de clientes",
    "on s'occupe du reste.": "Nos ocupamos del resto.",
  },
  de: {
    "— avis clients": "— Kundenbewertungen",
    "on s'occupe du reste.": "Wir kümmern uns um den Rest.",
  },
  pt: {
    "— avis clients": "— Avaliações de clientes",
    "on s'occupe du reste.": "Nós cuidamos do resto.",
  },
};
