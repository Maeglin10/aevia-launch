"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { C, FONT, FONT_BODY , CSS_VARIABLES } from "../shared";

export default function Page() {
  return (
      
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FONT_BODY, padding: "120px 24px" }} className="selection:bg-[#CA8A04]/20">
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
            Lumière Dorée · Photographie
          </span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontFamily: FONT, color: C.text, marginBottom: 24, fontStyle: "italic" }}>
            Portraits & Studio
          </h1>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 640, lineHeight: 1.8 }}>
            Des portraits authentiques et raffinés capturant votre essence naturelle sous une lumière douce et travaillée.
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
            <div 

              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid " + C.border,
                aspectRatio: "4/5",
              }}
            >
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portraits & Studio 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
