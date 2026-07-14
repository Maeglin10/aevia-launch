"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return
    const existing = document.querySelector('style[data-impact88-fonts]')
    if (existing) return
    const el = document.createElement("style")
    el.setAttribute("data-impact88-fonts", "1")
    el.textContent = FONTS
    document.head.appendChild(el)
    return () => { document.head.removeChild(el) }
  }, [])
}

export default function CGU() {
  useFonts()

  return (
    <main className="bg-[#FDF2F8] text-[#831843] min-h-dvh overflow-x-hidden pt-20 pb-20">
      <div className="max-w-[800px] mx-auto px-6 lg:px-10">
        <Link
          href="/templates/impact-88"
          className="inline-flex items-center gap-2 text-[#EC4899] hover:text-[#DB2777] mb-10 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[13px] font-[500] uppercase tracking-[0.1em]">Retour à l'accueil</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#EC4899]" />
            <h1
              className="text-[clamp(32px,4vw,48px)] font-[700] italic text-[#831843] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Conditions Générales <span className="not-italic font-[400] text-[#8B5CF6]">d'Utilisation</span>
            </h1>
          </div>
          
          <div className="space-y-8 text-[15px] text-[#9D174D] font-[300] leading-[1.8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>1. Acceptation des conditions</h2>
              <p>
                L'accès et l'utilisation du site Velvet Nails sont soumis à l'acceptation et au respect des présentes Conditions Générales d'Utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>2. Réservations et Annulations</h2>
              <p>
                La prise de rendez-vous s'effectue via notre système en ligne. Vous pouvez annuler ou reporter un rendez-vous gratuitement jusqu'à 24 heures à l'avance. En deçà de ce délai, un acompte ou une indemnité pourra vous être demandé.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>3. Prestations et Tarifs</h2>
              <p>
                Les tarifs indiqués sur le site sont TTC et donnés à titre indicatif. Le montant final de certaines prestations (comme le Nail Art personnalisé) sera confirmé sur place lors de la consultation.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>4. Responsabilité</h2>
              <p>
                Velvet Nails s'efforce de fournir des informations exactes et à jour. Cependant, la société ne saurait être tenue pour responsable d'éventuelles erreurs, omissions ou résultats obtenus à la suite de l'utilisation de ces informations.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
