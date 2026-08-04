"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Gem } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, FONT_LABEL, GemStoneSVG, Reveal, STATS, TESTIMONIALS, TEAM } from "./shared";
import { DWELL, useSlides, Retint, BlurThrough, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { LineScroll } from "@/lib/templates/hero-kit-3";

/* LineScroll + Retint (v13, suits): the headline lines roll from edge to
   edge under their masks — the tail of the outgoing line is briefly read
   with the head of the incoming one. Gem and plaque tint follow. */
const HERO_CRAFTS = [
  { l1: "L'Art du", l2: "Temps Précieux", gem: "sapphire", tint: "rgba(26,34,52,0.9)", piece: "Heritage Tourbillon", stone: "Rubis de Birmanie" },
  { l1: "L'Éclat des", l2: "Pierres Rares", gem: "diamond", tint: "rgba(38,32,22,0.9)", piece: "Constellation Noir", stone: "Diamant noir 8 ct" },
  { l1: "L'Alliance", l2: "sur-mesure", gem: "ruby", tint: "rgba(46,22,28,0.9)", piece: "Eternité Rose", stone: "Diamant rose 3 ct" },
];
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientName,
  clientReviews,
  clientServices,
  clientTeam,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact83Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
    businessProfile?: any;
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Product collections ← client's business profile (falls back to demo).
  const COLLECTIONS_DEMO = [
    { name: "Constellation Noir", cat: "Haute Joaillerie", price: "€185,000", stone: "Diamant noir 8 ct", img: photo(0, "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85") },
    { name: "Éclipse Royale", cat: "Haute Horlogerie", price: "€48,000", stone: "Saphir de Ceylan", img: photo(1, "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=85") },
    { name: "Eternité Rose", cat: "Alliance sur-mesure", price: "À partir de €12,000", stone: "Diamant rose 3 ct", img: photo(2, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85") },
    { name: "Heritage Tourbillon", cat: "Montre de collection", price: "€320,000", stone: "Rubis de Birmanie", img: photo(3, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85") },
  ];
  const COLLECTIONS_LIST = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      name: s.title ?? s.name,
      cat: COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].cat,
      price: s.price ?? COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].price,
      stone: s.description ?? COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].stone,
      img: COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].img,
    })),
    COLLECTIONS_DEMO
  );
  const TESTIMONIALS_LIST = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      name: r.name ?? r.author,
      role: r.location ?? r.role ?? TESTIMONIALS[i % TESTIMONIALS.length].role,
      note: r.stars ?? r.rating ?? 5,
      text: r.text ?? r.quote,
      piece: TESTIMONIALS[i % TESTIMONIALS.length].piece,
    })),
    TESTIMONIALS
  );
  const TEAM_LIST = resolveList(
    clientTeam(sessionData)?.map((m: any, i: number) => ({
      name: m.name,
      role: m.role ?? TEAM[i % TEAM.length].role,
      bio: m.bio ?? m.specialty ?? TEAM[i % TEAM.length].bio,
      exp: m.credentials ?? TEAM[i % TEAM.length].exp,
    })),
    TEAM
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_CRAFTS.length, DWELL.slow);
  // the gem follows the craft instead of spinning on its own clock
  const heroGem = HERO_CRAFTS[heroI].gem;
  const basePath = "/templates/impact-83";

  return (
    <div ref={containerRef}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bg} 60%, #2a1808 100%)`,
        }}
      >
        <motion.div
          // NOTE: opacity is intentionally NOT scroll-linked here. A style-bound
          // MotionValue (e.g. heroOpacity from useTransform(scrollYProgress,...))
          // on the same property as an animate={{opacity}} entrance animation
          // permanently wins over the animate target — this previously locked
          // the whole hero at opacity:0 on load (heroOpacity evaluated to 0 at
          // the container's initial scroll progress, and never got a chance to
          // fade in). y/scale keep their scroll-linked parallax; only opacity's
          // entrance fade-in is kept.
          style={{ y: heroY, scale: heroScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 24px" }}>
            {/* Gem signature element */}
            <motion.div
              style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroGem}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <GemStoneSVG type={heroGem} size={140} animated={false} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 24,
              }}
            >
              Maison de Joaillerie & Horlogerie
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                lineHeight: 1.15,
                color: C.text,
                marginBottom: 8,
              }}
            >{c?.heroHeadline ?? <LineScroll lines={[HERO_CRAFTS[heroI].l1]} index={heroI} />}</motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.15,
                color: C.accent,
                marginBottom: 40,
              }}
            >
              <LineScroll lines={[HERO_CRAFTS[heroI].l2]} index={heroI} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 20,
                fontWeight: 300,
                color: C.textMuted,
                maxWidth: 520,
                margin: "0 auto 56px",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >{fd?.tagline ?? c?.heroSubline ?? <>
              Depuis 1887, Aurelius Heritage perpétue l&apos;excellence de la joaillerie française et l&apos;art horloger suisse pour les collectionneurs du monde entier.
            </>}</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href={`${basePath}/collections`} style={{ textDecoration: "none" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.accent,
                    color: C.bg,
                    border: "none",
                    padding: "16px 36px",
                    fontFamily: FONT_LABEL,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Découvrir les Collections <ArrowRight size={14} />
                </span>
              </Link>
              <Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${C.borderGold}`,
                    color: C.textMuted,
                    background: "transparent",
                    padding: "16px 36px",
                    fontFamily: FONT_LABEL,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Sur Mesure <Gem size={14} />
                </span>
              </Link>
            </motion.div>

            <Retint
              color={HERO_CRAFTS[heroI].tint}
              style={{ margin: "40px auto 0", maxWidth: 460, padding: "16px 26px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", border: "1px solid rgba(201,168,108,0.25)" }}
            >
              <SlideIndex i={heroI} total={HERO_CRAFTS.length} variant="fraction" className="" color="rgba(255,255,255,0.55)" />
              <BlurThrough index={heroI} amount={8}>
                <span style={{ fontFamily: FONT_HEADING, fontSize: 16, color: "#fff" }}>
                  {HERO_CRAFTS[heroI].piece}
                  <span style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}> · {HERO_CRAFTS[heroI].stone}</span>
                </span>
              </BlurThrough>
              <HairlineArrows onPrev={heroPrev} onNext={heroNext} color="rgba(255,255,255,0.65)" labels={{ prev: "Pièce précédente", next: "Pièce suivante" }} />
            </Retint>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <ChevronDown size={20} color={C.textMuted} />
        </motion.div>
      </section>

      {/* ── COLLECTIONS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2rem", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>Collections</p>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem,5vw,5rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>
              L&apos;Art du Temps Précieux
            </>)}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem" }}>
            {COLLECTIONS_LIST.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.6) brightness(0.9)", transition: "all 0.8s" }} onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = "saturate(1) brightness(1)"; (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }} onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = "saturate(0.6) brightness(0.9)"; (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>{item.cat}</p>
                    <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.4rem", fontWeight: 300, color: C.text, marginBottom: 8 }}>{item.name}</h3>
                    <p style={{ fontFamily: FONT_LABEL, fontSize: 11, color: C.textMuted }}>{item.stone}</p>
                    <p style={{ fontFamily: FONT_HEADING, fontSize: "1.1rem", color: C.accentLight, marginTop: 12 }}>{item.price}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAVOIR-FAIRE ────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2rem", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="imx-mobstack" style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <Reveal>
            <div>
              <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>Savoir-faire</p>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, fontStyle: "italic", color: C.text, lineHeight: 1.3, marginBottom: "2rem" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                Depuis 1887, <br />chaque pierre compte.
              </>}</h2>
              <p style={{ fontFamily: FONT_HEADING, fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic" }}>{c?.aboutText ?? <>
                Nos maîtres joailliers perpétuent des gestes transmis depuis quatre générations. Chaque pièce Aurelius Heritage est créée dans nos ateliers parisiens et signée par l&apos;artisan qui l&apos;a réalisée.
              </>}</p>
              <p style={{ fontFamily: FONT_HEADING, fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "3rem", fontStyle: "italic" }}>
                Notre maison collabore avec les plus grandes manufactures horlogères suisses (Patek Philippe, A. Lange & Söhne) pour les complications horlogères de nos montres de collection.
              </p>
              <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", borderTop: `1px solid ${C.border}`, paddingTop: "2rem" }}>
                {[{ v: "1887", l: "Année de fondation" }, { v: "14", l: "Maîtres artisans" }, { v: "3 200+", l: "Pièces créées" }, { v: "28", l: "Pays de collectionneurs" }].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontFamily: FONT_HEADING, fontSize: "2rem", fontWeight: 300, color: C.accent }}>{s.v}</div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[photo(4, "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=85"),photo(5, "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=85"),photo(6, "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=85"),photo(7, "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85")].map((src, i) => (
                <div key={i} style={{ aspectRatio: "1", overflow: "hidden", border: `1px solid ${C.border}` }}>
                  <img src={src} alt="Atelier" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.3)" }} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1px", background: C.border }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ background: C.bgAlt, padding: "3rem 2rem", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: C.accent }}>
                  {s.value}{s.suffix}
                </div>
                <div style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textMuted, marginTop: 8 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2rem", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>Témoignages</p>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem", fontStyle: "italic" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
              Ce que disent nos clients.
            </>)}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2rem" }}>
            {TESTIMONIALS_LIST.slice(0, 3).map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[...Array(t.note)].map((_, j) => (
                      <span key={j} style={{ color: C.accent, fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, fontStyle: "italic", flex: 1 }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem" }}>
                    <div style={{ fontFamily: FONT_LABEL, fontWeight: 700, fontSize: 13, color: C.text }}>{t.name}</div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, marginTop: 4 }}>{t.role}</div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginTop: 6 }}>{t.piece}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2rem", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>L&apos;Équipe</p>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Maîtres artisans.
            </>)}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem" }}>
            {TEAM_LIST.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "2.5rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: FONT_HEADING, fontSize: "1.2rem", color: C.accent }}>
                      {m.name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <div style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>{m.exp} d&apos;expérience</div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.3rem", fontWeight: 400, color: C.text, marginBottom: 4 }}>{m.name}</h3>
                  <p style={{ fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: "1.25rem" }}>{m.role}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUR-MESURE CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2rem", background: C.accent, textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: C.bg, marginBottom: 16, opacity: 0.6 }}>Sur mesure</p>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 300, color: C.bg, lineHeight: 1.2, marginBottom: "2rem", fontStyle: "italic" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
              Une pièce unique,<br />conçue pour vous.
            </>)}</h2>
            <p style={{ fontFamily: FONT_HEADING, color: C.bg, opacity: 0.6, marginBottom: "3rem", lineHeight: 1.7, fontSize: "1.1rem" }}>
              Nos ateliers créent des pièces sur-mesure en collaboration directe avec vous. De l&apos;esquisse à la livraison, comptez 6 à 16 semaines selon la complexité. Chaque pièce sur-mesure est accompagnée d&apos;un certificat gemmologique indépendant.
            </p>
            <Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.bg, color: C.accent, border: "none", padding: "18px 48px", fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer" }}>
                Débuter votre création <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.55 }}>
        {clientName(sessionData) ?? "impact-83"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
