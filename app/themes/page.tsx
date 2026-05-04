"use client";

import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";

// ─── Quality filter ───────────────────────────────────────────────────────────
// Only templates genuinely at "$10k level" are shown.
// Threshold: 550+ lines (original batch) OR part of the recent rewrite (157-176).
// Hidden templates are elevated in batches and re-enabled when ready.
const HIDDEN_IMPACT = new Set([
  // ── Stubs / incomplete (< 400 lines) ────────────────────────────────────
  "impact-106","impact-107","impact-108","impact-109","impact-110","impact-111",
  "impact-117","impact-118","impact-119","impact-120","impact-121","impact-122","impact-123","impact-124","impact-125",
  "impact-127","impact-128","impact-129",
  "impact-137","impact-138","impact-139",
  "impact-142","impact-143","impact-144","impact-146",
  "impact-152","impact-153","impact-154","impact-155","impact-156",
  "impact-177","impact-178","impact-179","impact-180","impact-181","impact-182","impact-183","impact-184","impact-185","impact-186",
  "impact-187","impact-188","impact-189","impact-190","impact-191","impact-192","impact-193","impact-194","impact-195","impact-196",
  // ── Below quality bar (400–549 lines, pending elevation) ────────────────

  
]);

// ─── Featured (hand-picked best) ─────────────────────────────────────────────
const FEATURED = new Set([
  "impact-01","impact-03",
  "impact-81","impact-82","impact-83","impact-84","impact-85","impact-86","impact-87","impact-88","impact-89","impact-90",
  "impact-91","impact-92","impact-93","impact-94","impact-95",
  "impact-96","impact-97","impact-98","impact-99","impact-100",
  "impact-101","impact-102","impact-103","impact-104","impact-105",
  "impact-06","impact-07","impact-08","impact-09","impact-10",
  "impact-11","impact-12","impact-13","impact-14","impact-15",
  "impact-16","impact-17","impact-18","impact-19","impact-20",
  "impact-21","impact-22","impact-23","impact-24","impact-25",
  "impact-26","impact-27","impact-28","impact-29","impact-30",
  "impact-31","impact-32","impact-33","impact-34","impact-35",
  "impact-36","impact-37","impact-38","impact-39","impact-40",
  "impact-41","impact-42","impact-43","impact-44","impact-45",
  "impact-46","impact-47","impact-48","impact-49","impact-50",
  "impact-51","impact-52","impact-53","impact-54","impact-55",
  "luxury","aurora","3d-tech","minimal-pro","saas",
]);

// ─── Site builder themes ──────────────────────────────────────────────────────
const SITE_THEMES = [
  { id: "landing",     label: "Landing Page",        desc: "High-conversion single page with bold hero and tight CTA" },
  { id: "saas",        label: "SaaS Product",         desc: "Dark tech aesthetic with features, pricing and conversion flow" },
  { id: "agency",      label: "Creative Agency",      desc: "Left-aligned bold typography, portfolio-first layout" },
  { id: "vitrine",     label: "Business Vitrine",     desc: "Professional multi-page presence for established brands" },
  { id: "consultant",  label: "Consultant & Coach",   desc: "Authority-building personal brand with trust signals" },
  { id: "portfolio",   label: "Portfolio",            desc: "Minimal work showcase for creatives and developers" },
  { id: "ecommerce",   label: "E-commerce Store",     desc: "Full-bleed product hero with gallery and cart CTA" },
  { id: "restaurant",  label: "Restaurant & Food",    desc: "Warm full-bleed ambiance with menu and reservations" },
  { id: "hotel",       label: "Hotel & B&B",          desc: "Luxury room gallery with booking CTA and amenities" },
  { id: "healthcare",  label: "Healthcare & Clinic",  desc: "Trust-first medical practice with clean white layout" },
  { id: "realestate",  label: "Real Estate",          desc: "Property listings with agent profile and local expertise" },
  { id: "fitness",     label: "Fitness & Wellness",   desc: "High-energy classes, trainers, transformation stories" },
  { id: "event",       label: "Event & Conference",   desc: "Dark countdown, speakers, schedule and ticket CTA" },
  { id: "nonprofit",   label: "Non-profit & NGO",     desc: "Mission-driven, warm, donation-focused impact site" },
  { id: "startup",     label: "Startup Launch",       desc: "Pre-launch waitlist with social proof and vision" },
  { id: "luxury",      label: "Luxury & Couture",     desc: "Dark marble texture, gold accents and cinematic parallax" },
  { id: "brutalist",   label: "Brutalist Editorial",  desc: "Massive raw typography, hard grid, confrontational by design" },
  { id: "magazine",    label: "Magazine & Editorial", desc: "Grid-based journalistic layout with rich typography hierarchy" },
  { id: "aurora",      label: "Aurora & Wellness",    desc: "Iridescent aurora gradients, soft glow, botanical wellness" },
  { id: "3d-tech",     label: "3D Tech & Web3",       desc: "Holographic grid, glitch text effects, cyber-neon palette" },
  { id: "minimal-pro", label: "Minimal Pro",          desc: "Architecture-grade negative space, Swiss precision typography" },
  { id: "marketplace", label: "Marketplace",          desc: "Multi-vendor marketplace with listings and seller profiles" },
  { id: "livestream",  label: "Live & Streaming",     desc: "Live events platform with real-time chat and ticketing" },
];

// ─── Unified category system ──────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Builder:   "#7c3aed",
  Tech:      "#2563eb",
  Creative:  "#a855f7",
  Luxury:    "#c9a96e",
  Minimal:   "#71717a",
  Editorial: "#f59e0b",
  Free:      "#10b981",
};

const CATS = ["All", "Builder", "Tech", "Creative", "Luxury", "Minimal", "Editorial", "Free"];

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
// Priority: static WebP screenshot (public/thumbnails/[id].webp) → live iframe fallback
// Generate screenshots with: npm run screenshots
function ThumbCard({ item, index }: { item: ThemeItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const accent = CAT_COLOR[item.category] ?? "#7c3aed";

  // Static thumbnail state
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  // Iframe fallback (IntersectionObserver — loads when in viewport)
  const [entered, setEntered] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  // Only load iframe if static thumb failed (or on hover for live preview)
  useEffect(() => {
    if (!thumbFailed) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [thumbFailed]);

  // Show live iframe on hover (even when static thumb is present)
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (hovered) {
      if (!entered) setEntered(true);
      t = setTimeout(() => setShowIframe(true), 180);
    } else {
      setShowIframe(false);
    }
    return () => clearTimeout(t);
  }, [hovered, entered]);

  const thumbSrc = `/thumbnails/${item.id}.webp`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min((index % 8) * 0.04, 0.24) }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={item.href} className="block h-full cursor-pointer">
        <div
          className="relative rounded-2xl border overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          style={{ background: "linear-gradient(135deg,#0a0a0d,#111118)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}22 0%, transparent 65%)` }}
          />

          {/* ── Preview area ── */}
          <div className="w-full aspect-video relative overflow-hidden bg-[#050506] border-b border-white/5 shrink-0">

            {/* Static WebP thumbnail (fast, always visible) */}
            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={item.label}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setThumbLoaded(true)}
                onError={() => setThumbFailed(true)}
              />
            )}

            {/* Live iframe — overlaid on hover, or as fallback when no thumbnail */}
            {entered && (thumbFailed || showIframe) && (
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${showIframe ? "opacity-100" : thumbFailed ? "opacity-100" : "opacity-0"}`}
              >
                <iframe
                  src={item.href}
                  className={`absolute inset-0 w-[400%] h-[400%] origin-top-left scale-25 pointer-events-none transition-opacity duration-500 ${iframeLoaded ? "opacity-95" : "opacity-0"}`}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  onLoad={() => setIframeLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d]/60 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            {/* Placeholder while loading */}
            {!thumbLoaded && !iframeLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: `radial-gradient(ellipse at center, ${accent}12 0%, transparent 70%)` }}
              >
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              </div>
            )}

            {/* "Live" badge on hover */}
            {showIframe && (
              <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white/60">
                Live
              </div>
            )}
          </div>

          {/* Info */}
          <div className="relative z-10 p-4 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2.5">
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}28` }}
              >
                {item.category}
              </span>
              <div className="flex items-center gap-1.5">
                {item.featured && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />}
                {item.source === "builder" && (
                  <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-wider">Builder</span>
                )}
                <ArrowRight
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                  style={{ color: accent }}
                />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white leading-tight mb-1.5">{item.label}</h3>
            <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2 flex-1">{item.desc}</p>
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
    const builders: ThemeItem[] = SITE_THEMES.map(t => ({
      id: t.id,
      label: t.label,
      desc: t.desc,
      category: "Builder",
      href: `/themes/${t.id}`,
      source: "builder",
      featured: FEATURED.has(t.id),
    }));
    const impacts: ThemeItem[] = TEMPLATES_REGISTRY
      .filter(t => !HIDDEN_IMPACT.has(t.id))
      .map(t => ({
        id: t.id,
        label: t.name,
        desc: t.description,
        category: t.category,
        href: `/templates/${t.id}`,
        source: "impact",
        featured: FEATURED.has(t.id),
      }));
    return [...builders, ...impacts];
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
            {allThemes.length} premium themes — Site Builder + Impact Vault, one unified gallery.
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
