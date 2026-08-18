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
    "> about": "> à propos",
    "> work": "> travail",
    "on-chain identity vault": "coffre-fort d'identité en chaîne",
    "red team ops dashboard": "tableau de bord des opérations de l'équipe rouge",
  },
  es: {
    "> about": "> acerca de",
    "> work": "> trabajo",
    "on-chain identity vault": "bóveda de identidad en cadena",
    "red team ops dashboard": "tablero de operaciones del equipo rojo",
  },
  de: {
    "> about": "> über",
    "> work": "> Arbeit",
    "on-chain identity vault": "Identitätsvault on-chain",
    "red team ops dashboard": "Dashboard für die Operationen des roten Teams",
  },
  pt: {
    "> about": "> sobre",
    "> work": "> trabalho",
    "on-chain identity vault": "cofre de identidade em cadeia",
    "red team ops dashboard": "painel de operações da equipe vermelha",
  },
};
