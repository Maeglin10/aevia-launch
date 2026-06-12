"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  ChevronDown,
  ChevronRight,
  Shield,
  Award,
  Heart,
  Smile,
  CheckCircle,
  Calendar,
  Users,
  ThumbsUp,
} from "lucide-react";
import { C, FONT, AnimatedTooth, SERVICES, STATS, TESTIMONIALS, TEAM, PLANS, FAQS } from "./shared";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const servicesRef = useRef<HTMLElement>(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-80px" });

  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const testimonialsRef = useRef<HTMLElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-60px" });

  const teamRef = useRef<HTMLElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-60px" });

  const pricingRef = useRef<HTMLElement>(null);
  const pricingInView = useInView(pricingRef, { once: true, margin: "-60px" });

  const faqRef = useRef<HTMLElement>(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-60px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          background: `linear-gradient(140deg, ${C.bg} 0%, ${C.bgLight} 100%)`,
          display: "flex",
          alignItems: "center",
          padding: "100px 80px 60px",
          position: "relative",
          overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 68%)`,
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />

        {/* Left column: text */}
        <motion.div
          style={{ flex: 1, maxWidth: 580, position: "relative", zIndex: 1, y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.accentLight,
              border: `1px solid ${C.accent}`,
              borderRadius: 20,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <Shield size={14} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
              Cabinet agréé ARS Île-de-France
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(36px, 4vw, 58px)",
              fontWeight: 800,
              color: C.text,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              marginBottom: 24,
            }}
          >
            Votre sourire, <span style={{ color: C.accent }}>notre passion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 18,
              color: C.textMuted,
              lineHeight: 1.72,
              marginBottom: 38,
              maxWidth: 490,
            }}
          >
            Smile Studio est le cabinet dentaire de référence à Paris 8e. Soins de pointe,
            technologies dernière génération et équipe bienveillante pour des résultats
            qui transforment votre vie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
          >
            <motion.button
              onClick={() => {
                document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "16px 32px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT,
              }}
              whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar size={18} />
              Prendre rendez-vous
            </motion.button>
            <Link
              href="/templates/impact-30/soins"
              style={{
                background: "transparent",
                color: C.text,
                border: `2px solid ${C.border}`,
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT,
              }}
            >
              Découvrir nos soins <ChevronRight size={18} />
            </Link>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 36 }}
          >
            {[
              { value: "15+", label: "Ans d'expertise" },
              { value: "4.9★", label: "Note Google" },
              { value: "12 000+", label: "Patients" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right column: tooth */}
        <motion.div
          style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex"
        >
          <AnimatedTooth />
        </motion.div>
      </section>

      {/* Services */}
      <section
        id="services"
        ref={servicesRef}
        style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={servicesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: C.accentLight,
              color: C.accent,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Nos soins
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 800,
              color: C.text,
              letterSpacing: -1,
              marginBottom: 16,
            }}
          >
            Des traitements d'excellence
          </h2>
          <p style={{ fontSize: 18, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
            Chaque soin est réalisé avec les technologies les plus récentes pour votre confort maximal.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 28,
            maxWidth: 1100,
            margin: "0 auto 48px",
          }}
        >
          {SERVICES.map((s, i) => (
            <Link
              href="/templates/impact-30/soins"
              key={s.title}
            >
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: C.shadowLg }}
                style={{
                  background: C.white,
                  borderRadius: 20,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  boxShadow: C.shadow,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 0.25s",
                  height: "100%"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: C.accentLight,
                    color: C.accent,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {s.tag}
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: C.accentLight,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65, marginBottom: 22 }}>
                  {s.desc}
                </p>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 16 }}>{s.price}</div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/templates/impact-30/soins"
            style={{
              color: C.accent,
              fontWeight: 700,
              fontSize: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Consulter le catalogue clinique complet <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef}
        style={{
          padding: "90px 80px",
          background: `linear-gradient(135deg, ${C.text} 0%, #253b6e 100%)`,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 40,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: "rgba(0,184,148,0.22)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 900,
                  color: C.white,
                  letterSpacing: -1,
                  marginBottom: 8,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: C.accentLight,
              color: C.accent,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Témoignages
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 800,
              color: C.text,
              letterSpacing: -1,
            }}
          >
            Avant / Après — Ils nous font confiance
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 44 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              style={{
                background: C.bgSection,
                borderRadius: 20,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                boxShadow: C.shadow,
              }}
            >
              {/* Before */}
              <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${C.border}`, background: "#fff8f8" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#d46060", letterSpacing: 1, marginBottom: 8 }}>
                  Avant
                </div>
                <p style={{ color: C.textMuted, fontSize: 14, fontStyle: "italic", lineHeight: 1.65 }}>
                  "{t.before}"
                </p>
              </div>
              {/* After */}
              <div style={{ padding: "24px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.accent, letterSpacing: 1, marginBottom: 8 }}>
                  Après
                </div>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  "{t.after}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{t.treatment}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                      {Array.from({ length: t.stars }).map((_, k) => (
                        <Star key={k} size={13} color="#f59e0b" fill="#f59e0b" />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted, textAlign: "right" }}>{t.date}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section
        ref={teamRef}
        style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: C.accentLight,
              color: C.accent,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Notre équipe
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
            Des experts à votre service
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            maxWidth: 920,
            margin: "0 auto 48px",
          }}
        >
          {TEAM.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 44 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: C.shadowLg }}
              style={{
                background: C.white,
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
                border: `1px solid ${C.border}`,
                boxShadow: C.shadow,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: doc.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: C.white,
                  letterSpacing: 1,
                }}
              >
                {doc.initials}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
              <div style={{ fontSize: 14, fontWeight: 600, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
              <div
                style={{
                  display: "inline-block",
                  background: C.bgLight,
                  borderRadius: 20,
                  padding: "5px 15px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {doc.experience} d'expérience
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/templates/impact-30/team"
            style={{
              color: C.accent,
              fontWeight: 700,
              fontSize: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Voir les biographies de nos praticiens <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section
        ref={pricingRef}
        style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: C.accentLight,
              color: C.accent,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Tarifs
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
            Des prix transparents
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            Remboursement Sécurité Sociale & mutuelles — Financement possible
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            maxWidth: 980,
            margin: "0 auto 48px",
            alignItems: "start",
          }}
        >
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 44 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              style={{
                background: p.highlight ? C.text : C.white,
                borderRadius: 24,
                padding: "38px 32px",
                border: p.highlight ? "none" : `2px solid ${C.border}`,
                boxShadow: p.highlight ? C.shadowLg : C.shadow,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {p.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${C.accent}, #00e0b5)`,
                  }}
                />
              )}
              {p.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: C.accent,
                    color: C.white,
                    borderRadius: 20,
                    padding: "4px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Le plus choisi
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>
                {p.desc}
              </p>
              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    fontSize: p.price.includes("Devis") || p.price.includes("Sur") ? 26 : 40,
                    fontWeight: 900,
                    color: p.highlight ? C.white : C.text,
                    letterSpacing: -1,
                  }}
                >
                  {p.price.includes("Devis") || p.price.includes("Sur") ? p.price : `€${p.price}`}
                </span>
                {!p.price.includes("Devis") && !p.price.includes("Sur") && (
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>
                    {p.period}
                  </span>
                )}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 11 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={16} color={C.accent} />
                    <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/templates/impact-30/pricing"
                style={{
                  display: "block",
                  width: "100%",
                  background: p.highlight ? C.accent : "transparent",
                  color: p.highlight ? C.white : C.text,
                  border: p.highlight ? "none" : `2px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "14px",
                  fontWeight: 700,
                  fontSize: 15,
                  textAlign: "center",
                  fontFamily: FONT,
                }}
              >
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/templates/impact-30/pricing"
            style={{
              color: C.accent,
              fontWeight: 700,
              fontSize: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Accéder au simulateur de remboursement mutuelle <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqRef}
        style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: C.accentLight,
              color: C.accent,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            FAQ
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
            Questions fréquentes
          </h2>
        </motion.div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: C.white,
                borderRadius: 14,
                border: `1px solid ${openFaq === i ? C.accent : C.border}`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  textAlign: "left",
                  fontFamily: FONT,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown size={20} color={openFaq === i ? C.accent : C.textMuted} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" style={{ padding: "80px 48px", background: C.bgSection, fontFamily: FONT, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 10 }}>Contactez notre Cabinet</h2>
            <p style={{ color: C.textMuted, fontSize: 15 }}>Une question ou une demande spécifique ? Laissez-nous un message.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="grid grid-cols-1 md:grid-cols-2">
            <input type="text" placeholder="Votre Nom" style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none" }} />
            <input type="email" placeholder="Votre E-mail" style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none" }} />
          </div>
          <textarea placeholder="Votre message..." rows={4} style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", resize: "none", marginBottom: 20 }} />
          <button 
            onClick={() => alert("Message envoyé ! (Simulation)")}
            style={{ width: "100%", padding: "14px", background: C.accent, color: C.white, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
          >
            Envoyer le message
          </button>
        </div>
      </section>
    </div>
  );
}
