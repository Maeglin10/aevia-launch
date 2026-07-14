"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

const C = {
  bg: "#0A0A0A",
  bgAlt: "#111111",
  bgCard: "#161616",
  bgDeep: "#050505",
  text: "#F0EDE8",
  textMuted: "#8A8278",
  textDim: "#4A4642",
  accent: "#8B0000",
  accentHover: "#A50000",
  accentLight: "rgba(139,0,0,0.12)",
  accentBright: "#C41E3A",
  gold: "#B8964E",
  goldLight: "rgba(184,150,78,0.15)",
  border: "rgba(240,237,232,0.06)",
  borderAccent: "rgba(139,0,0,0.35)",
  white: "#F0EDE8",
};

const FONT_HEADING = "'Anton', 'Impact', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

export default function ConditionsGenerales() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}; }
        ::selection { background: ${C.accent}; color: ${C.white}; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 72,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/templates/impact-89" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <ArrowLeft size={20} color={C.white} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 18, letterSpacing: 2, color: C.white }}>RETOUR</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: FONT_HEADING, fontSize: 20, letterSpacing: 4, color: C.white }}>INK & IRON</span>
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ paddingTop: 120, paddingBottom: 120, maxWidth: 800, margin: "0 auto", paddingLeft: 40, paddingRight: 40 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>
            — Conditions d'utilisation
          </div>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.9, color: C.text, marginBottom: 48 }}>
            CONDITIONS<br /><span style={{ color: C.accent }}>GÉNÉRALES.</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>1. ACCEPTATION DES CONDITIONS</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                L'utilisation de ce site web et les prises de rendez-vous pour une prestation de tatouage impliquent l'acceptation pleine et entière des présentes conditions générales. L'acte de tatouage ne peut être réalisé que sur des personnes majeures (plus de 18 ans). Une pièce d'identité valide sera exigée le jour de votre rendez-vous.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>2. RÉSERVATIONS ET ARRHES</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                La validation d'un créneau pour une session de tatouage requiert le versement d'arrhes non remboursables d'un montant de 50€. Ces arrhes bloquent votre rendez-vous et couvrent le temps passé par l'artiste à la préparation de votre design. Le montant des arrhes sera déduit du prix final le jour de la session. En cas d'annulation moins de 48 heures avant le rendez-vous, les arrhes sont définitivement perdues.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>3. CRÉATION DES MOTIFS</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                Chaque tatouage est unique et créé sur-mesure ou issu des "flashs" exclusifs de nos artistes. Les dessins originaux demeurent la propriété intellectuelle exclusive des artistes d'INK & IRON STUDIO. Il est strictement interdit de photographier, copier ou reproduire les dessins proposés lors des consultations sans accord explicite.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>4. SOINS ET CICATRISATION</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                Le studio fournit des instructions écrites claires pour l'entretien post-tatouage. Il est de la responsabilité du client de suivre ces protocoles de soin de manière rigoureuse. INK & IRON STUDIO décline toute responsabilité en cas de mauvaise cicatrisation, d'infection ou de détérioration du tatouage liée à un non-respect des consignes ou à une négligence de la part du client. Une éventuelle retouche est offerte dans les 3 mois suivant la réalisation, à condition que les soins aient été correctement suivis.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>5. DROIT À L'IMAGE</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                Avec votre accord, des photographies ou vidéos du tatouage réalisé pourront être prises par les artistes pour alimenter leur portfolio professionnel et les réseaux sociaux du studio. Ces images se concentreront sur l'œuvre corporelle et votre anonymat sera préservé si vous le souhaitez.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, padding: "64px 40px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 60, marginBottom: 64 }}>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C.text, letterSpacing: 4, marginBottom: 20 }}>INK & IRON</div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                Studio de tatouage luxury à Paris depuis 2010. Trois artistes, un standard absolu. Rue de la Roquette, Paris 11e.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Contact</div>
              {[
                { Icon: MapPin, text: "24 Rue de la Roquette\nParis 11e, 75011" },
                { Icon: Phone, text: "+33 1 43 56 78 90" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                  <Icon size={14} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textMuted, lineHeight: 1.5, whiteSpace: "pre-line" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
