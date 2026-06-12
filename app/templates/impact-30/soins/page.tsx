"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { C, FONT } from "../shared";

export default function SoinsPage() {
  const specialties = [
    {
      title: "Blanchiment dentaire Zoom!",
      tech: "Lampe LED Philips Zoom! WhiteSpeed",
      details: "Le traitement de blanchiment au fauteuil Philips Zoom! est cliniquement prouvé pour blanchir vos dents jusqu'à 8 teintes en une seule séance de 45 minutes. C'est le procédé de blanchiment le plus demandé au monde, alliant rapidité et sécurité absolue pour l'émail.",
      advantages: [
        "Jusqu'à 8 teintes gagnées en une séance",
        "Formule brevetée limitant la sensibilité post-traitement",
        "Supervisé entièrement par un chirurgien-dentiste certifié",
        "Polissage final protecteur inclus"
      ],
      price: "350 €"
    },
    {
      title: "Implants dentaires Straumann",
      tech: "Titane Grade 4 & Céramique Emax",
      details: "Nous utilisons exclusivement les implants suisses Straumann, leaders mondiaux de l'implantologie. Posé sous anesthésie locale, l'implant remplace la racine naturelle manquante et s'intègre parfaitement à l'os (ostéointégration) pour accueillir une couronne céramique esthétique.",
      advantages: [
        "Matériaux biocompatibles haute durabilité",
        "Garantie internationale Straumann de 10 ans",
        "Remplacement fixe et invisible au quotidien",
        "Préservation de la structure osseuse maxillaire"
      ],
      price: "À partir de 1 200 €"
    },
    {
      title: "Orthodontie Invisible Invisalign",
      tech: "Scanner 3D iTero & Aligneurs SmartTrack",
      details: "Invisalign utilise des séries de gouttières transparentes amovibles et sur mesure pour déplacer vos dents en douceur. Pratiquement invisibles, elles se retirent facilement pour manger et se brosser les dents, offrant une alternative esthétique idéale aux bagues métalliques.",
      advantages: [
        "Gouttières translucides très discrètes",
        "Amovibles pour une hygiène bucco-dentaire impeccable",
        "Visualisation 3D du résultat final avant de commencer",
        "Rendez-vous de contrôle simplifiés toutes les 6 à 8 semaines"
      ],
      price: "À partir de 2 800 €"
    },
    {
      title: "Facettes Céramiques Emax",
      tech: "Porcelaine feldspathique Emax pressée",
      details: "Les facettes Emax sont de fines pellicules de céramique collées sur la face visible des dents antérieures. Elles permettent de corriger instantanément les défauts de forme, d'alignement, d'espacement (diastèmes) ou de coloration rebelle, pour un sourire harmonieux sur mesure.",
      advantages: [
        "Rendu ultra-naturel avec translucidité de l'émail",
        "Haute résistance aux taches de café, thé ou tabac",
        "Préparation dentaire ultra-conservatrice (a minima)",
        "Durée de vie supérieure à 15 ans avec une bonne hygiène"
      ],
      price: "À partir de 800 € / dent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 32, marginBottom: 48 }}>
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Catalogue Clinique</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            Nos Soins Spécialisés & Technologies
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Découvrez nos spécialités en dentisterie esthétique et restauratrice. Nous appliquons des protocoles rigoureux avec des équipements certifiés.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {specialties.map((s) => (
            <div key={s.title} style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-100 pb-12">
              <div className="lg:col-span-5">
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, background: C.accentLight, padding: "5px 12px", borderRadius: 12 }}>
                  {s.tech}
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginTop: 16, marginBottom: 16 }}>
                  {s.title}
                </h3>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>
                  {s.price}
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById("contact-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else window.location.hash = "contact-form";
                  }}
                  style={{
                    marginTop: 24,
                    background: C.accent,
                    color: C.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: FONT
                  }}
                >
                  Prendre rendez-vous
                </button>
              </div>

              <div className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-[#dce9f5]">
                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, marginBottom: 12 }}>Détails Cliniques</h4>
                <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
                  {s.details}
                </p>

                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, marginBottom: 12 }}>Avantages Clés</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {s.advantages.map((adv) => (
                    <div key={adv} style={{ display: "flex", gap: 8, alignItems: "start", fontSize: 13, color: C.text, fontWeight: 500 }}>
                      <CheckCircle size={16} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
