"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageSquare, Link2, Wine, Phone, Mail, MapPin } from "lucide-react";
import { C, SERIF, SANS } from "./shared";

export default function ClosDuSoirLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const NAV_PAGES = [
    { label: "Accueil", href: "/templates/impact-37" },
    { label: "La Carte", href: "/templates/impact-37/carte" },
    { label: "La Cave", href: "/templates/impact-37/cave" },
    { label: "Réservation", href: "/templates/impact-37/reservation" },
    { label: "Journal", href: "/templates/impact-37/blog" },
    { label: "Contact", href: "/templates/impact-37/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* Load Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: pathname === "/templates/impact-37" ? "transparent" : C.burgundyDark,
          padding: "0 5%",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
          <Link
            href="/templates/impact-37"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 26,
                color: C.gold,
                letterSpacing: "0.04em",
              }}
            >
              Clos du Soir
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          {/* Desktop Navigation */}
          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
            className="hidden md:flex"
          >
            {NAV_PAGES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: isActive(item.href) ? 700 : 400,
                  color: isActive(item.href) ? C.gold : C.goldLight,
                  letterSpacing: "0.04em",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/templates/impact-37/reservation" style={{ textDecoration: "none" }} className="hidden md:block">
            <button
              style={{
                marginLeft: 32,
                background: "transparent",
                color: C.gold,
                padding: "10px 24px",
                borderRadius: 2,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                border: `1px solid ${C.gold}`,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Réserver
            </button>
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none",
              marginLeft: 16,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.gold,
              padding: 0,
            }}
            className="cds-burger"
            aria-label="Menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: C.burgundyDark,
            padding: "32px 8%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.gold,
              padding: 0,
              marginBottom: 24,
            }}
            aria-label="Fermer"
          >
            <X size={30} />
          </button>
          {NAV_PAGES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                fontFamily: SANS,
                fontSize: 22,
                color: C.goldLight,
                padding: "12px 0",
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/templates/impact-37/reservation"
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: "none",
              marginTop: 24,
              background: C.gold,
              color: C.burgundyDark,
              padding: "16px",
              textAlign: "center",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 2,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Réserver une table
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: C.burgundyDark, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 48,
              marginBottom: 64,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                Clos du Soir
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#c4a882",
                  lineHeight: 1.75,
                  maxWidth: 240,
                  fontWeight: 300,
                }}
              >
                Maison de dégustation, bar à vins et sommelier privé. L'art du vin, simplement partagé.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                {[Wine, MessageSquare, Link2].map((Icon, i) => (
                  <a
                    key={i}
                    href="/templates/impact-37"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "1px solid rgba(201, 168, 76, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.gold,
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Navigation
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NAV_PAGES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      fontSize: 14,
                      color: "#c4a882",
                      textDecoration: "none",
                      fontWeight: 300,
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                La Cave
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/templates/impact-37/cave" style={{ fontSize: 14, color: "#c4a882", textDecoration: "none", fontWeight: 300 }}>Bordeaux</Link>
                <Link href="/templates/impact-37/cave" style={{ fontSize: 14, color: "#c4a882", textDecoration: "none", fontWeight: 300 }}>Bourgogne</Link>
                <Link href="/templates/impact-37/cave" style={{ fontSize: 14, color: "#c4a882", textDecoration: "none", fontWeight: 300 }}>Toscane</Link>
                <Link href="/templates/impact-37/cave" style={{ fontSize: 14, color: "#c4a882", textDecoration: "none", fontWeight: 300 }}>Natural selection</Link>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Contact
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 14,
                  color: "#c4a882",
                  fontWeight: 300,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={14} color={C.gold} /> +33 1 42 60 80 20
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={14} color={C.gold} /> valentinmilliand@aevia.services
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <MapPin size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>Adresse communiquée sur demande</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "#7a5c40" }}>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-37/legal" style={{ fontSize: 13, color: "#7a5c40", textDecoration: "none" }}>Mentions Légales</Link>
              <Link href="/templates/impact-37/legal" style={{ fontSize: 13, color: "#7a5c40", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/templates/impact-37/legal" style={{ fontSize: 13, color: "#7a5c40", textDecoration: "none" }}>CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
