"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import {
  C,
  SERVICES,
  Reveal,
  NeonDivider,
  SectionLabel,
  GlitchHeadline,
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
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
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
    <main style={{ background: C.BG, padding: "4rem 2rem 8rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel code="[MODULE: SERVICES.EXE]" color={C.CYAN} />
            <GlitchHeadline
              text="WHAT WE"
              outlineText="BUILD"
              outlineColor={C.PINK}
            />
            <p
              style={{
                fontSize: "0.78rem",
                fontFamily: "'Courier New', monospace",
                color: "#6666aa",
                letterSpacing: "0.08em",
                lineHeight: 1.9,
                maxWidth: "520px",
              }}
            >
              SIX CORE CAPABILITIES. INFINITE PERMUTATIONS. FROM PIXEL-PERFECT
              DESIGN TO PLANETARY-SCALE INFRASTRUCTURE — WE EXECUTE ACROSS THE
              FULL STACK.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
            gap: "1px",
            background: `${C.PINK}18`,
          }}
        >
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Reveal key={svc.code} delay={i * 0.09}>
                <div
                  className="glitch-card"
                  data-text={svc.name}
                  style={{
                    background: C.CARD_BG,
                    padding: "2.8rem 2.2rem",
                    position: "relative",
                    transition: "background 0.3s ease",
                    minHeight: "280px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      `${svc.color}0a`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = C.CARD_BG;
                  }}
                >
                  {/* Top neon line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, ${svc.color}88, ${svc.color}, ${svc.color}88)`,
                      boxShadow: `0 0 10px ${svc.color}`,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <Icon
                      size={28}
                      style={{
                        color: svc.color,
                        filter: `drop-shadow(0 0 10px ${svc.color})`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.55rem",
                        fontFamily: "'Courier New', monospace",
                        color: `${svc.color}77`,
                        letterSpacing: "0.15em",
                      }}
                    >
                      {svc.code}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 900,
                      fontFamily: "'Courier New', monospace",
                      color: "#fff",
                      letterSpacing: "0.1em",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {svc.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontFamily: "'Courier New', monospace",
                      color: "#9999bb",
                      lineHeight: 1.8,
                      letterSpacing: "0.05em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {svc.desc}
                  </p>

                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.52rem",
                          fontFamily: "'Courier New', monospace",
                          border: `1px solid ${svc.color}44`,
                          color: svc.color,
                          padding: "0.25rem 0.6rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
