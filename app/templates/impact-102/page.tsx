"use client";
// @ts-nocheck
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Atom, Cpu, Binary, Globe, ArrowRight, ExternalLink, Download, Menu, X } from "lucide-react"

// ─── Reveal helper ────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const RESEARCH_AREAS = [
  {
    icon: Atom,
    title: "Quantum Error Correction",
    desc: "Developing fault-tolerant qubit architectures that maintain coherence across extended computation windows using topological protection methods.",
  },
  {
    icon: Cpu,
    title: "Quantum Processor Design",
    desc: "Engineering superconducting transmon and fluxonium processors with sub-microsecond gate times and 99.9%+ two-qubit fidelity targets.",
  },
  {
    icon: Binary,
    title: "Quantum Algorithms",
    desc: "Advancing variational quantum eigensolvers, quantum chemistry simulation, and combinatorial optimization for near-term hardware.",
  },
  {
    icon: Globe,
    title: "Quantum Networking",
    desc: "Prototype quantum repeater architectures and entanglement distribution protocols for intercontinental quantum communication links.",
  },
]

const PUBLICATIONS = [
  {
    date: "2026-04",
    title: "Coherence-Preserving Dynamical Decoupling in 127-Qubit Systems",
    authors: "Chen, R. · Park, S. · Williams, A.",
    status: "Published",
    statusColor: "#24a148",
  },
  {
    date: "2026-02",
    title: "Topological Qubit Arrays via Majorana Zero Modes: Experimental Evidence",
    authors: "Nkosi, T. · Larsson, E. · Chen, R.",
    status: "Published",
    statusColor: "#24a148",
  },
  {
    date: "2026-01",
    title: "Variational Quantum Eigensolver Performance on Protein Folding Benchmarks",
    authors: "Williams, A. · Yamamoto, K. · Osei, F.",
    status: "Published",
    statusColor: "#24a148",
  },
  {
    date: "2025-11",
    title: "Cross-Resonance Gate Calibration at 10mK: A Practical Framework",
    authors: "Park, S. · Brennan, M. · Nkosi, T.",
    status: "Preprint",
    statusColor: "#f1620a",
  },
  {
    date: "2025-09",
    title: "Entanglement Distribution Over 500km Fiber via Quantum Repeaters",
    authors: "Larsson, E. · Chen, R. · Yamamoto, K.",
    status: "Published",
    statusColor: "#24a148",
  },
]

const STATS = [
  { value: "47", label: "Published Papers" },
  { value: "$2.1B", label: "Research Funding" },
  { value: "312", label: "Scientists" },
  { value: "6", label: "Global Labs" },
]

const TEAM = [
  {
    name: "Dr. Rachel Chen",
    title: "Director of Quantum Hardware",
    affiliation: "MIT · Stanford Quantum Lab",
    paper: "Coherence-Preserving Dynamical Decoupling in 127-Qubit Systems",
    bg: "linear-gradient(135deg, #dde1ff 0%, #c4ceff 100%)",
  },
  {
    name: "Dr. Tobias Nkosi",
    title: "Lead, Error Correction",
    affiliation: "University of Waterloo · Perimeter Institute",
    paper: "Topological Qubit Arrays via Majorana Zero Modes",
    bg: "linear-gradient(135deg, #defbe6 0%, #a7f0ba 100%)",
  },
  {
    name: "Dr. Erik Larsson",
    title: "Quantum Networking Division",
    affiliation: "KTH Royal Institute · NIST",
    paper: "Entanglement Distribution Over 500km Fiber",
    bg: "linear-gradient(135deg, #fff0d6 0%, #ffd37c 100%)",
  },
]

const NAV_LINKS = ["Research", "Publications", "Team", "Infrastructure", "Careers"]

// ─── Metric row component ─────────────────────────────────────────────────────
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          color: "#8d8d8d",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          color: "#161616",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function QBitLabsPage() {
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", handler)
    
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
return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div
      style={{
        background: "#f4f4f4",
        color: "#161616",
        fontFamily: "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#ffffff",
          borderBottom: scrolled ? "1px solid #e0e0e0" : "1px solid #e0e0e0",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="#hero"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "#0f62fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Atom style={{ width: 16, height: 16, color: "#ffffff" }} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#161616",
                letterSpacing: "-0.01em",
              }}
            >
              QBit <span style={{ color: "#0f62fe" }}>Labs</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l}
                href="#hero"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#525252",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0f62fe")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#525252")}
              >
                {l}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                padding: "8px 20px",
                background: "#0f62fe",
                color: "#ffffff",
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                letterSpacing: "0.02em",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0353e9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0f62fe")}
            >
              Request Access
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
              className="show-mobile"
            >
              {menuOpen ? (
                <X style={{ width: 20, height: 20, color: "#161616" }} />
              ) : (
                <Menu style={{ width: 20, height: 20, color: "#161616" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "#ffffff",
              borderTop: "1px solid #e0e0e0",
              padding: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l}
                href="#hero"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#525252",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {l}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section id="hero"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
            padding: "80px 24px 72px",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Left: copy */}
            <div>
              <Reveal>
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                    color: "#0f62fe",
                    letterSpacing: "0.12em",
                    marginBottom: 24,
                    background: "#edf5ff",
                    padding: "4px 10px",
                  }}
                >
                  // QUANTUM COMPUTING RESEARCH
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1
                  style={{
                    fontSize: "clamp(36px, 5vw, 60px)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: "#161616",
                    margin: "0 0 24px",
                    letterSpacing: "-0.02em",
                    maxWidth: 640,
                  }}
                >{c?.heroHeadline ?? <>
                  The future of computation{" "}
                  <span style={{ fontWeight: 700 }}>is quantum.</span>
                </>}</h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p
                  style={{
                    fontSize: 16,
                    color: "#525252",
                    lineHeight: 1.65,
                    maxWidth: 520,
                    margin: "0 0 40px",
                  }}
                >{c?.heroSubline ?? fd?.tagline ?? <>
                  QBit Labs is an independent quantum computing research institute
                  advancing fault-tolerant processors, quantum algorithms, and the
                  foundational science of the post-classical era.
                </>}</p>
              </Reveal>

              <Reveal delay={0.15}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    style={{
                      padding: "12px 28px",
                      background: "#0f62fe",
                      color: "#ffffff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#0353e9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#0f62fe")}
                  >
                    Explore Research <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    style={{
                      padding: "12px 28px",
                      background: "transparent",
                      color: "#0f62fe",
                      border: "1px solid #0f62fe",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#edf5ff"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    View Publications
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right: live metrics panel */}
            <Reveal delay={0.2} y={16}>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                      color: "#8d8d8d",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    System Status
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#24a148",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                        color: "#24a148",
                        letterSpacing: "0.06em",
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                </div>

                <MetricRow label="QUBITS ACTIVE" value="127" />
                <MetricRow label="COHERENCE TIME" value="99μs" />
                <MetricRow label="GATE FIDELITY" value="99.9%" />
                <MetricRow label="QUEUE DEPTH" value="4,821" />
                <MetricRow label="T1 TIME" value="312μs" />
                <MetricRow label="READOUT ERR." value="0.8%" />

                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                      color: "#8d8d8d",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    System load
                  </div>
                  <div
                    style={{height: 4,
                      background: brand ?? '#e0e0e0',
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "73%" }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                      style={{ height: "100%", background: "#0f62fe" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                      fontSize: 9,
                      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                      color: "#8d8d8d",
                    }}
                  >
                    <span>0%</span>
                    <span style={{ color: "#0f62fe" }}>73% — HIGH</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
        <section
          style={{
            background: "#f4f4f4",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  style={{
                    padding: "32px 24px",
                    borderRight: i < STATS.length - 1 ? "1px solid #e0e0e0" : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: "#161616",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#525252",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── RESEARCH AREAS ────────────────────────────────────────────────── */}
        <section
          style={{
            background: "#f4f4f4",
            padding: "72px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: 48 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                    color: "#0f62fe",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  // Areas of investigation
                </p>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 300,
                    color: "#161616",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  Research{" "}
                  <span style={{ fontWeight: 700 }}>domains</span>
                </h2>
              </div>
            </Reveal>

            <div
              style={{display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 1,
                background: brand ?? '#e0e0e0',
              }}
            >
              {RESEARCH_AREAS.map((area, i) => {
                const Icon = area.icon
                return (
                  <Reveal key={i} delay={i * 0.08}>
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "32px 28px 28px",
                        borderTop: "3px solid #0f62fe",
                        height: "100%",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        transition: "box-shadow 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"
                        e.currentTarget.style.zIndex = "1"
                        e.currentTarget.style.position = "relative"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none"
                        e.currentTarget.style.zIndex = "0"
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "#edf5ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Icon style={{ width: 20, height: 20, color: "#0f62fe" }} />
                      </div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#161616",
                          margin: "0 0 12px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {area.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#525252",
                          lineHeight: 1.65,
                          margin: "0 0 20px",
                        }}
                      >
                        {area.desc}
                      </p>
                      <Link
                        href="#hero"
                        style={{
                          fontSize: 12,
                          color: "#0f62fe",
                          textDecoration: "none",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        Learn more <ArrowRight style={{ width: 12, height: 12 }} />
                      </Link>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── PUBLICATIONS TABLE ────────────────────────────────────────────── */}
        <section
          style={{
            background: "#ffffff",
            padding: "72px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 32,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                      color: "#0f62fe",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      margin: "0 0 12px",
                    }}
                  >
                    // Recent output
                  </p>
                  <h2
                    style={{
                      fontSize: "clamp(24px, 3vw, 36px)",
                      fontWeight: 300,
                      color: "#161616",
                      letterSpacing: "-0.01em",
                      margin: 0,
                    }}
                  >
                    Selected{" "}
                    <span style={{ fontWeight: 700 }}>publications</span>
                  </h2>
                </div>
                <Link
                  href="#hero"
                  style={{
                    fontSize: 12,
                    color: "#0f62fe",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  View all 47 papers{" "}
                  <ExternalLink style={{ width: 12, height: 12 }} />
                </Link>
              </div>
            </Reveal>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 200px 100px 120px",
                gap: 0,
                background: "#f4f4f4",
                borderTop: "1px solid #e0e0e0",
                borderLeft: "1px solid #e0e0e0",
                borderRight: "1px solid #e0e0e0",
              }}
            >
              {["Date", "Title", "Authors", "Status", ""].map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#525252",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid #e0e0e0",
                    borderRight: i < 4 ? "1px solid #e0e0e0" : "none",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {PUBLICATIONS.map((pub, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 200px 100px 120px",
                    background: i % 2 === 0 ? "#ffffff" : "#f4f4f4",
                    borderLeft: "1px solid #e0e0e0",
                    borderRight: "1px solid #e0e0e0",
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#edf5ff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      i % 2 === 0 ? "#ffffff" : "#f4f4f4"
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      fontSize: 12,
                      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                      color: "#8d8d8d",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {pub.date}
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      color: "#161616",
                      fontWeight: 500,
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {pub.title}
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      fontSize: 12,
                      color: "#525252",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {pub.authors}
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: pub.statusColor,
                        background:
                          pub.status === "Published" ? "#defbe6" : "#fff3e0",
                        padding: "2px 8px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {pub.status}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="#contact"
                      style={{
                        fontSize: 12,
                        color: "#0f62fe",
                        textDecoration: "none",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      <Download style={{ width: 12, height: 12 }} /> PDF
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TEAM ──────────────────────────────────────────────────────────── */}
        <section
          style={{
            background: "#f4f4f4",
            padding: "72px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: 48 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                    color: "#0f62fe",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                    margin: "0 0 12px",
                  }}
                >
                  // Principal investigators
                </p>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 300,
                    color: "#161616",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  Research{" "}
                  <span style={{ fontWeight: 700 }}>leadership</span>
                </h2>
              </div>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {TEAM.map((member, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Photo placeholder */}
                    <div
                      style={{
                        height: 160,
                        background: member.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          fontWeight: 600,
                          color: "#161616",
                        }}
                      >
                        {member.name
                          .split(" ")
                          .filter((_, idx) => idx > 0)
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>

                    <div style={{ padding: "24px" }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#161616",
                          margin: "0 0 4px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {member.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#0f62fe",
                          fontWeight: 500,
                          margin: "0 0 6px",
                        }}
                      >
                        {member.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#8d8d8d",
                          margin: "0 0 20px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {member.affiliation}
                      </p>
                      <div
                        style={{
                          borderTop: "1px solid #e0e0e0",
                          paddingTop: 16,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            color: "#8d8d8d",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            margin: "0 0 6px",
                          }}
                        >
                          Recent paper
                        </p>
                        <Link
                          href="#contact"
                          style={{
                            fontSize: 12,
                            color: "#0f62fe",
                            textDecoration: "none",
                            fontWeight: 400,
                            lineHeight: 1.4,
                            display: "block",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {member.paper} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT / PARTNERSHIP ────────────────────────────────────────── */}
        <section id="contact"
          style={{
            background: "#ffffff",
            padding: "72px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 480px",
              gap: 80,
              alignItems: "start",
            }}
          >
            {/* Left: copy */}
            <div>
              <Reveal>
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                    color: "#0f62fe",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                    margin: "0 0 12px",
                  }}
                >
                  // Partnerships & access
                </p>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 300,
                    color: "#161616",
                    letterSpacing: "-0.01em",
                    margin: "0 0 20px",
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  Research access{" "}
                  <span style={{ fontWeight: 700 }}>& collaboration</span>
                </>}</h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#525252",
                    lineHeight: 1.65,
                    maxWidth: 480,
                    margin: "0 0 32px",
                  }}
                >{c?.aboutText ?? <>
                  QBit Labs partners with universities, national labs, and industry
                  researchers. Cloud access to our 127-qubit system is available via
                  our Research Gateway program.
                </>}</p>
              </Reveal>

              <Reveal delay={0.1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    ["Academic partners", "Free queue access, priority allocations"],
                    ["Industry research", "SLA-backed compute agreements"],
                    ["Government & defense", "Classified-environment options"],
                  ].map(([title, desc], i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 16,
                        padding: "16px 0",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          background: "#0f62fe",
                          marginTop: 7,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}
                        >
                          {title}
                        </div>
                        <div style={{ fontSize: 12, color: "#525252", marginTop: 2 }}>
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: form */}
            <Reveal delay={0.15} y={16}>
              <div
                style={{
                  background: "#f4f4f4",
                  border: "1px solid #e0e0e0",
                  padding: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#161616",
                    margin: "0 0 24px",
                  }}
                >
                  Request research access
                </h3>

                {[
                  { label: "Full name", type: "text", placeholder: "Dr. Jane Smith" },
                  {
                    label: "Institution",
                    type: "text",
                    placeholder: "MIT, Stanford, etc.",
                  },
                  {
                    label: "Email address",
                    type: "email",
                    placeholder: "jane@institute.edu",
                  },
                ].map((field) => (
                  <div key={field.label} style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#525252",
                        marginBottom: 6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        padding: "10px 0 10px 0",
                        fontSize: 13,
                        color: "#161616",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #161616",
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderBottomColor = "#0f62fe"
                        e.currentTarget.style.borderBottomWidth = "2px"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderBottomColor = "#161616"
                        e.currentTarget.style.borderBottomWidth = "1px"
                      }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Research area
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 13,
                      color: "#161616",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #161616",
                      outline: "none",
                      fontFamily: "inherit",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#0f62fe"
                      e.currentTarget.style.borderBottomWidth = "2px"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = "#161616"
                      e.currentTarget.style.borderBottomWidth = "1px"
                    }}
                  >
                    <option value="">Select an area</option>
                    <option>Quantum Error Correction</option>
                    <option>Quantum Algorithms</option>
                    <option>Quantum Networking</option>
                    <option>Quantum Chemistry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Brief description of research intent
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your research goals and intended use of quantum compute access..."
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 13,
                      color: "#161616",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #161616",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#0f62fe"
                      e.currentTarget.style.borderBottomWidth = "2px"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = "#161616"
                      e.currentTarget.style.borderBottomWidth = "1px"
                    }}
                  />
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#0f62fe",
                    color: "#ffffff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0353e9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0f62fe")}
                >
                  Submit Request
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#161616",
          color: "#f4f4f4",
          padding: "56px 24px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {/* Top: logo + columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: 48,
              paddingBottom: 48,
              borderBottom: "1px solid #393939",
              marginBottom: 32,
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "#0f62fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Atom style={{ width: 16, height: 16, color: "#ffffff" }} />
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#f4f4f4",
                  }}
                >
                  QBit <span style={{ color: "#78a9ff" }}>Labs</span>
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#8d8d8d",
                  lineHeight: 1.65,
                  maxWidth: 280,
                  margin: "0 0 20px",
                }}
              >
                Advancing the science of quantum computation. Independent research,
                open publication, and open access infrastructure.
              </p>
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                  color: "#525252",
                  letterSpacing: "0.06em",
                }}
              >{fd?.businessName ?? "QUANTUM // COMPUTE"}</p>
            </div>

            {/* Link columns */}
            {[
              {
                title: "Research",
                links: [
                  "Error Correction",
                  "Quantum Hardware",
                  "Algorithms",
                  "Networking",
                  "Publications",
                ],
              },
              {
                title: "Infrastructure",
                links: [
                  "Research Gateway",
                  "Cloud Access",
                  "Documentation",
                  "API Reference",
                  "System Status",
                ],
              },
              {
                title: "Company",
                links: [
                  "About QBit Labs",
                  "Leadership",
                  "Careers",
                  "Press",
                  "Contact",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#f4f4f4",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 16px",
                  }}
                >
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link} style={{ marginBottom: 10 }}>
                      <Link
                        href="#hero"
                        style={{
                          fontSize: 13,
                          color: "#8d8d8d",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f4f4")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#8d8d8d")}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: "#525252" }}>
              © 2026 QBit Labs. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy Policy", "Terms of Use", "Accessibility"].map((l) => (
                <Link
                  key={l}
                  href="#hero"
                  style={{ fontSize: 12, color: "#525252", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f4f4")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#525252")}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
