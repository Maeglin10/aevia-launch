"use client";

import { use, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Sparkles, Globe, ChevronDown,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Hexagon, Minus,
  type LucideIcon,
} from "lucide-react";
import type { SessionData } from "@/lib/sessions";
import { generateMockContent } from "@/lib/mockContent";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

const T = {
  fr: { allThemes: "Tous les thèmes", premium: "Premium", useTheme: "Utiliser ce thème", preview: "aperçu", demoMode: "Mode démo", livePreview: "Aperçu en direct avec contenu d'exemple", buildWith: "Créer avec ce thème" },
  en: { allThemes: "All themes", premium: "Premium", useTheme: "Use this theme", preview: "preview", demoMode: "Demo mode", livePreview: "This is a live preview with sample content", buildWith: "Build with this" },
  es: { allThemes: "Todos los temas", premium: "Premium", useTheme: "Usar este tema", preview: "vista previa", demoMode: "Modo demo", livePreview: "Vista previa en vivo con contenido de ejemplo", buildWith: "Crear con este tema" },
  de: { allThemes: "Alle Themes", premium: "Premium", useTheme: "Dieses Theme verwenden", preview: "Vorschau", demoMode: "Demo-Modus", livePreview: "Live-Vorschau mit Beispielinhalten", buildWith: "Damit erstellen" },
  pt: { allThemes: "Todos os temas", premium: "Premium", useTheme: "Usar este tema", preview: "pré-visualização", demoMode: "Modo demo", livePreview: "Pré-visualização ao vivo com conteúdo de exemplo", buildWith: "Criar com este tema" },
};

function PreviewLangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = LOCALE_META.find((l) => l.code === locale) ?? LOCALE_META[0];
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          {LOCALE_META.map((l) => (
            <button key={l.code} onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-800 ${l.code === locale ? "text-white font-semibold" : "text-zinc-400"}`}
            >
              <span>{l.flag}</span><span>{l.label}</span>
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Prevent SSR to avoid Framer Motion useScroll ref hydration error
const GeneratedSite = dynamic(
  () => import("@/components/GeneratedSite"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-600">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading preview…</p>
        </div>
      </div>
    ),
  }
);

// All available themes with display metadata
const THEMES_META: Record<string, { label: string; icon: LucideIcon; category: string; premium: boolean }> = {
  landing:      { label: "Landing Page",        icon: Rocket,          category: "Marketing",   premium: false },
  saas:         { label: "SaaS Product",         icon: Zap,             category: "Tech",        premium: false },
  agency:       { label: "Creative Agency",      icon: Palette,         category: "Agency",      premium: false },
  vitrine:      { label: "Business Vitrine",     icon: Building2,       category: "Business",    premium: false },
  consultant:   { label: "Consultant & Coach",   icon: Target,          category: "Personal",    premium: false },
  portfolio:    { label: "Portfolio",            icon: Briefcase,       category: "Personal",    premium: false },
  ecommerce:    { label: "E-commerce Store",     icon: ShoppingBag,     category: "Commerce",    premium: false },
  restaurant:   { label: "Restaurant & Food",    icon: UtensilsCrossed, category: "Hospitality", premium: false },
  hotel:        { label: "Hotel & B&B",          icon: BedDouble,       category: "Hospitality", premium: false },
  healthcare:   { label: "Healthcare & Clinic",  icon: Stethoscope,     category: "Health",      premium: false },
  realestate:   { label: "Real Estate",          icon: Home,            category: "Property",    premium: false },
  fitness:      { label: "Fitness & Wellness",   icon: Dumbbell,        category: "Health",      premium: false },
  event:        { label: "Event & Conference",   icon: CalendarDays,    category: "Events",      premium: false },
  nonprofit:    { label: "Non-profit & NGO",     icon: Heart,           category: "Social",      premium: false },
  startup:      { label: "Startup Launch",       icon: Star,            category: "Tech",        premium: false },
  luxury:       { label: "Luxury & Couture",     icon: Gem,             category: "Premium",     premium: true },
  brutalist:    { label: "Brutalist Editorial",  icon: Square,          category: "Premium",     premium: true },
  magazine:     { label: "Magazine & Editorial", icon: Newspaper,       category: "Premium",     premium: true },
  aurora:       { label: "Aurora & Wellness",    icon: Sparkles,        category: "Premium",     premium: true },
  "3d-tech":    { label: "3D Tech & Web3",       icon: Hexagon,         category: "Premium",     premium: true },
  "minimal-pro":{ label: "Minimal Pro",          icon: Minus,           category: "Premium",     premium: true },
};

const ORDERED_THEME_IDS = [
  "landing", "saas", "agency", "vitrine", "consultant", "portfolio",
  "ecommerce", "restaurant", "hotel", "healthcare", "realestate", "fitness",
  "event", "nonprofit", "startup", "luxury", "brutalist", "magazine",
  "aurora", "3d-tech", "minimal-pro",
];

// Mock form data tailored per template for most realistic previews
const MOCK_FORM_DATA: Record<string, { businessName: string; businessType: string; tagline: string; city: string; brandColor: string }> = {
  landing:      { businessName: "Launchify",         businessType: "SaaS",         tagline: "Launch faster",              city: "San Francisco",  brandColor: "#7c3aed" },
  saas:         { businessName: "NexusAI",            businessType: "SaaS",         tagline: "Intelligence at scale",      city: "New York",       brandColor: "#2563eb" },
  agency:       { businessName: "Studio Volta",       businessType: "Agency",       tagline: "Digital experiences",        city: "London",         brandColor: "#d97706" },
  vitrine:      { businessName: "Meridian Partners",  businessType: "Consultant",   tagline: "Results you can measure",    city: "Paris",          brandColor: "#059669" },
  consultant:   { businessName: "Claire Moreau",      businessType: "Coach",        tagline: "Your breakthrough starts",   city: "Lyon",           brandColor: "#0891b2" },
  portfolio:    { businessName: "Alex Torres",        businessType: "Portfolio",    tagline: "Design that tells stories",  city: "Barcelona",      brandColor: "#7c3aed" },
  ecommerce:    { businessName: "Maison Blanche",     businessType: "E-commerce",   tagline: "Curated essentials",         city: "Paris",          brandColor: "#dc2626" },
  restaurant:   { businessName: "Le Jardin",          businessType: "Restaurant",   tagline: "Where every meal matters",   city: "Bordeaux",       brandColor: "#d97706" },
  hotel:        { businessName: "Hôtel Lumière",      businessType: "Hotel",        tagline: "A place apart",              city: "Nice",           brandColor: "#b45309" },
  healthcare:   { businessName: "Centre Santé+",      businessType: "Healthcare",   tagline: "Your health, our priority",  city: "Nantes",         brandColor: "#16a34a" },
  realestate:   { businessName: "Étoile Immobilier",  businessType: "RealEstate",   tagline: "Find the place you love",    city: "Marseille",      brandColor: "#7c3aed" },
  fitness:      { businessName: "Form Studio",        businessType: "Fitness",      tagline: "Transform your body",        city: "Toulouse",       brandColor: "#dc2626" },
  event:        { businessName: "Summit 2026",        businessType: "Event",        tagline: "Ideas worth following",      city: "Geneva",         brandColor: "#9333ea" },
  nonprofit:    { businessName: "Terre & Avenir",     businessType: "NonProfit",    tagline: "Together we change things",  city: "Brussels",       brandColor: "#e11d48" },
  startup:      { businessName: "Orbit",              businessType: "Startup",      tagline: "We're changing how work",    city: "Berlin",         brandColor: "#7c3aed" },
  luxury:       { businessName: "Maison Aurore",      businessType: "Luxury",       tagline: "Crafted for those who know", city: "Paris",          brandColor: "#c9a96e" },
  brutalist:    { businessName: "Studio FORM",        businessType: "Brutalist",    tagline: "Form follows force",         city: "Oslo",           brandColor: "#ffffff" },
  magazine:     { businessName: "Meridian",           businessType: "Magazine",     tagline: "Ideas worth following",      city: "London",         brandColor: "#1e1e1e" },
  aurora:       { businessName: "Lumière",            businessType: "Aurora",       tagline: "Radiate from within",        city: "Copenhagen",     brandColor: "#a855f7" },
  "3d-tech":    { businessName: "NexusAI",            businessType: "TechAI",       tagline: "Intelligence at the edge",   city: "San Francisco",  brandColor: "#06b6d4" },
  "minimal-pro":{ businessName: "Studio Blanc",       businessType: "MinimalPro",   tagline: "Space. Light. Purpose.",     city: "Zurich",         brandColor: "#18181b" },
};

function buildMockSession(id: string): SessionData {
  const meta = MOCK_FORM_DATA[id] ?? MOCK_FORM_DATA["landing"];

  const formData = {
    businessName: meta.businessName,
    businessType: meta.businessType,
    tagline: meta.tagline,
    city: meta.city,
    mainService: "Premium service",
    benefits: ["Exceptional quality", "Expert team", "Proven results"] as [string, string, string],
    priceRange: "Premium",
    targetAudience: "Discerning clients",
    brandColor: meta.brandColor,
    tone: "Professional",
    template: id,
    email: "hello@example.com",
    phone: "+33 1 23 45 67 89",
    instagram: "@example",
    linkedin: "linkedin.com/company/example",
  };

  const generatedContent = generateMockContent(formData);

  return {
    id: `preview-${id}`,
    formData,
    generatedContent,
    createdAt: new Date(),
  };
}

export default function ThemePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const meta = THEMES_META[id];

  // Optional ?session=<id> → render this theme with a REAL generated session
  // (e.g. a client's actual content) instead of the generic mock. Falls back
  // to mock if the param is missing or the session can't be loaded.
  const [realSession, setRealSession] = useState<SessionData | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sid = new URLSearchParams(window.location.search).get("session");
    if (!sid) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/sessions?id=${encodeURIComponent(sid)}`);
        if (!res.ok) return;
        const data = (await res.json()) as SessionData;
        if (!cancelled && data?.generatedContent) setRealSession(data);
      } catch {
        /* fall back to mock */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!meta) notFound();

  const ThemeIcon = meta.icon;

  // Use the real client session when loaded; force the rendered theme to this
  // page's theme id so you can preview the same content across themes.
  const session: SessionData = realSession
    ? { ...realSession, formData: { ...realSession.formData, template: id } }
    : buildMockSession(id);

  const currentIndex = ORDERED_THEME_IDS.indexOf(id);
  const prevId = currentIndex > 0 ? ORDERED_THEME_IDS[currentIndex - 1] : null;
  const nextId = currentIndex < ORDERED_THEME_IDS.length - 1 ? ORDERED_THEME_IDS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Floating top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: navigation */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/themes"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.allThemes}</span>
          </Link>

          <span className="text-zinc-700 hidden sm:inline">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <ThemeIcon className="w-4 h-4 text-zinc-300" />
            <div className="min-w-0">
              <span className="text-white text-sm font-semibold truncate block">{meta.label}</span>
            </div>
            {meta.premium && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0" style={{ background: "#c9a96e20", border: "1px solid #c9a96e40" }}>
                <Sparkles className="w-3 h-3" style={{ color: "#c9a96e" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c9a96e" }}>{t.premium}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: prev / next */}
        <div className="flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/themes/${prevId}`}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center opacity-30">
              <ArrowLeft className="w-4 h-4 text-zinc-600" />
            </div>
          )}
          <span className="text-zinc-600 text-xs font-mono tabular-nums hidden sm:inline">
            {currentIndex + 1} / {ORDERED_THEME_IDS.length}
          </span>
          {nextId ? (
            <Link
              href={`/themes/${nextId}`}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center opacity-30">
              <ArrowRight className="w-4 h-4 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Right: language + CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <PreviewLangSwitcher />
          <Link
            href={`/configure?template=${id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shrink-0"
          >
            <span className="hidden sm:inline">{t.useTheme}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Browser chrome mockup */}
      <div className="pt-14">
        <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded px-3 py-1 text-zinc-500 text-xs font-mono truncate">
            {t.preview} — {session.formData.businessName} · {meta.label}
          </div>
          <div className="shrink-0 text-[10px] text-zinc-600 font-mono uppercase tracking-widest hidden sm:block">
            {t.demoMode}
          </div>
        </div>

        {/* The actual site — only render client-side to avoid FM ref hydration error */}
        {mounted && <GeneratedSite session={session} />}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div
          className="pointer-events-auto mx-auto max-w-lg mb-6 mx-6 sm:mx-auto rounded-2xl border border-zinc-700/80 px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-md"
          style={{ background: "rgba(9, 9, 11, 0.92)" }}
        >
          <div>
            <p className="flex items-center gap-1.5 text-white text-sm font-semibold"><ThemeIcon className="w-4 h-4" /> {meta.label}</p>
            <p className="text-zinc-500 text-xs">{t.livePreview}</p>
          </div>
          <Link
            href={`/configure?template=${id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors shrink-0"
          >
            {t.buildWith}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
