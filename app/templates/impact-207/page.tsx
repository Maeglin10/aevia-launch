"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion"
import Link from "next/link"
import { TemplateIcon } from '@/components/TemplateIcon'

/* ==========================================================================
   NEXUS FREIGHT — Premium B2B Freight & Logistics (impact-207)
   Design: #0a0f1e deep navy bg, #f0f4ff near-white text, #ff6b00 orange accent
   Fonts: Inter 400/600/700
   Sections: SVG Route Hero → Fleet Parallax → Stats → Services → Timeline →
             Testimonials → Contact
   ========================================================================== */

/* --------------------------------------------------------------------------
   FONTS
   -------------------------------------------------------------------------- */
function useFonts() {
  useEffect(() => {
    const id = "fonts-impact-207"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    document.head.appendChild(link)
  }, [])
}

/* --------------------------------------------------------------------------
   THEME TOKENS
   -------------------------------------------------------------------------- */
const T = {
  bg: "#0a0f1e",
  bgCard: "#111827",
  bgCardHover: "#1a2235",
  text: "#f0f4ff",
  textMuted: "#8899bb",
  accent: "#ff6b00",
  accentDim: "#ff6b0022",
  accentHover: "#ff8533",
  border: "#1e2d4a",
  borderAccent: "#ff6b0055",
  navy2: "#0d1528",
  navy3: "#0f1a30",
  green: "#22c55e",
  font: "'Inter', -apple-system, sans-serif",
}

/* --------------------------------------------------------------------------
   WORLD MAP SVG DATA — simplified continental outlines
   -------------------------------------------------------------------------- */
// Hub city coordinates [cx, cy] in SVG viewBox 0 0 1000 500
const HUBS: Record<string, { x: number; y: number; label: string }> = {
  paris: { x: 472, y: 148, label: "Paris" },
  rotterdam: { x: 479, y: 138, label: "Rotterdam" },
  dubai: { x: 580, y: 200, label: "Dubai" },
  singapore: { x: 720, y: 265, label: "Singapore" },
  chicago: { x: 200, y: 170, label: "Chicago" },
  saopaulo: { x: 285, y: 340, label: "São Paulo" },
}

// Routes: pairs of hub keys
const ROUTES: [string, string][] = [
  ["paris", "rotterdam"],
  ["paris", "dubai"],
  ["dubai", "singapore"],
  ["chicago", "paris"],
  ["chicago", "saopaulo"],
  ["singapore", "dubai"],
]

// Simplified world map path data (major continents — rough outlines)
const CONTINENTS = [
  // North America
  "M 100 100 L 115 90 L 145 85 L 175 80 L 210 85 L 235 100 L 250 120 L 260 145 L 255 170 L 245 195 L 230 215 L 210 230 L 195 240 L 180 255 L 165 260 L 155 255 L 150 240 L 155 225 L 160 210 L 155 195 L 145 185 L 130 180 L 115 170 L 108 155 L 105 140 L 100 125 Z",
  // South America
  "M 230 270 L 250 265 L 275 270 L 295 285 L 310 305 L 315 330 L 310 360 L 295 385 L 275 400 L 255 405 L 238 395 L 228 375 L 222 350 L 220 325 L 225 300 Z",
  // Europe
  "M 445 110 L 465 105 L 490 108 L 510 115 L 515 130 L 505 145 L 490 150 L 475 155 L 460 158 L 450 150 L 443 138 L 440 125 Z",
  // Africa
  "M 455 175 L 475 170 L 500 172 L 520 180 L 535 200 L 540 225 L 535 255 L 525 280 L 510 305 L 490 315 L 470 310 L 455 295 L 448 270 L 445 245 L 445 220 L 448 195 Z",
  // Asia main
  "M 520 90 L 560 80 L 610 75 L 660 80 L 710 90 L 750 100 L 780 115 L 800 130 L 790 150 L 770 160 L 745 165 L 720 170 L 695 175 L 670 185 L 645 195 L 620 200 L 595 205 L 570 200 L 550 190 L 535 175 L 525 160 L 518 145 L 515 130 L 515 115 Z",
  // Southeast Asia / peninsula
  "M 700 200 L 720 195 L 735 205 L 740 220 L 735 240 L 725 255 L 712 260 L 700 255 L 695 240 L 695 220 Z",
  // Australia
  "M 760 300 L 790 290 L 820 295 L 845 310 L 855 335 L 845 360 L 820 375 L 792 375 L 768 360 L 755 338 L 752 315 Z",
]

/* --------------------------------------------------------------------------
   GLOBAL STYLES
   -------------------------------------------------------------------------- */
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${T.bg}; color: ${T.text}; font-family: ${T.font}; overflow-x: hidden; }

      /* Mobile header fix: collapse the desktop nav on phones so it can't overlap the logo */
      @media (max-width: 900px){ .sky-desktop-nav{ display: none !important; } }

      .n207-btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        background: ${T.accent}; color: #fff; border: none; cursor: pointer;
        font-family: ${T.font}; font-weight: 600; font-size: 15px;
        padding: 14px 28px; border-radius: 4px; transition: background 0.2s, transform 0.15s;
        text-decoration: none;
      }
      .n207-btn-primary:hover { background: ${T.accentHover}; transform: translateY(-1px); }

      .n207-btn-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        background: transparent; color: ${T.text}; border: 1px solid ${T.border}; cursor: pointer;
        font-family: ${T.font}; font-weight: 500; font-size: 15px;
        padding: 13px 27px; border-radius: 4px; transition: border-color 0.2s, color 0.2s;
        text-decoration: none;
      }
      .n207-btn-ghost:hover { border-color: ${T.accent}; color: ${T.accent}; }

      .n207-section { padding: 100px 0; }
      .n207-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
      .n207-label {
        display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
        text-transform: uppercase; color: ${T.accent}; margin-bottom: 16px;
        padding: 5px 12px; border: 1px solid ${T.borderAccent};
        border-radius: 2px; background: ${T.accentDim};
      }
      .n207-h2 {
        font-size: clamp(32px, 4vw, 56px); font-weight: 800; color: ${T.text};
        line-height: 1.1; margin-bottom: 20px;
      }
      .n207-body { font-size: 17px; color: ${T.textMuted}; line-height: 1.7; }

      @keyframes n207-pulse-ring {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.4); opacity: 0; }
      }
      @keyframes n207-dash-flow {
        to { stroke-dashoffset: -24; }
      }
      @keyframes n207-blink {
        0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
      }
      @keyframes n207-spin-slow {
        from { transform: rotate(0deg); } to { transform: rotate(360deg); }
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${T.bg}; }
      ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
    
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
  )
}

/* --------------------------------------------------------------------------
   NAVBAR
   -------------------------------------------------------------------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { label: "Services", href: "#services" },
    { label: "Network", href: "#hero" },
    { label: "About", href: "#stats" },
    { label: "Timeline", href: "#timeline" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 32px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(10,15,30,0.95)"
          : "rgba(10,15,30,0.0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <div
              style={{
                width: 32,
                height: 32,
                background: T.accent,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 13 L8 5 L14 9 L18 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="2" cy="13" r="1.5" fill="white"/>
                <circle cx="18" cy="3" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: T.text, letterSpacing: "-0.02em" }}>
              NEXUS<span style={{ color: T.accent }}>FREIGHT</span>
            </span>
          </>
        )}
      </div>

      {/* Desktop links */}
      <div className="sky-desktop-nav" style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              color: T.textMuted,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = T.text)
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = T.textMuted)
            }
          >
            {l.label}
          </a>
        ))}
        <a href="#contact" className="n207-btn-primary" style={{ fontSize: 13, padding: "10px 20px" }}>
          Get a Quote
        </a>
      </div>
    </motion.nav>
  )
}

/* --------------------------------------------------------------------------
   SVG ROUTE MAP HERO
   -------------------------------------------------------------------------- */
function RouteMapHero() {
  const [drawProgress, setDrawProgress] = useState(0)
  const [activeRouteIndex, setActiveRouteIndex] = useState(-1)

  useEffect(() => {
    // Sequence: animate each route in, 500ms apart
    const timers: ReturnType<typeof setTimeout>[] = []
    ROUTES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveRouteIndex(i)
        }, 300 + i * 400)
      )
    })
    // After all routes done, keep all visible
    timers.push(
      setTimeout(() => {
        setActiveRouteIndex(ROUTES.length)
        setDrawProgress(1)
      }, 300 + ROUTES.length * 400 + 600)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const hubEntries = Object.entries(HUBS)

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: `linear-gradient(160deg, #0a0f1e 0%, #0d1835 40%, #0a1520 100%)`,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${T.border} 1px, transparent 1px),
            linear-gradient(90deg, ${T.border} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.25,
        }}
      />

      {/* SVG World Map */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          style={{
            width: "100%",
            height: "100%",
            opacity: 0.6,
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Continent fills */}
          {CONTINENTS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="#1a2a45"
              stroke="#2a3f65"
              strokeWidth="1"
              opacity="0.7"
            />
          ))}

          {/* Animated route lines */}
          {ROUTES.map(([fromKey, toKey], i) => {
            const from = HUBS[fromKey]
            const to = HUBS[toKey]
            const isVisible = i <= activeRouteIndex
            // Control point for curve
            const cx = (from.x + to.x) / 2
            const cy = Math.min(from.y, to.y) - 60 - Math.abs(to.x - from.x) * 0.05
            const pathD = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`

            return (
              <g key={i}>
                {/* Background dashed line always faint */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#ff6b0020"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                {/* Animated drawing line */}
                {isVisible && (
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={T.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  />
                )}
                {/* Moving packet dot */}
                {isVisible && (
                  <motion.circle
                    r="4"
                    fill="#fff"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      delay: 0.4,
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3 + i,
                    }}
                  >
                    <animateMotion
                      dur={`${4 + i * 0.5}s`}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </motion.circle>
                )}
              </g>
            )
          })}

          {/* Hub city dots */}
          {hubEntries.map(([key, hub]) => (
            <g key={key}>
              {/* Pulse ring */}
              <motion.circle
                cx={hub.x}
                cy={hub.y}
                r={10}
                fill="none"
                stroke={T.accent}
                strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              {/* Outer ring */}
              <circle cx={hub.x} cy={hub.y} r={7} fill="#0a0f1e" stroke={T.accent} strokeWidth="1.5" />
              {/* Inner dot */}
              <circle cx={hub.x} cy={hub.y} r={3.5} fill={T.accent} />
              {/* Label */}
              <text
                x={hub.x}
                y={hub.y - 15}
                textAnchor="middle"
                fill={T.text}
                fontSize="10"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                letterSpacing="0.05em"
              >
                {hub.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Orange glow at center */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background: "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Hero content */}
      <div className="n207-container" style={{ position: "relative", zIndex: 2, paddingTop: 120 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="n207-label" style={{ marginBottom: 24 }}>
            Global Freight Intelligence
          </div>

          <h1
            style={{
              fontFamily: T.font,
              fontWeight: 800,
              fontSize: "clamp(44px, 6.5vw, 88px)",
              lineHeight: 1.0,
              color: T.text,
              marginBottom: 28,
              letterSpacing: "-0.03em",
              maxWidth: 820,
            }}
          >
            Move Cargo
            <br />
            <span style={{ color: T.accent }}>Without Limits.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: T.textMuted,
              lineHeight: 1.6,
              maxWidth: 560,
              marginBottom: 44,
            }}
          >
            End-to-end freight solutions across air, sea, and road — connecting
            your supply chain to 43 countries with real-time tracking, predictive
            ETAs, and 98.4% on-time delivery.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#contact" className="n207-btn-primary">
              Request a Quote
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#services" className="n207-btn-ghost">
              Our Services
            </a>
          </div>

          {/* Mini stat bar */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 64,
              paddingTop: 32,
              borderTop: `1px solid ${T.border}`,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "43", suffix: " countries", label: "Active Network" },
              { value: "6", suffix: " continents", label: "Global Reach" },
              { value: "98.4%", suffix: "", label: "On-Time Rate" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: T.font,
                    fontWeight: 800,
                    fontSize: 32,
                    color: T.text,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                  <span style={{ color: T.accent, fontSize: 18 }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${T.accent})` }} />
      </motion.div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   CSS TRUCK COMPONENT
   -------------------------------------------------------------------------- */
interface TruckProps {
  scale?: number
  color?: string
  opacity?: number
}

function CssTruck({ scale = 1, color = "#1e3a5f", opacity = 1 }: TruckProps) {
  const s = scale
  return (
    <svg
      width={120 * s}
      height={56 * s}
      viewBox="0 0 120 56"
      fill="none"
      style={{ opacity, display: "block" }}
    >
      {/* Trailer body */}
      <rect x="2" y="12" width="82" height="34" rx="2" fill={color} stroke="#2a4a6e" strokeWidth="1"/>
      {/* Cab */}
      <path d="M84 22 L84 46 L118 46 L118 30 L108 22 Z" fill={color} stroke="#2a4a6e" strokeWidth="1"/>
      {/* Cab window */}
      <path d="M88 24 L88 32 L104 32 L104 24 Z" fill="#0a1f3a" opacity="0.7"/>
      {/* Headlight */}
      <circle cx="116" cy="40" r="3" fill={color} stroke="#ff6b00" strokeWidth="1.5"/>
      {/* Trailer stripe */}
      <rect x="2" y="12" width="82" height="4" fill={T.accent} opacity="0.4"/>
      {/* Logo on trailer */}
      <text x="28" y="35" fontFamily="Inter,sans-serif" fontSize="8" fontWeight="700" fill="#ffffff" opacity="0.5">NEXUSFREIGHT</text>
      {/* Rear wheels */}
      <circle cx="20" cy="46" r="8" fill="#0a0f1e" stroke="#2a4a6e" strokeWidth="2"/>
      <circle cx="20" cy="46" r="4" fill="#1a2a45"/>
      <circle cx="55" cy="46" r="8" fill="#0a0f1e" stroke="#2a4a6e" strokeWidth="2"/>
      <circle cx="55" cy="46" r="4" fill="#1a2a45"/>
      {/* Front wheel */}
      <circle cx="103" cy="46" r="8" fill="#0a0f1e" stroke="#2a4a6e" strokeWidth="2"/>
      <circle cx="103" cy="46" r="4" fill="#1a2a45"/>
    </svg>
  )
}

/* --------------------------------------------------------------------------
   FLEET PARALLAX SECTION
   -------------------------------------------------------------------------- */
function FleetParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "60%"])
  const x2 = useTransform(scrollYProgress, [0, 1], ["-15%", "30%"])
  const x3 = useTransform(scrollYProgress, [0, 1], ["-25%", "10%"])

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: T.navy3,
        padding: "80px 0",
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Road lines */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `repeating-linear-gradient(90deg, ${T.accent}44, ${T.accent}44 40px, transparent 40px, transparent 80px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          height: 1,
          background: `repeating-linear-gradient(90deg, ${T.border}, ${T.border} 40px, transparent 40px, transparent 80px)`,
        }}
      />

      <div className="n207-container" style={{ position: "relative", zIndex: 2, marginBottom: 48 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="n207-label">Fleet Operations</div>
          <h2 className="n207-h2">
            2,400+ vehicles.<br />
            <span style={{ color: T.accent }}>Always moving.</span>
          </h2>
          <p className="n207-body" style={{ maxWidth: 520 }}>
            Our fleet spans short-haul urban delivery vans to long-haul articulated trucks —
            every vehicle GPS-tracked, temperature-monitored, and route-optimized in real time.
          </p>
        </motion.div>
      </div>

      {/* Three lanes of trucks at different speeds */}
      {/* Slow lane — far distance (small, faint) */}
      <div style={{ position: "relative", height: 60, marginBottom: 16, overflow: "visible" }}>
        <motion.div style={{ x: x3, position: "absolute", top: 0, display: "flex", gap: 280, whiteSpace: "nowrap" }}>
          {[0, 1, 2, 3].map((i) => (
            <CssTruck key={i} scale={0.7} color="#0f2040" opacity={0.5} />
          ))}
        </motion.div>
      </div>

      {/* Mid lane */}
      <div style={{ position: "relative", height: 72, marginBottom: 16, overflow: "visible" }}>
        <motion.div style={{ x: x2, position: "absolute", top: 0, display: "flex", gap: 360, whiteSpace: "nowrap" }}>
          {[0, 1, 2].map((i) => (
            <CssTruck key={i} scale={0.85} color="#102338" opacity={0.7} />
          ))}
        </motion.div>
      </div>

      {/* Fast lane — foreground (full size) */}
      <div style={{ position: "relative", height: 80, overflow: "visible" }}>
        <motion.div style={{ x: x1, position: "absolute", top: 0, display: "flex", gap: 480, whiteSpace: "nowrap" }}>
          {[0, 1].map((i) => (
            <CssTruck key={i} scale={1.0} color="#152d4a" opacity={0.95} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   LIVE COUNTER HOOK
   -------------------------------------------------------------------------- */
function useCounter(target: number, duration = 2000, decimals = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((target * ease).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target, duration, decimals])

  return { value, ref }
}

/* --------------------------------------------------------------------------
   STATS SECTION
   -------------------------------------------------------------------------- */
interface StatCardProps {
  value: number
  suffix: string
  prefix?: string
  label: string
  sub: string
  decimals?: number
  delay?: number
}

function StatCard({ value, suffix, prefix = "", label, sub, decimals = 0, delay = 0 }: StatCardProps) {
  const { value: count, ref } = useCounter(value, 2200, decimals)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "36px 32px",
        flex: "1 1 220px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: T.accent,
        }}
      />
      <div
        style={{
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 48,
          color: T.text,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, color: T.textMuted }}>{sub}</div>
    </motion.div>
  )
}

function StatsSection() {
  return (
    <section id="stats" className="n207-section" style={{ background: T.bg }}>
      <div className="n207-container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="n207-label">Live Operations</div>
          <h2 className="n207-h2">Numbers that speak</h2>
          <p className="n207-body" style={{ maxWidth: 520, margin: "0 auto" }}>
            Real-time performance metrics from our global operations center — updated every 60 seconds.
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <StatCard
            value={12847}
            suffix=""
            label="Shipments Today"
            sub="Active parcels in our global network right now"
            delay={0}
          />
          <StatCard
            value={98.4}
            suffix="%"
            label="On-Time Delivery"
            sub="Average across all routes, last 90 days"
            decimals={1}
            delay={0.1}
          />
          <StatCard
            value={43}
            suffix=""
            label="Countries Served"
            sub="Direct presence in every major trade corridor"
            delay={0.2}
          />
          <StatCard
            value={6}
            suffix=""
            label="Continents Active"
            sub="Truly global — only Antarctica excluded"
            delay={0.3}
          />
        </div>

        {/* Uptime / live indicator bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 32,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: T.green,
                animation: "n207-blink 2s ease-in-out infinite",
                boxShadow: `0 0 8px ${T.green}`,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>All Systems Operational</span>
          </div>
          <div style={{ height: 1, flex: 1, background: T.border, minWidth: 20 }} />
          {["Tracking API", "Route Engine", "Customs Hub", "Fleet Comms", "ETA Prediction"].map((sys) => (
            <div key={sys} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
              <span style={{ fontSize: 12, color: T.textMuted }}>{sys}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   SERVICE CARDS WITH MAP-PIN HOVER
   -------------------------------------------------------------------------- */
interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  features: string[]
  color: string
  routePoints: [number, number][]
  delay?: number
}

function ServiceCard({ icon, title, desc, features, color, routePoints, delay = 0 }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${hovered ? color + "66" : T.border}`,
        borderRadius: 8,
        padding: "36px",
        flex: "1 1 250px",
        cursor: "pointer",
        transition: "background 0.25s, border-color 0.25s, transform 0.2s",
        transform: hovered ? "translateY(-4px)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at top right, ${color}18, transparent 70%)`,
          transition: "opacity 0.3s",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 8,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          color,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: T.font,
          fontWeight: 700,
          fontSize: 20,
          color: T.text,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
        {desc}
      </p>

      {/* Features */}
      <ul style={{ listStyle: "none", marginBottom: 28 }}>
        {features.map((f) => (
          <li
            key={f}
            style={{
              fontSize: 13,
              color: T.textMuted,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>

      {/* Mini route preview */}
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          paddingTop: 20,
          position: "relative",
        }}
      >
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          Route preview
        </div>
        <svg width="100%" height="50" viewBox="0 0 200 50" style={{ overflow: "visible" }}>
          {/* Dashed connecting lines */}
          {routePoints.slice(0, -1).map(([x1, y1], i) => {
            const [x2, y2] = routePoints[i + 1]
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                style={{
                  animation: hovered ? "n207-dash-flow 0.8s linear infinite" : "none",
                  strokeDashoffset: 0,
                }}
              />
            )
          })}
          {/* City dots */}
          {routePoints.map(([x, y], i) => (
            <g key={i}>
              {hovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.4"
                  style={{ animation: "n207-pulse-ring 1.5s ease-out infinite" }}
                />
              )}
              <circle cx={x} cy={y} r={4} fill={color} opacity={0.9} />
              <circle cx={x} cy={y} r={2} fill="#fff" opacity={0.8} />
            </g>
          ))}
        </svg>
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: hovered ? color : T.textMuted,
          transition: "color 0.2s",
          marginTop: 8,
        }}
      >
        Learn more
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }}>
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.div>
  )
}

function ServicesSection() {
  const services: ServiceCardProps[] = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Air Freight",
      desc: "Priority air cargo with same-day and next-flight-out options for time-critical shipments across our global airport network.",
      features: [
        "Door-to-door in 24–72 hours",
        "Dangerous goods certified",
        "Real-time tracking per piece",
        "Temperature-controlled options",
      ],
      color: "#3b82f6",
      routePoints: [[20, 40], [80, 15], [130, 30], [185, 10]],
      delay: 0,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="10" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Ocean Freight",
      desc: "Full Container Load (FCL) and Less-than-Container Load (LCL) solutions with carrier diversity across 200+ shipping lanes.",
      features: [
        "FCL & LCL consolidation",
        "Port-to-port and door-to-door",
        "Weekly departures on all lanes",
        "Customs brokerage included",
      ],
      color: "#06b6d4",
      routePoints: [[15, 35], [55, 45], [110, 20], [170, 35]],
      delay: 0.1,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Road Freight",
      desc: "Full-truck loads, partial loads, and groupage across Europe and beyond — with cross-border clearance in every corridor.",
      features: [
        "FTL, LTL, and groupage",
        "Scheduled and on-demand",
        "Intermodal road + rail",
        "ADR hazmat certified",
      ],
      color: "#22c55e",
      routePoints: [[10, 25], [70, 40], [130, 20], [190, 35]],
      delay: 0.2,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Express & Courier",
      desc: "Time-guaranteed delivery with proof of delivery, signature capture, and white-glove handling for your most valuable shipments.",
      features: [
        "Next-day and same-day options",
        "Signature POD & live photo",
        "High-value cargo protocols",
        "24/7 dedicated support",
      ],
      color: T.accent,
      routePoints: [[20, 20], [65, 38], [120, 12], [175, 28]],
      delay: 0.3,
    },
  ]

  return (
    <section id="services" className="n207-section" style={{ background: T.navy3 }}>
      <div className="n207-container">
        <div style={{ marginBottom: 60 }}>
          <div className="n207-label">What We Move</div>
          <h2 className="n207-h2">
            Every mode.<br />
            <span style={{ color: T.accent }}>One partner.</span>
          </h2>
          <p className="n207-body" style={{ maxWidth: 520 }}>
            Multimodal freight solutions engineered for complex global supply chains — from
            single pallets to full charter aircraft loads.
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   DELIVERY TIMELINE — STICKY SCROLL SEQUENCE
   -------------------------------------------------------------------------- */
const STAGES = [
  {
    id: "pickup",
    label: "Pickup",
    desc: "Our driver collects from your door or warehouse. Parcel scanned, weighed, and entered into the system within 60 seconds.",
    icon: "📦",
    time: "Day 0",
  },
  {
    id: "warehouse",
    label: "Warehouse",
    desc: "Your shipment reaches our regional hub. Automated sorting, route assignment, and consolidation with compatible loads.",
    icon: "🏭",
    time: "Day 0–1",
  },
  {
    id: "transit",
    label: "In Transit",
    desc: "Long-haul transport via road, air, or sea. GPS updates every 15 minutes. Predictive ETA re-calculated in real time.",
    icon: "🚛",
    time: "Day 1–3",
  },
  {
    id: "customs",
    label: "Customs",
    desc: "Our brokers handle documentation at every border. Pre-clearance reduces dwell time to under 4 hours on average.",
    icon: "📋",
    time: "Day 3",
  },
  {
    id: "delivered",
    label: "Delivered",
    desc: "Final-mile delivery with signature capture. Real-time photo proof uploaded instantly to your tracking portal.",
    icon: "✅",
    time: "Day 3–5",
  },
]

function DeliveryTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Map scroll 0-1 to stage index 0-4
  const [activeStage, setActiveStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setProgress(v)
      const idx = Math.floor(v * STAGES.length)
      setActiveStage(Math.min(idx, STAGES.length - 1))
    })
    return unsub
  }, [scrollYProgress])

  return (
    <section
      id="timeline"
      ref={sectionRef}
      style={{ height: "350vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: T.bg,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div className="n207-container" style={{ width: "100%" }}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Left: stage info */}
            <div>
              <div className="n207-label">Delivery Journey</div>
              <h2 className="n207-h2" style={{ marginBottom: 40 }}>
                From pickup to<br />
                <span style={{ color: T.accent }}>proof of delivery.</span>
              </h2>

              {/* Progress bar */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>SHIPMENT PROGRESS</span>
                  <span style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>
                    {Math.round(Math.min(progress, 0.99) * 100)}%
                  </span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, ${T.accent}, #ff9500)`,
                      borderRadius: 2,
                      width: `${Math.min(progress * 100, 99)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stage list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {STAGES.map((stage, i) => {
                  const isActive = i === activeStage
                  const isDone = i < activeStage

                  return (
                    <motion.div
                      key={stage.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                        padding: "16px 18px",
                        borderRadius: 6,
                        background: isActive ? `${T.accent}15` : "transparent",
                        border: `1px solid ${isActive ? T.accent + "55" : "transparent"}`,
                        transition: "all 0.4s ease",
                      }}
                    >
                      {/* Status dot */}
                      <div style={{ position: "relative", marginTop: 3 }}>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: isDone
                              ? T.green
                              : isActive
                              ? T.accent
                              : T.border,
                            border: `2px solid ${isDone ? T.green : isActive ? T.accent : "#2a3a55"}`,
                            transition: "all 0.3s",
                            flexShrink: 0,
                          }}
                        />
                        {isActive && (
                          <div
                            style={{
                              position: "absolute",
                              inset: -4,
                              borderRadius: "50%",
                              border: `2px solid ${T.accent}`,
                              animation: "n207-pulse-ring 1.5s ease-out infinite",
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: isActive ? T.text : isDone ? T.text : T.textMuted,
                              transition: "color 0.3s",
                            }}
                          >
                            {stage.label}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: isActive ? T.accent : T.textMuted,
                              fontWeight: 500,
                            }}
                          >
                            {stage.time}
                          </span>
                        </div>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55 }}
                          >
                            {stage.desc}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right: Stage visual card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.borderAccent}`,
                  borderRadius: 12,
                  padding: "48px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    marginBottom: 24,
                    filter: "drop-shadow(0 0 20px rgba(255,107,0,0.3))",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TemplateIcon emoji={STAGES[activeStage].icon} size={72} color={T.accent} />
                </div>
                <h3
                  style={{
                    fontFamily: T.font,
                    fontWeight: 800,
                    fontSize: 32,
                    color: T.text,
                    marginBottom: 16,
                  }}
                >
                  {STAGES[activeStage].label}
                </h3>
                <p style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.6 }}>
                  {STAGES[activeStage].desc}
                </p>

                {/* Stage-specific visual: step dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
                  {STAGES.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === activeStage ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === activeStage ? T.accent : T.border,
                        transition: "all 0.3s",
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 32,
                    padding: "12px 20px",
                    background: `${T.accent}18`,
                    border: `1px solid ${T.accent}44`,
                    borderRadius: 6,
                    fontSize: 13,
                    color: T.accent,
                    fontWeight: 600,
                  }}
                >
                  Stage {activeStage + 1} of {STAGES.length} — {STAGES[activeStage].time}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   TESTIMONIALS
   -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  {
    quote:
      "NexusFreight cut our cross-border transit times by 35%. The customs pre-clearance alone saves us two days on every EU shipment.",
    author: "Sophie Laurent",
    role: "Head of Supply Chain — Maison Beauté",
    rating: 5,
    country: "🇫🇷",
  },
  {
    quote:
      "The tracking portal is genuinely better than anything we've used before. Real-time GPS plus predictive ETAs has transformed our planning.",
    author: "Marcus Van der Berg",
    role: "Logistics Director — Rotterdam Components BV",
    rating: 5,
    country: "🇳🇱",
  },
  {
    quote:
      "We ship temperature-sensitive pharma across 18 countries. NexusFreight's cold-chain compliance has been flawless for 3 years running.",
    author: "Arjun Mehta",
    role: "VP Operations — MedLinx Asia",
    rating: 5,
    country: "🇸🇬",
  },
]

function TestimonialsSection() {
  return (
    <section className="n207-section" style={{ background: T.navy2 }}>
      <div className="n207-container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="n207-label">Client Voices</div>
          <h2 className="n207-h2">Trusted by supply chain leaders</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "36px",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 16 16" fill={T.accent}>
                    <path d="M8 1l2.3 4.6 5.1.7-3.7 3.6.9 5.1L8 12.6l-4.6 2.4.9-5.1L.6 6.3l5.1-.7z"/>
                  </svg>
                ))}
              </div>

              <blockquote
                style={{
                  fontSize: 16,
                  color: T.text,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  marginBottom: 28,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.accent}44, ${T.accent}11)`,
                    border: `1px solid ${T.borderAccent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {t.country}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{t.author}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner logos strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 60,
            padding: "28px 0",
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            gap: 52,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Trusted by</span>
          {["MAISON BEAUTÉ", "ROTTERDAM COMPONENTS", "MEDLINX ASIA", "DELTA PHARMA", "GLOBEX TRADE", "IRONSTONE MINING"].map((brand) => (
            <span
              key={brand}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.textMuted,
                letterSpacing: "0.05em",
                opacity: 0.6,
              }}
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   CONTACT / QUOTE FORM
   -------------------------------------------------------------------------- */
function ContactSection() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    mode: "",
    weight: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: T.navy3,
    border: `1px solid ${T.border}`,
    borderRadius: 4,
    padding: "13px 16px",
    color: T.text,
    fontFamily: T.font,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: T.textMuted,
    marginBottom: 8,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  }

  return (
    <section id="contact" className="n207-section" style={{ background: T.bg }}>
      <div className="n207-container">
        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="n207-label">Get a Quote</div>
            <h2 className="n207-h2" style={{ marginBottom: 24 }}>
              Ready to move?
              <br />
              <span style={{ color: T.accent }}>Let&apos;s talk.</span>
            </h2>
            <p className="n207-body" style={{ marginBottom: 40 }}>
              Tell us where you need to go — we&apos;ll build a tailored freight solution with
              competitive rates and a dedicated account manager.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                {
                  icon: "📍",
                  label: "Headquarters",
                  value: "15 Rue de la Paix, 75001 Paris, France",
                },
                {
                  icon: "📞",
                  label: "Sales Hotline",
                  value: "+33 1 45 00 00 00 (24/7)",
                },
                {
                  icon: "✉️",
                  label: "Email",
                  value: "sales@nexusfreight.com",
                },
                {
                  icon: "⏱",
                  label: "Response Time",
                  value: "Quote within 2 business hours",
                },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <TemplateIcon emoji={item.icon} size={18} color={T.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, color: T.text }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "44px",
              }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: T.text, marginBottom: 28 }}>
                    Freight Quote Request
                  </h3>

                  {/* Two-column grid for name fields */}
                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Company *</label>
                      <input
                        name="company"
                        required
                        placeholder="Your company"
                        style={inputStyle}
                        value={formData.company}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Your Name *</label>
                      <input
                        name="name"
                        required
                        placeholder="Full name"
                        style={inputStyle}
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                  </div>

                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        style={inputStyle}
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+1 555 000 000"
                        style={inputStyle}
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                  </div>

                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Origin City / Country *</label>
                      <input
                        name="origin"
                        required
                        placeholder="e.g. Rotterdam, NL"
                        style={inputStyle}
                        value={formData.origin}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Destination *</label>
                      <input
                        name="destination"
                        required
                        placeholder="e.g. Singapore, SG"
                        style={inputStyle}
                        value={formData.destination}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                  </div>

                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Transport Mode *</label>
                      <select
                        name="mode"
                        required
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={formData.mode}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      >
                        <option value="">Select mode...</option>
                        <option value="air">Air Freight</option>
                        <option value="ocean">Ocean Freight</option>
                        <option value="road">Road Freight</option>
                        <option value="express">Express / Courier</option>
                        <option value="multimodal">Multimodal</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Est. Weight / Volume</label>
                      <input
                        name="weight"
                        placeholder="e.g. 500 kg / 3 CBM"
                        style={inputStyle}
                        value={formData.weight}
                        onChange={handleChange}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Additional Details</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Describe your cargo, special requirements, incoterms, delivery deadlines..."
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: 100,
                      }}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>

                  <button type="submit" className="n207-btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "16px 24px" }}>
                    Request Quote
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <p style={{ fontSize: 12, color: T.textMuted, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
                    We respond within 2 business hours. By submitting, you agree to our terms.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><TemplateIcon emoji="📬" size={56} color={T.green} /></div>
                  <h3 style={{ fontWeight: 700, fontSize: 24, color: T.text, marginBottom: 12 }}>
                    Quote Request Received
                  </h3>
                  <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.6, marginBottom: 28 }}>
                    Your dedicated account manager will reach out within 2 business hours
                    with a tailored freight proposal.
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: `${T.green}18`,
                      border: `1px solid ${T.green}44`,
                      padding: "10px 20px",
                      borderRadius: 4,
                      color: T.green,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} />
                    Confirmation sent to {formData.email}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   FOOTER
   -------------------------------------------------------------------------- */
function Footer() {
  return (
    <footer
      style={{
        background: "#060b16",
        borderTop: `1px solid ${T.border}`,
        padding: "60px 0 32px",
      }}
    >
      <div className="n207-container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: T.accent,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M2 13 L8 5 L14 9 L18 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: T.text }}>
                NEXUS<span style={{ color: T.accent }}>FREIGHT</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.65, maxWidth: 280 }}>
              End-to-end freight intelligence for modern supply chains. 43 countries,
              6 continents, one platform.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {["LinkedIn", "Twitter", "YouTube"].map((net) => (
                <div
                  key={net}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: T.textMuted,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {net[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Services",
              links: ["Air Freight", "Ocean Freight", "Road Freight", "Express", "Customs Brokerage"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Sustainability", "Investors"],
            },
            {
              title: "Resources",
              links: ["Tracking Portal", "API Docs", "Partners", "Blog", "Contact"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.textMuted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none" }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a
                      href={
                        col.title === "Services"
                          ? "#services"
                          : link === "About Us"
                          ? "#stats"
                          : "#contact"
                      }
                      style={{
                        fontSize: 14,
                        color: T.textMuted,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = T.text)}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = T.textMuted)}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 24,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: T.textMuted }}>
            © 2026 NexusFreight SAS. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <a
                key={item}
                href="#contact"
                style={{ fontSize: 13, color: T.textMuted, textDecoration: "none" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* --------------------------------------------------------------------------
   ROOT PAGE COMPONENT
   -------------------------------------------------------------------------- */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact207() {
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

  useFonts()

  
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
    <>
      <GlobalStyles />
      <Navbar />
      <main>
        <RouteMapHero />
        <FleetParallax />
        <StatsSection />
        <ServicesSection />
        <DeliveryTimeline />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
