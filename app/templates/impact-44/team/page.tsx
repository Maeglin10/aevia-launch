"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, TEAM_STATS, ROSTER, NeonStatCounter } from "../shared";

export default function TeamPage() {
  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.green }}>03</span> / TEAM LEGACY
          </div>
          <h1
            className="glitch-text"
            data-text="THE NUMBERS"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            THE NUMBERS
          </h1>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 80,
        }}>
          {TEAM_STATS.map((stat, i) => (
            <div
              key={i}
              className="neon-border"
              style={{
                background: C.gray,
                border: `1px solid rgba(0,255,100,0.2)`,
                padding: '4px',
              }}
            >
              <NeonStatCounter value={stat.value} label={stat.label} format={stat.format} />
            </div>
          ))}
        </div>

        <div>
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    animate={{ opacity: 1, x: 0 }}
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
    </div>
  );
}
