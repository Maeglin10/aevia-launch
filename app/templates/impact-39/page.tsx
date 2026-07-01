// @ts-nocheck
"use client";

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone, Shield, Zap, Star, Check, CheckCircle, Calendar, MapPin, Truck, Users, Clock } from "lucide-react";
import Link from "next/link";
import {
  C,
  SERVICES_DATA,
  STATS,
  PRICING_CARDS,
  TESTIMONIALS,
  FAQS,
  SectionReveal,
  FAQItem,
  StepTimeline,
  StatCard,
  TruckSVG,
} from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SwiftMovePage() {
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const truckX = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  
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
    <div style={{ background: C.bg, color: C.text }}>
      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: C.navy, overflow: "hidden" }}>
        <motion.div style={{
          position: "absolute", inset: 0, y: heroY,
          backgroundImage: `linear-gradient(rgba(234,88,12,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div style={{ position: "absolute", top: "0", right: "-5%", width: 600, height: 600, background: `radial-gradient(circle, ${C.orange}18 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        {/* Road */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `${C.navy}cc` }}>
          <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", gap: 60, paddingLeft: 80 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 60, height: 4, background: C.orange, opacity: 0.3, borderRadius: 2 }} />
            ))}
          </div>
        </div>
        <TruckSVG truckX={truckX} />

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "60px 5% 140px", width: "100%", opacity: heroOpacity }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid md:grid-cols-1">
            {/* Left copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 28 }}>
                <Zap size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>N°1 de la confiance — Île-de-France & France entière</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, color: C.white, lineHeight: 1.05, marginBottom: 24 }}>{c?.heroHeadline ?? <>
                Votre déménagement<br />
                <span style={{ color: C.orange }}>serein</span> & bien fait
              </>}</motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                style={{fontSize: 18, color: brand ?? '#93c5fd', lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 400 }}>{c?.heroSubline ?? fd?.tagline ?? <>
                Déménagement local, longue distance, international, garde-meuble. Équipes professionnelles, estimation ferme sous 24 h.
              </>}</motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                  >
                    Devis gratuit <ArrowRight size={18} />
                  </button>
                </Link>
                <a href={`tel:${fd?.phone ?? "+33100000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                  <Phone size={16} /> Appeler
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 32, marginTop: 52 }}>
                {[
                  { val: "4,9★", label: "Avis Google" },
                  { val: "18 K+", label: "Clients satisfaits" },
                  { val: "100 %", label: "Agréé & assuré" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{s.val}</div>
                    <div style={{fontSize: 13, color: brand ?? '#93c5fd', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: quick quote card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden md:block">
              <div style={{ background: C.white, borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.30)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Obtenez votre devis gratuit</h3>
                <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Estimation ferme sous 24 h. Aucun engagement.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Code postal départ", placeholder: "75011" },
                    { label: "Code postal arrivée", placeholder: "69001" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{field.label}</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                        <MapPin size={16} color={C.orange} />
                        <input placeholder={field.placeholder} style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, width: "100%", fontFamily: "'Manrope', system-ui" }} />
                      </div>
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Logement</label>
                    <select style={{ width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", appearance: "none", cursor: "pointer" }}>
                      <option>Studio / T1</option>
                      <option>T2 / T3</option>
                      <option>T4 / T5</option>
                      <option>Maison individuelle</option>
                      <option>Bureaux / local pro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Date souhaitée</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                      <Calendar size={16} color={C.orange} />
                      <input type="date" style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", width: "100%" }} />
                    </div>
                  </div>
                  <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
                    <button
                      type="button"
                      style={{ width: "100%", background: C.orange, color: C.white, padding: "16px 24px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Manrope', system-ui" }}
                    >
                      Obtenir mon devis <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
                  <Shield size={14} color={C.textMuted} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>Aucun démarchage. Estimation ferme uniquement.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES preview */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <Truck size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Nos prestations</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 16 }}>Tous les types de déménagement</h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Du studio au bureau, du local à l'international — une seule équipe pour chaque projet.</p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="grid lg:grid-cols-2 md:grid-cols-1">
            {SERVICES_DATA.slice(0, 4).map((service, i) => (
              <SectionReveal key={service.name} delay={i * 0.1}>
                <Link href="/templates/impact-39/services" style={{ textDecoration: "none" }}>
                  <div
                    style={{ background: C.bg, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(234,88,12,0.12)"; el.style.borderColor = `${C.orange}50`; el.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = C.border; el.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ width: 50, height: 50, background: C.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <service.icon size={24} color={C.orange} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{service.tagline}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{service.name}</h3>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{service.shortDesc}</p>
                    <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, color: C.textMuted }}>À partir de </span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>{service.from}</span>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/templates/impact-39/services" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, color: C.orange, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                >
                  Voir tous nos services <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>Comment ça marche</h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>Quatre étapes simples. Zéro surprise. Vos affaires déplacées avec soin.</p>
            </div>
          </SectionReveal>
          <StepTimeline />
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }} className="grid sm:grid-cols-2">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.1} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <Users size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Avis clients</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>18 400+ déménagements réussis</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="grid md:grid-cols-1">
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div style={{ background: C.bgAlt, borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill={C.orange} color={C.orange} />)}
                  </div>
                  <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: C.orange, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>Tarifs transparents</h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Estimation ferme uniquement. Ce que nous annonçons, vous payez. Pas de surprise.</p>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }} className="grid md:grid-cols-1">
            {PRICING_CARDS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.12}>
                <div style={{ background: plan.highlight ? C.navy : C.white, borderRadius: 16, padding: 32, border: plan.highlight ? `2px solid ${C.orange}` : `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: -1, right: 20, background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                      Le plus demandé
                    </div>
                  )}
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: plan.highlight ? C.white : C.navy, marginBottom: 4 }}>{plan.name}</h3>
                  <div style={{ fontSize: 12, color: plan.highlight ? "#93c5fd" : C.textMuted, marginBottom: 20 }}>{plan.period}</div>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 11, color: plan.highlight ? "#93c5fd" : C.textMuted, textTransform: "uppercase", fontWeight: 700 }}>{plan.suffix} </span>
                    <span style={{ fontSize: 36, fontWeight: 900, color: plan.highlight ? C.orange : C.navy }}>{plan.price}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.highlight ? `${C.orange}30` : C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={11} color={C.orange} />
                        </div>
                        <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
                    <button
                      type="button"
                      style={{ width: "100%", background: plan.highlight ? C.orange : C.orangeLight, color: plan.highlight ? C.white : C.orange, padding: "14px 24px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                    >
                      Demander un devis
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
          <SectionReveal delay={0.3}>
            <div style={{ marginTop: 40, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: Shield, label: "Agréé & assuré" },
                { icon: Clock, label: "Ponctualité garantie" },
                { icon: CheckCircle, label: "Estimation ferme" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={16} color={C.orange} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{label}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Questions fréquentes</h2>
              <p style={{ fontSize: 16, color: C.textMuted }}>Une autre question ? Appelez-nous au +33 1 XX XX XX XX — 7j/7.</p>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} delay={i * 0.07} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
