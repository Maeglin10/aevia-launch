"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { C, stats, testimonials, NeedleAnimation, artists, portfolioItems } from "./shared";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100dvh", background: C.bg, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <NeedleAnimation />

      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>Paris — Studio de Tatouage Premium</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 700, color: C.white, lineHeight: 0.95, margin: "0 0 32px", letterSpacing: "-0.02em" }}
          >
            INK<br />
            <span style={{ color: C.accent }}>WORTH</span><br />
            WEARING
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Barlow', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}
          >
            Noir Ink is Paris's premier fine line and blackwork studio. Two artists. Twelve years. Thousands of pieces built to outlast a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "16px 36px",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Barlow', system-ui",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >
                Book Consultation <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/templates/impact-45/portfolio" style={{ textDecoration: "none" }}>
              <button
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  background: "transparent",
                  padding: "16px 36px",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Barlow', system-ui",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                View Portfolio
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ display: "flex", gap: 40, marginTop: 72, paddingTop: 40, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: C.white }}>{s.value}</div>
                <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
        <ChevronDown size={14} color={C.accent} />
      </motion.div>
    </section>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function TattooStudioHome() {
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
    <main style={{ background: C.bg, minHeight: "100dvh" }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <HeroSection />

      {/* Artists Section */}
      <section style={{ background: C.bgAlt, padding: "120px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: C.accent }} />
              <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>The Artists</span>
              <div style={{ width: 32, height: 1, background: C.accent }} />
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>Two Masters. One Studio.</h2>
            <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
              Paris's finest fine-line and blackwork artists, each with a decade-plus of mastery.
            </p>
          </div>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {artists.map((artist, i) => (
              <motion.div
                key={artist.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, overflow: "hidden" }}
              >
                <div style={{ aspectRatio: "3/2", overflow: "hidden", background: "#1a1a1a", position: "relative" }}>
                  <img
                    src={i === 0
                      ? "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80"
                      : "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80"
                    }
                    alt={artist.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.7)", transition: "filter 0.6s" }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = "grayscale(0.3) brightness(0.9)"; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = "grayscale(1) brightness(0.7)"; }}
                  />
                  <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.7)", border: `1px solid ${C.borderAccent}`, padding: "4px 12px" }}>
                    <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{artist.experience}</span>
                  </div>
                </div>
                <div style={{ padding: 40 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: C.white, fontWeight: 700, marginBottom: 4 }}>{artist.name}</h3>
                      <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>{artist.role}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, fontWeight: 600 }}>From {artist.startingAt}</div>
                      <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.textMuted, marginTop: 2 }}>Starting rate</div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.75, marginBottom: 24 }}>{artist.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                    {artist.styles.map(style => (
                      <span key={style} style={{ fontFamily: "'Barlow', system-ui", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.borderAccent}`, color: C.accent, padding: "4px 10px" }}>{style}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textMuted }}>Wait: {artist.bookingLead}</span>
                    <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
                      <button
                        style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, padding: "10px 24px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 600, cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
                      >
                        Book {artist.name.split(" ")[0]} →
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section style={{ background: C.bg, padding: "120px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 32, height: 1, background: C.accent }} />
                <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Portfolio Gallery</span>
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(32px, 4vw, 52px)", color: C.white, margin: 0, fontWeight: 700 }}>Selected Works</h2>
            </div>
            <Link href="/templates/impact-45/portfolio" style={{ textDecoration: "none", fontFamily: "'Barlow', system-ui", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: 4 }}>
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
                style={{ position: "relative", aspectRatio: item.size === "tall" ? "2/3" : item.size === "wide" ? "4/3" : "1/1", overflow: "hidden", background: C.bgCard, cursor: "pointer" }}
              >
                <img
                  src={[
                    "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80",
                    "https://images.unsplash.com/photo-1550537687-c91072c4792d?w=600&q=80",
                    "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=600&q=80",
                    "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=600&q=80",
                    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
                    "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&q=80",
                  ][i]}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.6)", transition: "all 0.5s" }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = "grayscale(0) brightness(0.9)"; (e.target as HTMLImageElement).style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = "grayscale(1) brightness(0.6)"; (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem 1rem", background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 2 }}>{item.title}</p>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.style} · {item.artist.split(" ")[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: C.bgAlt, padding: "120px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64, textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(32px, 4vw, 52px)", color: C.white, margin: 0, fontWeight: 700 }}>Client Testimonials</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="two-col imx-mobstack">
            {testimonials.slice(0, 2).map((t) => (
              <div key={t.name} style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.text, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${C.borderAccent}`, padding: "3px 8px" }}>{t.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section style={{ background: C.bg, padding: "120px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 24px", fontWeight: 700 }}>Start Your Project</h2>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.75, marginBottom: 40 }}>
            Ready to secure your spot with Mara or Théo? Request your consultation session today.
          </p>
          <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
            <button style={{ background: C.accent, color: C.white, border: "none", padding: "18px 48px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 700, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >
              Request Appointment
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
