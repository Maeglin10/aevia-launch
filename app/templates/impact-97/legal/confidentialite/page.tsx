"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-[#020a13] min-h-dvh text-[#f4f4f4] font-sans selection:bg-white/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-black/40 backdrop-blur-md border-b border-[#c5a059]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/templates/impact-97" className="flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <span className="text-sm font-serif italic text-[#c5a059]">Aevia Maritime</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <h1 className="text-3xl md:text-5xl font-serif mb-6 text-[#c5a059]">Politique de Confidentialité</h1>
        <p className="text-sm opacity-60 mb-12 uppercase tracking-widest">Dernière mise à jour : Juin 2026</p>
        
        <div className="space-y-8 text-sm leading-relaxed opacity-80 border-t border-[#c5a059]/20 pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-serif text-[#c5a059]">1. Éditeur du site</h2>
            <p>Le site web est édité par Aevia Maritime SAS, société au capital social de 100 000 €, immatriculée au RCS sous le numéro 901 234 567.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-[#c5a059]">2. Propriété intellectuelle</h2>
            <p>Tous les éléments constituant ce site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protectables diverses, bases de données, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d&apos;auteur et la propriété intellectuelle.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-[#c5a059]">3. Protection des données personnelles</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données personnelles vous concernant.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#c5a059]/20 py-8 px-6 text-center text-xs opacity-40">
        <p>&copy; 2026 Aevia Maritime. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
