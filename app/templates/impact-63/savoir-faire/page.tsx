"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SectionLabel, PageWrapper } from "../shared";

export default function SavoirFairePage() {
  const chapters = [
    {
      id: "ébauche",
      title: "L'Ébauche",
      subtitle: "La platine-mère",
      desc: "Tout commence par l'ébauche — la platine qui recevra chaque composant. Usinée dans notre manufacture du Plan-les-Ouates, elle est mesurée au micron avant d'accueillir les premiers rouages. 847 composants pour le calibre MD-TB01.",
      image: "https://images.unsplash.com/photo-1490750967868-88df5691cc7b?w=800&q=80&fit=crop",
      stat: "847 composants",
    },
    {
      id: "anglage",
      title: "L'Anglage",
      subtitle: "Le biseau parfait",
      desc: "Chaque arête des ponts et platines est biseautée à la main, poncée, polie miroir. Le chanfrein d'une largeur de 0,2mm est tracé à la lime, puis au bâton de buis. La lumière doit se réfléchir comme sur de l'eau.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
      stat: "0.2mm précision",
    },
    {
      id: "rhodiage",
      title: "Le Rhodiage",
      subtitle: "L'éclat immuable",
      desc: "Les ponts sont rhodiés — recouverts d'une infime couche de rhodium — pour les protéger de l'oxydation et leur conférer cet éclat gris-acier distinctif. Un bain de galvanoplastie de 30 secondes qui dure une vie.",
      image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&q=80&fit=crop",
      stat: "30s de dépôt",
    },
    {
      id: "reglage",
      title: "La Mise au Point",
      subtitle: "Le réglage COSC",
      desc: "Le régleur soumet chaque mouvement à 5 positions et 3 températures sur 16 jours. L'objectif : moins de 2 secondes d'écart par jour, critère COSC. Seuls 60% des mouvements passent du premier coup.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&fit=crop",
      stat: "16 jours de test",
    },
  ];

  const arts = [
    { title: "Guillochage Main", desc: "Tour à guillocher XIXe siècle. Motifs grain d'orge, clous de Paris, soleil. 8 heures par cadran." },
    { title: "Émail Grand Feu", desc: "Cuisson à 800°C. Trois couches successives. Translucide, laiteux ou opaque — jamais identique." },
    { title: "Serti Grains", desc: "47 diamants VS sertis grain par grain à la main. Loupe 10x. La pince ne touche qu'une fois." },
  ];

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Depuis 1891</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.1em", marginBottom: "1rem" }}>
          Manufacture<br /><em style={{ color: C.gold }}>100% Maison</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75, marginBottom: "2rem" }}>
          133 ans d'horlogerie genevoise. Chaque composant, du spiral au boîtier, naît entre ces murs. Aucun sous-traitant. Aucun compromis.
        </p>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", paddingTop: "2rem", borderTop: `1px solid ${C.border}` }}>
          {[["847", "composants par calibre"], ["2 400h", "d'assemblage par an"], ["18 mois", "de développement / calibre"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.gold }}>{v}</div>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "3rem" }}>LES QUATRE ÉTAPES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {chapters.map((ch, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-100px" });
            return (
              <motion.div
                key={ch.id}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
              >
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <img src={ch.image} alt={ch.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: C.border, lineHeight: 1, marginBottom: "0.5rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.5rem" }}>{ch.subtitle}</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>{ch.title}</h2>
                  <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "45ch", marginBottom: "1.5rem" }}>{ch.desc}</p>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.9rem", color: C.gold }}>{ch.stat}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Métiers d'art */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <SectionLabel>Métiers d'Art</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 3rem)", fontWeight: 300, color: C.text }}>
              Les Gestes<br /><em style={{ color: C.gold }}>Irremplaçables</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.border }}>
            {arts.map((art, i) => (
              <div key={art.title} style={{ background: C.bg, padding: "2.5rem", textAlign: "left" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 300, color: C.border, lineHeight: 1, marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: C.gold, marginBottom: "0.75rem" }}>{art.title}</h3>
                <p style={{ fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.7 }}>{art.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
