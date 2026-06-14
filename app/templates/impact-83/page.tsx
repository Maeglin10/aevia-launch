"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Gem } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, GemStoneSVG, Reveal } from "./shared";

export default function Impact83Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  const [heroGem, setHeroGem] = useState<string>("diamond");
  const basePath = "/templates/impact-83";

  // Rotate hero gem
  useEffect(() => {
    const gems = ["diamond", "ruby", "sapphire", "emerald", "amethyst"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % gems.length;
      setHeroGem(gems[i]);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef}>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bg} 60%, #2a1808 100%)`,
        }}
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 24px" }}>
            {/* Gem signature element */}
            <motion.div
              style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroGem}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <GemStoneSVG type={heroGem} size={140} animated={false} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 24,
              }}
            >
              Maison de Joaillerie & Horlogerie
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                lineHeight: 1.15,
                color: C.text,
                marginBottom: 8,
              }}
            >
              L&apos;Art du
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.15,
                color: C.accent,
                marginBottom: 40,
              }}
            >
              Temps Précieux
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 20,
                fontWeight: 300,
                color: C.textMuted,
                maxWidth: 520,
                margin: "0 auto 56px",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              Depuis 1887, Aurelius Heritage perpétue l&apos;excellence de la joaillerie française et l&apos;art horloger suisse pour les collectionneurs du monde entier.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href={`${basePath}/collections`} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.accent,
                    color: C.bg,
                    border: "none",
                    padding: "16px 36px",
                    fontFamily: FONT_LABEL,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Découvrir les Collections <ArrowRight size={14} />
                </button>
              </Link>
              <Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${C.borderGold}`,
                    color: C.textMuted,
                    background: "transparent",
                    padding: "16px 36px",
                    fontFamily: FONT_LABEL,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Sur Mesure <Gem size={14} />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <ChevronDown size={20} color={C.textMuted} />
        </motion.div>
      </section>
    </div>
  );
}
