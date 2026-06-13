"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  C,
  GAME_MODES,
  TEAM_STATS,
  ROSTER,
  MERCH,
  BRACKET,
  CRTBoot,
  CharacterSilhouette,
  NeonStatCounter,
} from "./shared";

// ─── PARALLAX HERO ────────────────────────────────────────────────────────────
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollFrac, setScrollFrac] = useState(0);
  const [skyY, setSkyY] = useState(0);
  const [mountY, setMountY] = useState(0);
  const [cityY, setCityY] = useState(0);
  const [groundY, setGroundY] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const total = sectionRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const frac = Math.max(0, Math.min(1, scrolled / total));
    setScrollFrac(frac);
    setSkyY(frac * 0.1 * 300);
    setMountY(frac * 0.3 * 300);
    setCityY(frac * 0.6 * 300);
    setGroundY(frac * 1.0 * 300);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        height: "200vh",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: C.bg,
      }}>
        {/* SKY layer — speed 0.1x */}
        <div style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${skyY}px)`,
          background: `linear-gradient(180deg, #020a04 0%, #041a08 40%, #061406 100%)`,
        }}>
          {/* Stars */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() > 0.8 ? 3 : 1.5,
              height: Math.random() > 0.8 ? 3 : 1.5,
              borderRadius: "50%",
              background: C.green,
              opacity: Math.random() * 0.6 + 0.2,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px ${C.green}`,
            }} />
          ))}
        </div>

        {/* MOUNTAINS layer — speed 0.3x */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${mountY}px)`,
          height: "55%",
        }}>
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <polygon points="0,400 120,180 240,280 360,120 480,220 600,80 720,200 840,100 960,240 1080,140 1200,260 1320,160 1440,220 1440,400" fill="#0d2010" />
            <polygon points="0,400 80,260 200,320 320,200 440,280 560,160 680,250 800,180 920,300 1040,200 1160,310 1280,220 1440,270 1440,400" fill="#0a1a0c" opacity="0.8" />
            <polyline points="0,400 120,180 240,280 360,120 480,220 600,80 720,200 840,100 960,240 1080,140 1200,260 1320,160 1440,220" fill="none" stroke={C.green} strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        {/* CITY layer — speed 0.6x */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${cityY}px)`,
          height: "45%",
        }}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            {[
              [0, 200, 80, 120], [90, 170, 60, 150], [160, 140, 100, 180], [270, 220, 50, 100],
              [330, 100, 120, 220], [460, 180, 70, 140], [540, 130, 90, 190], [640, 160, 110, 160],
              [760, 90, 80, 230], [850, 200, 60, 120], [920, 150, 100, 170], [1030, 120, 70, 200],
              [1110, 180, 90, 140], [1210, 100, 80, 220], [1300, 160, 140, 160],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={i % 3 === 0 ? "#0c1e0e" : "#081408"} stroke={C.green} strokeWidth="0.5" strokeOpacity="0.2" />
            ))}
            {[
              [20, 220, 14, 10], [44, 220, 14, 10], [20, 240, 14, 10], [44, 240, 14, 10],
              [180, 160, 14, 8], [204, 160, 14, 8], [180, 178, 14, 8],
              [360, 130, 16, 10], [390, 130, 16, 10], [360, 150, 16, 10], [390, 150, 16, 10],
              [780, 120, 14, 10], [804, 120, 14, 10], [780, 140, 14, 10],
              [930, 170, 14, 10], [954, 170, 14, 10], [930, 190, 14, 10],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={C.green} opacity={0.4} />
            ))}
            <rect x="0" y="298" width="1440" height="22" fill={`url(#cityGlow)`} />
            <defs>
              <linearGradient id="cityGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity="0.15" />
                <stop offset="100%" stopColor={C.green} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* GROUND layer — speed 1x */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${groundY}px)`,
          height: "18%",
          background: `linear-gradient(180deg, ${C.darkGreen} 0%, #010801 100%)`,
          borderTop: `1px solid rgba(0,255,100,0.4)`,
          boxShadow: `0 -4px 30px rgba(0,255,100,0.15)`,
        }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%", opacity: 0.3 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={i * 72} y1="0" x2={i * 72} y2="120" stroke={C.green} strokeWidth="0.5" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 20} x2="1440" y2={i * 20} stroke={C.green} strokeWidth="0.5" />
            ))}
          </svg>
        </div>

        {/* CHARACTER */}
        <div style={{
          position: "absolute",
          bottom: "18%",
          left: "8%",
          zIndex: 10,
          transform: `translateX(${scrollFrac * 65}vw)`,
          transition: "transform 0.08s linear",
        }}>
          <CharacterSilhouette scrollProgress={scrollFrac} />
        </div>

        {/* HERO TEXT */}
        <div style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          padding: "0 40px",
          textAlign: "center",
          zIndex: 20,
          fontFamily: "'Courier New', monospace",
        }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.5em", marginBottom: 16, textTransform: "uppercase" }}>
            GHOST PROTOCOL ESPORTS — EST. 2019
          </div>
          <h1
            className="glitch-text"
            data-text="ENTER THE VOID"
            style={{
              fontSize: "clamp(48px, 10vw, 120px)",
              fontWeight: 900,
              color: C.white,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
              marginBottom: 24,
              textShadow: `0 0 60px rgba(0,255,100,0.2)`,
            }}
          >
            ENTER THE VOID
          </h1>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            color: C.textMid,
            fontSize: 13,
            letterSpacing: "0.3em",
          }}>
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, transparent, ${C.green})` }} />
            <span>SEASON SIX — NOW LIVE</span>
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, ${C.green}, transparent)` }} />
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "22%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            color: C.textDim,
            fontSize: 10,
            letterSpacing: "0.3em",
          }}
        >
          <span>SCROLL TO ENGAGE</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(180deg, ${C.green}, transparent)` }} />
        </motion.div>

        {/* Corner HUD elements */}
        <div style={{ position: "absolute", top: 80, left: 20, fontFamily: "'Courier New', monospace", fontSize: 10, color: C.textDim, letterSpacing: "0.1em", zIndex: 20 }}>
          <div>LAT: 48.8566° N</div>
          <div>LNG: 2.3522° E</div>
          <div style={{ color: C.green, marginTop: 4 }}>STATUS: ACTIVE</div>
        </div>
        <div style={{ position: "absolute", top: 80, right: 20, fontFamily: "'Courier New', monospace", fontSize: 10, color: C.textDim, letterSpacing: "0.1em", textAlign: "right", zIndex: 20 }}>
          <div>PING: 4ms</div>
          <div>FPS: 240</div>
          <div style={{ color: C.green, marginTop: 4 }}>RANK: LEGENDARY</div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function GamingTemplatePage() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <CRTBoot onDone={() => setBooted(true)} />

      <motion.div
        className="scanline-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: C.bg,
          color: C.white,
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <HeroSection />

        {/* Game Modes Preview Section */}
        <section style={{ padding: "120px 40px", textAlign: "center", borderTop: `1px solid rgba(0,255,100,0.1)` }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.4em", marginBottom: 16 }}>
              // SUB_SYSTEM_01
            </div>
            <h2 className="glitch-text" data-text="GAME MODES" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: C.white, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              GAME MODES
            </h2>
            <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Explore tactical operation protocols. From massive squad battles to high-pressure solo eliminations, our server algorithms deliver pure action.
            </p>
            <Link href="/templates/impact-44/modes" style={{
              padding: "16px 40px",
              background: "transparent",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
            }}>
              Launch Modes Interface
            </Link>
          </div>
        </section>

        {/* Team Stats Section */}
        <section style={{ background: C.gray, padding: "120px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.4em", marginBottom: 16 }}>
              // SUB_SYSTEM_02
            </div>
            <h2 className="glitch-text" data-text="ACTIVE ROSTER" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: C.white, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              TEAM ROSTER
            </h2>
            <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Meet our championship-winning active competitors. 847 tournament wins and 23 world titles across all competitive divisions.
            </p>
            <Link href="/templates/impact-44/team" style={{
              padding: "16px 40px",
              background: "transparent",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
            }}>
              Inspect Active Roster
            </Link>
          </div>
        </section>

        {/* Bracket Section */}
        <section style={{ padding: "120px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.4em", marginBottom: 16 }}>
              // SUB_SYSTEM_03
            </div>
            <h2 className="glitch-text" data-text="TOURNAMENTS" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: C.white, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              WORLD FINALS BRACKET
            </h2>
            <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Track our tournament path to world domination. High stakes and zero-room-for-errors live updates from our servers.
            </p>
            <Link href="/templates/impact-44/bracket" style={{
              padding: "16px 40px",
              background: "transparent",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
            }}>
              Load Tournament Grid
            </Link>
          </div>
        </section>

        {/* Merch Section */}
        <section style={{ background: C.gray, padding: "120px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.4em", marginBottom: 16 }}>
              // SUB_SYSTEM_04
            </div>
            <h2 className="glitch-text" data-text="GEAR STORE" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: C.white, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              LIMITED DROP GEAR
            </h2>
            <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Suit up with our official cyber jerseys, signature hoodies, and accessories. Season 6 drop now open.
            </p>
            <Link href="/templates/impact-44/merch" style={{
              padding: "16px 40px",
              background: "transparent",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
            }}>
              Browse Gear Catalog
            </Link>
          </div>
        </section>

        {/* Recruitment CTA Section */}
        <section style={{ padding: "120px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.4em", marginBottom: 16 }}>
              // SUB_SYSTEM_05
            </div>
            <h2 className="glitch-text" data-text="JOIN US" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: C.white, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              JOIN THE VOID
            </h2>
            <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Are you legendary? Submit your gameplay clips and join the ranks of the elite. Applications reviewed weekly.
            </p>
            <Link href="/templates/impact-44/recruit" style={{
              padding: "18px 48px",
              background: C.green,
              border: "none",
              color: C.bg,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 900,
              boxShadow: `0 0 30px rgba(0,255,100,0.3)`,
            }}>
              Submit Tryout Form
            </Link>
          </div>
        </section>
      </motion.div>
    </>
  );
}
