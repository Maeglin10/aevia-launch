"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import React, {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { C, TextReveal, MagneticButton, MarqueeStrip, DepthLayers, CountUp, PRESS, SERIES, SeriesCard } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LeaHomePage() {
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

  const [activePress, setActivePress] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  
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
    <div style={{ background: C.bg, color: C.cream, minHeight: "80vh" }}>
      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Parallax bg */}
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(74,103,65,0.12) 0%, transparent 70%)" }} />
          {/* Floating particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: `${8 + (i * 53) % 85}%`,
                top: `${10 + (i * 37) % 75}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                borderRadius: "50%",
                background: i % 4 === 0 ? C.amber : C.moss,
                opacity: 0.25 + (i % 4) * 0.1,
              }}
              animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, padding: "0 24px" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.4em", color: C.moss, textTransform: "uppercase", marginBottom: 32 }}
          >
            Nature Photography · Fine Art Prints
          </motion.p>

          <h1 style={{ fontSize: "clamp(52px, 9vw, 120px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 40, color: C.cream, paddingBottom: "0.15em" }}>{c?.heroHeadline ?? <>
            <TextReveal text="Finding" delay={0.3} style={{ display: "block" }} />
            <TextReveal text="depth" delay={0.5} style={{ display: "block", color: C.amber }} />
            <TextReveal text="in stillness." delay={0.7} style={{ display: "block", color: C.moss }} />
          </>}</h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 48px", fontWeight: 300 }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Documentary and fine art landscapes from the world's most remote wilderness areas. Limited edition prints, each signed and numbered.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}
          >
            <Link href="/templates/impact-69/work" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                View Series
              </MagneticButton>
            </Link>
            <Link href="/templates/impact-69/prints" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.cream, background: "transparent", padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.border}`, fontWeight: 400 }}>
                Shop Prints
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Depth Layers — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 64 }} className="grid-hero-68">
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Depth Perception</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: C.cream }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              <TextReveal text="Three planes," />
              <TextReveal text="one frame." delay={0.15} />
            </>}</h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>{c?.aboutText ?? <>
              Every composition is built in layers — the intimate foreground, the story-telling midground, and the expansive background. Move your cursor across the scene to experience how depth creates presence.
            </>}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Years active", val: 12, suffix: "" },
              { label: "Countries", val: 34, suffix: "+" },
              { label: "Limited prints", val: 280, suffix: "" },
              { label: "Exhibitions", val: 24, suffix: "" },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "24px", background: C.bgCard, borderRadius: 4, border: `1px solid ${C.border}`, textAlign: "left" }}>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 36, fontWeight: 900, color: C.amber, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <CountUp target={stat.val} suffix={stat.suffix} />
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 8, letterSpacing: "0.05em" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <DepthLayers />
      </section>

      {/* ── Series Grid ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 12 }}>Photography Series</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.cream, marginBottom: 0 }}>Selected Work</h2>
          </div>
          <Link href="/templates/impact-69/work" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", textDecoration: "none", borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}>
            All Series →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {SERIES.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      </section>

      {/* ── Prints Shop ── */}
      <section style={{ padding: "80px 32px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgCard }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.amber, textTransform: "uppercase", marginBottom: 20 }}>Limited Edition Prints</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.cream, marginBottom: 24 }}>Bring the wilderness home.</h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: 32, maxWidth: 420 }}>
              Each print is produced on 300gsm Hahnemühle Fine Art Baryta, signed and numbered by Léa. Editions range from 6 to 20 — once they're gone, they're gone.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {[
                ["Hahnemühle Fine Art Baryta 300gsm", "Paper"],
                ["Signed & numbered by hand", "Authenticity"],
                ["Editions of 6–20 per image", "Scarcity"],
                ["Ships in archival tube within 10 days", "Shipping"],
              ].map(([detail, label]) => (
                <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.cream }}>{detail}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.muted, marginLeft: 8 }}>— {label}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/templates/impact-69/prints" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                Shop Prints
              </MagneticButton>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { bg: SERIES[0].bg, accent: SERIES[0].accent, title: SERIES[0].title, price: "CHF 480", prints: `Ed. ${SERIES[0].prints}` },
              { bg: SERIES[2].bg, accent: SERIES[2].accent, title: SERIES[2].title, price: "CHF 360", prints: `Ed. ${SERIES[2].prints}` },
              { bg: SERIES[4].bg, accent: SERIES[4].accent, title: SERIES[4].title, price: "CHF 420", prints: `Ed. ${SERIES[4].prints}` },
              { bg: SERIES[1].bg, accent: SERIES[1].accent, title: SERIES[1].title, price: "CHF 520", prints: `Ed. ${SERIES[1].prints}` },
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ background: p.bg, borderRadius: 4, padding: "28px 20px", border: `1px solid rgba(138,158,111,0.1)`, cursor: "pointer", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top, rgba(200,148,58,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{p.prints}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.cream, fontWeight: 600, marginBottom: 16, lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 16, fontWeight: 900, color: p.accent }}>{p.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 32px", borderTop: `1px solid ${C.border}`, background: C.bgMid }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Collectors</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: C.cream, marginBottom: 56 }}>What they say.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: C.border }}>
            {[
              { quote: "I've collected fine art photography for 15 years. Lea's work is the first I've bought solely based on an emotional reaction — not investment. That's rare.", name: "D. Laurent", origin: "Paris · Collector" },
              { quote: "The Boreal Silence series hangs in my studio. Every morning it changes the way I think about light. That's worth more than the print.", name: "M. Björn", origin: "Stockholm · Architect" },
              { quote: "I discovered Lea through an editorial, bought the last print in the Mountain series. Three years later, I still can't imagine the room without it.", name: "R. Whitmore", origin: "London · Film Director" },
            ].map((t, i) => (
              <div key={i} style={{ background: C.bgMid, padding: "40px 32px" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: `${C.cream}70`, lineHeight: 1.8, fontStyle: "italic", marginBottom: 28 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 700, color: C.cream }}>{t.name}</div>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, color: C.moss, marginTop: 4 }}>{t.origin}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding: "80px 32px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Behind each print</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: C.cream, marginBottom: 56 }}>The process.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: C.border }}>
            {[
              { step: "01", title: "The Expedition", desc: "Each series begins with weeks in the field. I travel alone, no schedule, no shot list — only the landscape and the right light." },
              { step: "02", title: "The Edit", desc: "From thousands of frames, I select at most 12 per series. The ones that survive are the ones I can't explain — only feel." },
              { step: "03", title: "The Print", desc: "Fine-art pigment on Hahnemühle paper, 12-colour process, signed and numbered. Each print is made to last 200 years." },
              { step: "04", title: "The Archive", desc: "Once a series sells out, it is closed forever. No reprints. The scarcity is not a marketing decision — it's a commitment to the work." },
            ].map((p) => (
              <div key={p.step} style={{ background: C.bg, padding: "40px 32px" }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: C.amber, letterSpacing: "0.2em", marginBottom: 16 }}>{p.step}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: C.cream, marginBottom: 12 }}>{p.title}</div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 32px", textAlign: "center", background: C.bg }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 24 }}>Commission a Print</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.cream, marginBottom: 20 }}>Looking for something specific?</h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.7, fontWeight: 300, marginBottom: 40 }}>
            Commission a custom print from any series, in any size. I also license images for editorial and commercial use.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link href="/templates/impact-69/prints" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.amber, padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                Get in Touch
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Press ── */}
      <section style={{ padding: "80px 0", maxWidth: 900, margin: "0 auto", paddingInline: 32 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 48, textAlign: "center" }}>Press</p>

        <div style={{ position: "relative", minHeight: 200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: "center" }}
            >
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 300, lineHeight: 1.5, color: C.cream, marginBottom: 32, fontStyle: "italic" }}>
                "{PRESS[activePress].quote}"
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.amber, letterSpacing: "0.05em" }}>{PRESS[activePress].author}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{PRESS[activePress].source}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot nav */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {PRESS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePress(i)}
              style={{ width: i === activePress ? 24 : 8, height: 8, borderRadius: 4, background: i === activePress ? C.moss : C.bgMid, border: `1px solid ${i === activePress ? C.moss : C.border}`, cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
