'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion'
import { TemplateIcon } from '@/components/TemplateIcon'

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================= */

const C = {
  bg: '#1a1a1a',
  bgLight: '#222222',
  bgCard: '#242424',
  cream: '#f5f0e8',
  creamDim: '#c8c2b6',
  yellow: '#e8b84b',
  yellowDim: '#b8922e',
  blueprint: '#1e3a5f',
  blueprintLight: '#2a4f82',
  white: '#ffffff',
  border: '#333333',
  borderLight: '#444444',
}

const FONT_HEADING = `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
const FONT_BODY = `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

/* ==========================================================================
   DATA
   ========================================================================= */

const STATS = [
  { label: 'Projets livrés', value: 347, suffix: '', prefix: '' },
  { label: 'Mètres carrés construits', value: 2400000, suffix: '', prefix: '', formatted: '2,4M m²' },
  { label: "Années d'expertise", value: 38, suffix: '', prefix: '' },
  { label: 'Pays', value: 12, suffix: '', prefix: '' },
]

const PROJECTS = [
  {
    id: 1,
    name: 'Tour Confluence',
    category: 'Immobilier d\'entreprise',
    location: 'Lyon, France',
    year: '2023',
    surface: '42 000 m²',
    floors: 28,
    color: '#2a4a6b',
  },
  {
    id: 2,
    name: 'Pont Duval-Nord',
    category: 'Infrastructure',
    location: 'Bordeaux, France',
    year: '2022',
    surface: '1,2 km',
    floors: 0,
    color: '#3d4a2a',
  },
  {
    id: 3,
    name: 'Complexe Aristide',
    category: 'Gros œuvre',
    location: 'Paris, France',
    year: '2024',
    surface: '18 500 m²',
    floors: 12,
    color: '#4a2a2a',
  },
  {
    id: 4,
    name: 'Hub Logistique Sud',
    category: 'Entrepôt industriel',
    location: 'Marseille, France',
    year: '2023',
    surface: '35 000 m²',
    floors: 3,
    color: '#2a3d4a',
  },
]

const MATERIALS = [
  {
    name: 'Béton armé',
    desc: 'Structures portantes haute performance — résistance ≥ C35/45',
    gradient: 'repeating-linear-gradient(0deg, #555 0px, #555 1px, #444 1px, #666 4px)',
  },
  {
    name: 'Acier structurel',
    desc: 'Charpentes et ossatures métalliques — nuances S275/S355',
    gradient: 'repeating-linear-gradient(45deg, #888 0px, #888 1px, #666 1px, #777 6px)',
  },
  {
    name: 'Verre feuilleté',
    desc: 'Façades doubles peaux et verrières — sécurité renforcée',
    gradient: 'repeating-linear-gradient(135deg, rgba(180,220,255,0.3) 0px, rgba(180,220,255,0.3) 1px, rgba(140,190,230,0.2) 1px, rgba(160,210,250,0.25) 5px)',
  },
  {
    name: 'Bois lamellé-collé',
    desc: 'Structures et bardages biosourcés — certifié PEFC',
    gradient: 'repeating-linear-gradient(90deg, #8B5E3C 0px, #8B5E3C 2px, #6B4423 2px, #7a4f30 8px)',
  },
]

const TEAM = [
  {
    name: 'Jean-Marc Ferretti',
    role: 'Directeur Général & Fondateur',
    exp: '38 ans',
    spec: 'Génie civil, grandes infrastructures',
  },
  {
    name: 'Sophie Aubert',
    role: 'Directrice Technique',
    exp: '22 ans',
    spec: 'BIM, gros œuvre, certification HQE',
  },
  {
    name: 'Karim Benali',
    role: 'Responsable Chantiers',
    exp: '18 ans',
    spec: 'Coordination multi-corps d\'état',
  },
  {
    name: 'Isabelle Morin',
    role: 'Architecte-Ingénieure Senior',
    exp: '15 ans',
    spec: 'Immobilier d\'entreprise, façades',
  },
]

const SERVICES = [
  {
    icon: '⬜',
    title: 'Gros Œuvre',
    desc: 'Fondations, terrassement, structure béton et charpente métallique. Maîtrise totale du cycle structurel.',
  },
  {
    icon: '🔩',
    title: 'Infrastructure',
    desc: 'Ponts, viaducs, tunnels, voirie et réseaux divers. Ingénierie de précision pour ouvrages d\'art.',
  },
  {
    icon: '🏢',
    title: 'Immobilier d\'Entreprise',
    desc: 'Bureaux, entrepôts, parcs d\'activités. De la conception au clé-en-main, certification BBC/HQE.',
  },
  {
    icon: '📐',
    title: 'Maîtrise d\'Œuvre',
    desc: 'Pilotage complet du projet, coordination des corps d\'état, suivi qualité et respect des délais.',
  },
]

/* ==========================================================================
   UTILITY HOOKS
   ========================================================================= */

function useCounter(target: number, isActive: boolean, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isActive) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isActive, target, duration])
  return count
}

/* ==========================================================================
   BLUEPRINT SVG HERO
   ========================================================================= */

function BlueprintHero() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: C.blueprint,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Blueprint SVG background */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.35,
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Horizontal grid lines */}
        {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map((y, i) => (
          <motion.line
            key={`h-${y}`}
            x1="0" y1={y} x2="1440" y2={y}
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="1440"
            initial={{ strokeDashoffset: 1440 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
          />
        ))}
        {/* Vertical grid lines */}
        {[80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => (
          <motion.line
            key={`v-${x}`}
            x1={x} y1="0" x2={x} y2="900"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="900"
            initial={{ strokeDashoffset: 900 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
          />
        ))}
        {/* Measurement arrows — horizontal */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <line x1="120" y1="820" x2="1320" y2="820" stroke="white" strokeWidth="1" />
          <polygon points="120,815 120,825 105,820" fill="white" />
          <polygon points="1320,815 1320,825 1335,820" fill="white" />
          <text x="720" y="810" fill="white" fontSize="11" textAnchor="middle" fontFamily="monospace">72.00 m</text>
        </motion.g>
        {/* Measurement arrows — vertical */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <line x1="60" y1="100" x2="60" y2="800" stroke="white" strokeWidth="1" />
          <polygon points="55,100 65,100 60,85" fill="white" />
          <polygon points="55,800 65,800 60,815" fill="white" />
          <text x="30" y="455" fill="white" fontSize="11" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,30,455)">45.00 m</text>
        </motion.g>
        {/* Corner marks */}
        {[
          [120, 100], [1320, 100], [120, 800], [1320, 800]
        ].map(([cx, cy], i) => (
          <motion.g
            key={`corner-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <line x1={cx - 15} y1={cy} x2={cx + 15} y2={cy} stroke="white" strokeWidth="1.5" />
            <line x1={cx} y1={cy - 15} x2={cx} y2={cy + 15} stroke="white" strokeWidth="1.5" />
          </motion.g>
        ))}
        {/* Central building outline */}
        <motion.rect
          x="320" y="160" width="800" height="600"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="2800"
          initial={{ strokeDashoffset: 2800 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, delay: 1.2, ease: 'easeInOut' }}
        />
        {/* Building floors lines */}
        {[240, 320, 400, 480, 560, 640, 700].map((y, i) => (
          <motion.line
            key={`floor-${i}`}
            x1="320" y1={y} x2="1120" y2={y}
            stroke="white"
            strokeWidth="0.8"
            strokeDasharray="800"
            initial={{ strokeDashoffset: 800 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.1, ease: 'easeOut' }}
          />
        ))}
        {/* Center cross */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
          style={{ transformOrigin: '720px 450px' }}
        >
          <circle cx="720" cy="450" r="40" fill="none" stroke={C.yellow} strokeWidth="1.5" />
          <line x1="680" y1="450" x2="760" y2="450" stroke={C.yellow} strokeWidth="1" />
          <line x1="720" y1="410" x2="720" y2="490" stroke={C.yellow} strokeWidth="1" />
        </motion.g>
        {/* Blueprint text labels */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <text x="325" y="185" fill="white" fontSize="10" fontFamily="monospace">PLAN R+7 — FAÇADE NORD</text>
          <text x="325" y="775" fill="white" fontSize="10" fontFamily="monospace">ÉCHELLE 1:200 — REF: BTP-2024-208</text>
          <text x="900" y="185" fill="white" fontSize="10" fontFamily="monospace" textAnchor="end">FERRETTI CONSTRUCTION</text>
        </motion.g>
      </svg>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 900 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'inline-block',
            background: C.yellow,
            color: C.bg,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            padding: '6px 18px',
            marginBottom: 32,
            fontFamily: FONT_BODY,
            textTransform: 'uppercase',
          }}
        >
          Depuis 1986 — Construire l&apos;essentiel
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.9, ease: 'easeOut' }}
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 1.0,
            color: C.cream,
            margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}
        >
          FERRETTI
          <br />
          <span style={{ color: C.yellow }}>CONSTRUCTION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
          style={{
            color: C.creamDim,
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.7,
            maxWidth: 600,
            margin: '0 auto 48px',
            fontFamily: FONT_BODY,
          }}
        >
          Gros œuvre, infrastructure et immobilier d&apos;entreprise.
          Nous bâtissons les structures qui définissent les villes de demain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a
            href="#contact"
            style={{
              display: 'inline-block',
              background: C.yellow,
              color: C.bg,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 15,
              padding: '16px 36px',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
          >
            Discuter de votre projet →
          </a>
          <a
            href="#projects"
            style={{
              display: 'inline-block',
              border: `2px solid ${C.cream}`,
              color: C.cream,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 15,
              padding: '16px 36px',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            Nos réalisations
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: C.creamDim,
          fontFamily: FONT_BODY,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span>Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 40,
            background: `linear-gradient(to bottom, ${C.yellow}, transparent)`,
          }}
        />
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   SERVICES STRIP
   ========================================================================= */

function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="services"
      style={{
        background: C.bgLight,
        padding: '80px 24px',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 60 }}
        >
          <p style={{
            fontFamily: FONT_BODY,
            color: C.yellow,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            — Expertise BTP
          </p>
          <h2 style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.cream,
            margin: 0,
            lineHeight: 1.1,
          }}>
            Ce que nous construisons
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 2,
        }}>
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                background: C.bgCard,
                padding: '40px 32px',
                borderBottom: `3px solid transparent`,
                borderLeft: `3px solid ${C.yellow}`,
                transition: 'background 0.2s',
              }}
            >
              <div style={{ marginBottom: 20 }}><TemplateIcon emoji={service.icon} size={28} color={C.yellow} /></div>
              <h3 style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                fontSize: '1.2rem',
                color: C.cream,
                margin: '0 0 12px',
              }}>
                {service.title}
              </h3>
              <p style={{
                fontFamily: FONT_BODY,
                color: C.creamDim,
                fontSize: '0.9rem',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   BUILDING CONSTRUCTION — SCROLL-DRIVEN
   ========================================================================= */

function BuildingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const NUM_FLOORS = 8
  const FLOOR_LABELS = [
    'R+7 — Terrasses & toiture',
    'R+6 — Direction générale',
    'R+5 — Open space premium',
    'R+4 — Salles de conférence',
    'R+3 — Bureaux individuels',
    'R+2 — Espaces collaboratifs',
    'R+1 — Accueil & lobby',
    'RDC — Hall d\'entrée',
  ]
  const FLOOR_COLORS = [
    '#2a3d5a', '#253658', '#1e3050', '#1a2a48',
    '#162440', '#121e38', '#0e1830', '#0a1228',
  ]

  const inViewRef = useRef<HTMLDivElement>(null)
  const sectionInView = useInView(containerRef, { once: true, margin: '-150px' })

  return (
    <section
      ref={containerRef}
      style={{
        background: C.bg,
        padding: '0 24px',
        minHeight: '180vh',
        position: 'relative',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'flex-start',
        paddingTop: 120,
      }}>
        {/* Left: Text */}
        <div style={{ position: 'sticky', top: 120, paddingBottom: 120 }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: FONT_BODY,
              color: C.yellow,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            — Notre méthode
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: C.cream,
              lineHeight: 1.1,
              margin: '0 0 32px',
            }}
          >
            Construire
            <br />
            étage par étage
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: FONT_BODY,
              color: C.creamDim,
              fontSize: '1rem',
              lineHeight: 1.8,
              margin: '0 0 40px',
            }}
          >
            Chaque projet est une montée en puissance méticuleuse.
            Fondations, structure, enveloppe, second œuvre — nous
            maîtrisons chaque phase avec une précision d&apos;ingénieur.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Études de sol & terrassement',
              'Fondations profondes & pieux',
              'Structure béton armé ou acier',
              'Charpente & couverture',
              'Façades & menuiseries extérieures',
              'Second œuvre & finitions',
              'Contrôles qualité & réception',
              'Livraison clé en main',
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={sectionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontFamily: FONT_BODY,
                  color: C.creamDim,
                  fontSize: '0.88rem',
                }}
              >
                <span style={{
                  width: 24,
                  height: 24,
                  background: C.yellow,
                  color: C.bg,
                  fontWeight: 700,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                {step}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: animated building */}
        <div style={{ paddingTop: 80, paddingBottom: 120 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 3,
            maxWidth: 380,
            margin: '0 auto',
          }}>
            {FLOOR_LABELS.map((label, i) => {
              const floorIndex = NUM_FLOORS - 1 - i
              const threshold = floorIndex / NUM_FLOORS
              return (
                <FloorUnit
                  key={label}
                  label={label}
                  color={FLOOR_COLORS[i]}
                  scrollYProgress={scrollYProgress}
                  activationThreshold={0.1 + threshold * 0.5}
                  delay={0}
                  floorNum={NUM_FLOORS - i}
                />
              )
            })}
            {/* Ground */}
            <div style={{
              height: 16,
              background: C.yellow,
              width: '100%',
            }} />
          </div>
        </div>
      </div>
    </section>
  )
}

function FloorUnit({
  label,
  color,
  scrollYProgress,
  activationThreshold,
  floorNum,
}: {
  label: string
  color: string
  scrollYProgress: any
  activationThreshold: number
  delay: number
  floorNum: number
}) {
  const [active, setActive] = useState(false)
  const prevProgress = useRef(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v: number) => {
      if (v >= activationThreshold && !active) setActive(true)
      if (v < activationThreshold - 0.05 && active) setActive(false)
      prevProgress.current = v
    })
    return unsubscribe
  }, [scrollYProgress, activationThreshold, active])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        background: color,
        border: `1px solid ${C.blueprintLight}`,
        borderLeft: `4px solid ${C.yellow}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.03) 14px, rgba(255,255,255,0.03) 15px)',
        pointerEvents: 'none',
      }} />
      <span style={{
        fontFamily: FONT_BODY,
        color: C.cream,
        fontSize: '0.8rem',
        lineHeight: 1.3,
        position: 'relative',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'monospace',
        color: C.yellow,
        fontSize: '0.75rem',
        flexShrink: 0,
        position: 'relative',
      }}>
        {`R+${floorNum - 1}`}
      </span>
    </motion.div>
  )
}

/* ==========================================================================
   STATS COUNTER
   ========================================================================= */

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        background: C.yellow,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 0,
        }}>
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={i}
              isActive={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index, isActive }: { stat: typeof STATS[0]; index: number; isActive: boolean }) {
  const count = useCounter(stat.value, isActive, 2000 + index * 200)

  const formatValue = (n: number) => {
    if (stat.formatted) return stat.formatted
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return n.toLocaleString('fr-FR')
    return n.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{
        padding: '48px 32px',
        borderRight: index < STATS.length - 1 ? `1px solid rgba(26,26,26,0.2)` : 'none',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontFamily: FONT_HEADING,
        fontWeight: 800,
        fontSize: 'clamp(3rem, 6vw, 5rem)',
        color: C.bg,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        marginBottom: 12,
      }}>
        {stat.formatted && isActive ? stat.formatted : formatValue(count)}
      </div>
      <div style={{
        fontFamily: FONT_BODY,
        fontSize: '0.85rem',
        fontWeight: 600,
        color: C.bg,
        opacity: 0.7,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {stat.label}
      </div>
    </motion.div>
  )
}

/* ==========================================================================
   MATERIALS TEXTURE GRID
   ========================================================================= */

function MaterialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        background: C.bg,
        padding: '120px 24px',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: FONT_BODY,
            color: C.yellow,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>— Nos matériaux</p>
          <h2 style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.cream,
            margin: 0,
          }}>
            La matière au service
            <br />
            de la structure
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {MATERIALS.map((mat, i) => (
            <MaterialCard key={mat.name} material={mat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MaterialCard({
  material,
  index,
  inView,
}: {
  material: typeof MATERIALS[0]
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.4 }}
      style={{
        overflow: 'hidden',
        background: C.bgCard,
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Texture swatch with clip-path wipe */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: material.gradient,
        }} />
        <motion.div
          initial={{ scaleX: 1 }}
          animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
          transition={{ delay: 0.2 + index * 0.15, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: C.bgCard,
            transformOrigin: 'right center',
          }}
        />
        {/* Dust particle overlay during reveal */}
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={inView ? { opacity: 0 } : { opacity: 0.6 }}
          transition={{ delay: 0.2 + index * 0.15, duration: 1.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(232,184,75,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Label overlay */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 16,
          right: 16,
          background: 'rgba(26,26,26,0.75)',
          backdropFilter: 'blur(4px)',
          padding: '4px 10px',
          display: 'inline-block',
        }}>
          <span style={{
            fontFamily: 'monospace',
            color: C.yellow,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            TEXTURE — {material.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '24px 24px 28px' }}>
        <h3 style={{
          fontFamily: FONT_HEADING,
          fontWeight: 700,
          fontSize: '1.1rem',
          color: C.cream,
          margin: '0 0 10px',
        }}>
          {material.name}
        </h3>
        <p style={{
          fontFamily: FONT_BODY,
          color: C.creamDim,
          fontSize: '0.87rem',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {material.desc}
        </p>
      </div>
    </motion.div>
  )
}

/* ==========================================================================
   PROJECTS TILT SHOWCASE
   ========================================================================= */

function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="projects"
      style={{
        background: C.bgLight,
        padding: '120px 24px',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: FONT_BODY,
            color: C.yellow,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>— Réalisations</p>
          <h2 style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.cream,
            margin: 0,
          }}>
            Nos projets structurants
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {PROJECTS.map((project, i) => (
            <ProjectTiltCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectTiltCard({
  project,
  index,
  inView,
}: {
  project: typeof PROJECTS[0]
  index: number
  inView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotX = ((y - centerY) / centerY) * -10
    const rotY = ((x - centerX) / centerX) * 10
    rotateX.set(rotX)
    rotateY.set(rotY)
  }, [rotateX, rotateY])

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          cursor: 'default',
          overflow: 'hidden',
        }}
      >
        {/* CSS-drawn building silhouette */}
        <div style={{
          height: 200,
          background: project.color,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 4,
          padding: '0 20px',
        }}>
          {/* Sky gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, ${project.color}aa, ${project.color})`,
          }} />

          {/* Building silhouette: main tower + side wings */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            {/* Left wing */}
            <div style={{
              width: 24,
              height: project.floors > 0 ? 80 : 40,
              background: 'rgba(0,0,0,0.4)',
              borderTop: '2px solid rgba(255,255,255,0.15)',
            }}>
              {/* Windows */}
              {Array.from({ length: Math.min(4, project.floors || 2) }).map((_, wi) => (
                <div key={wi} style={{
                  margin: '6px 4px',
                  height: 8,
                  background: 'rgba(255,255,200,0.3)',
                  borderRadius: 1,
                }} />
              ))}
            </div>
            {/* Main tower */}
            <div style={{
              width: 48,
              height: project.floors > 0 ? project.floors * 13 : 60,
              background: 'rgba(0,0,0,0.6)',
              borderTop: '3px solid rgba(255,255,255,0.2)',
              position: 'relative',
              maxHeight: 160,
            }}>
              {/* Floors grid */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridAutoRows: 13,
                gap: 2,
                padding: 4,
                overflow: 'hidden',
              }}>
                {Array.from({ length: 20 }).map((_, wi) => (
                  <div key={wi} style={{
                    background: wi % 3 === 0 ? 'rgba(255,255,200,0.5)' : 'rgba(255,255,255,0.05)',
                    borderRadius: 1,
                  }} />
                ))}
              </div>
              {/* Antenna */}
              {project.floors > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 20,
                  background: 'rgba(255,255,255,0.4)',
                }} />
              )}
            </div>
            {/* Right wing */}
            <div style={{
              width: 30,
              height: project.floors > 0 ? 60 : 45,
              background: 'rgba(0,0,0,0.45)',
              borderTop: '2px solid rgba(255,255,255,0.15)',
            }}>
              {Array.from({ length: 3 }).map((_, wi) => (
                <div key={wi} style={{
                  margin: '6px 4px',
                  height: 8,
                  background: 'rgba(255,255,200,0.25)',
                  borderRadius: 1,
                }} />
              ))}
            </div>
          </div>

          {/* Ground line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: C.yellow,
          }} />

          {/* Category badge */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(26,26,26,0.8)',
            padding: '4px 10px',
            fontFamily: FONT_BODY,
            fontSize: 10,
            color: C.yellow,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {project.category}
          </div>
        </div>

        {/* Card info */}
        <div style={{ padding: '24px 24px 28px' }}>
          <h3 style={{
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            fontSize: '1.2rem',
            color: C.cream,
            margin: '0 0 8px',
          }}>
            {project.name}
          </h3>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.creamDim }}>
              {project.location}
            </span>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.creamDim }}>
              {project.year}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${C.border}`,
            paddingTop: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: C.creamDim, marginBottom: 2 }}>SURFACE / LONGUEUR</div>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '1rem', color: C.yellow }}>
                {project.surface}
              </div>
            </div>
            {project.floors > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: C.creamDim, marginBottom: 2 }}>NIVEAUX</div>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '1rem', color: C.cream }}>
                  R+{project.floors}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ==========================================================================
   TEAM
   ========================================================================= */

function TeamSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="team"
      style={{
        background: C.bg,
        padding: '120px 24px',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: FONT_BODY,
            color: C.yellow,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>— L&apos;équipe</p>
          <h2 style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.cream,
            margin: 0,
          }}>
            Des ingénieurs
            <br />
            de terrain
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 2,
        }}>
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                background: C.bgCard,
                padding: '40px 32px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Abstract person silhouette */}
              <div style={{
                width: 64,
                height: 64,
                background: C.blueprintLight,
                borderRadius: '50%',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                color: C.cream,
                fontFamily: FONT_HEADING,
                border: `3px solid ${C.yellow}`,
              }}>
                {member.name.charAt(0)}{member.name.split(' ')[1]?.charAt(0)}
              </div>

              <h3 style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                fontSize: '1.05rem',
                color: C.cream,
                margin: '0 0 6px',
              }}>
                {member.name}
              </h3>
              <div style={{
                fontFamily: FONT_BODY,
                fontSize: '0.82rem',
                color: C.yellow,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: '0.04em',
              }}>
                {member.role}
              </div>
              <div style={{
                fontFamily: FONT_BODY,
                fontSize: '0.82rem',
                color: C.creamDim,
                lineHeight: 1.6,
                marginBottom: 20,
              }}>
                {member.spec}
              </div>

              <div style={{
                display: 'inline-block',
                background: 'rgba(232,184,75,0.12)',
                border: `1px solid ${C.yellow}`,
                padding: '4px 12px',
                fontFamily: 'monospace',
                fontSize: 11,
                color: C.yellow,
                letterSpacing: '0.08em',
              }}>
                {member.exp} d&apos;expérience
              </div>

              {/* Decorative corner */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderTop: `40px solid ${C.yellow}`,
                borderLeft: '40px solid transparent',
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   CERTIFICATIONS BAND
   ========================================================================= */

function CertBand() {
  const certs = [
    'QUALIBAT RGE', 'ISO 9001:2015', 'MASE', 'HQE Bâtiment', 'BIM niveau 2',
    'OHSAS 18001', 'Eurocodes EN', 'QUALIBAT RGE', 'ISO 9001:2015', 'MASE',
  ]
  return (
    <div style={{
      background: C.blueprint,
      padding: '20px 0',
      overflow: 'hidden',
      borderTop: `3px solid ${C.yellow}`,
    }}>
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap' }}
      >
        {certs.map((cert, i) => (
          <span
            key={`${cert}-${i}`}
            style={{
              fontFamily: 'monospace',
              color: C.cream,
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              opacity: 0.8,
              flexShrink: 0,
            }}
          >
            ◆ {cert}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ==========================================================================
   CONTACT
   ========================================================================= */

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', projectType: '', message: ''
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      ref={ref}
      id="contact"
      style={{
        background: C.bgLight,
        padding: '120px 24px',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'flex-start',
        }}>
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p style={{
              fontFamily: FONT_BODY,
              color: C.yellow,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>— Contact</p>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: C.cream,
              lineHeight: 1.1,
              margin: '0 0 32px',
            }}>
              Parlons de votre
              <br />
              <span style={{ color: C.yellow }}>prochain chantier</span>
            </h2>
            <p style={{
              fontFamily: FONT_BODY,
              color: C.creamDim,
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: 48,
            }}>
              Notre bureau d&apos;études est disponible pour analyser votre projet,
              estimer les volumes et vous proposer une approche technique adaptée.
              Premier échange sans engagement.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                { label: 'Siège social', value: '14 rue des Bâtisseurs, 69000 Lyon' },
                { label: 'Téléphone', value: '+33 4 78 XX XX XX' },
                { label: 'Email', value: 'contact@ferretti-construction.fr' },
                { label: 'Horaires', value: 'Lun–Ven : 8h–18h' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 20 }}>
                  <div style={{
                    width: 4,
                    flexShrink: 0,
                    background: C.yellow,
                    alignSelf: 'stretch',
                    marginTop: 4,
                  }} />
                  <div>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      color: C.yellow,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: FONT_BODY,
                      fontSize: '0.95rem',
                      color: C.cream,
                      lineHeight: 1.4,
                    }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: C.bgCard,
                    border: `2px solid ${C.yellow}`,
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}><TemplateIcon emoji="✅" size={48} color={C.yellow} /></div>
                  <h3 style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: C.cream,
                    margin: '0 0 12px',
                  }}>
                    Message envoyé
                  </h3>
                  <p style={{
                    fontFamily: FONT_BODY,
                    color: C.creamDim,
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    Notre bureau d&apos;études reviendra vers vous sous 24h ouvrées.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  {[
                    { name: 'name', label: 'Nom complet *', type: 'text', required: true },
                    { name: 'company', label: 'Société / Maître d\'ouvrage', type: 'text', required: false },
                    { name: 'email', label: 'Email professionnel *', type: 'email', required: true },
                    { name: 'phone', label: 'Téléphone', type: 'tel', required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{
                        display: 'block',
                        fontFamily: 'monospace',
                        fontSize: 10,
                        color: C.creamDim,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                        style={{
                          width: '100%',
                          background: C.bgCard,
                          border: `1px solid ${C.border}`,
                          borderBottom: `2px solid ${C.borderLight}`,
                          padding: '14px 16px',
                          color: C.cream,
                          fontFamily: FONT_BODY,
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'monospace',
                      fontSize: 10,
                      color: C.creamDim,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}>
                      Type de projet
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                      style={{
                        width: '100%',
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderBottom: `2px solid ${C.borderLight}`,
                        padding: '14px 16px',
                        color: formData.projectType ? C.cream : C.creamDim,
                        fontFamily: FONT_BODY,
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Sélectionnez un type</option>
                      <option>Gros œuvre</option>
                      <option>Infrastructure / Ouvrage d&apos;art</option>
                      <option>Immobilier d&apos;entreprise</option>
                      <option>Maîtrise d&apos;œuvre complète</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'monospace',
                      fontSize: 10,
                      color: C.creamDim,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}>
                      Description du projet *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Localisation, surface, calendrier estimé, contraintes particulières..."
                      style={{
                        width: '100%',
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderBottom: `2px solid ${C.borderLight}`,
                        padding: '14px 16px',
                        color: C.cream,
                        fontFamily: FONT_BODY,
                        fontSize: '0.95rem',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: C.yellow,
                      color: C.bg,
                      border: 'none',
                      padding: '18px 32px',
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: '1rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      marginTop: 8,
                      transition: 'background 0.2s',
                    }}
                  >
                    Envoyer la demande →
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
  return (
    <footer style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: '48px 24px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: '1.2rem',
            color: C.cream,
            marginBottom: 6,
          }}>
            FERRETTI <span style={{ color: C.yellow }}>CONSTRUCTION</span>
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: C.creamDim,
            letterSpacing: '0.08em',
          }}>
            Entreprise générale de BTP — Fondée en 1986 — Lyon, France
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'Services', href: '#services' },
            { label: 'Projets', href: '#projects' },
            { label: 'Équipe', href: '#team' },
            { label: 'Contact', href: '#contact' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: FONT_BODY,
                fontSize: '0.85rem',
                color: C.creamDim,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: C.creamDim,
          opacity: 0.5,
        }}>
          © 2024 Ferretti Construction. SIRET 123 456 789 00010
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   NAV
   ========================================================================= */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(26,26,26,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.3s, border 0.3s, backdrop-filter 0.3s',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <a href="#hero" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: '1.1rem',
          color: C.cream,
          letterSpacing: '-0.02em',
        }}>
          FERRETTI <span style={{ color: C.yellow }}>▲</span>
        </div>
      </a>

      {/* Desktop links */}
      <div style={{
        display: 'flex',
        gap: 36,
        alignItems: 'center',
      }}>
        {[
          { label: 'Services', href: '#services' },
          { label: 'Projets', href: '#projects' },
          { label: 'Équipe', href: '#team' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: FONT_BODY,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: C.creamDim,
              textDecoration: 'none',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: C.bg,
            background: C.yellow,
            padding: '10px 22px',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Nous contacter
        </a>
      </div>
    </motion.nav>
  )
}

/* ==========================================================================
   PAGE ROOT
   ========================================================================= */

export default function Page() {
  return (
    <main style={{ background: C.bg, overflowX: 'hidden' }}>
      <Nav />
      <BlueprintHero />
      <ServicesSection />
      <BuildingSection />
      <StatsSection />
      <MaterialsSection />
      <ProjectsSection />
      <TeamSection />
      <CertBand />
      <ContactSection />
      <Footer />
    </main>
  )
}
