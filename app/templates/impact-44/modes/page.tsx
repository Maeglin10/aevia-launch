"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, GAME_MODES } from "../shared";

export default function GameModesPage() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Section label */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        color: C.textDim,
        fontSize: 11,
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
      }}>
        <span style={{ color: C.green }}>02</span> / GAME MODES
      </div>

      {/* Mode indicators */}
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
          <button
            key={i}
            onClick={() => setActiveMode(i)}
            style={{
              width: 4,
              height: i === activeMode ? 40 : 12,
              background: i === activeMode ? C.green : C.textDim,
              boxShadow: i === activeMode ? `0 0 10px ${C.green}` : 'none',
              transition: 'all 0.3s ease',
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
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
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 4,
              height: '100%',
              background: GAME_MODES[activeMode].color,
              boxShadow: `0 0 20px ${GAME_MODES[activeMode].color}`,
            }} />
            <div style={{ fontSize: 11, color: GAME_MODES[activeMode].color, letterSpacing: '0.3em', marginBottom: 16 }}>
              {GAME_MODES[activeMode].tag}
            </div>
            <h2
              className="glitch-text"
              data-text={GAME_MODES[activeMode].title}
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
              {GAME_MODES[activeMode].title}
            </h2>
            <div style={{
              fontSize: 13,
              color: GAME_MODES[activeMode].color,
              letterSpacing: '0.25em',
              marginBottom: 32,
              textTransform: 'uppercase',
            }}>
              {GAME_MODES[activeMode].sub}
            </div>
            <p style={{
              fontSize: 15,
              color: C.textMid,
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: 40,
            }}>
              {GAME_MODES[activeMode].desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div>
                <div style={{
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 900,
                  color: GAME_MODES[activeMode].color,
                  textShadow: `0 0 20px ${GAME_MODES[activeMode].color}`,
                  letterSpacing: '0.05em',
                }}>
                  {GAME_MODES[activeMode].stat[0]}
                </div>
                <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.3em' }}>
                  {GAME_MODES[activeMode].stat[1]}
                </div>
              </div>
              <button
                onClick={() => alert(`Launching connection to tactical server for ${GAME_MODES[activeMode].title}...`)}
                style={{
                  padding: '14px 32px',
                  background: 'transparent',
                  border: `1px solid ${GAME_MODES[activeMode].color}`,
                  color: GAME_MODES[activeMode].color,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px rgba(0,255,100,0.1)`,
                  transition: 'all 0.2s',
                }}
              >
                PLAY NOW
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
