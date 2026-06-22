"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Award, Menu, X, MessageSquare, Link2, Users2 } from "lucide-react"
import { C, FONT } from "./shared"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: "Services", href: "/templates/impact-36/services" },
    { label: "Sectors", href: "/templates/impact-36/sectors" },
    { label: "Results", href: "/templates/impact-36/results" },
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
        overflowX: "hidden",
      }}
    >
      {/* Load Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* NAVBAR */}
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
          }}
        >
          <Link
            href="/templates/impact-36"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
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
              <Award size={20} color={C.white} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: C.white,
              }}
            >
              Apex Talent
            </span>
          </Link>

          {/* Desktop Links */}
          <div
            style={{
              display: "flex",
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
                color: isActive("/templates/impact-36") ? C.white : "#93c5fd",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: isActive(item.href) ? 700 : 500,
                  color: isActive(item.href) ? C.white : "#93c5fd",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12 }} className="hidden md:flex">
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: C.white,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}
              >
                I'm a Candidate
              </button>
            </Link>
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Hire Talent
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.white,
              padding: 4,
            }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
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
                color: "#93c5fd",
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              Home
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#93c5fd",
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
                background: C.accent,
                color: C.white,
                padding: "12px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Hire Talent
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* FOOTER */}
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
                    background: C.accent,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={20} color={C.white} />
                </div>
                <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>Apex Talent</span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.75,
                  maxWidth: 280,
                }}
              >
                Executive search and HR consulting firm. Placing senior leaders at companies that set the standard.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Users2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} color="#64748b" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Services
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Executive Search</Link>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>RPO Solutions</Link>
                <Link href="/templates/impact-36/services" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>HR Consulting</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Results
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-36/results" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Case Studies</Link>
                <Link href="/templates/impact-36/sectors" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Sectors Served</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="mailto:contact@aevia.io" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>contact@aevia.io</a>
                <span style={{ fontSize: 14, color: "#64748b" }}>+1 212 555 0190</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>New York, NY 10022</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>Mon-Fri 8am-7pm ET</span>
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
            <p style={{ fontSize: 13, color: "#334155" }}>
              © 2026 Aevia WS — SIREN 852 546 225. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>Legal Notice</Link>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/templates/impact-36/legal" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
