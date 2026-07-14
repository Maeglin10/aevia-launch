"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  SCENES,
  SVGMonogram,
  ScrollWord,
  FabricSection,
  PressSection,
} from './shared';


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VMMaisonPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Master scroll for scene transitions
  const [sceneIdx, setSceneIdx] = useState(0);

  // Scroll for the words section
  const wordsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: wordsProgress } = useScroll({
    target: wordsRef,
    offset: ['start start', 'end end'],
  });

  // Scene color interpolation via scroll
  const masterRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: masterProgress } = useScroll({
    target: masterRef,
    offset: ['start start', 'end end'],
  });

  // Compute current scene for static sections
  useEffect(() => {
    const unsub = masterProgress.on('change', (v) => {
      if (v < 0.25) setSceneIdx(0);
      else if (v < 0.5) setSceneIdx(1);
      else if (v < 0.75) setSceneIdx(2);
      else setSceneIdx(3);
    });
    return unsub;
  }, [masterProgress]);

  // Words for Apple-style sequence
  const words = [
    { word: 'ÉLÉGANCE', sceneIdx: 0 },
    { word: 'AUDACE', sceneIdx: 1 },
    { word: 'LIBERTÉ', sceneIdx: 2 },
    { word: 'GRÂCE', sceneIdx: 3 },
  ];

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div
      ref={masterRef}
      style={{
        backgroundColor: SCENES[0].bg,
        color: SCENES[0].textPrimary,
        overflowX: 'hidden',
      }}
    >
      {/* ── HERO — SVG Monogram ──────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100dvh',
          backgroundColor: SCENES[0].bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fabric texture background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(
                -55deg,
                transparent,
                transparent 18px,
                ${SCENES[0].patternColor} 18px,
                ${SCENES[0].patternColor} 19px
              )
            `,
          }}
        />

        {/* Large decorative text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2, delay: 2.5 }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(6rem, 18vw, 18rem)',
            fontWeight: 300,
            color: SCENES[0].accent,
            letterSpacing: '0.18em',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          MAISON
        </motion.div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* SVG Monogram with drawing animation */}
          <SVGMonogram color={SCENES[0].accent} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: SCENES[0].textSecondary,
              }}
            >
              Paris — Maison de Couture
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                letterSpacing: '0.08em',
                color: SCENES[0].textSecondary,
                fontStyle: 'italic',
              }}
            >
              Collection Perpétuelle — 2026
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: SCENES[0].textSecondary,
            }}
          >
            Défiler
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 1,
              height: 48,
              backgroundColor: SCENES[0].accent,
              opacity: 0.45,
            }}
          />
        </motion.div>
      </section>

      {/* ── APPLE-STYLE WORD SEQUENCE ────────────────────────────────────────── */}
      <div
        ref={wordsRef}
        id="collections"
        style={{
          height: '400vh',
          position: 'relative',
          backgroundColor: SCENES[0].bg,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Scene background transitions */}
          {SCENES.map((scene, i) => {
            const opacity = useTransform(
              wordsProgress,
              [i * 0.25, i * 0.25 + 0.05, (i + 1) * 0.25 - 0.05, (i + 1) * 0.25],
              [0, 1, 1, 0]
            );
            return (
              <motion.div
                key={scene.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: scene.bg,
                  opacity: i === 0 ? undefined : opacity,
                  backgroundImage: `repeating-linear-gradient(
                    ${45 + i * 15}deg,
                    transparent,
                    transparent ${14 + i * 4}px,
                    ${scene.patternColor} ${14 + i * 4}px,
                    ${scene.patternColor} ${15 + i * 4}px
                  )`,
                }}
              />
            );
          })}

          {/* Season label */}
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              right: '4rem',
              zIndex: 10,
            }}
          >
            {SCENES.map((scene, i) => {
              const opacity = useTransform(
                wordsProgress,
                [i * 0.25, i * 0.25 + 0.08, (i + 1) * 0.25 - 0.08, (i + 1) * 0.25],
                [0, 1, 1, 0]
              );
              return (
                <motion.div
                  key={scene.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    opacity,
                    fontFamily: 'monospace',
                    fontSize: '0.62rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: scene.accent,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {scene.name}
                </motion.div>
              );
            })}
          </div>

          {/* Words */}
          {words.map((item, i) => (
            <ScrollWord
              key={item.word}
              word={item.word}
              scrollProgress={wordsProgress}
              start={i * 0.25}
              peak={i * 0.25 + 0.1}
              end={(i + 1) * 0.25}
              sceneIdx={item.sceneIdx}
            />
          ))}
        </div>
      </div>

      {/* ── PRESS ────────────────────────────────────────────────────────────── */}
      <FabricSection pattern="herringbone" scene={SCENES[0]}>
        <div id="presse">
          <PressSection scene={SCENES[0]} />
        </div>
      </FabricSection>
    </div>
  );
}
