"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Scale, MessageSquare, Mail, Clock } from "lucide-react";
import { C, navLinks } from "./shared";

export default function LawFirmLayout({ children }: { children: React.ReactNode }) {
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

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = pathname === "/templates/impact-46" || pathname === "/templates/impact-46/";
  const solidNav = scrolled || !isHome;

  const footerCols = [
    {
      title: "Cabinet",
      links: [
        { label: "Nos services", href: "/templates/impact-46/services" },
        { label: "À propos", href: "/templates/impact-46/about" },
        { label: "Blog", href: "/templates/impact-46/blog" },
        { label: "Contact", href: "/templates/impact-46/contact" },
      ],
    },
    {
      title: "Expertise",
      links: [
        { label: "Droit des sociétés", href: "/templates/impact-46/services" },
        { label: "Fusions & acquisitions", href: "/templates/impact-46/services" },
        { label: "Propriété intellectuelle", href: "/templates/impact-46/services" },
        { label: "Contentieux commercial", href: "/templates/impact-46/services" },
      ],
    },
    {
      title: "Informations",
      links: [
        { label: "Consultation gratuite", href: "/templates/impact-46/contact" },
        { label: "Mentions légales", href: "/templates/impact-46/legal/mentions-legales" },
        { label: "Confidentialité", href: "/templates/impact-46/legal/confidentialite" },
      ],
    },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global CSS for Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
        
        body {
          background-color: ${C.bg};
          color: ${C.text};
        }
      `}} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: solidNav ? "rgba(10,22,40,0.98)" : C.navy,
        borderBottom: `1px solid ${C.borderDark}`,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, flexWrap: "wrap" as const, gap: 12 }}>
          <Link href="/templates/impact-46" style={{ textDecoration: "none" }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <><div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scale size={18} color={C.accent} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>Dumont & Associates</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
              </div>
            </div></>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ gap: 26, alignItems: "center" }} className="hidden md:flex">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  style={{
                    color: active ? C.accent : "rgba(255,255,255,0.65)",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    fontFamily: "'Source Sans Pro', system-ui",
                    borderBottom: active ? `1px solid ${C.accent}` : "1px solid transparent",
                    paddingBottom: 2,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = active ? C.accent : "rgba(255,255,255,0.65)")}
                >{l.label}</Link>
              );
            })}
            <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
              <button
                style={{ background: C.accent, color: C.white, padding: "10px 26px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Consultation gratuite</button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)}
            style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: C.white, padding: 4 }}
            className="md:block-burger"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {open && (
          <div style={{ background: C.navy, borderTop: `1px solid ${C.borderDark}`, padding: "20px 32px" }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", color: pathname === l.href ? C.accent : "rgba(255,255,255,0.75)", textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, borderBottom: `1px solid ${C.borderDark}` }}
              >{l.label}</Link>
            ))}
            <Link href="/templates/impact-46/contact" onClick={() => setOpen(false)} style={{ textDecoration: "none", display: "block", marginTop: 16 }}>
              <button style={{ width: "100%", background: C.accent, color: C.white, padding: "12px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none" }}>Consultation gratuite</button>
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 76 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.navy, borderTop: `1px solid ${C.borderDark}`, padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 64 }}>
            <div>
              <Link href="/templates/impact-46" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Scale size={18} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.white }}>Dumont & Associates</div>
                    <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
                  </div>
                </div>
              </Link>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Cabinet d'avocats spécialisé en droit des sociétés, fusions-acquisitions, propriété intellectuelle et contentieux commercial. Paris, France.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={14} color={C.accent} />
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>valentinmilliand@aevia.services</span>
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link.label} style={{ marginBottom: 12 }}>
                      <Link href={link.href}
                        style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
              {[
                { Icon: Mail, text: "valentinmilliand@aevia.services" },
                { Icon: Clock, text: "Lun–Ven, 9h–19h" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={13} color={C.accent} />
                  <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 Dumont & Associates. Tous droits réservés. Barreau de Paris.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
