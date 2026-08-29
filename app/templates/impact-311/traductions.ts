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
    ", and the // endpoint is /api/sessions?id=": ", et le // point de terminaison est /api/sessions?id=",
    "satisfaction client": "Satisfaction client",
  },
  es: {
    ", and the // endpoint is /api/sessions?id=": ", y el // punto final es /api/sessions?id=",
    "satisfaction client": "Satisfacción del cliente",
  },
  de: {
    ", and the // endpoint is /api/sessions?id=": ", und der // Endpunkt ist /api/sessions?id=",
    "satisfaction client": "Kundenzufriedenheit",
  },
  pt: {
    ", and the // endpoint is /api/sessions?id=": ", e o // ponto final é /api/sessions?id=",
    "satisfaction client": "Satisfação do cliente",
  },
};
