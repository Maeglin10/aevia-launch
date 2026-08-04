"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Star,
  Clock,
  Check,
  Calendar,
} from "lucide-react";
import {
  C,
  EQBars,
  ArtistMarquee,
  SectionReveal,
  FAQItem,
  marqueeArtists,
  homeStudios as homeStudios_DEMO,
  gear,
  testimonials as testimonials_DEMO,
  packages,
  faqs as faqs_DEMO,
} from "./shared";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientFaq,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { val: "3", label: "studios indépendants" },
              { val: "200+", label: "artistes enregistrés" },
              { val: "12 ans", label: "d'expérience" },
              { val: "Lun–Dim", label: "10h – 23h" }
];
let STATS_INLINE = STATS_INLINE_SOURCE;

let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;


export default function EchoChamberPage() {
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

  STATS_INLINE = resolveList(

    clientStats(sessionData)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      val: s.value,

      label: s.label,

    })),

    STATS_INLINE_SOURCE,

  );
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Client service offerings drive the studios showcase; demo colour/size/features
  // cycle through so each tab stays visually complete.
  const homeStudios = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      name: s.title ?? s.name ?? homeStudios_DEMO[i % homeStudios_DEMO.length].name,
      size: s.price ?? homeStudios_DEMO[i % homeStudios_DEMO.length].size,
      desc: s.description ?? s.desc ?? homeStudios_DEMO[i % homeStudios_DEMO.length].desc,
      features: homeStudios_DEMO[i % homeStudios_DEMO.length].features,
      color: homeStudios_DEMO[i % homeStudios_DEMO.length].color,
    })),
    homeStudios_DEMO
  );
  const testimonials = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      name: r.name ?? r.author,
      role: r.location ?? r.role ?? testimonials_DEMO[i % testimonials_DEMO.length].role,
      text: r.text ?? r.quote,
      rating: r.stars ?? r.rating ?? 5,
      avatar: (r.name ?? r.author ?? "?").trim().slice(0, 2).toUpperCase(),
    })),
    testimonials_DEMO
  );
  const faqs = resolveList(
    clientFaq(sessionData)?.map((f: any) => ({ q: f.q ?? f.question, a: f.a ?? f.answer })),
    faqs_DEMO
  );

  const [activeStudio, setActiveStudio] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "clip" }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* HERO */}
      <section
        ref={heroRef}
        style={{ minHeight: "100dvh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "5rem" }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", backgroundColor: C.accent, filter: "blur(180px)", opacity: 0.06, pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 960, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <EQBars />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}
            style={{ fontFamily: C.headingFont, fontSize: "clamp(4rem, 10vw, 9rem)", fontWeight: 400, color: C.white, lineHeight: 0.95, marginBottom: "1.5rem", letterSpacing: "0.04em" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>{c?.heroHeadline ?? <>
            ECHO<br />
            <span style={{ color: C.accent }}>CHAMBER</span>
          </>}</>)}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.34 }}
            style={{ fontFamily: C.bodyFont, fontSize: "1.05rem", color: C.textLight, maxWidth: 540, margin: "0 auto 3rem", lineHeight: 1.75, letterSpacing: "0.01em" }}
          >{fd?.tagline ?? c?.heroSubline ?? <>
            Trois studios indépendants. SSL, Neve, Pro Tools HDX. 200+ artistes enregistrés. Votre son mérite ce qu'il y a de mieux.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.48 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
              <span
                style={{ backgroundColor: C.accent, color: C.white, padding: "1rem 2.6rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: `0 8px 30px ${C.accentGlow}`, letterSpacing: "0.03em" }}
              >
                Réserver une session <ArrowRight size={16} />
              </span>
            </Link>
            <Link href="/templates/impact-42/studios" style={{ textDecoration: "none" }}>
              <span
                style={{ border: `1px solid ${C.border}`, color: C.text, padding: "1rem 2.6rem", borderRadius: "6px", background: "none", cursor: "pointer", fontWeight: 600, fontFamily: C.bodyFont, fontSize: "0.95rem" }}
              >
                Visiter les studios
              </span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.62 }}
            style={{ display: "flex", gap: "3.5rem", justifyContent: "center", marginTop: "4.5rem", flexWrap: "wrap" }}
          >
            {STATS_INLINE.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "2rem", letterSpacing: "0.06em", color: C.accent }}>{s.val}</div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          <ChevronDown color={C.accent} size={28} opacity={0.6} />
        </motion.div>
      </section>

      {/* ── STUDIOS SHOWCASE ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nos espaces</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>TROIS STUDIOS, UNE VISION</>)}</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1px" }}>
              {homeStudios.map((s, i) => (
                <button key={s.name} type="button" onClick={() => setActiveStudio(i)}
                  style={{ padding: "0.75rem 1.75rem", background: "none", border: "none", cursor: "pointer", fontFamily: C.headingFont, fontSize: "1.1rem", letterSpacing: "0.08em", color: activeStudio === i ? s.color : C.textMuted, borderBottom: activeStudio === i ? `2px solid ${s.color}` : "2px solid transparent", transition: "all 0.2s", marginBottom: "-1px" }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div key={activeStudio} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2.5rem", alignItems: "start" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: homeStudios[activeStudio].color, letterSpacing: "0.04em" }}>{homeStudios[activeStudio].name}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: homeStudios[activeStudio].color, border: `1px solid ${homeStudios[activeStudio].color}55`, padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>{homeStudios[activeStudio].size}</span>
                </div>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.8, marginBottom: "2rem" }}>{homeStudios[activeStudio].desc}</p>
                <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
                  <span
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: homeStudios[activeStudio].color, color: C.white, padding: "0.8rem 1.8rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.88rem", boxShadow: `0 4px 20px ${homeStudios[activeStudio].color}33` }}
                  >
                    <Calendar size={15} /> Réserver {homeStudios[activeStudio].name}
                  </span>
                </Link>
              </div>
              <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {homeStudios[activeStudio].features.map((feat) => (
                  <div key={feat} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: homeStudios[activeStudio].color, flexShrink: 0 }} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.text }}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── ARTISTS MARQUEE ── */}
      <section style={{ padding: "5rem 0", backgroundColor: C.bg, overflow: "hidden" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto 3rem", padding: "0 2rem" }}>
          <SectionReveal>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Ils ont enregistré ici</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
            </div>
            <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0 0 2.5rem" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>200+ ARTISTES ET PRODUCTEURS</>)}</h2>
          </SectionReveal>
        </div>
        <ArtistMarquee artists={marqueeArtists} />
      </section>

      {/* ── GEAR ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Matériel</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>NOTRE ARSENAL</>)}</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "1.25rem" }}>
            {gear.map((g, i) => (
              <SectionReveal key={g.category} delay={i * 0.07}>
                <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.75rem" }}>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>{g.category}</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {g.items.map((item) => (
                      <li key={item} style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Avis clients</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>ILS EN PARLENT</>)}</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1.75rem" }}>
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.25rem" }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} color={C.accent} fill={C.accent} />)}
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.8, flex: 1, fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.04em", flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.white }}>{t.name}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.1rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>CHOISISSEZ VOTRE SESSION</>)}</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1.5rem", alignItems: "start" }}>
            {packages.map((pkg, i) => (
              <SectionReveal key={pkg.name} delay={i * 0.1}>
                <div style={{ backgroundColor: pkg.popular ? C.accent : pkg.color, border: `1px solid ${pkg.border}`, borderRadius: "12px", padding: "2.25rem", position: "relative", display: "flex", flexDirection: "column" }}>
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: "-13px", right: "1.5rem", backgroundColor: C.white, color: C.accent, padding: "0.25rem 0.85rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, fontFamily: C.bodyFont, letterSpacing: "0.08em" }}>
                      LE PLUS DEMANDÉ
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <Clock size={14} color={pkg.popular ? C.white : C.accent} opacity={0.7} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, color: pkg.popular ? C.white : C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{pkg.duration}</span>
                  </div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.06em", marginBottom: "0.35rem" }}>{pkg.name}</h3>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: pkg.popular ? "rgba(255,255,255,0.7)" : C.textMuted, marginBottom: "1.25rem" }}>{pkg.studio}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.02em" }}>{pkg.price}€</span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.72)" : C.textMuted, marginBottom: "2rem", lineHeight: 1.6 }}>{pkg.desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.25rem", flex: 1 }}>
                    {pkg.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem" }}>
                        <Check size={14} color={pkg.popular ? C.white : C.accent} style={{ flexShrink: 0, marginTop: "0.18rem" }} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.85)" : C.textLight }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
                    <span
                      style={{ display: "block", width: "100%", textAlign: "center", backgroundColor: pkg.popular ? C.white : C.accent, color: pkg.popular ? C.accent : C.white, padding: "0.9rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.9rem", letterSpacing: "0.03em" }}
                    >
                      Réserver cette session
                    </span>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>FAQ</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>VOS QUESTIONS</>)}</h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </SectionReveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait le nom du client nulle part */}
      <footer
        style={{
          padding: "40px 24px",
          textAlign: "center",
          fontSize: 13,
          letterSpacing: "0.08em",
          opacity: 0.55,
        }}
      >
        {clientName(sessionData) ?? "impact-42"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
