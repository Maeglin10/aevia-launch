"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Palette, Rocket, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
import { useLang } from "@/lib/LangContext";
import { AeviaHeader } from "@/components/AeviaHeader";

/* ─── Translations ─────────────────────────────────────────── */
const HERO_T = {
  fr: {
    badge: "Sites livrés en 2 heures",
    pre: "Votre",
    post: "en ligne aujourd'hui.",
    rotate: ["Landing Page", "Boutique en ligne", "Site vitrine", "Portfolio"],
    sub: "Notre IA rédige votre contenu, vous choisissez un thème, on lance en 2 heures. C'est tout.",
    cta1: "Créer mon site",
    cta2: "Voir les 100 thèmes",
    free: "Aperçu gratuit · sans carte bancaire",
    metrics: ["Live en 2h ⚡", "IA rédige ✦", "SEO optimisé 🔍"],
    how: "Comment ça marche",
    ready: "Prêt à vous lancer ?",
    readySub: "Des centaines d'entreprises ont leur site en 2 heures.",
    startFree: "Commencer gratuitement",
    explore: "Explorer les thèmes",
  },
  en: {
    badge: "Websites delivered in 2 hours",
    pre: "Your",
    post: "online today.",
    rotate: ["Landing Page", "Online Store", "Business Site", "Portfolio"],
    sub: "Our AI writes your content, you pick a theme, we launch in 2 hours. That's it.",
    cta1: "Build my site",
    cta2: "Browse 100 themes",
    free: "Free preview · no credit card required",
    metrics: ["Live in 2h ⚡", "AI-written ✦", "SEO optimised 🔍"],
    how: "How it works",
    ready: "Ready to go live?",
    readySub: "Join hundreds of businesses who got their website in 2 hours.",
    startFree: "Start for free",
    explore: "Explore themes",
  },
  es: {
    badge: "Sitios web entregados en 2 horas",
    pre: "Tu",
    post: "online hoy.",
    rotate: ["Landing Page", "Tienda Online", "Sitio Web", "Portfolio"],
    sub: "Nuestra IA escribe el contenido, tú eliges el tema, lanzamos en 2 horas. Así de simple.",
    cta1: "Crear mi sitio",
    cta2: "Ver 100 temas",
    free: "Vista previa gratis · sin tarjeta",
    metrics: ["Online en 2h ⚡", "IA-escribe ✦", "SEO optimizado 🔍"],
    how: "Cómo funciona",
    ready: "¿Listo para lanzar?",
    readySub: "Cientos de empresas tienen su sitio en 2 horas.",
    startFree: "Empezar gratis",
    explore: "Explorar temas",
  },
  de: {
    badge: "Websites in 2 Stunden geliefert",
    pre: "Deine",
    post: "heute online.",
    rotate: ["Landing Page", "Online-Shop", "Firmenwebsite", "Portfolio"],
    sub: "Unsere KI schreibt den Inhalt, du wählst ein Theme, wir launchen in 2 Stunden.",
    cta1: "Meine Website erstellen",
    cta2: "100 Themes ansehen",
    free: "Kostenlose Vorschau · keine Kreditkarte",
    metrics: ["Online in 2h ⚡", "KI-geschrieben ✦", "SEO-optimiert 🔍"],
    how: "So funktioniert es",
    ready: "Bereit zum Launch?",
    readySub: "Hunderte Unternehmen haben ihre Website in 2 Stunden.",
    startFree: "Kostenlos starten",
    explore: "Themes erkunden",
  },
  pt: {
    badge: "Sites entregues em 2 horas",
    pre: "O seu",
    post: "online hoje.",
    rotate: ["Landing Page", "Loja Online", "Site Vitrine", "Portfolio"],
    sub: "A nossa IA escreve o conteúdo, você escolhe o tema, lançamos em 2 horas. Simples assim.",
    cta1: "Criar o meu site",
    cta2: "Ver 100 temas",
    free: "Pré-visualização grátis · sem cartão",
    metrics: ["Online em 2h ⚡", "IA-escrito ✦", "SEO otimizado 🔍"],
    how: "Como funciona",
    ready: "Pronto para lançar?",
    readySub: "Centenas de empresas têm o seu site em 2 horas.",
    startFree: "Começar grátis",
    explore: "Explorar temas",
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

/* ─── Constants ─────────────────────────────────────────────── */
const HOMEPAGE_TABS = [
  { label: "Landing", value: "landing", icon: "🚀" },
  { label: "Business", value: "business", icon: "🏢" },
  { label: "Shop", value: "ecommerce", icon: "🛍️" },
  { label: "Premium", value: "premium", icon: "💎" },
  { label: "Portfolio", value: "portfolio", icon: "💼" },
];

const FEATURED_THEMES = [
  { id: "luxury",      label: "Luxury & Couture",   icon: "💎", color: "#c9a96e", desc: "Dark marble, gold accents" },
  { id: "aurora",      label: "Aurora Wellness",     icon: "✦",  color: "#a855f7", desc: "Iridescent gradients" },
  { id: "3d-tech",     label: "3D Tech & Web3",      icon: "⬡",  color: "#06b6d4", desc: "Holographic grid" },
  { id: "brutalist",   label: "Brutalist Editorial", icon: "◼",  color: "#ffffff", desc: "Raw, massive type" },
  { id: "minimal-pro", label: "Minimal Pro",         icon: "—",  color: "#71717a", desc: "Swiss precision" },
  { id: "magazine",    label: "Magazine",            icon: "📰", color: "#f59e0b", desc: "Editorial grid" },
];

const FEATURED_IMPACT = TEMPLATES_REGISTRY.filter((_, i) => [0, 4, 8, 15, 22, 30].includes(i));

const STYLE_COLOR: Record<string, string> = { Dark: "#6366f1", Light: "#10b981", Vibrant: "#f59e0b" };
const CAT_COLOR: Record<string, string> = { Tech: "#2563eb", Luxury: "#c9a96e", Editorial: "#f59e0b", Creative: "#a855f7", Minimal: "#71717a" };

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
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[680px] h-[680px] rounded-full bg-violet-600/18 blur-[110px] animate-blob" />
        <div className="absolute top-1/4 right-[-100px] w-[520px] h-[520px] rounded-full bg-blue-600/12 blur-[130px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[100px] animate-blob animation-delay-4000" />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#09090b] to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* ── Left: Text ── */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-300 text-xs font-semibold mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              {t.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl sm:text-6xl xl:text-[5.5rem] font-black tracking-tight leading-[1.0] mb-6"
            >
              <span className="text-white">{t.pre}</span>
              {/* Rotating word */}
              <span className="block relative overflow-hidden" style={{ height: "1.1em" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-105%", opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 flex items-center text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #e879f9 50%, #60a5fa 100%)" }}
                  >
                    {t.rotate[idx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-zinc-400 text-4xl sm:text-5xl xl:text-6xl font-bold">{t.post}</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed mb-8"
            >
              {t.sub}
            </motion.p>

            {/* CTAs */}
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

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {HOMEPAGE_TABS.map(tab => (
                <Link key={tab.value} href={`/themes?type=${tab.value}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/4 border border-white/6 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group text-xs font-bold text-zinc-500 group-hover:text-white uppercase tracking-wider"
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Browser mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block relative"
          >
            {/* Glow */}
            <div className="absolute inset-[-20px] bg-violet-600/15 blur-3xl rounded-3xl -z-10" />

            {/* Browser chrome */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-black/60 overflow-hidden"
              style={{ transform: "perspective(1000px) rotateX(3deg) rotateY(-4deg)" }}
            >
              {/* Tab bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/70 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                </div>
                <div className="flex-1 mx-3 bg-zinc-700/50 rounded-md px-3 py-1 text-[10px] font-mono text-zinc-500 truncate">
                  aevia-launch.vercel.app/demo/landing
                </div>
              </div>

              {/* Page preview simulation */}
              <div className="bg-[#0a0a0f] p-4 space-y-3 h-[260px] overflow-hidden">
                {/* Hero area */}
                <div className="h-[108px] rounded-xl bg-gradient-to-br from-violet-900/50 to-blue-900/30 border border-white/5 flex items-center gap-4 px-5">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-white/60" />
                    <div className="h-2 w-36 rounded bg-white/25" />
                    <div className="h-2 w-22 rounded bg-white/15 mt-1" />
                    <div className="mt-3 h-5 w-20 rounded-full bg-violet-500/70" />
                  </div>
                  <div className="w-20 h-20 rounded-xl bg-violet-600/20 border border-violet-500/15 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-violet-500/30" />
                  </div>
                </div>

                {/* Features row */}
                <div className="grid grid-cols-3 gap-2">
                  {["#6366f1", "#a855f7", "#06b6d4"].map((c, i) => (
                    <div key={i} className="h-[52px] rounded-lg bg-zinc-800/50 border border-white/4 p-2.5 space-y-1.5">
                      <div className="w-4 h-4 rounded" style={{ background: `${c}50` }} />
                      <div className="h-1.5 w-full rounded bg-white/15" />
                      <div className="h-1.5 w-2/3 rounded bg-white/8" />
                    </div>
                  ))}
                </div>

                {/* Content blocks */}
                <div className="h-[40px] rounded-xl bg-zinc-800/40 border border-white/4 flex items-center gap-3 px-3">
                  <div className="h-2 flex-1 rounded bg-white/10" />
                  <div className="h-2 w-20 rounded bg-white/5" />
                </div>
              </div>
            </motion.div>

            {/* Floating metric cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.75, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.45, delay: card.delay }}
                className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/95 border border-white/10 backdrop-blur-md shadow-xl text-xs font-semibold text-white whitespace-nowrap"
                style={card.style}
              >
                {card.label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Trust ticker ── */}
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

/* ─── Sub-sections ───────────────────────────────────────────── */
function FeaturedThemeCard({ theme }: { theme: typeof FEATURED_THEMES[0] }) {
  return (
    <Link href={`/themes/${theme.id}`} className="group block">
      <div
        className="relative rounded-2xl border p-6 h-40 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ background: "linear-gradient(135deg, #0f0f11 0%, #13131a 100%)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.color}15 0%, transparent 70%)` }} />
        <div className="relative"><span className="text-2xl">{theme.icon}</span></div>
        <div className="relative">
          <div className="text-white font-bold text-sm leading-tight">{theme.label}</div>
          <div className="text-xs mt-1" style={{ color: theme.color }}>{theme.desc}</div>
        </div>
      </div>
    </Link>
  );
}

function ImpactCard({ t }: { t: typeof TEMPLATES_REGISTRY[0] }) {
  const catColor = CAT_COLOR[t.category] ?? "#6366f1";
  const styleColor = STYLE_COLOR[t.style] ?? "#6366f1";
  return (
    <Link href={`/templates/${t.id}`} className="group block">
      <div
        className="relative rounded-xl border p-5 h-36 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ background: "linear-gradient(135deg, #0a0a0d 0%, #111118 100%)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${catColor}12 0%, transparent 70%)` }} />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}25` }}>
            {t.category}
          </span>
          <span className="text-[9px] text-zinc-600 font-mono">{t.id}</span>
        </div>
        <div className="relative">
          <div className="text-white font-bold text-sm leading-tight">{t.name}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: styleColor }} />
            <span className="text-[10px] text-zinc-500">{t.style}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ThemesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-6 pb-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Theme Library</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              100 themes.<br /><span className="text-zinc-500">One click to preview.</span>
            </h2>
          </div>
          <Link href="/themes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-violet-500 text-zinc-300 hover:text-white text-sm font-semibold transition-all duration-200 shrink-0">
            Browse all themes <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="mb-4">
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Site Builder — 21 themes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {FEATURED_THEMES.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
                <FeaturedThemeCard theme={t} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }} className="mb-8">
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Impact Vault — 100 templates</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {FEATURED_IMPACT.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}>
                <ImpactCard t={t} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 py-6 border-t border-zinc-800">
          {[{ n: "100", label: "Total themes" }, { n: "14", label: "Style categories" }, { n: "23", label: "Site builder templates" }, { n: "77", label: "Impact vault templates" }].map(({ n, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{n}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
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

/* ─── Trust ──────────────────────────────────────────────────── */
function TrustSection() {
  const { locale } = useLang();
  const t = HERO_T[locale as keyof typeof HERO_T] ?? HERO_T.fr;
  const trust = TRUST_T[locale as keyof typeof TRUST_T] ?? TRUST_T.fr;

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="p-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-violet-600/10 to-blue-600/5">
          <h2 className="text-center text-xl font-bold text-white mb-8">Everything included</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {trust.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-zinc-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
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
      <ThemesSection />
      <TrustSection />
      <CtaSection />
      <footer className="border-t border-zinc-800 px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-4 text-center text-zinc-500 text-sm">
          <div>
            © 2026 AeviaLaunch — A product by{" "}
            <a href="https://aevia.vercel.app" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Aevia</a>
            {" · "}
            <Link href="/themes" className="hover:text-zinc-300 transition-colors">Templates</Link>
            {" · "}
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Tarifs</Link>
            {" · "}
            <Link href="/configure" className="hover:text-zinc-300 transition-colors">Créer mon site</Link>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
            <a href="https://aevia.vercel.app/fr/legal/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Politique de confidentialité</a>
            <a href="https://aevia.vercel.app/fr/legal/terms" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">CGU</a>
            <a href="https://aevia.vercel.app/fr/legal/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
