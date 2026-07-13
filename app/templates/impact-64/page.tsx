"use client";
// @ts-nocheck

import {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Activity, Lock } from "lucide-react";
import { C, mono, sans, STATS, TESTIMONIALS, useCounter, LiveTerminal } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact64Page() {
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
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const terminalRef = useRef(null);
  const terminalInView = useInView(terminalRef, { once: true, margin: "-80px" });

  const stat0 = useCounter(STATS[0].value, statsInView, 0);
  const stat1 = useCounter(STATS[1].value, statsInView, 2);
  const stat2 = useCounter(STATS[2].value, statsInView, 0);
  const stat3 = useCounter(STATS[3].value, statsInView, 0);
  const statValues = [stat0, stat1, stat2, stat3];

  
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
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 700px) {
          .i64-process-grid { grid-template-columns: 1fr !important; row-gap: 2.5rem !important; }
          .i64-process-line { display: none !important; }
        }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", padding: "4rem 2.5rem 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(0,230,118,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div className="imx-mobstack" style={{ y: heroY, opacity: heroOpacity, maxWidth: "1400px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.4rem 0.9rem", marginBottom: "2rem" }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, display: "inline-block" }} />
              <span style={{ fontFamily: mono, fontSize: "0.68rem", color: C.green, letterSpacing: "0.12em" }}>PRIS ANSSI · NIS2 COMPLIANT · SOC ACTIF 24/7</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{ fontFamily: mono, fontSize: "clamp(42px, 6vw, 88px)", fontWeight: 700, lineHeight: 1.15, paddingBottom: "0.15em", letterSpacing: "-0.02em", marginBottom: "1.75rem" }}
            >{c?.heroHeadline ?? <>
              <span style={{ color: C.text }}>Votre infrastructure.</span>
              <br />
              <span style={{ color: C.green }}>Nos sentinelles.</span>
              <br />
              <span style={{ color: C.textMuted, fontSize: "0.55em", fontWeight: 400 }}>SOC · Red Team · ISO 27001</span>
            </>}</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "500px", marginBottom: "2.5rem" }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              NeuronSec est le centre opérationnel de cybersécurité des entreprises qui ne peuvent pas se permettre d'être hackées. SOC 24/7, Red Team offensif, conformité NIS2 et ISO 27001.
            </>}</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <Link href="/templates/impact-64/contact" style={{
                fontFamily: mono, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
                background: C.green, color: C.bg, padding: "0.9rem 2rem",
                borderRadius: "4px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px rgba(0,230,118,0.5)`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                AUDIT GRATUIT <ArrowRight size={14} />
              </Link>
              <Link href="/templates/impact-64/solutions" style={{
                fontFamily: mono, fontSize: "0.78rem", letterSpacing: "0.1em",
                background: "transparent", color: C.green, padding: "0.9rem 2rem",
                borderRadius: "4px", textDecoration: "none", border: `1px solid ${C.greenBorder}`,
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = "rgba(0,230,118,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.background = "transparent"; }}
              >
                VOIR LE SOC
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}
            >
              {[{ v: "3 800+", l: "incidents traités" }, { v: "99.98%", l: "SLA garanti" }, { v: "<8 min", l: "MTTR moyen" }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: mono, fontSize: "1.3rem", fontWeight: 700, color: C.green }}>{s.v}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.08em" }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <LiveTerminal />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{
                padding: "3rem 2rem",
                border: `1px solid ${C.greenBorder}`,
                background: i % 2 === 0 ? C.bgCard : "transparent",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 700, color: C.green, lineHeight: 1 }}>
                {statValues[i]}{stat.suffix}
              </div>
              <div style={{ fontFamily: mono, fontSize: "0.7rem", color: C.textMuted, marginTop: "0.75rem", letterSpacing: "0.08em" }}>{stat.label.toUpperCase()}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "5rem", textAlign: "center" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// PROCESSUS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, lineHeight: 1.2, paddingBottom: "0.15em", color: C.text }}>
              Opérationnel en <span style={{ color: C.green }}>5 à 15 jours.</span>
            </h2>
          </motion.div>
          <div className="i64-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", position: "relative" }}>
            <div className="i64-process-line" style={{ position: "absolute", top: "28px", left: "10%", right: "10%", height: "1px", background: C.greenBorder, zIndex: 0 }} />
            {[
              { step: "01", title: "Audit SI", desc: "Cartographie de votre infrastructure, inventaire des assets et identification des risques critiques." },
              { step: "02", title: "Gap Analysis", desc: "Analyse d'écart vis-à-vis de ISO 27001, NIS2 et des best practices CIS Benchmarks." },
              { step: "03", title: "Déploiement", desc: "Installation des agents SIEM/EDR sans interruption. Formation de vos équipes internes." },
              { step: "04", title: "Calibration", desc: "Tuning des règles de détection pour réduire les faux positifs. Paramétrage des alertes." },
              { step: "05", title: "Go Live", desc: "SOC opérationnel 24/7. Votre tableau de bord disponible immédiatement. Premier rapport sous 7 jours." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: C.bg, border: `2px solid ${C.green}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: `0 0 20px rgba(0,230,118,0.15)`,
                }}>
                  <span style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.green }}>{s.step}</span>
                </div>
                <h4 style={{ fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", letterSpacing: "0.05em" }}>{s.title.toUpperCase()}</h4>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.65 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE THREAT SECTION ───────────────────────────────────────── */}
      <section ref={terminalRef} style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div className="imx-mobstack" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={terminalInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>// SIGNATURE ELEMENT — SOC LIVE</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, lineHeight: 1.2, paddingBottom: "0.15em", color: C.text, marginBottom: "1.5rem" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              Chaque menace, en<br /><span style={{ color: C.green }}>temps réel.</span>
            </>}</h2>
            <p style={{ fontFamily: sans, fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2.5rem" }}>{c?.aboutText ?? <>
              Notre SOC surveille en permanence 50 000+ événements par seconde. Ce flux en direct représente le type d'activité que nous traitons pour nos clients.
            </>}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: Shield, text: "Corrélation MITRE ATT&CK en temps réel" },
                { icon: Zap, text: "Temps de réponse moyen < 8 minutes" },
                { icon: Activity, text: "50 000+ événements analysés par seconde" },
                { icon: Lock, text: "Données hébergées en France — Tier IV" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={terminalInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                  >
                    <Icon size={16} color={C.green} />
                    <span style={{ fontFamily: sans, fontSize: "0.875rem", color: C.textMuted }}>{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={terminalInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {terminalInView && <LiveTerminal />}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// CLIENTS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, lineHeight: 1.2, paddingBottom: "0.15em", color: C.text }}>Ils nous font confiance.</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1px", background: C.greenBorder }}>
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.bgCard, padding: "2.5rem" }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.green, fontSize: "0.8rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.875rem", color: C.text, lineHeight: 1.75, marginBottom: "2rem", opacity: 0.85 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.06em" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.greenBorder, marginTop: "1px" }}>
            {TESTIMONIALS.slice(3).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.bgCard, padding: "2.5rem" }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.green, fontSize: "0.8rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.875rem", color: C.text, lineHeight: 1.75, marginBottom: "2rem", opacity: 0.85 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.06em" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bg, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(0,230,118,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative" }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>// COMMENCER</span>
          <h2 style={{ fontFamily: mono, fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 700, lineHeight: 1.2, paddingBottom: "0.15em", color: C.text, marginBottom: "1.5rem" }}>
            Audit de sécurité<br /><span style={{ color: C.green }}>offert.</span> Sans engagement.
          </h2>
          <p style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, maxWidth: "560px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
            2 heures avec nos experts. Rapport complet offert. Vous repartez avec une vision claire de votre exposition aux risques.
          </p>
          <Link href="/templates/impact-64/contact" style={{
            fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em",
            background: C.green, color: C.bg, padding: "1rem 2.5rem",
            borderRadius: "4px", textDecoration: "none",
            boxShadow: `0 0 40px rgba(0,230,118,0.25)`,
            transition: "box-shadow 0.2s, transform 0.15s",
            display: "inline-block",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 60px rgba(0,230,118,0.45)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 40px rgba(0,230,118,0.25)`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            DEMANDER MON AUDIT GRATUIT
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
