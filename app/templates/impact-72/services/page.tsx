"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
// @ts-nocheck

import React from "react";
import { C, SERVICES, TextReveal, ServiceCard } from "../shared";

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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", padding: "7rem 3rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1rem" }}>
            NOS MÉTIERS
          </div>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>
            Ce Que Nous Faisons
          </TextReveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "1px", background: C.border }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.code} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
