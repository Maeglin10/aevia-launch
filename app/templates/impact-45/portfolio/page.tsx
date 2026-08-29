"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { Scissors } from "lucide-react";
import { C, portfolioItems } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PortfolioPage() {
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

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Portfolio</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Selected Work</h1>
        </div>

        <div style={{ columns: "3 280px", gap: 8 }}>
          {portfolioItems.map((item, i) => {
            const heights: Record<string, number> = { tall: 420, wide: 280, square: 320 };
            const h = heights[item.size];
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  height: h,
                  marginBottom: 8,
                  breakInside: "avoid",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: i % 2 === 0 ? C.bgCard : C.grayLight,
                  display: "block",
                  border: `1px solid ${C.border}`
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.grayLight}, ${C.bgCard})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scissors size={32} color={C.border} />
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10,10,10,0.88)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    opacity: hoveredId === item.id ? 1 : 0,
                    transition: "opacity 0.3s ease"
                  }}
                >
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 8px" }}>{item.style}</p>
                  <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, margin: "0 0 6px", fontWeight: 700 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textMuted, margin: 0 }}>by {item.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
