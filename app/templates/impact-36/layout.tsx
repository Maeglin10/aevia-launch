"use client"
/*
  impact-36 — Apex Talent. Nav et pied de page partagés, francisés :
  l'adresse new-yorkaise et les horaires ET ont cédé la place aux
  coordonnées du contrat.
*/
import {
  clientCodePostalVille,
  clientEmail,
  clientName,
  clientPhone,
} from "@/lib/templates/clientContent";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import React, { useState, useEffect } from "react";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Award, Menu, X } from "lucide-react"
import { C, FONT, SERIF } from "./shared"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [__layoutSession, __setLayoutSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(__setLayoutSession)
      .catch(() => {});
  }, []);
  const fd = __layoutSession?.formData;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: "Services", href: "/templates/impact-36/services" },
    { label: "Secteurs", href: "/templates/impact-36/sectors" },
    { label: "Missions", href: "/templates/impact-36/results" },
  ]

  const isActive = (href: string) => pathname === href

  const tel = clientPhone(__layoutSession) ?? "01 44 70 82 15";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(__layoutSession) ?? "contact@apex-talent.fr";

  return (
    <div
      style={{
        fontFamily: FONT,
        background: C.bg,
        color: C.text,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* Fontes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,500&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.navy,
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/templates/impact-36"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div
              style={{
                width: 36,
                height: 36,
                background: C.surMarine,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Award size={20} color={C.navy} />
            </div>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 20,
                color: C.white,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >{/* NOM_LOGO */ clientName(__layoutSession) ?? (<>
              Apex Talent
            </>)}</span>
          </>
          )}</Link>

          {/* Liens bureau */}
          <div
            style={{
              gap: 32,
              alignItems: "center",
            }}
            className="hidden md:flex"
          >
            <Link
              href="/templates/impact-36"
              style={{
                fontSize: 14,
                fontWeight: isActive("/templates/impact-36") ? 700 : 500,
                color: isActive("/templates/impact-36") ? C.white : C.surMarine,
                textDecoration: "none",
              }}
            >
              Accueil
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: isActive(item.href) ? 700 : 500,
                  color: isActive(item.href) ? C.white : C.surMarine,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Appels à l'action */}
          <div style={{ gap: 12 }} className="hidden md:flex">
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: C.white,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Je suis candidat·e
              </span>
            </Link>
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <span
                style={{
                  background: C.surMarine,
                  color: C.navy,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Confier un recrutement
              </span>
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.white,
              padding: 10,
            }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div
            style={{
              background: C.navy,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 5%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Link
              href="/templates/impact-36"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.surMarine,
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              Accueil
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.surMarine,
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                {item.label}
              </Link>
            ))}
            <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "8px 0" }} />
            <Link
              href="/templates/impact-36/services#contact-form"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: C.surMarine,
                color: C.navy,
                padding: "12px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Confier un recrutement
            </Link>
          </div>
        )}
      </nav>

      {/* Contenu */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* PIED DE PAGE */}
      <footer style={{ background: C.navy, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 60,
              marginBottom: 60,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: C.surMarine,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={20} color={C.navy} />
                </div>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 20, color: C.white }}>{clientName(__layoutSession) ?? "Apex Talent"}</span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: C.surMarine,
                  opacity: 0.75,
                  lineHeight: 1.75,
                  maxWidth: 280,
                }}
              >
                Cabinet de recrutement de dirigeants et conseil RH — pour les entreprises qui placent la barre haut.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Services
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: C.surMarine, opacity: 0.8, textDecoration: "none" }}>Chasse de dirigeants</Link>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: C.surMarine, opacity: 0.8, textDecoration: "none" }}>Recrutement délégué</Link>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: C.surMarine, opacity: 0.8, textDecoration: "none" }}>Conseil RH</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Références
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-36/results" style={{ fontSize: 14, color: C.surMarine, opacity: 0.8, textDecoration: "none" }}>Missions menées</Link>
                <Link href="/templates/impact-36/sectors" style={{ fontSize: 14, color: C.surMarine, opacity: 0.8, textDecoration: "none" }}>Secteurs couverts</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`mailto:${mail}`} style={{ fontSize: 14, color: C.surMarine, opacity: 0.85, textDecoration: "none", wordBreak: "break-all" }}>{mail}</a>
                <a href={telHref} style={{ fontSize: 14, color: C.surMarine, opacity: 0.85, textDecoration: "none" }}>{tel}</a>
                <span style={{ fontSize: 14, color: C.surMarine, opacity: 0.85 }}>{clientCodePostalVille(__layoutSession, "75008", "Paris")}</span>
                <span style={{ fontSize: 14, color: C.surMarine, opacity: 0.85 }}>Du lundi au vendredi, 9 h – 19 h</span>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "rgba(169,189,211,0.55)" }}>
              © {clientName(__layoutSession) ?? "Apex Talent"} · Site réalisé par Aevia WS — SIREN <LegalIdentity />
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "rgba(169,189,211,0.55)", textDecoration: "none" }}>Mentions légales</Link>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "rgba(169,189,211,0.55)", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "rgba(169,189,211,0.55)", textDecoration: "none" }}>CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
