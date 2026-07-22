"use client";

import { useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
import { INDUSTRIES, SECTOR_TEMPLATES, TEMPLATE_CITY_LABELS, type IndustryInfo, type SectorInfo } from "@/lib/templates/sectors";
import { TEMPLATE_PAGE_TYPE, type PageType } from "@/lib/templates/pageType";
import { TEMPLATE_I18N } from "@/lib/templates/registry-i18n";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";
import { useLang } from "@/lib/LangContext";

// ─── Quality filter ───────────────────────────────────────────────────────────
// Only truly missing page.tsx files are hidden — everything else is shown for audit.
const HIDDEN_IMPACT = new Set([
  "impact-202","impact-203","impact-204","impact-205","impact-206",
]);

// ─── Featured (hand-picked best) ─────────────────────────────────────────────
const FEATURED = new Set([
  // Gold Tailwind rewrites (impact-22–29)
  "impact-22","impact-23","impact-24","impact-25","impact-26","impact-27","impact-28","impact-29",
  // Classic gold (impact-01–21)
  "impact-01","impact-03","impact-05","impact-10","impact-13","impact-15","impact-17","impact-19","impact-20","impact-21",
  // Solid mid-range
  "impact-57","impact-63","impact-72","impact-81","impact-82","impact-85","impact-86","impact-91",
]);

// ─── Translations (carry over from former showcase) ───────────────────────────
const T = {
  fr: {
    title: "Quel type de site ?",
    sub: "Choisissez votre catégorie — on a le thème parfait pour vous.",
    spotlight: "Coup de projecteur",
    spotlightSub: "Nos meilleurs templates du moment.",
    cta: "Créer mon site",
    filters: "Filtres",
    allCats: "Toutes catégories",
    clear: "Effacer",
    ready: "Prêt à vous lancer ?",
    readySub: "Pick a theme, fill the form, our AI writes your copy — deployed on your domain, fully optimised.",
    startBuilding: "Commencer — c'est gratuit",
    moreThemes: "autres thèmes",
    noMatch: "Aucun thème ne correspond à",
    clearFilters: "Réinitialiser les filtres",
    themesCount: "thèmes",
    search: "Rechercher un thème…",
    featured: "Sélection",
    featuredPicks: "favoris",
    industryFilter: "Secteur d'activité",
    allIndustries: "Tous les secteurs",
    specialtyFilter: "Spécialité / Métier",
    allSpecialties: "Tous les métiers",
    pageTypeFilter: "Type de page",
    allPageTypes: "Tous types",
    landing: "Landing Page",
    fullsite: "Site complet",
    filteredBy: "Filtré par :",
    seeAll: "Voir tous",
  },
  en: {
    title: "What type of site?",
    sub: "Choose your category — we have the perfect theme for you.",
    spotlight: "Spotlight",
    spotlightSub: "Our best templates right now.",
    cta: "Build my site",
    filters: "Filters",
    allCats: "All categories",
    clear: "Clear",
    ready: "Ready to go live?",
    readySub: "Pick a theme, fill the form, our AI writes your copy — deployed on your domain, fully optimised.",
    startBuilding: "Start building — it's free",
    moreThemes: "more themes",
    noMatch: "No themes match",
    clearFilters: "Clear filters",
    themesCount: "themes",
    search: "Search themes…",
    featured: "Featured",
    featuredPicks: "picks",
    industryFilter: "Industry",
    allIndustries: "All industries",
    specialtyFilter: "Specialty / Profession",
    allSpecialties: "All specialties",
    pageTypeFilter: "Page type",
    allPageTypes: "All types",
    landing: "Landing Page",
    fullsite: "Full site",
    filteredBy: "Filtered by:",
    seeAll: "See all",
  },
  es: {
    title: "¿Qué tipo de sitio?",
    sub: "Elige tu categoría — tenemos el tema perfecto para ti.",
    spotlight: "Destacados",
    spotlightSub: "Nuestras mejores plantillas ahora mismo.",
    cta: "Crear mi sitio",
    filters: "Filtros",
    allCats: "Todas las categorías",
    clear: "Limpiar",
    ready: "¿Listo para lanzar?",
    readySub: "Elige un tema, rellena el formulario, nuestra IA escribe el texto — desplegado en tu dominio.",
    startBuilding: "Empezar — es gratis",
    moreThemes: "más temas",
    noMatch: "Ningún tema coincide con",
    clearFilters: "Limpiar filtros",
    themesCount: "temas",
    search: "Buscar temas…",
    featured: "Destacados",
    featuredPicks: "elegidos",
    industryFilter: "Sector de actividad",
    allIndustries: "Todos los sectores",
    specialtyFilter: "Especialidad / Profesión",
    allSpecialties: "Todas las profesiones",
    pageTypeFilter: "Tipo de página",
    allPageTypes: "Todos los tipos",
    landing: "Landing Page",
    fullsite: "Sitio completo",
    filteredBy: "Filtrado por:",
    seeAll: "Ver todos",
  },
  de: {
    title: "Welche Art von Website?",
    sub: "Wähle deine Kategorie — wir haben das perfekte Theme für dich.",
    spotlight: "Spotlight",
    spotlightSub: "Unsere besten Templates gerade jetzt.",
    cta: "Meine Website erstellen",
    filters: "Filter",
    allCats: "Alle Kategorien",
    clear: "Zurücksetzen",
    ready: "Bereit, live zu gehen?",
    readySub: "Wähle ein Theme, fülle das Formular aus, unsere KI schreibt deine Texte.",
    startBuilding: "Starten — kostenlos",
    moreThemes: "weitere Themes",
    noMatch: "Keine Themes passen zu",
    clearFilters: "Filter zurücksetzen",
    themesCount: "themes",
    search: "Themes suchen…",
    featured: "Empfohlen",
    featuredPicks: "picks",
    industryFilter: "Branche",
    allIndustries: "Alle Branchen",
    specialtyFilter: "Spezialität / Beruf",
    allSpecialties: "Alle Berufe",
    pageTypeFilter: "Seitentyp",
    allPageTypes: "Alle Typen",
    landing: "Landing Page",
    fullsite: "Komplette Website",
    filteredBy: "Gefiltert nach:",
    seeAll: "Alle anzeigen",
  },
  pt: {
    title: "Que tipo de site?",
    sub: "Escolha a sua categoria — temos o tema perfeito para você.",
    spotlight: "Destaques",
    spotlightSub: "Nossos melhores templates agora.",
    cta: "Criar meu site",
    filters: "Filtros",
    allCats: "Todas as categorias",
    clear: "Limpar",
    ready: "Pronto para lançar?",
    readySub: "Escolha um tema, preencha o formulário, nossa IA escreve seu texto.",
    startBuilding: "Começar — é grátis",
    moreThemes: "mais temas",
    noMatch: "Nenhum tema corresponde a",
    clearFilters: "Limpar filtros",
    themesCount: "temas",
    search: "Pesquisar temas…",
    featured: "Destaques",
    featuredPicks: "selecionados",
    industryFilter: "Setor de atividade",
    allIndustries: "Todos os setores",
    specialtyFilter: "Especialidade / Profissão",
    allSpecialties: "Todas as profissões",
    pageTypeFilter: "Tipo de página",
    allPageTypes: "Todos os tipos",
    landing: "Landing Page",
    fullsite: "Site completo",
    filteredBy: "Filtrado por:",
    seeAll: "Ver todos",
  },
};

// ─── Unified category system ──────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Tech:          "#2563eb",
  Creative:      "#a855f7",
  Luxury:        "#c9a96e",
  Minimal:       "#71717a",
  Editorial:     "#f59e0b",
  Corporate:     "#0ea5e9",
  "E-Commerce":  "#ec4899",
  Health:        "#14b8a6",
  Hospitality:   "#f43f5e",
  Services:      "#ef4444",
  Education:     "#3b82f6",
  Finance:       "#22c55e",
  "Food & Drink":"#fb923c",
};

const CATS = [
  "All", "Tech", "Creative", "Luxury", "Minimal", "Editorial",
  "Corporate", "Finance", "E-Commerce", "Health", "Hospitality",
  "Food & Drink", "Services", "Education"
];

// ─── Business-niche (industry → specialty) colors, ported from GalleryShowcase ─
const INDUSTRY_COLOR: Record<string, string> = {
  sante: "#14b8a6",
  services: "#f59e0b",
  droit_finance: "#3b82f6",
  restauration: "#ef4444",
  sport_coaching: "#ef4444",
  art_creation: "#ec4899",
  evenementiel: "#10b981",
  beaute: "#8a6d3f",
  immobilier_architecture: "#44576b",
  hebergement: "#12294a",
};

// ─── Page-type filter colors ────────────────────────────────────────────────
const PAGETYPE_COLOR: Record<PageType, string> = {
  landing: "#38bdf8",
  fullsite: "#f97316",
};

// ─── Theme item type ──────────────────────────────────────────────────────────
interface ThemeItem {
  id: string;
  label: string;
  desc: string;
  category: string;
  href: string;
  source: "builder" | "impact";
  featured: boolean;
  pageType: PageType;
  specialtyId?: string;
  specialtyLabel?: string;
  specialtyEmoji?: string;
  industryId?: string;
  cityLabel?: string;
}

// ─── Thumbnail card (Showcase-style design) ────────────────────────────────────
function ThumbCard({ item, index }: { item: ThemeItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = CAT_COLOR[item.category] ?? "#dc2626";
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const thumbSrc = `/thumbnails/${item.id}.webp`;

  // Handle case where browser already has image cached — onLoad won't fire
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setThumbLoaded(true);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min((index % 8) * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={item.href} className="block h-full cursor-pointer">
        <div
          className="relative rounded-2xl border overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg,#0a0a0d,#111118)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
            style={{ background: `radial-gradient(circle at 50% 0%, ${accent}33 0%, transparent 70%)` }}
          />

          {/* ── Preview area ── */}
          <div className="w-full aspect-video relative overflow-hidden bg-[#050506] border-b border-white/5 shrink-0">
            {/* Fallback placeholder: shown until image loads OR if it fails */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              style={{ background: `linear-gradient(135deg, ${accent}22 0%, #050506 100%)` }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 opacity-30 border border-white/10 group-hover:scale-110 group-hover:opacity-50 transition-all duration-700">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">{item.category}</span>
              <h3 className="text-xl font-bold text-white/60 group-hover:text-white transition-colors duration-700 tracking-tighter uppercase">{item.label}</h3>
            </div>

            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={thumbSrc}
                alt={item.label}
                loading={index < 8 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < 6 ? "high" : "auto"}
                className="absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-300"
                style={{
                  opacity: thumbLoaded ? 1 : 0,
                  objectPosition: hovered ? "center 100%" : "center 0%",
                  transition: `opacity 400ms, object-position ${hovered ? "4s" : "800ms"} ease-in-out`,
                }}
                onLoad={() => setThumbLoaded(true)}
                onError={() => setThumbFailed(true)}
              />
            )}

            {thumbLoaded && !thumbFailed && (
              <div
                className={`absolute bottom-2 left-2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}45` }}
              >
                <span className="w-1 h-1 rounded-full bg-current" />
                Preview
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-5 flex flex-col flex-1 relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{item.category}</span>
                {item.featured && (
                  <div className="px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[7px] font-bold text-yellow-500 uppercase tracking-widest">
                    Featured
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                <span className="text-[9px] font-bold text-white/40">4.9</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-2 tracking-tight">{item.label}</h3>
            <p className="text-[11px] leading-relaxed text-white/40 line-clamp-2 mb-4 font-medium italic">
              {item.desc}
            </p>

            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">12k+ active</div>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function ThemesContent() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  // ── Business-niche filter state (industry → specialty, ported from /galerie) ──
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  // ── Page-type filter state (landing vs. full site) ───────────────────────────
  const [pageTypeFilter, setPageTypeFilter] = useState<"All" | PageType>("All");

  // Changing a filter re-renders the results grid with a different (often much
  // shorter) height. If the visitor was scrolled deep into a long grid, the
  // page height shrinking under a now-fixed scroll position leaves them
  // stranded near the bottom of an otherwise-empty page instead of seeing the
  // new results — scroll back to the results header whenever a filter changes.
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const isFirstFilterRender = useRef(true);
  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [cat, selectedIndustry, selectedSpecialty, pageTypeFilter]);

  useEffect(() => {
    if (catParam) {
      const match = CATS.find(c => c.toLowerCase() === catParam.toLowerCase());
      if (match) {
        setCat(match);
      }
    } else {
      setCat("All");
    }
  }, [catParam]);

  // Translate broad industry / specialty labels dynamically (fr comes from the
  // base `label` field, other locales from the `labels` map — same pattern as
  // the former /galerie page).
  const getIndustryLabel = useCallback((ind: IndustryInfo) => {
    if (locale === "fr") return ind.label;
    return ind.labels[locale as keyof typeof ind.labels] || ind.label;
  }, [locale]);

  const getSpecialtyLabel = useCallback((spec: SectorInfo) => {
    if (locale === "fr") return spec.label;
    return spec.labels[locale as keyof typeof spec.labels] || spec.label;
  }, [locale]);

  // template id → specialty id
  const templateToSpecialty = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [specId, tids] of Object.entries(SECTOR_TEMPLATES)) {
      for (const tid of tids) map[tid] = specId;
    }
    return map;
  }, []);

  // specialty id → industry id
  const specialtyToIndustry = useMemo(() => {
    const map: Record<string, string> = {};
    for (const ind of INDUSTRIES) {
      for (const spec of ind.specialties) map[spec.id] = ind.id;
    }
    return map;
  }, []);

  const specialtiesInSelectedIndustry = useMemo(() => {
    if (selectedIndustry === "All") return [];
    const ind = INDUSTRIES.find(i => i.id === selectedIndustry);
    return ind ? ind.specialties : [];
  }, [selectedIndustry]);

  // Locale-aware name/description lookup: fr always comes from registry.ts,
  // every other locale comes from TEMPLATE_I18N with a defensive fr fallback.
  const localizeTemplate = useCallback((tpl: (typeof TEMPLATES_REGISTRY)[number]) => {
    if (locale === "fr") return { name: tpl.name, description: tpl.description };
    const entry = TEMPLATE_I18N[tpl.id]?.[locale as "en" | "es" | "de" | "pt"];
    return {
      name: entry?.name ?? tpl.name,
      description: entry?.description ?? tpl.description,
    };
  }, [locale]);

  const allThemes = useMemo<ThemeItem[]>(() => {
    return TEMPLATES_REGISTRY
      .filter(tpl => !HIDDEN_IMPACT.has(tpl.id))
      .map(tpl => {
        const { name, description } = localizeTemplate(tpl);
        const specId = templateToSpecialty[tpl.id];
        const indId = specId ? specialtyToIndustry[specId] : undefined;
        const industry = indId ? INDUSTRIES.find(i => i.id === indId) : undefined;
        const specialty = specId ? industry?.specialties.find(s => s.id === specId) : undefined;

        return {
          id: tpl.id,
          label: name,
          desc: description,
          category: tpl.category,
          href: `/templates/${tpl.id}`,
          source: "impact" as const,
          featured: FEATURED.has(tpl.id),
          pageType: TEMPLATE_PAGE_TYPE[tpl.id] ?? "landing",
          specialtyId: specId,
          specialtyLabel: specialty ? getSpecialtyLabel(specialty) : undefined,
          specialtyEmoji: specialty?.emoji,
          industryId: indId,
          cityLabel: TEMPLATE_CITY_LABELS[tpl.id],
        };
      });
  }, [localizeTemplate, templateToSpecialty, specialtyToIndustry, getSpecialtyLabel]);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tpl of allThemes) counts[tpl.category] = (counts[tpl.category] ?? 0) + 1;
    return counts;
  }, [allThemes]);

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tpl of allThemes) {
      if (!tpl.industryId) continue;
      counts[tpl.industryId] = (counts[tpl.industryId] ?? 0) + 1;
    }
    return counts;
  }, [allThemes]);

  const specialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tpl of allThemes) {
      if (!tpl.specialtyId) continue;
      counts[tpl.specialtyId] = (counts[tpl.specialtyId] ?? 0) + 1;
    }
    return counts;
  }, [allThemes]);

  const pageTypeCounts = useMemo(() => {
    const counts: Record<PageType, number> = { landing: 0, fullsite: 0 };
    for (const tpl of allThemes) counts[tpl.pageType]++;
    return counts;
  }, [allThemes]);

  // Reset specialty whenever the industry changes
  const selectIndustry = (indId: string) => {
    setSelectedIndustry(indId);
    setSelectedSpecialty("All");
  };

  const clearAllFilters = () => {
    setCat("All");
    setSelectedIndustry("All");
    setSelectedSpecialty("All");
    setPageTypeFilter("All");
    setSearch("");
  };

  const hasActiveFilters = cat !== "All" || selectedIndustry !== "All" || selectedSpecialty !== "All" || pageTypeFilter !== "All" || !!search;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allThemes.filter(tpl => {
      // Category (design-style) filter
      const catOk = cat === "All" || tpl.category === cat;
      // Business-niche filters (industry / specialty) — templates without a
      // niche only match when no industry/specialty filter is active.
      const industryOk = selectedIndustry === "All" || tpl.industryId === selectedIndustry;
      const specialtyOk = selectedSpecialty === "All" || tpl.specialtyId === selectedSpecialty;
      // Page-type filter
      const pageTypeOk = pageTypeFilter === "All" || tpl.pageType === pageTypeFilter;
      // Locale-aware search across name/description/category/specialty/city
      let searchOk = true;
      if (q) {
        const inLabel = tpl.label.toLowerCase().includes(q);
        const inDesc = tpl.desc.toLowerCase().includes(q);
        const inCat = tpl.category.toLowerCase().includes(q);
        const inSpec = (tpl.specialtyLabel ?? "").toLowerCase().includes(q);
        const inCity = (tpl.cityLabel ?? "").toLowerCase().includes(q);
        searchOk = inLabel || inDesc || inCat || inSpec || inCity;
      }
      return catOk && industryOk && specialtyOk && pageTypeOk && searchOk;
    });
  }, [allThemes, cat, selectedIndustry, selectedSpecialty, pageTypeFilter, search]);

  const featured = useMemo(() => filtered.filter(tpl => tpl.featured), [filtered]);
  const rest     = useMemo(() => filtered.filter(tpl => !tpl.featured), [filtered]);

  return (
    <div className="min-h-screen bg-[#080809]" style={{ overflowX: "hidden" }}>
      <AeviaHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
        {/* ── Page heading (no pill) ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            {t.title}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            {t.sub}
          </p>

          {(cat !== "All" || selectedIndustry !== "All" || selectedSpecialty !== "All" || pageTypeFilter !== "All") && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{t.filteredBy}</span>

              {cat !== "All" && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: `${CAT_COLOR[cat] ?? "#dc2626"}15`,
                    borderColor: `${CAT_COLOR[cat] ?? "#dc2626"}35`,
                    color: CAT_COLOR[cat] ?? "#dc2626"
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {cat}
                </span>
              )}

              {selectedIndustry !== "All" && (() => {
                const ind = INDUSTRIES.find(i => i.id === selectedIndustry);
                const color = INDUSTRY_COLOR[selectedIndustry] ?? "#dc2626";
                return ind ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                    style={{ background: `${color}15`, borderColor: `${color}35`, color }}
                  >
                    <span>{ind.emoji}</span>
                    {getIndustryLabel(ind)}
                  </span>
                ) : null;
              })()}

              {selectedSpecialty !== "All" && (() => {
                const spec = specialtiesInSelectedIndustry.find(s => s.id === selectedSpecialty);
                const color = spec?.accentColor ?? "#dc2626";
                return spec ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                    style={{ background: `${color}15`, borderColor: `${color}35`, color }}
                  >
                    <span>{spec.emoji}</span>
                    {getSpecialtyLabel(spec)}
                  </span>
                ) : null;
              })()}

              {pageTypeFilter !== "All" && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: `${PAGETYPE_COLOR[pageTypeFilter]}15`,
                    borderColor: `${PAGETYPE_COLOR[pageTypeFilter]}35`,
                    color: PAGETYPE_COLOR[pageTypeFilter],
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {pageTypeFilter === "landing" ? t.landing : t.fullsite}
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer ml-1 font-semibold"
              >
                {t.seeAll}
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Grid: sidebar + main ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

          {/* ── Sidebar (sticky) ─────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.filters}</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
                >
                  {t.clear}
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1">
              {CATS.map(c => {
                const count = c === "All" ? allThemes.length : (catCounts[c] ?? 0);
                const active = cat === c;
                const color = CAT_COLOR[c] ?? "#dc2626";
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: active ? `${color}22` : "transparent",
                      color: active ? "#fff" : "rgba(255,255,255,0.55)",
                      border: active ? `1px solid ${color}55` : "1px solid transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color, opacity: active ? 1 : 0.5 }}
                      />
                      {c === "All" ? t.allCats : c}
                    </span>
                    <span
                      className="text-[10px] font-mono tabular-nums"
                      style={{ color: active ? color : "rgba(255,255,255,0.3)" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ── Business-niche filter: industry ──────────────────────────── */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 px-1">
                {t.industryFilter}
              </span>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => selectIndustry("All")}
                  className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: selectedIndustry === "All" ? "rgba(220,38,38,0.13)" : "transparent",
                    color: selectedIndustry === "All" ? "#fff" : "rgba(255,255,255,0.55)",
                    border: selectedIndustry === "All" ? "1px solid rgba(220,38,38,0.35)" : "1px solid transparent",
                  }}
                >
                  <span>{t.allIndustries}</span>
                  <span className="text-[10px] font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {allThemes.length}
                  </span>
                </button>
                {INDUSTRIES.map(ind => {
                  const active = selectedIndustry === ind.id;
                  const color = INDUSTRY_COLOR[ind.id] ?? "#dc2626";
                  return (
                    <button
                      key={ind.id}
                      onClick={() => selectIndustry(ind.id)}
                      className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background: active ? `${color}22` : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.55)",
                        border: active ? `1px solid ${color}55` : "1px solid transparent",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span>{ind.emoji}</span>
                        {getIndustryLabel(ind)}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums" style={{ color: active ? color : "rgba(255,255,255,0.3)" }}>
                        {industryCounts[ind.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── Business-niche filter: specialty (nested under industry) ──── */}
            <AnimatePresence>
              {selectedIndustry !== "All" && specialtiesInSelectedIndustry.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                >
                  <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 px-1">
                    {t.specialtyFilter}
                  </span>
                  <nav className="flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedSpecialty("All")}
                      className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background: selectedSpecialty === "All" ? "rgba(255,255,255,0.08)" : "transparent",
                        color: selectedSpecialty === "All" ? "#fff" : "rgba(255,255,255,0.55)",
                        border: selectedSpecialty === "All" ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                      }}
                    >
                      {t.allSpecialties}
                    </button>
                    {specialtiesInSelectedIndustry.map(spec => {
                      const active = selectedSpecialty === spec.id;
                      const color = spec.accentColor;
                      return (
                        <button
                          key={spec.id}
                          onClick={() => setSelectedSpecialty(spec.id)}
                          className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                          style={{
                            background: active ? `${color}22` : "transparent",
                            color: active ? "#fff" : "rgba(255,255,255,0.55)",
                            border: active ? `1px solid ${color}55` : "1px solid transparent",
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span>{spec.emoji}</span>
                            {getSpecialtyLabel(spec)}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums" style={{ color: active ? color : "rgba(255,255,255,0.3)" }}>
                            {specialtyCounts[spec.id] ?? 0}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Page-type filter ─────────────────────────────────────────── */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 px-1">
                {t.pageTypeFilter}
              </span>
              <div className="flex gap-1.5">
                {(["All", "landing", "fullsite"] as const).map(pt => {
                  const active = pageTypeFilter === pt;
                  const color = pt === "All" ? "#dc2626" : PAGETYPE_COLOR[pt];
                  const label = pt === "All" ? t.allPageTypes : pt === "landing" ? t.landing : t.fullsite;
                  const count = pt === "All" ? allThemes.length : pageTypeCounts[pt];
                  return (
                    <button
                      key={pt}
                      onClick={() => setPageTypeFilter(pt)}
                      className="flex-1 flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer"
                      style={{
                        background: active ? `${color}22` : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.55)",
                        border: active ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <span>{label}</span>
                      <span className="font-mono tabular-nums" style={{ color: active ? color : "rgba(255,255,255,0.3)" }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <Link
                href="/configure"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {t.cta} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <main className="min-w-0">
            <div ref={resultsTopRef} className="flex items-center justify-between mb-6 text-xs scroll-mt-24">
              <span className="text-zinc-500 tabular-nums">
                {filtered.length} {t.themesCount}
                {cat !== "All" && <> · <span className="text-white">{cat}</span></>}
              </span>
            </div>

            {/* Featured strip */}
            <AnimatePresence mode="wait">
              {featured.length > 0 && (
                <motion.section
                  key={`feat-${cat}-${selectedIndustry}-${selectedSpecialty}-${pageTypeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">{t.featured}</span>
                    <span className="text-xs text-zinc-600 font-mono">{featured.length} {t.featuredPicks}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {featured.map((item, i) => (
                      <ThumbCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                  <div className="mt-10 border-t border-white/5" />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Full grid */}
            <AnimatePresence mode="wait">
              <motion.section
                key={`grid-${cat}-${selectedIndustry}-${selectedSpecialty}-${pageTypeFilter}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {rest.length > 0 ? (
                  <>
                    {featured.length > 0 && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs text-zinc-500 font-medium">{rest.length} {t.moreThemes}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {rest.map((item, i) => (
                        <ThumbCard key={item.id} item={item} index={i} />
                      ))}
                    </div>
                  </>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-28 text-zinc-600">
                    <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">{search ? <>{t.noMatch} &ldquo;{search}&rdquo;</> : t.clearFilters}</p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      {t.clearFilters}
                    </button>
                  </div>
                ) : null}
              </motion.section>
            </AnimatePresence>

            {/* CTA banner */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <div
                className="rounded-3xl p-10 sm:p-14 border relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#13091f,#1a0d2e 50%,#0d1340)",
                  borderColor: "rgba(124,58,237,0.2)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.22) 0%, transparent 60%)" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
                    {t.ready}
                  </h2>
                  <p className="text-zinc-300 text-base mb-8 max-w-lg leading-relaxed">
                    {t.readySub}
                  </p>
                  <Link
                    href="/configure"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                  >
                    {t.startBuilding} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      <LegalFooter variant="dark" />
    </div>
  );
}

export default function ThemesGallery() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080809] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ThemesContent />
    </Suspense>
  );
}
