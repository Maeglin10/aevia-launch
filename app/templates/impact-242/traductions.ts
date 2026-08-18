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
    "+350 clients": "+350 clients",
    "nos clients.": "nos clients.",
  },
  es: {
    "+350 clients": "+350 clientes",
    "nos clients.": "nuestros clientes.",
  },
  de: {
    "+350 clients": "+350 Kunden",
    "nos clients.": "unsere Kunden.",
  },
  pt: {
    "+350 clients": "+350 clientes",
    "nos clients.": "os nossos clientes.",
  },
};
