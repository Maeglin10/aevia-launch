"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Loader2, Check, ExternalLink, Upload, X, Plus, Image as ImageIcon, CheckCircle2, Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { INDUSTRIES, SECTORS, SECTOR_TEMPLATES, TEMPLATE_CITY_LABELS } from "@/lib/templates/sectors";
import { SECTOR_EXTRA_QUESTIONS } from "@/lib/templates/sector-questions";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";

// Registry lookup by id — used in step 2 template cards
const REGISTRY_BY_ID = Object.fromEntries(
  TEMPLATES_REGISTRY.map((t) => [t.id, t])
);

const TOTAL_STEPS = 6;

// ─── i18n ────────────────────────────────────────────────────────────────────
// UI chrome translations. Template *labels* stay as product names; their
// descriptions, category names, business types, tones, field labels,
// placeholders, buttons and errors are translated.

type StepFormStrings = {
  s1Title: string; s1Sub: string;
  s1IndustryTitle: string; s1IndustrySub: string;
  s1SpecialtyTitle: string; s1SpecialtySub: string; s1ChangeIndustry: string;
  s2Title: string; s2Sub: string; s2Preview: string; s2Other: string;
  s3Title: string;
  s4Title: string; s4SectorSub: string;
  s5Title: string; s5Sub: string;
  s6Title: string;
  fBusinessName: string; fWhatYouDo: string; fCity: string;
  fMainService: string; fBenefits: string; fPriceRange: string;
  fTargetAudience: string; phTargetAudience: string;
  fBrandColor: string;
  fEmail: string; fPhone: string;
  fInstagram: string; phInstagram: string;
  fLinkedin: string; phLinkedin: string;
  fGa4Id: string; phGa4Id: string;
  fGsc: string; phGsc: string;
  phBusinessName: string; phWhatYouDo: string; phCity: string; phMainService: string;
  phBenefit: string; required: string; optional: string;
  phPriceRange: string; phEmail: string; phPhone: string;
  errBusinessName: string; errSector: string; errTemplate: string; errTagline: string;
  errMainService: string; errBenefit: string; errEmailRequired: string; errEmailInvalid: string;
  genericError: string;
  back: string; continue: string; generating: string; generate: string;
  sectorOther: string;
  fLogo: string; fLogoHint: string; fPhotos: string; fPhotosHint: string; fPhotosAdd: string;
  fSectorDetails: string; skip: string;
};

const STEPFORM_T: Record<string, StepFormStrings> = {
  fr: {
    s1Title: "Votre activité", s1Sub: "Choisissez votre secteur — on vous montre les designs faits pour vous.",
    s1IndustryTitle: "Votre domaine", s1IndustrySub: "Quel est votre secteur d'activité ?",
    s1SpecialtyTitle: "Votre métier", s1SpecialtySub: "Précisez votre activité pour voir les designs qui vous correspondent.", s1ChangeIndustry: "← Changer de domaine",
    s2Title: "Votre design", s2Sub: "Designs créés pour votre métier. Choisissez celui qui vous correspond.", s2Preview: "Voir le thème", s2Other: "Autre activité ? Voir tous les thèmes →",
    s3Title: "Votre entreprise",
    s4Title: "Votre offre", s4SectorSub: "Ces questions permettent d'adapter le contenu à votre métier.",
    s5Title: "Vos visuels", s5Sub: "Ajoutez votre logo et des photos pour personnaliser votre site.",
    s6Title: "Presque fini !",
    fBusinessName: "Nom de l'entreprise", fWhatYouDo: "Ce que vous faites", fCity: "Ville",
    fMainService: "Service principal", fBenefits: "3 avantages clés", fPriceRange: "Gamme de prix",
    fTargetAudience: "Clientèle cible (optionnel)", phTargetAudience: "ex : Particuliers 30-50 ans, PME, Sportifs…",
    fBrandColor: "Couleur de marque",
    fEmail: "Adresse e-mail", fPhone: "Téléphone",
    fInstagram: "Instagram (optionnel)", phInstagram: "@votrecompte",
    fLinkedin: "LinkedIn (optionnel)", phLinkedin: "linkedin.com/company/votre-entreprise",
    fGa4Id: "Google Analytics (optionnel)", phGa4Id: "G-XXXXXXXXXX",
    fGsc: "Google Search Console (optionnel)", phGsc: "Code de vérification GSC",
    phBusinessName: "Cabinet Dupont", phWhatYouDo: "Nous accompagnons nos patients / clients depuis 2010…", phCity: "Lyon, France", phMainService: "Consultation & suivi personnalisé",
    phBenefit: "Avantage", required: "(requis)", optional: "(optionnel)",
    phPriceRange: "À partir de 50 € / consultation", phEmail: "vous@exemple.com", phPhone: "+33 6 00 00 00 00",
    errBusinessName: "Le nom est requis", errSector: "Choisissez votre activité", errTemplate: "Sélectionnez un design", errTagline: "Décrivez brièvement votre activité",
    errMainService: "Votre service principal est requis", errBenefit: "Au moins un avantage est requis", errEmailRequired: "L'adresse e-mail est requise", errEmailInvalid: "Saisissez une adresse e-mail valide",
    genericError: "Une erreur est survenue. Veuillez réessayer.",
    back: "Retour", continue: "Continuer", generating: "Génération…", generate: "Générer mon site",
    sectorOther: "Autre activité",
    fLogo: "Logo", fLogoHint: "PNG, SVG ou JPG — fond transparent recommandé", fPhotos: "Photos (optionnel)", fPhotosHint: "Extérieur, intérieur, produits, équipe… Vos propres photos.", fPhotosAdd: "Ajouter une photo",
    fSectorDetails: "Infos spécifiques à votre activité", skip: "Passer cette étape →",
  },
  en: {
    s1Title: "Your business type", s1Sub: "Pick your sector — we'll show the designs built for you.",
    s1IndustryTitle: "Your industry", s1IndustrySub: "What is your field of activity?",
    s1SpecialtyTitle: "Your profession", s1SpecialtySub: "Specify your activity to see the designs made for you.", s1ChangeIndustry: "← Change industry",
    s2Title: "Your design", s2Sub: "Designs built for your profession. Pick the one that fits.", s2Preview: "Preview theme", s2Other: "Different business? See all themes →",
    s3Title: "Your business",
    s4Title: "Your offer", s4SectorSub: "These questions help tailor the content to your profession.",
    s5Title: "Your visuals", s5Sub: "Add your logo and photos to personalise your site.",
    s6Title: "Almost there!",
    fBusinessName: "Business name", fWhatYouDo: "What you do", fCity: "City",
    fMainService: "Main service", fBenefits: "3 key benefits", fPriceRange: "Price range",
    fTargetAudience: "Target audience (optional)", phTargetAudience: "e.g. Individuals 30-50, SMEs, Athletes…",
    fBrandColor: "Brand colour",
    fEmail: "Email address", fPhone: "Phone",
    fInstagram: "Instagram (optional)", phInstagram: "@yourhandle",
    fLinkedin: "LinkedIn (optional)", phLinkedin: "linkedin.com/company/your-company",
    fGa4Id: "Google Analytics (optional)", phGa4Id: "G-XXXXXXXXXX",
    fGsc: "Google Search Console (optional)", phGsc: "GSC verification code",
    phBusinessName: "Dupont Practice", phWhatYouDo: "We've been helping our patients / clients since 2010…", phCity: "London, UK", phMainService: "Consultation & personalised care",
    phBenefit: "Benefit", required: "(required)", optional: "(optional)",
    phPriceRange: "From €50 / session", phEmail: "you@example.com", phPhone: "+44 7700 000000",
    errBusinessName: "Name is required", errSector: "Pick your business type", errTemplate: "Select a design", errTagline: "Briefly describe your business",
    errMainService: "Your main service is required", errBenefit: "At least one benefit is required", errEmailRequired: "Email is required", errEmailInvalid: "Enter a valid email",
    genericError: "Something went wrong. Please try again.",
    back: "Back", continue: "Continue", generating: "Generating…", generate: "Generate my site",
    sectorOther: "Other",
    fLogo: "Logo", fLogoHint: "PNG, SVG or JPG — transparent background recommended", fPhotos: "Photos (optional)", fPhotosHint: "Exterior, interior, products, team… Your own photos.", fPhotosAdd: "Add a photo",
    fSectorDetails: "Specific info about your business", skip: "Skip this step →",
  },
  es: {
    s1Title: "Tu actividad", s1Sub: "Elige tu sector — te mostramos los diseños hechos para ti.",
    s1IndustryTitle: "Tu sector", s1IndustrySub: "¿Cuál es tu campo de actividad?",
    s1SpecialtyTitle: "Tu profesión", s1SpecialtySub: "Especifica tu actividad para ver los diseños hechos para ti.", s1ChangeIndustry: "← Cambiar sector",
    s2Title: "Tu diseño", s2Sub: "Diseños creados para tu profesión. Elige el que más te gusta.", s2Preview: "Ver tema", s2Other: "¿Otra actividad? Ver todos los temas →",
    s3Title: "Tu negocio",
    s4Title: "Tu oferta", s4SectorSub: "Estas preguntas permiten adaptar el contenido a tu profesión.",
    s5Title: "Tus visuales", s5Sub: "Añade tu logo y fotos para personalizar tu sitio.",
    s6Title: "¡Casi listo!",
    fBusinessName: "Nombre del negocio", fWhatYouDo: "Qué haces", fCity: "Ciudad",
    fMainService: "Servicio principal", fBenefits: "3 beneficios clave", fPriceRange: "Rango de precios",
    fTargetAudience: "Público objetivo (opcional)", phTargetAudience: "ej: Particulares 30-50, Pymes, Deportistas…",
    fBrandColor: "Color de marca",
    fEmail: "Correo electrónico", fPhone: "Teléfono",
    fInstagram: "Instagram (opcional)", phInstagram: "@tucuenta",
    fLinkedin: "LinkedIn (opcional)", phLinkedin: "linkedin.com/company/tu-empresa",
    fGa4Id: "Google Analytics (opcional)", phGa4Id: "G-XXXXXXXXXX",
    fGsc: "Google Search Console (opcional)", phGsc: "Código de verificación GSC",
    phBusinessName: "Clínica Dupont", phWhatYouDo: "Ayudamos a nuestros pacientes desde 2010…", phCity: "Madrid, España", phMainService: "Consulta y seguimiento personalizado",
    phBenefit: "Beneficio", required: "(obligatorio)", optional: "(opcional)",
    phPriceRange: "Desde 50 € / consulta", phEmail: "tu@ejemplo.com", phPhone: "+34 600 00 00 00",
    errBusinessName: "El nombre es obligatorio", errSector: "Elige tu actividad", errTemplate: "Selecciona un diseño", errTagline: "Describe brevemente tu negocio",
    errMainService: "Tu servicio principal es obligatorio", errBenefit: "Se requiere al menos un beneficio", errEmailRequired: "El correo es obligatorio", errEmailInvalid: "Introduce un correo válido",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    back: "Atrás", continue: "Continuar", generating: "Generando…", generate: "Generar mi sitio",
    sectorOther: "Otro",
    fLogo: "Logotipo", fLogoHint: "PNG, SVG o JPG — fondo transparente recomendado", fPhotos: "Fotos (opcional)", fPhotosHint: "Exterior, interior, productos, equipo… Tus propias fotos.", fPhotosAdd: "Añadir una foto",
    fSectorDetails: "Información específica de tu negocio", skip: "Saltar este paso →",
  },
  de: {
    s1Title: "Ihre Branche", s1Sub: "Wählen Sie Ihren Sektor — wir zeigen die Designs für Sie.",
    s1IndustryTitle: "Ihre Branche", s1IndustrySub: "Was ist Ihr Tätigkeitsbereich?",
    s1SpecialtyTitle: "Ihr Beruf", s1SpecialtySub: "Präzisieren Sie Ihre Tätigkeit, um passende Designs zu sehen.", s1ChangeIndustry: "← Branche ändern",
    s2Title: "Ihr Design", s2Sub: "Designs für Ihren Beruf. Wählen Sie das passende.", s2Preview: "Vorschau", s2Other: "Andere Branche? Alle Designs →",
    s3Title: "Ihr Unternehmen",
    s4Title: "Ihr Angebot", s4SectorSub: "Diese Fragen ermöglichen es, den Inhalt auf Ihren Beruf abzustimmen.",
    s5Title: "Ihre Bilder", s5Sub: "Fügen Sie Ihr Logo und Fotos hinzu, um Ihre Website zu personalisieren.",
    s6Title: "Fast geschafft!",
    fBusinessName: "Firmenname", fWhatYouDo: "Was Sie tun", fCity: "Stadt",
    fMainService: "Hauptleistung", fBenefits: "3 Vorteile", fPriceRange: "Preisspanne",
    fTargetAudience: "Zielgruppe (optional)", phTargetAudience: "z.B. Privatpersonen 30-50, KMU, Sportler…",
    fBrandColor: "Markenfarbe",
    fEmail: "E-Mail-Adresse", fPhone: "Telefon",
    fInstagram: "Instagram (optional)", phInstagram: "@ihrprofil",
    fLinkedin: "LinkedIn (optional)", phLinkedin: "linkedin.com/company/ihr-unternehmen",
    fGa4Id: "Google Analytics (optional)", phGa4Id: "G-XXXXXXXXXX",
    fGsc: "Google Search Console (optional)", phGsc: "GSC-Bestätigungscode",
    phBusinessName: "Praxis Dupont", phWhatYouDo: "Wir betreuen unsere Patienten seit 2010…", phCity: "Berlin, Deutschland", phMainService: "Beratung & persönliche Betreuung",
    phBenefit: "Vorteil", required: "(erforderlich)", optional: "(optional)",
    phPriceRange: "Ab 50 € / Termin", phEmail: "sie@beispiel.com", phPhone: "+49 151 00000000",
    errBusinessName: "Name ist erforderlich", errSector: "Wählen Sie Ihre Branche", errTemplate: "Wählen Sie ein Design", errTagline: "Beschreiben Sie kurz Ihr Unternehmen",
    errMainService: "Hauptleistung ist erforderlich", errBenefit: "Mindestens ein Vorteil erforderlich", errEmailRequired: "E-Mail ist erforderlich", errEmailInvalid: "Gültige E-Mail eingeben",
    genericError: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    back: "Zurück", continue: "Weiter", generating: "Wird generiert…", generate: "Meine Website generieren",
    sectorOther: "Andere",
    fLogo: "Logo", fLogoHint: "PNG, SVG oder JPG — transparenter Hintergrund empfohlen", fPhotos: "Fotos (optional)", fPhotosHint: "Außen, Innen, Produkte, Team… Eigene Fotos.", fPhotosAdd: "Foto hinzufügen",
    fSectorDetails: "Spezifische Infos zu Ihrem Unternehmen", skip: "Diesen Schritt überspringen →",
  },
  pt: {
    s1Title: "A sua atividade", s1Sub: "Escolha o seu setor — mostramos os designs feitos para si.",
    s1IndustryTitle: "O seu setor", s1IndustrySub: "Qual é o seu campo de atividade?",
    s1SpecialtyTitle: "A sua profissão", s1SpecialtySub: "Especifique a sua atividade para ver os designs feitos para si.", s1ChangeIndustry: "← Mudar setor",
    s2Title: "O seu design", s2Sub: "Designs criados para a sua profissão. Escolha o que mais gosta.", s2Preview: "Ver tema", s2Other: "Outra atividade? Ver todos os temas →",
    s3Title: "O seu negócio",
    s4Title: "A sua oferta", s4SectorSub: "Estas perguntas permitem adaptar o conteúdo à sua profissão.",
    s5Title: "Os seus visuais", s5Sub: "Adicione o seu logotipo e fotos para personalizar o seu site.",
    s6Title: "Quase lá!",
    fBusinessName: "Nome do negócio", fWhatYouDo: "O que faz", fCity: "Cidade",
    fMainService: "Serviço principal", fBenefits: "3 benefícios", fPriceRange: "Faixa de preço",
    fTargetAudience: "Público-alvo (opcional)", phTargetAudience: "ex: Particulares 30-50, PME, Desportistas…",
    fBrandColor: "Cor de marca",
    fEmail: "E-mail", fPhone: "Telefone",
    fInstagram: "Instagram (opcional)", phInstagram: "@suaconta",
    fLinkedin: "LinkedIn (opcional)", phLinkedin: "linkedin.com/company/a-sua-empresa",
    fGa4Id: "Google Analytics (opcional)", phGa4Id: "G-XXXXXXXXXX",
    fGsc: "Google Search Console (opcional)", phGsc: "Código de verificação GSC",
    phBusinessName: "Clínica Dupont", phWhatYouDo: "Ajudamos os nossos pacientes desde 2010…", phCity: "Lisboa, Portugal", phMainService: "Consulta e acompanhamento personalizado",
    phBenefit: "Benefício", required: "(obrigatório)", optional: "(opcional)",
    phPriceRange: "A partir de 50 € / consulta", phEmail: "voce@exemplo.com", phPhone: "+351 900 000 000",
    errBusinessName: "O nome é obrigatório", errSector: "Escolha a sua atividade", errTemplate: "Selecione um design", errTagline: "Descreva brevemente o seu negócio",
    errMainService: "O serviço principal é obrigatório", errBenefit: "Pelo menos um benefício é necessário", errEmailRequired: "O e-mail é obrigatório", errEmailInvalid: "Introduza um e-mail válido",
    genericError: "Algo correu mal. Por favor, tente novamente.",
    back: "Voltar", continue: "Continuar", generating: "A gerar…", generate: "Gerar o meu site",
    sectorOther: "Outro",
    fLogo: "Logotipo", fLogoHint: "PNG, SVG ou JPG — fundo transparente recomendado", fPhotos: "Fotos (opcional)", fPhotosHint: "Exterior, interior, produtos, equipa… As suas próprias fotos.", fPhotosAdd: "Adicionar uma foto",
    fSectorDetails: "Informação específica do seu negócio", skip: "Saltar este passo →",
  },
};

type FormState = {
  industry: string; sector: string; template: string;
  businessName: string; tagline: string; city: string;
  mainService: string; benefit1: string; benefit2: string; benefit3: string;
  priceRange: string; targetAudience: string;
  brandColor: string;
  email: string; phone: string; instagram: string; linkedin: string;
  ga4Id: string; gscVerification: string;
  sectorData: Record<string, string>;
  logoUrl: string;
  photoUrls: string[];
};

const PRESET_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#dc2626", "#d97706",
  "#db2777", "#0891b2", "#7c2d12", "#1e3a5f", "#14532d",
];

const initial: FormState = {
  industry: "", sector: "", template: "",
  businessName: "", tagline: "", city: "",
  mainService: "", benefit1: "", benefit2: "", benefit3: "",
  priceRange: "", targetAudience: "",
  brandColor: "#7c3aed",
  email: "", phone: "", instagram: "", linkedin: "",
  ga4Id: "", gscVerification: "",
  sectorData: {},
  logoUrl: "",
  photoUrls: [],
};

export function StepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLang();
  const t = STEPFORM_T[locale as keyof typeof STEPFORM_T] ?? STEPFORM_T.fr;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  // Step 1 has 2 sub-phases: "industry" then "specialty"
  const [industryPhase, setIndustryPhase] = useState<"industry" | "specialty">("industry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tracks whether the user attempted to advance a given step, so we only show
  // validation errors after an attempt (not on first render).
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});

  // --- Funnel analytics ---------------------------------------------------
  // Record how far each visitor gets in the wizard (even if they abandon), so
  // we can see exactly where prospects drop off. Fire-and-forget, no PII.
  const funnelId = useRef<string>("");
  const recordFunnel = (s: number, completed = false) => {
    if (typeof window === "undefined") return;
    if (!funnelId.current) {
      funnelId.current =
        sessionStorage.getItem("aevia-funnel") ||
        (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem("aevia-funnel", funnelId.current);
    }
    void fetch("/api/funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funnelId: funnelId.current,
        step: s,
        totalSteps: TOTAL_STEPS,
        industry: form.industry || undefined,
        businessType: form.sector || undefined,
        completed,
      }),
      keepalive: true,
    }).catch(() => {});
  };
  // Fire on every step change (and on first mount → step 1).
  useEffect(() => {
    recordFunnel(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File, target: "logo" | "photo") => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) return;
      const { url } = await res.json() as { url: string };
      if (target === "logo") {
        set("logoUrl", url);
      } else {
        setForm((f) => ({ ...f, photoUrls: [...f.photoUrls, url] }));
      }
    } finally {
      setUploading(false);
    }
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Returns the set of invalid required-field keys for a given step.
  // Empty set === step is valid and the user may advance.
  const getStepErrors = (s: number): Partial<Record<keyof FormState, string>> => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.sector) errs.sector = t.errSector;
    } else if (s === 2) {
      if (!form.template) errs.template = t.errTemplate;
    } else if (s === 3) {
      if (!form.businessName.trim()) errs.businessName = t.errBusinessName;
      if (!form.tagline.trim()) errs.tagline = t.errTagline;
    } else if (s === 4) {
      if (!form.mainService.trim()) errs.mainService = t.errMainService;
      if (!form.benefit1.trim()) errs.benefit1 = t.errBenefit;
    } else if (s === 6) {
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
      const formData = {
        industry: form.industry, sector: form.sector,
        businessType: form.sector, // FormData contract key
        template: form.template,
        businessName: form.businessName, tagline: form.tagline, city: form.city,
        mainService: form.mainService,
        benefits: [form.benefit1, form.benefit2, form.benefit3].filter(Boolean) as [string, string, string],
        priceRange: form.priceRange,
        brandColor: form.brandColor || "#7c3aed",
        email: form.email,
        ...(form.phone && { phone: form.phone }),
        ...(form.targetAudience && { targetAudience: form.targetAudience }),
        ...(form.instagram && { instagram: form.instagram }),
        ...(form.linkedin && { linkedin: form.linkedin }),
        ...(form.ga4Id && { ga4Id: form.ga4Id }),
        ...(form.gscVerification && { gscVerification: form.gscVerification }),
        ...(Object.keys(form.sectorData).length > 0 && { sectorData: form.sectorData }),
        ...(form.logoUrl && { logoUrl: form.logoUrl }),
        ...(form.photoUrls.length > 0 && { photoUrls: form.photoUrls }),
      };

      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });
      const { sessionId } = await sessionRes.json();

      // Generate content
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, formData }),
      });

      const { previewUrl } = await genRes.json();

      // Deliver the result: take the client straight to their generated
      // website (/preview/[sessionId]) instead of pushing them into the old
      // pricing → brief funnel. The generated site is persisted to the
      // session by /api/generate, and the preview page reads it back.
      // Monetization happens from the preview's own "Launch my site" CTA.
      recordFunnel(TOTAL_STEPS, true); // mark this visitor as completed
      router.push(previewUrl ?? `/preview/${sessionId}`);
    } catch {
      setError(t.genericError);
      setLoading(false);
    }
  };

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="w-full max-w-xl">
      {/* Template pre-selection banner */}
      {form.template && TEMPLATE_CITY_LABELS[form.template] && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">✓</div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold">{TEMPLATE_CITY_LABELS[form.template]}</div>
            <div className="text-violet-400 text-xs">{form.template}</div>
          </div>
          <Link href="/themes" className="text-zinc-400 hover:text-white text-xs transition-colors shrink-0">Changer →</Link>
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
          {/* STEP 1 — 2-level sector selection (industry → specialty) */}
          {step === 1 && (
            <AnimatePresence mode="wait">
              {industryPhase === "industry" ? (
                <motion.div
                  key="industry"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-1">{t.s1IndustryTitle}</h2>
                  <p className="text-zinc-400 text-base mb-4">{t.s1IndustrySub}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          set("industry", ind.id);
                          set("sector", "");
                          set("template", "");
                          setIndustryPhase("specialty");
                        }}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                          form.industry === ind.id
                            ? "border-violet-600 bg-violet-600/10 text-white"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                        }`}
                      >
                        <span className="text-xl">{ind.emoji}</span>
                        <span className="text-base font-medium leading-tight">{ind.labels[locale] ?? ind.label}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { set("industry", "other"); set("sector", "other"); set("template", ""); setIndustryPhase("specialty"); }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white text-left transition-all"
                    >
                      <span className="text-xl">🔍</span>
                      <span className="text-base font-medium">{t.sectorOther}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="specialty"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => { setIndustryPhase("industry"); set("sector", ""); set("template", ""); }}
                    className="text-violet-400 hover:text-violet-300 text-sm mb-4 transition-colors"
                  >
                    {t.s1ChangeIndustry}
                  </button>
                  <h2 className="text-xl font-bold text-white mb-1">{t.s1SpecialtyTitle}</h2>
                  <p className="text-zinc-400 text-base mb-4">{t.s1SpecialtySub}</p>
                  {form.industry === "other" ? (
                    <div className="py-4 text-center">
                      <p className="text-zinc-300 text-base mb-4">{t.s2Other}</p>
                      <Link href="/themes" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold transition-all">
                        Voir tous les thèmes <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-2 gap-2 ${errFor("sector") ? "rounded-xl ring-1 ring-red-500 p-2" : ""}`}>
                      {(INDUSTRIES.find((i) => i.id === form.industry)?.specialties ?? []).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            set("sector", s.id);
                            set("template", "");
                            // Auto-advance to template selection
                            setTimeout(() => setStep(2), 180);
                          }}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                            form.sector === s.id
                              ? "border-violet-600 bg-violet-600/10 text-white"
                              : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                          }`}
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <span className="text-base font-medium leading-tight">{s.labels?.[locale] ?? s.label}</span>
                          {form.sector === s.id && <Check className="w-4 h-4 text-violet-400 ml-auto shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                  {errFor("sector") && <p className="text-red-400 text-base mt-2">{errFor("sector")}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* STEP 2 — Template choice for selected sector */}
          {step === 2 && (
            <>
              {/* Sector-based theme recommendations */}
              {(() => {
                const recommendedIds = SECTOR_TEMPLATES[form.sector];
                if (!recommendedIds || recommendedIds.length === 0) return null;
                
                return (
                  <div className="space-y-3 pb-5 border-b border-zinc-800 mb-5">
                    <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>Thèmes recommandés pour votre secteur</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {recommendedIds.slice(0, 5).map((tid) => {
                        const template = REGISTRY_BY_ID[tid] as typeof TEMPLATES_REGISTRY[0] | undefined;
                        if (!template) return null;
                        const cityLabel = TEMPLATE_CITY_LABELS[tid] ?? template.name;
                        const isSelected = form.template === tid;
                        
                        let bgClass = "bg-zinc-900 text-white border border-zinc-800/80";
                        let badgeClass = "bg-zinc-800 text-zinc-400 border border-zinc-700";
                        if (template.style === "Light") {
                          bgClass = "bg-white text-zinc-900 border border-zinc-200";
                          badgeClass = "bg-zinc-100 text-zinc-600 border border-zinc-200";
                        } else if (template.style === "Vibrant") {
                          bgClass = "bg-gradient-to-br from-violet-900/90 to-indigo-950 text-white border border-violet-800/60";
                          badgeClass = "bg-violet-950/40 text-violet-300 border border-violet-900/30";
                        } else if (template.style === "Brutalist") {
                          bgClass = "bg-yellow-50 text-black border-2 border-black rounded-none shadow-[2px_2px_0px_#000]";
                          badgeClass = "bg-yellow-300 text-black border border-black font-bold uppercase";
                        }

                        return (
                          <motion.button
                            key={tid}
                            type="button"
                            onClick={() => set("template", tid)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-shrink-0 w-[240px] text-left p-4 rounded-xl flex flex-col justify-between transition-all snap-start cursor-pointer relative ${bgClass} ${
                              isSelected 
                                ? template.style === "Brutalist"
                                  ? "border-violet-600 ring-2 ring-violet-500"
                                  : "border-violet-500 ring-2 ring-violet-500/30"
                                : ""
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${badgeClass}`}>
                                  {template.style}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                                )}
                              </div>
                              <h4 className="font-bold text-sm leading-snug line-clamp-1">
                                {cityLabel}
                              </h4>
                              <p className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed ${
                                template.style === "Light" ? "text-zinc-500" : "text-zinc-400"
                              }`}>
                                {template.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-current/10 w-full flex items-center justify-between text-xs font-semibold">
                              <span>Choisir ce thème</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              <h2 className="text-xl font-bold text-white">{t.s2Title}</h2>
              <p className="text-zinc-400 text-base -mt-2">{t.s2Sub}</p>
              {errFor("template") && <p className="text-red-400 text-base">{errFor("template")}</p>}
              {form.sector === "other" ? (
                <div className="py-4 text-center">
                  <p className="text-zinc-300 text-base mb-4">{t.s2Other}</p>
                  <Link href="/themes" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold transition-all">
                    Voir tous les thèmes <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {(SECTOR_TEMPLATES[form.sector] ?? []).map((tid) => {
                    const meta = REGISTRY_BY_ID[tid];
                    const cityLabel = TEMPLATE_CITY_LABELS[tid] ?? tid;
                    const isSelected = form.template === tid;
                    return (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => set("template", tid)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                          isSelected ? "border-violet-600 bg-violet-600/10" : "border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        {/* Color accent swatch */}
                        <div
                          className="w-12 h-12 rounded-lg shrink-0 mt-0.5"
                          style={{ background: SECTORS.find((s) => s.id === form.sector)?.accentColor ?? "#333" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-white font-semibold text-base leading-snug">{cityLabel}</div>
                            {isSelected && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                          </div>
                          {meta && (
                            <div className="text-zinc-500 text-sm mt-0.5 leading-snug line-clamp-2">{meta.description}</div>
                          )}
                          <a
                            href={`/templates/${tid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm mt-2 transition-colors"
                          >
                            {t.s2Preview} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* STEP 3 — Business info */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s3Title}</h2>
              <Field label={t.fBusinessName} required error={errFor("businessName")}>
                <input className={`${input} ${errFor("businessName") ? inputError : ""}`} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder={t.phBusinessName} />
              </Field>
              <Field label={t.fWhatYouDo} required error={errFor("tagline")}>
                <textarea className={`${input} resize-none ${errFor("tagline") ? inputError : ""}`} rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder={t.phWhatYouDo} />
              </Field>
              <Field label={t.fCity}>
                <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder={t.phCity} />
              </Field>
            </>
          )}

          {/* STEP 4 — Offer */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s4Title}</h2>
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

              {(SECTOR_EXTRA_QUESTIONS[form.sector] ?? []).length > 0 && (
                <div className="border-t border-zinc-700 pt-5 mt-1 space-y-4">
                  <p className="text-zinc-400 text-sm">{t.fSectorDetails}</p>
                  {(SECTOR_EXTRA_QUESTIONS[form.sector] ?? []).map((q) => (
                    <Field key={q.key} label={q.label[locale] ?? q.label.fr}>
                      {q.type === "select" ? (
                        <select
                          value={form.sectorData[q.key] ?? ""}
                          onChange={(e) => set("sectorData", { ...form.sectorData, [q.key]: e.target.value })}
                          className={input}
                        >
                          <option value="">…</option>
                          {(q.options?.[locale] ?? q.options?.fr ?? []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : q.type === "textarea" ? (
                        <textarea
                          value={form.sectorData[q.key] ?? ""}
                          onChange={(e) => set("sectorData", { ...form.sectorData, [q.key]: e.target.value })}
                          className={`${input} resize-none`}
                          rows={3}
                          placeholder={q.placeholder?.[locale] ?? q.placeholder?.fr ?? ""}
                        />
                      ) : (
                        <input
                          value={form.sectorData[q.key] ?? ""}
                          onChange={(e) => set("sectorData", { ...form.sectorData, [q.key]: e.target.value })}
                          placeholder={q.placeholder?.[locale] ?? q.placeholder?.fr ?? ""}
                          className={input}
                        />
                      )}
                    </Field>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 5 — Visuals */}
          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s5Title}</h2>
              <p className="text-zinc-400 text-sm">{t.s5Sub}</p>

              {/* Brand Color */}
              <Field label={t.fBrandColor}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.brandColor}
                      onChange={(e) => set("brandColor", e.target.value)}
                      className="w-12 h-12 rounded-xl border-2 border-zinc-700 cursor-pointer bg-transparent p-1"
                    />
                    <input
                      type="text"
                      value={form.brandColor}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) set("brandColor", v);
                      }}
                      className={`${input} w-32 font-mono`}
                      placeholder="#7c3aed"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => set("brandColor", c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${form.brandColor === c ? "border-white scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </Field>

              {/* Logo */}
              <Field label={t.fLogo}>
                {form.logoUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.logoUrl} alt="logo" className="h-16 w-auto rounded-lg border border-zinc-700 bg-zinc-900 object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => set("logoUrl", "")}
                      className="flex items-center gap-1 text-sm text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-700 rounded-xl p-6 cursor-pointer hover:border-violet-500 transition-colors">
                    <Upload className="w-6 h-6 text-zinc-500" />
                    <span className="text-sm text-zinc-400">{t.fLogoHint}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f, "logo");
                      }}
                    />
                    {uploading && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                  </label>
                )}
              </Field>

              {/* Photos */}
              <Field label={t.fPhotos}>
                <p className="text-zinc-500 text-xs mb-3">{t.fPhotosHint}</p>
                <div className="grid grid-cols-3 gap-2">
                  {form.photoUrls.map((url, i) => (
                    <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, photoUrls: f.photoUrls.filter((_, j) => j !== i) }))}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.photoUrls.length < 6 && (
                    <label className="aspect-square flex flex-col items-center justify-center gap-1 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin text-violet-400" /> : <Plus className="w-5 h-5 text-zinc-500" />}
                      <span className="text-xs text-zinc-500">{t.fPhotosAdd}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f, "photo");
                        }}
                      />
                    </label>
                  )}
                </div>
              </Field>
            </>
          )}

          {/* STEP 6 — Contact + generate */}
          {step === 6 && (
            <>
              <h2 className="text-xl font-bold text-white">{t.s6Title}</h2>
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
              <Field label={t.fGa4Id}>
                <input
                  className={input}
                  value={form.ga4Id}
                  onChange={(e) => set("ga4Id", e.target.value.trim())}
                  placeholder={t.phGa4Id}
                  pattern="G-[A-Z0-9]+"
                />
              </Field>
              <Field label={t.fGsc}>
                <input
                  className={input}
                  value={form.gscVerification}
                  onChange={(e) => set("gscVerification", e.target.value.trim())}
                  placeholder={t.phGsc}
                />
              </Field>
              {error && <p className="text-red-400 text-base bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-6">
        {(step > 1 || (step === 1 && industryPhase === "specialty" && form.industry !== "other")) ? (
          <button
            onClick={() => {
              if (step === 1 && industryPhase === "specialty") {
                setIndustryPhase("industry");
                set("sector", "");
                set("template", "");
              } else {
                setStep((s) => s - 1);
                if (step === 2) setIndustryPhase("specialty");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 text-base hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
        ) : <div />}

        {step < TOTAL_STEPS ? (
          // In Step 1 industry phase: clicking an industry auto-advances — no Continue button needed
          step === 1 && industryPhase === "industry" ? <div /> : (
          <button
            onClick={goNext}
            aria-disabled={!canNext()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold transition-all ${
              canNext() ? "" : "opacity-50"
            }`}
          >
            {t.continue} <ArrowRight className="w-4 h-4" />
          </button>
          )
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
