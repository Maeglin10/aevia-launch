"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Package } from "lucide-react";
import { C, PageHero } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

export default function About() {
  const values = [
    { icon: <Leaf size={22} />, title: "Fleurs de saison", text: "Nous composons avec les fleurs du moment et privilégions les petits cultivateurs français dès que la saison le permet." },
    { icon: <Heart size={22} />, title: "Fait main, avec intention", text: "Chaque création est façonnée à la main dans notre atelier, du simple bouquet à l'arche de mariage." },
    { icon: <Package size={22} />, title: "Emballage soigné", text: "Papier kraft, ruban et carte d'entretien : un soin du détail jusque dans la livraison, à votre porte." },
  ];
  return (
    <div>
      <PageHero eyebrow="Notre histoire" title="Fait main, avec amour." subtitle="Pétales & Co est née d'une conviction simple : les fleurs ne devraient jamais être un détail. Elles racontent nos moments les plus précieux." />
      <section style={{ background: C.bg, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {[
            "Fondé en 2014 par la fleuriste Amélie Rousseau, notre atelier du 11e arrondissement est devenu un lieu de rendez-vous pour celles et ceux qui aiment la beauté naturelle.",
            "Nous travaillons avec de petits producteurs français dès que possible, choisissons les fleurs de saison plutôt que les variétés importées, et composons chaque arrangement à la main — d'une simple tige à une arche de mariage.",
            "Notre raison d'être : transformer une émotion en bouquet. Un anniversaire, un mariage, un adieu, ou simplement l'envie d'égayer un intérieur. Pour chaque moment, une fleur.",
          ].map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: SANS, fontSize: 17, color: C.textMuted, lineHeight: 1.9, marginBottom: 24 }}>{paraTxt}</p>
          ))}
        </div>
      </section>
      <section style={{ background: C.blush, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 24 }}>
          {values.map((v, i) => (
            <motion.div key={v.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "40px 32px" }}
            >
              <div style={{ width: 56, height: 56, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, marginBottom: 20 }}>{v.icon}</div>
              <h3 style={{ fontFamily: SERIF, fontSize: 21, color: C.text, margin: "0 0 12px", fontWeight: 700 }}>{v.title}</h3>
              <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section style={{ background: C.bg, padding: "90px 24px", textAlign: "center" as const }}>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", color: C.accent, margin: "0 0 20px", fontWeight: 700 }}>Une création vous attend.</h2>
        <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>Découvrez nos bouquets de saison et nos compositions sur mesure.</p>
        <Link href="/templates/impact-47/boutique" style={{ textDecoration: "none" }}>
          <button
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: SANS, fontWeight: 700, border: "none", borderRadius: 2, cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Découvrir la boutique <ArrowRight size={15} /></button>
        </Link>
      </section>
    </div>
  );
}
