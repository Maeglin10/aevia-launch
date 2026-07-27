"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Check, Star, ChevronDown, ChevronRight
} from "lucide-react";
import {
  C,
  practiceAreas as practiceAreas_DEMO,
  attorneys as attorneys_DEMO,
  caseResults,
  testimonials as testimonials_DEMO,
  consultationTiers,
  faqs as faqs_DEMO,
  ScaleSVG
} from "./shared";
import { resolveList } from "@/lib/templates/resolveList";
import {
  useHeroSelector, HeroStage, Scrim, GhostMark, Rise, SelectorRail,
  heroSectionStyle, railResponsiveCSS, EASE_3, EASE_4, BEAT,
} from "@/lib/templates/hero-kit";

function HeroSection() {
  /* A law firm hero has to stay still. The promise never moves — that is the
     gravitas. What moves is the *evidence*: picking a practice area re-lights
     the stage and states what the firm actually does there. So the visitor
     self-identifies their problem without the page losing its composure. */
  const AREA_MEDIA = [
    { img: "https://images.pexels.com/photos/273682/pexels-photo-273682.jpeg?auto=compress&cs=tinysrgb&w=2000", stat: "€2.4B", statLabel: "d’opérations conseillées" },
    { img: "https://images.pexels.com/photos/9409685/pexels-photo-9409685.jpeg?auto=compress&cs=tinysrgb&w=2000", stat: "140+", statLabel: "opérations menées depuis 2009" },
    { img: "https://images.pexels.com/photos/9409682/pexels-photo-9409682.jpeg?auto=compress&cs=tinysrgb&w=2000", stat: "900+", statLabel: "marques et brevets déposés" },
    { img: "https://images.pexels.com/photos/159720/law-books-library-rows-of-books-159720.jpeg?auto=compress&cs=tinysrgb&w=2000", stat: "87%", statLabel: "réglés avant audience" },
    { img: "https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg?auto=compress&cs=tinysrgb&w=2000", stat: "24h", statLabel: "de délai sur les urgences" },
  ];

  const areas = resolveList(
    bp?.services?.map((s: any, i: number) => ({
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    practiceAreas_DEMO
  ).slice(0, 5);

  const { active, paused, pick, hold, reduce } = useHeroSelector(areas.length, 7000);
  const area = areas[active % areas.length];
  const media = AREA_MEDIA[active % AREA_MEDIA.length];

  const SERIF = "'Playfair Display', Georgia, serif";
  const SANS = "'Source Sans Pro', system-ui, sans-serif";

  return (
    <section ref={undefined} id="hero" style={heroSectionStyle(C.navy, { bottomRail: true })}>
      <HeroStage src={fd?.photoUrls?.[active] || media.img} alt={`${area.title} — ${fd?.businessName ?? "Dumont & Associés"}`} reduce={reduce} />
      <Scrim color={C.navy} direction="left" strength="heavy" />

      {/* Top gold line — kept from the original; it is the firm's signature. */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 5, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)` }} />

      <GhostMark color={C.accent} font={SERIF} side="right" opacity={0.06} size="clamp(150px, 26vw, 380px)">
        {String(active + 1).padStart(2, "0")}
      </GhostMark>

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 620, minWidth: 0 }}>
          <Rise beat="first" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: C.accent, display: "block" }} />
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: C.accent }}>
              Paris · Cabinet d’affaires
            </span>
          </Rise>

          {/* The promise. Deliberately static: it is the one thing that must not
              flicker while the visitor browses. */}
          <motion.h1
            initial={{ opacity: 0, rotateY: reduce ? 0 : -12, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, rotateY: 0, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.9, ease: EASE_4 }}
            style={{ fontFamily: SERIF, fontSize: "clamp(38px, 4.4vw, 62px)", fontWeight: 700, color: C.white, lineHeight: 1.06, margin: "0 0 22px", transformOrigin: "left center" }}
          >{c?.heroHeadline ?? <>
            Le droit,<br />
            <span style={{ color: C.accent }}>à la hauteur</span><br />
            de vos enjeux.
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_3, delay: BEAT.second }}
            className="hero-lede"
            style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,255,255,0.66)", lineHeight: 1.7, maxWidth: 460, margin: "0 0 26px" }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            {fd?.businessName ?? "Dumont & Associés"} conseille dirigeants, fondateurs et conseils d’administration là où l’issue compte vraiment.
          </>}</motion.p>

          {/* The evidence panel — this is what the selector drives. */}
          <div className="hero-detail" style={{ minHeight: 104, marginBottom: 26 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 20 }}>
                <Rise beat="second" duration={0.45}>
                  <div style={{ fontFamily: SERIF, fontSize: 22, color: C.white, marginBottom: 8 }}>{area.title}</div>
                </Rise>
                <Rise beat="second" duration={0.5}>
                  <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.58)", maxWidth: 440, margin: 0 }}>
                    {area.desc}
                  </p>
                </Rise>
              </motion.div>
            </AnimatePresence>
          </div>

          <Rise beat="third" style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: SERIF, fontSize: 30, color: C.accent }}>{media.stat}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                {media.statLabel}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accent, color: C.navy, padding: "15px 30px", fontFamily: SANS, fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", minHeight: 44 }}>
                  Consultation gratuite <ArrowRight size={15} />
                </span>
              </Link>
              <button
                onClick={() => document.getElementById("practice")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "transparent", color: C.accent, border: `1px solid ${C.accent}66`, padding: "15px 30px", fontFamily: SANS, fontWeight: 400, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", minHeight: 44 }}
              >
                Tous nos domaines
              </button>
            </div>
          </Rise>
        </div>
      </div>

      <SelectorRail
        items={areas}
        active={active}
        onPick={pick}
        onHold={hold}
        accent={C.accent}
        fg={C.white}
        serif={SERIF}
        sans={SANS}
        paused={paused}
        reduce={reduce}
        bg={C.navy}
        id="hero"
        label={(a: any) => a.title}
      />

      <style>{railResponsiveCSS("hero", { titleClamp: "clamp(34px, 9.5vw, 46px)" })}</style>
    </section>
  );
}

function PracticeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const practiceAreas = resolveList(
    bp?.services?.map((s: any, i: number) => ({
      icon: practiceAreas_DEMO[i % practiceAreas_DEMO.length].icon,
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    practiceAreas_DEMO
  );

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
  const attorneys = resolveList(
    bp?.team?.map((m: any, i: number) => ({
      name: m.name ?? attorneys_DEMO[i % attorneys_DEMO.length].name,
      title: m.role ?? attorneys_DEMO[i % attorneys_DEMO.length].title,
      focus: m.specialty ?? "",
      bio: m.bio ?? "",
      bar: m.credentials ?? "",
      education: "",
      languages: "",
      matters: "",
    })),
    attorneys_DEMO
  );

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
                ].filter((item) => item.val).map((item) => (
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
  const testimonials = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any, i: number) => ({
      name: r.name ?? testimonials_DEMO[i % testimonials_DEMO.length].name,
      title: r.location ?? testimonials_DEMO[i % testimonials_DEMO.length].title,
      text: r.text ?? r.quote,
      rating: r.stars ?? r.rating ?? 5,
      matter: testimonials_DEMO[i % testimonials_DEMO.length].matter,
    })),
    testimonials_DEMO
  );

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
  const faqs = resolveList(
    bp?.faq?.map((f: any) => ({ q: f.q ?? f.question, a: f.a ?? f.answer })),
    faqs_DEMO
  );

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
let bp: any = null;
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
  brand = fd?.brandColor ?? null; // null = keep template's original color

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
