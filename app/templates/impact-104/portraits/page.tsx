"use client";
import { useEffect, useState } from "react";
import {
  clientCity,
  clientName,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { C, FONT, FONT_BODY , CSS_VARIABLES } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


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
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
      
    <div style={{ minHeight: "100dvh", background: C.bg, color: C.text, fontFamily: FONT_BODY, padding: "120px 24px" }} className="selection:bg-[var(--brand,#CA8A04)]/20">
      <style>{CSS_VARIABLES}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link 
          href="/templates/impact-104"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: C.gold,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <div style={{ marginBottom: 60 }}>
          <span style={{ color: C.gold, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
            {clientName(sessionData) ?? (clientName(sessionData) ?? "Lumière Dorée")} · Photographie
          </span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontFamily: FONT, color: C.text, marginBottom: 24, fontStyle: "italic" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "portraits.titre") ?? "Portraits & Studio"}
          </h1>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 640, lineHeight: 1.8 }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "portraits.texte") ?? clientTagline(sessionData) ?? "Des portraits authentiques et raffinés capturant votre essence naturelle sous une lumière douce et travaillée."}
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 32 }}>
            <div 

              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid " + C.border,
                aspectRatio: "4/5",
              }}
            >
              <img src="https://pixabay.com/get/g0d0e9bba6b6a8d9d5eff4a02c1fe8191f0b785e402a6fcda2f35c0537e6d91445053d2308e2cd1e737d049d9e1b4c5c7bd53b3c3f2d8647235bc7158b235cfbc_1280.jpg" alt="Portraits & Studio 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,10,9,0.8) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.text, fontSize: 14, fontFamily: FONT, fontStyle: "italic" }}>Portraits & Studio Collection N°1</span>
                <Sparkles size={16} color={C.gold} />
              </div>
            </div>
            <div 

              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid " + C.border,
                aspectRatio: "4/5",
              }}
            >
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" alt="Portraits & Studio 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,10,9,0.8) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.text, fontSize: 14, fontFamily: FONT, fontStyle: "italic" }}>Portraits & Studio Collection N°2</span>
                <Sparkles size={16} color={C.gold} />
              </div>
            </div>
            <div 

              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid " + C.border,
                aspectRatio: "4/5",
              }}
            >
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80" alt="Portraits & Studio 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,10,9,0.8) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.text, fontSize: 14, fontFamily: FONT, fontStyle: "italic" }}>Portraits & Studio Collection N°3</span>
                <Sparkles size={16} color={C.gold} />
              </div>
            </div>

        </div>
      </div>
    </div>
  );
}
