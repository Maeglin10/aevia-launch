"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { C, PROJECTS, TextReveal, SpotlightCard } from "../shared";

export default function ProjetsPage() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh", padding: "6rem 3rem" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
          <div>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              Projets Réalisés
            </TextReveal>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {PROJECTS.map((project, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <SpotlightCard
                key={project.id}
                style={{ borderTop: i === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}` }}
              >
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => setActiveProject(activeProject === i ? null : i)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "5rem 1fr auto auto auto", gap: "3rem", padding: "2rem 0", alignItems: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.textDim }}>
                      {project.id}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                        {project.title}
                      </div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted, marginTop: "0.2rem" }}>
                        {project.type}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                      {project.location}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                      {project.area}
                    </div>
                    <div>
                      <motion.div
                        animate={{ rotate: activeProject === i ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, borderRadius: "50%" }}
                      >
                        <svg viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                          <line x1="12" y1="5" x2="12" y2="19" stroke={C.text} strokeWidth="1.5" />
                          <line x1="5" y1="12" x2="19" y2="12" stroke={C.text} strokeWidth="1.5" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeProject === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "5rem 1fr 1fr", gap: "3rem", paddingBottom: "2.5rem" }}>
                          <div />
                          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "55ch" }}>
                            {project.desc}
                          </p>
                          <div>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                              {project.tags.map((tag) => (
                                <span key={tag} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, color: C.textMuted }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textDim }}>
                              {project.year} · {project.status}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
