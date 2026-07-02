"use client"

import React, { useState } from "react"
import { Shield, FileText, Check } from "lucide-react"
import { C, SectionReveal } from "../shared"

export default function LegalPage() {
  const [tab, setTab] = useState<"mentions" | "privacy">("mentions")

  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Toggle between tabs */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: C.slate, marginBottom: 24 }}>
              Informations Légales
            </h1>
            <div
              style={{
                display: "inline-flex",
                background: C.bgAlt,
                borderRadius: 40,
                padding: 4,
                border: `1px solid ${C.border}`,
              }}
            >
              {[
                { id: "mentions", label: "Mentions légales" },
                { id: "privacy", label: "Données personnelles" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setTab(btn.id as "mentions" | "privacy")}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 36,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: tab === btn.id ? C.slate : "transparent",
                    color: tab === btn.id ? C.white : C.textMuted,
                    transition: "all 0.2s",
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          {tab === "mentions" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                {
                  title: "Éditeur du site",
                  content:
                    "Aevia WS — SIREN 852 546 225\nAuto-entrepreneur\nEmail : valentinmilliand@aevia.services\nAdresse du siège social communiquée sur demande.",
                },
                {
                  title: "Hébergement",
                  content: "Vercel Inc.\n340 Pine Street, Suite 701\nSan Francisco, CA 94104 — États-Unis\nhttps://vercel.com",
                },
                {
                  title: "Responsable de publication",
                  content: "Le responsable de publication est le gérant d'Aevia WS. Pour tout contact : valentinmilliand@aevia.services",
                },
                {
                  title: "Propriété intellectuelle",
                  content:
                    "L'ensemble du contenu de ce site (textes, images, visuels) est la propriété exclusive d'Aevia WS, sauf mention contraire. Toute reproduction est interdite sans autorisation écrite préalable.",
                },
                {
                  title: "Limitation de responsabilité",
                  content:
                    "Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne peut garantir leur exhaustivité. Aevia WS ne saurait être tenu responsable des dommages résultant de l'utilisation de ce site.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 12 }}>{section.title}</h2>
                  <div
                    style={{
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 24,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                {
                  title: "Données collectées",
                  content:
                    "Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact ou d'inscription aux visites (nom, email, message). Aucune donnée n'est collectée automatiquement sans votre consentement.",
                },
                {
                  title: "Utilisation des données",
                  content:
                    "Vos données sont utilisées exclusivement pour répondre à vos demandes et valider vos visites d'essai. Elles ne sont jamais vendues, partagées ou cédées à des tiers à des fins commerciales.",
                },
                {
                  title: "Conservation",
                  content:
                    "Les données sont conservées pendant 3 ans à compter du dernier contact, puis supprimées automatiquement.",
                },
                {
                  title: "Vos droits",
                  content:
                    "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits : valentinmilliand@aevia.services",
                },
                {
                  title: "Cookies",
                  content:
                    "Ce site n'utilise pas de cookies de tracking tiers. Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 12 }}>{section.title}</h2>
                  <div
                    style={{
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 24,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.75,
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionReveal>
      </div>
    </div>
  )
}
