"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { C, FONT } from "../shared";

export default function TeamPage() {
  const members = [
    {
      name: "Dr. Claire Laurent",
      role: "Chirurgienne-dentiste co-fondatrice",
      specialty: "Implantologie complexe & Chirurgie reconstructrice",
      experience: "18 ans",
      initials: "CL",
      color: "#4a90d9",
      diplomas: [
        "Diplôme d'État de Docteur en Chirurgie Dentaire — Université Paris VII (Cochin)",
        "Post-Graduate en Implantologie et Parodontologie — New York University (NYU)",
        "D.U. de Reconstruction Osseuse Maxillo-Faciale — Hôpital de la Salpêtrière"
      ],
      description: "Le Dr Laurent dirige les pôles de chirurgie orale et d'implantologie. Passionnée par la réhabilitation globale, elle s'efforce de redonner confort et esthétique aux sourires les plus complexes en utilisant les dernières techniques de guidage chirurgical 3D."
    },
    {
      name: "Dr. Marc Dupont",
      role: "Orthodontiste exclusif",
      specialty: "Orthodontie de l'enfant et de l'adulte, aligneurs transparents",
      experience: "12 ans",
      initials: "MD",
      color: "#7c3aed",
      diplomas: [
        "Diplôme d'État de Docteur en Chirurgie Dentaire — Université de Lyon",
        "Spécialiste Qualifié en Orthopédie Dento-Faciale (CECSOF)",
        "Praticien certifié Invisalign Diamond Apex (Top 1% Europe)"
      ],
      description: "Le Dr Dupont est spécialisé dans l'alignement dentaire discret. Précurseur de l'utilisation d'aligneurs Invisalign en France, il intègre des technologies numériques de scan et de simulation de croissance maxillaire pour des traitements précis et confortables."
    },
    {
      name: "Dr. Sofia Ramirez",
      role: "Chirurgienne-dentiste omnipraticienne",
      specialty: "Dentisterie esthétique, blanchiment & facettes céramiques",
      experience: "9 ans",
      initials: "SR",
      color: "#00b894",
      diplomas: [
        "Diplôme en Médecine Dentaire — Faculté de Médecine de Madrid",
        "Master en Esthétique Dentaire et Prothèses — Université Complutense de Madrid",
        "Certifiée en techniques avancées de collage de facettes Emax"
      ],
      description: "Spécialisée dans l'esthétique du sourire et la dentisterie conservatrice (dite a minima), le Dr Ramirez met son sens artistique au service des patients pour éclaircir ou restructurer les sourires de façon naturelle et élégante."
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
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Découvrez nos Experts</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            L'Équipe Médicale Smile Studio
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Nos dentistes et orthodontistes sont diplômés des plus grandes universités et se forment continuellement aux protocoles médicaux les plus avancés.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {members.map((m) => (
            <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="grid grid-cols-1 md:grid-cols-12 pb-12 border-b border-gray-100">
              {/* Left Column: Initials and Title */}
              <div className="md:col-span-4 text-center md:text-left">
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: m.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 32,
                    fontWeight: 800,
                    color: C.white,
                    boxShadow: C.shadow,
                    marginLeft: "0"
                  }}
                  className="mx-auto md:ml-0"
                >
                  {m.initials}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>{m.name}</h3>
                <div style={{ fontSize: 15, fontWeight: 700, color: m.color, marginBottom: 8 }}>{m.role}</div>
                <span style={{ fontSize: 13, background: C.bgLight, color: C.text, padding: "5px 12px", borderRadius: 12, fontWeight: 600 }}>
                  {m.experience} d'activité
                </span>
              </div>

              {/* Right Column: Bio and Diplomas */}
              <div className="md:col-span-8">
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Présentation</h4>
                <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
                  {m.description}
                </p>

                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Titres & Diplômes universitaires</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {m.diplomas.map((d, idx) => (
                    <li key={idx} style={{ display: "flex", gap: 10, alignItems: "start", fontSize: 13, color: C.textMuted }}>
                      <Award size={16} color={m.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
