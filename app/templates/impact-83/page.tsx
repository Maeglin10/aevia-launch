"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Gem } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, FONT_LABEL, GemStoneSVG, Reveal, STATS, TESTIMONIALS, TEAM } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  const [heroGem, setHeroGem] = useState<string>("diamond");
  const basePath = "/templates/impact-83";

  // Rotate hero gem
  useEffect(() => {
    const gems = ["diamond", "ruby", "sapphire", "emerald", "amethyst"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % gems.length;
      setHeroGem(gems[i]);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  return (
    <div ref={containerRef}>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bg} 60%, #2a1808 100%)`,
        }}
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
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
            >{c?.heroHeadline ?? <>
              L&apos;Art du
            </>}</motion.h1>
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
              Temps Précieux
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
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Depuis 1887, Aurelius Heritage perpétue l&apos;excellence de la joaillerie française et l&apos;art horloger suisse pour les collectionneurs du monde entier.
            </>}</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href={`${basePath}/collections`} style={{ textDecoration: "none" }}>
                <button
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
                </button>
              </Link>
              <Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none" }}>
                <button
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
                </button>
              </Link>
            </motion.div>
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
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem,5vw,5rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem" }}>
              L&apos;Art du Temps Précieux
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem" }}>
            {[
              { name: "Constellation Noir", cat: "Haute Joaillerie", price: "€185,000", stone: "Diamant noir 8 ct", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85" },
              { name: "Éclipse Royale", cat: "Haute Horlogerie", price: "€48,000", stone: "Saphir de Ceylan", img: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=85" },
              { name: "Eternité Rose", cat: "Alliance sur-mesure", price: "À partir de €12,000", stone: "Diamant rose 3 ct", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85" },
              { name: "Heritage Tourbillon", cat: "Montre de collection", price: "€320,000", stone: "Rubis de Birmanie", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85" },
            ].map((item, i) => (
              <Reveal key={item.name} delay={i * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.6) brightness(0.9)", transition: "all 0.8s" }} onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = "saturate(1) brightness(1)"; (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }} onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = "saturate(0.6) brightness(0.9)"; (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>{item.cat}</p>
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
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", borderTop: `1px solid ${C.border}`, paddingTop: "2rem" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=85","https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=85","https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=85","https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85"].map((src, i) => (
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
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem", fontStyle: "italic" }}>
              Ce que disent nos clients.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2rem" }}>
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
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
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginTop: 6 }}>{t.piece}</div>
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
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, marginBottom: "4rem" }}>
              Maîtres artisans.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem" }}>
            {TEAM.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "2.5rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: FONT_HEADING, fontSize: "1.2rem", color: C.accent }}>
                      {m.name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <div style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>{m.exp} d&apos;expérience</div>
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
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 300, color: C.bg, lineHeight: 1.2, marginBottom: "2rem", fontStyle: "italic" }}>
              Une pièce unique,<br />conçue pour vous.
            </h2>
            <p style={{ fontFamily: FONT_HEADING, color: C.bg, opacity: 0.6, marginBottom: "3rem", lineHeight: 1.7, fontSize: "1.1rem" }}>
              Nos ateliers créent des pièces sur-mesure en collaboration directe avec vous. De l&apos;esquisse à la livraison, comptez 6 à 16 semaines selon la complexité. Chaque pièce sur-mesure est accompagnée d&apos;un certificat gemmologique indépendant.
            </p>
            <Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.bg, color: C.accent, border: "none", padding: "18px 48px", fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer" }}>
                Débuter votre création <ArrowRight size={14} />
              </button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
