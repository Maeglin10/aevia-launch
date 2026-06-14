"use client";

import React from "react";
import Link from "next/link";
import { PROJECTS, SkewProjectItem, C } from "../shared";

export default function WorkPage() {
  return (
    <section style={{ padding: "5rem 3rem", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / SELECTED WORK
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.5rem" }}>
              Projects
            </h2>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {PROJECTS.map((project, i) => (
            <SkewProjectItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
