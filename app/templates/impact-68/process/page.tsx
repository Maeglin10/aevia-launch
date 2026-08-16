"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { C, PROCESS_STEPS, FAQS } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ProcessPage() {
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

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, minHeight: "80vh" }}>
      {/* ─── PROCESS ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            How We Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "80px",
              lineHeight: 1.05,
              textAlign: "left",
            }}
          >
            A process built for
            <br />
            <span style={{ color: C.accent }}>honest work.</span>
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderTop: `1px solid ${C.border}` }} className="grid-hero-68">
            {PROCESS_STEPS.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{
                    padding: "48px",
                    borderBottom: `1px solid ${C.border}`,
                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
                    position: "relative",
                    textAlign: "left",
                  }}
                  className="border-right-none-68"
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: C.textMuted,
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: C.accent, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                      {step.num}
                    </span>
                    <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: C.textMuted }}>
                      {step.duration}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: C.text,
                      marginBottom: "16px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: C.textMuted,
                    }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            Common Questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "60px",
              lineHeight: 1.05,
              textAlign: "left",
            }}
          >
            Before you reach out.
          </motion.h2>

          <div>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "24px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "16px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: activeFaq === i ? C.accent : C.text,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `1px solid ${activeFaq === i ? C.accent : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: activeFaq === i ? C.accent : C.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    +
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: activeFaq === i ? "auto" : 0, opacity: activeFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.8,
                      color: C.textMuted,
                      paddingBottom: "24px",
                      textAlign: "left",
                    }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
