"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

const C = {
  bg: "#f7f8fa",
  bgSection: "#eef1f5",
  text: "#0f1c2e",
  textMuted: "#5a6a7e",
  accent: "#f59e0b",
  accentDark: "#d97706",
  accentLight: "#fef3c7",
  dark: "#1a2744",
  white: "#ffffff",
  border: "#e2e8f0",
  shadow: "0 2px 12px rgba(15,28,46,0.07)",
}

const FONT = "'Outfit', system-ui, sans-serif"

export default function MentionsLegales() {
  return (
    <div style={{ background: C.bg, fontFamily: FONT, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <header style={{ 
        height: 72, 
        display: "flex", 
        alignItems: "center", 
        padding: "0 64px", 
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link href="/templates/impact-15" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ background: C.accent, borderRadius: 8, padding: 8, display: "flex" }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>Volt<span style={{ color: C.accent }}>Expert</span></span>
        </Link>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "80px 24px" }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, margin: "0 auto", background: C.white, padding: "60px 80px", borderRadius: 16, boxShadow: C.shadow, border: `1px solid ${C.border}` }}
        >
          <Link href="/templates/impact-15" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.accent, textDecoration: "none", fontWeight: 600, fontSize: 15, marginBottom: 40 }}>
            <ArrowLeft size={16} /> Retour au site
          </Link>
          
          <h1 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: 800, color: C.text, marginBottom: 48, lineHeight: 1.1 }}>
            Mentions <span style={{ color: C.accent }}>Légales</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 2 }}></span>
                Éditeur du site
              </h2>
              <div style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>
                <p style={{ marginBottom: 8 }}><strong style={{ color: C.text }}>VoltExpert</strong></p>
                <p>123 Avenue des Électriciens, 31000 Toulouse, France</p>
                <p>Téléphone : <a href="tel:+33561000000" style={{ color: C.accent, textDecoration: "none" }}>05 61 00 00 00</a></p>
                <p>Email : <a href="mailto:contact@voltexpert.fr" style={{ color: C.accent, textDecoration: "none" }}>contact@voltexpert.fr</a></p>
                <p>SIRET : 123 456 789 00012</p>
                <p>Directeur de la publication : Jean Dupont</p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 2 }}></span>
                Hébergement
              </h2>
              <div style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>
                <p style={{ marginBottom: 8 }}><strong style={{ color: C.text }}>Vercel Inc.</strong></p>
                <p>440 N Barranca Ave #4133</p>
                <p>Covina, CA 91723</p>
                <p>États-Unis</p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 2 }}></span>
                Propriété Intellectuelle
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>
                L'ensemble du contenu de ce site (textes, images, vidéos, logo) est la propriété exclusive de VoltExpert, sauf mention contraire. Toute reproduction ou représentation totale ou partielle de ce site, par quelque procédé que ce soit, sans l'autorisation expresse de VoltExpert est interdite.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 2 }}></span>
                Données Personnelles
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>
                Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit en nous contactant à l'adresse email indiquée ci-dessus.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer minimal */}
      <footer style={{ background: C.text, padding: "24px 80px", textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>© 2026 VoltExpert — Tous droits réservés.</span>
      </footer>
    </div>
  )
}
