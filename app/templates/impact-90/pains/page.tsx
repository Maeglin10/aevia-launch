"use client";
import { clientName } from "@/lib/templates/clientContent";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const C = {
  bg:       "#FAF6EF",
  bgWarm:   "#F0E6D3",
  bgCard:   "#EEDFCA",
  brown:    "#3D2010",
  browndark:"#2A1508",
  amber:    "#C47A35",
  terracotta:"#9B4E28",
  crust:    "#7A5230",
  muted:    "#8A7060",
  border:   "rgba(90,50,24,0.12)",
  cream:    "#FAF6EF",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cabin:wght@400;500;600&display=swap');`;


export default function Page() {
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
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.brown, minHeight: "100dvh", fontFamily: "'Cabin', sans-serif", overflowX: "hidden" }}>
      
      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,246,239,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="14" y1="26" x2="14" y2="6" stroke={C.amber} strokeWidth="1.5" />
            {[8, 11, 14, 17, 20].map((y, i) => (
              <g key={i}>
                <ellipse cx={9} cy={y} rx={4} ry={2.5} fill={C.amber} opacity={0.8} transform={`rotate(-25,9,${y})`} />
                <ellipse cx={19} cy={y} rx={4} ry={2.5} fill={C.amber} opacity={0.8} transform={`rotate(25,19,${y})`} />
              </g>
            ))}
          </svg>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.brown, lineHeight: 1 }}>{clientName(sessionData) ?? "Maison Laval"}</p>
            <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 10, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>{clientName(sessionData) ? "" : "Boulangerie Artisanale"}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <Link href="/templates/impact-90" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.brown, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <section style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden", background: C.bgWarm }}>
        
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(196,122,53,0.12) 0%, transparent 65%)" }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ height: 1, width: 48, background: C.amber }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.3em", color: C.terracotta, fontStyle: "italic" }}>Nos Pains</p>
            <div style={{ height: 1, width: 48, background: C.amber }} />
          </div>

          <h1 style={{ fontSize: "clamp(42px, 7vw, 84px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 40, fontFamily: "'Playfair Display', serif", color: C.brown }}>
            Nos Pains
          </h1>

          <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto", fontWeight: 400 }}>
            Découvrez notre gamme complète de pains au levain naturel.
          </p>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgWarm }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.brown, fontStyle: "italic" }}>{clientName(sessionData) ?? "Maison Laval"} · depuis 1987</p>
          <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>© 2025 — Boulangerie Artisanale</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/templates/impact-90/mentions-legales" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-90/confidentialite" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
               Confidentialité
            </Link>
            <Link href="/templates/impact-90/cgu" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
               CGU
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
