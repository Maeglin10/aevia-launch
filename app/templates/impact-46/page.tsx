"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Check, Star, ChevronDown, ChevronRight
} from "lucide-react";
import {
  C,
  practiceAreas,
  attorneys,
  caseResults,
  testimonials,
  consultationTiers,
  faqs,
  ScaleSVG
} from "./shared";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100dvh", background: C.navy, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 50%, rgba(184,149,42,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(184,149,42,0.04) 0%, transparent 40%)`, pointerEvents: "none" }} />

      {/* Top gold line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "100px 32px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid md:grid-cols-1 imx-mobstack">
        {/* Left: headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 600 }}>Corporate & Business Law — Paris</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 700, color: C.white, lineHeight: 1.1, margin: "0 0 28px" }}
          >
            Exceptional<br />
            <span style={{ color: C.accent }}>Counsel</span> for<br />
            Exceptional<br />Businesses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, marginBottom: 48 }}
          >
            {fd?.businessName ?? "Dumont & Associates"} is a boutique Parisian law firm specialising in corporate law, M&A, IP, and commercial litigation. We partner with founders, boards, and executives who demand the highest standard of legal counsel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16 }}
          >
            <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
              <button
                style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Free Consultation <ArrowRight size={15} /></button>
            </Link>
            <button onClick={() => document.getElementById("practice")?.scrollIntoView({ behavior: "smooth" })}
              style={{ border: `1px solid rgba(255,255,255,0.2)`, background: "transparent", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >Practice Areas</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ display: "flex", gap: 48, marginTop: 64, paddingTop: 40, borderTop: `1px solid rgba(255,255,255,0.08)`, flexWrap: "wrap" }}
          >
            {caseResults.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Scale SVG */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: 280, opacity: 0.85 }}>
            <ScaleSVG scrollProgress={scrollYProgress} />
          </div>
          <div style={{ marginTop: 32, padding: "24px 32px", border: `1px solid ${C.borderGold}`, background: "rgba(184,149,42,0.06)", textAlign: "center" as const }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, color: C.accent, marginBottom: 6 }}>"Excellence. Discretion. Results."</div>
            <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>28 years in business law</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PracticeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="practice" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>What We Do</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: "0 0 16px", fontWeight: 700 }}>Practice Areas</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 520 }}>We advise on the full spectrum of business and corporate law, from day-one formation through complex litigation and international transactions.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 1, background: C.border }}>
          {practiceAreas.map((area, i) => (
            <Link key={area.title} href="/templates/impact-46/services" style={{ textDecoration: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: C.bgCard, padding: 40, height: "100%", position: "relative", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bgGold; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bgCard; }}
              >
                <div style={{ width: 48, height: 48, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.borderGold}` }}>
                  <area.icon size={22} color={C.accent} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.navy, margin: "0 0 12px", fontWeight: 700 }}>{area.title}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{area.desc}</p>
                <div style={{ position: "absolute", bottom: 28, right: 28 }}>
                  <ChevronRight size={16} color={C.accent} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttorneysSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="attorneys" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Our Team</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>The Partners</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>Three partners. Combined track record exceeding €6 billion in advised transactions and 500+ cases.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {attorneys.map((atty, i) => (
            <motion.div
              key={atty.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.18 }}
              style={{ background: C.navyLight, padding: 40, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ width: 72, height: 72, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: C.accent, fontWeight: 700 }}>{atty.name.charAt(0)}</span>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 4px", fontWeight: 700 }}>{atty.name}</h3>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", letterSpacing: "0.06em" }}>{atty.title}</p>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>{atty.focus}</p>

              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 28 }}>{atty.bio}</p>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 20 }}>
                {[
                  { label: "Admitted", val: atty.bar },
                  { label: "Education", val: atty.education },
                  { label: "Languages", val: atty.languages },
                  { label: "Track Record", val: atty.matters },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.accent, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" ref={ref} style={{ background: C.bg, padding: "80px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: C.navy, padding: "64px 80px", display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64, alignItems: "center" }} className="grid md:grid-cols-1 imx-mobstack">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{ width: 3, height: 60, background: C.accent, marginBottom: 24 }} />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, margin: 0, fontWeight: 700 }}>Results That Matter</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 40 }}
          >
            {caseResults.map((s) => (
              <div key={s.label} style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bg, padding: "80px 32px 120px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Client Testimonials</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: C.navy, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{t.name}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textMuted, margin: "0 0 8px" }}>{t.title}</p>
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderGold}`, padding: "3px 8px" }}>{t.matter}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="consultation" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Engage Our Firm</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>Fee Structures</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>Transparent pricing. No hidden fees. Full clarity before we begin.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {consultationTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: tier.featured ? C.accent : C.navyLight, padding: 48, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px" }}>Recommended</div>
              )}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.accent, letterSpacing: "0.14em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 10px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: tier.featured ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 32, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Check size={14} color={tier.featured ? C.white : C.accent} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
                <button
                  style={{ width: "100%", textAlign: "center" as const, background: tier.featured ? C.white : "transparent", color: tier.featured ? C.accent : C.white, border: tier.featured ? "none" : `1px solid rgba(255,255,255,0.2)`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, cursor: "pointer" }}
                >{tier.cta}</button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Frequently Asked</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.navy, margin: 0, fontWeight: 700 }}>Common Questions</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: C.navy, fontWeight: 600 }}>{faq.q}</span>
              <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={18} color={C.accent} />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIdx === i ? "auto" : 0, opacity: openIdx === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, paddingBottom: 26, margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LawFirmHome() {
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
    <div style={{ background: C.bg, minHeight: "100dvh" }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <HeroSection />
      <PracticeSection />
      <AttorneysSection />
      <ResultsSection />
      <TestimonialsSection />
      <ConsultationSection />
      <FAQSection />
    </div>
  );
}
