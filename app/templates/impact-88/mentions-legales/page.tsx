"use client"

import React, { useEffect, useState } from "react";
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


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function MentionsLegales() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

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
              Mentions <span className="not-italic font-[400] text-[#8B5CF6]">Légales</span>
            </h1>
          </div>
          
          <div className="space-y-8 text-[15px] text-[#9D174D] font-[300] leading-[1.8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>1. Éditeur du site</h2>
              <p>
                Le site Velvet Nails est édité par la société Velvet Nails SAS, au capital de 10 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
                <br />
                Siège social : 24 rue des Petites Écuries, 75009 Paris.
                <br />
                Directrice de la publication : Sophie Leroux.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>2. Hébergement</h2>
              <p>
                Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>3. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu (textes, images, vidéos, etc.) de ce site est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, totale ou partielle, est strictement interdite sans notre accord préalable et écrit.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[600] text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>4. Contact</h2>
              <p>
                Pour toute question, vous pouvez nous contacter par e-mail à l'adresse <strong>bonjour@velvetnails.fr</strong> ou par téléphone au <strong>+33 1 23 45 67 89</strong>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
