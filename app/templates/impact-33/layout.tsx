"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone, Clock, Menu, X, ShoppingBag } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT_HEADING, FONT_BODY } from "./shared";

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
    { label: "Accueil", href: "/templates/impact-33" },
    { label: "Boutique", href: "/templates/impact-33/boutique" },
    { label: "Nos Tartes", href: "/templates/impact-33/tartes" },
    { label: "Ateliers", href: "/templates/impact-33/atelier" },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap');
      `}</style>

      {/* Navbar */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 48px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled || pathname !== "/templates/impact-33" ? "rgba(253,248,240,0.97)" : "transparent",
          backdropFilter: scrolled || pathname !== "/templates/impact-33" ? "blur(12px)" : "none",
          borderBottom: scrolled || pathname !== "/templates/impact-33" ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled || pathname !== "/templates/impact-33" ? C.shadow : "none",
          transition: "all 0.3s ease", fontFamily: FONT_BODY,
        }}
      >
        <Link href="/templates/impact-33" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            whileHover={{ scale: 1.03 }}
          >
            <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TemplateIcon emoji="🥖" size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20, color: C.text, lineHeight: 1 }}>La Fournée</div>
              <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
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
                borderBottom: isActive(link.href) ? `2px solid ${C.accent}` : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 0.15s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 7 }}
              whileHover={{ background: C.accentDark, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingBag size={16} />
              Commander
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
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, padding: "24px 48px", borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow, fontFamily: FONT_BODY }}
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
                  fontSize: 15,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-33/reservation"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: C.accent,
                color: C.white,
                borderRadius: 8,
                padding: "12px",
                fontWeight: 700,
                marginTop: 16,
                textDecoration: "none"
              }}
            >
              Commander en Click & Collect
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.brown, color: C.white, padding: "70px 80px 32px", fontFamily: FONT_BODY }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 52 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TemplateIcon emoji="🥖" size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20, color: C.white }}>La Fournée</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Boulangerie artisanale au levain naturel depuis 1987. Chaque jour, nous pétrissons, façonnons et cuisons avec passion pour votre quartier.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: <MapPin size={15} />, text: "Adresse communiquée sur demande à contact@aevia.io" },
                { icon: <Mail size={15} />, text: "contact@aevia.io" },
                { icon: <Clock size={15} />, text: "Mar–Sam 7h–19h | Dim 7h–13h | Lun Fermé" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                  <span style={{ color: C.accent, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {[
            { title: "Nos Produits", links: [
              { label: "Pains artisanaux", href: "/templates/impact-33/boutique" },
              { label: "Viennoiseries pur beurre", href: "/templates/impact-33/boutique" },
              { label: "Gâteaux & Pâtisseries", href: "/templates/impact-33/boutique" },
              { label: "Nos Tartes signature", href: "/templates/impact-33/tartes" }
            ]},
            { title: "Le Fournil", links: [
              { label: "Notre histoire", href: "/templates/impact-33" },
              { label: "Ateliers boulangerie", href: "/templates/impact-33/atelier" },
              { label: "Click & Collect", href: "/templates/impact-33/reservation" }
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
            © 2026 La Fournée — Site réalisé par <Link href="/templates/impact-33/legal" style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}>Aevia WS</Link>
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/templates/impact-33/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/templates/impact-33/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/templates/impact-33/legal" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
