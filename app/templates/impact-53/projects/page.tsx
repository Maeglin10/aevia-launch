"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
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
