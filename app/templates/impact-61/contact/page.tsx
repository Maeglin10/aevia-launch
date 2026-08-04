"use client";
import {
  clientCity,
} from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { C, TextReveal, MagneticButton } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ContactPage() {
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

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh", padding: "6rem 3rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
            Démarrer un Projet
          </TextReveal>
        </div>

        {submitted ? (
          <div style={{ border: `1px solid ${C.border}`, background: C.bgOff, padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: C.gold, marginBottom: "1rem" }}>
              Merci
            </div>
            <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75 }}>
              Merci, nous vous répondrons sous 24h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <label htmlFor="name" style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: C.textDim, marginBottom: "0.5rem" }}>
                NOM COMPLET
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                style={{
                  width: "100%",
                  background: C.bgOff,
                  border: `1px solid ${C.border}`,
                  padding: "1rem 1.5rem",
                  color: C.text,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
                placeholder="Ex. Laurent Vasseur"
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: C.textDim, marginBottom: "0.5rem" }}>
                ADRESSE COURRIEL
              </label>
              <input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                style={{
                  width: "100%",
                  background: C.bgOff,
                  border: `1px solid ${C.border}`,
                  padding: "1rem 1.5rem",
                  color: C.text,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
                placeholder="Ex. laurent@societe.com"
              />
            </div>

            <div>
              <label htmlFor="message" style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: C.textDim, marginBottom: "0.5rem" }}>
                VOTRE VISION DE PROJET
              </label>
              <textarea
                id="message"
                rows={6}
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                style={{
                  width: "100%",
                  background: C.bgOff,
                  border: `1px solid ${C.border}`,
                  padding: "1rem 1.5rem",
                  color: C.text,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "vertical",
                }}
                placeholder="Décrivez l'emplacement, les dimensions, les matériaux souhaités..."
              />
            </div>

            <MagneticButton
              type="submit"
              style={{
                background: C.gold,
                color: C.bgDark,
                border: "none",
                padding: "1.1rem 3rem",
                fontFamily: "'Archivo', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              ENVOYER LA DEMANDE →
            </MagneticButton>
          </form>
        )}

        <div style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", color: C.text, marginBottom: "1rem" }}>SEGMENT {clientCity(sessionData) ?? "PARIS"}</h4>
            <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.6 }}>
              42 Rue du Faubourg Saint-Antoine<br />
              75012 {clientCity(sessionData) ?? "Paris"}, France<br />
              +33 1 45 78 92 10
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", color: C.text, marginBottom: "1rem" }}>CONTACT GÉNÉRAL</h4>
            <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.6 }}>
              Projets: {fd?.email ?? "contact@segment-architectes.fr"}<br />
              Presse: {fd?.email ?? "press@segment-architectes.fr"}<br />
              Recrutement: {fd?.email ?? "jobs@segment-architectes.fr"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
