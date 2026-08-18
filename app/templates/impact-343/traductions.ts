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
    "c'est exactement le but.": "C'est exactement le but.",
    "on s'occupe du reste.": "on s'occupe du reste.",
  },
  es: {
    "c'est exactement le but.": "Es exactamente el objetivo.",
    "on s'occupe du reste.": "nos ocupamos del resto.",
  },
  de: {
    "c'est exactement le but.": "Das ist genau das Ziel.",
    "on s'occupe du reste.": "wir kümmern uns um den Rest.",
  },
  pt: {
    "c'est exactement le but.": "É exatamente esse o objetivo.",
    "on s'occupe du reste.": "nós tratamos do resto.",
  },
};
