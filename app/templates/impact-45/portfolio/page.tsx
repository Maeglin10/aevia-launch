"use client";

import React, { useState } from "react";
import { Scissors } from "lucide-react";
import { C, portfolioItems } from "../shared";

export default function PortfolioPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Portfolio</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Selected Work</h1>
        </div>

        <div style={{ columns: "3 280px", gap: 8 }}>
          {portfolioItems.map((item, i) => {
            const heights: Record<string, number> = { tall: 420, wide: 280, square: 320 };
            const h = heights[item.size];
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  height: h,
                  marginBottom: 8,
                  breakInside: "avoid",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: i % 2 === 0 ? C.bgCard : C.grayLight,
                  display: "block",
                  border: `1px solid ${C.border}`
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.grayLight}, ${C.bgCard})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scissors size={32} color={C.border} />
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10,10,10,0.88)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    opacity: hoveredId === item.id ? 1 : 0,
                    transition: "opacity 0.3s ease"
                  }}
                >
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 8px" }}>{item.style}</p>
                  <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, margin: "0 0 6px", fontWeight: 700 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textMuted, margin: 0 }}>by {item.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
