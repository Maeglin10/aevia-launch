"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";

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

// ─── Thumbnail card ────────────────────────────────────────────────────────────
// Static WebP thumbnail + CSS object-position scroll on hover (no iframe, no perf cost)
function ThumbCard({ item, index }: { item: ThemeItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const accent = CAT_COLOR[item.category] ?? "#7c3aed";
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const thumbSrc = `/thumbnails/${item.id}.webp`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index < 25 ? Math.min((index % 8) * 0.04, 0.24) : 0 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={item.href} className="block h-full cursor-pointer">
        <div
          className="relative rounded-2xl border overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:border-white/20 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          style={{ background: "linear-gradient(135deg,#0a0a0d,#111118)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
            style={{ background: `radial-gradient(circle at 50% 0%, ${accent}33 0%, transparent 70%)` }}
          />

          {/* ── Preview area ── */}
          <div className="w-full aspect-video relative overflow-hidden bg-[#050506] border-b border-white/5 shrink-0">

            {/* Placeholder shown when thumbnail is absent */}
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

            {/* Static WebP — scrolls from top to bottom on hover */}
            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={item.label}
                loading={index < 25 ? "eager" : "lazy"}
                decoding={index < 25 ? "sync" : "async"}
                fetchPriority={index < 8 ? "high" : "low"}
                className={`absolute inset-0 w-full h-full object-cover z-20 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                style={{
                  objectPosition: hovered ? "center 100%" : "center 0%",
                  transition: `opacity 500ms, object-position ${hovered ? "4s" : "800ms"} ease-in-out`,
                }}
                onLoad={() => setThumbLoaded(true)}
                onError={() => setThumbFailed(true)}
              />
            )}

            {/* Scroll indicator badge */}
            {thumbLoaded && !thumbFailed && (
              <div
                className={`absolute bottom-2 left-2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}45` }}
              >
                <span className="w-1 h-1 rounded-full bg-current" style={{ animation: hovered ? "pulse 1s infinite" : "none" }} />
                Preview
              </div>
            )}
          </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-1 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">{item.category}</span>
                  {item.featured && <div className="px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[7px] font-bold text-yellow-500 uppercase tracking-widest">Featured</div>}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-[9px] font-bold text-white/30">4.9</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-white transition-colors duration-500 tracking-tight">{item.label}</h3>
              <p className="text-[11px] leading-relaxed text-white/40 line-clamp-2 mb-6 font-medium italic">
                {item.desc}
              </p>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border border-[#050506] bg-[#111118] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">12k+ active</div>
                </div>
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
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const allThemes = useMemo<ThemeItem[]>(() => {
    return TEMPLATES_REGISTRY
      .filter(t => !HIDDEN_IMPACT.has(t.id))
      .map(t => ({
        id: t.id,
        label: t.name,
        desc: t.description,
        category: t.category,
        href: `/templates/${t.id}`,
        source: "impact" as const,
        featured: FEATURED.has(t.id),
      }));
  }, []);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of allThemes) counts[t.category] = (counts[t.category] ?? 0) + 1;
    return counts;
  }, [allThemes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allThemes.filter(t => {
      const catOk = cat === "All" || t.category === cat;
      const searchOk = !q || t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [allThemes, cat, search]);

  const featured = useMemo(() => filtered.filter(t => t.featured), [filtered]);
  const rest     = useMemo(() => filtered.filter(t => !t.featured), [filtered]);

  return (
    <div className="min-h-screen bg-[#080809]" style={{ overflowX: "hidden" }}>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 bg-[#080809]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline font-medium">AeviaLaunch</span>
          </Link>

          {/* Search — centered */}
          <div className="flex-1 max-w-sm mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search themes…"
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-white/5 border border-white/8 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-zinc-600 text-xs hidden sm:inline tabular-nums">{filtered.length} themes</span>
            <Link
              href="/configure"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Build my site <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-5">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Theme Gallery</span>
          </div>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-4"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Pick your<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              perfect style.
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            {allThemes.length}+ themes — every style, every industry, hover to scroll through.
          </p>
        </motion.div>

        {/* ── Category filters ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-12">
          {CATS.map(c => {
            const count = c === "All" ? allThemes.length : (catCounts[c] ?? 0);
            const active = cat === c;
            const color = CAT_COLOR[c] ?? "#7c3aed";
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? color : "rgba(255,255,255,0.04)",
                  color: active ? "#fff" : "rgba(255,255,255,0.4)",
                  border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: active ? `0 0 16px ${color}30` : "none",
                }}
              >
                {c} {count > 0 && <span className="opacity-70 ml-1 font-mono">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Featured strip ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {featured.length > 0 && (
            <motion.section
              key={`feat-${cat}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-14"
            >
              <div className="flex items-center gap-2 mb-5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Featured</span>
                <span className="text-xs text-zinc-600 font-mono">{featured.length} picks</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {featured.map((item, i) => (
                  <ThumbCard key={item.id} item={item} index={i} />
                ))}
              </div>
              <div className="mt-10 border-t border-white/5" />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Full grid ─────────────────────────────────────────────────────── */}
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
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs text-zinc-500 font-medium">{rest.length} more themes</span>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {rest.map((item, i) => (
                    <ThumbCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </>
            ) : filtered.length === 0 ? (
              <div className="text-center py-28 text-zinc-600">
                <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No themes match &ldquo;{search}&rdquo;</p>
                <button
                  onClick={() => { setSearch(""); setCat("All"); }}
                  className="mt-4 text-xs text-violet-400 hover:text-violet-300 underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
          </motion.section>
        </AnimatePresence>

        {/* ── CTA banner ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div
            className="rounded-3xl p-10 sm:p-16 border relative overflow-hidden"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Ready to launch?</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
                Your site, live in 2 hours.
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Pick a theme, fill the form, our AI writes your copy — deployed on your domain, fully optimised.
              </p>
              <Link
                href="/configure"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Start building — it&apos;s free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
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
