"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UtensilsCrossed, MapPin, Phone, Mail } from "lucide-react";
import { C } from "./shared";

export default function GastronomyLayout({ children }: { children: React.ReactNode }) {
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Menus", href: "/templates/impact-40/menu" },
    { label: "À la Carte", href: "/templates/impact-40/carte" },
    { label: "Réservation", href: "/templates/impact-40/reservation" },
    { label: "Le Chef", href: "/templates/impact-40/chef" },
    { label: "Contact", href: "/templates/impact-40/contact" },
  ];

  const isOnHome = pathname === "/templates/impact-40";
  const navBg = scrolled || !isOnHome ? "rgba(253,249,238,0.96)" : "transparent";
  const navShadow = scrolled || !isOnHome ? `0 1px 24px ${C.shadow}` : "none";
  const navBlur = scrolled || !isOnHome ? "blur(14px)" : "none";
  const logoColor = scrolled || !isOnHome ? C.bgDark : C.bg;
  const linkColor = scrolled || !isOnHome ? C.textLight : "rgba(253,249,238,0.8)";
  const linkHoverColor = scrolled || !isOnHome ? C.bgDark : C.accent;

  const isActive = (href: string) => pathname === href;

  return (
    <div
      style={{
        fontFamily: C.bodyFont,
        backgroundColor: C.bg,
        color: C.text,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* Load Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled || !isOnHome ? "0.7rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: navBg,
          backdropFilter: navBlur,
          boxShadow: navShadow,
          transition: "all 0.38s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/templates/impact-40"
          style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}
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
              width: 38, height: 38,
              borderRadius: "50%",
              backgroundColor: C.bgDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <UtensilsCrossed size={17} color={C.accent} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", fontWeight: 700, color: logoColor, transition: "color 0.3s" }}>
            Gabriel Renaud
          </span>
            </>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ gap: "2rem", alignItems: "center" }} className="hidden md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.88rem",
                color: isActive(l.href) ? C.accent : linkColor,
                textDecoration: "none",
                fontWeight: isActive(l.href) ? 700 : 500,
                transition: "color 0.2s",
                borderBottom: isActive(l.href) ? `2px solid ${C.accent}` : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "0.55rem 1.35rem",
                borderRadius: "2rem",
                fontSize: "0.87rem",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                border: "none",
                cursor: "pointer",
              }}
            >
              Réserver
            </button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
          className="md:block"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X color={logoColor} size={24} /> : <Menu color={logoColor} size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 72, left: 0, right: 0,
            zIndex: 99,
            backgroundColor: C.bg,
            padding: "1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            boxShadow: `0 8px 32px ${C.shadow}`,
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: isActive(l.href) ? C.accentDark : C.text,
                fontSize: "1.05rem",
                fontFamily: C.bodyFont,
                fontWeight: isActive(l.href) ? 700 : 500,
                textAlign: "left",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/templates/impact-40/reservation" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{
                width: "100%",
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "0.7rem 1.5rem",
                borderRadius: "2rem",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                border: "none",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Réserver
            </button>
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: C.bgDark, padding: "5rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
            <div>
              <Link href="/templates/impact-40" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem", textDecoration: "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UtensilsCrossed size={14} color={C.bgDark} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.2rem", fontWeight: 700, color: C.bg }}>
                  Gabriel Renaud
                </span>
              </Link>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: "rgba(253,249,238,0.5)", lineHeight: 1.75, margin: 0 }}>
                Cuisine saisonnière gastronomique en plein cœur du Beaujolais. Une expérience culinaire d'une justesse absolue.
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: C.headingFont, fontSize: "0.95rem", color: C.accent, fontWeight: 700, margin: "0 0 1.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Le Restaurant
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {navLinks.map((l) => (
                  <Link key={l.label} href={l.href} style={{ textDecoration: "none", fontFamily: C.bodyFont, fontSize: "0.85rem", color: "rgba(253,249,238,0.5)" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: C.headingFont, fontSize: "0.95rem", color: C.accent, fontWeight: 700, margin: "0 0 1.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Accès & Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: C.bodyFont, fontSize: "0.85rem", color: "rgba(253,249,238,0.5)" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <MapPin size={15} color={C.accent} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <span>Beaujolais, France (sur demande)</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Phone size={15} color={C.accent} />
                  <span>+33 4 74 XX XX XX</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Mail size={15} color={C.accent} />
                  <span>valentinmilliand@aevia.services</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(253,249,238,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.35)", margin: 0 }}>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link href="/templates/impact-40/legal" style={{ textDecoration: "none", fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.35)" }}>
                Mentions Légales
              </Link>
              <Link href="/templates/impact-40/legal" style={{ textDecoration: "none", fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.35)" }}>
                Confidentialité
              </Link>
              <Link href="/templates/impact-40/legal" style={{ textDecoration: "none", fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.35)" }}>
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
