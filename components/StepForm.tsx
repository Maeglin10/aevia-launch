"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Loader2, Check,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Sparkles, Hexagon, Minus,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/lib/LangContext";

const THEME_ICONS: Record<string, LucideIcon> = {
  landing: Rocket, saas: Zap, agency: Palette, vitrine: Building2,
  consultant: Target, portfolio: Briefcase, ecommerce: ShoppingBag, restaurant: UtensilsCrossed,
  hotel: BedDouble, healthcare: Stethoscope, realestate: Home, fitness: Dumbbell,
  event: CalendarDays, nonprofit: Heart, startup: Star, luxury: Gem,
  brutalist: Square, magazine: Newspaper, aurora: Sparkles, "3d-tech": Hexagon, "minimal-pro": Minus,
};

const THEME_LABELS: Record<string, string> = {
  landing: "Landing Page", saas: "SaaS Product", agency: "Creative Agency",
  vitrine: "Business Vitrine", consultant: "Consultant & Coach", portfolio: "Portfolio",
  ecommerce: "E-commerce Store", restaurant: "Restaurant & Food", hotel: "Hotel & B&B",
  healthcare: "Healthcare & Clinic", realestate: "Real Estate", fitness: "Fitness & Wellness",
  event: "Event & Conference", nonprofit: "Non-profit & NGO", startup: "Startup Launch",
  luxury: "Luxury & Couture", brutalist: "Brutalist Editorial", magazine: "Magazine & Editorial",
  aurora: "Aurora & Wellness", "3d-tech": "3D Tech & Web3", "minimal-pro": "Minimal Pro",
};

const BUSINESS_TYPES = [
  "Restaurant", "Agency", "Coach", "Consultant",
  "E-commerce", "Portfolio", "Artisan", "Healthcare", "Other",
];

const TONES = ["Professional", "Friendly", "Bold", "Luxurious"];

const TEMPLATES: Array<{ id: string; label: string; desc: string; icon: LucideIcon; category: string }> = [
  // Marketing
  { id: "landing", label: "Landing Page", desc: "High-conversion single page", icon: Rocket, category: "Marketing" },
  { id: "saas", label: "SaaS Product", desc: "Software product with features & pricing", icon: Zap, category: "Tech" },
  { id: "agency", label: "Creative Agency", desc: "Bold portfolio-first agency site", icon: Palette, category: "Agency" },
  // Business
  { id: "vitrine", label: "Business Vitrine", desc: "Professional multi-page presence", icon: Building2, category: "Business" },
  { id: "consultant", label: "Consultant / Coach", desc: "Authority-building personal brand", icon: Target, category: "Personal" },
  { id: "portfolio", label: "Portfolio", desc: "Work showcase for creatives & devs", icon: Briefcase, category: "Personal" },
  // Commerce
  { id: "ecommerce", label: "E-commerce Store", desc: "Full online store with cart", icon: ShoppingBag, category: "Commerce" },
  { id: "restaurant", label: "Restaurant / Food", desc: "Menu, reservations, ambiance", icon: UtensilsCrossed, category: "Hospitality" },
  { id: "hotel", label: "Hotel / B&B", desc: "Rooms, gallery, booking CTA", icon: BedDouble, category: "Hospitality" },
  // Services
  { id: "healthcare", label: "Healthcare / Clinic", desc: "Trust-first medical practice site", icon: Stethoscope, category: "Health" },
  { id: "realestate", label: "Real Estate", desc: "Property listings & agent profile", icon: Home, category: "Property" },
  { id: "fitness", label: "Fitness / Wellness", desc: "Classes, trainers, transformation", icon: Dumbbell, category: "Health" },
  // Events & Social
  { id: "event", label: "Event / Conference", desc: "Speakers, schedule, tickets", icon: CalendarDays, category: "Events" },
  { id: "nonprofit", label: "Non-profit / NGO", desc: "Mission-driven, donation-focused", icon: Heart, category: "Social" },
  { id: "startup", label: "Startup Launch", desc: "Pre-launch waitlist & social proof", icon: Star, category: "Tech" },
  // Premium
  { id: "luxury", label: "Luxury / Couture", desc: "Dark marble, gold accents, haute couture", icon: Gem, category: "Premium" },
  { id: "brutalist", label: "Brutalist Editorial", desc: "Bold, raw, massive typography", icon: Square, category: "Premium" },
  { id: "magazine", label: "Magazine / Editorial", desc: "Grid-based journalistic layout", icon: Newspaper, category: "Premium" },
  { id: "aurora", label: "Aurora / Wellness", desc: "Iridescent gradients, soft glow", icon: Sparkles, category: "Premium" },
  { id: "3d-tech", label: "3D Tech / Web3", desc: "Holographic grid, glitch effects", icon: Hexagon, category: "Premium" },
  { id: "minimal-pro", label: "Minimal Pro", desc: "Architecture-grade negative space", icon: Minus, category: "Premium" },
];

// Group templates by category, preserving insertion order
const TEMPLATE_CATEGORIES = TEMPLATES.reduce<{ category: string; templates: typeof TEMPLATES }[]>((acc, t) => {
  const existing = acc.find((g) => g.category === t.category);
  if (existing) {
    existing.templates.push(t);
  } else {
    acc.push({ category: t.category, templates: [t] });
  }
  return acc;
}, []);

const TOTAL_STEPS = 5;

// ─── i18n ────────────────────────────────────────────────────────────────────
// UI chrome translations. Template *labels* stay as product names; their
// descriptions, category names, business types, tones, field labels,
// placeholders, buttons and errors are translated.

type StepFormStrings = {
  templateSelected: string; change: string;
  s1Title: string; s2Title: string; s3Title: string; s4Title: string; s5Title: string;
  fBusinessName: string; fBusinessType: string; fWhatYouDo: string; fCity: string;
  fMainService: string; fBenefits: string; fPriceRange: string; fTargetAudience: string;
  fBrandColor: string; fTone: string; fTemplate: string;
  fLogo: string; fHero: string; fEmail: string; fPhone: string; fInstagram: string; fLinkedin: string;
  phBusinessName: string; phWhatYouDo: string; phCity: string; phMainService: string;
  phBenefit: string; required: string; optional: string;
  phPriceRange: string; phTargetAudience: string; phEmail: string; phPhone: string;
  phInstagram: string; phLinkedin: string;
  s4Subtitle: string; heroHint: string;
  errBusinessName: string; errBusinessType: string; errTagline: string;
  errMainService: string; errBenefit: string; errEmailRequired: string; errEmailInvalid: string;
  genericError: string;
  back: string; continue: string; generating: string; generate: string;
  categories: Record<string, string>;
  templateDescs: Record<string, string>;
  businessTypes: Record<string, string>;
  tones: Record<string, string>;
};

const STEPFORM_T: Record<string, StepFormStrings> = {
  fr: {
    templateSelected: "Template sélectionné", change: "Changer →",
    s1Title: "Votre entreprise", s2Title: "Votre offre", s3Title: "Style & ton", s4Title: "Photos & médias", s5Title: "Presque fini !",
    fBusinessName: "Nom de l'entreprise", fBusinessType: "Type d'activité", fWhatYouDo: "Ce que vous faites", fCity: "Ville",
    fMainService: "Service / produit principal", fBenefits: "3 avantages clés", fPriceRange: "Gamme de prix", fTargetAudience: "Public cible",
    fBrandColor: "Couleur de marque", fTone: "Ton de voix", fTemplate: "Template",
    fLogo: "Logo (PNG ou SVG)", fHero: "Image principale", fEmail: "Adresse e-mail", fPhone: "Téléphone", fInstagram: "Instagram", fLinkedin: "LinkedIn",
    phBusinessName: "Nexxa Studio", phWhatYouDo: "Nous concevons et créons des sites web pour les petites entreprises...", phCity: "Paris, France", phMainService: "Création de site web sur mesure",
    phBenefit: "Avantage", required: "(requis)", optional: "(optionnel)",
    phPriceRange: "À partir de 500 € / 29 € par mois", phTargetAudience: "Petites entreprises, indépendants...", phEmail: "vous@exemple.com", phPhone: "+33 6 00 00 00 00",
    phInstagram: "@votremarque", phLinkedin: "linkedin.com/in/votrenom",
    s4Subtitle: "Optionnel — vous pourrez les ajouter plus tard.", heroHint: "Ou nous utiliserons une image de stock professionnelle adaptée à votre activité.",
    errBusinessName: "Le nom de l'entreprise est requis", errBusinessType: "Choisissez un type d'activité", errTagline: "Dites-nous ce que vous faites",
    errMainService: "Votre service principal est requis", errBenefit: "Au moins un avantage est requis", errEmailRequired: "L'adresse e-mail est requise", errEmailInvalid: "Saisissez une adresse e-mail valide",
    genericError: "Une erreur est survenue. Veuillez réessayer.",
    back: "Retour", continue: "Continuer", generating: "Génération…", generate: "Générer mon site",
    categories: { Marketing: "Marketing", Tech: "Tech", Agency: "Agence", Business: "Entreprise", Personal: "Personnel", Commerce: "Commerce", Hospitality: "Hôtellerie", Health: "Santé", Property: "Immobilier", Events: "Événements", Social: "Social", Premium: "Premium" },
    templateDescs: {
      landing: "Page unique à forte conversion", saas: "Produit logiciel avec fonctionnalités et tarifs", agency: "Site d'agence axé portfolio",
      vitrine: "Présence professionnelle multi-pages", consultant: "Marque personnelle qui fait autorité", portfolio: "Vitrine de travaux pour créatifs et devs",
      ecommerce: "Boutique en ligne complète avec panier", restaurant: "Menu, réservations, ambiance", hotel: "Chambres, galerie, CTA de réservation",
      healthcare: "Site de cabinet médical axé confiance", realestate: "Annonces immobilières et profil d'agent", fitness: "Cours, coachs, transformation",
      event: "Intervenants, programme, billets", nonprofit: "Orienté mission, axé sur les dons", startup: "Liste d'attente avant lancement et preuve sociale",
      luxury: "Marbre sombre, touches dorées, haute couture", brutalist: "Typographie audacieuse, brute, massive", magazine: "Mise en page journalistique en grille",
      aurora: "Dégradés iridescents, lueur douce", "3d-tech": "Grille holographique, effets glitch", "minimal-pro": "Espace négatif digne de l'architecture",
    },
    businessTypes: { Restaurant: "Restaurant", Agency: "Agence", Coach: "Coach", Consultant: "Consultant", "E-commerce": "E-commerce", Portfolio: "Portfolio", Artisan: "Artisan", Healthcare: "Santé", Other: "Autre" },
    tones: { Professional: "Professionnel", Friendly: "Amical", Bold: "Audacieux", Luxurious: "Luxueux" },
  },
  en: {
    templateSelected: "Template selected", change: "Change →",
    s1Title: "Your business", s2Title: "Your offer", s3Title: "Style & tone", s4Title: "Photos & media", s5Title: "Almost there!",
    fBusinessName: "Business name", fBusinessType: "Type of business", fWhatYouDo: "What you do", fCity: "City",
    fMainService: "Main service / product", fBenefits: "3 key benefits", fPriceRange: "Price range", fTargetAudience: "Target audience",
    fBrandColor: "Brand colour", fTone: "Tone of voice", fTemplate: "Template",
    fLogo: "Logo (PNG or SVG)", fHero: "Hero image", fEmail: "Email address", fPhone: "Phone", fInstagram: "Instagram", fLinkedin: "LinkedIn",
    phBusinessName: "Nexxa Studio", phWhatYouDo: "We design and build websites for small businesses...", phCity: "Paris, France", phMainService: "Custom website design",
    phBenefit: "Benefit", required: "(required)", optional: "(optional)",
    phPriceRange: "From €500 / €29 per month", phTargetAudience: "Small business owners, freelancers...", phEmail: "you@example.com", phPhone: "+33 6 00 00 00 00",
    phInstagram: "@yourbrand", phLinkedin: "linkedin.com/in/yourname",
    s4Subtitle: "Optional — you can add these later.", heroHint: "Or we'll use a professional stock image matching your business.",
    errBusinessName: "Business name is required", errBusinessType: "Please pick a business type", errTagline: "Tell us what you do",
    errMainService: "Your main service is required", errBenefit: "At least one benefit is required", errEmailRequired: "Email address is required", errEmailInvalid: "Enter a valid email address",
    genericError: "Something went wrong. Please try again.",
    back: "Back", continue: "Continue", generating: "Generating…", generate: "Generate my site",
    categories: { Marketing: "Marketing", Tech: "Tech", Agency: "Agency", Business: "Business", Personal: "Personal", Commerce: "Commerce", Hospitality: "Hospitality", Health: "Health", Property: "Property", Events: "Events", Social: "Social", Premium: "Premium" },
    templateDescs: {
      landing: "High-conversion single page", saas: "Software product with features & pricing", agency: "Bold portfolio-first agency site",
      vitrine: "Professional multi-page presence", consultant: "Authority-building personal brand", portfolio: "Work showcase for creatives & devs",
      ecommerce: "Full online store with cart", restaurant: "Menu, reservations, ambiance", hotel: "Rooms, gallery, booking CTA",
      healthcare: "Trust-first medical practice site", realestate: "Property listings & agent profile", fitness: "Classes, trainers, transformation",
      event: "Speakers, schedule, tickets", nonprofit: "Mission-driven, donation-focused", startup: "Pre-launch waitlist & social proof",
      luxury: "Dark marble, gold accents, haute couture", brutalist: "Bold, raw, massive typography", magazine: "Grid-based journalistic layout",
      aurora: "Iridescent gradients, soft glow", "3d-tech": "Holographic grid, glitch effects", "minimal-pro": "Architecture-grade negative space",
    },
    businessTypes: { Restaurant: "Restaurant", Agency: "Agency", Coach: "Coach", Consultant: "Consultant", "E-commerce": "E-commerce", Portfolio: "Portfolio", Artisan: "Artisan", Healthcare: "Healthcare", Other: "Other" },
    tones: { Professional: "Professional", Friendly: "Friendly", Bold: "Bold", Luxurious: "Luxurious" },
  },
  es: {
    templateSelected: "Plantilla seleccionada", change: "Cambiar →",
    s1Title: "Tu negocio", s2Title: "Tu oferta", s3Title: "Estilo y tono", s4Title: "Fotos y medios", s5Title: "¡Casi listo!",
    fBusinessName: "Nombre del negocio", fBusinessType: "Tipo de negocio", fWhatYouDo: "Qué haces", fCity: "Ciudad",
    fMainService: "Servicio / producto principal", fBenefits: "3 beneficios clave", fPriceRange: "Rango de precios", fTargetAudience: "Público objetivo",
    fBrandColor: "Color de marca", fTone: "Tono de voz", fTemplate: "Plantilla",
    fLogo: "Logo (PNG o SVG)", fHero: "Imagen principal", fEmail: "Correo electrónico", fPhone: "Teléfono", fInstagram: "Instagram", fLinkedin: "LinkedIn",
    phBusinessName: "Nexxa Studio", phWhatYouDo: "Diseñamos y creamos sitios web para pequeñas empresas...", phCity: "Madrid, España", phMainService: "Diseño de sitio web personalizado",
    phBenefit: "Beneficio", required: "(obligatorio)", optional: "(opcional)",
    phPriceRange: "Desde 500 € / 29 € al mes", phTargetAudience: "Pequeñas empresas, autónomos...", phEmail: "tu@ejemplo.com", phPhone: "+34 600 00 00 00",
    phInstagram: "@tumarca", phLinkedin: "linkedin.com/in/tunombre",
    s4Subtitle: "Opcional — puedes añadirlos más tarde.", heroHint: "O usaremos una imagen de stock profesional acorde a tu negocio.",
    errBusinessName: "El nombre del negocio es obligatorio", errBusinessType: "Elige un tipo de negocio", errTagline: "Cuéntanos qué haces",
    errMainService: "Tu servicio principal es obligatorio", errBenefit: "Se requiere al menos un beneficio", errEmailRequired: "El correo electrónico es obligatorio", errEmailInvalid: "Introduce un correo electrónico válido",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    back: "Atrás", continue: "Continuar", generating: "Generando…", generate: "Generar mi sitio",
    categories: { Marketing: "Marketing", Tech: "Tecnología", Agency: "Agencia", Business: "Negocio", Personal: "Personal", Commerce: "Comercio", Hospitality: "Hostelería", Health: "Salud", Property: "Inmobiliaria", Events: "Eventos", Social: "Social", Premium: "Premium" },
    templateDescs: {
      landing: "Página única de alta conversión", saas: "Producto de software con funciones y precios", agency: "Sitio de agencia centrado en portafolio",
      vitrine: "Presencia profesional multipágina", consultant: "Marca personal que genera autoridad", portfolio: "Vitrina de trabajos para creativos y devs",
      ecommerce: "Tienda online completa con carrito", restaurant: "Menú, reservas, ambiente", hotel: "Habitaciones, galería, CTA de reserva",
      healthcare: "Sitio de consulta médica centrado en la confianza", realestate: "Listados de propiedades y perfil de agente", fitness: "Clases, entrenadores, transformación",
      event: "Ponentes, programa, entradas", nonprofit: "Orientado a la misión, enfocado en donaciones", startup: "Lista de espera previa al lanzamiento y prueba social",
      luxury: "Mármol oscuro, detalles dorados, alta costura", brutalist: "Tipografía audaz, cruda, masiva", magazine: "Diseño periodístico en cuadrícula",
      aurora: "Degradados iridiscentes, brillo suave", "3d-tech": "Cuadrícula holográfica, efectos glitch", "minimal-pro": "Espacio negativo digno de la arquitectura",
    },
    businessTypes: { Restaurant: "Restaurante", Agency: "Agencia", Coach: "Coach", Consultant: "Consultor", "E-commerce": "E-commerce", Portfolio: "Portafolio", Artisan: "Artesano", Healthcare: "Salud", Other: "Otro" },
    tones: { Professional: "Profesional", Friendly: "Cercano", Bold: "Atrevido", Luxurious: "Lujoso" },
  },
  de: {
    templateSelected: "Vorlage ausgewählt", change: "Ändern →",
    s1Title: "Ihr Unternehmen", s2Title: "Ihr Angebot", s3Title: "Stil & Ton", s4Title: "Fotos & Medien", s5Title: "Fast geschafft!",
    fBusinessName: "Firmenname", fBusinessType: "Art des Unternehmens", fWhatYouDo: "Was Sie tun", fCity: "Stadt",
    fMainService: "Hauptdienst / -produkt", fBenefits: "3 wichtigste Vorteile", fPriceRange: "Preisspanne", fTargetAudience: "Zielgruppe",
    fBrandColor: "Markenfarbe", fTone: "Tonfall", fTemplate: "Vorlage",
    fLogo: "Logo (PNG oder SVG)", fHero: "Hauptbild", fEmail: "E-Mail-Adresse", fPhone: "Telefon", fInstagram: "Instagram", fLinkedin: "LinkedIn",
    phBusinessName: "Nexxa Studio", phWhatYouDo: "Wir gestalten und erstellen Websites für kleine Unternehmen...", phCity: "Berlin, Deutschland", phMainService: "Individuelles Website-Design",
    phBenefit: "Vorteil", required: "(erforderlich)", optional: "(optional)",
    phPriceRange: "Ab 500 € / 29 € pro Monat", phTargetAudience: "Kleinunternehmer, Freelancer...", phEmail: "sie@beispiel.com", phPhone: "+49 151 00000000",
    phInstagram: "@ihremarke", phLinkedin: "linkedin.com/in/ihrname",
    s4Subtitle: "Optional — Sie können diese später hinzufügen.", heroHint: "Oder wir verwenden ein professionelles Stockbild passend zu Ihrem Unternehmen.",
    errBusinessName: "Firmenname ist erforderlich", errBusinessType: "Bitte wählen Sie eine Unternehmensart", errTagline: "Sagen Sie uns, was Sie tun",
    errMainService: "Ihr Hauptdienst ist erforderlich", errBenefit: "Mindestens ein Vorteil ist erforderlich", errEmailRequired: "E-Mail-Adresse ist erforderlich", errEmailInvalid: "Geben Sie eine gültige E-Mail-Adresse ein",
    genericError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    back: "Zurück", continue: "Weiter", generating: "Wird generiert…", generate: "Meine Website generieren",
    categories: { Marketing: "Marketing", Tech: "Tech", Agency: "Agentur", Business: "Business", Personal: "Persönlich", Commerce: "Handel", Hospitality: "Gastgewerbe", Health: "Gesundheit", Property: "Immobilien", Events: "Events", Social: "Sozial", Premium: "Premium" },
    templateDescs: {
      landing: "Einzelseite mit hoher Konversion", saas: "Softwareprodukt mit Funktionen & Preisen", agency: "Agentur-Website mit Portfolio-Fokus",
      vitrine: "Professionelle Mehrseiten-Präsenz", consultant: "Autoritätsbildende Personenmarke", portfolio: "Arbeitsvitrine für Kreative & Entwickler",
      ecommerce: "Vollständiger Onlineshop mit Warenkorb", restaurant: "Menü, Reservierungen, Ambiente", hotel: "Zimmer, Galerie, Buchungs-CTA",
      healthcare: "Vertrauensorientierte Praxis-Website", realestate: "Immobilienangebote & Maklerprofil", fitness: "Kurse, Trainer, Transformation",
      event: "Sprecher, Programm, Tickets", nonprofit: "Missionsgetrieben, spendenfokussiert", startup: "Warteliste vor dem Start & Social Proof",
      luxury: "Dunkler Marmor, goldene Akzente, Haute Couture", brutalist: "Kühne, rohe, massive Typografie", magazine: "Rasterbasiertes journalistisches Layout",
      aurora: "Schillernde Verläufe, sanftes Leuchten", "3d-tech": "Holografisches Raster, Glitch-Effekte", "minimal-pro": "Negativraum auf Architektur-Niveau",
    },
    businessTypes: { Restaurant: "Restaurant", Agency: "Agentur", Coach: "Coach", Consultant: "Berater", "E-commerce": "E-Commerce", Portfolio: "Portfolio", Artisan: "Handwerker", Healthcare: "Gesundheit", Other: "Andere" },
    tones: { Professional: "Professionell", Friendly: "Freundlich", Bold: "Mutig", Luxurious: "Luxuriös" },
  },
  pt: {
    templateSelected: "Modelo selecionado", change: "Mudar →",
    s1Title: "O seu negócio", s2Title: "A sua oferta", s3Title: "Estilo e tom", s4Title: "Fotos e mídia", s5Title: "Quase lá!",
    fBusinessName: "Nome do negócio", fBusinessType: "Tipo de negócio", fWhatYouDo: "O que faz", fCity: "Cidade",
    fMainService: "Serviço / produto principal", fBenefits: "3 benefícios principais", fPriceRange: "Faixa de preço", fTargetAudience: "Público-alvo",
    fBrandColor: "Cor da marca", fTone: "Tom de voz", fTemplate: "Modelo",
    fLogo: "Logo (PNG ou SVG)", fHero: "Imagem principal", fEmail: "Endereço de e-mail", fPhone: "Telefone", fInstagram: "Instagram", fLinkedin: "LinkedIn",
    phBusinessName: "Nexxa Studio", phWhatYouDo: "Concebemos e criamos sites para pequenas empresas...", phCity: "Lisboa, Portugal", phMainService: "Design de site personalizado",
    phBenefit: "Benefício", required: "(obrigatório)", optional: "(opcional)",
    phPriceRange: "A partir de 500 € / 29 € por mês", phTargetAudience: "Pequenas empresas, freelancers...", phEmail: "voce@exemplo.com", phPhone: "+351 900 000 000",
    phInstagram: "@suamarca", phLinkedin: "linkedin.com/in/seunome",
    s4Subtitle: "Opcional — pode adicioná-los mais tarde.", heroHint: "Ou usaremos uma imagem de stock profissional adequada ao seu negócio.",
    errBusinessName: "O nome do negócio é obrigatório", errBusinessType: "Escolha um tipo de negócio", errTagline: "Diga-nos o que faz",
    errMainService: "O seu serviço principal é obrigatório", errBenefit: "É necessário pelo menos um benefício", errEmailRequired: "O endereço de e-mail é obrigatório", errEmailInvalid: "Introduza um endereço de e-mail válido",
    genericError: "Algo correu mal. Por favor, tente novamente.",
    back: "Voltar", continue: "Continuar", generating: "A gerar…", generate: "Gerar o meu site",
    categories: { Marketing: "Marketing", Tech: "Tecnologia", Agency: "Agência", Business: "Negócio", Personal: "Pessoal", Commerce: "Comércio", Hospitality: "Hotelaria", Health: "Saúde", Property: "Imobiliário", Events: "Eventos", Social: "Social", Premium: "Premium" },
    templateDescs: {
      landing: "Página única de alta conversão", saas: "Produto de software com funcionalidades e preços", agency: "Site de agência focado em portfólio",
      vitrine: "Presença profissional multipágina", consultant: "Marca pessoal que cria autoridade", portfolio: "Vitrine de trabalhos para criativos e devs",
      ecommerce: "Loja online completa com carrinho", restaurant: "Menu, reservas, ambiente", hotel: "Quartos, galeria, CTA de reserva",
      healthcare: "Site de consultório médico focado na confiança", realestate: "Anúncios de imóveis e perfil de agente", fitness: "Aulas, treinadores, transformação",
      event: "Oradores, programa, bilhetes", nonprofit: "Orientado à missão, focado em doações", startup: "Lista de espera pré-lançamento e prova social",
      luxury: "Mármore escuro, detalhes dourados, alta-costura", brutalist: "Tipografia ousada, crua, massiva", magazine: "Layout jornalístico em grelha",
      aurora: "Gradientes iridescentes, brilho suave", "3d-tech": "Grelha holográfica, efeitos glitch", "minimal-pro": "Espaço negativo de nível arquitetónico",
    },
    businessTypes: { Restaurant: "Restaurante", Agency: "Agência", Coach: "Coach", Consultant: "Consultor", "E-commerce": "E-commerce", Portfolio: "Portfólio", Artisan: "Artesão", Healthcare: "Saúde", Other: "Outro" },
    tones: { Professional: "Profissional", Friendly: "Amigável", Bold: "Ousado", Luxurious: "Luxuoso" },
  },
};

type FormState = {
  businessName: string; businessType: string; tagline: string; city: string;
  mainService: string; benefit1: string; benefit2: string; benefit3: string;
  priceRange: string; targetAudience: string;
  brandColor: string; tone: string; template: string;
  email: string; phone: string; instagram: string; linkedin: string;
};

const initial: FormState = {
  businessName: "", businessType: "", tagline: "", city: "",
  mainService: "", benefit1: "", benefit2: "", benefit3: "",
  priceRange: "", targetAudience: "",
  brandColor: "#7c3aed", tone: "Professional", template: "landing",
  email: "", phone: "", instagram: "", linkedin: "",
};

export function StepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLang();
  const t = STEPFORM_T[locale as keyof typeof STEPFORM_T] ?? STEPFORM_T.fr;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      setForm(f => ({ ...f, template: templateParam }));
      setSelectedTemplate(templateParam);
    }
  }, [searchParams]);

  // Tracks whether the user attempted to advance a given step, so we only show
  // validation errors after an attempt (not on first render).
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "template") {
      setSelectedTemplate(v);
    }
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Returns the set of invalid required-field keys for a given step.
  // Empty set === step is valid and the user may advance.
  const getStepErrors = (s: number): Partial<Record<keyof FormState, string>> => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.businessName.trim()) errs.businessName = t.errBusinessName;
      if (!form.businessType) errs.businessType = t.errBusinessType;
      if (!form.tagline.trim()) errs.tagline = t.errTagline;
    } else if (s === 2) {
      if (!form.mainService.trim()) errs.mainService = t.errMainService;
      if (!form.benefit1.trim()) errs.benefit1 = t.errBenefit;
    } else if (s === 5) {
      if (!form.email.trim()) errs.email = t.errEmailRequired;
      else if (!isEmail(form.email)) errs.email = t.errEmailInvalid;
    }
    return errs;
  };

  // Only surface errors for a field once the step has been attempted.
  const stepErrors = attempted[step] ? getStepErrors(step) : {};
  const errFor = (k: keyof FormState) => stepErrors[k];

  const canNext = () => Object.keys(getStepErrors(step)).length === 0;

  // Guarded navigation: mark the step attempted; only advance when valid.
  const goNext = () => {
    setAttempted((a) => ({ ...a, [step]: true }));
    if (Object.keys(getStepErrors(step)).length === 0) {
      setStep((s) => s + 1);
    }
  };

  const handleGenerate = async () => {
    // Final-step guard: validate required fields before submitting.
    setAttempted((a) => ({ ...a, [step]: true }));
    if (Object.keys(getStepErrors(step)).length > 0) return;
    setLoading(true);
    setError("");
    try {
      // Create session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            businessName: form.businessName, businessType: form.businessType,
            tagline: form.tagline, city: form.city,
            mainService: form.mainService,
            benefits: [form.benefit1, form.benefit2, form.benefit3],
            priceRange: form.priceRange, targetAudience: form.targetAudience,
            brandColor: form.brandColor, tone: form.tone, template: form.template,
            email: form.email, phone: form.phone,
            instagram: form.instagram, linkedin: form.linkedin,
          },
        }),
      });
      const { sessionId } = await sessionRes.json();

      // Generate content
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          formData: {
            businessName: form.businessName, businessType: form.businessType,
            tagline: form.tagline, city: form.city,
            mainService: form.mainService,
            benefits: [form.benefit1, form.benefit2, form.benefit3],
            priceRange: form.priceRange, targetAudience: form.targetAudience,
            brandColor: form.brandColor, tone: form.tone, template: form.template,
            email: form.email, phone: form.phone,
            instagram: form.instagram, linkedin: form.linkedin,
          },
        }),
      });

      const { previewUrl } = await genRes.json();

      // Deliver the result: take the client straight to their generated
      // website (/preview/[sessionId]) instead of pushing them into the old
      // pricing → brief funnel. The generated site is persisted to the
      // session by /api/generate, and the preview page reads it back.
      // Monetization happens from the preview's own "Launch my site" CTA.
      router.push(previewUrl ?? `/preview/${sessionId}`);
    } catch {
      setError(t.genericError);
      setLoading(false);
    }
  };

  const SelectedTemplateIcon = (selectedTemplate && THEME_ICONS[selectedTemplate]) || Palette;

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="w-full max-w-xl">
      {/* Template pre-selection banner */}
      {selectedTemplate && THEME_LABELS[selectedTemplate] && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <SelectedTemplateIcon className="w-7 h-7 text-violet-400" />
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold">{THEME_LABELS[selectedTemplate]}</div>
            <div className="text-violet-400 text-xs">{t.templateSelected}</div>
          </div>
          <a href="/themes" className="text-zinc-400 hover:text-white text-xs transition-colors shrink-0">
            {t.change}
          </a>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 < step
                  ? "bg-violet-600 text-white"
                  : i + 1 === step
                  ? "bg-violet-600 text-white ring-4 ring-violet-600/20"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? "bg-violet-600" : "bg-zinc-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 space-y-5"
        >
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s1Title}</h2>
              <Field label={t.fBusinessName} required error={errFor("businessName")}>
                <input className={`${input} ${errFor("businessName") ? inputError : ""}`} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder={t.phBusinessName} />
              </Field>
              <Field label={t.fBusinessType} required error={errFor("businessType")}>
                <div className={`flex flex-wrap gap-2 ${errFor("businessType") ? "rounded-xl ring-1 ring-red-500 p-2" : ""}`}>
                  {BUSINESS_TYPES.map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => set("businessType", bt)}
                      className={`px-3 py-1.5 rounded-full text-base transition-all ${
                        form.businessType === bt
                          ? "bg-violet-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {t.businessTypes[bt] ?? bt}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={t.fWhatYouDo} required error={errFor("tagline")}>
                <textarea className={`${input} resize-none ${errFor("tagline") ? inputError : ""}`} rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder={t.phWhatYouDo} />
              </Field>
              <Field label={t.fCity}>
                <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder={t.phCity} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s2Title}</h2>
              <Field label={t.fMainService} required error={errFor("mainService")}>
                <input className={`${input} ${errFor("mainService") ? inputError : ""}`} value={form.mainService} onChange={(e) => set("mainService", e.target.value)} placeholder={t.phMainService} />
              </Field>
              <Field label={t.fBenefits} required error={errFor("benefit1")}>
                {(["benefit1", "benefit2", "benefit3"] as const).map((k, i) => (
                  <input key={k} className={`${input} mb-2 ${k === "benefit1" && errFor("benefit1") ? inputError : ""}`} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={`${t.phBenefit} ${i + 1} ${i === 0 ? t.required : t.optional}`} />
                ))}
              </Field>
              <Field label={t.fPriceRange}>
                <input className={input} value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} placeholder={t.phPriceRange} />
              </Field>
              <Field label={t.fTargetAudience}>
                <input className={input} value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder={t.phTargetAudience} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s3Title}</h2>
              <Field label={t.fBrandColor}>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                  <span className="text-zinc-400 text-base font-mono">{form.brandColor}</span>
                </div>
              </Field>
              <Field label={t.fTone}>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((tn) => (
                    <button key={tn} type="button" onClick={() => set("tone", tn)}
                      className={`px-4 py-2 rounded-full text-base transition-all ${form.tone === tn ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
                      {t.tones[tn] ?? tn}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={t.fTemplate}>
                <div className="space-y-6">
                  {TEMPLATE_CATEGORIES.map((group) => (
                    <div key={group.category}>
                      <div className="text-base font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                        {t.categories[group.category] ?? group.category}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {group.templates.map((tpl) => {
                          const TIcon = tpl.icon;
                          return (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => set("template", tpl.id)}
                            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                              form.template === tpl.id
                                ? "border-violet-600 bg-violet-600/10"
                                : "border-zinc-700 hover:border-zinc-500"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <TIcon className="w-5 h-5 text-zinc-300" />
                              {form.template === tpl.id && <Check className="w-4 h-4 text-violet-400" />}
                            </div>
                            <div>
                              <div className="text-white font-medium text-base leading-tight">{tpl.label}</div>
                              <div className="text-zinc-500 text-base mt-0.5 leading-snug">{t.templateDescs[tpl.id] ?? tpl.desc}</div>
                            </div>
                          </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s4Title}</h2>
              <p className="text-zinc-400 text-base">{t.s4Subtitle}</p>
              <Field label={t.fLogo}>
                <input type="file" accept="image/*" className={input} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm((s) => ({ ...s, logoBase64: reader.result as string }));
                  reader.readAsDataURL(f);
                }} />
              </Field>
              <Field label={t.fHero}>
                <input type="file" accept="image/*" className={input} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm((s) => ({ ...s, heroImageBase64: reader.result as string }));
                  reader.readAsDataURL(f);
                }} />
                <p className="text-zinc-500 text-base mt-1">{t.heroHint}</p>
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s5Title}</h2>
              <Field label={t.fEmail} required error={errFor("email")}>
                <input type="email" className={`${input} ${errFor("email") ? inputError : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t.phEmail} />
              </Field>
              <Field label={t.fPhone}>
                <input type="tel" className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.phPhone} />
              </Field>
              <Field label={t.fInstagram}>
                <input className={input} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder={t.phInstagram} />
              </Field>
              <Field label={t.fLinkedin}>
                <input className={input} value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder={t.phLinkedin} />
              </Field>
              {error && <p className="text-red-400 text-base bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 text-base hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
        ) : <div />}

        {step < TOTAL_STEPS ? (
          <button
            onClick={goNext}
            aria-disabled={!canNext()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold transition-all ${
              canNext() ? "" : "opacity-50"
            }`}
          >
            {t.continue} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            aria-disabled={!canNext()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-base font-semibold transition-all ${
              canNext() || loading ? "" : "opacity-50"
            }`}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.generating}</> : <>{t.generate} <ArrowRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-lg font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-base" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Base input style: text-base === 16px to avoid iOS Safari focus auto-zoom and
// meet the accessibility font-size floor on all form fields.
const input = "w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-base focus:outline-none focus:border-violet-500 transition-colors";
// Applied additionally when a required field is invalid after a submit attempt.
const inputError = "border-red-500 focus:border-red-500";
