"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES, C, mono, sans } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function SolutionsPage() {
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

  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "5rem", textAlign: "center" }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// ARCHITECTURE & OPÉRATIONS</span>
          <h1 style={{ fontFamily: mono, fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.15, paddingBottom: "0.15em", color: C.text, marginBottom: "2rem" }}>
            Nos Solutions de <span style={{ color: C.green }}>Sécurité.</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
            Découvrez nos services managés et audits pour protéger votre périmètre et assurer la continuité de vos opérations face aux menaces avancées.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            const hovered = hoveredService === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  background: hovered ? "rgba(0,230,118,0.04)" : C.bgCard,
                  border: `1px solid ${hovered ? C.green : C.greenBorder}`,
                  padding: "3rem",
                  borderRadius: "8px",
                  cursor: "default",
                  transition: "all 0.3s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  background: hovered ? "rgba(0,230,118,0.15)" : "rgba(0,230,118,0.05)",
                  border: `1px solid ${hovered ? C.greenBorderHover : C.greenBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "2rem",
                  transition: "all 0.3s",
                }}>
                  <Icon size={26} color={C.green} />
                </div>
                <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
                  {svc.subtitle.toUpperCase()}
                </div>
                <h3 style={{ fontFamily: mono, fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.25rem" }}>
                  {svc.title}
                </h3>
                <p style={{ fontFamily: sans, fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2rem" }}>
                  {svc.desc}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  {svc.metrics.map(m => (
                    <span key={m} style={{
                      fontFamily: mono, fontSize: "0.65rem", color: C.green,
                      background: "rgba(0,230,118,0.06)", border: `1px solid ${C.greenBorder}`,
                      borderRadius: "3px", padding: "0.25rem 0.6rem", letterSpacing: "0.05em",
                    }}>{m}</span>
                  ))}
                </div>
                <div style={{ fontFamily: mono, fontSize: "0.85rem", color: C.green, fontWeight: 700 }}>
                  {svc.price}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
