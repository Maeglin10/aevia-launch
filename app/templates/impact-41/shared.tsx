'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';

// ─── Seasonal scene definitions ───────────────────────────────────────────────
export const SCENES = [
  {
    name: 'Automne',
    bg: '#1a0f07',
    bgMid: '#2d1608',
    accent: '#c9835a',
    accentLight: '#e8a97e',
    textPrimary: '#f0e8df',
    textSecondary: '#9a7a68',
    borderColor: 'rgba(201,131,90,0.18)',
    patternColor: 'rgba(201,131,90,0.06)',
  },
  {
    name: 'Hiver',
    bg: '#0a0f1a',
    bgMid: '#111827',
    accent: '#b8c4d4',
    accentLight: '#d4dde8',
    textPrimary: '#e8edf5',
    textSecondary: '#6b7a8d',
    borderColor: 'rgba(184,196,212,0.18)',
    patternColor: 'rgba(184,196,212,0.05)',
  },
  {
    name: 'Printemps',
    bg: '#f5f0e8',
    bgMid: '#ede8dc',
    accent: '#6b8f5e',
    accentLight: '#89b07a',
    textPrimary: '#1a1a14',
    textSecondary: '#6b6255',
    borderColor: 'rgba(107,143,94,0.2)',
    patternColor: 'rgba(107,143,94,0.07)',
  },
  {
    name: 'Été',
    bg: '#f5e8d5',
    bgMid: '#edddc8',
    accent: '#2d6b7a',
    accentLight: '#3d8a9c',
    textPrimary: '#0f1f23',
    textSecondary: '#5a6e73',
    borderColor: 'rgba(45,107,122,0.2)',
    patternColor: 'rgba(45,107,122,0.07)',
  },
];

// ─── Collections data ──────────────────────────────────────────────────────────
export const COLLECTIONS = [
  {
    number: '01',
    season: 'Automne / Hiver',
    title: 'Crépuscule de Soie',
    subtitle: 'La Collection',
    desc: 'Drapés profonds en soie sauvage. Broderies de fils d\'or brûlé. Une architecture du corps qui redéfinit la nuit.',
    palette: ['#2d1608', '#c9835a', '#e8d5c0'],
  },
  {
    number: '02',
    season: 'Automne / Hiver',
    title: 'Noir Minéral',
    subtitle: 'La Collection',
    desc: 'Cachemire double face. Découpes géométriques inspirées de la lithographie japonaise. Pureté absolue.',
    palette: ['#0a0f1a', '#b8c4d4', '#ffffff'],
  },
  {
    number: '03',
    season: 'Printemps / Été',
    title: 'Jardin Suspendu',
    subtitle: 'La Collection',
    desc: 'Voiles de lin Égyptien. Teintes tirées de la nature vivante. La légèreté comme manifeste.',
    palette: ['#f5f0e8', '#6b8f5e', '#d4c9b0'],
  },
  {
    number: '04',
    season: 'Printemps / Été',
    title: 'Lumière Marine',
    subtitle: 'La Collection',
    desc: 'Textiles côtiers tissés main. Bleus profonds et sables lumineux. La mer comme muse.',
    palette: ['#f5e8d5', '#2d6b7a', '#a8c5cc'],
  },
  {
    number: '05',
    season: 'Couture',
    title: 'La Robe Absolue',
    subtitle: 'Haute Couture',
    desc: 'Pièce unique. Mille heures de broderie main. Trente-deux mètres de taffetas de soie. Un chef-d\'oeuvre vivant.',
    palette: ['#1a0f07', '#d4a862', '#f0e0c8'],
  },
  {
    number: '06',
    season: 'Couture',
    title: 'Architecture du Vide',
    subtitle: 'Haute Couture',
    desc: 'Organza structuré en volumes. Le corps disparaît pour laisser place à la sculpture. Couture comme art.',
    palette: ['#0a0f1a', '#c4b8d4', '#e8e0f0'],
  },
  {
    number: '07',
    season: 'Capsule',
    title: 'Héritage',
    subtitle: 'La Capsule',
    desc: 'Six pièces. Un vestiaire pour l\'éternité. Chaque silhouette porte cent ans de savoir-faire.',
    palette: ['#1a1208', '#8b7355', '#d4c4a8'],
  },
  {
    number: '08',
    season: 'Capsule',
    title: 'Nuit Étoilée',
    subtitle: 'La Capsule',
    desc: 'Velours de Gênes brodé à la main. Constellation de cristaux. La nuit comme territoire de la grâce.',
    palette: ['#060810', '#7a8fb8', '#c8d4e8'],
  },
];

// ─── Lookbook entries ──────────────────────────────────────────────────────────
export const LOOKBOOK = [
  { ref: 'LB-001', material: 'Soie Sauvage', origin: 'Vietnam', caption: 'Robe longue à taille marquée' },
  { ref: 'LB-002', material: 'Cachemire Grade A', origin: 'Mongolie', caption: 'Manteau redingote oversize' },
  { ref: 'LB-003', material: 'Lin Égyptien', origin: 'Égypte', caption: 'Ensemble tailleur fluide' },
  { ref: 'LB-004', material: 'Taffetas de Soie', origin: 'Lyon', caption: 'Jupe midi architecture' },
  { ref: 'LB-005', material: 'Velours de Gênes', origin: 'Italie', caption: 'Veste structurée baroque' },
  { ref: 'LB-006', material: 'Organza Plumetis', origin: 'France', caption: 'Blouse romantique à volants' },
];

// ─── SVG Monogram ──────────────────────────────────────────────────────────────
export function SVGMonogram({ color }: { color: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  const vPath = 'M 30 20 L 80 140 L 130 20';
  const mPath = 'M 160 140 L 160 20 L 220 100 L 280 20 L 280 140';

  return (
    <svg
      width="320"
      height="160"
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* V */}
      <motion.path
        ref={pathRef}
        d={vPath}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={drawn ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      {/* M */}
      <motion.path
        d={mPath}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={drawn ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      />
      {/* Decorative horizontal rule */}
      <motion.line
        x1="20"
        y1="155"
        x2="300"
        y2="155"
        stroke={color}
        strokeWidth="0.75"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={drawn ? { scaleX: 1, opacity: 0.45 } : {}}
        transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '160px 155px' }}
      />
    </svg>
  );
}

// ─── Word Stage component (Apple-style scroll-linked word) ────────────────────
export function ScrollWord({
  word,
  scrollProgress,
  start,
  peak,
  end,
  sceneIdx,
}: {
  word: string;
  scrollProgress: any;
  start: number;
  peak: number;
  end: number;
  sceneIdx: number;
}) {
  const scene = SCENES[sceneIdx];
  const opacity = useTransform(
    scrollProgress,
    [start, peak, peak + (end - peak) * 0.3, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollProgress,
    [start, peak],
    [0.82, 1.0]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        scale,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'EB Garamond', Georgia, serif",
          fontSize: 'clamp(4.5rem, 14vw, 13rem)',
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: scene.accent,
          lineHeight: 1,
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        {word}
      </span>
    </motion.div>
  );
}

// ─── Fabric texture section ────────────────────────────────────────────────────
export function FabricSection({
  pattern,
  scene,
  children,
}: {
  pattern: 'grid' | 'herringbone' | 'diagonal';
  scene: (typeof SCENES)[number];
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const patternStyle: Record<string, React.CSSProperties> = {
    grid: {
      backgroundImage: `
        repeating-linear-gradient(0deg, ${scene.patternColor} 0px, ${scene.patternColor} 1px, transparent 1px, transparent 28px),
        repeating-linear-gradient(90deg, ${scene.patternColor} 0px, ${scene.patternColor} 1px, transparent 1px, transparent 28px)
      `,
    },
    herringbone: {
      backgroundImage: `
        repeating-linear-gradient(45deg, ${scene.patternColor} 0px, ${scene.patternColor} 1px, transparent 1px, transparent 18px),
        repeating-linear-gradient(-45deg, ${scene.patternColor} 0px, ${scene.patternColor} 1px, transparent 1px, transparent 18px)
      `,
    },
    diagonal: {
      backgroundImage: `
        repeating-linear-gradient(
          -55deg,
          transparent,
          transparent 14px,
          ${scene.patternColor} 14px,
          ${scene.patternColor} 15px
        )
      `,
    },
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: scene.bg,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
          y,
          ...patternStyle[pattern],
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── Runway Carousel ──────────────────────────────────────────────────────────
export function RunwayCarousel({ scene }: { scene: (typeof SCENES)[number] }) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ['start start', 'end end'],
  });

  const totalSlides = COLLECTIONS.length;
  const rawIndex = useTransform(scrollYProgress, [0, 0.98], [0, totalSlides - 1]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);

  useEffect(() => {
    const unsub = rawIndex.on('change', (v) => {
      const next = Math.round(v);
      const clamped = Math.max(0, Math.min(totalSlides - 1, next));
      if (clamped !== activeIdx) {
        setPrevIdx(activeIdx);
        setActiveIdx(clamped);
      }
    });
    return unsub;
  }, [rawIndex, activeIdx, totalSlides]);

  const col = COLLECTIONS[activeIdx];

  return (
    <div
      ref={stickyRef}
      style={{ height: `${totalSlides * 120}vh`, position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: scene.bg,
          overflow: 'hidden',
        }}
      >
        {/* Left — outfit number + meta */}
        <div
          style={{
            width: '38%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '4rem 3rem 4rem 5rem',
            borderRight: `1px solid ${scene.borderColor}`,
          }}
        >
          <motion.div
            key={`label-${activeIdx}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                color: scene.textSecondary,
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              {col.season}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                fontWeight: 300,
                color: scene.textPrimary,
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                marginBottom: '1.5rem',
              }}
            >
              {col.title}
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.05rem',
                fontStyle: 'italic',
                color: scene.textSecondary,
                lineHeight: 1.85,
                maxWidth: 320,
                marginBottom: '2.5rem',
              }}
            >
              {col.desc}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              {col.palette.map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: i === 0 ? 32 : 20,
                    height: i === 0 ? 32 : 20,
                    borderRadius: '50%',
                    backgroundColor: p,
                    border: `1px solid ${scene.borderColor}`,
                    transition: 'width 0.3s, height 0.3s',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Slide counter */}
          <div
            style={{
              marginTop: '4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '3.5rem',
                fontWeight: 300,
                color: scene.accent,
                lineHeight: 1,
              }}
            >
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: scene.borderColor }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: scene.textSecondary,
              }}
            >
              {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right — visual card */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`card-${activeIdx}`}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-40%', opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: col.palette[0],
              }}
            >
              {/* Abstract outfit silhouette using CSS */}
              <div
                style={{
                  position: 'relative',
                  width: 220,
                  height: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Head */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: col.palette[1],
                    opacity: 0.7,
                    marginBottom: 12,
                  }}
                />
                {/* Shoulders */}
                <div
                  style={{
                    width: 160,
                    height: 8,
                    backgroundColor: col.palette[1],
                    opacity: 0.5,
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                />
                {/* Torso */}
                <div
                  style={{
                    width: 80,
                    height: 120,
                    backgroundImage: `repeating-linear-gradient(
                      -55deg,
                      transparent,
                      transparent 6px,
                      ${col.palette[2]}55 6px,
                      ${col.palette[2]}55 7px
                    )`,
                    backgroundColor: col.palette[1],
                    opacity: 0.6,
                  }}
                />
                {/* Skirt / drape */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '80px solid transparent',
                    borderRight: '80px solid transparent',
                    borderTop: `160px solid ${col.palette[1]}`,
                    opacity: 0.4,
                    marginTop: -2,
                  }}
                />
              </div>

              {/* Reference tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '3rem',
                  right: '3rem',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: col.palette[2],
                  opacity: 0.65,
                }}
              >
                REF {col.number} — VM MAISON
              </div>

              {/* Diagonal fabric texture overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 22px,
                    ${col.palette[2]}08 22px,
                    ${col.palette[2]}08 23px
                  )`,
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div
            style={{
              position: 'absolute',
              top: '2.5rem',
              right: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              zIndex: 10,
            }}
          >
            {COLLECTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 2,
                  height: i === activeIdx ? 24 : 8,
                  backgroundColor: i === activeIdx ? col.palette[2] : `${col.palette[2]}40`,
                  borderRadius: 2,
                  transition: 'height 0.4s ease, background-color 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lookbook Item (extracted to respect rules of hooks) ─────────────────────
const LOOKBOOK_ASPECT_RATIOS = ['3/4', '4/3', '3/4', '4/3', '3/4', '4/3'];

export function LookbookItem({
  item,
  index,
  scene,
}: {
  item: (typeof LOOKBOOK)[number];
  index: number;
  scene: (typeof SCENES)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const delay = (index % 3) * 0.08 + Math.floor(index / 3) * 0.12;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        aspectRatio: LOOKBOOK_ASPECT_RATIOS[index],
        backgroundColor: scene.bgMid,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              ${30 + index * 15}deg,
              transparent,
              transparent ${12 + index * 3}px,
              ${scene.patternColor} ${12 + index * 3}px,
              ${scene.patternColor} ${13 + index * 3}px
            )
          `,
        }}
      />
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          background: `linear-gradient(to top, ${scene.bg}dd 0%, transparent 50%)`,
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: scene.accent,
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
          }}
        >
          {item.ref}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '0.95rem',
            color: scene.textPrimary,
            letterSpacing: '0.04em',
            marginBottom: '0.2rem',
          }}
        >
          {item.caption}
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: scene.textSecondary,
            textTransform: 'uppercase',
          }}
        >
          {item.material} — {item.origin}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Lookbook Grid ────────────────────────────────────────────────────────────
export function LookbookGrid({ scene }: { scene: (typeof SCENES)[number] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        backgroundColor: scene.borderColor,
      }}
    >
      {LOOKBOOK.map((item, i) => (
        <LookbookItem key={item.ref} item={item} index={i} scene={scene} />
      ))}
    </div>
  );
}

// ─── Atelier section ──────────────────────────────────────────────────────────
export function AtelierSection({ scene }: { scene: (typeof SCENES)[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const pillars = [
    {
      number: '01',
      title: 'Savoir-faire',
      desc: 'Chaque pièce naît de six mois de prototypage. Nos ateliers parisiens réunissent quatre-vingt artisans d\'excellence, héritiers de traditions centenaires.',
    },
    {
      number: '02',
      title: 'Matière',
      desc: 'Nous sourceons nos textiles dans dix-sept pays, sélectionnés pour leur qualité intrinsèque. Soie grège du Vietnam, cachemire de Mongolie, lin d\'Égypte.',
    },
    {
      number: '03',
      title: 'Durabilité',
      desc: 'Chaque création est conçue pour traverser les décennies. Nous refusons la mode de saison — nous fabriquons des archives destinées aux générations futures.',
    },
    {
      number: '04',
      title: 'Signature',
      desc: 'La coupe VM est reconnaissable entre toutes — cette ligne de hanche particulière, ce tombé. Une géométrie du corps unique, brevetée depuis 2008.',
    },
  ];

  return (
    <div ref={ref} style={{ padding: '8rem 5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '5rem' }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: scene.accent,
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          L'Atelier
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 300,
            color: scene.textPrimary,
            letterSpacing: '0.06em',
            lineHeight: 1.05,
            maxWidth: 700,
          }}
        >
          L'excellence comme seul absolu
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          backgroundColor: scene.borderColor,
        }}
      >
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.number}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '3.5rem',
              backgroundColor: scene.bg,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '5rem',
                fontWeight: 300,
                color: scene.accent,
                opacity: 0.12,
                lineHeight: 1,
                position: 'absolute',
                top: '2rem',
                right: '2.5rem',
              }}
            >
              {pillar.number}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                color: scene.accent,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {pillar.number}
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.8rem',
                fontWeight: 300,
                color: scene.textPrimary,
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              {pillar.title}
            </h3>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1rem',
                fontStyle: 'italic',
                color: scene.textSecondary,
                lineHeight: 1.9,
              }}
            >
              {pillar.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Press section ────────────────────────────────────────────────────────────
export function PressSection({ scene }: { scene: (typeof SCENES)[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const quotes = [
    {
      text: 'Une maison qui redéfinit la notion même de luxe.',
      source: 'Le Figaro Madame',
    },
    {
      text: 'La coupe VM est la plus architecturale de sa génération.',
      source: 'Vogue Paris',
    },
    {
      text: 'Un vestiaire pour l\'éternité, sculpté dans la perfection.',
      source: 'Harper\'s Bazaar',
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        padding: '7rem 5rem',
        borderTop: `1px solid ${scene.borderColor}`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3.5rem',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: scene.accent,
            textTransform: 'uppercase',
          }}
        >
          Presse & Revues
        </div>

        {quotes.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              gap: '3rem',
              alignItems: 'flex-start',
              paddingBottom: '3rem',
              borderBottom: i < quotes.length - 1 ? `1px solid ${scene.borderColor}` : 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '4.5rem',
                color: scene.accent,
                lineHeight: 0.8,
                flexShrink: 0,
                opacity: 0.35,
                marginTop: '-0.5rem',
              }}
            >
              "
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: scene.textPrimary,
                  lineHeight: 1.5,
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                }}
              >
                {q.text}
              </p>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  color: scene.accent,
                  textTransform: 'uppercase',
                }}
              >
                — {q.source}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Contact / Press request form area ───────────────────────────────────────
export function ContactSection({ scene }: { scene: (typeof SCENES)[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      style={{
        padding: '8rem 5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6rem',
        alignItems: 'center',
        borderTop: `1px solid ${scene.borderColor}`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: scene.accent,
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          Contact & Presse
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            color: scene.textPrimary,
            letterSpacing: '0.06em',
            lineHeight: 1.1,
            marginBottom: '2rem',
          }}
        >
          Rejoindre<br />l'univers VM
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: scene.textSecondary,
            lineHeight: 1.85,
            marginBottom: '3rem',
            maxWidth: 380,
          }}
        >
          Pour les demandes presse, les commandes sur-mesure, et les collaborations éditoriales, notre équipe vous répond sous 48 heures.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Presse & Médias', value: 'presse@vm-maison.com' },
            { label: 'Boutiques & Commandes', value: '+33 1 44 72 90 00' },
            { label: 'Atelier Paris', value: '12 rue du Faubourg Saint-Honoré' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  color: scene.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1rem',
                  color: scene.textPrimary,
                  letterSpacing: '0.04em',
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {['Prénom & Nom', 'Adresse e-mail', 'Publication / Organisation'].map((placeholder) => (
          <div
            key={placeholder}
            style={{
              borderBottom: `1px solid ${scene.borderColor}`,
              paddingBottom: '0.75rem',
            }}
          >
            <input
              type="text"
              placeholder={placeholder}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1rem',
                color: scene.textPrimary,
                padding: '0.5rem 0',
                caretColor: scene.accent,
              }}
            />
          </div>
        ))}

        <div
          style={{
            borderBottom: `1px solid ${scene.borderColor}`,
            paddingBottom: '0.75rem',
          }}
        >
          <textarea
            placeholder="Votre demande"
            rows={4}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1rem',
              color: scene.textPrimary,
              padding: '0.5rem 0',
              resize: 'none',
              caretColor: scene.accent,
            }}
          />
        </div>

        <motion.button
          whileHover={{ letterSpacing: '0.35em' }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: '1rem',
            padding: '1.1rem 2.5rem',
            backgroundColor: 'transparent',
            border: `1px solid ${scene.accent}`,
            color: scene.accent,
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Envoyer
        </motion.button>
      </motion.div>
    </div>
  );
}
