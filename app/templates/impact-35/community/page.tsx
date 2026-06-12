"use client"

import React from "react"
import { Users2, Users, Calendar, Star, ArrowRight, MessageSquare, Link2, Camera } from "lucide-react"
import Link from "next/link"
import { C, SectionReveal, STATS } from "../shared"

const MEMBERS_DATA = [
  { name: "Luminary SaaS", type: "Startup B2B", founding: "2023", avatar: "LS", color: "#3b82f6" },
  { name: "Sophie M.", type: "Freelance Design", founding: "2021", avatar: "SM", color: "#ec4899" },
  { name: "FinPath", type: "Scale-up Fintech", founding: "2020", avatar: "FP", color: "#8b5cf6" },
  { name: "Studio Krea", type: "Agence Créative", founding: "2022", avatar: "SK", color: "#f59e0b" },
  { name: "Marc Chen", type: "Consultant Stratégie", founding: "2019", avatar: "MC", color: "#14b8a6" },
  { name: "DataFlow", type: "Scale-up Data", founding: "2021", avatar: "DF", color: C.accent },
]

const EVENTS_DATA = [
  {
    date: "19 Juin",
    title: "Workshop Design Thinking",
    type: "Workshop",
    attendees: 24,
    color: "#3b82f6",
    desc: "Méthodologie DT appliquée à votre produit. Animé par un expert UX senior.",
  },
  {
    date: "26 Juin",
    title: "Afterwork Networking",
    type: "Social",
    attendees: 60,
    color: C.accent,
    desc: "Cocktails, rencontres et bonne humeur. Mensuel et gratuit pour tous les membres.",
  },
  {
    date: "3 Juil.",
    title: "Pitch Day",
    type: "Business",
    attendees: 40,
    color: "#8b5cf6",
    desc: "5 minutes pour présenter votre projet à des investisseurs et mentors.",
  },
]

const TESTIMONIALS_DATA = [
  {
    name: "Amara Diallo",
    role: "Head of Growth, FinPath",
    avatar: "AD",
    text: "La communauté ici est unique. Deux partenariats et une mise en relation investisseur sont directement sortis de connexions faites dans le lounge.",
  },
  {
    name: "Sophie Marchand",
    role: "Co-fondatrice, Luminary SaaS",
    avatar: "SM",
    text: "Nous sommes passés de 2 à 14 personnes en 18 mois grâce à l'écosystème. La flexibilité d'évoluer sans déménager a été déterminante.",
  },
  {
    name: "Marc Chen",
    role: "Consultant Stratégie",
    avatar: "MC",
    text: "Je signe 40% plus de contrats quand je reçois mes clients ici. L'atmosphère inspire le sérieux et l'ambition.",
  },
]

export default function CommunityPage() {
  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
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
              <Users2 size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Notre communauté</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Plus qu'un espace — un écosystème
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              250+ membres, 80+ entreprises, 30+ nationalités. Un réseau vivant d'entrepreneurs, freelances et scale-ups.
            </p>
          </div>
        </SectionReveal>

        {/* Stats Grid */}
        <SectionReveal delay={0.05}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 72,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: C.accent, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Featured Members */}
        <SectionReveal delay={0.1}>
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Membres à la une</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {MEMBERS_DATA.map((m) => (
                <div
                  key={m.name}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${m.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 15,
                      color: m.color,
                      flexShrink: 0,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.slate }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{m.type}</div>
                    <div style={{ fontSize: 12, color: C.accent, marginTop: 2 }}>Membre depuis {m.founding}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Upcoming Events */}
        <SectionReveal delay={0.15}>
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Prochains événements</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {EVENTS_DATA.map((ev) => (
                <div
                  key={ev.title}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        background: `${ev.color}18`,
                        color: ev.color,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {ev.type}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{ev.date}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: C.slate }}>{ev.title}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{ev.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Users size={13} color={C.textMuted} />
                    <span style={{ fontSize: 13, color: C.textMuted }}>{ev.attendees} participants attendus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Testimonials */}
        <SectionReveal delay={0.2}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Ils en parlent</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {TESTIMONIALS_DATA.map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: C.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.accentDark,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.slate }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Bottom CTA */}
        <SectionReveal delay={0.25}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.slate}, ${C.slateMid})`,
              borderRadius: 24,
              padding: "56px 64px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 16 }}>
              Rejoignez la communauté
            </h2>
            <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
              250 membres vous attendent. Venez travailler, créer des connexions et grandir ensemble.
            </p>
            <Link href="/templates/impact-35/pricing" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  color: C.white,
                  padding: "16px 36px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Voir les tarifs <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
