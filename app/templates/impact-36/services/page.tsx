"use client"

import React, { useEffect, useState } from "react";
import { Check, Target, Users, BarChart2, Briefcase, ArrowRight, UserCheck, Paperclip } from "lucide-react"
import { C, SERIF, SERVICES, SectionReveal } from "../shared"
import { clientServices, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ServicesPage() {
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const OFFRES = resolveList(
    clientServices(sessionData)?.map((sv: any, i: number) => ({
      ...SERVICES[i % SERVICES.length],
      name: sv.title,
      desc: sv.desc || SERVICES[i % SERVICES.length].desc,
      prix: sv.price || undefined,
    })),
    SERVICES,
  );

  const [formType, setFormType] = useState<"client" | "candidate">("client")
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      setSubmitted(true)
    }
  }

  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Title */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Briefcase size={14} color={C.accentFixe} />
              <span style={{ color: C.accentFixe, fontSize: 13, fontWeight: 600 }}>Ce que nous faisons</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services-page.titre") ?? (<>
              Nos services
            </>)}</h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              D'un poste de direction à pourvoir jusqu'à la refonte complète de votre recrutement — le détail de ce que chaque mission comprend.
            </p>
          </div>
        </SectionReveal>

        {/* Detailed services lists */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 80 }}>
          {OFFRES.map((service, i) => (
            <SectionReveal key={service.name} delay={i * 0.05}>
              <div
                id={i === 0 ? "executive" : i === 1 ? "rpo" : "consulting"}
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: 48,
                  border: `1px solid ${C.border}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                  gap: 48,
                  scrollMarginTop: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                    }}
                  >
                    <service.icon size={26} color={C.accentFixe} />
                  </div>
                  <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: C.navy, marginBottom: 16 }}>{service.name}</h2>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{service.desc}</p>
                  {service.prix ? (
                    <div style={{ marginTop: 18, fontSize: 14, fontWeight: 700, color: C.accentFixe }}>{service.prix}</div>
                  ) : null}
                </div>

                <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 48 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                    Ce que la mission comprend
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {service.details.map((d) => (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={16} color={C.accent} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Contact Form Section */}
        <SectionReveal delay={0.1}>
          <div
            id="contact-form"
            style={{
              maxWidth: 700,
              margin: "0 auto",
              background: C.white,
              border: `1.5px solid ${C.accent}`,
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 10px 40px rgba(37,99,235,0.05)",
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: C.navy, margin: 0 }}>
                    Écrire au cabinet
                  </h2>
                  <p style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>
                    Dites-nous qui vous êtes : la bonne personne vous répond sous 24 heures ouvrées.
                  </p>
                </div>

                {/* Form type toggle tabs */}
                <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, marginBottom: 28 }}>
                  <button
                    type="button"
                    onClick={() => setFormType("client")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: formType === "client" ? C.white : "transparent",
                      color: formType === "client" ? C.accent : C.textMuted,
                      transition: "all 0.2s",
                    }}
                  >
                    Je recrute
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("candidate")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: formType === "candidate" ? C.white : "transparent",
                      color: formType === "candidate" ? C.accent : C.textMuted,
                      transition: "all 0.2s",
                    }}
                  >
                    Je suis candidat·e
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Votre nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex. : Claire Fabre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Votre courriel</label>
                      <input
                        type="email"
                        required
                        placeholder="prenom@entreprise.fr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {formType === "client" ? (
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Votre entreprise</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex. : ETI industrielle, 400 salariés"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Votre CV</label>
                      <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "20px", textAlign: "center", cursor: "pointer", background: C.bg }}>
                        <Paperclip size={24} color={C.accent} style={{ margin: "0 auto 8px" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>Cliquer pour joindre (PDF, 5 Mo max)</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>
                      {formType === "client" ? "Décrivez le poste à pourvoir" : "Parlez-nous de votre parcours"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={formType === "client" ? "Nous cherchons un directeur industriel..." : "Quinze ans de direction d'usine, mobile sur la région..."}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.white,
                      padding: "16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    Envoyer <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ width: 64, height: 64, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <UserCheck size={28} color={C.accent} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Merci</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: 460, margin: "0 auto 24px" }}>
                  Votre message est bien parti — nous vous répondons sous 24 heures ouvrées.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
                >
                  Envoyer un autre message
                </button>
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
