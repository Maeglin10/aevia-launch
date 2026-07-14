"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Phone, Mail, MapPin, Clock, Menu, X, Calendar } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY } from "./shared";

export default function Layout({ children }: { children: React.ReactNode }) {
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
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (path: string) => pathname === path;

  const links = [
    { label: "Accueil", href: "/templates/impact-31" },
    { label: "Cours", href: "/templates/impact-31/cours" },
    { label: "Tarifs", href: "/templates/impact-31/pricing" },
    { label: "Professeurs", href: "/templates/impact-31/professeurs" },
    { label: "Contact", href: "/templates/impact-31/contact" },
  ];

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Load Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
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
          background: scrolled ? "rgba(250,247,242,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT_BODY,
        }}
      >
        <Link href="/templates/impact-31" style={{ textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <><motion.div style={{ display: "flex", alignItems: "center", gap: 10 }} whileHover={{ scale: 1.03 }}>
            <div style={{ width: 38, height: 38, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={20} color={C.white} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 21, color: C.text, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>
              Ananda<span style={{ color: C.accent }}>Flow</span>
            </span>
          </motion.div></>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ gap: 32, alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(link.href) ? C.accent : C.text,
                fontWeight: isActive(link.href) ? 700 : 400,
                fontSize: 15,
                textDecoration: "none",
                fontFamily: FONT_BODY,
                transition: "color 0.15s"
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/templates/impact-31/pricing" style={{ textDecoration: "none" }}>
            <motion.button
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 25,
                padding: "10px 24px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: FONT_BODY,
              }}
              whileHover={{ background: C.accentDark, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Essai gratuit
            </motion.button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.text }}
          className="md:hidden block"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu panel */}
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
              fontFamily: FONT_BODY,
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
                  fontWeight: isActive(link.href) ? 700 : 500,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-31/pricing"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: C.accent,
                color: C.white,
                borderRadius: 25,
                padding: "12px",
                fontWeight: 700,
                marginTop: 16,
                textDecoration: "none"
              }}
            >
              Essai gratuit
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT_BODY }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 52 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={20} color={C.white} />
              </div>
              <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 21 }}>AnandaFlow</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Studio de yoga et méditation au cœur de Lyon. Un espace chaleureux pour trouver la paix intérieure et cultiver votre équilibre.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: <Phone size={15} />, text: "04 72 34 56 78" },
                { icon: <Mail size={15} />, text: "namaste@anandaflow.fr" },
                { icon: <MapPin size={15} />, text: "18 Rue de la Paix, 69002 Lyon" },
                { icon: <Clock size={15} />, text: "Lun–Ven 7h–21h | Week-end 8h–19h" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {[
            { title: "Cours", links: [
              { label: "Hatha Flow", href: "/templates/impact-31/cours" },
              { label: "Vinyasa", href: "/templates/impact-31/cours" },
              { label: "Yin Yoga", href: "/templates/impact-31/cours" },
              { label: "Kundalini", href: "/templates/impact-31/cours" }
            ]},
            { title: "Studio", links: [
              { label: "Professeurs", href: "/templates/impact-31/professeurs" },
              { label: "Tarifs", href: "/templates/impact-31/pricing" },
              { label: "Contact", href: "/templates/impact-31/contact" },
              { label: "Essai gratuit", href: "/templates/impact-31/contact" }
            ]},
            { title: "Pratique", links: [
              { label: "Mentions légales", href: "/templates/impact-31/legal/mentions-legales" },
              { label: "Confidentialité", href: "/templates/impact-31/legal/confidentialite" },
              { label: "CGU", href: "/templates/impact-31/legal/cgu" }
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
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2025 Ananda Flow. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/templates/impact-31/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/templates/impact-31/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/templates/impact-31/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
