"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, C } from "../shared";

export default function ServicesPage() {
  return (
    <section style={{ padding: "6rem 3rem", background: C.bgCard, minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
            / SERVICES
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.5rem" }}>
            Ce Que Nous Faisons
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1px", background: C.border }}>
          {SERVICES.map((svc, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={svc.code}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                whileHover={{ backgroundColor: "#0E0E18" }}
                style={{ background: C.bgCard, padding: "3rem", transition: "background 0.3s" }}
              >
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", color: C.violet, marginBottom: "1.5rem" }}>
                  {svc.code}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: "0.75rem", letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.25rem" }}>
                  {svc.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.75 }}>
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
