/**
 * Les libellés que le client ne peut pas changer lui-même.
 *
 * 73 thèmes sur 373 portent une démonstration en anglais. Le contenu, lui, est
 * remplacé par celui du client — mais pas la navigation, ni les boutons, ni les
 * titres de section : « About », « Book Now », « Our Team » restent en anglais
 * sur le site d'une entreprise française, et le wizard ne les demande nulle
 * part. C'est le genre de détail qui fait dire à un prospect que le site n'a
 * pas été fait pour lui.
 *
 * La langue vient de `formData.locale`, celle dans laquelle le client a rempli
 * le wizard. Sans locale connue, on rend le texte du thème inchangé : traduire
 * au hasard serait pire.
 */

type Dict = Record<string, string>;

const FR: Dict = {
  home: "Accueil",
  about: "À propos",
  "about us": "À propos",
  "our story": "Notre histoire",
  services: "Prestations",
  "our services": "Nos prestations",
  pricing: "Tarifs",
  prices: "Tarifs",
  team: "Équipe",
  "our team": "Notre équipe",
  testimonials: "Avis",
  reviews: "Avis",
  gallery: "Galerie",
  contact: "Contact",
  "contact us": "Nous contacter",
  "get in touch": "Nous écrire",
  "book now": "Réserver",
  book: "Réserver",
  "get started": "Commencer",
  "learn more": "En savoir plus",
  "read more": "Lire la suite",
  "view all": "Tout voir",
  "see more": "Voir plus",
  discover: "Découvrir",
  explore: "Explorer",
  "request a quote": "Demander un devis",
  "free quote": "Devis gratuit",
  "get a quote": "Demander un devis",
  "call us": "Nous appeler",
  "email us": "Nous écrire",
  "follow us": "Nous suivre",
  "opening hours": "Horaires",
  "our work": "Réalisations",
  "why us": "Pourquoi nous",
  "why choose us": "Pourquoi nous choisir",
  send: "Envoyer",
  submit: "Envoyer",
  subscribe: "S'inscrire",
  newsletter: "Newsletter",
  "privacy policy": "Confidentialité",
  terms: "Conditions",
  menu: "Menu",
  blog: "Blog",
  faq: "FAQ",
};

const ES: Dict = {
  home: "Inicio",
  about: "Sobre nosotros",
  "about us": "Sobre nosotros",
  "our story": "Nuestra historia",
  services: "Servicios",
  "our services": "Nuestros servicios",
  pricing: "Tarifas",
  prices: "Tarifas",
  team: "Equipo",
  "our team": "Nuestro equipo",
  testimonials: "Opiniones",
  reviews: "Opiniones",
  gallery: "Galería",
  contact: "Contacto",
  "contact us": "Contáctanos",
  "get in touch": "Escríbenos",
  "book now": "Reservar",
  book: "Reservar",
  "get started": "Empezar",
  "learn more": "Saber más",
  "read more": "Leer más",
  "view all": "Ver todo",
  "see more": "Ver más",
  discover: "Descubrir",
  explore: "Explorar",
  "request a quote": "Pedir presupuesto",
  "free quote": "Presupuesto gratis",
  "get a quote": "Pedir presupuesto",
  "call us": "Llámanos",
  "email us": "Escríbenos",
  "follow us": "Síguenos",
  "opening hours": "Horario",
  "our work": "Trabajos",
  "why us": "Por qué nosotros",
  "why choose us": "Por qué elegirnos",
  send: "Enviar",
  submit: "Enviar",
  subscribe: "Suscribirse",
  newsletter: "Boletín",
  "privacy policy": "Privacidad",
  terms: "Condiciones",
  menu: "Carta",
  blog: "Blog",
  faq: "Preguntas frecuentes",
};

const DICTS: Record<string, Dict> = { fr: FR, es: ES };

/** Conserve la casse du thème : NOS PRESTATIONS reste en capitales. */
function matchCase(source: string, translated: string): string {
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return translated.toUpperCase();
  }
  if (source[0] === source[0]?.toUpperCase()) {
    return translated[0].toUpperCase() + translated.slice(1);
  }
  return translated.toLowerCase();
}

/**
 * Traduit un libellé d'interface dans la langue du client.
 * Rend le texte inchangé si la langue est inconnue ou le mot absent du lexique.
 */
export function tr(session: { formData?: { locale?: string } } | null | undefined, label: string): string {
  const locale = session?.formData?.locale;
  if (!locale) return label;
  const dict = DICTS[locale];
  if (!dict) return label;
  const hit = dict[label.trim().toLowerCase()];
  return hit ? matchCase(label.trim(), hit) : label;
}
