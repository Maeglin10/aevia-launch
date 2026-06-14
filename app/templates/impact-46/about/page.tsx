"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, PageHero, firmValues, attorneys } from "../shared";

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="Le cabinet"
        title="Un conseil d'exception, depuis 1998."
        subtitle="Dumont & Associates est un cabinet d'avocats parisien fondé sur une conviction : le droit des affaires mérite la même exigence que les entreprises qu'il accompagne."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {[
            "Fondé en 1998 by Édouard Dumont après douze années passées au sein d'un cabinet international de premier plan, Dumont & Associates s'est imposé comme une boutique de référence en droit des affaires à Paris.",
            "Notre modèle est celui d'un cabinet à taille humaine où chaque dossier est piloté par un associé. Cette proximité garantit à nos clients un interlocuteur senior à chaque étape, une réactivité sans équivalent et une parfaite confidentialité.",
            "En vingt-huit ans, nous avons conseillé plus de 340 entreprises clientes sur des opérations dont la valeur cumulée dépasse 4,2 milliards d'euros, avec un taux d'issues favorables de 97 % sur nos contentieux.",
          ].map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.85, marginBottom: 24 }}>{paraTxt}</p>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ background: C.navy, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: C.accent }} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Nos valeurs</span>
              <div style={{ width: 32, height: 1, background: C.accent }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 50px)", color: C.white, margin: 0, fontWeight: 700 }}>Excellence. Discrétion. Résultats.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
            {firmValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ background: C.navyLight, padding: 44, borderTop: `3px solid ${C.accent}` }}
              >
                <div style={{ width: 56, height: 56, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <v.icon size={24} color={C.accent} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 12px", fontWeight: 700 }}>{v.title}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners recap (reuses attorneys data) */}
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: C.accent }} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Notre équipe</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 50px)", color: C.navy, margin: 0, fontWeight: 700 }}>Les associés</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {attorneys.map((atty, i) => (
              <motion.div
                key={atty.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}` }}
              >
                <div style={{ width: 64, height: 64, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: C.accent, fontWeight: 700 }}>{atty.name.charAt(0)}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{atty.name}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", letterSpacing: "0.04em" }}>{atty.title}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textDim, margin: "0 0 18px" }}>{atty.focus}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{atty.bio}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: "center" as const, marginTop: 56 }}>
            <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
              <button
                style={{ background: C.accent, color: C.white, padding: "16px 40px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Prendre rendez-vous <ArrowRight size={15} /></button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
