"use client";
let sessionData: any = null;
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Check, Leaf, Sun, Snowflake, Wind, Heart, Gift, Briefcase, Camera, ChevronDown, Star
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { DWELL, useSlides, HeldSwap, BlurThrough, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";

/* HeldSwap on the bouquet: exit, half a beat of held emptiness, entry — the
   wine-lab swap, in a round medallion instead of an arch. Images and names
   come from the shop's own collections (verified at the merge). */
function HERO_BOUQUETS_DEMO_SOURCE_LIVE() {
  return [
  { name: "Jardin de Printemps", price: "€65", img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1523693916903-027d144a2b7d?w=900&h=900&fit=crop&q=80") },
  { name: "Blossom Drift", price: "€85", img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&h=900&fit=crop&q=80") },
  { name: "Dried Luxe", price: "€90", img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1583228858294-6745cb25969e?w=900&h=900&fit=crop&q=80") },
];
}
let HERO_BOUQUETS_DEMO_SOURCE = HERO_BOUQUETS_DEMO_SOURCE_LIVE();
let HERO_BOUQUETS_DEMO = HERO_BOUQUETS_DEMO_SOURCE;
let HERO_BOUQUETS = HERO_BOUQUETS_DEMO;
import {
  C,
  FallingPetal,
  faqs,
  occasions,
  petalPaths,
  rafraichirPartage,
  seasons,
  subscriptionTiers,
  testimonials,
  useCart,
} from "./shared";
import {
  clientAddress,
  clientCity,
  clientFaq,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { val: "12 ans", label: "d'expérience" },
            { val: "4,000+", label: "arrangements créés" },
            { val: "98%", label: "clients satisfaits" },
            { val: "350+", label: "mariages floraux" }
];
let STATS_INLINE = STATS_INLINE_SOURCE;

let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let brand: any = null;

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_BOUQUETS.length, DWELL.normal);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100dvh", background: C.bgPink, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Falling petals */}
      {petalPaths.map((_, i) => (
        <FallingPetal key={i} index={i} />
      ))}

      {/* Soft gradient background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, rgba(244,143,177,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(136,14,79,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <motion.div className="i47-hero-grid" style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: "clamp(2rem,5vw,4rem)", alignItems: "center", textAlign: "left" as const }}>
        <div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 700, color: C.accent, lineHeight: 0.95, margin: "0 0 28px" }}
        >{/* ACCROCHE */ clientHeroLine(sessionData, 0, 1, 9) ?? (<>
          For Every<br />
          <span style={{ color: C.text }}>Moment.</span>
        </>)}</motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: "'Poppins', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 0 48px" }}
        >{clientHeroSubtitle(sessionData) ?? "Hand-crafted seasonal arrangements, botanical bouquet subscriptions, and wedding floral direction from our Parisian studio."}</motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: "flex", gap: 16, justifyContent: "flex-start", flexWrap: "wrap" as const }}
        >
          <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: C.accent, color: C.white, border: "none", cursor: "pointer", padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Shop Subscriptions <ArrowRight size={15} /></button>
          <button onClick={() => document.getElementById("occasions")?.scrollIntoView({ behavior: "smooth" })}
            style={{ border: `1.5px solid ${C.borderAccent}`, color: C.accent, padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 600, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.color = C.accent; }}
          >Browse Occasions</button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: 40, justifyContent: "flex-start", marginTop: 64, flexWrap: "wrap" as const }}
        >
          {STATS_INLINE.map((s) => (
            <div key={s.label} style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.accent }}>{s.val}</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
        </div>

        {/* the bouquet medallion, held and swapped */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
        >
          <div
            style={{
              width: "clamp(240px, 30vw, 420px)",
              height: "clamp(240px, 30vw, 420px)",
              borderRadius: "50%",
              overflow: "hidden",
              border: `1.5px solid ${C.borderAccent}`,
              boxShadow: "0 30px 70px rgba(136,14,79,0.18)",
              background: C.white,
            }}
          >
            <HeldSwap index={heroI} tilt={10}>
              <div
                style={{
                  width: "clamp(240px, 30vw, 420px)",
                  height: "clamp(240px, 30vw, 420px)",
                  backgroundImage: `url(${HERO_BOUQUETS[heroI].img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                role="img"
                aria-label={HERO_BOUQUETS[heroI].name}
              />
            </HeldSwap>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <SlideIndex i={heroI} total={HERO_BOUQUETS.length} variant="fraction" className="" color={C.textMuted} />
            <BlurThrough index={heroI} amount={8}>
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, color: C.text }}>
                {HERO_BOUQUETS[heroI].name} <span style={{ color: C.accent }}>{HERO_BOUQUETS[heroI].price}</span>
              </span>
            </BlurThrough>
            <HairlineArrows onPrev={heroPrev} onNext={heroNext} color={C.accent} labels={{ prev: "Previous bouquet", next: "Next bouquet" }} />
          </div>
        </motion.div>
      </motion.div>

      {/* single column under lg; the medallion follows the copy */}
      <style>{`@media (max-width: 1023px) { .i47-hero-grid { grid-template-columns: minmax(0,1fr) !important; } }`}</style>
    </section>
  );
}

function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSeason, setActiveSeason] = useState("spring");
  const active = seasons.find(s => s.id === activeSeason) || seasons[0];
  const arrangements = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      name: s.title ?? s.name ?? active.arrangements[i % active.arrangements.length].name,
      price: s.price ?? active.arrangements[i % active.arrangements.length].price,
      desc: s.description ?? s.desc ?? active.arrangements[i % active.arrangements.length].desc,
      image: active.arrangements[i % active.arrangements.length].image,
    })),
    active.arrangements
  );

  return (
    <section id="collections" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Seasonal Collections</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "collections.titre") ?? (<>Nature's Calendar</>)}</h2>
        </motion.div>

        {/* Season tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 48, flexWrap: "wrap" }}>
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: activeSeason === s.id ? C.accent : "transparent", color: activeSeason === s.id ? C.white : C.textMuted, border: activeSeason === s.id ? "none" : `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Poppins', system-ui", fontSize: 13, fontWeight: activeSeason === s.id ? 600 : 400, letterSpacing: "0.04em", transition: "all 0.2s" }}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, marginBottom: 40, maxWidth: 560 }}>{active.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
              {arrangements.map((arr: any, i: number) => (
                <Link key={arr.name} href="/templates/impact-47/boutique" style={{ textDecoration: "none" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "0 0 32px", overflow: "hidden", cursor: "pointer", height: "100%" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.transition = "all 0.2s"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    {arr.image ? (
                      <img
                        src={arr.image}
                        alt={arr.name}
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block", marginBottom: 24 }}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ height: 200, background: `linear-gradient(135deg, ${C.blush}, rgba(244,143,177,0.4))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                        <Camera size={36} color={C.borderAccent} />
                      </div>
                    )}
                    <div style={{ padding: "0 24px" }}>
                      <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: C.text, margin: "0 0 8px", fontWeight: 700 }}>{arr.name}</h3>
                      <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 16px" }}>{arr.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.accent, fontWeight: 700 }}>{arr.price}</span>
                        <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>Order <ArrowRight size={13} /></span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function OccasionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="occasions" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Occasions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "occasions.titre") ?? (<>Flowers for Every Chapter</>)}</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>From the most joyful celebration to the most tender farewell — we're here for every occasion that matters.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, display: "flex", gap: 24, alignItems: "flex-start", border: `1px solid ${C.border}` }}
            >
              <div style={{ width: 56, height: 56, background: `rgba(136,14,79,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%" }}>
                <occ.icon size={24} color={C.accent} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.text, margin: "0 0 10px", fontWeight: 700 }}>{occ.title}</h3>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: "0 0 20px" }}>{occ.desc}</p>
                <Link href="/templates/impact-47/about" style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  {tr(sessionData, "Learn more")} <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="workshop" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid md:grid-cols-1 imx-mobstack">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ background: `linear-gradient(135deg, ${C.sageLight}, ${C.roseLight})`, height: 480, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.borderSage}` }}
        >
          <div style={{ textAlign: "center" as const, padding: 40 }}>
            <Leaf size={48} color={C.sage} style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.sage, fontStyle: "italic" }}>Our Parisian Studio</p>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.textMuted, marginTop: 8 }}>{clientAddress(sessionData) ?? "18 Rue du Marché, Paris 11e"}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.sage }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.sage }}>{tr(sessionData, "Our Story")}</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: C.text, margin: "0 0 24px", fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "workshop.titre") ?? (<>Made by Hand,<br />With Intention.</>)}</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 24 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Pétales & Co")} was born from a simple belief: flowers shouldn't be an afterthought. Founded in 2014 by florist Amélie Rousseau, our studio in the 11th arrondissement has become a gathering place for people who care about natural beauty.</p>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 40 }}>We work with small French growers wherever possible, choose seasonal flowers over imported blooms, and make every arrangement by hand — from a single stem to a wedding arch.</p>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            {[
              { val: "€65", label: "Workshop from" },
              { val: "2h", label: "Session length" },
              { val: "12", label: "Max per group" },
              { val: "Weekly", label: "Public sessions" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "20px 24px", background: C.bgPink, border: `1px solid ${C.borderAccent}` }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 24, color: C.accent, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/templates/impact-47/contact"
            style={{ background: C.sage, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.sageMid)}
            onMouseLeave={e => (e.currentTarget.style.background = C.sage)}
          >Book a Workshop <ArrowRight size={15} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reviewList = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      name: r.name ?? testimonials[i % testimonials.length].name,
      location: r.location ?? testimonials[i % testimonials.length].location,
      rating: r.stars ?? testimonials[i % testimonials.length].rating,
      text: r.text ?? testimonials[i % testimonials.length].text,
      occasion: testimonials[i % testimonials.length].occasion,
    })),
    testimonials
  );

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bgPink, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>{tr(sessionData, "Testimonials")}</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "testimonials.titre") ?? (<>What Our Clients Say</>)}</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 20 }}>
          {reviewList.map((t: any, i: number) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: C.text, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.text, margin: "0 0 2px", fontWeight: 600 }}>{t.name}</p>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textDim, margin: 0 }}>{t.location}</p>
                </div>
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderAccent}`, padding: "3px 8px" }}>{t.occasion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscribeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { addToCart } = useCart();

  return (
    <section id="subscribe" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Bouquet Subscriptions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "subscribe.titre") ?? (<>Always Fresh. Never Repeated.</>)}</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Seasonal bouquets, curated by hand, delivered to your door on schedule. Pause or cancel anytime.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 20 }}>
          {subscriptionTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: tier.featured ? C.accent : C.bgCard, padding: 40, border: tier.featured ? "none" : `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Poppins', system-ui", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px" }}>Best Value</div>
              )}
              <div style={{ marginBottom: 24, color: tier.featured ? C.white : C.text }}>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: tier.featured ? C.white : C.text, margin: "0 0 8px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 36, color: tier.featured ? C.white : C.accent, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.85)" : C.textMuted, lineHeight: 1.65, marginBottom: 28, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check size={14} color={tier.featured ? C.white : C.sage} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: tier.featured ? "rgba(255,255,255,0.9)" : C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => addToCart({ id: `sub-${tier.name}`, name: `Abonnement ${tier.name}`, price: parseFloat(tier.price.replace(/[^0-9.]/g, "")) || 0 })}
                style={{ display: "block", width: "100%", minHeight: 44, border: "none", cursor: "pointer", textAlign: "center" as const, background: tier.featured ? C.white : C.accent, color: tier.featured ? C.accent : C.white, padding: "14px 24px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700 }}
              >{tier.cta}</button>
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
  const faqList = resolveList(
    clientFaq(sessionData)?.map((f: any, i: number) => ({
      q: f.q ?? faqs[i % faqs.length].q,
      a: f.a ?? faqs[i % faqs.length].a,
    })),
    faqs
  );

  return (
    <section id="faq" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.text, margin: 0, fontWeight: 700 }}>{/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>Questions & Answers</>)}</h2>
        </motion.div>

        {faqList.map((faq: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.borderAccent}`, background: openIdx === i ? "rgba(255,255,255,0.6)" : "transparent" }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, color: C.text, fontWeight: 600 }}>{faq.q}</span>
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
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, padding: "0 24px 24px", margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


export default function FloristHome() {
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;

  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;
  HERO_BOUQUETS_DEMO_SOURCE = HERO_BOUQUETS_DEMO_SOURCE_LIVE();
  memoriserSession(sessionData);
  rafraichirPartage();

  STATS_INLINE = resolveList(

    clientStats(sessionData)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      val: s.value,

      label: s.label,

    })),

    STATS_INLINE_SOURCE,

  );
  HERO_BOUQUETS_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...HERO_BOUQUETS_DEMO_SOURCE[i % HERO_BOUQUETS_DEMO_SOURCE.length], name: s.title, price: s.price ?? HERO_BOUQUETS_DEMO_SOURCE[i % HERO_BOUQUETS_DEMO_SOURCE.length].price })),
    HERO_BOUQUETS_DEMO_SOURCE,
  );
  HERO_BOUQUETS = HERO_BOUQUETS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
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
      <CollectionsSection />
      <OccasionsSection />
      <WorkshopSection />
      <TestimonialsSection />
      <SubscribeSection />
      <FAQSection />
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "Florist Home"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
