"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  bg: '#060a06',
  green: '#00ff64',
  red: '#ff3c00',
  darkGreen: '#003318',
  midGreen: '#00cc50',
  gray: '#1a2a1a',
  textDim: '#4a6a4a',
  textMid: '#7aaa7a',
  white: '#e8ffe8',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'MODES', href: '/templates/impact-44/modes' },
  { label: 'TEAM', href: '/templates/impact-44/team' },
  { label: 'BRACKET', href: '/templates/impact-44/bracket' },
  { label: 'MERCH', href: '/templates/impact-44/merch' },
  { label: 'JOIN', href: '/templates/impact-44/recruit' },
];

export const GAME_MODES = [
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
];

export const TEAM_STATS = [
  { value: 847, label: 'TOURNAMENT WINS', suffix: '' },
  { value: 23, label: 'WORLD TITLES', suffix: '' },
  { value: 4200000, label: 'PRIZE MONEY', suffix: '$', format: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
  { value: 312, label: 'ACTIVE PLAYERS', suffix: '' },
];

export const ROSTER = [
  { handle: 'WRAITHX', role: 'IGL', real: 'Marcus Chen', kills: '4.8', kd: '12.4', country: 'KR' },
  { handle: 'NULLBYTE', role: 'AWP', real: 'Lena Voigt', kills: '5.2', kd: '14.1', country: 'DE' },
  { handle: 'GHOSTNET', role: 'ENTRY', real: 'Rafa Santos', kills: '6.1', kd: '10.8', country: 'BR' },
  { handle: 'HEXFIRE', role: 'SUPPORT', real: 'Yuki Tanaka', kills: '3.9', kd: '11.3', country: 'JP' },
  { handle: 'VOIDPILOT', role: 'LURK', real: 'Amir Nazari', kills: '4.4', kd: '13.7', country: 'IR' },
];

export const MERCH = [
  { name: 'GHOST PROTOCOL JERSEY', price: '89', tag: 'LIMITED DROP', hot: true },
  { name: 'NULL-BYTE HOODIE', price: '120', tag: 'SEASON 6', hot: false },
  { name: 'WRAITHX SIGNATURE CAP', price: '45', tag: 'BESTSELLER', hot: true },
  { name: 'TEAM BACKPACK V2', price: '95', tag: 'NEW ARRIVAL', hot: false },
];

export const BRACKET = [
  { round: 'QF', matches: [['NULLCORE', 'GHOST.GG'], ['WRAITHX', 'BYTE_FORCE'], ['HEXFIRE', 'DARKNET'], ['VOIDPILOT', 'ZERO_DAY']] },
  { round: 'SF', matches: [['NULLCORE', 'WRAITHX'], ['HEXFIRE', 'VOIDPILOT']] },
  { round: 'FINAL', matches: [['NULLCORE', 'HEXFIRE']] },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

export function CRTBoot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const BOOT_LINES = [
    '> INITIALIZING VOIDCORE ENGINE v7.4.2...',
    '> LOADING COMBAT SUBSYSTEMS...',
    '> CONNECTING TO TOURNAMENT SERVERS...',
    '> VERIFYING PLAYER CREDENTIALS...',
    '> RENDERING PIPELINE: ACTIVE',
    '> ALL SYSTEMS NOMINAL',
    '> ENTERING THE VOID.',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase(1), 300);
        setTimeout(onDone, 800);
      }
    }, 110);
    return () => clearInterval(interval);
  }, []);

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
  );
}

export function CharacterSilhouette({ scrollProgress }: { scrollProgress: number }) {
  const x = scrollProgress * 60;
  const [bobY, setBobY] = useState(0);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setBobY(Math.sin(Date.now() / 400) * 3);
      requestAnimationFrame(tick);
    };
    tick();
    return () => { active = false; };
  }, []);

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
  );
}

export function NeonStatCounter({ value, label, format }: { value: number; label: string; format?: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(value, Math.round(increment * step));
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const display = format ? format(count) : count.toLocaleString();

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
  );
}
