"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
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
  Services:      "#8b5cf6",
  Education:     "#3b82f6",
  Finance:       "#22c55e",
  "Food & Drink":"#fb923c",
  Free:          "#10b981",
};

const CATS = [
  "All", "Tech", "Creative", "Luxury", "Minimal", "Editorial",
  "Corporate", "Finance", "E-Commerce", "Health", "Hospitality",
  "Food & Drink", "Services", "Education", "Free"
];

// ─── Theme item type ──────────────────────────────────────────────────────────
interface ThemeItem {
  id: string;
  label: string;
  desc: string;
  category: string;
  href: string;
  source: "builder" | "impact";
  featured: boolean;
}

// ─── Thumbnail card (Showcase-style design) ────────────────────────────────────
function ThumbCard({ item, index }: { item: ThemeItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = CAT_COLOR[item.category] ?? "#7c3aed";
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const thumbSrc = `/thumbnails/${item.id}.webp`;

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
            {(!thumbLoaded || thumbFailed) && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                style={{ background: `linear-gradient(135deg, ${accent}11 0%, #050506 100%)` }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 opacity-20 border border-white/10 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-2">{item.category}</span>
                <h3 className="text-xl font-bold text-white/40 group-hover:text-white transition-colors duration-700 tracking-tighter uppercase">{item.label}</h3>
              </div>
            )}

            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={item.label}
                loading={index < 12 ? "eager" : "lazy"}
                decoding={index < 12 ? "sync" : "async"}
                fetchPriority={index < 6 ? "high" : "low"}
                className={`absolute inset-0 w-full h-full object-cover z-20 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                style={{
                  objectPosition: hovered ? "center 100%" : "center 0%",
                  transition: `opacity 500ms, object-position ${hovered ? "4s" : "800ms"} ease-in-out`,
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
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const allThemes = useMemo<ThemeItem[]>(() => {
    return TEMPLATES_REGISTRY
      .filter(tpl => !HIDDEN_IMPACT.has(tpl.id))
      .map(tpl => ({
        id: tpl.id,
        label: tpl.name,
        desc: tpl.description,
        category: tpl.category,
        href: `/templates/${tpl.id}`,
        source: "impact" as const,
        featured: FEATURED.has(tpl.id),
      }));
  }, []);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tpl of allThemes) counts[tpl.category] = (counts[tpl.category] ?? 0) + 1;
    return counts;
  }, [allThemes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allThemes.filter(tpl => {
      const catOk = cat === "All" || tpl.category === cat;
      const searchOk = !q || tpl.label.toLowerCase().includes(q) || tpl.desc.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [allThemes, cat, search]);

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
        </motion.div>

        {/* ── Grid: sidebar + main ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

          {/* ── Sidebar (sticky) ─────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.filters}</span>
              {(cat !== "All" || search) && (
                <button
                  onClick={() => { setCat("All"); setSearch(""); }}
                  className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
                >
                  {t.clear}
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1">
              {CATS.map(c => {
                const count = c === "All" ? allThemes.length : (catCounts[c] ?? 0);
                const active = cat === c;
                const color = CAT_COLOR[c] ?? "#7c3aed";
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

            <div className="mt-6 pt-6 border-t border-white/5">
              <Link
                href="/configure"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {t.cta} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <main className="min-w-0">
            <div className="flex items-center justify-between mb-6 text-xs">
              <span className="text-zinc-500 tabular-nums">
                {filtered.length} {t.themesCount}
                {cat !== "All" && <> · <span className="text-white">{cat}</span></>}
              </span>
            </div>

            {/* Featured strip */}
            <AnimatePresence mode="wait">
              {featured.length > 0 && (
                <motion.section
                  key={`feat-${cat}`}
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
                key={`grid-${cat}-${search}`}
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
                    <p className="text-sm">{t.noMatch} &ldquo;{search}&rdquo;</p>
                    <button
                      onClick={() => { setSearch(""); setCat("All"); }}
                      className="mt-4 text-xs text-violet-400 hover:text-violet-300 underline cursor-pointer"
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] cursor-pointer"
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
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ThemesContent />
    </Suspense>
  );
}
