"use client";
// @ts-nocheck

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

// ─── Types ──────────────────────────────────────────────────────────────────

interface GoldParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

interface ProductCard {
  name: string;
  image: string;
  subtitle: string;
  material: string;
  price: string;
  category: string;
  color: string;
}

interface MagneticCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// ─── Gold Particles ──────────────────────────────────────────────────────────

function GoldParticles({ scrollY }: { scrollY: number }) {
  const [particles] = useState<GoldParticle[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 300,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.35 + 0.05,
      delay: Math.random() * 4,
    }))
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #d4af6b 0%, #c8963a 60%, transparent 100%)",
            opacity: p.opacity,
            transform: `translateY(${-scrollY * p.speed}px)`,
            transition: "transform 0.1s linear",
            animation: `float-particle ${3 + p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          from { transform: translateY(var(--ty, 0px)) translateX(0px); }
          to { transform: translateY(calc(var(--ty, 0px) - 12px)) translateX(4px); }
        }
        @keyframes jewel-spin {
          to { transform: rotateY(360deg); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px #d4af6b22; }
          50% { box-shadow: 0 0 40px #d4af6b44, 0 0 80px #d4af6b11; }
        }
      `}</style>
    </div>
  );
}

// ─── 3D Jewel SVG ────────────────────────────────────────────────────────────

function RotatingJewel({ rotationSpeed }: { rotationSpeed: number }) {
  const jewel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jewel.current) return;
    jewel.current.style.setProperty(
      "--rotation-speed",
      `${rotationSpeed}s`
    );
  }, [rotationSpeed]);

  return (
    <div
      ref={jewel}
      style={{
        width: 220,
        height: 220,
        perspective: 800,
        perspectiveOrigin: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          animation: `jewel-spin var(--rotation-speed, 8s) linear infinite`,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Outer ring */}
        <svg
          viewBox="0 0 180 180"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 0 20px #d4af6b88)",
          }}
        >
          <defs>
            <radialGradient id="goldGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f5e6b8" />
              <stop offset="40%" stopColor="#d4af6b" />
              <stop offset="100%" stopColor="#8b6914" />
            </radialGradient>
            <radialGradient id="diamondGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#e8f4ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a0c4ff" stopOpacity="0.3" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer band */}
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="8"
            filter="url(#glow)"
          />
          {/* Inner band */}
          <circle
            cx="90"
            cy="90"
            r="62"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          {/* Setting prongs */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 90 + 62 * Math.cos(rad);
            const y1 = 90 + 62 * Math.sin(rad);
            const x2 = 90 + 75 * Math.cos(rad);
            const y2 = 90 + 75 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#goldGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
          {/* Engraved facets on band */}
          {[30, 90, 150, 210, 270, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 90 + 72 * Math.cos(rad);
            const y = 90 + 72 * Math.sin(rad);
            return (
              <circle
                key={angle}
                cx={x}
                cy={y}
                r="4"
                fill="url(#goldGrad)"
                filter="url(#glow)"
              />
            );
          })}
          {/* Central diamond — brilliant cut top view */}
          <polygon
            points="90,52 114,75 114,105 90,128 66,105 66,75"
            fill="url(#diamondGrad)"
            stroke="#d4af6b"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          {/* Diamond facets */}
          <line x1="90" y1="52" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <line x1="114" y1="75" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <line x1="114" y1="105" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <line x1="90" y1="128" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <line x1="66" y1="105" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <line x1="66" y1="75" x2="90" y2="90" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          {/* Center sparkle */}
          <circle cx="90" cy="90" r="5" fill="white" opacity="0.9" filter="url(#glow)" />
          <line x1="90" y1="80" x2="90" y2="100" stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1="80" y1="90" x2="100" y2="90" stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1="83" y1="83" x2="97" y2="97" stroke="white" strokeWidth="0.6" opacity="0.5" />
          <line x1="97" y1="83" x2="83" y2="97" stroke="white" strokeWidth="0.6" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

// ─── Magnetic Card ────────────────────────────────────────────────────────────

function MagneticCard({ children, style }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 8;
      setOffset({
        x: (dx / dist) * strength,
        y: (dy / dist) * strength,
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Clip-Path Reveal Image ──────────────────────────────────────────────────

function ClipRevealImage({
  color,
  image,
  label,
  inView: revealed,
  delay = 0,
}: {
  color: string;
  image?: string;
  label: string;
  inView: boolean;
  delay?: number;
}) {
  const [clipped, setClipped] = useState(
    "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)"
  );

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => {
        setClipped("polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)");
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [revealed, delay]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        background: color,
        borderRadius: 4,
        clipPath: clipped,
        transition: "clip-path 0.9s cubic-bezier(0.77, 0, 0.18, 1)",
        display: "flex",
        alignItems: "flex-end",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {image && (
        <img
          src={image}
          alt={label}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s ease",
          }}
          className="hover:scale-105"
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.2) 60%, transparent 100%)" }} />
      {/* Shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg, transparent 30%, rgba(212,175,107,0.15) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        }}
      />
      <span
        style={{
          color: "#f0ece0",
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          position: "relative",
          zIndex: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Scroll-Scrubbed Product Card ─────────────────────────────────────────────

function ProductRevealCard({
  product,
  index,
  scrollProgress,
}: {
  product: ProductCard;
  index: number;
  scrollProgress: number;
}) {
  const threshold = 0.08 + index * 0.09;
  const revealed = scrollProgress > threshold;
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: false, margin: "-40px" });

  const scale = revealed ? 1 : 0.82;
  const opacity = revealed ? 1 : 0;
  const translateY = revealed ? 0 : 60;

  return (
    <MagneticCard>
      <motion.div
        ref={cardRef}
        style={{
          opacity,
          scale,
          y: translateY,
          transition: `all 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`,
          animation: revealed ? `float-card ${3 + index * 0.4}s ease-in-out infinite` : "none",
          animationDelay: `${index * 0.3}s`,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(212,175,107,0.12)",
            borderRadius: 8,
            padding: 0,
            overflow: "hidden",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(212,175,107,0.45)";
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 40px rgba(212,175,107,0.12), 0 20px 60px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(212,175,107,0.12)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* Image zone with clip-path reveal */}
          <ClipRevealImage
            color={product.color}
            image={product.image}
            label={product.category}
            inView={revealed && inView}
            delay={index * 0.1}
          />

          {/* Info */}
          <div style={{ padding: "20px 24px 24px" }}>
            <p
              style={{color: brand ?? '#d4af6b',
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}
            >
              {product.category}
            </p>
            <h3
              style={{
                color: "#f0ece0",
                fontSize: 18,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "0.04em",
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </h3>
            <p
              style={{
                color: "rgba(240,236,224,0.38)",
                fontSize: 11,
                letterSpacing: "0.15em",
                marginBottom: 16,
              }}
            >
              {product.material}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{color: brand ?? '#d4af6b',
                  fontSize: 17,
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.05em",
                }}
              >
                {product.price}
              </span>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,107,0.3)",
                  borderRadius: 2,
                  color: "rgba(212,175,107,0.7)",
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "#d4af6b";
                  btn.style.color = "#0a0806";
                  btn.style.borderColor = "#d4af6b";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "transparent";
                  btn.style.color = "rgba(212,175,107,0.7)";
                  btn.style.borderColor = "rgba(212,175,107,0.3)";
                }}
              >
                Découvrir
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </MagneticCard>
  );
}

// ─── Section Reveal Wrapper ───────────────────────────────────────────────────

function SectionReveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1.1,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS: ProductCard[] = [
  {
    name: "Solitaire Éternité",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    subtitle: "La pureté absolue",
    material: "Or blanc 18k · Diamant 1.2ct F/VS1",
    price: "12 400 €",
    category: "Bagues",
    color: "linear-gradient(145deg, #1a1612 0%, #2c2418 60%, #1a1612 100%)",
  },
  {
    name: "Collier Aube Dorée",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    subtitle: "Lumière sur la peau",
    material: "Or jaune 18k · Diamants 0.85ct total",
    price: "8 750 €",
    category: "Colliers",
    color: "linear-gradient(145deg, #161210 0%, #241c10 60%, #161210 100%)",
  },
  {
    name: "Bracelet Rivière",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    subtitle: "Un fleuve de lumière",
    material: "Platine 950 · Diamants 2.4ct",
    price: "18 200 €",
    category: "Bracelets",
    color: "linear-gradient(145deg, #111418 0%, #18202a 60%, #111418 100%)",
  },
  {
    name: "Boucles Célestes",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    subtitle: "La grâce à l'oreille",
    material: "Or rose 18k · Perles Akoya & Brillants",
    price: "5 900 €",
    category: "Boucles",
    color: "linear-gradient(145deg, #181210 0%, #261a14 60%, #181210 100%)",
  },
  {
    name: "Chevalière Crest",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    subtitle: "Héritage gravé",
    material: "Or jaune 22k · Gravure à la main",
    price: "3 200 €",
    category: "Chevalières",
    color: "linear-gradient(145deg, #141210 0%, #201a0e 60%, #141210 100%)",
  },
  {
    name: "Parure Impériale",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    subtitle: "L'ensemble souverain",
    material: "Or blanc 18k · Saphirs & Diamants",
    price: "34 000 €",
    category: "Parures",
    color: "linear-gradient(145deg, #101218 0%, #161a28 60%, #101218 100%)",
  },
];

const MATERIALS = [
  {
    title: "Or 18 carats",
    desc: "Chaque alliage est fondu en interne, testé à 750/1000, contrôlé sous loupe ×40 avant toute mise en forme.",
    icon: "◈",
  },
  {
    title: "Diamants certifiés GIA",
    desc: "Nous ne sélectionnons que des pierres avec rapport GIA individuel. Couleur D–H, pureté IF–VS2.",
    icon: "◇",
  },
  {
    title: "Platine 950",
    desc: "Métal noble, 30 fois plus rare que l'or. Hypoallergénique, inoxydable, il gagne en beauté avec les années.",
    icon: "◆",
  },
  {
    title: "Pierres de couleur",
    desc: "Saphirs Kashmir, rubis Birmanie, émeraudes Colombie — sourcés directement avec traçabilité éthique complète.",
    icon: "◉",
  },
];

const LOOKBOOK = [
  { title: "Printemps 2025", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", items: 8 },
  { title: "Édition Nuit", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", items: 5 },
  { title: "Sur Mesure", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", items: "∞" },
];

// ─── Lookbook Card (extracted to respect Rules of Hooks) ─────────────────────

interface LookbookItem {
  title: string;
  image: string;
  items: number | string;
}

function LookbookCard({
  lb,
  index,
}: {
  lb: LookbookItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [clipPath, setClipPath] = useState(
    "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)"
  );

  useEffect(() => {
    if (inView) {
      const t = setTimeout(
        () => setClipPath("polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"),
        index * 150
      );
      return () => clearTimeout(t);
    }
  }, [inView, index]);

  return (
    <MagneticCard>
      <div
        ref={ref}
        style={{
          height: "100%",
          background: "linear-gradient(145deg, #111 0%, #1c1c1c 100%)",
          borderRadius: 6,
          clipPath,
          transition: "clip-path 1.1s cubic-bezier(0.77,0,0.18,1)",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          border: "1px solid rgba(212,175,107,0.08)",
        }}
      >
        {lb.image && lb.image.startsWith("http") && (
          <img
            src={lb.image}
            alt={lb.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
              transition: "transform 0.7s ease",
            }}
          />
        )}
        {/* Pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(212,175,107,0.015) 0px,
              rgba(212,175,107,0.015) 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(110deg, transparent 30%, rgba(212,175,107,0.08) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 5s linear infinite",
            animationDelay: `${index * 0.8}s`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 28px 28px",
            background: "linear-gradient(transparent, rgba(10,8,6,0.9))",
          }}
        >
          <p
            style={{
              color: "rgba(212,175,107,0.5)",
              fontSize: 9,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
              marginBottom: 6,
            }}
          >
            {lb.items} pièces
          </p>
          <h3
            style={{
              color: "#f0ece0",
              fontSize: 22,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}
          >
            {lb.title}
          </h3>
        </div>
      </div>
    </MagneticCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ActivePage =
  | "home"
  | "collections"
  | "atelier"
  | "savoir-faire"
  | "lookbook"
  | "contact"
  | "mentions"
  | "cgv"
  | "privacy";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LuxuryJewelryTemplate() {
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

  const [page, setPage] = useState<ActivePage>("home");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(8);
  const [productScrollProgress, setProductScrollProgress] = useState(0);

  const goTo = (p: ActivePage) => {
    setPage(p);
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "24%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const progressBarScale = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
  });

  // Scroll listener — particles + jewel speed + product scroll progress
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);

      // Jewel spins faster as user scrolls — max speed 1.5s, resting 8s
      const maxScroll = 600;
      const ratio = Math.min(sy / maxScroll, 1);
      setRotationSpeed(8 - ratio * 6.5); // 8s → 1.5s

      // Product section scroll progress
      if (productSectionRef.current) {
        const rect = productSectionRef.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        const sectionH = productSectionRef.current.offsetHeight;
        const entered = windowH - rect.top;
        const progress = Math.max(0, Math.min(1, entered / (sectionH + windowH)));
        setProductScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    
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
return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setEmailSubmitted(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0806",
        color: "#f0ece0",
        fontFamily: "Georgia, 'Times New Roman', serif",
        overflowX: "clip",
        position: "relative",
      }}
    >
      {/* Gold particles (parallax depth layer) */}
      <GoldParticles scrollY={scrollY} />

      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, #8b6914, #d4af6b, #f5e6b8, #d4af6b)",
          transformOrigin: "left",
          scaleX: progressBarScale,
          zIndex: 100,
        }}
      />

      {/* ── Navigation ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(10,8,6,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,175,107,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            onClick={() => goTo("home")}
            style={{color: brand ?? '#d4af6b',
              fontSize: 22,
              fontFamily: "Georgia, serif",
              letterSpacing: "0.22em",
              fontStyle: "italic",
              background: "linear-gradient(90deg, #d4af6b, #f5e6b8, #d4af6b)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
              cursor: "pointer",
            }}
          >
            MAISON ÉLARA
          </div>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              gap: 40,
              alignItems: "center",
            }}
            className="hidden-mobile"
          >
            {[
              { label: "Collections", key: "collections" as const },
              { label: "Atelier", key: "atelier" as const },
              { label: "Savoir-faire", key: "savoir-faire" as const },
              { label: "Lookbook", key: "lookbook" as const },
              { label: "Contact", key: "contact" as const },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => goTo(key)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: page === key ? "#d4af6b" : "rgba(240,236,224,0.38)",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#d4af6b")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    page === key ? "#d4af6b" : "rgba(240,236,224,0.38)")
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* RHS */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button
              onClick={() => goTo("contact")}
              style={{background: "transparent",
                border: "1px solid rgba(212,175,107,0.3)",
                borderRadius: 2,
                color: brand ?? '#d4af6b',
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                display: "none",
              }}
              className="nav-cta"
            >
              Rendez-vous
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: i === 1 ? 16 : 22,
                    height: 1,
                    background: "rgba(240,236,224,0.6)",
                    transition: "width 0.3s ease",
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "#0a0806",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 56,
              }}
            >
              <span
                onClick={() => {
                  setMobileOpen(false);
                  goTo("home");
                }}
                style={{color: brand ?? '#d4af6b',
                  fontSize: 20,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                }}
              >
                MAISON ÉLARA
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(240,236,224,0.6)",
                  fontSize: 24,
                  cursor: "pointer",
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                }}
              >
                ×
              </button>
            </div>
            {[
              { label: "Collections", key: "collections" as const },
              { label: "Atelier", key: "atelier" as const },
              { label: "Savoir-faire", key: "savoir-faire" as const },
              { label: "Lookbook", key: "lookbook" as const },
              { label: "Contact", key: "contact" as const },
            ].map(({ label, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    goTo(key);
                  }}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    color: page === key ? "#d4af6b" : "#f0ece0",
                    fontSize: 32,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    letterSpacing: "0.06em",
                    marginBottom: 28,
                    transition: "color 0.3s ease",
                  }}
                >
                  {label}
                </button>
              </motion.div>
            ))}
            <div style={{ marginTop: "auto" }}>
              <p
                style={{
                  color: "rgba(212,175,107,0.5)",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                }}
              >
                Paris · Depuis 1947
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {page === "home" && (
        <>
          {/* ── HERO ── */}
          <section id="hero"
            ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background gradient layers */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroY,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(212,175,107,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 40% 40% at 30% 30%, rgba(212,175,107,0.04) 0%, transparent 60%)",
            }}
          />
          {/* Horizontal lines */}
          {[20, 45, 70].map((pct) => (
            <div
              key={pct}
              style={{
                position: "absolute",
                top: `${pct}%`,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,107,0.06), transparent)",
              }}
            />
          ))}
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            position: "relative",
            zIndex: 10,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 40px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          {/* Left content */}
          <div style={{ flex: 1, maxWidth: 580 }}>
            <SectionReveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, #d4af6b)",
                  }}
                />
                <span
                  style={{color: brand ?? '#d4af6b',
                    fontSize: 10,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Paris · Maison fondée en 1947
                </span>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <h1
                style={{
                  fontSize: "clamp(52px, 6vw, 88px)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.04,
                  letterSpacing: "-0.01em",
                  color: "#f0ece0",
                  marginBottom: 24,
                }}
              >{c?.heroHeadline ?? <>
                L'art du
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #d4af6b 0%, #f5e6b8 45%, #d4af6b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "block",
                  }}
                >
                  bijou éternel
                </span>
              </>}</h1>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <p
                style={{
                  color: "rgba(240,236,224,0.5)",
                  fontSize: 16,
                  lineHeight: 1.8,
                  letterSpacing: "0.03em",
                  maxWidth: 420,
                  marginBottom: 48,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >{c?.heroSubline ?? fd?.tagline ?? <>
                Chaque pièce naît d'un dialogue entre la lumière et la matière.
                Façonnée à la main par nos maîtres joailliers, elle porte une
                histoire qui traverse les générations.
              </>}</p>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button
                  onClick={() => goTo("collections")}
                  style={{
                    background:
                      "linear-gradient(135deg, #d4af6b, #b8963a)",
                    border: "none",
                    borderRadius: 2,
                    color: "#0a0806",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    padding: "16px 36px",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    fontWeight: 700,
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 32px rgba(212,175,107,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 12px 48px rgba(212,175,107,0.45)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 32px rgba(212,175,107,0.25)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  Explorer les collections
                </button>
                <button
                  onClick={() => goTo("contact")}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(212,175,107,0.25)",
                    borderRadius: 2,
                    color: "rgba(240,236,224,0.7)",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    padding: "16px 36px",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(212,175,107,0.6)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#d4af6b";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(212,175,107,0.25)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(240,236,224,0.7)";
                  }}
                >
                  Prendre rendez-vous
                </button>
              </div>
            </SectionReveal>

            {/* Stats */}
            <SectionReveal delay={0.45}>
              <div
                style={{
                  display: "flex",
                  gap: 40,
                  marginTop: 60,
                  paddingTop: 32,
                  borderTop: "1px solid rgba(212,175,107,0.1)",
                }}
              >
                {[
                  { n: "78+", l: "Années d'excellence" },
                  { n: "4 200", l: "Pièces créées" },
                  { n: "GIA", l: "Certifiées" },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <p
                      style={{color: brand ?? '#d4af6b',
                        fontSize: 24,
                        fontFamily: "Georgia, serif",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}
                    >
                      {n}
                    </p>
                    <p
                      style={{
                        color: "rgba(240,236,224,0.35)",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right — rotating jewel */}
          <SectionReveal delay={0.2} style={{ flex: "0 0 auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <RotatingJewel rotationSpeed={rotationSpeed} />
              <p
                style={{
                  color: "rgba(212,175,107,0.4)",
                  fontSize: 9,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  textAlign: "center",
                }}
              >
                Solitaire · Or blanc 18k
              </p>
              {/* Speed indicator */}
              <div
                style={{
                  width: 80,
                  height: 1,
                  background: "rgba(212,175,107,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${((8 - rotationSpeed) / 6.5) * 100}%`,
                    background:
                      "linear-gradient(90deg, transparent, #d4af6b)",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
            </div>
          </SectionReveal>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 10,
          }}
        >
          <p
            style={{
              color: "rgba(212,175,107,0.4)",
              fontSize: 9,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            Défiler
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(180deg, rgba(212,175,107,0.6), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <section
        style={{
          padding: "18px 0",
          background:
            "linear-gradient(90deg, #1a1108, rgba(212,175,107,0.08), #1a1108)",
          borderTop: "1px solid rgba(212,175,107,0.15)",
          borderBottom: "1px solid rgba(212,175,107,0.15)",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        >
          {Array.from({ length: 8 }).flatMap((_, i) =>
            [
              "Haute Joaillerie",
              "✦",
              "Or 18 Carats",
              "✦",
              "Diamants Certifiés GIA",
              "✦",
              "Platine 950",
              "✦",
              "Sur Mesure",
              "✦",
            ].map((t, j) => (
              <span
                key={`${i}-${j}`}
                style={{
                  color:
                    t === "✦"
                      ? "rgba(212,175,107,0.6)"
                      : "rgba(240,236,224,0.35)",
                  fontSize: 10,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                }}
              >
                {t}
              </span>
            ))
          )}
        </motion.div>
      </section>

      {/* ── PRODUCT SHOWCASE (scroll-scrubbed reveal) ── */}
      <section
        ref={productSectionRef}
        style={{
          padding: "120px 40px",
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <SectionReveal>
          <div style={{ marginBottom: 72, textAlign: "center" }}>
            <p
              style={{
                color: "rgba(212,175,107,0.6)",
                fontSize: 10,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                marginBottom: 16,
              }}
            >
              Collection Permanente
            </p>
            <h2
              style={{
                color: "#f0ece0",
                fontSize: "clamp(36px, 4vw, 60px)",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "0.03em",
                lineHeight: 1.15,
              }}
            >
              Pièces d'exception
            </h2>
            <div
              style={{
                width: 48,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #d4af6b, transparent)",
                margin: "24px auto 0",
              }}
            />
          </div>
        </SectionReveal>

        {/* 6-card grid with scroll-scrubbed stagger */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {PRODUCTS.map((product, i) => (
            <ProductRevealCard
              key={product.name}
              product={product}
              index={i}
              scrollProgress={productScrollProgress}
            />
          ))}
        </div>
      </section>

      {/* ── MATERIALS / CRAFTSMANSHIP ── */}
      <section
        style={{
          padding: "120px 40px",
          background: "#080604",
          borderTop: "1px solid rgba(212,175,107,0.06)",
          borderBottom: "1px solid rgba(212,175,107,0.06)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "100%",
            background:
              "radial-gradient(ellipse 100% 50% at 50% 50%, rgba(212,175,107,0.03) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionReveal>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 72,
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              <div>
                <p
                  style={{
                    color: "rgba(212,175,107,0.6)",
                    fontSize: 10,
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                    marginBottom: 14,
                  }}
                >
                  Matières Premières
                </p>
                <h2
                  style={{
                    color: "#f0ece0",
                    fontSize: "clamp(32px, 3.5vw, 52px)",
                    fontFamily: "Georgia, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    letterSpacing: "0.03em",
                    lineHeight: 1.2,
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  Un savoir-faire
                  <br />
                  sans compromis
                </>}</h2>
              </div>
              <p
                style={{
                  color: "rgba(240,236,224,0.4)",
                  fontSize: 14,
                  lineHeight: 1.9,
                  maxWidth: 360,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >{c?.aboutText ?? <>
                Depuis 1947, chaque gramme de métal et chaque pierre sont
                sélectionnés avec une rigueur absolue. Rien n'entre dans notre
                atelier qui ne soit digne du meilleur.
              </>}</p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
            }}
          >
            {MATERIALS.map((m, i) => (
              <SectionReveal key={m.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "40px 32px",
                    borderLeft: "1px solid rgba(212,175,107,0.1)",
                    transition: "background 0.4s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(212,175,107,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                  }}
                >
                  <span
                    style={{display: "block",
                      color: brand ?? '#d4af6b',
                      fontSize: 28,
                      marginBottom: 24,
                      opacity: 0.7,
                    }}
                  >
                    {m.icon}
                  </span>
                  <h3
                    style={{
                      color: "#f0ece0",
                      fontSize: 20,
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      letterSpacing: "0.04em",
                      marginBottom: 14,
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(240,236,224,0.38)",
                      fontSize: 13,
                      lineHeight: 1.8,
                      letterSpacing: "0.01em",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {m.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ── */}
      <section
        style={{
          padding: "120px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p
                style={{
                  color: "rgba(212,175,107,0.6)",
                  fontSize: 10,
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  marginBottom: 14,
                }}
              >
                Lookbook
              </p>
              <h2
                style={{
                  color: "#f0ece0",
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  fontFamily: "Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "0.03em",
                }}
              >
                Instants de grâce
              </h2>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              gap: 16,
              height: 560,
            }}
          >
            {LOOKBOOK.map((lb, i) => (
              <LookbookCard key={lb.title} lb={lb} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ATELIER STORY ── */}
      <section
        style={{
          padding: "120px 40px",
          background: "#070503",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        {/* Decorative lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 1,
            height: "100%",
            background:
              "linear-gradient(180deg, transparent, rgba(212,175,107,0.08), transparent)",
          }}
        />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "center",
            }}
          >
            {/* Left — story */}
            <div>
              <SectionReveal>
                <p
                  style={{
                    color: "rgba(212,175,107,0.6)",
                    fontSize: 10,
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                    marginBottom: 20,
                  }}
                >
                  Notre Atelier
                </p>
              </SectionReveal>
              <SectionReveal delay={0.08}>
                <h2
                  style={{
                    color: "#f0ece0",
                    fontSize: "clamp(34px, 3.5vw, 52px)",
                    fontFamily: "Georgia, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    lineHeight: 1.2,
                    letterSpacing: "0.03em",
                    marginBottom: 32,
                  }}
                >
                  Là où la pierre
                  <br />
                  rencontre la lumière
                </h2>
              </SectionReveal>
              {[
                "Notre atelier du 1er arrondissement abrite douze maîtres joailliers. Chacun a été formé pendant sept années minimum avant de toucher un diamant.",
                "Nous n'utilisons aucune machine pour la finition. Chaque griffure, chaque galerie, chaque poli est le fruit de mains expertes et d'un regard affûté par des décennies d'expérience.",
                "Un solitaire Élara nécessite en moyenne 160 heures de travail. C'est cette lenteur délibérée qui crée l'éternité.",
              ].map((para, i) => (
                <SectionReveal key={i} delay={0.15 + i * 0.1}>
                  <p
                    style={{
                      color: "rgba(240,236,224,0.45)",
                      fontSize: 15,
                      lineHeight: 1.9,
                      letterSpacing: "0.02em",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      marginBottom: 20,
                    }}
                  >
                    {para}
                  </p>
                </SectionReveal>
              ))}
              <SectionReveal delay={0.5}>
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    marginTop: 48,
                    paddingTop: 40,
                    borderTop: "1px solid rgba(212,175,107,0.1)",
                  }}
                >
                  {[
                    { n: "12", l: "Maîtres joailliers" },
                    { n: "160h", l: "Par solitaire" },
                    { n: "1947", l: "Fondation" },
                  ].map(({ n, l }) => (
                    <div key={l}>
                      <p
                        style={{color: brand ?? '#d4af6b',
                          fontSize: 26,
                          fontFamily: "Georgia, serif",
                          letterSpacing: "0.04em",
                          marginBottom: 6,
                        }}
                      >
                        {n}
                      </p>
                      <p
                        style={{
                          color: "rgba(240,236,224,0.3)",
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>

            {/* Right — visual */}
            <SectionReveal delay={0.15}>
              <div style={{ position: "relative" }}>
                {/* Main box */}
                <div
                  style={{
                    aspectRatio: "3/4",
                    background:
                      "linear-gradient(145deg, #151210 0%, #201810 50%, #151210 100%)",
                    borderRadius: 8,
                    border: "1px solid rgba(212,175,107,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    animation: "pulse-glow 4s ease-in-out infinite",
                  }}
                >
                  {/* Cross-hatch pattern */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `
                        repeating-linear-gradient(0deg, rgba(212,175,107,0.03) 0px, rgba(212,175,107,0.03) 1px, transparent 1px, transparent 40px),
                        repeating-linear-gradient(90deg, rgba(212,175,107,0.03) 0px, rgba(212,175,107,0.03) 1px, transparent 1px, transparent 40px)
                      `,
                    }}
                  />
                  {/* Centered jewel icon */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RotatingJewel rotationSpeed={Math.max(2, rotationSpeed * 0.6)} />
                  </div>
                  {/* Caption */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 28,
                      left: 28,
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(212,175,107,0.5)",
                        fontSize: 9,
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Atelier Paris · 1er arr.
                    </p>
                  </div>
                </div>

                {/* Floating detail card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -24,
                    right: -24,
                    background: "rgba(10,8,6,0.95)",
                    border: "1px solid rgba(212,175,107,0.2)",
                    borderRadius: 4,
                    padding: "20px 24px",
                    backdropFilter: "blur(20px)",
                    animation: "float-card 5s ease-in-out infinite",
                  }}
                >
                  <p
                    style={{color: brand ?? '#d4af6b',
                      fontSize: 20,
                      fontFamily: "Georgia, serif",
                      letterSpacing: "0.04em",
                      marginBottom: 4,
                    }}
                  >
                    160h
                  </p>
                  <p
                    style={{
                      color: "rgba(240,236,224,0.4)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Par création
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          padding: "100px 40px",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(212,175,107,0.06)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <SectionReveal>
            <p
              style={{
                color: "rgba(212,175,107,0.5)",
                fontSize: 10,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                marginBottom: 56,
              }}
            >
              Témoignages
            </p>
          </SectionReveal>

          {[
            {
              text: "La bague de fiançailles est d'une beauté indescriptible. Chaque détail est parfait — on sent que des mains expertes et une âme passionnée l'ont façonnée.",
              name: "Madeleine V.",
              piece: "Solitaire Éternité",
            },
            {
              text: "J'ai commandé une parure sur mesure pour les 25 ans de mariage de mes parents. La Maison a su capturer une histoire entière dans un seul bijou.",
              name: "Florent K.",
              piece: "Parure Impériale sur mesure",
            },
          ].map((t, i) => (
            <SectionReveal key={i} delay={i * 0.15}>
              <div
                style={{
                  marginBottom: 56,
                  paddingBottom: 56,
                  borderBottom:
                    i < 1 ? "1px solid rgba(212,175,107,0.08)" : "none",
                }}
              >
                <p
                  style={{
                    color: "rgba(240,236,224,0.65)",
                    fontSize: "clamp(18px, 2.2vw, 26px)",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    letterSpacing: "0.02em",
                    marginBottom: 28,
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <p
                  style={{color: brand ?? '#d4af6b',
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.15em",
                    marginBottom: 4,
                  }}
                >
                  — {t.name}
                </p>
                <p
                  style={{
                    color: "rgba(212,175,107,0.35)",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {t.piece}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ── CTA — EMAIL CAPTURE ── */}
      <section id="contact"
        style={{
          padding: "120px 40px",
          background:
            "linear-gradient(180deg, #080604 0%, #0d0b08 50%, #080604 100%)",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(212,175,107,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Gold geometric lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(ellipse at 20% 80%, rgba(212,175,107,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(212,175,107,0.04) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionReveal>
            {/* Ornament */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,175,107,0.4))",
                }}
              />
              <span
                style={{color: brand ?? '#d4af6b',
                  fontSize: 20,
                  opacity: 0.6,
                }}
              >
                ✦
              </span>
              <div
                style={{
                  width: 60,
                  height: 1,
                  background:
                    "linear-gradient(90deg, rgba(212,175,107,0.4), transparent)",
                }}
              />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.05}>
            <h2
              style={{
                color: "#f0ece0",
                fontSize: "clamp(32px, 4vw, 56px)",
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.2,
                letterSpacing: "0.03em",
                marginBottom: 20,
              }}
            >
              Entrez dans le cercle
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #d4af6b 0%, #f5e6b8 50%, #d4af6b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                des initiés
              </span>
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <p
              style={{
                color: "rgba(240,236,224,0.42)",
                fontSize: 15,
                lineHeight: 1.8,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                marginBottom: 48,
              }}
            >
              Avant-premières, pièces exclusives, invitations à l'atelier,
              éditions limitées — réservées à notre cercle privé.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <AnimatePresence mode="wait">
              {!emailSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleEmailSubmit}
                  style={{
                    display: "flex",
                    gap: 0,
                    maxWidth: 480,
                    margin: "0 auto",
                    border: "1px solid rgba(212,175,107,0.2)",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLFormElement).style.borderColor =
                      "rgba(212,175,107,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLFormElement).style.borderColor =
                      "rgba(212,175,107,0.2)";
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    required
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.03)",
                      border: "none",
                      outline: "none",
                      color: "#f0ece0",
                      fontSize: 13,
                      padding: "18px 24px",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      letterSpacing: "0.04em",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(135deg, #d4af6b, #b8963a)",
                      border: "none",
                      color: "#0a0806",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      padding: "18px 28px",
                      cursor: "pointer",
                      fontFamily: "Georgia, serif",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.85";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "1";
                    }}
                  >
                    Rejoindre
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "24px 40px",
                    border: "1px solid rgba(212,175,107,0.25)",
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                >
                  <p
                    style={{color: brand ?? '#d4af6b',
                      fontSize: 14,
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ✦ Bienvenue dans le cercle Élara
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <p
              style={{
                color: "rgba(240,236,224,0.2)",
                fontSize: 10,
                letterSpacing: "0.2em",
                fontFamily: "Georgia, serif",
                marginTop: 20,
              }}
            >
              Discrétion absolue. Aucune cession de données.
            </p>
          </SectionReveal>
        </div>
      </section>
      </>
      )}

      {/* ── SUB-PAGES ROUTING ── */}
      {page === "collections" && (
        <BoutiquePage
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          goTo={goTo}
        />
      )}
      {page === "atelier" && <AtelierPage />}
      {page === "savoir-faire" && <SavoirFairePage />}
      {page === "lookbook" && <LookbookPage />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "cgv" && <LegalPage variant="cgv" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#060402",
          borderTop: "1px solid rgba(212,175,107,0.08)",
          padding: "64px 40px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 56,
              flexWrap: "wrap",
              gap: 40,
            }}
          >
            <div>
              <div
                style={{color: brand ?? '#d4af6b',
                  fontSize: 26,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  letterSpacing: "0.18em",
                  marginBottom: 12,
                }}
              >
                Maison Élara
              </div>
              <p
                style={{
                  color: "rgba(240,236,224,0.25)",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  fontFamily: "Georgia, serif",
                }}
              >
                Haute Joaillerie · Paris · Depuis 1947
              </p>
            </div>

            <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
              {[
                {
                  title: "Maison",
                  links: [
                    { label: "Notre histoire", key: "atelier" as const },
                    { label: "L'atelier", key: "atelier" as const },
                    { label: "Savoir-faire", key: "savoir-faire" as const },
                  ],
                },
                {
                  title: "Collections",
                  links: [
                    { label: "Bagues", key: "collections" as const },
                    { label: "Colliers", key: "collections" as const },
                    { label: "Sur mesure", key: "contact" as const },
                  ],
                },
                {
                  title: "Service",
                  links: [
                    { label: "Rendez-vous", key: "contact" as const },
                    { label: "Entretien", key: "contact" as const },
                    { label: "Contact", key: "contact" as const },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p
                    style={{
                      color: "rgba(212,175,107,0.5)",
                      fontSize: 9,
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      fontFamily: "Georgia, serif",
                      marginBottom: 20,
                    }}
                  >
                    {col.title}
                  </p>
                  {col.links.map((l) => (
                    <button
                      key={l.label}
                      onClick={() => goTo(l.key)}
                      style={{
                        display: "block",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                        color: "rgba(240,236,224,0.28)",
                        fontSize: 12,
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        letterSpacing: "0.05em",
                        marginBottom: 10,
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(212,175,107,0.7)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(240,236,224,0.28)")
                      }
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,107,0.12), transparent)",
              marginBottom: 28,
            }}
          />

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p
              style={{
                color: "rgba(240,236,224,0.18)",
                fontSize: 10,
                letterSpacing: "0.18em",
                fontFamily: "Georgia, serif",
              }}
            >
              © 2025 Maison Élara. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { label: "Mentions légales", key: "mentions" as const },
                { label: "CGV", key: "cgv" as const },
                { label: "Politique de confidentialité", key: "privacy" as const },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={() => goTo(l.key)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "rgba(240,236,224,0.15)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    fontFamily: "Georgia, serif",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "rgba(212,175,107,0.5)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "rgba(240,236,224,0.15)")
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-PAGE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface BoutiquePageProps {
  selectedProduct: any | null;
  setSelectedProduct: (p: any | null) => void;
  goTo: (p: any) => void;
}

function BoutiquePage({ selectedProduct, setSelectedProduct, goTo }: BoutiquePageProps) {
  const [successMsg, setSuccessMsg] = useState(false);

  // We can access products list
  const products = PRODUCTS;

  if (selectedProduct) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "160px 40px 100px",
          maxWidth: 1200,
          margin: "0 auto",
          fontFamily: "Georgia, serif",
          minHeight: "80vh",
        }}
      >
        <button
          onClick={() => setSelectedProduct(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(240,236,224,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 48,
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af6b")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,236,224,0.5)")}
        >
          ← Retour à la collection
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 64,
          }}
        >
          {/* Left Column: Shimmering block of color */}
          <div
            style={{
              aspectRatio: "1/1",
              background: selectedProduct.color,
              borderRadius: 8,
              border: "1px solid rgba(212,175,107,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(212,175,107,0.15) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 4s linear infinite",
              }}
            />
            {/* Minimalist 3D representation */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px stroke #d4af6b",
                background: "radial-gradient(circle, #f5e6b8 0%, #c8963a 70%, transparent 100%)",
                opacity: 0.15,
                filter: "blur(2px)",
                animation: "jewel-spin 10s linear infinite",
              }}
            />
            <span
              style={{color: brand ?? '#d4af6b',
                fontSize: 40,
                opacity: 0.7,
                filter: "drop-shadow(0 0 10px #d4af6b)",
              }}
            >
              ✦
            </span>
          </div>

          {/* Right Column: Info */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p
              style={{color: brand ?? '#d4af6b',
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {selectedProduct.category}
            </p>
            <h1
              style={{
                color: "#f0ece0",
                fontSize: 36,
                fontStyle: "italic",
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              {selectedProduct.name}
            </h1>
            <p
              style={{
                color: "rgba(240,236,224,0.4)",
                fontSize: 14,
                marginBottom: 24,
                letterSpacing: "0.05em",
              }}
            >
              {selectedProduct.material}
            </p>
            <div
              style={{color: brand ?? '#d4af6b',
                fontSize: 28,
                marginBottom: 32,
              }}
            >
              {selectedProduct.price}
            </div>

            <p
              style={{
                color: "rgba(240,236,224,0.6)",
                fontSize: 15,
                lineHeight: 1.8,
                fontStyle: "italic",
                marginBottom: 40,
              }}
            >
              Une création d'une finesse rare, conçue pour magnifier la lumière naturelle des gemmes.
              Façonnée entièrement à la main au sein de notre atelier parisien par nos maîtres joailliers,
              chaque griffe est travaillée et polie individuellement pour un éclat éternel et une sécurité absolue.
            </p>

            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{padding: "16px 24px",
                  border: "1px solid #d4af6b",
                  color: brand ?? '#d4af6b',
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                ✦ Demande d'information enregistrée. Nos conseillers vous contacteront sous 24h.
              </motion.div>
            ) : (
              <button
                onClick={() => setSuccessMsg(true)}
                style={{
                  background: "linear-gradient(135deg, #d4af6b, #b8963a)",
                  border: "none",
                  borderRadius: 2,
                  color: "#0a0806",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  padding: "18px 40px",
                  cursor: "pointer",
                  fontWeight: 700,
                  marginBottom: 32,
                  transition: "all 0.3s ease",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Demander des informations
              </button>
            )}

            <div
              style={{
                fontSize: 12,
                color: "rgba(240,236,224,0.35)",
                lineHeight: 1.8,
                borderTop: "1px solid rgba(212,175,107,0.1)",
                paddingTop: 24,
              }}
            >
              • Façonné à la commande sous 4 à 6 semaines<br />
              • Certificat GIA individuel fourni pour chaque diamant<br />
              • Transport sécurisé et livraison blindée offerts dans le monde entier
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 1280,
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <p
          style={{
            color: "rgba(212,175,107,0.6)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            marginBottom: 16,
          }}
        >
          Maison Élence
        </p>
        <h1
          style={{
            color: "#f0ece0",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontFamily: "Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.03em",
            marginBottom: 24,
          }}
        >
          La Collection Élence
        </h1>
        <p
          style={{
            color: "rgba(240,236,224,0.45)",
            fontSize: 15,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Explorez nos créations d'exception façonnées en or 18 carats et platine,
          ornées de diamants sélectionnés avec une rigueur absolue.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 32,
        }}
      >
        {products.map((product) => (
          <div
            key={product.name}
            onClick={() => {
              setSelectedProduct(product);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }}
            style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(212,175,107,0.1)",
              borderRadius: 6,
              padding: "24px",
              cursor: "pointer",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,107,0.4)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(212,175,107,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,107,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                aspectRatio: "3/4",
                background: product.color,
                borderRadius: 4,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{color: brand ?? '#d4af6b', fontSize: 24, opacity: 0.5 }}>✦</span>
            </div>
            <p
              style={{color: brand ?? '#d4af6b',
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {product.category}
            </p>
            <h3
              style={{
                color: "#f0ece0",
                fontSize: 18,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                marginBottom: 6,
              }}
            >
              {product.name}
            </h3>
            <p
              style={{
                color: "rgba(240,236,224,0.3)",
                fontSize: 11,
                marginBottom: 16,
              }}
            >
              {product.material}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{color: brand ?? '#d4af6b', fontSize: 16 }}>{product.price}</span>
              <span
                style={{fontSize: 10,
                  color: brand ?? '#d4af6b',
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Découvrir →
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AtelierPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p
          style={{
            color: "rgba(212,175,107,0.6)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Histoire & Esprit
        </p>
        <h1
          style={{
            color: "#f0ece0",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          L'Atelier Place Vendôme
        </h1>
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(90deg, transparent, #d4af6b, transparent)",
            margin: "0 auto",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 48, fontSize: 16, lineHeight: 1.9, color: "rgba(240,236,224,0.75)" }}>
        <p style={{ fontStyle: "italic" }}>
          Depuis sa fondation en 1947, la Maison Élara s'est imposée comme le gardien d'un savoir-faire d'exception.
          Installé dans un hôtel particulier historique à quelques pas de la Place Vendôme, notre atelier réunit
          douze maîtres joailliers dévoués à l'excellence.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            margin: "24px 0",
            background: "rgba(212,175,107,0.02)",
            border: "1px solid rgba(212,175,107,0.08)",
            borderRadius: 6,
            padding: 32,
          }}
        >
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 28, marginBottom: 8, fontWeight: 400 }}>78+ Ans</h3>
            <p style={{ fontSize: 12, color: "rgba(240,236,224,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>D'histoire et d'indépendance</p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 28, marginBottom: 8, fontWeight: 400 }}>12</h3>
            <p style={{ fontSize: 12, color: "rgba(240,236,224,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Maîtres joailliers à l'atelier</p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 28, marginBottom: 8, fontWeight: 400 }}>160 Heures</h3>
            <p style={{ fontSize: 12, color: "rgba(240,236,224,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>De travail manuel par pièce unique</p>
          </div>
        </div>

        <p>
          Chaque création commence par un dialogue intime entre la matière brute et l'idée.
          Dans le calme feutré de l'établi, sous la lumière tamisée, le métal précieux est martelé, sculpté, poli.
          Nos artisans refusent les techniques modernes d'automatisation ou d'impression 3D directe : seule la main
          est capable d'insuffler une âme vibrante à un objet inanimé.
        </p>
        <p>
          Le temps est notre plus grand allié. Nous acceptons de passer des semaines sur un unique serti griffes,
          de parfaire un poli miroir caché au dos d'une parure, car nous savons que ces détails imperceptibles font
          la différence entre un bijou éphémère et un héritage qui traversera les générations.
        </p>
      </div>
    </motion.div>
  );
}

function SavoirFairePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p
          style={{
            color: "rgba(212,175,107,0.6)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Exigence & Rigueur
        </p>
        <h1
          style={{
            color: "#f0ece0",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          Le Savoir-Faire Élara
        </h1>
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(90deg, transparent, #d4af6b, transparent)",
            margin: "0 auto",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
        {[
          {
            title: "L'Or 18 Carats & Le Platine 950",
            desc: "Nous fondons nos propres alliages d'or jaune, blanc et rose au sein de l'atelier pour garantir une pureté de 750/1000 et une nuance de couleur incomparable. Le platine 950, d'une dureté exceptionnelle, est réservé à nos sertissages les plus complexes.",
            num: "01",
          },
          {
            title: "Les Diamants GIA de Haute Pureté",
            desc: "Chaque diamant d'un poids supérieur à 0.3 carat est accompagné d'un certificat individuel émis par le GIA (Gemological Institute of America). Nos gemmologues ne sélectionnent que des pierres classées D à H en couleur, et de pureté IF à VS2.",
            num: "02",
          },
          {
            title: "Le Serti Parisien",
            desc: "Technique signature de la Maison, le serti parisien exige d'ajuster chaque grain de métal précieux sous binoculaire pour enserrer la gemme de manière invisible. La pierre semble ainsi flotter sur le métal, captant la lumière sous tous les angles.",
            num: "03",
          },
          {
            title: "Le Poli Miroir",
            desc: "Dernière étape cruciale, le polissage est réalisé à l'aide de fils de coton d'épaisseurs variables. Ce procédé permet d'éliminer la moindre micro-rayure et d'obtenir un éclat si intense qu'il reflète l'environnement comme un miroir liquide.",
            num: "04",
          },
        ].map((item, idx) => (
          <div
            key={item.title}
            style={{
              paddingBottom: 40,
              borderBottom: idx < 3 ? "1px solid rgba(212,175,107,0.1)" : "none",
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 32,
                color: "rgba(212,175,107,0.3)",
                lineHeight: 1,
              }}
            >
              {item.num}
            </span>
            <div>
              <h3
                style={{
                  color: "#f0ece0",
                  fontSize: 20,
                  fontStyle: "italic",
                  marginBottom: 12,
                  fontWeight: 400,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "rgba(240,236,224,0.65)",
                  fontSize: 15,
                  lineHeight: 1.8,
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LookbookPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p
          style={{
            color: "rgba(212,175,107,0.6)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Instants de Lumière
        </p>
        <h1
          style={{
            color: "#f0ece0",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          Le Lookbook
        </h1>
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(90deg, transparent, #d4af6b, transparent)",
            margin: "0 auto",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 32,
        }}
      >
        {[
          { title: "Printemps 2025 · Clarté", theme: "linear-gradient(135deg, #16120e 0%, #2a2015 100%)", pieces: "8 pièces d'exception" },
          { title: "Édition Nuit · Intense", theme: "linear-gradient(135deg, #0a0b0e 0%, #171a24 100%)", pieces: "5 pièces d'exception" },
          { title: "Sur Mesure · Héritage", theme: "linear-gradient(135deg, #0e120e 0%, #1b261b 100%)", pieces: "Créations à la demande" },
        ].map((lb) => (
          <div
            key={lb.title}
            style={{
              background: lb.theme,
              border: "1px solid rgba(212,175,107,0.1)",
              borderRadius: 8,
              aspectRatio: "3/4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 40,
              cursor: "pointer",
              transition: "transform 0.4s ease, border-color 0.4s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(212,175,107,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(212,175,107,0.1)";
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(212,175,107,0.05) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 6s linear infinite",
              }}
            />
            <p
              style={{color: brand ?? '#d4af6b',
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              {lb.pieces}
            </p>
            <h3
              style={{
                color: "#f0ece0",
                fontSize: 24,
                fontStyle: "italic",
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              {lb.title}
            </h3>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ nom: "", email: "", msg: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom && formData.email && formData.msg) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p
          style={{
            color: "rgba(212,175,107,0.6)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Prendre Rendez-Vous
        </p>
        <h1
          style={{
            color: "#f0ece0",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          Contactez la Maison
        </h1>
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(90deg, transparent, #d4af6b, transparent)",
            margin: "0 auto",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 64,
        }}
      >
        {/* Left Column: Form */}
        <div>
          <h2
            style={{
              color: "#f0ece0",
              fontSize: 24,
              fontStyle: "italic",
              marginBottom: 32,
              fontWeight: 400,
            }}
          >
            Formulaire de contact
          </h2>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ color: "rgba(240,236,224,0.5)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(212,175,107,0.2)",
                      borderRadius: 3,
                      padding: "16px 20px",
                      color: "#f0ece0",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ color: "rgba(240,236,224,0.5)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Adresse e-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(212,175,107,0.2)",
                      borderRadius: 3,
                      padding: "16px 20px",
                      color: "#f0ece0",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ color: "rgba(240,236,224,0.5)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Votre message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(212,175,107,0.2)",
                      borderRadius: 3,
                      padding: "16px 20px",
                      color: "#f0ece0",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #d4af6b, #b8963a)",
                    border: "none",
                    borderRadius: 2,
                    color: "#0a0806",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    padding: "18px 36px",
                    cursor: "pointer",
                    fontWeight: 700,
                    transition: "all 0.3s ease",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Envoyer
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "40px",
                  border: "1px solid rgba(212,175,107,0.3)",
                  borderRadius: 6,
                  textAlign: "center",
                  background: "rgba(212,175,107,0.02)",
                }}
              >
                <p style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 16 }}>✦ Message transmis ✦</p>
                <p style={{ color: "rgba(240,236,224,0.6)", fontSize: 14 }}>
                  Nous vous remercions pour votre intérêt. Un conseiller vous répondra sous 24h.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Address & Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div>
            <h2
              style={{
                color: "#f0ece0",
                fontSize: 24,
                fontStyle: "italic",
                marginBottom: 24,
                fontWeight: 400,
              }}
            >
              L'Atelier
            </h2>
            <p style={{ color: "rgba(240,236,224,0.7)", fontSize: 15, lineHeight: 1.8, fontStyle: "italic" }}>
              Place Vendôme, 75001 Paris (sur rendez-vous uniquement)<br />
              Téléphone : +33 1 42 60 00 00<br />
              E-mail : valentinmilliand@aevia.services
            </p>
          </div>

          {/* Minimalist Graphic Map */}
          <div
            style={{
              aspectRatio: "16/10",
              background: "linear-gradient(145deg, #111 0%, #1c1c1c 100%)",
              borderRadius: 6,
              border: "1px solid rgba(212,175,107,0.1)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(212,175,107,0.02) 0px, rgba(212,175,107,0.02) 1px, transparent 1px, transparent 20px),
                  repeating-linear-gradient(90deg, rgba(212,175,107,0.02) 0px, rgba(212,175,107,0.02) 1px, transparent 1px, transparent 20px)
                `,
              }}
            />
            {/* Center dot */}
            <div
              style={{width: 10,
                height: 10,
                background: brand ?? '#d4af6b',
                borderRadius: "50%",
                filter: "drop-shadow(0 0 10px #d4af6b)",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                color: "rgba(212,175,107,0.4)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                bottom: 20,
              }}
            >
              Place Vendôme · Paris
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LegalPage({ variant }: { variant: "mentions" | "cgv" | "privacy" }) {
  if (variant === "mentions") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 40px 120px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "Georgia, serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ color: "#f0ece0", fontSize: 36, fontStyle: "italic", marginBottom: 40, fontWeight: 400 }}>Mentions Légales</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "rgba(240,236,224,0.75)" }}>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Éditeur du site</h3>
            <p>
              Aevia WS — Valentin Milliand<br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Adresse : communiquée sur demande<br />
              E-mail : valentinmilliand@aevia.services
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Hébergement</h3>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, États-Unis
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Propriété intellectuelle</h3>
            <p>
              L'ensemble des contenus de ce site (textes, images, designs, logos) est protégé au titre du droit d'auteur.
              Toute reproduction ou diffusion non autorisée est strictement interdite.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "cgv") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 40px 120px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "Georgia, serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ color: "#f0ece0", fontSize: 36, fontStyle: "italic", marginBottom: 40, fontWeight: 400 }}>Conditions Générales de Vente</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "rgba(240,236,224,0.75)" }}>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>1. Objet</h3>
            <p>
              Les présentes Conditions Générales de Vente régissent les relations contractuelles pour toute demande ou commande effectuée auprès de la Maison Élara.
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>2. Commandes & Créations</h3>
            <p>
              Nos bijoux étant façonnés à la main et sur commande, le délai de fabrication moyen est de 4 à 6 semaines. Un acompte peut être exigé lors de la validation de commandes sur mesure.
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>3. Livraison</h3>
            <p>
              Toutes nos livraisons de haute joaillerie sont confiées à des transporteurs spécialisés assurant un transit sécurisé et blindé. La livraison est offerte dans le monde entier.
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>4. Droit de rétractation</h3>
            <p>
              Conformément à la réglementation, l'acheteur dispose d'un droit de rétractation de 14 jours à compter de la réception de la pièce, sauf pour les créations entièrement personnalisées ou gravées sur mesure.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 40px 120px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "Georgia, serif",
        lineHeight: 1.8,
      }}
    >
      <h1 style={{ color: "#f0ece0", fontSize: 36, fontStyle: "italic", marginBottom: 40, fontWeight: 400 }}>Politique de Confidentialité</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "rgba(240,236,224,0.75)" }}>
        <div>
          <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Collecte des données</h3>
          <p>
            Les données recueillies via nos formulaires de contact ou d'inscription (nom, e-mail) sont destinées exclusivement au traitement de vos demandes d'informations et au suivi de vos relations avec la Maison Élara.
          </p>
        </div>
        <div>
          <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Discrétion absolue</h3>
          <p>
            Nous garantissons la confidentialité totale de vos données. Celles-ci ne seront en aucun cas louées, vendues ou cédées à des tiers.
          </p>
        </div>
        <div>
          <h3 style={{color: brand ?? '#d4af6b', fontSize: 18, fontStyle: "italic", marginBottom: 12, fontWeight: 400 }}>Vos Droits</h3>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit à tout moment par e-mail à : valentinmilliand@aevia.services.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
