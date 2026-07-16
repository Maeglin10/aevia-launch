"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, C } from "../shared";

export default function ServicesPage() {
  return (
    <section style={{ padding: "6rem 3rem", background: C.bgLight, minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
            / WHAT WE DO
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: "1.15", paddingBottom: "0.5rem" }}>
            Services
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1px", background: C.border }}>
          {SERVICES.map((svc, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-60px" });
            return (
              <motion.div
                key={svc.title}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                whileHover={{ backgroundColor: C.bgCard }}
                style={{ background: C.bgLight, padding: "3rem", position: "relative", cursor: "default", transition: "background 0.3s" }}
              >
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.accent, marginBottom: "1.5rem" }}>
                  {svc.n}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.25rem" }}>
                  {svc.title}
                </h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.75 }}>
                  {svc.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
