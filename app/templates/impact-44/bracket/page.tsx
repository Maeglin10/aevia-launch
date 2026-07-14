"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, BRACKET } from "../shared";

export default function BracketPage() {
  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.green }}>04</span> / TOURNAMENT BRACKET
          </div>
          <h1
            className="glitch-text"
            data-text="WORLD FINALS 2026"
            style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            WORLD FINALS 2026
          </h1>
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
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ri * 0.15 + mi * 0.1 }}
                      style={{
                        border: `1px solid rgba(0,255,100,0.2)`,
                        overflow: 'hidden',
                        background: C.gray,
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
    </div>
  );
}
