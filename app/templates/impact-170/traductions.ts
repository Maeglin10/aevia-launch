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
    "// new contactrequest({": "// new DemandeDeContact({",
    "// open_source_contributions[]": "// contributions_logiciel_libre[]",
    "rafael.moreau — lead engineer & open-source contributor": "rafael.moreau — ingénieur principal, contributeur au logiciel libre",
  },
  es: {
    "// new contactrequest({": "// new SolicitudDeContacto({",
    "// open_source_contributions[]": "// contribuciones_codigo_abierto[]",
    "rafael.moreau — lead engineer & open-source contributor": "rafael.moreau — ingeniero jefe y colaborador de código abierto",
  },
  de: {
    "// new contactrequest({": "// new Kontaktanfrage({",
    "// open_source_contributions[]": "// open_source_beitraege[]",
    "rafael.moreau — lead engineer & open-source contributor": "rafael.moreau — leitender Entwickler und Open-Source-Beitragender",
  },
  pt: {
    "// new contactrequest({": "// new PedidoDeContacto({",
    "// open_source_contributions[]": "// contribuicoes_codigo_aberto[]",
    "rafael.moreau — lead engineer & open-source contributor": "rafael.moreau — engenheiro principal e contribuidor de código aberto",
  },
};
