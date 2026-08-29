"use client";
import { EditeurDuSite } from "@/app/templates/EditeurDuSite";
import {
  clientCity,
  clientEmail,
  clientHours,
  clientName,
  clientPhone,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";
import { useEffect, useState } from "react";

import { LegalIdentity } from "@/app/templates/LegalIdentity";
import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { C, SectionReveal, GoldDivider } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ContactPage() {
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

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Venez nous rendre visite
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Contact & Accès
            </h1>
          </div>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          <SectionReveal>
            <div style={{ backgroundColor: C.bgDark, borderRadius: "1.75rem", padding: "2.5rem", height: "100%" }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.bg, marginBottom: "1.75rem" }}>
                Nous trouver
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  {
                    icon: <MapPin size={18} />,
                    label: "Adresse",
                    value: (clientName(sessionData) ?? "Aevia WS") + ", RCS " + (clientCity(sessionData) ?? "Bourg-en-Bresse")
                      + " (adresse communiquée sur demande à " + (clientEmail(sessionData) ?? fd?.email ?? "contact@exemple.fr") + ") — "
                      + (clientCity(sessionData) ?? "Beaujolais") + ", France"
                  },
                  { icon: <Phone size={18} />, label: "Téléphone", value: (clientPhone(sessionData) ?? "+33 4 74 12 34 56") },
                  { icon: <Mail size={18} />, label: "Email", value: (clientEmail(sessionData) ?? fd?.email ?? "contact@exemple.fr") },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "0.6rem",
                        backgroundColor: "rgba(240,192,64,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: C.accent,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: "rgba(253,249,238,0.7)", lineHeight: 1.55 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ backgroundColor: C.white, borderRadius: "1.75rem", padding: "2.5rem", border: `1px solid ${C.border}`, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.75rem" }}>
                <Clock size={18} color={C.accentDark} />
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.text, margin: 0 }}>
                  Horaires d'ouverture
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {/* HORAIRES */ resolveList(clientHours(sessionData)?.map((h: any) => ({ day: h.day, hours: h.hours })), [
                  { day: "Mardi – Samedi", service: "Déjeuner", hours: "12h00 – 14h00" },
                  { day: "Mardi – Samedi", service: "Dîner", hours: "19h30 – 22h00" },
                  { day: "Dimanche", service: "", hours: "Fermé" },
                  { day: "Lundi", service: "", hours: "Fermé" },
                ]).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", fontWeight: 600, color: C.text }}>{s.day}</div>
                      {s.service && <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.15rem" }}>{s.service}</div>}
                    </div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: s.hours === "Fermé" ? C.textMuted : C.accentDark, fontWeight: 600 }}>
                      {s.hours}
                    </div>
                  </div>
                ))}
              </div>

              <GoldDivider />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[
                  { icon: "🅿️", text: "Parking disponible sur place" },
                  { icon: "♿", text: "Accès PMR — Restaurant de plain-pied" },
                  { icon: "🚗", text: "Service voiturier vendredi et samedi soir" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.textLight }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.15}>
          <div style={{ textAlign: "center" }}>
            <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
              <span
                style={{
                  backgroundColor: C.bgDark,
                  color: C.accent,
                  padding: "1rem 2.5rem",
                  borderRadius: "3rem",
                  border: "none",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Réserver une table <Calendar size={16} />
              </span>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
