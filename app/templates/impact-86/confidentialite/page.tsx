"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Leaf } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("aura-fonts")) return;
    const style = document.createElement("style");
    style.id = "aura-fonts";
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
  }, []);
};

export default function ConfidentialitePage() {
  useFonts();

  return (
    <div className="min-h-screen bg-[#F6F3EE]" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F6F3EE]/90 backdrop-blur-md border border-[#D8D0C4] rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-86" className="flex items-center gap-2 cursor-pointer group">
            <ArrowLeft className="w-5 h-5 text-[#2C2820] group-hover:text-[#7C9E87] transition-colors" />
            <span className="text-[#2C2820] group-hover:text-[#7C9E87] tracking-widest text-sm uppercase transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              Retour
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#7C9E87]" />
            <span className="text-[#2C2820] tracking-widest text-sm uppercase hidden md:inline" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              Aura Wellness
            </span>
          </div>
        </div>
      </nav>

      <section className="pt-36 pb-16 px-6 bg-[#EDE9E2] border-b border-[#D8D0C4]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Informations Légales</p>
            <h1 className="text-[#2C2820] text-4xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Politique de Confidentialité
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#D8D0C4] p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-sm md:prose-base prose-neutral max-w-none text-[#6B5E52]"
          >
            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Collecte des données personnelles</h2>
            <p className="mb-6">
              Aura Wellness s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés. Les données personnelles collectées via nos formulaires de contact et de réservation (nom, email, téléphone) sont utilisées uniquement pour répondre à vos demandes et organiser vos soins.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Conservation des données</h2>
            <p className="mb-6">
              Les données personnelles sont conservées pour une durée qui n'excède pas la durée nécessaire aux finalités pour lesquelles elles ont été collectées. Les données de contact et de réservation sont conservées pour une durée maximale de 3 ans après votre dernier échange avec nos équipes.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Cookies</h2>
            <p className="mb-6">
              Le site Aura Wellness utilise des cookies essentiels au fonctionnement du site. Aucun cookie de ciblage publicitaire ou de suivi comportemental n'est utilisé, respectant ainsi votre tranquillité numérique.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4. Vos droits</h2>
            <p className="mb-6">
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition de vos données personnelles. Vous pouvez exercer ce droit en nous contactant à l'adresse email suivante : contact@aurawellness.fr.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-[#EDE9E2] border-t border-[#D8D0C4] py-8 px-6 text-center">
        <p className="text-[#6B5E52] text-xs">© 2026 Aura Wellness. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
