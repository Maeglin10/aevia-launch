"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { C, F, navLinks, globalCss } from "./shared";

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isHome = pathname === "/templates/impact-48" || pathname === "/templates/impact-48/";
  const solid = scrolled || !isHome;

  const footerCols = [
    {
      title: "Projets",
      links: [
        { label: "Tous les projets", href: "/templates/impact-48/projects" },
        { label: "Logements collectifs", href: "/templates/impact-48/projects" },
        { label: "Équipements culturels", href: "/templates/impact-48/projects" },
        { label: "Sièges sociaux", href: "/templates/impact-48/projects" },
      ],
    },
    {
      title: "Atelier",
      links: [
        { label: "Notre histoire", href: "/templates/impact-48/about" },
        { label: "Le blog", href: "/templates/impact-48/blog" },
        { label: "Nos expertises", href: "/templates/impact-48/services" },
        { label: "Nous contacter", href: "/templates/impact-48/contact" },
      ],
    },
    {
      title: "Infos",
      links: [
        { label: "Mentions légales", href: "/legal/mentions-legales" },
        { label: "Confidentialité", href: "/legal/confidentialite" },
        { label: "Contact", href: "/templates/impact-48/contact" },
        { label: "Blog", href: "/templates/impact-48/blog" },
      ],
    },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global CSS for Premium Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          background-color: ${C.bg};
          color: ${C.text};
          font-family: 'Inter', system-ui;
        }

        h1, h2, h3, .serif-font {
          font-family: 'Cormorant Garamond', Georgia, serif !important;
        }

        ${globalCss}
      `}} />

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: solid ? 'rgba(250,250,247,0.96)' : 'transparent',
          backdropFilter: solid ? 'blur(12px)' : 'none',
          borderBottom: solid ? `1px solid ${C.border}` : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '0 40px',
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap' as const,
            gap: 12,
          }}
        >
          {/* Logo */}
          <Link href="/templates/impact-48">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase' as const,
                  color: solid ? C.text : C.white,
                  transition: 'color 0.4s',
                }}
              >
                ATELIER
              </span>
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 9,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                MOREAU · LEROY
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div
            style={{
              display: 'flex',
              gap: 28,
              alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: F.sans,
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const,
                    color: active
                      ? C.accent
                      : solid
                        ? C.textMuted
                        : 'rgba(255,255,255,0.6)',
                    borderBottom: active
                      ? `1px solid ${C.accent}`
                      : '1px solid transparent',
                    paddingBottom: 2,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active
                      ? C.accent
                      : solid
                        ? C.textMuted
                        : 'rgba(255,255,255,0.6)')
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/templates/impact-48/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: F.sans,
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                  border: `1px solid ${C.accentBorder}`,
                  padding: '9px 22px',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.accent;
                  e.currentTarget.style.color = C.bgDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = C.accent;
                }}
              >
                New Enquiry
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: solid ? C.text : C.white, padding: 4 }}
            className="md:block-burger"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {open && (
          <div style={{ background: C.bgDark, borderTop: `1px solid rgba(255,255,255,0.08)`, padding: "20px 40px" }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", color: pathname === l.href ? C.accent : "rgba(255,255,255,0.75)", textDecoration: "none", fontFamily: F.sans, fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.06)` }}
              >{l.label}</Link>
            ))}
            <Link href="/templates/impact-48/contact" onClick={() => setOpen(false)} style={{ textDecoration: "none", display: "block", marginTop: 16 }}>
              <button style={{ width: "100%", background: C.accent, color: C.bgDark, padding: "12px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: F.sans, fontWeight: 700, border: "none" }}>New Enquiry</button>
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.bgDark, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: "80px 40px 40px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }} className="two-col">
            <div>
              <Link href="/templates/impact-48" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 20 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: C.white }}>ATELIER</span>
                  <span style={{ fontFamily: F.sans, fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase" as const, color: C.accent }}>MOREAU · LEROY</span>
                </div>
              </Link>
              <p style={{ fontFamily: F.sans, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Studio d'architecture et d'urbanisme. Conception de bâtiments pérennes, sobres et généreux. Paris · Genève.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>contact@aevia.io</span>
              </div>
            </div>

            {footerCols.map((col, idx) => (
              <div key={idx}>
                <h4 style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link, li) => (
                    <li key={li} style={{ marginBottom: 12 }}>
                      <Link href={link.href}
                        style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
              <span style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Paris · Genève</span>
            </div>
            <p style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 Atelier Moreau · Leroy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
