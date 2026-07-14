"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C, MERCH } from "../shared";

export default function MerchPage() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
              <span style={{ color: C.green }}>05</span> / GEAR STORE
            </div>
            <h1
              className="glitch-text"
              data-text="GEAR UP"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 900,
                color: C.white,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              GEAR UP
            </h1>
          </div>
          <div style={{ padding: "12px 24px", border: `1px solid ${C.green}`, color: C.green, fontSize: 12, letterSpacing: "0.2em", background: "rgba(0,255,100,0.05)", boxShadow: `0 0 10px rgba(0,255,100,0.1)` }}>
            CART CONSOLE: {cartCount} ITEMS
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {MERCH.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: C.gray,
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
                height: 180,
                background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.bg} 100%)`,
                border: '1px solid rgba(0,255,100,0.1)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 85,
                  height: 85,
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
                <button
                  onClick={() => setCartCount(c => c + 1)}
                  style={{
                    padding: '8px 18px',
                    background: 'transparent',
                    border: `1px solid ${C.green}`,
                    color: C.green,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                  }}
                >
                  ADD
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
