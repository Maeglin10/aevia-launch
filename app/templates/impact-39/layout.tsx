"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Truck, MessageSquare, Link2, Camera } from "lucide-react";
import { C, SANS } from "./shared";

export default function SwiftMoveLayout({ children }: { children: React.ReactNode }) {
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
  const pathname = usePathname();

  const NAV_LINKS = [
    { label: "Nos Services", href: "/templates/impact-39/services" },
    { label: "Devis Gratuit", href: "/templates/impact-39/devis" },
    { label: "Garde-Meuble", href: "/templates/impact-39/stockage" },
    { label: "Conseils", href: "/templates/impact-39/conseils" },
    { label: "Contact", href: "/templates/impact-39/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.bg,
        color: C.text,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* Load Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
          {/* Logo */}
          <Link
            href="/templates/impact-39"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Truck size={22} color={C.white} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: C.navy }}>Swift Move</span>
              </>
            )}
          </Link>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ gap: 24, alignItems: "center" }} className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive(link.href) ? C.orange : C.textMuted,
                  fontFamily: SANS,
                  padding: "4px 0",
                  borderBottom: isActive(link.href) ? `2px solid ${C.orange}` : "2px solid transparent",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ gap: 12, alignItems: "center" }} className="hidden md:flex">
            <a href="tel:+33100000000" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: C.navy, textDecoration: "none" }}>
              <Phone size={15} color={C.orange} />
              +33 1 XX XX XX XX
            </a>
            <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{ background: C.orange, color: C.white, padding: "10px 22px", borderRadius: 8, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", fontFamily: SANS }}
              >
                Devis gratuit
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            className="md:block"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} color={C.navy} /> : <Menu size={24} color={C.navy} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "16px 5%", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: 16, fontWeight: 700, color: isActive(link.href) ? C.orange : C.navy, fontFamily: SANS, borderBottom: `1px solid ${C.border}`, textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ padding: "12px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="tel:+33100000000" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 700, color: C.navy, textDecoration: "none" }}>
                <Phone size={16} color={C.orange} />
                +33 1 XX XX XX XX
              </a>
              <Link href="/templates/impact-39/devis" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{ width: "100%", background: C.orange, color: C.white, padding: "12px 24px", borderRadius: 8, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: SANS }}
                >
                  Devis gratuit
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: C.navy, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 60 }}>
            <div>
              <Link href="/templates/impact-39" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Truck size={22} color={C.white} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>Swift Move</span>
                </div>
              </Link>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, maxWidth: 260 }}>
                Société agréée et assurée, intervenant en Île-de-France et dans toute la France. Votre déménagement confié à des professionnels.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a key={i} href="/templates/impact-39" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.07)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#64748b" />
                  </a>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={15} color={C.orange} />
                <a href="tel:+33100000000" style={{ fontSize: 16, fontWeight: 800, color: C.white, textDecoration: "none" }}>+33 1 XX XX XX XX</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prestations</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Déménagement local", href: "/templates/impact-39/services" },
                  { label: "Longue distance", href: "/templates/impact-39/services" },
                  { label: "International", href: "/templates/impact-39/services" },
                  { label: "Entreprises", href: "/templates/impact-39/services" },
                  { label: "Garde-meuble", href: "/templates/impact-39/stockage" },
                ].map((link) => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: "none", fontSize: 14, color: "#64748b", textAlign: "left", padding: 0 }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Informations</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Conseils déménagement", href: "/templates/impact-39/conseils" },
                  { label: "Devis gratuit", href: "/templates/impact-39/devis" },
                  { label: "Contact", href: "/templates/impact-39/contact" },
                ].map((link) => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: "none", fontSize: 14, color: "#64748b", textAlign: "left", padding: 0 }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Zone d'intervention</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Paris (75)", "Hauts-de-Seine (92)", "Val-de-Marne (94)", "Yvelines (78)", "France entière"].map((zone) => (
                  <span key={zone} style={{ fontSize: 14, color: "#64748b" }}>{zone}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#334155" }}>© 2025 Aevia WS — SIREN 852 546 225 — valentinmilliand@aevia.services</p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-39/legal" style={{ textDecoration: "none", fontSize: 13, color: "#334155" }}>
                Mentions légales
              </Link>
              <Link href="/templates/impact-39/legal" style={{ textDecoration: "none", fontSize: 13, color: "#334155" }}>
                Confidentialité
              </Link>
              <Link href="/templates/impact-39/legal" style={{ textDecoration: "none", fontSize: 13, color: "#334155" }}>
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
