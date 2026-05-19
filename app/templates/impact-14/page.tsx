"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  Anchor,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Star,
  Wind,
} from "lucide-react";

/* ─────────────────────────────────────────────
   GLOBAL KEYFRAME STYLES
───────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  @keyframes compassSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes compassFastSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pinBounce {
    0%   { transform: translateY(-20px) scale(0); opacity: 0; }
    60%  { transform: translateY(4px) scale(1.15); opacity: 1; }
    80%  { transform: translateY(-3px) scale(0.95); }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes pulseGold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-sans  { font-family: 'Montserrat', sans-serif; }

  .gold-shimmer {
    background: linear-gradient(90deg, #c9a84c 0%, #f0d98c 40%, #c9a84c 60%, #a07828 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .parallax-layer {
    position: absolute;
    inset: -30% 0 -30% 0;
    width: 100%;
    will-change: transform;
  }

  .clip-reveal {
    clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%);
    transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .clip-reveal.revealed {
    clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 100%);
  }

  .timeline-line::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: var(--progress, 0%);
    background: linear-gradient(to bottom, #c9a84c, transparent);
    transform: translateX(-50%);
    transition: height 0.1s linear;
  }

  .waypoint-pin.active .pin-dot {
    animation: pinBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards, pulseGold 2s ease-in-out infinite;
  }

  .counter-digit {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  /* Compass rose petals */
  .compass-petal {
    position: absolute;
    width: 2px;
    transform-origin: bottom center;
    background: linear-gradient(to top, #c9a84c, transparent);
  }

  /* Scroll indicator bounce */
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50%       { transform: translateY(8px); opacity: 0.5; }
  }
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Destination {
  name: string;
  region: string;
  tagline: string;
  gradient: string;
  accent: string;
}

interface Waypoint {
  day: string;
  port: string;
  lat: string;
  lon: string;
  description: string;
}

interface Testimonial {
  name: string;
  title: string;
  text: string;
  yacht: string;
  stars: number;
}

interface StatItem {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const destinations: Destination[] = [
  {
    name: "Monaco",
    region: "French Riviera",
    tagline: "Where glamour meets the open sea",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0a2a4a 100%)",
    accent: "#c9a84c",
  },
  {
    name: "Santorini",
    region: "Greek Islands",
    tagline: "Caldera sunsets from your private deck",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #0d1b2a 100%)",
    accent: "#c9a84c",
  },
  {
    name: "Maldives",
    region: "Indian Ocean",
    tagline: "Atolls of turquoise in perfect silence",
    gradient: "linear-gradient(135deg, #0a2a1a 0%, #0d3d2a 50%, #0d1b2a 100%)",
    accent: "#c9a84c",
  },
  {
    name: "Amalfi",
    region: "Tyrrhenian Coast",
    tagline: "Cliffside villages draped in legend",
    gradient: "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 50%, #1a0d0a 100%)",
    accent: "#c9a84c",
  },
  {
    name: "St. Barts",
    region: "Caribbean",
    tagline: "Pristine bays reserved for the few",
    gradient: "linear-gradient(135deg, #0a1a2a 0%, #0d2a3a 50%, #051015 100%)",
    accent: "#c9a84c",
  },
];

const voyageWaypoints: Waypoint[] = [
  { day: "Day 1", port: "Monaco", lat: "43°44′N", lon: "7°25′E", description: "Embarkation from Port Hercules. Champagne welcome and evening anchorage beneath the Rock." },
  { day: "Day 3", port: "Portofino", lat: "44°18′N", lon: "9°12′E", description: "Morning fog lifts to reveal the pastel facades. Private lunch at a harbour-side trattoria." },
  { day: "Day 6", port: "Amalfi", lat: "40°38′N", lon: "14°36′E", description: "Cathedral bells, lemon groves, and crystal coves accessible only by tender." },
  { day: "Day 9", port: "Capri", lat: "40°33′N", lon: "14°13′E", description: "The Blue Grotto at dawn with no other vessel in sight. Villa visits by private arrangement." },
  { day: "Day 12", port: "Malta", lat: "35°54′N", lon: "14°31′E", description: "Valletta's Grand Harbour — Baroque splendour and Knights Hospitaller history." },
  { day: "Day 15", port: "Ibiza", lat: "38°54′N", lon: "1°26′E", description: "Hidden coves on the island's north shore. Sunset over Ses Salines salt flats." },
];

const testimonials: Testimonial[] = [
  {
    name: "Charlotte Ashworth",
    title: "Private Client, London",
    text: "Every detail was considered before I thought to ask. The crew understood that true luxury is the absence of friction. Our Mediterranean crossing remains the finest week of my life.",
    yacht: "M/Y Lumière — 58m",
    stars: 5,
  },
  {
    name: "Édouard de Villeneuve",
    title: "Family Charter, Paris",
    text: "We have chartered through three agencies over twenty years. Horizon Maritime is categorically different — a concierge service that happens to include the most beautiful vessel we have ever stepped aboard.",
    yacht: "S/Y Ariel — 42m",
    stars: 5,
  },
  {
    name: "James & Priya Wentworth",
    title: "Anniversary Voyage, Singapore",
    text: "The anchorage off Positano at midnight, the Michelin-starred chef flown from Rome, the utter silence broken only by water against the hull. I cannot describe it without tears.",
    yacht: "M/Y Étoile — 72m",
    stars: 5,
  },
];

const stats: StatItem[] = [
  { value: 34127, decimals: 2, suffix: "", label: "Nautical Miles Sailed" },
  { value: 87, decimals: 2, suffix: "", label: "Private Destinations" },
  { value: 28, decimals: 2, suffix: "", label: "Years of Excellence" },
  { value: 99.8, decimals: 1, suffix: "%", label: "Client Return Rate" },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useParallaxLayers() {
  const skyRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      if (skyRef.current)     skyRef.current.style.transform     = `translateY(${y * 0.05}px)`;
      if (horizonRef.current) horizonRef.current.style.transform = `translateY(${y * 0.15}px)`;
      if (seaRef.current)     seaRef.current.style.transform     = `translateY(${y * 0.35}px)`;
      if (fgRef.current)      fgRef.current.style.transform      = `translateY(${y * 0.6}px)`;
      rafRef.current = null;
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { skyRef, horizonRef, seaRef, fgRef };
}

function useCompassRotation() {
  const angleRef = useRef(0);
  const compassRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    let frameId: number;
    const BASE_SPEED = 0.08;

    const animate = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      velocityRef.current = velocityRef.current * 0.85 + Math.abs(delta) * 0.15;

      const speed = BASE_SPEED + velocityRef.current * 0.04;
      angleRef.current = (angleRef.current + speed) % 360;

      if (compassRef.current) {
        compassRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return compassRef;
}

function useCounter(target: number, decimals: number, triggered: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    const duration = 2400;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target, decimals]);

  return value;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function CompassRose() {
  const innerRef = useCompassRotation();
  const petals = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 120,
      }}
    >
      <div
        ref={innerRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {petals.map((i) => {
          const angle = (i / petals.length) * 360;
          const isCardinal = i % 4 === 0;
          const length = isCardinal ? 56 : i % 2 === 0 ? 42 : 30;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: isCardinal ? 3 : 1.5,
                height: length,
                transformOrigin: "top center",
                transform: `translateX(-50%) rotate(${angle}deg) translateY(-${length}px)`,
                background: isCardinal
                  ? "linear-gradient(to bottom, #c9a84c, rgba(201,168,76,0.1))"
                  : "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)",
                borderRadius: 2,
              }}
            />
          );
        })}
        {/* Center circle */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#c9a84c",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 16px rgba(201,168,76,0.6)",
          }}
        />
        {/* Cardinal labels */}
        {["N", "E", "S", "W"].map((dir, i) => {
          const positions = [
            { top: -20, left: "50%", transform: "translateX(-50%)" },
            { top: "50%", right: -20, transform: "translateY(-50%)" },
            { bottom: -20, left: "50%", transform: "translateX(-50%)" },
            { top: "50%", left: -20, transform: "translateY(-50%)" },
          ];
          return (
            <span
              key={dir}
              style={{
                position: "absolute",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 9,
                fontWeight: 600,
                color: "#c9a84c",
                letterSpacing: 1,
                ...positions[i],
              }}
            >
              {dir}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DestinationCard({
  dest,
  index,
}: {
  dest: Destination;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setRevealed(true), index * 120);
      return () => clearTimeout(t);
    }
  }, [inView, index]);

  return (
    <div
      ref={ref}
      className={`clip-reveal${revealed ? " revealed" : ""}`}
      style={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        height: "100%",
        minHeight: 380,
        background: dest.gradient,
        border: "1px solid rgba(201,168,76,0.2)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Gold accent line top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          opacity: revealed ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
        }}
      />

      {/* Decorative coordinate grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}
        viewBox="0 0 400 380"
      >
        {[80, 160, 240, 320].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="#c9a84c" strokeWidth="0.5" />
        ))}
        {[95, 190, 285].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#c9a84c" strokeWidth="0.5" />
        ))}
      </svg>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2rem 1.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 3,
            color: "#c9a84c",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {dest.region}
        </p>
        <h3
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 300,
            color: "#f0ece0",
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          {dest.name}
        </h3>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 12,
            color: "rgba(240,236,224,0.6)",
            fontWeight: 300,
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          {dest.tagline}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 1,
              background: "#c9a84c",
            }}
          />
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 10,
              color: "#c9a84c",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Enquire
          </span>
        </div>
      </div>
    </div>
  );
}

function WaypointItem({
  wp,
  index,
  activeIndex,
}: {
  wp: Waypoint;
  index: number;
  activeIndex: number;
}) {
  const isActive = index <= activeIndex;
  const isCurrent = index === activeIndex;

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        alignItems: "flex-start",
        padding: "1.5rem 0",
        opacity: isActive ? 1 : 0.3,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Pin column */}
      <div
        className={`waypoint-pin${isActive ? " active" : ""}`}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 40,
          paddingTop: 4,
        }}
      >
        {/* Pin dot */}
        <div
          className="pin-dot"
          style={{
            width: isCurrent ? 16 : 10,
            height: isCurrent ? 16 : 10,
            borderRadius: "50%",
            background: isActive ? "#c9a84c" : "rgba(201,168,76,0.2)",
            border: `2px solid ${isActive ? "#c9a84c" : "rgba(201,168,76,0.3)"}`,
            boxShadow: isCurrent ? "0 0 0 4px rgba(201,168,76,0.2)" : "none",
            transition: "all 0.4s ease",
            zIndex: 2,
          }}
        />
        {/* Pin stem for non-last items */}
        {index < voyageWaypoints.length - 1 && (
          <div
            style={{
              width: 1,
              flexGrow: 1,
              minHeight: 60,
              background: isActive
                ? "linear-gradient(to bottom, #c9a84c, rgba(201,168,76,0.2))"
                : "rgba(201,168,76,0.1)",
              marginTop: 4,
              transition: "background 0.6s ease",
            }}
          />
        )}
      </div>

      {/* Text column */}
      <div style={{ flex: 1, paddingBottom: index < voyageWaypoints.length - 1 ? "1rem" : 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: 4 }}>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#c9a84c",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {wp.day}
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 9,
              color: "rgba(240,236,224,0.4)",
              letterSpacing: 1,
            }}
          >
            {wp.lat} · {wp.lon}
          </span>
        </div>
        <h4
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#f0ece0",
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          {wp.port}
        </h4>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 12,
            color: "rgba(240,236,224,0.55)",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          {wp.description}
        </p>
      </div>
    </div>
  );
}

function CounterStat({ stat, triggered }: { stat: StatItem; triggered: boolean }) {
  const count = useCounter(stat.value, stat.decimals, triggered);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="counter-digit"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 300,
          color: "#f0ece0",
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        <span className="gold-shimmer">
          {count.toLocaleString("en-US", {
            minimumFractionDigits: stat.decimals,
            maximumFractionDigits: stat.decimals,
          })}
          {stat.suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(240,236,224,0.4)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HorizonMaritimePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activeWaypoint, setActiveWaypoint] = useState(-1);

  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const { skyRef, horizonRef, seaRef, fgRef } = useParallaxLayers();
  const heroRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Testimonial auto-rotate
  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Timeline scroll tracking
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = rect.height;
      const scrolled = windowH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionH + windowH)));
      setTimelineProgress(progress);
      const waypointCount = voyageWaypoints.length;
      const wpIndex = Math.floor(progress * (waypointCount + 1)) - 1;
      setActiveWaypoint(Math.min(waypointCount - 1, wpIndex));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="font-sans"
      style={{
        minHeight: "100vh",
        background: "#0d1b2a",
        color: "#f0ece0",
        overflowX: "hidden",
      }}
    >
      {/* Global styles */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, #c9a84c, #f0d98c)",
          transformOrigin: "left",
          scaleX: progressScaleX,
          zIndex: 100,
        }}
      />

      {/* ── NAVIGATION ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "1.5rem 2rem",
          background: "linear-gradient(to bottom, rgba(13,27,42,0.95) 0%, transparent 100%)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "1px solid rgba(201,168,76,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(45deg)",
              }}
            >
              <Anchor
                size={14}
                style={{ color: "#c9a84c", transform: "rotate(-45deg)" }}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "1.2rem",
                  fontWeight: 400,
                  color: "#f0ece0",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Horizon
              </p>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 8,
                  fontWeight: 500,
                  color: "#c9a84c",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                Maritime
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.5rem",
            }}
            className="hidden-mobile"
          >
            {["Fleet", "Destinations", "Experience", "Voyage", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(240,236,224,0.7)",
                  textDecoration: "none",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "#c9a84c")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color =
                    "rgba(240,236,224,0.7)")
                }
              >
                {item}
              </Link>
            ))}
            <button
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "#0d1b2a",
                background: "#c9a84c",
                border: "none",
                padding: "0.7rem 1.75rem",
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              Enquire
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.3)",
              padding: "0.5rem",
              cursor: "pointer",
              color: "#c9a84c",
            }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "#0d1b2a",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              borderLeft: "1px solid rgba(201,168,76,0.2)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem" }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer" }}
              >
                <X size={24} />
              </button>
            </div>
            {["Fleet", "Destinations", "Experience", "Voyage", "Contact"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "2.5rem",
                    fontWeight: 300,
                    color: "#f0ece0",
                    textDecoration: "none",
                    marginBottom: "1.5rem",
                    letterSpacing: 2,
                  }}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(201,168,76,0.2)",
                paddingTop: "2rem",
              }}
            >
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 3, textTransform: "uppercase" }}>
                +33 1 23 45 67 89
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO: MULTI-SPEED PARALLAX ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Layer 1 — Sky (0.05x) */}
        <div
          ref={skyRef}
          className="parallax-layer"
          style={{
            background:
              "radial-gradient(ellipse 120% 60% at 50% 20%, #0f2744 0%, #051020 40%, #020a18 100%)",
            zIndex: 1,
          }}
        >
          {/* Stars scattered */}
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 2 + 0.5,
                borderRadius: "50%",
                background: "white",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: Math.random() * 0.6 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Layer 2 — Horizon (0.15x) */}
        <div
          ref={horizonRef}
          className="parallax-layer"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(12,30,55,0.6) 70%, rgba(9,20,38,0.9) 85%, #051828 100%)",
            zIndex: 2,
          }}
        >
          {/* Silhouette horizon */}
          <div
            style={{
              position: "absolute",
              bottom: "30%",
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)",
            }}
          />
          <svg
            style={{ position: "absolute", bottom: "28%", left: 0, width: "100%", opacity: 0.15 }}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80 L0 60 Q180 40 360 55 Q540 70 720 50 Q900 30 1080 48 Q1260 66 1440 45 L1440 80 Z"
              fill="#0d1b2a"
            />
          </svg>
        </div>

        {/* Layer 3 — Sea (0.35x) */}
        <div
          ref={seaRef}
          className="parallax-layer"
          style={{ zIndex: 3 }}
        >
          {/* Ocean gradient */}
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: 0,
              right: 0,
              height: "45%",
              background:
                "linear-gradient(to bottom, rgba(5,24,40,0) 0%, rgba(5,20,38,0.7) 30%, rgba(4,16,32,0.95) 100%)",
            }}
          />
          {/* Wave lines */}
          <svg
            style={{ position: "absolute", bottom: "22%", left: 0, width: "100%", opacity: 0.2 }}
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
          >
            {[0, 8, 16, 24].map((offset) => (
              <path
                key={offset}
                d={`M0 ${20 + offset} Q360 ${10 + offset} 720 ${22 + offset} Q1080 ${34 + offset} 1440 ${18 + offset}`}
                fill="none"
                stroke="#c9a84c"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>

        {/* Layer 4 — Foreground elements (0.6x) */}
        <div
          ref={fgRef}
          className="parallax-layer"
          style={{ zIndex: 4, pointerEvents: "none" }}
        >
          {/* Yacht silhouette */}
          <svg
            style={{
              position: "absolute",
              bottom: "24%",
              right: "10%",
              width: 320,
              opacity: 0.18,
            }}
            viewBox="0 0 320 100"
          >
            <path
              d="M60 90 L60 30 L160 10 L260 30 L260 90 Z"
              fill="none"
              stroke="#f0ece0"
              strokeWidth="1"
            />
            <path d="M60 30 L60 90" stroke="#f0ece0" strokeWidth="1" />
            <path d="M0 90 L320 90" stroke="#f0ece0" strokeWidth="0.5" />
            <path d="M160 10 L160 90" stroke="#f0ece0" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Compass overlay (always visible, top-right) */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "5%",
            zIndex: 10,
            opacity: 0.7,
            animation: "floatY 8s ease-in-out infinite",
          }}
        >
          <CompassRose />
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 2rem",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            {/* Overline */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 40, height: 1, background: "#c9a84c" }} />
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#c9a84c",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                Private Maritime Journeys
              </p>
            </div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                fontWeight: 300,
                color: "#f0ece0",
                lineHeight: 1.0,
                marginBottom: "1.5rem",
                letterSpacing: -1,
              }}
            >
              Beyond the
              <br />
              <em style={{ fontStyle: "italic", color: "#c9a84c" }}>ordinary</em>
              <br />
              horizon.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(240,236,224,0.65)",
                maxWidth: 420,
                lineHeight: 1.8,
                marginBottom: "2.5rem",
              }}
            >
              Bespoke yacht charters and private aviation transfers across the world's most
              extraordinary waters. Curated for those who demand perfection without effort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#0d1b2a",
                  background: "#c9a84c",
                  border: "none",
                  padding: "1rem 2.5rem",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                Plan Your Voyage <ArrowRight size={14} />
              </button>
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "rgba(240,236,224,0.8)",
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.3)",
                  padding: "1rem 2.5rem",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                View Fleet
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "rgba(240,236,224,0.4)", letterSpacing: 3, textTransform: "uppercase" }}>
            Scroll
          </p>
          <div style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
            <ChevronDown size={16} style={{ color: "#c9a84c" }} />
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ── */}
      <section
        ref={statsRef}
        style={{
          background: "linear-gradient(135deg, #070f1a 0%, #0d1b2a 50%, #0a1520 100%)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
          }}
        >
          {stats.map((stat, i) => (
            <CounterStat key={stat.label} stat={stat} triggered={statsInView} />
          ))}
        </div>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 9,
            color: "rgba(240,236,224,0.2)",
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          Figures updated in real time · Est. Monaco 1997
        </p>
      </section>

      {/* ── DESTINATIONS (CLIP-PATH REVEAL) ── */}
      <section
        style={{
          background: "#0a1520",
          padding: "7rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: 32, height: 1, background: "#c9a84c" }} />
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase" }}>
                  Private Destinations
                </p>
              </div>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2.5rem, 5vw, 5rem)",
                  fontWeight: 300,
                  color: "#f0ece0",
                  lineHeight: 1.1,
                  maxWidth: 600,
                }}
              >
                Curated anchorages,
                <br />
                <em style={{ fontStyle: "italic", color: "#c9a84c" }}>reserved for you alone.</em>
              </h2>
            </div>
          </Reveal>

          {/* Destination grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "auto auto",
              gap: "1rem",
            }}
          >
            {/* Large card */}
            <div style={{ gridColumn: "1 / 3", gridRow: "1 / 2", minHeight: 500 }}>
              <DestinationCard dest={destinations[0]} index={0} />
            </div>
            {/* Tall right */}
            <div style={{ gridColumn: "3 / 4", gridRow: "1 / 3", minHeight: 500 }}>
              <DestinationCard dest={destinations[1]} index={1} />
            </div>
            {/* Bottom left 3 */}
            <div style={{ minHeight: 280 }}>
              <DestinationCard dest={destinations[2]} index={2} />
            </div>
            <div style={{ minHeight: 280 }}>
              <DestinationCard dest={destinations[3]} index={3} />
            </div>
            <div style={{ gridColumn: "1 / 3", minHeight: 280, display: "none" }}>
              <DestinationCard dest={destinations[4]} index={4} />
            </div>
          </div>

          {/* View all link */}
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#c9a84c",
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.3)",
                  padding: "0.85rem 2.5rem",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                All 87 Destinations <ArrowRight size={12} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BESPOKE EXPERIENCE ── */}
      <section
        style={{
          background: "#0d1b2a",
          padding: "7rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}
          viewBox="0 0 1280 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="600" stroke="#c9a84c" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 60} x2="1280" y2={i * 60} stroke="#c9a84c" strokeWidth="0.5" />
          ))}
        </svg>

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6rem",
              alignItems: "center",
            }}
          >
            {/* Left text */}
            <div>
              <Reveal>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 32, height: 1, background: "#c9a84c" }} />
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase" }}>
                    The Horizon Standard
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: 300,
                    color: "#f0ece0",
                    lineHeight: 1.2,
                    marginBottom: "2rem",
                  }}
                >
                  Every voyage is authored
                  <br />
                  <em style={{ fontStyle: "italic", color: "#c9a84c" }}>specifically for you.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(240,236,224,0.6)",
                    lineHeight: 1.9,
                    marginBottom: "2rem",
                  }}
                >
                  We begin where standard charters end. A dedicated voyage architect coordinates
                  every element — vessel selection, crew briefing, shore excursions, Michelin-level
                  provisioning, helicopter transfers. Nothing is left to chance or to you.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(240,236,224,0.6)",
                    lineHeight: 1.9,
                    marginBottom: "3rem",
                  }}
                >
                  Our fleet spans 18 to 92 metres. Our crew-to-guest ratios exceed any industry
                  standard. Our chefs hold stars. Our captains hold records.
                </p>
              </Reveal>

              {/* Services list */}
              {[
                "Private aviation coordination & helipad arrivals",
                "Onboard Michelin-starred culinary programmes",
                "Submarine, tender & water sport fleet included",
                "Medical officer & security detail on request",
                "Art, museum & government access facilitation",
              ].map((service, i) => (
                <Reveal key={service} delay={0.35 + i * 0.06}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        background: "#c9a84c",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        color: "rgba(240,236,224,0.7)",
                        fontWeight: 300,
                      }}
                    >
                      {service}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Right — visual panel */}
            <Reveal delay={0.15}>
              <div style={{ position: "relative" }}>
                {/* Main panel */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #0a1520 0%, #1a2d42 100%)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    padding: "3rem",
                    position: "relative",
                  }}
                >
                  {/* Corner accents */}
                  {[
                    { top: -1, left: -1, borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" },
                    { top: -1, right: -1, borderTop: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" },
                    { bottom: -1, left: -1, borderBottom: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" },
                    { bottom: -1, right: -1, borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" },
                  ].map((style, i) => (
                    <div key={i} style={{ position: "absolute", width: 20, height: 20, ...style }} />
                  ))}

                  {/* Compass decoration */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
                    <CompassRose />
                  </div>

                  {/* Key spec rows */}
                  {[
                    ["Fleet Range", "18m — 92m"],
                    ["Cruising Area", "Worldwide"],
                    ["Minimum Charter", "7 nights"],
                    ["Crew Ratio", "1.5 : 1"],
                    ["Response Time", "< 4 hours"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.85rem 0",
                        borderBottom: "1px solid rgba(201,168,76,0.1)",
                      }}
                    >
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "rgba(240,236,224,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>
                        {label}
                      </p>
                      <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.2rem", fontWeight: 400, color: "#f0ece0", letterSpacing: 1 }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Floating badge */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#c9a84c",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "floatY 6s ease-in-out infinite",
                  }}
                >
                  <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "#0d1b2a", lineHeight: 1 }}>28</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 7, fontWeight: 600, color: "#0d1b2a", letterSpacing: 1, textTransform: "uppercase" }}>Years</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section
        ref={timelineRef}
        style={{
          background: "#070f1a",
          padding: "7rem 2rem",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase" }}>
                  Sample Voyage
                </p>
                <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  color: "#f0ece0",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                }}
              >
                Monaco to Ibiza
              </h2>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(240,236,224,0.4)", letterSpacing: 2 }}>
                15 nights · 1,840 nautical miles · aboard M/Y Lumière
              </p>
            </div>
          </Reveal>

          {/* Waypoints */}
          <div style={{ position: "relative" }}>
            {voyageWaypoints.map((wp, i) => (
              <WaypointItem
                key={wp.port}
                wp={wp}
                index={i}
                activeIndex={activeWaypoint}
              />
            ))}
          </div>

          <Reveal>
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#0d1b2a",
                  background: "#c9a84c",
                  border: "none",
                  padding: "1rem 2.5rem",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                Design My Voyage <ArrowRight size={13} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d1b2a 0%, #0a1520 100%)",
          padding: "7rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase" }}>
                  Client Reflections
                </p>
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  color: "#f0ece0",
                }}
              >
                Words from those who know.
              </h2>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.15)",
                padding: "4rem",
                position: "relative",
                textAlign: "center",
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "8rem",
                  color: "rgba(201,168,76,0.08)",
                  position: "absolute",
                  top: "-1rem",
                  left: "2rem",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                "
              </div>

              {/* Stars */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: "2rem" }}>
                {Array.from({ length: testimonials[activeTestimonial].stars }, (_, i) => (
                  <Star key={i} size={14} style={{ color: "#c9a84c", fill: "#c9a84c" }} />
                ))}
              </div>

              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#f0ece0",
                  lineHeight: 1.7,
                  marginBottom: "2.5rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                "{testimonials[activeTestimonial].text}"
              </p>

              <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "1.5rem" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, color: "#f0ece0", letterSpacing: 2, marginBottom: 4 }}>
                  {testimonials[activeTestimonial].name}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "rgba(240,236,224,0.4)", letterSpacing: 1 }}>
                  {testimonials[activeTestimonial].title}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 2, marginTop: 4 }}>
                  {testimonials[activeTestimonial].yacht}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: "2rem" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? 32 : 8,
                  height: 2,
                  background: i === activeTestimonial ? "#c9a84c" : "rgba(201,168,76,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ENQUIRY ── */}
      <section
        style={{
          background: "#070f1a",
          padding: "7rem 2rem",
          borderTop: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase" }}>
                  Begin Your Journey
                </p>
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  color: "#f0ece0",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                }}
              >
                Private enquiry
              </h2>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(240,236,224,0.5)", lineHeight: 1.8 }}>
                Your voyage architect will respond within 4 hours. All enquiries are treated
                with complete discretion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.15)",
                padding: "3.5rem",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "Full Name", placeholder: "Your name", type: "text" },
                  { label: "Email Address", placeholder: "your@email.com", type: "email" },
                  { label: "Preferred Destination", placeholder: "e.g. Mediterranean", type: "text" },
                  { label: "Desired Duration", placeholder: "e.g. 10 nights", type: "text" },
                ].map((field) => (
                  <div key={field.label}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 9,
                        fontWeight: 600,
                        color: "rgba(240,236,224,0.5)",
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(201,168,76,0.15)",
                        padding: "0.85rem 1rem",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        color: "#f0ece0",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.5)";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.15)";
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Vessel preference */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    fontWeight: 600,
                    color: "rgba(240,236,224,0.5)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  Vessel Type Preference
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {["Motor Yacht", "Sailing Yacht", "Catamaran", "Explorer Yacht", "No Preference"].map((type) => (
                    <label
                      key={type}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        color: "rgba(240,236,224,0.6)",
                        fontWeight: 300,
                      }}
                    >
                      <input type="radio" name="vesselType" style={{ accentColor: "#c9a84c" }} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    fontWeight: 600,
                    color: "rgba(240,236,224,0.5)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  Additional Requirements
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your ideal voyage — guest count, special occasions, dietary requirements, activity preferences..."
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    padding: "0.85rem 1rem",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    color: "#f0ece0",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,168,76,0.5)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,168,76,0.15)";
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0d1b2a",
                  background: "#c9a84c",
                  border: "none",
                  padding: "1.1rem",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                Submit Private Enquiry <ArrowRight size={14} />
              </button>

              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 9,
                  color: "rgba(240,236,224,0.3)",
                  textAlign: "center",
                  marginTop: "1.25rem",
                  letterSpacing: 1,
                }}
              >
                Your information is held in strict confidence and never shared with third parties.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#030810",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          padding: "5rem 2rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "4rem",
              marginBottom: "5rem",
            }}
          >
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(201,168,76,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(45deg)",
                  }}
                >
                  <Anchor size={14} style={{ color: "#c9a84c", transform: "rotate(-45deg)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.2rem", color: "#f0ece0", letterSpacing: 2, textTransform: "uppercase" }}>
                    Horizon Maritime
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(240,236,224,0.4)", lineHeight: 1.8, maxWidth: 280 }}>
                Crafting extraordinary maritime experiences since 1997. Monaco — Geneva — Singapore.
              </p>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <a href="#" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "#c9a84c", letterSpacing: 2, textDecoration: "none" }}>
                  Instagram
                </a>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
                <a href="#" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "#c9a84c", letterSpacing: 2, textDecoration: "none" }}>
                  LinkedIn
                </a>
              </div>
            </div>

            {[
              {
                title: "Services",
                links: ["Yacht Charter", "Private Aviation", "Villa Collection", "Expedition Yachts", "Corporate Charter"],
              },
              {
                title: "Destinations",
                links: ["Mediterranean", "Caribbean", "Indian Ocean", "Pacific", "Arctic & Antarctic"],
              },
              {
                title: "Company",
                links: ["About Horizon", "Our Fleet", "Charter Brokers", "Press", "Careers"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#c9a84c",
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    marginBottom: "1.5rem",
                  }}
                >
                  {col.title}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link} style={{ marginBottom: "0.75rem" }}>
                      <Link
                        href="#"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 300,
                          color: "rgba(240,236,224,0.45)",
                          textDecoration: "none",
                        }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact bar */}
          <div
            style={{
              borderTop: "1px solid rgba(201,168,76,0.1)",
              paddingTop: "2rem",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <a
                href="tel:+33123456789"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
              >
                <Phone size={12} style={{ color: "#c9a84c" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(240,236,224,0.5)" }}>
                  +33 1 23 45 67 89
                </span>
              </a>
              <a
                href="mailto:voyages@horizonmaritime.com"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
              >
                <Mail size={12} style={{ color: "#c9a84c" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(240,236,224,0.5)" }}>
                  voyages@horizonmaritime.com
                </span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={12} style={{ color: "#c9a84c" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(240,236,224,0.5)" }}>
                  Port Hercules, Monaco
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(201,168,76,0.06)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "rgba(240,236,224,0.25)", letterSpacing: 1 }}>
              © 2026 Horizon Maritime Group S.A.M. · All rights reserved · Monaco
            </p>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["Privacy Policy", "Terms of Charter", "Cookie Policy"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "rgba(240,236,224,0.25)", textDecoration: "none", letterSpacing: 1 }}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
