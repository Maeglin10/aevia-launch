"use client";
import { useEffect, useState } from "react";

import React from "react";
import { motion } from "framer-motion";
import { C, TextReveal, MagneticButton } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PrintsPage() {
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

  const handlePurchase = (size: string, price: string) => {
    alert(`Initiating secure checkout for ${size} print (${price}€)`);
  };

  return (
    <section style={{ padding: "80px 0", background: C.bgCard, minHeight: "85vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid-hero-68">
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Fine Art Prints</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, color: C.cream }}>
              <TextReveal text="Bring the wild" />
              <TextReveal text="inside." delay={0.15} style={{ color: C.amber }} />
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: 40, maxWidth: 440 }}>
              Museum-quality archival prints, handcrafted in Lyon. Three sizes, three paper surfaces, each signed and numbered. Shipping worldwide with custom framing options.
            </p>
            <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "16px 36px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              Shop All Prints
            </MagneticButton>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { size: "30×40", price: "390", material: "Cotton Rag" },
              { size: "50×70", price: "590", material: "Fine Art Baryta" },
              { size: "70×100", price: "890", material: "Cotton Rag" },
              { size: "100×140", price: "1,490", material: "Cotton Rag Museum" },
            ].map(print => (
              <motion.div
                key={print.size}
                whileHover={{ y: -4, borderColor: C.moss }}
                onClick={() => handlePurchase(print.size, print.price)}
                style={{ padding: "20px", background: C.bg, borderRadius: 4, border: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.2s", textAlign: "left" }}
              >
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 18, fontWeight: 700, color: C.cream, marginBottom: 6 }}>{print.size}cm</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginBottom: 12 }}>{print.material}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.amber }}>from €{print.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
