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

export default function Confidentialite() {
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
              Politique de <span className="not-italic font-[400] text-[#8B5CF6]">Confidentialité</span>
            </h1>
          </div>
          
          <div className="space-y-8 text-[15px] text-[#9D174D] font-[300] leading-[1.8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>1. Collecte des données</h2>
              <p>
                Dans le cadre de l'utilisation de notre site, notamment lors d'une réservation ou de l'inscription à notre newsletter, Velvet Nails est amené à collecter certaines données personnelles telles que votre nom, adresse e-mail et numéro de téléphone.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>2. Utilisation des données</h2>
              <p>
                Ces données sont utilisées dans le seul but de gérer vos réservations, de répondre à vos demandes de contact et, avec votre accord, de vous envoyer notre newsletter. Elles ne seront en aucun cas revendues à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>3. Vos droits</h2>
              <p>
                Conformément à la réglementation RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition au traitement de vos données. Pour exercer ces droits, veuillez nous contacter à l'adresse <strong>bonjour@velvetnails.fr</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>4. Cookies</h2>
              <p>
                Notre site utilise des cookies essentiels pour assurer son bon fonctionnement et des cookies analytiques pour mesurer l'audience. Vous pouvez configurer votre navigateur pour les refuser, mais cela pourrait altérer votre expérience sur notre site.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
