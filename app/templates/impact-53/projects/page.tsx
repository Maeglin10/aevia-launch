"use client";

import React from "react";
import {
  C,
  SERVICES,
  Reveal,
  ServiceRow,
  SectionLabel,
  SectionHeading,
} from "../shared";

export default function ServicesPage() {
  return (
    <main style={{ background: C.black, padding: "6rem 2.5rem 8rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>OUR CAPABILITIES</SectionLabel>
            <SectionHeading>SERVICES</SectionHeading>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.8,
                maxWidth: "500px",
                marginTop: "2rem",
              }}
            >
              WE OWN THE CREATIVE PROCESS FROM CONCEPT TO DEPLOYMENT. FOUR CORE
              MODULES DESIGNED TO TRANSFORM BRAND LOGICS.
            </p>
          </div>
        </Reveal>

        <div style={{ borderTop: `1px solid ${C.dim}` }}>
          {SERVICES.map((service, idx) => (
            <ServiceRow key={service.num} service={service} index={idx} />
          ))}
        </div>
      </div>
    </main>
  );
}
