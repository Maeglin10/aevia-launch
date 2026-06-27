// @ts-nocheck
"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Menu, X, Phone, Mail, ArrowLeft } from "lucide-react"

/* ==========================================================================
   AURELIA JEWELS — Design Tokens
   ========================================================================== */
const C = {
  cream:     "#FAFAF9",
  creamSoft: "#F5F4F0",
  gold:      "#CA8A04",
  goldLight: "#F59E0B",
  goldDim:   "rgba(202,138,4,0.15)",
  goldBorder:"rgba(202,138,4,0.20)",
  navy:      "#1C1917",
  navyDeep:  "#0C0A09",
  navyMid:   "#292524",
  text:      "#0C0A09",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  border:    "rgba(28,25,23,0.08)",
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Montserrat:wght@300;400;500;600&display=swap');`

const NAV_LINKS = [
  { label: "Retour à l'accueil", href: "/templates/impact-91" },
]

function useFonts() {
  useEffect(() => {
    const id = "aurelia-fonts"
    if (!document.getElementById(id)) {
      const style = document.createElement("style")
      style.id = id
      style.innerHTML = FONTS
      document.head.appendChild(style)
    }
  }, [])
}

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(250,250,249,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-[72px]">
          <Link href="/templates/impact-91" className="flex items-center gap-3">
            <span
              className="text-[28px] tracking-[0.12em]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                color: scrolled ? C.navyDeep : C.cream,
              }}
            >
              AURELIA
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[12px] tracking-[0.18em] font-[500] transition-colors duration-300 hover:opacity-60 flex items-center gap-2"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: scrolled ? C.navyDeep : C.cream,
                  textTransform: "uppercase",
                }}
              >
                <ArrowLeft size={14} />
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 transition-opacity hover:opacity-60"
              aria-label="Menu"
            >
              <Menu size={22} color={scrolled ? C.navyDeep : C.cream} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ backgroundColor: C.navyDeep }}
          >
            <div className="flex items-center justify-between px-6 h-[72px]">
              <span
                className="text-[26px] tracking-[0.12em] italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontWeight: 600 }}
              >
                AURELIA
              </span>
              <button onClick={() => setOpen(false)} className="p-2 text-[#A8A29E] hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-10 gap-8">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-[32px] tracking-[0.06em] italic hover:opacity-60 transition-opacity flex items-center gap-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontWeight: 500 }}
                  >
                    <ArrowLeft size={24} />
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: C.navyDeep, borderTop: `1px solid ${C.goldBorder}` }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span
              className="text-[28px] tracking-[0.12em] italic block mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: C.cream }}
            >
              AURELIA
            </span>
            <p
              className="text-[13px] leading-[2] mb-6 max-w-[320px]"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
            >
              Maison de haute joaillerie française. Orfèvrerie artisanale depuis 1977. Chaque pièce, une histoire. Chaque pierre, une âme.
            </p>
            <div className="flex gap-4">
              {[Phone, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="/templates/impact-91"
                  className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:border-[#CA8A04]/60"
                  style={{ border: `1px solid ${C.goldBorder}` }}
                >
                  <Icon size={16} color={`${C.cream}80`} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.gold }}
            >
              Maison
            </p>
            <ul className="space-y-3">
              {["Collections", "Bespoke", "Savoir-Faire", "Ateliers", "Presse", "Carrières"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/templates/impact-91/${item.toLowerCase().replace(/ /g, '-').replace(/é/g, 'e').replace(/è/g, 'e')}`}
                    className="text-[12px] tracking-[0.06em] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.gold }}
            >
              Services
            </p>
            <ul className="space-y-3">
              {["Rendez-vous privé", "Gravure personnalisée", "Entretien & restauration", "Expertise & estimations", "Livraison sécurisée"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/templates/impact-91/${item.toLowerCase().replace(/ /g, '-').replace(/é/g, 'e').replace(/& /g, '').replace(/ /g, '-')}`}
                    className="text-[12px] tracking-[0.06em] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${C.goldBorder}` }}
        >
          <p
            className="text-[11px] tracking-[0.08em]"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}40` }}
          >
            © 2025 Aurelia Joaillerie. Tous droits réservés. Entreprise du Patrimoine Vivant.
          </p>
          <div className="flex gap-6">
            <Link
              href="/templates/impact-91/mentions-legales"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              Mentions légales
            </Link>
            <Link
              href="/templates/impact-91/confidentialite"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              Confidentialité
            </Link>
            <Link
              href="/templates/impact-91/cgu"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function AnnexPage() {
  useFonts()
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div style={{ backgroundColor: C.cream, fontFamily: "'Montserrat', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav scrolled={scrolled} />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className="text-[10px] tracking-[0.30em] uppercase mb-4"
              style={{ color: C.gold, fontWeight: 500 }}
            >
              AURELIA
            </p>
            <h1
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(36px, 4.5vw, 64px)",
                color: C.navyDeep,
                lineHeight: 1.1,
              }}
            >
              Expertise & Estimations
            </h1>
            <div className="w-16 h-[1px] mx-auto" style={{ backgroundColor: C.gold }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-sm md:prose-base max-w-none"
            style={{ color: C.textMuted, lineHeight: 1.8 }}
          >
            <p className="mb-6">
              Bienvenue sur la page dédiée à <strong>Expertise & Estimations</strong>. Ce contenu est en cours de rédaction.
              Notre maison s'engage à vous fournir toutes les informations nécessaires dans les plus brefs délais.
            </p>
            <p className="mb-6">
              Depuis 1977, Aurelia Joaillerie perpétue les techniques de l'orfèvrerie française transmises de maître en apprenti.
              Chaque création est le fruit d'un travail minutieux et d'une passion inébranlable pour l'excellence.
            </p>
            <div className="p-8 my-10 text-center border" style={{ borderColor: C.goldBorder, backgroundColor: `${C.gold}08` }}>
              <p className="text-[18px] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: C.navyDeep, fontWeight: 500 }}>
                Pour toute demande urgente, notre équipe se tient à votre disposition.
              </p>
              <Link
                href="/templates/impact-91"
                className="inline-flex items-center gap-2 px-8 py-3 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: C.gold,
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                Nous contacter
                <ChevronRight size={14} />
              </Link>
            </div>
            <p>
              Nous vous remercions de votre confiance et de votre fidélité. L'art de la haute joaillerie nécessite du temps, tout comme la préparation minutieuse de nos services pour vous offrir une expérience inoubliable.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
