'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

// ─── INJECTED STYLES ────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @keyframes glitch-clip-1 {
    0%   { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-4px, 0); }
    10%  { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); transform: translate(3px, 0); }
    20%  { clip-path: polygon(0 40%, 100% 40%, 100% 44%, 0 44%); transform: translate(-2px, 0); }
    30%  { clip-path: polygon(0 65%, 100% 65%, 100% 70%, 0 70%); transform: translate(4px, 0); }
    40%  { clip-path: polygon(0 80%, 100% 80%, 100% 85%, 0 85%); transform: translate(-3px, 0); }
    50%  { clip-path: polygon(0 90%, 100% 90%, 100% 95%, 0 95%); transform: translate(2px, 0); }
    60%  { clip-path: polygon(0 10%, 100% 10%, 100% 14%, 0 14%); transform: translate(-4px, 0); }
    70%  { clip-path: polygon(0 55%, 100% 55%, 100% 60%, 0 60%); transform: translate(3px, 0); }
    80%  { clip-path: polygon(0 30%, 100% 30%, 100% 33%, 0 33%); transform: translate(-1px, 0); }
    90%  { clip-path: polygon(0 70%, 100% 70%, 100% 75%, 0 75%); transform: translate(4px, 0); }
    100% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-4px, 0); }
  }

  @keyframes glitch-clip-2 {
    0%   { clip-path: polygon(0 50%, 100% 50%, 100% 54%, 0 54%); transform: translate(4px, 0); }
    15%  { clip-path: polygon(0 72%, 100% 72%, 100% 78%, 0 78%); transform: translate(-3px, 0); }
    25%  { clip-path: polygon(0 18%, 100% 18%, 100% 23%, 0 23%); transform: translate(2px, 0); }
    35%  { clip-path: polygon(0 88%, 100% 88%, 100% 93%, 0 93%); transform: translate(-4px, 0); }
    45%  { clip-path: polygon(0 5%, 100% 5%, 100% 9%, 0 9%); transform: translate(3px, 0); }
    55%  { clip-path: polygon(0 35%, 100% 35%, 100% 40%, 0 40%); transform: translate(-2px, 0); }
    65%  { clip-path: polygon(0 62%, 100% 62%, 100% 66%, 0 66%); transform: translate(4px, 0); }
    75%  { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); transform: translate(-3px, 0); }
    85%  { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(2px, 0); }
    100% { clip-path: polygon(0 50%, 100% 50%, 100% 54%, 0 54%); transform: translate(4px, 0); }
  }

  @keyframes neon-pulse {
    0%, 100% { text-shadow: 0 0 8px #00ff64, 0 0 20px #00ff64, 0 0 40px #00ff64; opacity: 1; }
    50%       { text-shadow: 0 0 4px #00ff64, 0 0 10px #00ff64, 0 0 60px #00ff64; opacity: 0.85; }
  }

  @keyframes neon-border-pulse {
    0%, 100% { box-shadow: 0 0 6px #00ff64, inset 0 0 6px rgba(0,255,100,0.1); }
    50%       { box-shadow: 0 0 18px #00ff64, inset 0 0 12px rgba(0,255,100,0.2); }
  }

  @keyframes scanline-sweep {
    0%   { transform: translateY(-100vh); opacity: 0.8; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes crt-flicker {
    0%   { opacity: 0; }
    5%   { opacity: 0.9; }
    8%   { opacity: 0.2; }
    12%  { opacity: 0.95; }
    20%  { opacity: 0.1; }
    25%  { opacity: 1; }
    30%  { opacity: 0.4; }
    35%  { opacity: 0.9; }
    40%  { opacity: 0.05; }
    50%  { opacity: 1; }
    60%  { opacity: 0.8; }
    70%  { opacity: 1; }
    80%  { opacity: 0.9; }
    90%  { opacity: 1; }
    100% { opacity: 1; }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  @keyframes char-walk {
    0%   { transform: translateY(0px); }
    25%  { transform: translateY(-6px); }
    50%  { transform: translateY(0px); }
    75%  { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }

  @keyframes data-stream {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes bracket-expand {
    from { width: 0; }
    to   { width: 100%; }
  }

  @keyframes slide-in-right {
    from { transform: translateX(60px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }

  @keyframes rotate-hue {
    from { filter: hue-rotate(0deg); }
    to   { filter: hue-rotate(360deg); }
  }

  .glitch-text {
    position: relative;
    display: inline-block;
  }
  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
  }
  .glitch-text:hover::before {
    color: #ff3c00;
    opacity: 0.85;
    animation: glitch-clip-1 0.5s infinite linear;
    left: -3px;
  }
  .glitch-text:hover::after {
    color: #00eeff;
    opacity: 0.85;
    animation: glitch-clip-2 0.5s infinite linear;
    left: 3px;
  }

  .neon-num {
    animation: neon-pulse 2s ease-in-out infinite;
    color: #00ff64;
  }

  .neon-border {
    animation: neon-border-pulse 2s ease-in-out infinite;
  }

  .scanline-overlay::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,255,100,0.03) 2px,
      rgba(0,255,100,0.03) 4px
    );
    pointer-events: none;
    z-index: 9998;
  }

  .feature-card {
    clip-path: polygon(0 0, 100% 0, 96% 100%, 0 100%);
  }

  .angled-section {
    clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
  }

  .angled-section-reverse {
    clip-path: polygon(5% 0, 100% 0, 100% 100%, 0 100%);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #060a06; }
  ::-webkit-scrollbar-thumb { background: #00ff64; }
`

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const C = {
  bg: '#060a06',
  green: '#00ff64',
  red: '#ff3c00',
  darkGreen: '#003318',
  midGreen: '#00cc50',
  gray: '#1a2a1a',
  textDim: '#4a6a4a',
  textMid: '#7aaa7a',
  white: '#e8ffe8',
}

const GAME_MODES = [
  {
    id: 1,
    tag: '// MODE_01',
    title: 'BATTLE ROYALE',
    sub: 'LAST SQUAD STANDING',
    desc: 'Drop into a 150-player warzone. Shrinking exclusion zones. Dynamic weather systems. Every match rewritten by chaos theory.',
    stat: ['150', 'PLAYERS'],
    color: C.red,
  },
  {
    id: 2,
    tag: '// MODE_02',
    title: 'RANKED SIEGE',
    sub: '5v5 TACTICAL DOMINATION',
    desc: 'Precision over firepower. Map control, economy management, and perfect team comms separate legends from corpses.',
    stat: ['5v5', 'FORMAT'],
    color: C.green,
  },
  {
    id: 3,
    tag: '// MODE_03',
    title: 'HEIST PROTOCOL',
    sub: 'ASYMMETRIC OBJECTIVES',
    desc: 'Attackers execute the plan. Defenders improvise the response. 12 mission maps. Zero respawns. Pure consequence.',
    stat: ['12', 'MAPS'],
    color: '#ff9900',
  },
  {
    id: 4,
    tag: '// MODE_04',
    title: 'GHOST HUNT',
    sub: 'SOLO ELIMINATION BRACKET',
    desc: 'One life. One gun. One hundred enemies. The server does not care about your rank. Neither do we.',
    stat: ['∞', 'PRESSURE'],
    color: '#cc00ff',
  },
]

const TEAM_STATS = [
  { value: 847, label: 'TOURNAMENT WINS', suffix: '' },
  { value: 23, label: 'WORLD TITLES', suffix: '' },
  { value: 4200000, label: 'PRIZE MONEY', suffix: '$', format: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
  { value: 312, label: 'ACTIVE PLAYERS', suffix: '' },
]

const ROSTER = [
  { handle: 'WRAITHX', role: 'IGL', real: 'Marcus Chen', kills: '4.8', kd: '12.4', country: 'KR' },
  { handle: 'NULLBYTE', role: 'AWP', real: 'Lena Voigt', kills: '5.2', kd: '14.1', country: 'DE' },
  { handle: 'GHOSTNET', role: 'ENTRY', real: 'Rafa Santos', kills: '6.1', kd: '10.8', country: 'BR' },
  { handle: 'HEXFIRE', role: 'SUPPORT', real: 'Yuki Tanaka', kills: '3.9', kd: '11.3', country: 'JP' },
  { handle: 'VOIDPILOT', role: 'LURK', real: 'Amir Nazari', kills: '4.4', kd: '13.7', country: 'IR' },
]

const MERCH = [
  { name: 'GHOST PROTOCOL JERSEY', price: '89', tag: 'LIMITED DROP', hot: true },
  { name: 'NULL-BYTE HOODIE', price: '120', tag: 'SEASON 6', hot: false },
  { name: 'WRAITHX SIGNATURE CAP', price: '45', tag: 'BESTSELLER', hot: true },
  { name: 'TEAM BACKPACK V2', price: '95', tag: 'NEW ARRIVAL', hot: false },
]

const BRACKET = [
  { round: 'QF', matches: [['NULLCORE', 'GHOST.GG'], ['WRAITHX', 'BYTE_FORCE'], ['HEXFIRE', 'DARKNET'], ['VOIDPILOT', 'ZERO_DAY']] },
  { round: 'SF', matches: [['NULLCORE', 'WRAITHX'], ['HEXFIRE', 'VOIDPILOT']] },
  { round: 'FINAL', matches: [['NULLCORE', 'HEXFIRE']] },
]

// ─── CRT BOOT COMPONENT ──────────────────────────────────────────────────────

function CRTBoot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  const BOOT_LINES = [
    '> INITIALIZING VOIDCORE ENGINE v7.4.2...',
    '> LOADING COMBAT SUBSYSTEMS...',
    '> CONNECTING TO TOURNAMENT SERVERS...',
    '> VERIFYING PLAYER CREDENTIALS...',
    '> RENDERING PIPELINE: ACTIVE',
    '> ALL SYSTEMS NOMINAL',
    '> ENTERING THE VOID.',
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setPhase(1), 300)
        setTimeout(onDone, 800)
      }
    }, 110)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {phase === 0 && (
        <motion.div
          key="crt-boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: C.bg,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Courier New', monospace",
            animation: 'crt-flicker 1.2s ease-out forwards',
          }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.4em', marginBottom: 8 }}>
              VOIDCORE SYSTEMS
            </div>
            <div
              className="glitch-text"
              data-text="GHOST PROTOCOL"
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: C.green,
                letterSpacing: '0.2em',
                textShadow: `0 0 20px ${C.green}`,
              }}
            >
              GHOST PROTOCOL
            </div>
          </div>
          <div style={{ width: 480, maxWidth: '90vw' }}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  color: i === lines.length - 1 ? C.green : C.textMid,
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                  paddingLeft: 8,
                  borderLeft: i === lines.length - 1 ? `2px solid ${C.green}` : '2px solid transparent',
                }}
              >
                {line}
                {i === lines.length - 1 && (
                  <span style={{ animation: 'blink 0.8s infinite', marginLeft: 4 }}>_</span>
                )}
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 40, width: 480, maxWidth: '90vw' }}>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, opacity: 0.4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: C.textDim, letterSpacing: '0.15em' }}>
              <span>BUILD 2026.05.18</span>
              <span>REGION: EU-WEST</span>
              <span>LATENCY: 4ms</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── CHARACTER SILHOUETTE ─────────────────────────────────────────────────────

function CharacterSilhouette({ scrollProgress }: { scrollProgress: number }) {
  const x = scrollProgress * 60
  const bobY = Math.sin(Date.now() / 400) * 3

  return (
    <div
      style={{
        transform: `translateX(${x}%) translateY(${bobY}px)`,
        transition: 'transform 0.05s linear',
        animation: 'char-walk 0.8s ease-in-out infinite',
        transformOrigin: 'bottom center',
        position: 'relative',
        width: 80,
        height: 180,
      }}
    >
      {/* Head */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 28,
        height: 28,
        background: C.green,
        clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)',
        boxShadow: `0 0 20px ${C.green}`,
      }} />
      {/* Visor */}
      <div style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 22,
        height: 10,
        background: C.bg,
        clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
        boxShadow: `0 0 8px ${C.red}, inset 0 0 6px ${C.red}`,
        zIndex: 1,
      }} />
      {/* Torso */}
      <div style={{
        position: 'absolute',
        top: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 40,
        height: 60,
        background: `linear-gradient(180deg, ${C.darkGreen} 0%, ${C.gray} 100%)`,
        clipPath: 'polygon(10% 0, 90% 0, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0 85%, 0 15%)',
        border: `1px solid ${C.green}`,
        boxShadow: `0 0 12px rgba(0,255,100,0.3)`,
      }} />
      {/* Chest detail */}
      <div style={{
        position: 'absolute',
        top: 42,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 4,
        background: C.green,
        boxShadow: `0 0 8px ${C.green}`,
        zIndex: 1,
      }} />
      {/* Left arm */}
      <div style={{
        position: 'absolute',
        top: 35,
        left: 2,
        width: 12,
        height: 50,
        background: C.darkGreen,
        border: `1px solid ${C.green}`,
        transform: 'rotate(-8deg)',
        transformOrigin: 'top center',
      }} />
      {/* Right arm — holding gun */}
      <div style={{
        position: 'absolute',
        top: 35,
        right: -6,
        width: 12,
        height: 55,
        background: C.darkGreen,
        border: `1px solid ${C.green}`,
        transform: 'rotate(12deg)',
        transformOrigin: 'top center',
      }} />
      {/* Gun */}
      <div style={{
        position: 'absolute',
        top: 68,
        right: -22,
        width: 28,
        height: 8,
        background: '#333',
        border: `1px solid ${C.textMid}`,
        transform: 'rotate(12deg)',
      }} />
      <div style={{
        position: 'absolute',
        top: 64,
        right: -30,
        width: 12,
        height: 4,
        background: C.red,
        boxShadow: `0 0 8px ${C.red}`,
        transform: 'rotate(12deg)',
      }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute',
        top: 92,
        left: 10,
        width: 16,
        height: 60,
        background: C.darkGreen,
        border: `1px solid rgba(0,255,100,0.4)`,
        transform: 'rotate(4deg)',
        transformOrigin: 'top center',
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute',
        top: 92,
        right: 10,
        width: 16,
        height: 60,
        background: C.darkGreen,
        border: `1px solid rgba(0,255,100,0.4)`,
        transform: 'rotate(-4deg)',
        transformOrigin: 'top center',
      }} />
      {/* Boots */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 4,
        width: 22,
        height: 10,
        background: '#111',
        border: `1px solid ${C.textMid}`,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 4,
        width: 22,
        height: 10,
        background: '#111',
        border: `1px solid ${C.textMid}`,
      }} />
      {/* Glow shadow */}
      <div style={{
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 60,
        height: 10,
        background: `radial-gradient(ellipse, rgba(0,255,100,0.3) 0%, transparent 70%)`,
      }} />
    </div>
  )
}

// ─── PARALLAX HERO ────────────────────────────────────────────────────────────

function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollFrac, setScrollFrac] = useState(0)
  const [skyY, setSkyY] = useState(0)
  const [mountY, setMountY] = useState(0)
  const [cityY, setCityY] = useState(0)
  const [groundY, setGroundY] = useState(0)
  const rafRef = useRef<number | null>(null)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const total = sectionRef.current.offsetHeight - window.innerHeight
    const scrolled = -rect.top
    const frac = Math.max(0, Math.min(1, scrolled / total))
    setScrollFrac(frac)
    setSkyY(frac * 0.1 * 300)
    setMountY(frac * 0.3 * 300)
    setCityY(frac * 0.6 * 300)
    setGroundY(frac * 1.0 * 300)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(handleScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        height: '250vh',
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: C.bg,
      }}>
        {/* SKY layer — speed 0.1x */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${skyY}px)`,
          background: `linear-gradient(180deg, #020a04 0%, #041a08 40%, #061406 100%)`,
        }}>
          {/* Stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() > 0.8 ? 3 : 1.5,
              height: Math.random() > 0.8 ? 3 : 1.5,
              borderRadius: '50%',
              background: C.green,
              opacity: Math.random() * 0.6 + 0.2,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px ${C.green}`,
            }} />
          ))}
        </div>

        {/* MOUNTAINS layer — speed 0.3x */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${mountY}px)`,
          height: '55%',
        }}>
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="0,400 120,180 240,280 360,120 480,220 600,80 720,200 840,100 960,240 1080,140 1200,260 1320,160 1440,220 1440,400" fill="#0d2010" />
            <polygon points="0,400 80,260 200,320 320,200 440,280 560,160 680,250 800,180 920,300 1040,200 1160,310 1280,220 1440,270 1440,400" fill="#0a1a0c" opacity="0.8" />
            {/* Mountain ridgeline glow */}
            <polyline points="0,400 120,180 240,280 360,120 480,220 600,80 720,200 840,100 960,240 1080,140 1200,260 1320,160 1440,220" fill="none" stroke={C.green} strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        {/* CITY layer — speed 0.6x */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${cityY}px)`,
          height: '45%',
        }}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            {/* Buildings */}
            {[
              [0, 200, 80, 120], [90, 170, 60, 150], [160, 140, 100, 180], [270, 220, 50, 100],
              [330, 100, 120, 220], [460, 180, 70, 140], [540, 130, 90, 190], [640, 160, 110, 160],
              [760, 90, 80, 230], [850, 200, 60, 120], [920, 150, 100, 170], [1030, 120, 70, 200],
              [1110, 180, 90, 140], [1210, 100, 80, 220], [1300, 160, 140, 160],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={i % 3 === 0 ? '#0c1e0e' : '#081408'} stroke={C.green} strokeWidth="0.5" strokeOpacity="0.2" />
            ))}
            {/* Windows */}
            {[
              [20, 220, 14, 10], [44, 220, 14, 10], [20, 240, 14, 10], [44, 240, 14, 10],
              [180, 160, 14, 8], [204, 160, 14, 8], [180, 178, 14, 8],
              [360, 130, 16, 10], [390, 130, 16, 10], [360, 150, 16, 10], [390, 150, 16, 10],
              [780, 120, 14, 10], [804, 120, 14, 10], [780, 140, 14, 10],
              [930, 170, 14, 10], [954, 170, 14, 10], [930, 190, 14, 10],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={C.green} opacity={Math.random() > 0.4 ? 0.6 : 0.1} />
            ))}
            {/* Horizon glow */}
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
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${groundY}px)`,
          height: '18%',
          background: `linear-gradient(180deg, ${C.darkGreen} 0%, #010801 100%)`,
          borderTop: `1px solid rgba(0,255,100,0.4)`,
          boxShadow: `0 -4px 30px rgba(0,255,100,0.15)`,
        }}>
          {/* Ground grid lines */}
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
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
          position: 'absolute',
          bottom: '18%',
          left: '8%',
          zIndex: 10,
          transform: `translateX(${scrollFrac * 65}vw)`,
          transition: 'transform 0.08s linear',
        }}>
          <CharacterSilhouette scrollProgress={scrollFrac} />
        </div>

        {/* HERO TEXT */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: 0,
          right: 0,
          padding: '0 40px',
          textAlign: 'center',
          zIndex: 20,
          fontFamily: "'Courier New', monospace",
        }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16, textTransform: 'uppercase' }}>
            GHOST PROTOCOL ESPORTS — EST. 2019
          </div>
          <h1
            className="glitch-text"
            data-text="ENTER THE VOID"
            style={{
              fontSize: 'clamp(48px, 10vw, 120px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: 24,
              textShadow: `0 0 60px rgba(0,255,100,0.2)`,
            }}
          >
            ENTER THE VOID
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            color: C.textMid,
            fontSize: 13,
            letterSpacing: '0.3em',
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
            position: 'absolute',
            bottom: '22%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: C.textDim,
            fontSize: 10,
            letterSpacing: '0.3em',
          }}
        >
          <span>SCROLL TO ENGAGE</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(180deg, ${C.green}, transparent)` }} />
        </motion.div>

        {/* Corner HUD elements */}
        <div style={{ position: 'absolute', top: 80, left: 20, fontFamily: "'Courier New', monospace", fontSize: 10, color: C.textDim, letterSpacing: '0.1em', zIndex: 20 }}>
          <div>LAT: 48.8566° N</div>
          <div>LNG: 2.3522° E</div>
          <div style={{ color: C.green, marginTop: 4 }}>STATUS: ACTIVE</div>
        </div>
        <div style={{ position: 'absolute', top: 80, right: 20, fontFamily: "'Courier New', monospace", fontSize: 10, color: C.textDim, letterSpacing: '0.1em', textAlign: 'right', zIndex: 20 }}>
          <div>PING: 4ms</div>
          <div>FPS: 240</div>
          <div style={{ color: C.green, marginTop: 4 }}>RANK: LEGENDARY</div>
        </div>
      </div>
    </section>
  )
}

// ─── STICKY GAME MODES ────────────────────────────────────────────────────────

function GameModesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeMode, setActiveMode] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const total = sectionRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const frac = Math.max(0, Math.min(0.99, scrolled / total))
      const idx = Math.floor(frac * GAME_MODES.length)
      setActiveMode(Math.min(idx, GAME_MODES.length - 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="modes"
      style={{
        position: 'relative',
        height: `${GAME_MODES.length * 100}vh`,
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
      }}>
        {/* Section label */}
        <div style={{
          position: 'absolute',
          top: 80,
          left: 40,
          color: C.textDim,
          fontSize: 11,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
        }}>
          <span style={{ color: C.green }}>02</span> / GAME MODES
        </div>
        {/* Mode indicator */}
        <div style={{
          position: 'absolute',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {GAME_MODES.map((_, i) => (
            <div key={i} style={{
              width: 3,
              height: i === activeMode ? 40 : 12,
              background: i === activeMode ? C.green : C.textDim,
              boxShadow: i === activeMode ? `0 0 10px ${C.green}` : 'none',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {GAME_MODES.map((mode, i) =>
            i === activeMode ? (
              <motion.div
                key={mode.id}
                initial={{ x: 80, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -80, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  maxWidth: 800,
                  width: '100%',
                }}
              >
                <div style={{
                  background: C.gray,
                  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)',
                  padding: '48px 56px',
                  border: `1px solid rgba(0,255,100,0.15)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Accent border */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    background: mode.color,
                    boxShadow: `0 0 20px ${mode.color}`,
                  }} />
                  <div style={{ fontSize: 11, color: mode.color, letterSpacing: '0.3em', marginBottom: 16 }}>
                    {mode.tag}
                  </div>
                  <h2
                    className="glitch-text"
                    data-text={mode.title}
                    style={{
                      fontSize: 'clamp(40px, 6vw, 72px)',
                      fontWeight: 900,
                      color: C.white,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {mode.title}
                  </h2>
                  <div style={{
                    fontSize: 13,
                    color: mode.color,
                    letterSpacing: '0.25em',
                    marginBottom: 32,
                    textTransform: 'uppercase',
                  }}>
                    {mode.sub}
                  </div>
                  <p style={{
                    fontSize: 15,
                    color: C.textMid,
                    lineHeight: 1.7,
                    maxWidth: 520,
                    marginBottom: 40,
                  }}>
                    {mode.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                    <div>
                      <div style={{
                        fontSize: 'clamp(32px, 5vw, 56px)',
                        fontWeight: 900,
                        color: mode.color,
                        textShadow: `0 0 20px ${mode.color}`,
                        letterSpacing: '0.05em',
                      }}>
                        {mode.stat[0]}
                      </div>
                      <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.3em' }}>
                        {mode.stat[1]}
                      </div>
                    </div>
                    <button style={{
                      padding: '14px 32px',
                      background: 'transparent',
                      border: `1px solid ${mode.color}`,
                      color: mode.color,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: `0 0 12px rgba(0,255,100,0.1)`,
                      transition: 'all 0.2s',
                    }}>
                      PLAY NOW
                    </button>
                  </div>
                  {/* Progress */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: C.darkGreen,
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${((i + 1) / GAME_MODES.length) * 100}%`,
                      background: mode.color,
                      boxShadow: `0 0 8px ${mode.color}`,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────

function NeonStatCounter({ value, label, format }: { value: number; label: string; format?: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 1800
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(value, Math.round(increment * step))
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, value])

  const display = format ? format(count) : count.toLocaleString()

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '32px 24px' }}>
      <div
        className="neon-num"
        style={{
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 900,
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.05em',
          marginBottom: 12,
        }}
      >
        {display}
      </div>
      <div style={{
        fontSize: 10,
        color: C.textDim,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        fontFamily: "'Courier New', monospace",
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── TEAM STATS SECTION ───────────────────────────────────────────────────────

function TeamStatsSection() {
  return (
    <section style={{
      background: C.gray,
      clipPath: 'polygon(0 40px, 100% 0, 100% calc(100% - 40px), 0 100%)',
      padding: '120px 40px',
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.green }}>03</span> / TEAM LEGACY
          </div>
          <h2
            className="glitch-text"
            data-text="THE NUMBERS"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            THE NUMBERS
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2,
        }}>
          {TEAM_STATS.map((stat, i) => (
            <div
              key={i}
              className="neon-border"
              style={{
                background: C.bg,
                border: `1px solid rgba(0,255,100,0.2)`,
                padding: '4px',
              }}
            >
              <NeonStatCounter value={stat.value} label={stat.label} format={stat.format} />
            </div>
          ))}
        </div>

        {/* Roster table */}
        <div style={{ marginTop: 80 }}>
          <div style={{
            fontSize: 11,
            color: C.green,
            letterSpacing: '0.4em',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid rgba(0,255,100,0.2)`,
          }}>
            ACTIVE ROSTER — SEASON 6
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Courier New', monospace" }}>
              <thead>
                <tr style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  {['HANDLE', 'ROLE', 'PLAYER', 'KPR', 'K/D', 'COUNTRY'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((player, i) => (
                  <motion.tr
                    key={player.handle}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      borderTop: '1px solid rgba(0,255,100,0.08)',
                      cursor: 'default',
                    }}
                  >
                    <td style={{ padding: '16px', color: C.green, fontWeight: 700, fontSize: 14, letterSpacing: '0.1em' }}>
                      {player.handle}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        border: `1px solid rgba(0,255,100,0.3)`,
                        color: C.green,
                        letterSpacing: '0.2em',
                      }}>
                        {player.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: C.textMid, fontSize: 13 }}>{player.real}</td>
                    <td style={{ padding: '16px', color: C.white, fontSize: 13 }}>{player.kills}</td>
                    <td style={{ padding: '16px', color: C.red, fontSize: 13, fontWeight: 700 }}>{player.kd}</td>
                    <td style={{ padding: '16px', color: C.textDim, fontSize: 12 }}>{player.country}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TOURNAMENT BRACKET ───────────────────────────────────────────────────────

function TournamentBracket() {
  return (
    <section style={{
      background: C.bg,
      padding: '120px 40px',
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.green }}>04</span> / TOURNAMENT BRACKET
          </div>
          <h2
            className="glitch-text"
            data-text="WORLD FINALS 2026"
            style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            WORLD FINALS 2026
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 0, alignItems: 'center', overflowX: 'auto', paddingBottom: 20 }}>
          {BRACKET.map((round, ri) => (
            <div key={round.round} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ minWidth: 200 }}>
                <div style={{
                  fontSize: 10,
                  color: C.green,
                  letterSpacing: '0.4em',
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  {round.round}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: ri === 0 ? 8 : ri === 1 ? 80 : 160,
                }}>
                  {round.matches.map((match, mi) => (
                    <motion.div
                      key={mi}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ri * 0.15 + mi * 0.1 }}
                      style={{
                        border: `1px solid rgba(0,255,100,0.2)`,
                        overflow: 'hidden',
                      }}
                    >
                      {match.map((team, ti) => (
                        <div
                          key={ti}
                          style={{
                            padding: '10px 16px',
                            fontSize: 12,
                            letterSpacing: '0.15em',
                            color: team === 'NULLCORE' || team === 'HEXFIRE' ? C.green : C.textMid,
                            fontWeight: team === 'NULLCORE' || team === 'HEXFIRE' ? 700 : 400,
                            background: team === 'NULLCORE' || team === 'HEXFIRE' ? 'rgba(0,255,100,0.06)' : 'transparent',
                            borderBottom: ti === 0 ? '1px solid rgba(0,255,100,0.1)' : 'none',
                            textShadow: (team === 'NULLCORE' || team === 'HEXFIRE') ? `0 0 10px ${C.green}` : 'none',
                          }}
                        >
                          {team}
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
              {ri < BRACKET.length - 1 && (
                <div style={{
                  width: 40,
                  height: 2,
                  background: `linear-gradient(90deg, rgba(0,255,100,0.3), rgba(0,255,100,0.1))`,
                  flexShrink: 0,
                }} />
              )}
              {ri === BRACKET.length - 1 && (
                <div style={{ marginLeft: 24 }}>
                  <div style={{
                    padding: '20px 24px',
                    border: `2px solid ${C.green}`,
                    boxShadow: `0 0 30px rgba(0,255,100,0.3), inset 0 0 20px rgba(0,255,100,0.05)`,
                    background: 'rgba(0,255,100,0.04)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.4em', marginBottom: 12 }}>CHAMPION</div>
                    <div style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: C.green,
                      letterSpacing: '0.1em',
                      textShadow: `0 0 20px ${C.green}`,
                    }}>
                      NULLCORE
                    </div>
                    <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.2em', marginTop: 8, opacity: 0.7 }}>
                      $2.1M PRIZE
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MERCHANDISE ─────────────────────────────────────────────────────────────

function MerchandiseSection() {
  return (
    <section style={{
      background: C.gray,
      clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)',
      padding: '120px 40px 120px 80px',
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.green }}>05</span> / MERCHANDISE
          </div>
          <h2
            className="glitch-text"
            data-text="GEAR UP"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            GEAR UP
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 2,
        }}>
          {MERCH.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: C.bg,
                border: `1px solid rgba(0,255,100,0.12)`,
                padding: '32px 24px',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {item.hot && (
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 9,
                  padding: '4px 8px',
                  background: C.red,
                  color: C.white,
                  letterSpacing: '0.2em',
                  boxShadow: `0 0 10px ${C.red}`,
                }}>
                  HOT
                </div>
              )}
              {/* Product visual placeholder */}
              <div style={{
                width: '100%',
                height: 160,
                background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.bg} 100%)`,
                border: '1px solid rgba(0,255,100,0.1)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  border: `2px solid rgba(0,255,100,0.3)`,
                  clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                  background: 'rgba(0,255,100,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.textDim,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                }}>
                  GP
                </div>
              </div>
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.4em', marginBottom: 8 }}>{item.tag}</div>
              <div style={{ fontSize: 13, color: C.white, letterSpacing: '0.1em', marginBottom: 16, fontWeight: 700 }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 22, color: C.green, fontWeight: 900, textShadow: `0 0 10px ${C.green}` }}>
                  ${item.price}
                </span>
                <button style={{
                  padding: '8px 18px',
                  background: 'transparent',
                  border: `1px solid ${C.green}`,
                  color: C.green,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                }}>
                  ADD
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── RECRUITMENT CTA ──────────────────────────────────────────────────────────

function RecruitmentSection() {
  const [formState, setFormState] = useState({ handle: '', role: '', region: '', clips: '' })

  return (
    <section style={{
      background: C.bg,
      padding: '120px 40px',
      fontFamily: "'Courier New', monospace",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vw',
        border: '1px solid rgba(0,255,100,0.03)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        height: '50vw',
        border: '1px solid rgba(0,255,100,0.05)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.red }}>06</span> / RECRUITMENT
          </div>
          <h2
            className="glitch-text"
            data-text="JOIN THE VOID"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            JOIN THE VOID
          </h2>
          <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, letterSpacing: '0.05em', maxWidth: 500, margin: '0 auto' }}>
            WE DON&apos;T TAKE GOOD PLAYERS. WE TAKE KILLERS. IF YOUR KD IS &gt; 10 AND YOUR EGO FITS IN A 1080P MONITOR, APPLY.
          </p>
        </div>

        <div style={{
          background: C.gray,
          border: `1px solid rgba(0,255,100,0.2)`,
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)',
          padding: '48px',
        }}>
          <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.4em', marginBottom: 32 }}>
            // APPLICATION_FORM.EXE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {[
              { label: 'IN-GAME HANDLE', key: 'handle', placeholder: 'WRAITHX' },
              { label: 'PREFERRED ROLE', key: 'role', placeholder: 'IGL / ENTRY / AWP / SUPPORT' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
                  {field.label}
                </label>
                <input
                  value={formState[field.key as keyof typeof formState]}
                  onChange={e => setFormState(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: `1px solid rgba(0,255,100,0.2)`,
                    padding: '12px 16px',
                    color: C.white,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
              REGION
            </label>
            <select
              value={formState.region}
              onChange={e => setFormState(prev => ({ ...prev, region: e.target.value }))}
              style={{
                width: '100%',
                background: C.gray,
                border: `1px solid rgba(0,255,100,0.2)`,
                padding: '12px 16px',
                color: C.textMid,
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                letterSpacing: '0.1em',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">SELECT REGION</option>
              <option value="eu">EU — EUROPE</option>
              <option value="na">NA — NORTH AMERICA</option>
              <option value="apac">APAC — ASIA PACIFIC</option>
              <option value="latam">LATAM — LATIN AMERICA</option>
            </select>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
              CLIP LINKS / VOD URL
            </label>
            <textarea
              value={formState.clips}
              onChange={e => setFormState(prev => ({ ...prev, clips: e.target.value }))}
              placeholder="https://clips.twitch.tv/... or YouTube VOD link"
              rows={3}
              style={{
                width: '100%',
                background: 'transparent',
                border: `1px solid rgba(0,255,100,0.2)`,
                padding: '12px 16px',
                color: C.white,
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                letterSpacing: '0.05em',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={e => e.preventDefault()}
            style={{
              width: '100%',
              padding: '18px',
              background: C.green,
              border: 'none',
              color: C.bg,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: `0 0 30px rgba(0,255,100,0.3)`,
            }}
          >
            SUBMIT APPLICATION
          </motion.button>
          <div style={{ marginTop: 16, fontSize: 10, color: C.textDim, letterSpacing: '0.2em', textAlign: 'center' }}>
            RESPONSE TIME: 48-72 HRS. WE REVIEW EVERY CLIP. NO BS.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => setScrolled(v > 0.02))
    return unsub
  }, [scrollYProgress])

  const NAV_LINKS = ['MODES', 'TEAM', 'BRACKET', 'MERCH', 'JOIN']
  const NAV_HREFS = ['#modes', '#team', '#bracket', '#merch', '#recruit']

  return (
    <>
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: C.green,
          boxShadow: `0 0 10px ${C.green}`,
          transformOrigin: '0%',
          zIndex: 9999,
        }}
      />
      <nav style={{
        position: 'fixed',
        top: 2,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '16px 40px',
        background: scrolled ? 'rgba(6,10,6,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid rgba(0,255,100,0.1)` : '1px solid transparent',
        transition: 'all 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'Courier New', monospace",
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 900,
          color: C.green,
          letterSpacing: '0.15em',
          textShadow: `0 0 20px ${C.green}`,
        }}>
          GHOST<span style={{ color: C.white }}>PROTOCOL</span>
        </div>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href={NAV_HREFS[i]}
              style={{
                color: C.textMid,
                fontSize: 11,
                letterSpacing: '0.25em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.green)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMid)}
            >
              {link}
            </a>
          ))}
          <a
            href="#recruit"
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: `1px solid ${C.green}`,
              color: C.green,
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: '0.25em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.green
              e.currentTarget.style.color = C.bg
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.green
            }}
          >
            RECRUIT
          </a>
        </div>
      </nav>
    </>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      background: C.gray,
      borderTop: `1px solid rgba(0,255,100,0.15)`,
      padding: '64px 40px 40px',
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.green, letterSpacing: '0.12em', marginBottom: 16, textShadow: `0 0 15px ${C.green}` }}>
              GHOST<span style={{ color: C.white }}>PROTOCOL</span>
            </div>
            <p style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7, letterSpacing: '0.05em', maxWidth: 240 }}>
              PROFESSIONAL ESPORTS ORGANIZATION. WE COMPETE. WE WIN. WE REBUILD.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.4em', marginBottom: 20 }}>NAVIGATE</div>
            {['HOME', 'GAME MODES', 'TEAM', 'BRACKET', 'MERCH', 'RECRUITMENT'].map(l => (
              <div key={l} style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.2em', marginBottom: 12 }}>
                <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}>
                  {l}
                </a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.4em', marginBottom: 20 }}>SOCIALS</div>
            {['TWITCH', 'YOUTUBE', 'TWITTER/X', 'DISCORD', 'INSTAGRAM'].map(s => (
              <div key={s} style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.2em', marginBottom: 12, cursor: 'pointer' }}>
                {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.4em', marginBottom: 20 }}>CONTACT</div>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.05em', lineHeight: 1.8 }}>
              <div>PARTNERSHIPS:</div>
              <div style={{ color: C.textMid }}>business@ghostprotocol.gg</div>
              <div style={{ marginTop: 12 }}>RECRUITMENT:</div>
              <div style={{ color: C.textMid }}>tryout@ghostprotocol.gg</div>
              <div style={{ marginTop: 12 }}>PRESS:</div>
              <div style={{ color: C.textMid }}>press@ghostprotocol.gg</div>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(0,255,100,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10,
          color: C.textDim,
          letterSpacing: '0.2em',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span>© 2026 GHOST PROTOCOL ESPORTS. ALL RIGHTS RESERVED.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>PRIVACY</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>COOKIES</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────

export default function GamingTemplatePage() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <CRTBoot onDone={() => setBooted(true)} />

      <motion.div
        className="scanline-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: C.bg,
          color: C.white,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Nav />
        <HeroSection />
        <GameModesSection />
        <section id="team">
          <TeamStatsSection />
        </section>
        <section id="bracket">
          <TournamentBracket />
        </section>
        <section id="merch">
          <MerchandiseSection />
        </section>
        <section id="recruit">
          <RecruitmentSection />
        </section>
        <Footer />
      </motion.div>
    </>
  )
}
