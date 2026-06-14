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
    <section style={{ padding: "8rem 3rem", background: C.violet, position: "relative", overflow: "hidden", minHeight: "calc(100vh - 120px)" }}>
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
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(6rem, 20vw, 18rem)",
          fontWeight: 800,
          color: "rgba(0,0,0,0.08)",
          letterSpacing: "-0.04em",
        }}>
          LET'S GO
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, color: C.bg, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
            On a un créneau<br />disponible pour vous.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(7,7,10,0.65)", lineHeight: 1.75, maxWidth: "50ch", margin: "0 auto" }}>
            On ne travaille qu&apos;avec 4 clients en simultané. Si votre projet mérite d&apos;exister, écrivez-nous.
          </p>
        </div>

        {submitted ? (
          <div style={{ background: C.bg, color: C.text, padding: "3rem", textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Message Transmis</h3>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.8rem", color: C.textMuted }}>Nous prendrons contact sous 48 heures.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: C.bg, padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem", textTransform: "uppercase" }}>Adresse Email :</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@studio.com"
                style={{
                  width: "100%",
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  padding: "0.8rem 1rem",
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "0.8rem",
                  outline: "none"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem", textTransform: "uppercase" }}>Message :</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Parlez-nous de votre projet..."
                style={{
                  width: "100%",
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  padding: "0.8rem 1rem",
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "0.8rem",
                  outline: "none",
                  resize: "none"
                }}
              />
            </div>
            <motion.button
              whileHover={{ backgroundColor: C.bg, color: C.violet }}
              type="submit"
              style={{
                background: "transparent",
                border: `2px solid ${C.bg}`,
                color: C.bg,
                padding: "1rem 3rem",
                fontFamily: "'Syne Mono', monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              CONTACT US →
            </motion.button>
          </form>
        )}

        <div style={{ marginTop: "2rem", textAlign: "center", fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: "rgba(7,7,10,0.5)" }}>
          hello@skewstudio.fr
        </div>
      </div>
    </section>
  );
}
