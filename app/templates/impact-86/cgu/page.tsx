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

export default function CGUPage() {
  useFonts();

  return (
    <div className="min-h-dvh bg-[#F6F3EE]" style={{ fontFamily: "'Jost', sans-serif" }}>
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
              Conditions Générales d'Utilisation
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
            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Acceptation des conditions</h2>
            <p className="mb-6">
              L'utilisation du site Aura Wellness implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Ces conditions sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs sont donc invités à les consulter de manière régulière.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Accès au site</h2>
            <p className="mb-6">
              Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur. Aura Wellness met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au site, mais n'est tenue à aucune obligation d'y parvenir.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Services proposés</h2>
            <p className="mb-6">
              Le site a pour objet de fournir des informations sur l'ensemble des activités de la société Aura Wellness (rituels de soins, espaces thermaux, massages). Les informations indiquées sur le site sont données à titre indicatif, et sont susceptibles d'évoluer.
            </p>

            <h2 className="text-2xl text-[#2C2820] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4. Réservations</h2>
            <p className="mb-6">
              Les demandes de réservation via le formulaire de contact sont soumises à la disponibilité de nos thérapeutes. Une confirmation vous sera envoyée dans un délai de 24 heures. En cas d'annulation, veuillez nous prévenir au moins 48 heures à l'avance.
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
