"use client";
import { useEffect, useState } from "react";

// The nav and footer both link "Nos Tartes" here, but the route never existed
// — every visitor clicking it hit a 404. TARTES_DATA was already authored in
// shared.tsx; this renders it in the template's own styling.
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, TARTES_DATA } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function TartesPage() {
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

  return (
    <section
      style={{
        padding: "clamp(56px,8vw,80px) clamp(20px,6vw,80px) clamp(80px,10vw,120px)",
        background: C.bg,
        fontFamily: FONT_BODY,
        minHeight: "100dvh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,60px)" }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Nos Tartes
        </div>
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: "clamp(30px, 4vw, 52px)",
            fontWeight: 700,
            color: C.text,
            letterSpacing: -0.5,
            marginBottom: 16,
          }}
        >
          Quatre tartes, quatre obsessions
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
          Chacune est travaillée à la commande, cuite le matin même. Vendues à la part
          en boutique, ou entières sur réservation 24 heures à l’avance.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "clamp(20px,3vw,32px)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {TARTES_DATA.map((t: any, i: number) => (
          <motion.article
            key={t.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.65, 0, 0.35, 1] }}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: C.accentLight }}>
              <img
                src={/^https?:/.test(t.img) ? t.img : `https://images.unsplash.com/${t.img}?w=900&q=80&fit=crop`}
                alt={`${t.name} — ${t.subtitle}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {t.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    // white on the accent measures 3.0:1 and on accentDark
                    // 4.0:1 — both below AA for small text. The brown carries
                    // the badge at 8:1 and still reads as the theme.
                    background: C.brown,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    padding: "6px 12px",
                    borderRadius: 999,
                  }}
                >
                  {t.badge}
                </span>
              )}
            </div>

            <div style={{ padding: "clamp(20px,3vw,28px)", display: "flex", flexDirection: "column", flex: 1 }}>
              <h2
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 23,
                  fontWeight: 700,
                  color: C.text,
                  margin: "0 0 4px",
                }}
              >
                {t.name}
              </h2>
              <div style={{ fontSize: 14, color: C.accent, fontStyle: "italic", marginBottom: 14 }}>{t.subtitle}</div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textMuted, margin: "0 0 20px", flex: 1 }}>{t.desc}</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 16,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{t.price}</span>
                <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.accent,
                      color: "#fff",
                      padding: "11px 20px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      minHeight: 44,
                      boxSizing: "border-box",
                    }}
                  >
                    Réserver <ArrowRight size={15} />
                  </span>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
