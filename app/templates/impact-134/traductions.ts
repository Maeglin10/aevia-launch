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
    "+1 200 avis clients": "+1 200 avis clients",
    "masque or": "Masque Or",
    "vegan & cruelty-free": "Vegan & cruelty-free",
  },
  es: {
    "+1 200 avis clients": "+1 200 opiniones de clientes",
    "masque or": "Mascarilla de Oro",
    "vegan & cruelty-free": "Vegano y libre de crueldad",
  },
  de: {
    "+1 200 avis clients": "+1 200 Kundenbewertungen",
    "masque or": "Goldmaske",
    "vegan & cruelty-free": "Vegan & tierversuchsfrei",
  },
  pt: {
    "+1 200 avis clients": "+1 200 avaliações de clientes",
    "masque or": "Máscara de Ouro",
    "vegan & cruelty-free": "Vegano e livre de crueldade",
  },
};
