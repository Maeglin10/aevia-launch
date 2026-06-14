"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Eye, Layers, Globe, Check } from "lucide-react";
import { C, SERVICES } from "../shared";

const ICONS = [PenTool, Eye, Layers, Globe];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: "80px 40px",
        background: C.bgAlt,
        minHeight: "80vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: C.accent,
            textTransform: "uppercase",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
          What We Do
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: C.text,
            marginBottom: "64px",
            lineHeight: 1.05,
          }}
        >
          Four disciplines.
          <br />
          <span style={{ color: C.textMuted }}>One obsession.</span>
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }} className="grid-hero-68">
          {SERVICES.map((svc, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isActive = activeService === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setActiveService(isActive ? null : i)}
                style={{
                  padding: "48px",
                  background: isActive ? C.bgCard : "transparent",
                  border: `1px solid ${isActive ? C.accent : C.border}`,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "4px",
                      background: isActive ? C.accent : C.border,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    <Icon size={22} style={{ color: isActive ? C.white : C.textMuted }} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isActive ? C.accent : C.textMuted,
                      letterSpacing: "0.05em",
                      transition: "color 0.3s",
                    }}
                  >
                    {svc.price}
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: C.text,
                    marginBottom: "16px",
                  }}
                >
                  {svc.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: C.textMuted,
                    marginBottom: "24px",
                  }}
                >
                  {svc.desc}
                </p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ paddingTop: "16px", borderTop: `1px solid ${C.border}` }}>
                        {svc.deliverables.map((d) => (
                          <div
                            key={d}
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: "13px",
                              color: C.textMuted,
                              padding: "8px 0",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <Check size={14} style={{ color: C.accent, flexShrink: 0 }} />
                            {d}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
