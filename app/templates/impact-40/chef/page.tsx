"use client";

import React from "react";
import { Award, ChefHat, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { C, SectionReveal } from "../shared";

export default function ChefPage() {
  const foodPhotos = [
    "photo-1414235077428-338989a2e8c0",
    "photo-1504674900247-0877df9cc836",
    "photo-1551218808-94e220e084d2",
    "photo-1559339352-11d035aa65de",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1476224203421-9ac39bcb3327",
  ];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Derrière les fourneaux
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Le Chef
            </h1>
          </div>
        </SectionReveal>

        {/* Chef profile */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "4rem", alignItems: "start", marginBottom: "5rem" }}>
          <SectionReveal>
            <div
              style={{
                borderRadius: "2rem",
                overflow: "hidden",
                backgroundColor: C.bgDark,
                aspectRatio: "4/5",
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80&fit=crop"
                alt="Chef Gabriel Renaud"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2rem",
                  background: "linear-gradient(transparent, rgba(30,58,15,0.92))",
                }}
              >
                <div style={{ fontFamily: C.headingFont, fontSize: "1.5rem", fontWeight: 700, color: C.bg }}>
                  Gabriel Renaud
                </div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.accent, marginTop: "0.3rem" }}>
                  Chef exécutif & Propriétaire
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.14}>
            <div>
              <div
                style={{
                  backgroundColor: C.bgDark,
                  borderRadius: "1.35rem",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ color: C.accent, flexShrink: 0, marginTop: "0.15rem" }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontFamily: C.headingFont, fontSize: "1rem", fontWeight: 700, color: C.bg, marginBottom: "0.35rem" }}>
                    2 Étoiles Michelin
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: "rgba(253,249,238,0.55)", lineHeight: 1.7, margin: 0 }}>
                    Distingué par le Guide Michelin depuis 2019. Récompense d'une cuisine ancrée dans le terroir et portée par une vision contemporaine exigeante.
                  </p>
                </div>
              </div>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.6rem" }}>
                La cuisine comme dialogue entre la terre et la saison
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "1.2rem" }}>
                Né à Lyon en 1981, Gabriel Renaud grandit entre les marchés de la Presqu'île et la cuisine de sa grand-mère savoyarde. Très tôt passionné par les produits bruts, il entre à l'École Ferrandi Paris à 18 ans, où il apprend la rigueur classique tout en développant un regard sensible sur les matières premières.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "1.2rem" }}>
                Après des stages formateurs auprès de Paul Bocuse à Collonges-au-Mont-d'Or et chez Alain Ducasse au Louis XV à Monaco, il passe deux ans au Japon où il découvre le concept de <em>shun</em> — cuisiner l'instant exact de la maturité d'un ingrédient. Cette philosophie du temps juste deviendra le cœur de son identité culinaire.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "2rem" }}>
                En 2012, il ouvre son restaurant dans le Beaujolais, à deux pas des vignobles. Sa cuisine célèbre les producteurs locaux — maraîchers, éleveurs, fromagers — avec qui il entretient des relations étroites depuis le premier jour. Chaque assiette raconte un territoire, une saison, un moment précis de l'année.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  { icon: <ChefHat size={15} />, label: "Formation Ferrandi Paris, promotion 2001" },
                  { icon: <Star size={15} />, label: "Stage chez Paul Bocuse, Collonges-au-Mont-d'Or" },
                  { icon: <MapPin size={15} />, label: "2 ans au Japon — apprentissage du shun" },
                  { icon: <Award size={15} />, label: "Première étoile Michelin en 2016" },
                  { icon: <Award size={15} />, label: "Deuxième étoile Michelin en 2019" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Philosophy quote */}
        <SectionReveal>
          <div
            style={{
              backgroundColor: C.bgDark,
              borderRadius: "2rem",
              padding: "3.5rem",
              textAlign: "center",
              marginBottom: "5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, rgba(240,192,64,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: C.headingFont, fontSize: "3rem", color: C.accent, opacity: 0.3, lineHeight: 0.8, marginBottom: "1rem" }}>"</div>
              <blockquote
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                  color: C.bg,
                  lineHeight: 1.65,
                  maxWidth: 680,
                  margin: "0 auto 1.5rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                La cuisine, pour moi, c'est un dialogue permanent entre la terre et la saison. Je n'invente rien — j'écoute ce que les produits ont à dire et je les mets en scène le plus fidèlement possible.
              </blockquote>
              <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.accent, fontWeight: 700 }}>
                — Gabriel Renaud
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Food photo grid */}
        <SectionReveal>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "1.75rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", textAlign: "center" }}>
            En cuisine
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="grid sm:grid-cols-1">
            {foodPhotos.map((photoId, i) => (
              <motion.div
                key={photoId}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: "1.1rem",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  backgroundColor: C.bgAlt,
                }}
              >
                <img
                  src={`https://images.unsplash.com/${photoId}?w=800&q=80&fit=crop`}
                  alt={`Création culinaire ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
