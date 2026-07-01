// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  C,
  EXPERIENCES,
  CIRCUIT_STEPS,
  PACKAGES,
  TEAM,
  TESTIMONIALS,
  MARQUEE_ITEMS,
  TextReveal,
  MagneticButton,
  MarqueeStrip,
  ExperienceCard,
  CircuitStep,
  PackageCard,
  TherapistCard,
  TestimonialCard,
} from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SereneRetreatHome() {
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

  const [selectedPackage, setSelectedPackage] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    
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
return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} style={{ background: C.cream, minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop"
          alt="Serene spa landscape"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            y: heroY,
            scale: heroScale,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(44,48,40,0.65) 0%, rgba(107,143,113,0.3) 50%, rgba(44,48,40,0.55) 100%)",
          }}
        />

        {/* Ripple Water Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="ripple-ring"
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                border: `1px solid rgba(201,168,85,0.6)`,
                borderRadius: "50%",
              }}
            />
          ))}
          <div
            style={{
              width: 12,
              height: 12,
              background: C.gold,
              borderRadius: "50%",
              opacity: 0.8,
            }}
          />
        </div>

        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 760,
            padding: "0 32px",
            opacity: heroOpacity,
          }}
        >
          <TextReveal delay={0.2}>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Alpine Thermal Retreat
            </div>
          </TextReveal>

          <TextReveal delay={0.4}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(52px, 7vw, 96px)",
                fontWeight: 300,
                color: C.white,
                lineHeight: 1.05,
                marginBottom: 28,
                fontStyle: "italic",
              }}
            >{c?.heroHeadline ?? <>
              Where stillness<br />becomes medicine
            </>}</h1>
          </TextReveal>

          <TextReveal delay={0.6}>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.8,
                marginBottom: 48,
                fontWeight: 300,
                maxWidth: 500,
                margin: "0 auto 48px",
              }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              A curated sanctuary of thermal waters, ancient botanicals,
              and silence. Sixty kilometres from the city. A world apart.
            </>}</p>
          </TextReveal>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-43/packages" style={{ textDecoration: "none" }}>
              <MagneticButton
                style={{
                  background: C.gold,
                  color: C.charcoal,
                  border: "none",
                  padding: "16px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Explore Packages
              </MagneticButton>
            </Link>
            <Link href="/templates/impact-43/experiences" style={{ textDecoration: "none" }}>
              <MagneticButton
                style={{
                  background: "transparent",
                  color: C.white,
                  border: `1px solid rgba(255,255,255,0.5)`,
                  padding: "16px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Discover More
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Scroll
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            }}
          />
        </div>
      </section>

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.sage} textColor="rgba(255,255,255,0.85)" />

      {/* Experiences Section */}
      <section id="experiences" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 72, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.sage,
                    marginBottom: 16,
                  }}
                >
                  Our Treatments
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(36px, 4vw, 58px)",
                    fontWeight: 300,
                    color: C.charcoal,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  Curated experiences<br />for body and mind
                </>}</h2>
              </TextReveal>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p
                style={{fontFamily: C.fontSans,
                  fontSize: 15,
                  color: brand ?? '#6b7265',
                  maxWidth: 360,
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >{c?.aboutText ?? <>
                Each treatment is designed as a complete ceremony — not merely a service. We source botanicals from certified organic farms within 200km.
              </>}</p>
              <Link href="/templates/impact-43/experiences" style={{ fontFamily: C.fontSans, color: C.gold, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", fontWeight: 600 }}>
                View All Experiences →
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {EXPERIENCES.slice(0, 3).map((exp, i) => (
              <ExperienceCard key={exp.title} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Thermal Circuit Section */}
      <section id="circuit" style={{ padding: "120px 80px", background: C.forest }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }} className="two-col">
          <div>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                The Journey
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 3.5vw, 52px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                  marginBottom: 28,
                }}
              >
                The Thermal Circuit
              </h2>
            </TextReveal>
            <p
              style={{fontFamily: C.fontSans,
                fontSize: 15,
                color: brand ?? '#6b7265',
                lineHeight: 1.8,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              Our six-step thermal journey follows the ancient principle of contrast therapy — the deliberate alternation of heat and cold that activates the body's deepest healing mechanisms.
            </p>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/3",
                marginBottom: 24,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1400&auto=format&fit=crop"
                alt="Thermal circuit"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  background: "rgba(44,48,40,0.85)",
                  padding: "20px 24px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 18,
                    color: C.white,
                    marginBottom: 4,
                    fontStyle: "italic",
                  }}
                >
                  Available daily, 7am – 9pm
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Included in all packages
                </div>
              </div>
            </div>
            <Link href="/templates/impact-43/circuit" style={{ textDecoration: "none" }}>
              <MagneticButton
                style={{
                  background: C.sage,
                  color: C.white,
                  border: "none",
                  padding: "14px 32px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                View Full Circuit Details
              </MagneticButton>
            </Link>
          </div>

          <div>
            {CIRCUIT_STEPS.slice(0, 3).map((step, i) => (
              <CircuitStep key={step.step} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                Retreat Packages
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4vw, 58px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Choose your depth<br />of immersion
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              marginBottom: 40,
            }}
          >
            {PACKAGES.map((pkg, i) => (
              <PackageCard
                key={pkg.name}
                pkg={pkg}
                index={i}
                isSelected={selectedPackage === i}
                onSelect={() => setSelectedPackage(i)}
                onBook={() => window.location.href = "/templates/impact-43/contact"}
              />
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/templates/impact-43/packages" style={{ textDecoration: "none" }}>
              <MagneticButton
                style={{
                  border: `1px solid ${C.gold}`,
                  background: "transparent",
                  color: C.goldDark,
                  padding: "16px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Compare All Packages
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section
        id="philosophy"
        style={{
          padding: "120px 80px",
          background: C.charcoal,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,85,0.08)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,85,0.05)`,
          }}
        />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "center" }} className="two-col">
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 16,
                  }}
                >
                  Our Philosophy
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(32px, 3.5vw, 48px)",
                    fontWeight: 300,
                    color: C.white,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                    marginBottom: 24,
                  }}
                >
                  The art of<br />doing nothing
                </h2>
              </TextReveal>
              <Link href="/templates/impact-43/philosophy" style={{ textDecoration: "none" }}>
                <span style={{ fontFamily: C.fontSans, color: C.gold, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
                  Read Our Philosophy →
                </span>
              </Link>
            </div>
            <div>
              {[
                { title: "Slow by design", body: "We cap daily arrivals at thirty guests. This is not a volume business. It is a precision one. Your experience of silence depends on us maintaining it." },
                { title: "Honest ingredients", body: "Every botanical in our treatments is certified organic and sourced within 200km. Our water comes from a granite spring at 1,400m. We don't compromise on materials." },
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    paddingBottom: 36,
                    marginBottom: 36,
                    borderBottom: i < 1 ? `1px solid rgba(255,255,255,0.08)` : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 22,
                      color: C.gold,
                      marginBottom: 10,
                      fontWeight: 400,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 15,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                The Practitioners
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4vw, 58px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Hands you can trust
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 48,
              marginBottom: 48,
            }}
          >
            {TEAM.slice(0, 3).map((therapist, i) => (
              <TherapistCard key={therapist.name} therapist={therapist} index={i} />
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/templates/impact-43/team" style={{ textDecoration: "none" }}>
              <MagneticButton
                style={{
                  background: C.sage,
                  color: C.white,
                  border: "none",
                  padding: "16px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Meet All Practitioners
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          background: C.forest,
          padding: "120px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                Guest Stories
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 3.5vw, 48px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  fontStyle: "italic",
                }}
              >
                What our guests say
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              position: "relative",
              minHeight: 280,
              background: C.white,
              border: `1px solid ${C.mist}`,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} t={t} active={activeTestimonial === i} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 28,
            }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeTestimonial === i ? C.sage : C.mist,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Strip */}
      <MarqueeStrip
        items={TESTIMONIALS.map((t) => `"${t.quote.substring(0, 60)}…" — ${t.author}`)}
        bg={C.charcoal}
        textColor="rgba(255,255,255,0.5)"
      />

      {/* Booking / Contact CTA Section */}
      <section style={{ padding: "120px 80px", background: C.cream, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <TextReveal>
            <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.sage, marginBottom: 16 }}>
              Reserve Your Stay
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h2 style={{ fontFamily: C.font, fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, color: C.charcoal, fontStyle: "italic", marginBottom: 24 }}>
              Begin your retreat
            </h2>
          </TextReveal>
          <p style={{fontFamily: C.fontSans, fontSize: 15, color: brand ?? '#6b7265', lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
            Availability is limited to thirty guests per day. We recommend booking at least two weeks in advance for weekend visits.
          </p>
          <Link href="/templates/impact-43/contact" style={{ textDecoration: "none" }}>
            <MagneticButton
              style={{
                background: C.sage,
                color: C.white,
                border: "none",
                padding: "18px 48px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Request Reservation
            </MagneticButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
