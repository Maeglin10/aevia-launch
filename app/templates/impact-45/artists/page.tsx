"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { Scissors } from "lucide-react";
import { C, artists } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ArtistsPage() {
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
    <div style={{ background: C.bgAlt, minHeight: "100dvh", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 80, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>The Artists</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Deux maîtres. Un seul studio.</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="two-col">
          {artists.map((artist, i) => (
            <div
              key={artist.name}
              style={{ background: C.bgCard, padding: 48, position: "relative", overflow: "hidden", border: `1px solid ${C.border}` }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: i === 1 ? C.accent : C.gray }} />
              <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "'Cinzel', serif", fontSize: 80, color: "rgba(255,255,255,0.03)", fontWeight: 700, lineHeight: 1 }}>
                {i === 0 ? "I" : "II"}
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{ width: 64, height: 64, background: i === 0 ? C.accentLight : C.grayLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${i === 0 ? C.borderAccent : C.border}` }}>
                  <Scissors size={24} color={i === 0 ? C.accent : C.textMuted} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: C.white, margin: "0 0 4px", fontWeight: 700 }}>{artist.name}</h3>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.accent, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>{artist.role}</p>
                </div>
              </div>

              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>{artist.bio}</p>

              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textDim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Specialties</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {artist.styles.map((s) => (
                    <span key={s} style={{ border: `1px solid ${C.border}`, color: C.textMuted, padding: "4px 12px", fontSize: 12, fontFamily: "'Barlow', system-ui", letterSpacing: "0.04em" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                {[
                  { label: "Experience", val: artist.experience },
                  { label: "Lead Time", val: artist.bookingLead },
                  { label: "Starting At", val: artist.startingAt },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, fontWeight: 700 }}>{item.val}</div>
                    <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
