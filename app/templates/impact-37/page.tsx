"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Star, Check } from "lucide-react";
import Link from "next/link";
import {
  C,
  SERIF,
  SANS,
  WINE_REGIONS,
  EVENTS,
  MEMBERSHIP_TIERS,
  TESTIMONIALS,
  FAQS,
  WineBottleSVG,
  FAQItem,
  SectionReveal,
} from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ClosDuSoirPage() {
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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const wineBottleFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  
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
    <div style={{ overflowX: "clip", background: C.bg }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* HERO — dark full-bleed */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: C.burgundyDark,
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${C.gold}08 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Rose glow bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "10%",
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${C.burgundyLight}40 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Gold glow right */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${C.gold}15 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 5% 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 80,
              alignItems: "center",
            }}
            className="grid-cols-1 md:grid-cols-[1fr_auto] imx-mobstack"
          >
            {/* Left: Text */}
            <motion.div style={{ y: heroTextY, opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 28,
                }}
              >
                Paris 1er Arrondissement
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15 }}
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(48px, 6vw, 86px)",
                  fontWeight: 700,
                  color: C.cream,
                  lineHeight: 1.05,
                  marginBottom: 28,
                }}
              >{c?.heroHeadline ?? <>
                Where the evening
                <br />
                <span style={{ color: C.gold, fontStyle: "italic" }}>
                  reveals itself
                </span>
              </>}</motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{fontSize: 17,
                  color: brand ?? '#c4a882',
                  lineHeight: 1.85,
                  marginBottom: 44,
                  maxWidth: 440,
                  fontWeight: 300,
                }}
              >{c?.heroSubline ?? fd?.tagline ?? <>
                A curated wine bar and sommelier experience in the heart of Paris. Intimate evenings, rare bottles, and the stories they carry.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Link href="/templates/impact-37/carte" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "16px 32px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Explore the Wine List
                  </button>
                </Link>
                <Link href="/templates/impact-37/reservation" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      color: C.gold,
                      padding: "16px 32px",
                      borderRadius: 2,
                      fontWeight: 400,
                      fontSize: 13,
                      cursor: "pointer",
                      border: `1px solid ${C.gold}60`,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Membership
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Wine bottle with scroll-fill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden md:block"
            >
              <WineBottleSVG fillProgress={wineBottleFill} />
              <p
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  fontSize: 12,
                  color: C.gold,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: SERIF,
                }}
              >
                Scroll to fill
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WINE LIST BY REGION */}
      <section
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                La Carte des Vins
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 16,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                Curated from the world's finest regions
              </>}</h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >{c?.aboutText ?? <>
                Our 280-reference cellar is personally curated by Head Sommelier Claire Vidal MW. Updated seasonally with small-production gems.
              </>}</p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: 32,
            }}
          >
            {WINE_REGIONS.map((region, i) => (
              <SectionReveal key={region.region} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Globe size={16} color={C.gold} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.burgundy,
                      }}
                    >
                      {region.region}
                    </span>
                    <span
                      style={{
                        background: C.goldLight,
                        color: C.gold,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {region.flag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    {region.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {region.selections.map((wine, j) => (
                      <div
                        key={wine.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom:
                            j < region.selections.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: SERIF,
                              fontSize: 15,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {wine.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.textMuted,
                              marginTop: 2,
                              fontStyle: "italic",
                            }}
                          >
                            {wine.grape}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: SERIF,
                              fontSize: 18,
                              fontWeight: 700,
                              color: C.burgundy,
                            }}
                          >
                            {wine.price} €
                          </div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>
                            EUR / verre
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE — Sommelier story */}
      <section
        style={{ padding: "100px 5%", background: C.burgundy }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            <SectionReveal>
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 20,
                  }}
                >
                  L'Expérience
                </div>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 700,
                    color: C.cream,
                    lineHeight: 1.15,
                    marginBottom: 24,
                  }}
                >
                  Guided by Claire Vidal,{" "}
                  <span style={{ fontStyle: "italic", color: C.rose }}>
                    Master of Wine
                  </span>
                </h2>
                <p
                  style={{fontSize: 16,
                    color: brand ?? '#c4a882',
                    lineHeight: 1.9,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  Claire spent a decade as a buyer for a Michelin three-star in Lyon before dedicating herself to a single vision: a wine bar where the story of every bottle is told with care.
                </p>
                <p
                  style={{fontSize: 16,
                    color: brand ?? '#c4a882',
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  Each evening at Clos du Soir, she or one of her carefully trained team guides guests through the language of terroir, vintage, and winemaker intention — making every glass a conversation.
                </p>
                <div
                  style={{
                    marginTop: 36,
                    display: "flex",
                    gap: 40,
                  }}
                >
                  {[
                    { value: "280+", label: "Références en cave" },
                    { value: "12 ans", label: "Expérience MW" },
                    { value: "40+", label: "Vignerons partenaires" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 32,
                          fontWeight: 700,
                          color: C.gold,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{fontSize: 13,
                          color: brand ?? '#c4a882',
                          marginTop: 4,
                          fontWeight: 300,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  padding: 36,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 24,
                  }}
                >
                  Une soirée au Clos du Soir
                </div>
                {[
                  {
                    time: "19:00",
                    desc: "Arrivée — amuse-bouche de courtoisie et premier verre sélectionné par le sommelier",
                  },
                  {
                    time: "19:30",
                    desc: "Découverte de la carte avec les recommandations de notre équipe",
                  },
                  {
                    time: "20:30",
                    desc: "Vol d'initiation — dégustation comparative de 3 vins d'un même terroir",
                  },
                  {
                    time: "21:30",
                    desc: "Sélection cave — bouteilles à emporter à emporter avec conseil direct",
                  },
                  {
                    time: "22:30",
                    desc: "Dernier verre et départ avec votre bouteille coup de cœur",
                  },
                ].map((step, i) => (
                  <div
                    key={step.time}
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                      paddingBottom: 20,
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.gold,
                        flexShrink: 0,
                        width: 44,
                      }}
                    >
                      {step.time}
                    </div>
                    <div
                      style={{fontSize: 14,
                        color: brand ?? '#c4a882',
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* TASTING EVENTS */}
      <section
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 14,
                }}
              >
                Prochaines Dégustations
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: C.textMuted,
                  maxWidth: 440,
                  margin: "0 auto",
                  fontWeight: 300,
                }}
              >
                Intimate evenings curated for curiosity. Members receive priority booking.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
              gap: 20,
            }}
          >
            {EVENTS.map((ev, i) => (
              <SectionReveal key={ev.title} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 28,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    opacity: ev.sold ? 0.7 : 1,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: ev.sold ? C.border : C.goldLight,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: SERIF,
                      fontSize: 13,
                      fontWeight: 700,
                      color: ev.sold ? C.textMuted : C.burgundy,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: SERIF,
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                        }}
                      >
                        {ev.title}
                      </h3>
                      {ev.sold && (
                        <span
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 2,
                            textTransform: "uppercase",
                          }}
                        >
                          Complet
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.textMuted,
                        lineHeight: 1.65,
                        marginBottom: 14,
                        fontWeight: 300,
                      }}
                    >
                      {ev.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: SERIF,
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.burgundy,
                          }}
                        >
                          {ev.price} €
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: ev.spots === 0 ? "#dc2626" : C.gold,
                            fontWeight: 600,
                          }}
                        >
                          {ev.spots === 0
                            ? "Plus de places"
                            : `${ev.spots} places restantes`}
                        </span>
                      </div>
                      {!ev.sold && (
                        <Link href="/templates/impact-37/contact" style={{ textDecoration: "none" }}>
                          <button
                            style={{
                              background: C.burgundy,
                              color: C.cream,
                              padding: "8px 18px",
                              borderRadius: 2,
                              fontSize: 12,
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              fontFamily: SANS,
                            }}
                          >
                            Réserver
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                Ce qu'en disent nos membres
              </h2>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={C.gold}
                        color={C.gold}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: C.text,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: C.goldLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.burgundy,
                        flexShrink: 0,
                        fontFamily: SERIF,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.burgundy,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: C.textMuted }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section
        style={{ padding: "100px 5%", background: C.burgundyDark }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                Adhésion
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.cream,
                  marginBottom: 16,
                }}
              >
                Rejoignez le Club
              </h2>
              <p
                style={{fontSize: 15,
                  color: brand ?? '#c4a882',
                  maxWidth: 440,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Membership unlocks privileges, curated bottles, and a community of like-minded enthusiasts.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {MEMBERSHIP_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.12}>
                <div
                  style={{
                    background: tier.highlight
                      ? C.burgundy
                      : "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    padding: 36,
                    border: tier.highlight
                      ? `2px solid ${C.gold}`
                      : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: C.gold,
                        color: C.burgundyDark,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Recommandé
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 28,
                      fontWeight: 700,
                      color: tier.color,
                      marginBottom: 6,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div
                    style={{fontSize: 12,
                      color: brand ?? '#c4a882',
                      fontStyle: "italic",
                      marginBottom: 20,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tier.tagline}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 44,
                        fontWeight: 700,
                        color: C.cream,
                      }}
                    >
                      {tier.price} €
                    </span>
                    <span
                      style={{fontSize: 14,
                        color: brand ?? '#c4a882',
                        marginLeft: 4,
                      }}
                    >
                      /{tier.period === "per month" ? "mois" : tier.period}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 28,
                    }}
                  >
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <Check
                          size={14}
                          color={C.gold}
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{fontSize: 13,
                            color: brand ?? '#c4a882',
                            lineHeight: 1.5,
                            fontWeight: 300,
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link href="/templates/impact-37/contact" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        width: "100%",
                        display: "block",
                        textAlign: "center",
                        background: tier.highlight ? C.gold : "transparent",
                        color: tier.highlight ? C.burgundyDark : C.gold,
                        padding: "14px 24px",
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        border: tier.highlight ? "none" : `1px solid ${C.gold}60`,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: SANS,
                      }}
                    >
                      Rejoindre {tier.name}
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                Questions Fréquentes
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
