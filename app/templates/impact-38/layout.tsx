"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Camera, MessageSquare, Link2, Coffee } from "lucide-react";
import { C, SERIF, SANS } from "./shared";

export default function OriginRoastLayout({ children }: { children: React.ReactNode }) {
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = [
    { label: "Nos Origines", href: "/templates/impact-38/origins" },
    { label: "Menu Café", href: "/templates/impact-38/menu" },
    { label: "Ateliers", href: "/templates/impact-38/workshops" },
    { label: "Abonnement", href: "/templates/impact-38/abonnement" },
    { label: "Contact", href: "/templates/impact-38/contact" },
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap');
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.espresso, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
          <Link
            href="/templates/impact-38"
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
            <div style={{ width: 32, height: 32, background: C.caramel, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Coffee size={16} color={C.espresso} />
            </div>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: C.cream }}>
              Origin Roast
            </span>
              </>
            )}
          </Link>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: isActive(link.href) ? "underline" : "none",
                  textUnderlineOffset: 4,
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: isActive(link.href) ? 700 : 500,
                  color: isActive(link.href) ? C.caramel : C.sand,
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }} className="hidden md:block">
            <button
              type="button"
              style={{ background: C.caramel, color: C.espresso, padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              S'abonner
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: 0, color: C.cream }}
            className="md:block"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} color={C.cream} /> : <Menu size={24} color={C.cream} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 0 24px", display: "flex", flexDirection: "column", gap: 4 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ display: "flex", width: "100%", padding: "12px 5%", textDecoration: "none", fontFamily: SANS, fontSize: 16, fontWeight: 600, color: isActive(link.href) ? C.caramel : C.sand, textAlign: "left" }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ padding: "8px 5% 0" }}>
              <Link href="/templates/impact-38/abonnement" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                <button type="button"
                  style={{ display: "block", width: "100%", background: C.caramel, color: C.espresso, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  S'abonner
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: C.espresso, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 60 }}>
            <div>
              <Link href="/templates/impact-38" style={{ textDecoration: "none" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: C.caramel, marginBottom: 16 }}>
                  Origin Roast
                </div>
              </Link>
              <p style={{ fontSize: 14, color: "#7a5c3a", lineHeight: 1.75, maxWidth: 260, fontWeight: 300 }}>
                Specialty coffee sourced directly from farms, roasted in small batches, shipped at peak freshness.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[Camera, MessageSquare, Link2].map((Icon, i) => (
                  <a key={i} href="/templates/impact-38" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#7a5c3a" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Boutique
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} href={link.href}
                    style={{ textDecoration: "none", fontSize: 13, color: "#7a5c3a", textAlign: "left", padding: 0, fontWeight: 300 }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Entreprise
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Notre histoire", "Producteurs partenaires", "Durabilité", "Blog"].map((link) => (
                  <Link
                    key={link}
                    href={
                      link === "Notre histoire" || link === "Producteurs partenaires" || link === "Durabilité"
                        ? "/templates/impact-38/origins"
                        : "/templates/impact-38/workshops"
                    }
                    style={{ fontSize: 13, color: "#7a5c3a", textDecoration: "none", fontWeight: 300 }}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="mailto:valentinmilliand@aevia.services" style={{ fontSize: 13, color: "#7a5c3a", textDecoration: "none", fontWeight: 300 }}>valentinmilliand@aevia.services</a>
                <Link href="/templates/impact-38/contact"
                  style={{ textDecoration: "none", fontSize: 13, color: "#7a5c3a", textAlign: "left", padding: 0, fontWeight: 300 }}>
                  Nous écrire
                </Link>
                <span style={{ fontSize: 13, color: "#3d2010", fontWeight: 300 }}>Lun–Ven 7h–19h</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#3d2010", margin: 0 }}>© 2025 Origin Roast — Aevia WS</p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-38/legal" style={{ fontSize: 13, color: "#3d2010", textDecoration: "none" }}>
                Mentions légales
              </Link>
              <Link href="/templates/impact-38/legal" style={{ fontSize: 13, color: "#3d2010", textDecoration: "none" }}>
                Confidentialité
              </Link>
              <Link href="/templates/impact-38/legal" style={{ fontSize: 13, color: "#3d2010", textDecoration: "none" }}>
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
