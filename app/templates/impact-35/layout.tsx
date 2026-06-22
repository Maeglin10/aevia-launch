"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Menu, X, MessageSquare, Link2, Camera } from "lucide-react"
import { C, FONT } from "./shared"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: "Nos Espaces", href: "/templates/impact-35/spaces" },
    { label: "Tarifs", href: "/templates/impact-35/pricing" },
    { label: "Services", href: "/templates/impact-35/services" },
    { label: "Communauté", href: "/templates/impact-35/community" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div
      style={{
        fontFamily: FONT,
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* Google Font loader */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
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
          }}
        >
          {/* Logo */}
          <Link
            href="/templates/impact-35"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: C.accent,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} color={C.white} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: C.slate }}>Nexus Hub</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            <Link
              href="/templates/impact-35"
              style={{
                fontSize: 15,
                fontWeight: isActive("/templates/impact-35") ? 700 : 500,
                color: isActive("/templates/impact-35") ? C.accent : C.textMuted,
                textDecoration: "none",
                padding: "4px 0",
                borderBottom: isActive("/templates/impact-35") ? `2px solid ${C.accent}` : "2px solid transparent",
                transition: "color 0.15s",
              }}
            >
              Accueil
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 15,
                  fontWeight: isActive(item.href) ? 700 : 500,
                  color: isActive(item.href) ? C.accent : C.textMuted,
                  textDecoration: "none",
                  padding: "4px 0",
                  borderBottom: isActive(item.href) ? `2px solid ${C.accent}` : "2px solid transparent",
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-35/pricing"
              style={{
                background: C.accent,
                color: C.white,
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Réserver
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
            className="md:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} color={C.slate} /> : <Menu size={24} color={C.slate} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: C.white,
              borderTop: `1px solid ${C.border}`,
              padding: "16px 5%",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Link
              href="/templates/impact-35"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: isActive("/templates/impact-35") ? C.accentDark : C.text,
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                background: isActive("/templates/impact-35") ? C.accentLight : "none",
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
                  fontSize: 16,
                  fontWeight: 600,
                  color: isActive(item.href) ? C.accentDark : C.text,
                  padding: "12px 16px",
                  borderRadius: 10,
                  textDecoration: "none",
                  background: isActive(item.href) ? C.accentLight : "none",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-35/pricing"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: C.accent,
                color: C.white,
                padding: "12px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                textAlign: "center",
                textDecoration: "none",
                marginTop: 10,
              }}
            >
              Réserver
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* Footer */}
      <footer style={{ background: C.slate, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 40,
              marginBottom: 60,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: C.accent,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={20} color={C.white} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 20, color: C.white }}>Nexus Hub</span>
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, maxWidth: 280 }}>
                Un espace de coworking premium à Paris où freelances, startups et scale-ups réalisent leurs meilleures ambitions.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} color="#94a3b8" />
                  </a>
                ))}
              </div>
            </div>

            {/* Espaces */}
            <div>
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Espaces
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-35/spaces" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  Nos espaces
                </Link>
                <Link href="/templates/impact-35/pricing" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  Tarifs
                </Link>
                <Link href="/templates/impact-35/services" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  Services
                </Link>
              </div>
            </div>

            {/* Communauté */}
            <div>
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Communauté
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-35/community" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  Notre communauté
                </Link>
                <Link href="/templates/impact-35/pricing#visite" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  Visites
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="mailto:contact@aevia.io" style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>
                  contact@aevia.io
                </a>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>+33 1 23 45 67 89</span>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>Paris — sur demande</span>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>Lun–Ven 9h–19h</span>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "#475569" }}>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Link href="/templates/impact-35/legal" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>
                Mentions légales
              </Link>
              <Link href="/templates/impact-35/legal" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>
                Confidentialité
              </Link>
              <Link href="/templates/impact-35/legal" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
