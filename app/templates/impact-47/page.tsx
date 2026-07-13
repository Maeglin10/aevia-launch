"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Check, Leaf, Sun, Snowflake, Wind, Heart, Gift, Briefcase, Camera, ChevronDown, Star
} from "lucide-react";
import {
  C,
  seasons,
  occasions,
  testimonials,
  subscriptionTiers,
  faqs,
  FallingPetal,
  petalPaths,
  useCart
} from "./shared";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bgPink, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Falling petals */}
      {petalPaths.map((_, i) => (
        <FallingPetal key={i} index={i} />
      ))}

      {/* Soft gradient background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, rgba(244,143,177,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(136,14,79,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%", textAlign: "center" as const }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}
        >
          <Leaf size={14} color={C.sage} />
          <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.sage, fontWeight: 500 }}>Artisan Florist · Paris, France</span>
          <Leaf size={14} color={C.sage} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 700, color: C.accent, lineHeight: 0.95, margin: "0 0 28px" }}
        >
          For Every<br />
          <span style={{ color: C.text }}>Moment.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: "'Poppins', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}
        >
          Hand-crafted seasonal arrangements, botanical bouquet subscriptions, and wedding floral direction from our Parisian studio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}
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
          style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" as const }}
        >
          {[
            { val: "12 ans", label: "d'expérience" },
            { val: "4,000+", label: "arrangements créés" },
            { val: "98%", label: "clients satisfaits" },
            { val: "350+", label: "mariages floraux" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.accent }}>{s.val}</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSeason, setActiveSeason] = useState("spring");
  const active = seasons.find(s => s.id === activeSeason) || seasons[0];

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
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>Nature's Calendar</h2>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {active.arrangements.map((arr, i) => (
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
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Flowers for Every Chapter</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>From the most joyful celebration to the most tender farewell — we're here for every occasion that matters.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
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
                  Learn more <ArrowRight size={13} />
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
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.textMuted, marginTop: 8 }}>18 Rue du Marché, Paris 11e</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.sage }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.sage }}>Our Story</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: C.text, margin: "0 0 24px", fontWeight: 700 }}>Made by Hand,<br />With Intention.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 24 }}>Pétales & Co was born from a simple belief: flowers shouldn't be an afterthought. Founded in 2014 by florist Amélie Rousseau, our studio in the 11th arrondissement has become a gathering place for people who care about natural beauty.</p>
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
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Testimonials</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
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
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Always Fresh. Never Repeated.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Seasonal bouquets, curated by hand, delivered to your door on schedule. Pause or cancel anytime.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
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
              <button onClick={addToCart}
                style={{ display: "block", width: "100%", border: "none", cursor: "pointer", textAlign: "center" as const, background: tier.featured ? C.white : C.accent, color: tier.featured ? C.accent : C.white, padding: "14px 24px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700 }}
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
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.text, margin: 0, fontWeight: 700 }}>Questions & Answers</h2>
        </motion.div>

        {faqs.map((faq, i) => (
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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
    <div style={{ background: C.bg, minHeight: "100vh" }}>
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
    </div>
  );
}
