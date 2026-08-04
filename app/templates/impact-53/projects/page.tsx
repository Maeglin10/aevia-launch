"use client";
import { useEffect, useState } from "react";

import React from "react";
import {
  C,
  SERVICES,
  Reveal,
  ServiceRow,
  SectionLabel,
  SectionHeading,
} from "../shared";


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function ServicesPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

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
