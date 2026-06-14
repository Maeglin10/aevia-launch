"use client";

import React from "react";
import Link from "next/link";
import { PROJECTS, ProjectRow, C } from "../shared";

export default function WorkPage() {
  return (
    <section style={{ padding: "6rem 3rem", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }} className="flex-col md:row gap-4 items-stretch md:items-end">
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / SELECTED WORK
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, leading-snug pb-2 }}>
              Recent Projects
            </h2>
          </div>
        </div>

        {/* Project list */}
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
