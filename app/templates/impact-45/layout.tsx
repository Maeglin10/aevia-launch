"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { C, navLinks } from "./shared";

export default function TattooStudioLayout({ children }: { children: React.ReactNode }) {
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

  const isHome = pathname === "/templates/impact-45" || pathname === "/templates/impact-45/";
  const solidNav = scrolled || !isHome;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global CSS for Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Barlow:wght@300;400;500;600;700&display=swap');
        
        body {
          background-color: ${C.bg};
          color: ${C.text};
        }
      `}} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: solidNav ? "rgba(10,10,10,0.97)" : "transparent",
        borderBottom: solidNav ? `1px solid ${C.border}` : "none",
        backdropFilter: solidNav ? "blur(16px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/templates/impact-45" style={{ textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: C.white, fontSize: 16, fontFamily: "'Cinzel', serif", fontWeight: 700 }}>N</span>
              </div>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.12em" }}>NOIR INK</span>
            </div>
          </>
          )}</Link>

          {/* Desktop Nav */}
          <div style={{ gap: 36, alignItems: "center" }} className="hidden md:flex">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  style={{
                    color: active ? C.white : C.textMuted,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    fontFamily: "'Barlow', system-ui",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                    fontWeight: active ? 600 : 400
                  }}
                >{l.label}</Link>
              );
            })}
            <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "10px 24px",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Barlow', system-ui",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Book Now</button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: C.white, padding: 4 }}
            className="md:block-burger"
            aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {open && (
          <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "20px 24px" }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", color: C.textMuted, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontSize: 14, borderBottom: `1px solid ${C.border}` }}
              >{l.label}</Link>
            ))}
            <Link href="/templates/impact-45/booking" onClick={() => setOpen(false)} style={{ textDecoration: "none", display: "block", marginTop: 16 }}>
              <button style={{ width: "100%", background: C.accent, color: C.white, padding: "12px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 700, border: "none" }}>Book Consultation</button>
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: C.white, fontSize: 16, fontFamily: "'Cinzel', serif", fontWeight: 700 }}>N</span>
                </div>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.12em" }}>NOIR INK</span>
              </div>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Fine line and blackwork tattoo studio. Paris, France. By appointment only.</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <MessageSquare size={18} color={C.textDim} />
                <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textDim }}>@noir.ink.paris</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.white, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Studio</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {navLinks.map((l) => (
                  <li key={l.label} style={{ marginBottom: 12 }}>
                    <Link href={l.href} style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted, textDecoration: "none" }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.white, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  <Link href="/templates/impact-45/legal" style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted, textDecoration: "none" }}>Mentions Légales</Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link href="/templates/impact-45/legal" style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted, textDecoration: "none" }}>Confidentialité</Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link href="/templates/impact-45/legal" style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted, textDecoration: "none" }}>CGU</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.white, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted }}>
                <li style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={14} color={C.accent} /> 18 Rue Oberkampf, Paris 11e
                </li>
                <li style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={14} color={C.accent} /> +33 1 42 00 00 00
                </li>
                <li style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={14} color={C.accent} /> Tue–Sat, 10h–20h
                </li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textDim, margin: 0 }}>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
