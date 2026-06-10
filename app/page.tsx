"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Palette, Rocket, CheckCircle2, Sparkles, ExternalLink, Search } from "lucide-react";

const METRIC_ICONS = [Zap, Sparkles, Search] as const;
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
import { useLang } from "@/lib/LangContext";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";

/* ─── Translations ─────────────────────────────────────────── */
const HERO_T = {
  fr: {
    badge: "Sites livrés en 2 heures",
    pre: "Votre",
    post: "en ligne aujourd'hui.",
    rotate: ["Landing Page", "E-commerce", "Site vitrine", "Portfolio"],
    sub: "Notre IA rédige votre contenu, vous choisissez un thème, on lance en 2 heures. C'est tout.",
    cta1: "Créer mon site",
    cta2: "Voir les thèmes",
    free: "Aperçu gratuit · sans carte bancaire",
    metrics: ["Live en 2h", "IA rédige", "SEO optimisé"],
    how: "Comment ça marche",
    choose: "Quel type de site ?",
    chooseSub: "Choisissez votre catégorie — on a le thème parfait pour vous.",
    ready: "Prêt à vous lancer ?",
    readySub: "Des centaines d'entreprises ont leur site en 2 heures.",
    startFree: "Commencer gratuitement",
    explore: "Voir tous les thèmes",
    spotlight: "Coup de projecteur",
    seeAll: "Voir tous →",
    templatesBadge: "200+ templates",
  },
  en: {
    badge: "Websites delivered in 2 hours",
    pre: "Your",
    post: "online today.",
    rotate: ["Landing Page", "Online Store", "Business Site", "Portfolio"],
    sub: "Our AI writes your content, you pick a theme, we launch in 2 hours. That's it.",
    cta1: "Build my site",
    cta2: "Browse themes",
    free: "Free preview · no credit card required",
    metrics: ["Live in 2h", "AI-written", "SEO optimised"],
    how: "How it works",
    choose: "What type of site?",
    chooseSub: "Choose your category — we have the perfect theme for you.",
    ready: "Ready to go live?",
    readySub: "Join hundreds of businesses who got their website in 2 hours.",
    startFree: "Start for free",
    explore: "Browse all themes",
    spotlight: "Spotlight",
    seeAll: "See all →",
    templatesBadge: "200+ templates",
  },
  es: {
    badge: "Sitios web entregados en 2 horas",
    pre: "Tu",
    post: "online hoy.",
    rotate: ["Landing Page", "Tienda Online", "Sitio Web", "Portfolio"],
    sub: "Nuestra IA escribe el contenido, tú eliges el tema, lanzamos en 2 horas. Así de simple.",
    cta1: "Crear mi sitio",
    cta2: "Ver temas",
    free: "Vista previa gratis · sin tarjeta",
    metrics: ["Online en 2h", "IA-escribe", "SEO optimizado"],
    how: "Cómo funciona",
    choose: "¿Qué tipo de sitio?",
    chooseSub: "Elige tu categoría — tenemos el tema perfecto para ti.",
    ready: "¿Listo para lanzar?",
    readySub: "Cientos de empresas tienen su sitio en 2 horas.",
    startFree: "Empezar gratis",
    explore: "Ver todos los temas",
    spotlight: "Destacados",
    seeAll: "Ver todos →",
    templatesBadge: "200+ plantillas",
  },
  de: {
    badge: "Websites in 2 Stunden geliefert",
    pre: "Deine",
    post: "heute online.",
    rotate: ["Landing Page", "Online-Shop", "Firmenwebsite", "Portfolio"],
    sub: "Unsere KI schreibt den Inhalt, du wählst ein Theme, wir launchen in 2 Stunden.",
    cta1: "Meine Website erstellen",
    cta2: "Themes ansehen",
    free: "Kostenlose Vorschau · keine Kreditkarte",
    metrics: ["Online in 2h", "KI-geschrieben", "SEO-optimiert"],
    how: "So funktioniert es",
    choose: "Welche Art von Website?",
    chooseSub: "Wähle deine Kategorie — wir haben das perfekte Theme für dich.",
    ready: "Bereit zum Launch?",
    readySub: "Hunderte Unternehmen haben ihre Website in 2 Stunden.",
    startFree: "Kostenlos starten",
    explore: "Alle Themes ansehen",
    spotlight: "Highlights",
    seeAll: "Alle ansehen →",
    templatesBadge: "200+ Themes",
  },
  pt: {
    badge: "Sites entregues em 2 horas",
    pre: "O seu",
    post: "online hoje.",
    rotate: ["Landing Page", "Loja Online", "Site Vitrine", "Portfolio"],
    sub: "A nossa IA escreve o conteúdo, você escolhe o tema, lançamos em 2 horas. Simples assim.",
    cta1: "Criar o meu site",
    cta2: "Ver temas",
    free: "Pré-visualização grátis · sem cartão",
    metrics: ["Online em 2h", "IA-escrito", "SEO otimizado"],
    how: "Como funciona",
    choose: "Que tipo de site?",
    chooseSub: "Escolha a sua categoria — temos o tema perfeito para si.",
    ready: "Pronto para lançar?",
    readySub: "Centenas de empresas têm o seu site em 2 horas.",
    startFree: "Começar grátis",
    explore: "Ver todos os temas",
    spotlight: "Destaques",
    seeAll: "Ver todos →",
    templatesBadge: "200+ templates",
  },
} as const;

const STEPS_T = {
  fr: [
    { title: "Décrivez votre activité", desc: "Remplissez un formulaire de 5 étapes — moins de 3 minutes." },
    { title: "L'IA génère votre contenu", desc: "Claude rédige vos titres, textes et métadonnées SEO." },
    { title: "On construit & on lance", desc: "Aperçu instantané. Déployé sur Vercel en 2 heures." },
  ],
  en: [
    { title: "Tell us about your business", desc: "Fill in a 5-step form — takes less than 3 minutes." },
    { title: "AI generates your content", desc: "Claude writes your headlines, copy, and SEO metadata." },
    { title: "We build & launch your site", desc: "Preview instantly. We deploy it live within 2 hours." },
  ],
  es: [
    { title: "Cuéntanos tu negocio", desc: "Completa un formulario de 5 pasos — menos de 3 minutos." },
    { title: "La IA genera tu contenido", desc: "Claude escribe tus títulos, textos y metadatos SEO." },
    { title: "Construimos y lanzamos", desc: "Vista previa instantánea. Desplegado en Vercel en 2 horas." },
  ],
  de: [
    { title: "Beschreibe dein Unternehmen", desc: "Fülle ein 5-Schritte-Formular aus — weniger als 3 Minuten." },
    { title: "KI generiert deinen Inhalt", desc: "Claude schreibt deine Texte, Headlines und SEO-Metadaten." },
    { title: "Wir bauen & launchen", desc: "Sofortige Vorschau. In 2 Stunden live auf Vercel." },
  ],
  pt: [
    { title: "Descreva o seu negócio", desc: "Preencha um formulário de 5 etapas — menos de 3 minutos." },
    { title: "A IA gera o seu conteúdo", desc: "Claude escreve os seus títulos, textos e metadados SEO." },
    { title: "Construímos e lançamos", desc: "Pré-visualização instantânea. Lançado no Vercel em 2 horas." },
  ],
};

const TRUST_T = {
  fr: ["Aucune compétence en design", "Rédaction par IA", "Déployé sur Vercel", "Mobile-first responsive", "SEO optimisé", "Livré en 2 heures"],
  en: ["No design skills needed", "AI-powered copywriting", "Deployed on Vercel", "Mobile-first responsive", "SEO optimised", "Delivered in 2 hours"],
  es: ["Sin habilidades de diseño", "Redacción por IA", "Desplegado en Vercel", "Responsive mobile-first", "SEO optimizado", "Entregado en 2 horas"],
  de: ["Keine Designkenntnisse nötig", "KI-gestützte Texte", "Auf Vercel bereitgestellt", "Mobile-first responsiv", "SEO-optimiert", "In 2 Stunden geliefert"],
  pt: ["Sem habilidades de design", "Redação por IA", "Implantado no Vercel", "Responsivo mobile-first", "SEO otimizado", "Entregue em 2 horas"],
};

/* ─── Type categories ────────────────────────────────────────── */
const TYPE_CATS = [
  {
    label: { fr: "Luxe & Premium", en: "Luxury & Premium", es: "Lujo & Premium", de: "Luxus & Premium", pt: "Luxo & Premium" },
    cat: "Luxury",
    color: "#C9A86C",
    bg: "from-[#C9A86C]/15 to-[#C9A86C]/5",
    border: "border-[#C9A86C]/25",
    hoverBorder: "hover:border-[#C9A86C]/60",
    desc: { fr: "Bijouterie, hôtellerie, mode, gastronomie", en: "Jewellery, hotels, fashion, fine dining", es: "Joyería, hoteles, moda, gastronomía", de: "Schmuck, Hotels, Mode, Gastronomie", pt: "Joalheria, hotéis, moda, gastronomia" },
    thumbId: "impact-03",
    count: 24,
  },
  {
    label: { fr: "Tech & SaaS", en: "Tech & SaaS", es: "Tech & SaaS", de: "Tech & SaaS", pt: "Tech & SaaS" },
    cat: "Tech",
    color: "#3B82F6",
    bg: "from-[#3B82F6]/15 to-[#3B82F6]/5",
    border: "border-[#3B82F6]/25",
    hoverBorder: "hover:border-[#3B82F6]/60",
    desc: { fr: "SaaS, apps, startups, outils pro", en: "SaaS, apps, startups, dev tools", es: "SaaS, apps, startups, herramientas", de: "SaaS, Apps, Startups, Dev-Tools", pt: "SaaS, apps, startups, ferramentas" },
    thumbId: "impact-05",
    count: 18,
  },
  {
    label: { fr: "Créatif & Agence", en: "Creative & Agency", es: "Creativo & Agencia", de: "Kreativ & Agentur", pt: "Criativo & Agência" },
    cat: "Creative",
    color: "#A855F7",
    bg: "from-[#A855F7]/15 to-[#A855F7]/5",
    border: "border-[#A855F7]/25",
    hoverBorder: "hover:border-[#A855F7]/60",
    desc: { fr: "Portfolios, studios, agences créatives", en: "Portfolios, studios, creative agencies", es: "Portfolios, estudios, agencias", de: "Portfolios, Studios, Kreativagenturen", pt: "Portfólios, estúdios, agências" },
    thumbId: "impact-02",
    count: 22,
  },
  {
    label: { fr: "Food & Restaurant", en: "Food & Restaurant", es: "Comida & Restaurante", de: "Food & Restaurant", pt: "Food & Restaurante" },
    cat: "Food & Drink",
    color: "#FB923C",
    bg: "from-[#FB923C]/15 to-[#FB923C]/5",
    border: "border-[#FB923C]/25",
    hoverBorder: "hover:border-[#FB923C]/60",
    desc: { fr: "Restaurants, cafés, boulangeries, vins", en: "Restaurants, cafés, bakeries, wine bars", es: "Restaurantes, cafés, panaderías, vinos", de: "Restaurants, Cafés, Bäckereien, Weine", pt: "Restaurantes, cafés, padarias, vinhos" },
    thumbId: "impact-04",
    count: 12,
  },
  {
    label: { fr: "Santé & Bien-être", en: "Health & Wellness", es: "Salud & Bienestar", de: "Gesundheit & Wellness", pt: "Saúde & Bem-estar" },
    cat: "Health",
    color: "#14B8A6",
    bg: "from-[#14B8A6]/15 to-[#14B8A6]/5",
    border: "border-[#14B8A6]/25",
    hoverBorder: "hover:border-[#14B8A6]/60",
    desc: { fr: "Cliniques, spas, yoga, fitness", en: "Clinics, spas, yoga, fitness", es: "Clínicas, spas, yoga, fitness", de: "Kliniken, Spas, Yoga, Fitness", pt: "Clínicas, spas, yoga, fitness" },
    thumbId: "impact-10",
    count: 10,
  },
  {
    label: { fr: "Corporate & Services", en: "Corporate & Services", es: "Corporativo & Servicios", de: "Corporate & Services", pt: "Corporativo & Serviços" },
    cat: "Corporate",
    color: "#0EA5E9",
    bg: "from-[#0EA5E9]/15 to-[#0EA5E9]/5",
    border: "border-[#0EA5E9]/25",
    hoverBorder: "hover:border-[#0EA5E9]/60",
    desc: { fr: "Entreprises, cabinets, B2B, finance", en: "Companies, agencies, B2B, finance", es: "Empresas, despachos, B2B, finanzas", de: "Unternehmen, Kanzleien, B2B, Finanzen", pt: "Empresas, escritórios, B2B, finanças" },
    thumbId: "impact-01",
    count: 16,
  },
  {
    label: { fr: "E-Commerce", en: "E-Commerce", es: "E-Commerce", de: "E-Commerce", pt: "E-Commerce" },
    cat: "E-Commerce",
    color: "#EC4899",
    bg: "from-[#EC4899]/15 to-[#EC4899]/5",
    border: "border-[#EC4899]/25",
    hoverBorder: "hover:border-[#EC4899]/60",
    desc: { fr: "Boutiques, mode, bijoux, beauté", en: "Stores, fashion, jewellery, beauty", es: "Tiendas, moda, joyería, belleza", de: "Shops, Mode, Schmuck, Beauty", pt: "Lojas, moda, joalheria, beleza" },
    thumbId: "impact-20",
    count: 8,
  },
  {
    label: { fr: "Minimal & Éditorial", en: "Minimal & Editorial", es: "Minimal & Editorial", de: "Minimal & Editorial", pt: "Minimal & Editorial" },
    cat: "Minimal",
    color: "#71717A",
    bg: "from-white/8 to-white/3",
    border: "border-white/12",
    hoverBorder: "hover:border-white/30",
    desc: { fr: "Portfolios épurés, blogs, presse", en: "Clean portfolios, blogs, press", es: "Portfolios limpios, blogs, prensa", de: "Minimalistische Portfolios, Blogs, Presse", pt: "Portfólios limpos, blogs, imprensa" },
    thumbId: "impact-12",
    count: 14,
  },
];

/* ─── Type card with thumbnail ───────────────────────────────── */
function TypeCard({ cat, index }: { cat: typeof TYPE_CATS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [thumbOk, setThumbOk] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { locale } = useLang();
  const lk = (locale as keyof typeof cat.label) in cat.label ? (locale as keyof typeof cat.label) : "en";
  const label = cat.label[lk];
  const desc = cat.desc[lk];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/themes?cat=${cat.cat}`}
        className={`group flex flex-col rounded-2xl border bg-gradient-to-br ${cat.bg} ${cat.border} ${cat.hoverBorder} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden border-b border-white/5 bg-zinc-900/50">
          {thumbOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/thumbnails/${cat.thumbId}.webp`}
              alt={label}
              className={`w-full h-full object-cover object-top transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
              onError={() => setThumbOk(false)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${cat.color}20, transparent)` }}
            >
              <Sparkles className="w-10 h-10 text-white opacity-30" />
            </div>
          )}
          {/* Overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to top, ${cat.color}40, transparent 60%)` }}
          />
          {/* Count badge */}
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{ background: `${cat.color}25`, color: cat.color, border: `1px solid ${cat.color}40` }}
          >
            {cat.count}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-white text-sm mb-0.5 group-hover:text-white transition-colors">{label}</div>
            <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
            style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
          >
            <ArrowRight className="w-3 h-3" style={{ color: cat.color }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Spotlight preview cards ───────────────────────────────── */
const SPOTLIGHT_IDS = ["impact-01", "impact-03", "impact-05", "impact-13", "impact-15", "impact-20"];

function SpotlightCard({ template, index }: { template: typeof TEMPLATES_REGISTRY[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [thumbOk, setThumbOk] = useState(true);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <Link href={`/templates/${template.id}`} className="group block">
        <div className="relative rounded-xl border border-white/6 bg-zinc-900/50 overflow-hidden hover:-translate-y-1 hover:border-white/15 transition-all duration-300">
          <div className="relative aspect-video overflow-hidden bg-zinc-900">
            {thumbOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/thumbnails/${template.id}.webp`}
                alt={template.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                onError={() => setThumbOk(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-zinc-900" />
            )}
          </div>
          <div className="p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{template.category}</div>
            <div className="text-sm font-bold text-white">{template.name}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function HeroSection() {
  const { locale } = useLang();
  const t = HERO_T[locale as keyof typeof HERO_T] ?? HERO_T.fr;
  const trust = TRUST_T[locale as keyof typeof TRUST_T] ?? TRUST_T.fr;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % t.rotate.length), 2800);
    return () => clearInterval(iv);
  }, [t.rotate.length]);

  const floatingCards = [
    { label: t.metrics[0], delay: 0.7, style: { top: "10%", right: "-44px" } },
    { label: t.metrics[1], delay: 0.9, style: { top: "42%", right: "-52px" } },
    { label: t.metrics[2], delay: 1.1, style: { bottom: "14%", right: "-44px" } },
  ];

  return (
    <section className="relative min-h-[calc(100vh-56px)] flex flex-col justify-center overflow-hidden pt-24 pb-12 px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[680px] h-[680px] rounded-full bg-violet-600/18 blur-[110px] animate-blob" />
        <div className="absolute top-1/4 right-[-100px] w-[520px] h-[520px] rounded-full bg-blue-600/12 blur-[130px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#09090b] to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* Left: Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl sm:text-6xl xl:text-[5.5rem] font-black tracking-tight leading-[1.0] mb-6"
            >
              <span className="text-white">{t.pre}</span>
              <span className="block relative overflow-hidden" style={{ height: "1.35em", lineHeight: 1.35, paddingTop: "0.12em", paddingBottom: "0.12em" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-115%", opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 flex items-center whitespace-nowrap text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #e879f9 50%, #60a5fa 100%)", lineHeight: 1.35 }}
                  >
                    {t.rotate[idx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-zinc-400 text-4xl sm:text-5xl xl:text-6xl font-bold">{t.post}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed mb-8"
            >
              {t.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap gap-3 mb-5"
            >
              <Link
                href="/configure"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-violet-600/30"
              >
                {t.cta1} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/themes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-700 hover:border-violet-500/60 text-zinc-300 hover:text-white font-semibold text-base transition-all"
              >
                {t.cta2}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
              className="text-zinc-600 text-sm"
            >
              {t.free}
            </motion.p>
          </div>

          {/* Right: Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-[-20px] bg-violet-600/15 blur-3xl rounded-3xl -z-10" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-black/60 overflow-hidden"
              style={{ transform: "perspective(1000px) rotateX(3deg) rotateY(-4deg)" }}
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/70 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                </div>
                <div className="flex-1 mx-3 bg-zinc-700/50 rounded-md px-3 py-1 text-[10px] font-mono text-zinc-500 truncate">
                  launch.aevia.services
                </div>
              </div>
              {/* Live thumbnail preview */}
              <div className="relative overflow-hidden bg-zinc-900" style={{ height: 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/thumbnails/impact-01.webp"
                  alt="Aperçu d'un site Aevia Launch"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
            </motion.div>

            {floatingCards.map((card, i) => {
              const MetricIcon = METRIC_ICONS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.75, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: card.delay }}
                  className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/95 border border-white/10 backdrop-blur-md shadow-xl text-xs font-semibold text-white whitespace-nowrap"
                  style={card.style}
                >
                  <MetricIcon className="w-3.5 h-3.5 text-violet-400" />
                  {card.label}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Trust ticker */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-14 overflow-hidden border-t border-zinc-800/60 pt-8"
        >
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...trust, ...trust].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-600 text-sm shrink-0">
                <CheckCircle2 className="w-4 h-4 text-violet-600/60" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Choose type section ────────────────────────────────────── */
function ChooseTypeSection() {
  const { locale } = useLang();
  const t = HERO_T[locale as keyof typeof HERO_T] ?? HERO_T.fr;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-6 pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                {t.choose}
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base">{t.chooseSub}</p>
            </div>
            <Link
              href="/themes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-violet-500 text-zinc-300 hover:text-white text-sm font-semibold transition-all shrink-0"
            >
              {t.explore} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Type grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {TYPE_CATS.map((cat, i) => (
            <TypeCard key={cat.cat} cat={cat} index={i} />
          ))}
        </div>

        {/* Spotlight templates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.spotlight}</p>
            <Link href="/themes" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              {t.seeAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {TEMPLATES_REGISTRY.filter(t => SPOTLIGHT_IDS.includes(t.id)).map((t, i) => (
              <SpotlightCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Steps ──────────────────────────────────────────────────── */
function StepsSection() {
  const { locale } = useLang();
  const t = HERO_T[locale as keyof typeof HERO_T] ?? HERO_T.fr;
  const steps = STEPS_T[locale as keyof typeof STEPS_T] ?? STEPS_T.fr;
  const icons = [<Palette key="p" className="w-6 h-6" />, <Zap key="z" className="w-6 h-6" />, <Rocket key="r" className="w-6 h-6" />];

  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-white mb-12">{t.how}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <div className="w-12 h-12 rounded-xl bg-violet-600/15 flex items-center justify-center text-violet-400 mb-4">
                {icons[i]}
              </div>
              <div className="text-xs font-bold text-violet-400 mb-2">Step {i + 1}</div>
              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
function CtaSection() {
  const { locale } = useLang();
  const t = HERO_T[locale as keyof typeof HERO_T] ?? HERO_T.fr;

  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{t.ready}</h2>
        <p className="text-zinc-400 mb-8">{t.readySub}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/configure"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all duration-200 hover:scale-105">
            {t.startFree} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/themes"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-lg transition-colors">
            {t.explore} <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div id="main-content" className="min-h-screen bg-[#09090b] text-white">
      <AeviaHeader />
      <HeroSection />
      <StepsSection />
      <ChooseTypeSection />
      <CtaSection />
      <LegalFooter />
    </div>
  );
}
