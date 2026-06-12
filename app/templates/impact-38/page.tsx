"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  C,
  STATS,
  PROCESS_STEPS,
  ORIGINS,
  REVIEWS,
  FAQS,
  CoffeeBeanSVG,
  OriginMap,
  FAQItem,
  SectionReveal,
} from "./shared";

export default function OriginRoastPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div style={{ background: C.bg, color: C.text }}>
      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", background: C.espresso, overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, scale: heroScale, backgroundImage: `radial-gradient(${C.caramel}10 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: `radial-gradient(circle, ${C.caramel}20 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "15%", width: 400, height: 400, background: `radial-gradient(circle, ${C.caramel}15 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 5%", width: "100%", opacity: heroOpacity }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "center" }} className="grid md:grid-cols-1">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.caramel, marginBottom: 20 }}>
                Specialty Coffee Roastery
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(44px, 5.5vw, 76px)", fontWeight: 900, color: C.cream, lineHeight: 1.05, marginBottom: 24 }}>
                From Farm
                <br />
                <span style={{ color: C.caramel }}>to Cup.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                style={{ fontFamily: "'DM Sans', system-ui", fontSize: 18, color: C.sand, lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 300 }}>
                Small-batch specialty coffee sourced directly from 47 farm partners across 18 countries. Roasted to order and shipped at peak freshness.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
                  <button type="button"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.espresso, padding: "16px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                    S'abonner <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/templates/impact-38/origins" style={{ textDecoration: "none" }}>
                  <button type="button"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.cream, padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 16, border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                    Explorer les origines
                  </button>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 40, marginTop: 52 }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.caramel }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: C.sand, marginTop: 4, fontWeight: 300 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="hidden md:block">
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
                <CoffeeBeanSVG />
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: C.caramel }}>
                    Roasted Today
                  </div>
                  <div style={{ marginTop: 6, fontFamily: "'DM Sans', system-ui", fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>
                    Ethiopian Yirgacheffe — Lot 2024-112
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Notre Processus
              </div>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Six étapes, de l'origine à vous
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Aucun raccourci. Chaque étape est délibérée. Chaque décision documentée et traçable.
              </p>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }} className="grid md:grid-cols-1">
            {PROCESS_STEPS.map((step, i) => (
              <SectionReveal key={step.title} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, transition: "box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(26,10,0,0.10)"; el.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.icon size={22} color={C.caramel} />
                    </div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, letterSpacing: "0.1em" }}>
                      {step.step}
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGINS PREVIEW */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Notre catalogue actuel
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Tous nos lots sont disponibles jusqu'à épuisement. Nouveaux arrivages toutes les 4–6 semaines.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div style={{ marginBottom: 60 }}>
              <OriginMap />
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="grid md:grid-cols-1">
            {ORIGINS.map((coffee, i) => (
              <SectionReveal key={coffee.name} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "inline-block", background: C.caramelLight, color: C.caramel, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 10, letterSpacing: "0.04em" }}>
                        {coffee.region} — {coffee.origin}
                      </div>
                      <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.espresso }}>{coffee.name}</h3>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.caramel }}>{coffee.price}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>EUR / 250g</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>{coffee.description}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[{ label: "Traitement", val: coffee.process }, { label: "Altitude", val: coffee.altitude }, { label: "Torréfaction", val: coffee.roast }].map((d) => (
                      <div key={d.label} style={{ background: C.bgAlt, borderRadius: 6, padding: "6px 12px" }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                        <div style={{ fontSize: 13, color: C.espresso, fontWeight: 600 }}>{d.val}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Notes de dégustation</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {coffee.flavor.map((f) => (
                        <span key={f} style={{ background: `${C.caramel}15`, color: C.caramel, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none", alignSelf: "flex-start" }}>
                    <button type="button"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.caramelLight, color: C.caramel, padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                      Ajouter à l'abonnement <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
          <SectionReveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/templates/impact-38/origins" style={{ textDecoration: "none" }}>
                <button type="button"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  Voir toutes les origines <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "100px 5%", background: C.espresso }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: C.cream, marginBottom: 12 }}>
                Ce que disent nos abonnés
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="grid md:grid-cols-1">
            {REVIEWS.map((r, i) => (
              <SectionReveal key={r.name} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 32, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={15} fill={C.caramel} color={C.caramel} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, color: C.sand, lineHeight: 1.8, flex: 1, fontStyle: "italic", fontWeight: 400 }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${C.caramel}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 14, color: C.caramel, flexShrink: 0 }}>
                      {r.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 15, color: C.cream }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>{r.role}</div>
                    </div>
                  </div>
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
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
                Questions fréquentes
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
