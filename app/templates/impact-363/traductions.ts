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
    "on corrige ensuite.": "on corrige ensuite.",
    "on mesure d'abord,": "On mesure d'abord,",
    "on vous attend": "On vous attend",
  },
  es: {
    "on corrige ensuite.": "lo corregimos después.",
    "on mesure d'abord,": "Primero medimos,",
    "on vous attend": "Te estamos esperando",
  },
  de: {
    "on corrige ensuite.": "wir korrigieren dann.",
    "on mesure d'abord,": "Zuerst messen wir,",
    "on vous attend": "Wir warten auf dich",
  },
  pt: {
    "on corrige ensuite.": "corrigimos depois.",
    "on mesure d'abord,": "Primeiro medimos,",
    "on vous attend": "Estamos à sua espera",
  },
};
