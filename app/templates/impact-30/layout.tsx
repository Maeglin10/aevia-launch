"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Smile, Phone, Mail, MapPin, Calendar, Menu, X } from "lucide-react";
import { C, FONT } from "./shared";
import { usePathname } from "next/navigation";

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
    { label: "Accueil", href: "/templates/impact-30" },
    { label: "Soins", href: "/templates/impact-30/soins" },
    { label: "Tarifs & Remboursement", href: "/templates/impact-30/pricing" },
    { label: "L'Équipe", href: "/templates/impact-30/team" },
  ];

  return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      {/* Google fonts loader logic style */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
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
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT,
        }}
      >
        {/* Logo */}
        <Link href="/templates/impact-30" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
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
              width: 38,
              height: 38,
              background: C.accent,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Smile size={22} color={C.white} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>
            Smile<span style={{ color: C.accent }}>Studio</span>
          </span>
        </>
          )}</Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(link.href) ? C.accent : C.text,
                fontWeight: 600,
                fontSize: 15,
                transition: "color 0.2s"
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/templates/impact-30#contact-form"
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Calendar size={16} />
            Prendre RDV
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.text,
          }}
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
              background: C.white,
              padding: "24px 48px",
              borderBottom: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              fontFamily: FONT,
            }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 0",
                  color: isActive(link.href) ? C.accent : C.text,
                  fontWeight: 600,
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 16,
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-30#contact-form"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                marginTop: 18,
                padding: "12px",
                background: C.accent,
                color: C.white,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Prendre RDV en ligne
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 48,
            marginBottom: 52,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Smile size={22} color={C.white} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>SmileStudio</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Cabinet dentaire d'excellence au cœur de Paris 8e. Soins de pointe, équipe bienveillante et résultats qui transforment votre sourire.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: <Phone size={15} />, text: "01 42 56 78 90" },
                { icon: <Mail size={15} />, text: "contact@smilestudio.paris" },
                { icon: <MapPin size={15} />, text: "42 Av. des Champs-Élysées, 75008 Paris" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {[
            { title: "Soins Cliniques", links: [
              { label: "Blanchiment dentaire", href: "/templates/impact-30/soins" },
              { label: "Implants dentaires", href: "/templates/impact-30/soins" },
              { label: "Orthodontie Invisalign", href: "/templates/impact-30/soins" },
              { label: "Soins pédiatriques", href: "/templates/impact-30/soins" }
            ]},
            { title: "Le Cabinet", links: [
              { label: "Notre équipe", href: "/templates/impact-30/team" },
              { label: "Tarifs transparents", href: "/templates/impact-30/pricing" },
              { label: "Simulateur mutuelle", href: "/templates/impact-30/pricing" },
            ]},
            { title: "Pratique", links: [
              { label: "Accueil", href: "/templates/impact-30" },
              { label: "Mentions légales", href: "/templates/impact-30/legal/mentions-legales" },
              { label: "Confidentialité", href: "/templates/impact-30/legal/confidentialite" },
              { label: "CGU", href: "/templates/impact-30/legal/cgu" }
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {col.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href}
                    style={{ 
                      color: "rgba(255,255,255,0.55)", 
                      fontSize: 14, 
                      textAlign: "left", 
                      fontFamily: FONT,
                      padding: 0
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2026 Smile Studio. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/templates/impact-30/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontFamily: FONT }}>Mentions légales</Link>
            <Link href="/templates/impact-30/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontFamily: FONT }}>Confidentialité</Link>
            <Link href="/templates/impact-30/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontFamily: FONT }}>CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
