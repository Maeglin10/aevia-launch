"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Camera, MessageSquare, Users2 } from "lucide-react";

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

export default function MentionsLegales() {
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
            — Informations légales
          </div>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.9, color: C.text, marginBottom: 48 }}>
            MENTIONS<br /><span style={{ color: C.accent }}>LÉGALES.</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>1. ÉDITEUR DU SITE</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                INK & IRON STUDIO<br/>
                Société à Responsabilité Limitée (SARL)<br/>
                Au capital de 10 000 euros<br/>
                RCS Paris B 123 456 789<br/>
                Siège social : 24 Rue de la Roquette, 75011 Paris, France<br/>
                Tél : +33 1 43 56 78 90<br/>
                Email : contact@inkandironstudio.fr
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>2. DIRECTEUR DE LA PUBLICATION</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                Monsieur Viktor Rein, en qualité de Gérant.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>3. HÉBERGEMENT</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                Vercel Inc.<br/>
                340 S Lemon Ave #4133<br/>
                Walnut, CA 91789, USA<br/>
                https://vercel.com
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>4. PROPRIÉTÉ INTELLECTUELLE</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques (notamment les photographies de tatouages et les flashs). La reproduction de tout ou partie de ce site sur quelque support que ce soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.white, marginBottom: 12, letterSpacing: 2 }}>5. AVERTISSEMENT HYGIÈNE</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                L'activité de tatouage relève des dispositions de santé publique. INK & IRON STUDIO s'engage à respecter les normes d'hygiène et de salubrité fixées par le Code de la santé publique (décret n°2008-149 du 19 février 2008). Une déclaration d'activité a été effectuée auprès de l'ARS d'Île-de-France.
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
