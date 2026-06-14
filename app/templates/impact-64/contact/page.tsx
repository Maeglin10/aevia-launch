"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Shield, Send } from "lucide-react";
import { C, mono, sans } from "../shared";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "1-50", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}>
        
        {/* Info Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// ASSISTANCE & AUDITS</span>
          <h1 style={{ fontFamily: mono, fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 700, lineHeight: 1.15, paddingBottom: "0.15em", color: C.text, marginBottom: "2rem" }}>
            Contactez le <span style={{ color: C.green }}>SOC.</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: "1rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "3rem" }}>
            Une urgence cyber ou un audit de sécurité à planifier ? Nos analystes et auditeurs sont à votre entière disposition.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(255,183,77,0.08)", border: "1px solid rgba(255,183,77,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Phone size={22} color="#ffb74d" />
              </div>
              <div>
                <h4 style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>ASTREINTE D'URGENCE 24/7</h4>
                <p style={{ fontFamily: mono, fontSize: "1.1rem", color: C.green, fontWeight: 700 }}>+33 1 44 62 87 00</p>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.25rem" }}>Réservé aux clients Guardian et Fortress sous contrat SOC.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={22} color={C.green} />
              </div>
              <div>
                <h4 style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>EMAIL DE CONTACT</h4>
                <p style={{ fontFamily: mono, fontSize: "1.1rem", color: C.text }}>soc@neuronsec.fr</p>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.25rem" }}>Pour toute demande commerciale ou demande de POC SOC.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={22} color={C.green} />
              </div>
              <div>
                <h4 style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>SIÈGE & SOC</h4>
                <p style={{ fontFamily: sans, fontSize: "1rem", color: C.textMuted }}>75010 Paris, France</p>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.25rem" }}>Adresse physique communiquée sur demande à contact@aevia.io.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ background: C.bgCard, border: `1px solid ${C.greenBorder}`, padding: "3rem", borderRadius: "8px" }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(0,230,118,0.1)", border: `1px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                <Shield size={26} color={C.green} />
              </div>
              <h3 style={{ fontFamily: mono, fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Demande Transmise</h3>
              <p style={{ fontFamily: sans, fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.6 }}>
                Votre demande d'audit ou de contact a été reçue. Un auditeur NeuronSec vous contactera sous 2 heures ouvrées pour qualifier votre demande.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ fontFamily: mono, fontSize: "1.25rem", fontWeight: 700, color: C.green, marginBottom: "1rem" }}>
                Demander un Audit Gratuit
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>NOM COMPLET</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.75rem 1rem", fontFamily: sans, fontSize: "0.9rem", color: C.text }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>EMAIL PROFESSIONNEL</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.75rem 1rem", fontFamily: sans, fontSize: "0.9rem", color: C.text }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>ENTREPRISE</label>
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.75rem 1rem", fontFamily: sans, fontSize: "0.9rem", color: C.text }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>TAILLE DE L'ORGANISATION</label>
                  <select
                    value={form.size}
                    onChange={e => setForm({ ...form, size: e.target.value })}
                    style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.75rem 1rem", fontFamily: sans, fontSize: "0.9rem", color: C.text }}
                  >
                    <option value="1-50">1 - 50 collaborateurs</option>
                    <option value="51-250">51 - 250 collaborateurs</option>
                    <option value="251-1000">251 - 1000 collaborateurs</option>
                    <option value="1000+">1000+ collaborateurs</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>VOTRE MESSAGE / PÉRIMÈTRE À AUDITER</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.75rem 1rem", fontFamily: sans, fontSize: "0.9rem", color: C.text, resize: "none" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em",
                  background: C.green, color: C.bg, border: "none", padding: "1rem", borderRadius: "4px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  transition: "box-shadow 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(0,230,118,0.4)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                TRANSMETTRE LA DEMANDE <Send size={14} />
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
