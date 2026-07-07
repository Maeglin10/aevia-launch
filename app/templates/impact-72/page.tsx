"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { C, TextReveal, MagneticButton, Marquee, StackedCards, FILMS, ServiceCard, SERVICES, PRESS } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function StackUnitHome() {
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

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroGlow = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const TICKER_ITEMS = [
    "MAISON DE PRODUCTION", "CANNES 2024", "SUNDANCE 2024", "VENISE 2023",
    "IDFA 2024", "BERLIN 2023", "23 ANS D'EXCELLENCE", "STACK UNIT FILMS",
  ];

  // Refs for scroll-reveal sections
  const filmographieRef = useRef<HTMLElement>(null);
  const filmographieInView = useInView(filmographieRef, { once: true, margin: "-80px" });

  const processusRef = useRef<HTMLElement>(null);
  const processusInView = useInView(processusRef, { once: true, margin: "-80px" });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const PROCESS_STEPS = [
    {
      num: "01",
      title: "Développement",
      desc: "De la page blanche au scénario finalisé. Accompagnement des auteurs, recherche de financement, co-production internationale.",
    },
    {
      num: "02",
      title: "Production",
      desc: "Casting, direction artistique, tournage. Notre équipe technique travaille avec les meilleurs talents européens.",
    },
    {
      num: "03",
      title: "Post-Production",
      desc: "Montage Avid, étalonnage DaVinci Resolve, mixage 5.1 Dolby. Studio Paris 15e, 3 salles de montage.",
    },
    {
      num: "04",
      title: "Distribution",
      desc: "Festivals, sorties salles, VOD. Réseau de 47 distributeurs dans 23 pays.",
    },
  ];

  
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
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        {/* Glow effect */}
        <motion.div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(202,138,4,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            opacity: heroGlow,
          }}
        />

        {/* Film grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: C.textDim, marginBottom: "2rem" }}
          >
            MAISON DE PRODUCTION INDÉPENDANTE · PARIS · EST. 2001
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", color: C.text, paddingBottom: "0.15em" }}>
                <TextReveal delay={0.3} style={{ paddingBottom: "0.15em" }}>L'ART</TextReveal>
                <TextReveal delay={0.45} style={{ color: C.amber, paddingBottom: "0.15em" }}>DU FILM</TextReveal>
                <TextReveal delay={0.6} style={{ fontStyle: "italic", fontWeight: 300, paddingBottom: "0.15em" }}>EXIGEANT</TextReveal>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginTop: "2.5rem", marginBottom: "2.5rem" }}
              >{c?.aboutText ?? <>
                Stack Unit produit des films qui résistent au temps. Long-métrages, documentaires, courts et films publicitaires — toujours avec la même exigence artistique absolue.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                style={{ display: "flex", gap: "1rem" }}
              >
                <MagneticButton
                  onClick={() => router.push("/templates/impact-72/films")}
                  style={{
                    background: C.amber,
                    color: C.bg,
                    border: "none",
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  VOIR LA FILMOGRAPHIE →
                </MagneticButton>
                <MagneticButton
                  onClick={() => router.push("/templates/impact-72/contact")}
                  style={{
                    background: "transparent",
                    color: C.textMuted,
                    border: `1px solid ${C.border}`,
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  SOUMETTRE UN PROJET
                </MagneticButton>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
                {[
                  { n: "62", label: "films produits" },
                  { n: "23", label: "ans d'existence" },
                  { n: "140+", label: "distinctions" },
                  { n: "18", label: "pays distribués" },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ background: C.bgCard, padding: "2rem" }}>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "2.5rem", fontWeight: 900, color: i % 2 === 0 ? C.amber : C.text, letterSpacing: "-0.03em" }}>
                      {stat.n}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: C.textDim, marginTop: "0.25rem" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 0", background: C.bgCard }}>
        <Marquee items={TICKER_ITEMS} speed={25} />
      </div>

      {/* ── Additional Home Section (Ethos / Quick navigation) ────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
            NOTRE MISSION
          </div>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "2rem", lineHeight: 1.15, paddingBottom: "0.15em" }}>
            Une écriture cinématographique sans concession.
          </h2>
          <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "60ch", margin: "0 auto 3rem" }}>
            Depuis plus de deux décennies, nous accompagnons des réalisateurs audacieux et des récits porteurs de sens. De la recherche de financement à la diffusion internationale, nous défendons une vision indépendante et passionnée du septième art.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
            <Link href="/templates/impact-72/films" style={{ textDecoration: "none" }}>
              <span style={{ color: C.amber, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>VOIR NOS FILMS →</span>
            </Link>
            <Link href="/templates/impact-72/studio" style={{ textDecoration: "none" }}>
              <span style={{ color: C.text, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>DÉCOUVRIR LE STUDIO →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 1 : Filmographie / StackedCards ────────────────────── */}
      <section ref={filmographieRef} style={{ padding: "8rem 3rem", background: C.bgCard }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={filmographieInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>FILMOGRAPHIE</div>
              <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.15, paddingBottom: "0.15em", marginBottom: "1.5rem" }}>
                Des films qui<br /><span style={{ color: C.amber }}>résistent au temps.</span>
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginBottom: "2rem" }}>
                Quatre décennies de cinéma exigeant. Compétition officielle à Cannes, Lion d'Argent à Venise, Grand Prix à l'IDFA — chaque projet est une aventure artistique totale.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={filmographieInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/templates/impact-72/films" style={{ textDecoration: "none" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", color: C.amber }}>
                    CATALOGUE COMPLET →
                  </span>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={filmographieInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <StackedCards films={FILMS} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2 : Services ───────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>EXPERTISE</div>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.15, marginBottom: "4rem", paddingBottom: "0.15em" }}>
            De l'idée à l'écran.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1px", background: C.border }}>
            {SERVICES.map((svc, i) => <ServiceCard key={svc.code} svc={svc} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Section 3 : Presse ─────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgCard }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "4rem" }}>ILS PARLENT DE NOUS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
            {PRESS.map((p, i) => {
              const quoteRef = useRef<HTMLDivElement>(null);
              const quoteInView = useInView(quoteRef, { once: true, margin: "-40px" });
              return (
                <motion.div
                  key={i}
                  ref={quoteRef}
                  initial={{ opacity: 0, x: -20 }}
                  animate={quoteInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ borderLeft: `2px solid ${i === 0 ? C.amber : C.border}`, paddingLeft: "2rem" }}
                >
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontStyle: "italic", color: C.text, lineHeight: 1.6, marginBottom: "1rem" }}>
                    "{p.quote}"
                  </p>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", color: C.amber }}>{p.outlet}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: C.textDim }}>{p.year}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4 : Processus ──────────────────────────────────────── */}
      <section ref={processusRef} style={{ padding: "8rem 3rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processusInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "5rem" }}
          >
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>NOTRE MÉTHODE</div>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>
              Du concept à la salle.
            </h2>
          </motion.div>

          {/* Steps grid — 4 columns desktop */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0" }}>
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={processusInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderLeft: i === 0 ? `1px solid ${C.border}` : "none",
                  borderRight: `1px solid ${C.border}`,
                  borderTop: `1px solid ${C.border}`,
                  borderBottom: `1px solid ${C.border}`,
                  padding: "2.5rem 2rem",
                  position: "relative",
                  background: C.bg,
                  transition: "background 0.3s",
                }}
                whileHover={{ background: C.bgCard }}
              >
                {/* Step number — large watermark */}
                <div style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "5rem",
                  fontWeight: 900,
                  color: C.textDim,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  marginBottom: "1.5rem",
                  opacity: 0.6,
                }}>
                  {step.num}
                </div>

                {/* Amber accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={processusInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 + 0.3 }}
                  style={{
                    height: "1px",
                    background: C.amber,
                    transformOrigin: "left",
                    marginBottom: "1.5rem",
                    width: "2rem",
                  }}
                />

                <h3 style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "1rem",
                  letterSpacing: "-0.01em",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.82rem",
                  color: C.textMuted,
                  lineHeight: 1.75,
                }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 : CTA ────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{ padding: "10rem 3rem", background: C.bgCard, position: "relative", overflow: "hidden" }}>
        {/* Ambient amber glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(202,138,4,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "2rem" }}
          >
            COLLABORONS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: C.text,
              lineHeight: 1.1,
              paddingBottom: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            Vous avez<br />
            <span style={{ color: C.amber }}>un projet ?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              color: C.textMuted,
              lineHeight: 1.8,
              maxWidth: "55ch",
              margin: "0 auto 3.5rem",
            }}
          >
            Scénario, documentaire, court-métrage, film institutionnel — nous étudions chaque dossier avec attention. Partagez votre vision, nous vous accompagnons de l'écriture à la diffusion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => router.push("/templates/impact-72/contact")}
              style={{
                background: C.amber,
                color: C.bg,
                border: "none",
                padding: "1rem 2.5rem",
                fontFamily: "'Archivo', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              SOUMETTRE UN PROJET →
            </MagneticButton>
            <MagneticButton
              onClick={() => router.push("/templates/impact-72/films")}
              style={{
                background: "transparent",
                color: C.text,
                border: `1px solid ${C.borderBright}`,
                padding: "1rem 2.5rem",
                fontFamily: "'Archivo', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
              }}
            >
              DÉCOUVRIR LA FILMOGRAPHIE
            </MagneticButton>
          </motion.div>

          {/* Decorative bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={ctaInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
              transformOrigin: "center",
              marginTop: "5rem",
              opacity: 0.5,
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              marginTop: "2rem",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              color: C.textDim,
            }}
          >
            STACK UNIT FILMS · PARIS · EST. 2001
          </motion.div>
        </div>
      </section>
    </div>
  );
}
