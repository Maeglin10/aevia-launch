"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AWARDS_LIST, C } from "../shared";

export default function StudioPage() {
  return (
    <section style={{ padding: "6rem 3rem", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
            / RECOGNITION
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.5rem" }}>
            Awards
          </h2>
        </div>
        {AWARDS_LIST.map((award, i) => {
          const ref = useRef<HTMLDivElement>(null);
          const inView = useInView(ref, { once: true });
          return (
            <motion.div
              key={award}
              ref={ref}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                padding: "1.5rem 0",
                borderBottom: i < AWARDS_LIST.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ width: "6px", height: "6px", background: C.violet, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
                {award}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
