"use client";
import {
  clientCity,
  memoriserSession,
} from "@/lib/templates/clientContent";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, FONT_BODY, COLLECTIONS, GemStoneSVG, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: "14px 18px",
  outline: "none",
  fontFamily: FONT_BODY,
  fontSize: 15,
};

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: C.accent,
  textTransform: "uppercase",
  display: "block",
  marginBottom: 8,
};


export default function SurMesurePage() {
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

  const bespoke = COLLECTIONS.find((c) => c.id === "bespoke")?.pieces || [];
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSelectPiece = (pieceName: string) => {
    setMessage(`Je souhaite une création inspirée de : ${pieceName} — `);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    setTimeout(() => {
      setInquiryLoading(false);
      setInquirySent(true);
    }, 2200);
  };

  const steps = [
    { num: "01", title: "Consultation Privée", desc: "Rencontre confidentielle dans notre atelier parisien ou à domicile pour définir votre vision." },
    { num: "02", title: "Sélection des Matières", desc: "Nos gemmologues GIA présentent une sélection exclusive de pierres certifiées." },
    { num: "03", title: "Esquisse & Design", desc: "Nos dessinateurs créent plusieurs propositions à la main. Aquarelles et modélisation 3D." },
    { num: "04", title: "Création en Atelier", desc: "Fabrication entièrement à la main par nos maîtres joailliers." },
  ];

  return (
    <section style={{ padding: "100px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
              Service Bespoke
            </span>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300, color: C.text, marginTop: 16, lineHeight: 1.15 }}>
              Créations <em>Sur Mesure</em>
            </h1>
          </div>
        </Reveal>

        {/* Pieces Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 30, marginBottom: 80 }}>
          {bespoke.map((piece, i) => (
            <Reveal key={piece.name} delay={i * 0.1}>
              <div
                onMouseEnter={() => setHoveredPiece(i)}
                onMouseLeave={() => setHoveredPiece(null)}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: 40,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border 0.3s",
                }}
              >
                {/* Background gem decoration */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    bottom: -20,
                    opacity: hoveredPiece === i ? 0.12 : 0.03,
                    transition: "opacity 0.4s",
                    pointerEvents: "none",
                  }}
                >
                  <GemStoneSVG type={piece.gem} size={180} animated={false} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                    <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.25em", color: C.accent, textTransform: "uppercase" }}>
                      {piece.subtitle}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 300, color: C.text, marginBottom: 12 }}>
                    {piece.name}
                  </h3>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.6, marginBottom: 30 }}>
                    {piece.desc}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "between", fontSize: 13, color: C.textMuted, fontFamily: FONT_LABEL }}>
                      <span>Pierres : {piece.stone}</span>
                      <span>Métaux : {piece.metal}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, color: C.accent, fontFamily: FONT_HEADING }}>
                      {piece.price}
                    </span>
                    <button
                      onClick={() => handleSelectPiece(piece.name)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: C.text,
                        fontFamily: FONT_LABEL,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        minHeight: 44,
                        padding: "0 4px",
                      }}
                    >
                      DÉTAILS <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Process */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 80 }}>
          <Reveal>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 36, fontWeight: 300, color: C.text, marginBottom: 50, textAlign: "center" }}>
              Le Processus de <em>Création</em>
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 30 }}>
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ background: C.bgAlt, padding: 30, border: `1px solid ${C.border}`, height: "100%" }}>
                  <div style={{ fontSize: 36, fontFamily: FONT_HEADING, color: C.accent, marginBottom: 20 }}>{step.num}</div>
                  <h4 style={{ fontFamily: FONT_HEADING, fontSize: 20, color: C.text, marginBottom: 12 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Inquiry / consultation request form */}
        <div ref={formRef} style={{ borderTop: `1px solid ${C.border}`, paddingTop: 80, marginTop: 80 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
                Débuter votre création
              </span>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: C.text, marginTop: 16 }}>
                Demander une <em>consultation</em>
              </h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, lineHeight: 1.7, maxWidth: 560, margin: "20px auto 0" }}>
                Décrivez-nous votre projet — nos maîtres joailliers vous recontactent sous 24h pour organiser votre première consultation privée.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ maxWidth: 640, margin: "0 auto", background: C.bgCard, border: `1px solid ${C.border}`, padding: "48px 40px" }}>
              {inquirySent ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "20px 0" }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                    style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
                  >
                    <Check size={22} color={C.accent} />
                  </motion.div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 26, color: C.text, marginBottom: 12 }}>Demande reçue</h3>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                    Merci. Un membre de notre atelier vous contactera personnellement sous 24h pour organiser votre consultation privée à {clientCity(sessionData) ?? "Paris"}, Monaco ou à domicile.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleInquirySubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label htmlFor="sm-name" style={labelStyle}>Nom complet</label>
                      <input id="sm-name" name="name" type="text" required placeholder="Votre nom" style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="sm-email" style={labelStyle}>Email</label>
                      <input id="sm-email" name="email" type="email" required placeholder="vous@email.com" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sm-phone" style={labelStyle}>Téléphone</label>
                    <input id="sm-phone" name="phone" type="tel" required placeholder="+33 6 00 00 00 00" style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor="sm-message" style={labelStyle}>Décrivez la pièce que vous souhaitez créer</label>
                    <textarea
                      id="sm-message"
                      name="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type de pièce, pierres, budget approximatif, occasion..."
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    style={{
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "16px",
                      background: C.accent,
                      color: C.bg,
                      border: "none",
                      fontFamily: FONT_LABEL,
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: inquiryLoading ? "not-allowed" : "pointer",
                      opacity: inquiryLoading ? 0.6 : 1,
                    }}
                  >
                    {inquiryLoading ? "Envoi en cours…" : "Demander une consultation"}
                  </button>
                </motion.form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
