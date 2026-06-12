"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Star,
  ArrowRight,
  Clock,
  Heart,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import {
  C,
  seasons,
  seasonData,
  testimonials,
  SectionReveal,
  GoldDivider,
} from "./shared";

export default function GastronomyPage() {
  const [activeSeason, setActiveSeason] = useState<"spring" | "summer" | "fall" | "winter">("spring");
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div style={{ backgroundColor: C.bg, color: C.text }}>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          backgroundColor: C.bgDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "5rem",
        }}
      >
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop"
            alt="Cuisine gastronomique"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
          />
        </div>

        {/* Background rings */}
        {[340, 220, 120].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "12%",
              right: `${6 + i * 5}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1.5px solid rgba(240,192,64,${0.08 + i * 0.04})`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        ))}

        {/* Texture dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(240,192,64,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 860, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-block",
              backgroundColor: "rgba(240,192,64,0.12)",
              border: `1px solid rgba(240,192,64,0.35)`,
              color: C.accent,
              padding: "0.35rem 1.1rem",
              borderRadius: "2rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
              fontFamily: C.bodyFont,
            }}
          >
            2 étoiles Michelin · Beaujolais
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14 }}
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(3rem, 7.5vw, 5.8rem)",
              fontWeight: 700,
              color: C.bg,
              lineHeight: 1.08,
              marginBottom: "1.5rem",
            }}
          >
            La cuisine comme<br />
            <span style={{ color: C.accent }}>dialogue avec la saison</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.12rem",
              color: "rgba(253,249,238,0.72)",
              maxWidth: 560,
              margin: "0 auto 2.75rem",
              lineHeight: 1.8,
            }}
          >
            Restaurant gastronomique saisonnier. Chef Gabriel Renaud compose chaque assiette autour des producteurs locaux du Beaujolais, au rythme de la nature.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  backgroundColor: C.accent,
                  color: C.bgDark,
                  padding: "1rem 2.4rem",
                  borderRadius: "3rem",
                  border: "none",
                  fontWeight: 800,
                  fontFamily: C.bodyFont,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 8px 32px rgba(240,192,64,0.32)",
                  cursor: "pointer",
                }}
              >
                Réserver une table <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/templates/impact-40/menu" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  border: `2px solid rgba(253,249,238,0.28)`,
                  color: C.bg,
                  padding: "1rem 2.4rem",
                  borderRadius: "3rem",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Découvrir nos menus
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section style={{ padding: "8rem 0 6rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
            <SectionReveal>
              <div>
                <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
                  Notre vision
                </span>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1.2rem", lineHeight: 1.15 }}>
                  Sublimer la nature sans la dénaturer
                </h2>
                <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "1.2rem" }}>
                  Pour Gabriel Renaud, l'assiette n'est pas un lieu de démonstration technique, mais un espace de rencontre. Celui d'une terre — le Beaujolais — et d'un instant précis de l'année.
                </p>
                <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "2rem" }}>
                  En travaillant main dans la main avec 18 maraîchers, éleveurs et cueilleurs locaux situés dans un rayon de 40 kilomètres, le restaurant s'assure d'une traçabilité absolue et d'une fraîcheur incomparable. Nos menus évoluent chaque semaine au gré des récoltes matinales.
                </p>

                <div style={{ display: "flex", gap: "2.5rem" }}>
                  {[
                    { val: "100%", desc: "Ingrédients traçables" },
                    { val: "40km", desc: "Rayon d'approvisionnement" },
                    { val: "18", desc: "Producteurs partenaires" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: C.headingFont, fontSize: "1.8rem", fontWeight: 700, color: C.accentDark }}>{stat.val}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.76rem", color: C.textMuted, marginTop: "0.2rem" }}>{stat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.14}>
              <div
                style={{
                  borderRadius: "2.5rem",
                  overflow: "hidden",
                  boxShadow: `0 20px 60px ${C.shadow}`,
                  aspectRatio: "4/5",
                  backgroundColor: C.bgAlt,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&fit=crop"
                  alt="Préparation de saison"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── SEASONS SECTION ── */}
      <section style={{ padding: "6rem 0 7rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
                Le rythme de la nature
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem" }}>
                Notre calendrier de cueillette
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "0.95rem", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
                Découvrez les ingrédients phares qui inspirent la cuisine du Chef Gabriel selon les moments de l'année.
              </p>
            </div>
          </SectionReveal>

          {/* Season tabs */}
          <SectionReveal delay={0.1}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "3rem",
                backgroundColor: C.bg,
                padding: "0.4rem",
                borderRadius: "3rem",
                boxShadow: `0 4px 24px ${C.shadow}`,
                maxWidth: 560,
                margin: "0 auto 3rem",
              }}
              className="flex-wrap"
            >
              {seasons.map((s) => {
                const isSelected = activeSeason === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSeason(s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.75rem 1.4rem",
                      borderRadius: "2rem",
                      border: "none",
                      backgroundColor: isSelected ? C.bgDark : "transparent",
                      color: isSelected ? C.accent : C.textLight,
                      fontFamily: C.bodyFont,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {seasonData[s].icon}
                    <span>{seasonData[s].label}</span>
                  </button>
                );
              })}
            </div>
          </SectionReveal>

          {/* Season content */}
          <div style={{ minHeight: 340 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSeason}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.38 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {seasonData[activeSeason].items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: C.bg,
                      borderRadius: "1.25rem",
                      padding: "1.75rem",
                      border: `1.5px solid ${C.border}`,
                      boxShadow: `0 4px 20px ${C.shadow}`,
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.85rem" }}>{item.emoji}</div>
                    <h3 style={{ fontFamily: C.headingFont, fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.textLight, lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "8rem 0", backgroundColor: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, rgba(253,249,238,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>
                Témoignages
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.bg, fontWeight: 700, margin: "0.6rem 0 1rem" }}>
                Ce que nos convives écrivent
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {testimonials.map((t, idx) => (
              <SectionReveal key={t.name} delay={idx * 0.1}>
                <div
                  style={{
                    backgroundColor: "rgba(253,249,238,0.04)",
                    border: "1px solid rgba(253,249,238,0.1)",
                    borderRadius: "1.75rem",
                    padding: "2.5rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.2rem" }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={15} fill={C.accent} color={C.accent} />
                      ))}
                    </div>
                    <blockquote
                      style={{
                        fontFamily: C.bodyFont,
                        fontSize: "0.93rem",
                        color: "rgba(253,249,238,0.78)",
                        lineHeight: 1.8,
                        margin: "0 0 2rem",
                        fontStyle: "italic",
                      }}
                    >
                      "{t.text}"
                    </blockquote>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        backgroundColor: "rgba(240,192,64,0.15)",
                        border: `1.5px solid ${C.accent}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: C.headingFont,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: C.accent,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.headingFont, fontWeight: 700, fontSize: "0.95rem", color: C.bg }}>{t.name}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.4)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESERVATION PROMPT ── */}
      <section style={{ padding: "8rem 0", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <SectionReveal>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(30,58,15,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Leaf size={22} color={C.bgDark} />
            </div>
            <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4.5vw, 3rem)", color: C.text, fontWeight: 700, marginBottom: "1.2rem", lineHeight: 1.15 }}>
              Vivre l'expérience gastronomique
            </h2>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1.05rem", lineHeight: 1.85, marginBottom: "2.5rem", maxWidth: 500, margin: "0 auto 2.5rem" }}>
              Notre salle dispose de 22 couverts seulement afin de vous garantir une intimité et un service sur mesure. Nous vous conseillons de réserver votre table à l'avance.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: C.bgDark,
                    color: C.accent,
                    padding: "1rem 2.4rem",
                    borderRadius: "3rem",
                    border: "none",
                    fontWeight: 700,
                    fontFamily: C.bodyFont,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Réserver en ligne <ArrowRight size={16} />
                </button>
              </Link>
              <a
                href="tel:+33474XXXXXX"
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: C.text,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  textDecoration: "none",
                }}
              >
                <Clock size={16} /> ou appeler au +33 4 74 XX XX XX
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
