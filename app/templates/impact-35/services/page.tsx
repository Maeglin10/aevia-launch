"use client"

import React from "react"
import { MessageSquare, Wifi, Bike, Coffee, FileText, PartyPopper, Zap, Check } from "lucide-react"
import Link from "next/link"
import { C, SectionReveal } from "../shared"

const SERVICES_DATA = [
  {
    icon: MessageSquare,
    title: "Conciergerie",
    color: "#3b82f6",
    desc: "Un accueil professionnel au quotidien pour recevoir vos partenaires et vos colis dans les meilleures conditions.",
    items: [
      "Réception courrier & colis",
      "Accueil visiteurs",
      "Secrétariat mutualisé",
      "Mise à disposition de salle",
      "Service coursier sur demande",
    ],
  },
  {
    icon: Wifi,
    title: "IT & Télécom",
    color: C.accent,
    desc: "Une connexion internet stable et ultra-rapide avec double adduction fibre optique et support technique.",
    items: [
      "Fibre 1 Gbps redondante",
      "VPN privé disponible",
      "Impression / scan / copie",
      "Support technique on-site",
      "Réseau invité séparé",
    ],
  },
  {
    icon: Bike,
    title: "Bien-être",
    color: "#ec4899",
    desc: "Parce que la productivité passe par l'équilibre, profitez d'espaces et d'équipements sportifs haut de gamme.",
    items: [
      "Salle de sport partenaire",
      "Vélos en libre-service",
      "Douches & vestiaires",
      "Espace détente & terrasse",
      "Méditation guidée hebdo",
    ],
  },
  {
    icon: Coffee,
    title: "Restauration",
    color: "#f59e0b",
    desc: "Un café d'exception torréfié à Paris et des collations bio pour accompagner vos pauses créatives.",
    items: [
      "Machine café premium",
      "Cuisine équipée partagée",
      "Livraison déjeuner partenaire",
      "Micro-marchés en libre-service",
      "Fontaine eau pétillante",
    ],
  },
  {
    icon: FileText,
    title: "Domiciliation",
    color: "#8b5cf6",
    desc: "Établissez votre siège social à une adresse prestigieuse à Paris pour asseoir le sérieux de votre entreprise.",
    items: [
      "Adresse commerciale Paris",
      "Gestion courrier complète",
      "KBIS compatible",
      "Numérisation sur demande",
      "Archivage sécurisé",
    ],
  },
  {
    icon: PartyPopper,
    title: "Événements & Communauté",
    color: "#14b8a6",
    desc: "Participez à nos ateliers thématiques, afterworks et pitch sessions pour agrandir votre cercle de contacts.",
    items: [
      "Afterworks mensuels",
      "Workshops & formations",
      "Pitch sessions",
      "Meetups tech & business",
      "Réseau alumni actif",
    ],
  },
]

export default function ServicesPage() {
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
              <Zap size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Services inclus</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Tout ce dont vous avez besoin
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Pas de frais cachés, pas de suppléments. Tous nos services sont inclus dans votre abonnement dès le premier jour.
            </p>
          </div>
        </SectionReveal>

        {/* Services grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {SERVICES_DATA.map((service, i) => {
            const Icon = service.icon
            return (
              <SectionReveal key={service.title} delay={i * 0.08}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: `${service.color}18`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={24} color={service.color} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.slate, marginBottom: 8 }}>{service.title}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5, marginBottom: 20 }}>{service.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    {service.items.map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: service.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <SectionReveal delay={0.25}>
          <div
            style={{
              marginTop: 72,
              background: C.slate,
              borderRadius: 24,
              padding: "48px 56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12 }}>
                Prêt à rejoindre la communauté ?
              </h2>
              <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 480, margin: 0 }}>
                Tous ces services sont inclus dans nos abonnements. Pas de surprises sur votre facture.
              </p>
            </div>
            <Link href="/templates/impact-35/pricing" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "14px 28px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Voir les tarifs
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
