"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SectionLabel, PageWrapper, BESPOKE_STEPS } from "../shared";

export default function AtelierPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Création Unique</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.1em", marginBottom: "1rem" }}>
          L'Atelier<br /><em style={{ color: C.gold }}>Bespoke</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75 }}>
          Commissionnez une pièce unique. Votre vision, notre savoir-faire ancestral. Une montre que personne d'autre au monde ne possédera.
        </p>
      </div>

      {/* Process */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "3rem" }}>LE PROCESSUS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {BESPOKE_STEPS.map((step, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-80px" });
              return (
                <motion.div
                  key={step.n}
                  ref={ref}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{ display: "grid", gridTemplateColumns: "5rem 1fr", gap: "2rem", padding: "2.5rem 0", borderBottom: i < BESPOKE_STEPS.length - 1 ? `1px solid ${C.border}` : "none", textAlign: "left" }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.goldDim }}>{step.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{step.title}</div>
                    <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "60ch" }}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bespoke options */}
      <div style={{ padding: "4rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Personnalisation</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Chaque Détail<br /><em style={{ color: C.gold }}>Est le Vôtre</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { title: "Matière du boîtier", options: ["Or blanc 18K", "Or rose 18K", "Platine 950", "Titane grade 5"] },
              { title: "Cadran", options: ["Guilloché main", "Émail grand feu", "Nacre naturelle", "Météorite Widmanstätten"] },
              { title: "Complications", options: ["Tourbillon volant", "Répétition minutes", "Quantième perpétuel", "Phase de lune"] },
              { title: "Gravures", options: ["Monogramme", "Armoiries familiales", "Texte libre", "Motif japonais"] },
              { title: "Bracelet", options: ["Alligator Mississippi", "Cuir de requin", "Caoutchouc manufacture", "Bracelet intégré"] },
              { title: "Références", options: ["Mouvement exclusif", "Index diamants", "Fond saphir serti", "Couronne en pierre"] },
            ].map((opt) => (
              <div key={opt.title} style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "1.75rem", textAlign: "left" }}>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "1rem" }}>{opt.title.toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {opt.options.map((o) => (
                    <div key={o} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: C.goldDim, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: C.textMuted }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation form */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Demande de Consultation</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Commençons<br /><em style={{ color: C.gold }}>Votre Projet</em>
            </h2>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: "4rem", background: C.bgCard, border: `1px solid ${C.borderGold}` }}
            >
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.goldDim, marginBottom: "1rem" }}>REÇU</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>Votre demande a été transmise.</h3>
              <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75 }}>Nous vous contacterons dans les 48 heures ouvrables pour convenir d'un premier entretien.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
              {[
                { id: "name", label: "Nom complet", type: "text", required: true },
                { id: "country", label: "Pays de résidence", type: "text", required: true },
                { id: "email", label: "Adresse email", type: "email", required: true },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} style={{ display: "block", fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>
                    {field.label.toUpperCase()}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    style={{
                      width: "100%",
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      padding: "0.85rem 1rem",
                      color: C.text,
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "1rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>BUDGET INDICATIF</div>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  {["CHF 30k – 80k", "CHF 80k – 200k", "CHF 200k+"].map((b) => (
                    <label key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input type="radio" name="budget" value={b} style={{ accentColor: C.gold }} />
                      <span style={{ fontSize: "0.88rem", color: C.textMuted }}>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="project" style={{ display: "block", fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>
                  VOTRE PROJET
                </label>
                <textarea
                  id="project"
                  rows={5}
                  required
                  style={{
                    width: "100%",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    padding: "0.85rem 1rem",
                    color: C.text,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>CONTACT PRÉFÉRÉ</div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  {["Email", "Téléphone", "WhatsApp"].map((m) => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input type="radio" name="contact" value={m} style={{ accentColor: C.gold }} />
                      <span style={{ fontSize: "0.88rem", color: C.textMuted }}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: C.gold,
                  color: C.bg,
                  border: "none",
                  padding: "1rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  transition: "background 0.3s",
                }}
              >
                ENVOYER MA DEMANDE
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
