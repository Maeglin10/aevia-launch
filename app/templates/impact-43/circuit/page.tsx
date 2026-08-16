"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { C, CIRCUIT_STEPS, CircuitStep, TextReveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function CircuitPage() {
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
    <div style={{ background: C.forest, minHeight: "100dvh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.sage,
                marginBottom: 16,
              }}
            >
              The Journey
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.charcoal,
                lineHeight: 1.1,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              The Thermal Circuit
            </h1>
          </TextReveal>
          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "#6b7265",
              lineHeight: 1.8,
              fontWeight: 300,
              maxWidth: 600,
              margin: "24px auto 0",
            }}
          >
            Our six-step thermal journey follows the ancient principle of contrast therapy — the deliberate alternation of heat and cold that activates the body's deepest healing mechanisms, strengthens the immune system, and stills the mind.
          </p>
        </div>

        <div style={{ background: C.cream, padding: "64px 48px", border: `1px solid ${C.mist}`, marginBottom: 64 }}>
          {CIRCUIT_STEPS.map((step, i) => (
            <CircuitStep key={step.step} step={step} index={i} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="two-col">
          <div style={{ background: C.charcoal, color: C.white, padding: 48, borderRadius: 2 }}>
            <h2 style={{ fontFamily: C.font, fontSize: 24, color: C.gold, marginBottom: 16, fontStyle: "italic" }}>
              Guidelines for the Circuit
            </h2>
            <ul style={{ fontFamily: C.fontSans, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, paddingLeft: 20 }}>
              <li style={{ marginBottom: 12 }}>Arrive 15 minutes before your scheduled slot.</li>
              <li style={{ marginBottom: 12 }}>Hydrate between each step with our botanical infusions.</li>
              <li style={{ marginBottom: 12 }}>Respect the silence of the chambers for all guests.</li>
              <li style={{ marginBottom: 12 }}>Robes, slippers, and towels are provided in your locker.</li>
            </ul>
          </div>
          <div style={{ background: C.cream, border: `1px solid ${C.mist}`, padding: 48, borderRadius: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontFamily: C.font, fontSize: 24, color: C.charcoal, marginBottom: 16, fontStyle: "italic" }}>
              Daily Admission
            </h2>
            <p style={{ fontFamily: C.fontSans, fontSize: 14, color: "#6b7265", lineHeight: 1.7, marginBottom: 20 }}>
              The thermal circuit is open from 7:00 AM to 9:00 PM daily. Admission is included with all packages or can be booked independently as a half-day session.
            </p>
            <span style={{ fontFamily: C.fontSans, fontSize: 13, color: C.sage, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Included in all packages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
