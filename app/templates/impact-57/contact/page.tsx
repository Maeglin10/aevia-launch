"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../shared";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      setSubmitted(true);
    }
  };

  return (
    <section style={{ padding: "8rem 3rem", background: C.accent, position: "relative", overflow: "hidden", minHeight: "calc(100vh - 120px)" }}>
      {/* BG text */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(6rem, 18vw, 16rem)",
          fontWeight: 700,
          color: "rgba(0,0,0,0.06)",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}>
          LET'S WORK
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }} className="font-sans">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 700,
            color: C.bg,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}>
            Prêt à Casser<br />
            Les Codes ?
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.9rem",
            color: "rgba(0,0,0,0.6)",
            lineHeight: 1.75,
            maxWidth: "50ch",
            margin: "0 auto",
          }}>
            On a de la place pour 3 nouveaux clients en Q3 2025. Si votre projet nous intrigue, on peut en parler.
          </p>
        </div>

        {submitted ? (
          <div style={{ background: C.bg, color: C.text, padding: "3rem", textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Message Reçu !</h3>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: C.textMuted }}>Nous reviendrons vers vous sous 48h.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: C.bg, padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem", textTransform: "uppercase" }}>Votre Adresse Email :</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@domain.com"
                style={{
                  width: "100%",
                  background: C.bgLight,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  padding: "0.8rem 1rem",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  outline: "none"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem", textTransform: "uppercase" }}>Détails du projet :</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Racontez-nous ce que vous construisez..."
                style={{
                  width: "100%",
                  background: C.bgLight,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  padding: "0.8rem 1rem",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  outline: "none",
                  resize: "none"
                }}
              />
            </div>
            <motion.button
              whileHover={{ backgroundColor: C.accent, color: C.bg }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={{
                background: "transparent",
                border: `2px solid ${C.text}`,
                color: C.text,
                padding: "1rem",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              PARLONS-EN →
            </motion.button>
          </form>
        )}

        <div style={{ marginTop: "2rem", textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(0,0,0,0.5)" }}>
          hello@maskunit.studio
        </div>
      </div>
    </section>
  );
}
