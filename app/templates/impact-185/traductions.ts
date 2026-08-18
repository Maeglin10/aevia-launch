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
    "des clients.": "des clients.",
    "of grooming.": "de Toilettage.",
    "the art of grooming": "L'art du soin",
  },
  es: {
    "des clients.": "clientes.",
    "of grooming.": "de Aseo.",
    "the art of grooming": "El arte del cuidado",
  },
  de: {
    "des clients.": "Kunden.",
    "of grooming.": "von Grooming.",
    "the art of grooming": "Die Kunst der Pflege",
  },
  pt: {
    "des clients.": "clientes.",
    "of grooming.": "de Cuidado Pessoal.",
    "the art of grooming": "A arte do cuidado",
  },
};
