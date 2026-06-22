"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Clock, Menu, X } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT } from "./shared";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (path: string) => pathname === path;

  const links = [
    { label: "Accueil", href: "/templates/impact-32" },
    { label: "Nos services", href: "/templates/impact-32/services" },
    { label: "Notre équipe", href: "/templates/impact-32/equipe" },
    { label: "Prendre RDV", href: "/templates/impact-32/pricing" },
  ];

  return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "clip", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Google fonts loader */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');
      `}</style>

      {/* Navbar */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(250,255,254,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT
        }}
      >
        <Link href="/templates/impact-32" style={{ textDecoration: "none" }}>
          <motion.div style={{ display: "flex", alignItems: "center", gap: 10 }} whileHover={{ scale: 1.03 }}>
            <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TemplateIcon emoji="🐾" size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>
              Paw<span style={{ color: C.accent }}>Care</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(link.href) ? C.accent : C.text,
                fontWeight: isActive(link.href) ? 800 : 600,
                fontSize: 15,
                textDecoration: "none",
                fontFamily: FONT,
                transition: "color 0.15s"
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
            <motion.button
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT
              }}
              whileHover={{ background: C.accentDark, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Prendre RDV
            </motion.button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.text }}
          className="md:hidden block"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              zIndex: 99,
              background: C.bg,
              padding: "24px 48px",
              borderBottom: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              fontFamily: FONT
            }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: isActive(link.href) ? C.accent : C.text,
                  fontWeight: isActive(link.href) ? 800 : 600,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 16
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-32/pricing"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: C.accent,
                color: C.white,
                borderRadius: 10,
                padding: "12px",
                fontWeight: 800,
                marginTop: 16,
                textDecoration: "none"
              }}
            >
              Prendre RDV en ligne
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 52 }}>
          <div>
            <Link href="/templates/impact-32" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TemplateIcon emoji="🐾" size={20} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>PawCare Clinic</span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Clinique vétérinaire bienveillante à Bordeaux. Parce que votre animal mérite les mêmes soins d'excellence que vous.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: <Mail size={15} />, text: "contact@pawcare-bordeaux.fr" },
                { icon: <MapPin size={15} />, text: "Adresse communiquée sur demande à contact@aevia.io" },
                { icon: <Clock size={15} />, text: "Lun–Sam 8h–20h | Urgences 24h/7j" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                  <span style={{ color: C.sand }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {[
            { title: "Nos services", links: [
              { label: "Tous nos services", href: "/templates/impact-32/services" },
              { label: "Consultation générale", href: "/templates/impact-32/services" },
              { label: "Chirurgie vétérinaire", href: "/templates/impact-32/services" },
              { label: "Urgences 24h/7j", href: "/templates/impact-32/services" }
            ]},
            { title: "La Clinique", links: [
              { label: "Notre équipe", href: "/templates/impact-32/equipe" },
              { label: "Tarifs & Assurance", href: "/templates/impact-32/pricing" },
              { label: "Prendre RDV", href: "/templates/impact-32/pricing" }
            ]},
            { title: "Pratique", links: [
              { label: "Mentions légales", href: "/legal/mentions-legales" },
              { label: "Confidentialité", href: "/legal/confidentialite" },
              { label: "CGU", href: "/legal/cgu" }
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>
            © 2026 PawCare Clinic — Site réalisé par <Link href="/templates/impact-32/legal" style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}>Aevia WS</Link>
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/templates/impact-32/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/templates/impact-32/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/templates/impact-32/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
