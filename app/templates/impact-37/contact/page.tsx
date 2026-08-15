"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  C,
  SERIF,
  SANS,
  SectionReveal,
  PageHeader,
  fieldStyle,
  labelStyle,
} from "../shared";

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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bgAlt, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Nous Joindre"
          title="Prenez contact"
          sub="Pour une réservation, une dégustation privée, un événement ou une question sur la cave — écrivez-nous, nous répondons avec soin."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 56,
            alignItems: "start",
          }}
        >
          <SectionReveal>
            <div
              style={{
                background: C.burgundy,
                borderRadius: 4,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {[
                {
                  Icon: MapPin,
                  label: "Adresse",
                  value: "Adresse communiquée sur demande à " + (fd?.email ?? "contact@exemple.fr"),
                },
                { Icon: Phone, label: "Téléphone", value: "+33 1 42 60 80 20" },
                { Icon: Mail, label: "Email", value: (fd?.email ?? "contact@exemple.fr") },
                { Icon: Clock, label: "Horaires", value: "Mardi – Dimanche · 18h30 – 23h30" },
              ].map(({ Icon, label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.gold,
                      marginBottom: 8,
                    }}
                  >
                    <Icon size={16} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#c4a882",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      margin: 0,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: 36,
              }}
            >
              {sent ? (
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                      marginBottom: 12,
                    }}
                  >
                    Merci
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={fieldStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Sujet</label>
                    <input
                      type="text"
                      placeholder="Objet de votre message"
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Votre message…"
                      style={{ ...fieldStyle, resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      alignSelf: "flex-start",
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "15px 32px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
