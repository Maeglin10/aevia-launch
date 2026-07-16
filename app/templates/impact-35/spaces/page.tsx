"use client"

import React from "react"
import { Building2, Check, Clock, Users, ArrowRight, Layers } from "lucide-react"
import Link from "next/link"
import { C, SectionReveal, FloorPlan } from "../shared"

const SPACES_DATA = [
  {
    id: "openspace",
    name: "Open Space",
    tagline: "Hot desks & accès flexible",
    photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop",
    capacity: "Jusqu'à 60 personnes",
    hours: "Lun–Ven 9h–19h",
    equipment: ["WiFi 1 Gbps", "Café illimité", "Casier disponible", "Espaces de détente", "Impression 20 pages/j"],
    cta: "Réserver un Day Pass",
    href: "/templates/impact-35/pricing",
  },
  {
    id: "bureau-dedie",
    name: "Bureau Dédié",
    tagline: "Bureau fermé 1–4 personnes",
    photo: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80&fit=crop",
    capacity: "1 à 4 personnes",
    hours: "Accès 24h/24 7j/7",
    equipment: ["Adresse domiciliation", "Gestion courrier", "Accès 24/7", "Téléphone dédié", "Impression illimitée"],
    cta: "Réserver ce bureau",
    href: "/templates/impact-35/pricing",
  },
  {
    id: "salle-reunion",
    name: "Salle de Réunion",
    tagline: "4 à 12 personnes",
    photo: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80&fit=crop",
    capacity: "4 à 12 personnes",
    hours: "Réservation à l'heure",
    equipment: ["Écran 75\"", "Visioconférence HD", "Tableau blanc", "Système son", "Café & eau inclus"],
    cta: "Réserver à l'heure",
    href: "/templates/impact-35/pricing",
  },
  {
    id: "studio-podcast",
    name: "Studio Podcast",
    tagline: "Isolation acoustique totale",
    photo: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
    capacity: "1 à 4 personnes",
    hours: "Sur réservation",
    equipment: ["Isolation acoustique", "Micro professionnel", "Table de mixage", "Streaming live", "Enregistrement HD"],
    cta: "Réserver le studio",
    href: "/templates/impact-35/pricing#visite",
  },
  {
    id: "espace-event",
    name: "Espace Événement",
    tagline: "Jusqu'à 150 personnes",
    photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop",
    capacity: "150 personnes debout",
    hours: "Sur réservation",
    equipment: ["Scène modulable", "Système son professionnel", "Vidéoprojecteur 4K", "Catering possible", "Équipe technique"],
    cta: "Organiser un événement",
    href: "/templates/impact-35/pricing#visite",
  },
]

export default function SpacesPage() {
  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Title Section */}
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
              <Building2 size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Nos Espaces</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                color: C.slate,
                marginBottom: 16,
              }}
            >
              Des espaces pensés pour votre productivité
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Du hot desk au studio podcast, chaque espace est conçu pour que vous soyez dans les meilleures conditions de travail.
            </p>
          </div>
        </SectionReveal>

        {/* Floor Plan Explorer */}
        <SectionReveal delay={0.1}>
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 40,
              marginBottom: 72,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Layers size={18} color={C.accent} />
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.slate, margin: 0 }}>
                  Explorez le Niveau 2
                </h2>
              </div>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
                Visualisez la disposition de nos espaces directement sur le plan d'étage. Survolez les différentes sections à droite pour identifier l'emplacement exact de chaque zone de travail et de détente.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: C.accent, display: "inline-block" }} /> Open Space / Hot Desk
                </div>
                <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block" }} /> Bureaux Dédiés
                </div>
                <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#8b5cf6", display: "inline-block" }} /> Bureaux Privés
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FloorPlan />
            </div>
          </div>
        </SectionReveal>

        {/* Detailed workspaces */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SPACES_DATA.map((space, i) => (
            <SectionReveal key={space.id} delay={i * 0.05}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                }}
              >
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <img
                    src={space.photo}
                    alt={space.name}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center", order: i % 2 === 0 ? 2 : 1 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: C.accentLight,
                      borderRadius: 20,
                      padding: "4px 12px",
                      marginBottom: 12,
                      alignSelf: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.accentDark }}>{space.tagline}</span>
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.slate, marginBottom: 8 }}>{space.name}</h2>
                  <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={13} /> {space.capacity}
                    </span>
                    <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} /> {space.hours}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {space.equipment.map((eq) => (
                      <div key={eq} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: C.accentLight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check size={10} color={C.accent} />
                        </div>
                        <span style={{ fontSize: 14, color: C.text }}>{eq}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={space.href} style={{ textDecoration: "none", alignSelf: "flex-start" }}>
                    <button
                      type="button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: C.accent,
                        color: C.white,
                        padding: "12px 24px",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 15,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {space.cta} <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
