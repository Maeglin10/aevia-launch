'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, Menu, X, Mail, Clock } from "lucide-react";
import { C } from "./shared";

export default function EchoChamberLayout({ children }: { children: React.ReactNode }) {
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

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Nos Studios", href: "/templates/impact-42/studios" },
    { label: "Artistes", href: "/templates/impact-42/artistes" },
    { label: "Réserver", href: "/templates/impact-42/booking" },
    { label: "Production", href: "/templates/impact-42/production" },
    { label: "Contact", href: "/templates/impact-42/contact" },
  ];

  const isHome = pathname === "/templates/impact-42";

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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* NAVBAR */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled || !isHome ? "0.75rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled || !isHome ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.82)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${scrolled || !isHome ? C.border : "transparent"}`,
          transition: "all 0.38s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/templates/impact-42"
          style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
          <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${C.accentGlow}` }}>
            <Mic2 size={18} color={C.white} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.6rem", letterSpacing: "0.08em", color: C.white }}>ECHO CHAMBER</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <div style={{ gap: "2rem", alignItems: "center" }} className="hidden md:flex">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.85rem",
                  color: isActive ? C.accent : C.textLight,
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  transition: "color 0.2s",
                  letterSpacing: "0.02em",
                  borderBottom: isActive ? `1px solid ${C.accent}` : "1px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{ backgroundColor: C.accent, color: C.white, padding: "0.55rem 1.4rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.87rem", fontWeight: 700, fontFamily: C.bodyFont, boxShadow: `0 4px 16px ${C.accentGlow}` }}
            >
              Réserver
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          className="md:block"
          aria-label="Menu"
        >
          {menuOpen ? <X color={C.white} size={24} /> : <Menu color={C.white} size={24} />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, backgroundColor: "#080808", padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderBottom: `1px solid ${C.border}` }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: pathname === l.href ? C.accent : C.text, textDecoration: "none", fontSize: "1.05rem", fontFamily: C.bodyFont, textAlign: "left", padding: "0.25rem 0", display: "block" }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/templates/impact-42/booking" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{ width: "100%", backgroundColor: C.accent, color: C.white, padding: "0.7rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: C.bodyFont }}
              >
                Réserver
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : "80px" }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#050505", padding: "5rem 2.5rem 2.5rem", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <Link href="/templates/impact-42" style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none", background: "none", border: "none", padding: 0, marginBottom: "1.35rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${C.accentGlow}` }}>
                  <Mic2 size={18} color={C.white} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em" }}>ECHO CHAMBER</span>
              </Link>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 290 }}>
                Studio d'enregistrement professionnel. SSL, Neve, Pro Tools HDX. Ouvert 7j/7, 10h–23h.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <Mail size={13} />, text: "valentinmilliand@aevia.services" },
                  { icon: <Clock size={13} />, text: "Lun–Dim : 10h–23h" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Studios",
                links: [
                  { label: "Studio A — Flagship", href: "/templates/impact-42/studios" },
                  { label: "Studio B — Production", href: "/templates/impact-42/studios" },
                  { label: "Mastering Suite", href: "/templates/impact-42/studios" },
                ],
              },
              {
                title: "Services",
                links: [
                  { label: "Réserver une session", href: "/templates/impact-42/booking" },
                  { label: "Production musicale", href: "/templates/impact-42/production" },
                  { label: "Artistes", href: "/templates/impact-42/artistes" },
                ],
              },
              {
                title: "Infos",
                links: [
                  { label: "Contact", href: "/templates/impact-42/contact" },
                  { label: "Mentions légales", href: "/templates/impact-42/legal/mentions-legales" },
                  { label: "Confidentialité", href: "/templates/impact-42/legal/confidentialite" },
                  { label: "CGU", href: "/templates/impact-42/legal/cgu" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.08em", marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted }}>
              © 2026 Echo Chamber — Aevia WS, SIREN 852 546 225
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              <Link
                href="/templates/impact-42/legal"
                style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              >
                Mentions Légales
              </Link>
              <Link
                href="/templates/impact-42/legal"
                style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              >
                Confidentialité
              </Link>
              <Link
                href="/templates/impact-42/legal"
                style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              >
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
