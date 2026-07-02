"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion'
import { TemplateIcon } from '@/components/TemplateIcon'
import { MapPin } from 'lucide-react'

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const BG = '#faf8f5'
const DARK = '#1a1209'
const GOLD = brand ?? '#b8965a'
const GOLD_LIGHT = '#d4af7a'
const GOLD_PALE = '#f0e6d3'
const ROSE = '#c9a0a0'
const GRAY_MID = '#6b6055'
const GRAY_LIGHT = '#e8e2d9'

const headingFont: React.CSSProperties = {
  fontFamily: '"Cormorant Garamond", "Georgia", serif',
  fontStyle: 'italic',
}
const bodyFont: React.CSSProperties = {
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 300,
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Service {
  name: string
  nameEn: string
  description: string
  price: string
  duration: string
}

interface Stylist {
  name: string
  title: string
  specialty: string
  color: string
  bio: string
  years: number
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  {
    name: 'Coupe & Brushing',
    nameEn: 'Cut & Blowdry',
    description: 'Diagnostic personnalisé, coupe sur-mesure adaptée à votre morphologie et style de vie.',
    price: 'À partir de 85 €',
    duration: '60 min',
  },
  {
    name: 'Coloration',
    nameEn: 'Colour',
    description: 'Coloration végétale ou chimique, nuances profondes, couverture du gris parfaite.',
    price: 'À partir de 110 €',
    duration: '90 min',
  },
  {
    name: 'Balayage & Mèches',
    nameEn: 'Highlights',
    description: 'Technique main levée pour un effet soleil naturel ou des contrastes marqués.',
    price: 'À partir de 145 €',
    duration: '120 min',
  },
  {
    name: 'Lissage Brésilien',
    nameEn: 'Brazilian Blowout',
    description: 'Traitement kératine longue durée. Cheveux lisses, brillants et sans frisottis.',
    price: 'À partir de 200 €',
    duration: '180 min',
  },
  {
    name: 'Soin Signature',
    nameEn: 'Signature Treatment',
    description: "Masque reconstituant, massage crânien rituel et sérum précieux à l\'huile d\'argan.",
    price: 'À partir de 65 €',
    duration: '45 min',
  },
]

const STYLISTS: Stylist[] = [
  {
    name: 'Camille Rousseau',
    title: 'Directrice Artistique',
    specialty: 'Balayage & Colorimétrie',
    color: '#c9a0a0',
    bio: "Formée à l\'École Nationale Supérieure de Coiffure, Camille a perfectionné son art chez Dessange à Paris avant de fonder L\'Atelier. Sa signature : des couleurs qui semblent nées du soleil.",
    years: 15,
  },
  {
    name: 'Hugo Leroi',
    title: 'Coiffeur Senior',
    specialty: 'Coupes Architecturales',
    color: '#8fa8c8',
    bio: 'Diplômé des Meilleurs Ouvriers de France, Hugo sculpte les cheveux avec une précision chirurgicale. Il excelle dans les coupes géométriques et les bobs ultra-précis.',
    years: 11,
  },
  {
    name: 'Yasmine Benali',
    title: 'Spécialiste Soin',
    specialty: 'Traitements & Lissage',
    color: '#b8a8c8',
    bio: "Passionnée par la santé du cheveu, Yasmine conçoit des protocoles de soin personnalisés. Experte en kératine et rituels capillaires d\'origine naturelle.",
    years: 8,
  },
  {
    name: 'Antoine Moreau',
    title: 'Coiffeur Styliste',
    specialty: 'Coupe Homme & Tendances',
    color: '#a8c8b8',
    bio: 'Issu de la mode, Antoine apporte un œil de styliste à chaque rendez-vous. Spécialiste des coupes tendance homme et des looks éditoriaux femme.',
    years: 7,
  },
]

const BOOKING_STEPS = ['Service', 'Date & Heure', 'Styliste', 'Confirmation']

// ─── Sub-components ────────────────────────────────────────────────────────────

// Scissor Blade component
function ScissorBlade({ top, initial, animate }: { top: boolean; initial: number; animate: number }) {
  return (
    <motion.div
      initial={{ rotateZ: initial, transformOrigin: top ? '50% 100%' : '50% 0%' }}
      animate={{ rotateZ: animate }}
      transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: 'absolute',
        left: '50%',
        width: '60px',
        height: '180px',
        marginLeft: '-30px',
        top: top ? undefined : '50%',
        bottom: top ? '50%' : undefined,
        background: `linear-gradient(${top ? '180deg' : '0deg'}, ${GOLD}, ${GOLD_LIGHT})`,
        borderRadius: top ? '30px 30px 0 0' : '0 0 30px 30px',
        boxShadow: `0 0 20px rgba(184,150,90,0.4)`,
      }}
    />
  )
}

// Gold line divider
function GoldDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${GOLD})` }} />
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD }} />
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${GOLD})` }} />
    </div>
  )
}

// Service Card with scroll reveal
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        padding: '32px',
        background: '#fff',
        border: `1px solid ${GRAY_LIGHT}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Gold accent line drawing in */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: `linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT})`,
          transformOrigin: 'left center',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ ...headingFont, fontSize: '24px', color: DARK, margin: 0, letterSpacing: '0.02em' }}>
            {service.name}
          </h3>
          <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '4px 0 0' }}>
            {service.nameEn}
          </p>
        </div>
        <span style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, background: GOLD_PALE, padding: '4px 10px', borderRadius: '20px' }}>
          {service.duration}
        </span>
      </div>

      <p style={{ ...bodyFont, fontSize: '14px', color: GRAY_MID, lineHeight: 1.7, margin: '0 0 20px' }}>
        {service.description}
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
        style={{ ...headingFont, fontSize: '20px', color: GOLD, margin: 0 }}
      >
        {service.price}
      </motion.p>
    </motion.div>
  )
}

// Stylist Card with hover bio
function StylistCard({ stylist }: { stylist: Stylist }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 24px' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: stylist.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${GOLD}`,
            boxShadow: `0 0 0 6px ${GOLD_PALE}`,
            fontSize: '32px',
            fontWeight: 300,
            color: '#fff',
            ...headingFont,
          }}
        >
          {stylist.name.charAt(0)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ ...headingFont, fontSize: '22px', color: DARK, margin: '0 0 4px', letterSpacing: '0.02em' }}>
            {stylist.name}
          </h4>
          <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            {stylist.title}
          </p>
          <span style={{
            ...bodyFont,
            fontSize: '11px',
            color: GRAY_MID,
            background: GOLD_PALE,
            padding: '4px 12px',
            borderRadius: '20px',
            display: 'inline-block',
          }}>
            {stylist.specialty}
          </span>
        </div>
      </div>

      {/* Bio panel — AnimatePresence slide up */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="bio"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: DARK,
              color: '#fff',
              padding: '28px 24px',
              zIndex: 10,
              borderTop: `2px solid ${GOLD}`,
            }}
          >
            <p style={{ ...bodyFont, fontSize: '13px', lineHeight: 1.75, color: GRAY_LIGHT, margin: '0 0 16px' }}>
              {stylist.bio}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '1px', background: GOLD }} />
              <span style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.1em' }}>
                {stylist.years} ans d'expérience
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Before/After Slider
function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5) // 0–1 normalized
  const [containerWidth, setContainerWidth] = useState(600)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const dividerX = useTransform(x, (v) => v * containerWidth)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const relX = (e.clientX - rect.left) / rect.width
      x.set(Math.max(0.05, Math.min(0.95, relX)))
    },
    [isDragging, x]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const touch = e.touches[0]
      const relX = (touch.clientX - rect.left) / rect.width
      x.set(Math.max(0.05, Math.min(0.95, relX)))
    },
    [x]
  )

  const clipWidth = useTransform(dividerX, (v) => `${v}px`)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        borderRadius: '2px',
        boxShadow: '0 20px 60px rgba(26,18,9,0.15)',
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* AFTER side — blonde/gold (background) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, #d4b896 0%, #e8d5b7 30%, #c9a96e 60%, #b8965a 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span style={{ ...headingFont, fontSize: '52px', color: 'rgba(26,18,9,0.3)', letterSpacing: '0.1em' }}>Après</span>
        <div style={{ width: '60px', height: '2px', background: 'rgba(26,18,9,0.2)' }} />
        <span style={{ ...bodyFont, fontSize: '12px', color: 'rgba(26,18,9,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Balayage Doré</span>
        {/* Simulated hair strands — After */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: `${(i / 18) * 100}%`,
              width: '2px',
              height: '100%',
              background: `linear-gradient(180deg, transparent 0%, rgba(200,160,90,${0.15 + (i % 3) * 0.08}) 30%, rgba(230,190,120,${0.2 + (i % 4) * 0.07}) 60%, transparent 100%)`,
              transform: `rotate(${(i % 5 - 2) * 1.5}deg)`,
            }}
          />
        ))}
      </div>

      {/* BEFORE side — brunette (clipped overlay) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          width: clipWidth,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${containerWidth}px`,
            background: `linear-gradient(135deg, #2d2420 0%, #3d3028 30%, #4a3a2e 60%, #3a2e24 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <span style={{ ...headingFont, fontSize: '52px', color: 'rgba(250,248,245,0.3)', letterSpacing: '0.1em' }}>Avant</span>
          <div style={{ width: '60px', height: '2px', background: 'rgba(250,248,245,0.2)' }} />
          <span style={{ ...bodyFont, fontSize: '12px', color: 'rgba(250,248,245,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Cheveux Naturels</span>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: `${(i / 18) * 100}%`,
                width: '2px',
                height: '100%',
                background: `linear-gradient(180deg, transparent 0%, rgba(80,55,35,${0.2 + (i % 3) * 0.1}) 30%, rgba(60,40,25,${0.25 + (i % 4) * 0.08}) 60%, transparent 100%)`,
                transform: `rotate(${(i % 5 - 2) * 1.5}deg)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Divider line */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: dividerX,
          width: '2px',
          height: '100%',
          background: `linear-gradient(180deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
          transform: 'translateX(-1px)',
          zIndex: 20,
          boxShadow: `0 0 12px rgba(184,150,90,0.8)`,
        }}
      />

      {/* Drag handle */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: dividerX,
          transform: 'translate(-50%, -50%)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: GOLD,
          border: `2px solid #fff`,
          zIndex: 21,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px rgba(184,150,90,0.5)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '0', height: '0', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: `6px solid #fff` }} />
          <div style={{ width: '0', height: '0', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `6px solid #fff` }} />
        </div>
      </motion.div>

      {/* Labels */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 15 }}>
        <span style={{ ...bodyFont, fontSize: '11px', color: 'rgba(250,248,245,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(26,18,9,0.4)', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
          Avant
        </span>
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 15 }}>
        <span style={{ ...bodyFont, fontSize: '11px', color: 'rgba(26,18,9,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(250,248,245,0.5)', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
          Après
        </span>
      </div>
    </div>
  )
}

// Multi-step Booking Form
function BookingForm() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, BOOKING_STEPS.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
  }, [])

  const times = ['10:00', '11:00', '11:30', '14:00', '15:00', '16:30', '17:00']

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const inputStyle: React.CSSProperties = {
    ...bodyFont,
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${GRAY_LIGHT}`,
    background: '#fff',
    fontSize: '14px',
    color: DARK,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    ...bodyFont,
    padding: '12px 20px',
    border: `1px solid ${active ? GOLD : GRAY_LIGHT}`,
    background: active ? GOLD_PALE : '#fff',
    color: active ? DARK : GRAY_MID,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    textAlign: 'left' as const,
    letterSpacing: '0.01em',
  })

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ textAlign: 'center', padding: '60px 40px' }}
      >
        <div style={{
          width: "64px', height: '64px', borderRadius: '50%",
          background: GOLD_PALE, border: `2px solid ${GOLD}`,
          display: "flex', alignItems: 'center', justifyContent: 'center",
          margin: '0 auto 24px',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7L23 7" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{ ...headingFont, fontSize: '32px', color: DARK, margin: '0 0 12px' }}>
          Rendez-vous Confirmé
        </h3>
        <p style={{ ...bodyFont, fontSize: '14px', color: GRAY_MID, lineHeight: 1.7, maxWidth: '360px', margin: '0 auto' }}>
          Nous avons bien reçu votre demande. Un email de confirmation vous sera envoyé dans les prochaines minutes.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Step progress */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '40px' }}>
        {BOOKING_STEPS.map((label, i) => (
          <div
            key={label}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  flex: 1, height: '1px',
                  background: i <= step ? GOLD : GRAY_LIGHT,
                  transition: 'background 0.4s',
                }} />
              )}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: i < step ? GOLD : i === step ? DARK : '#fff',
                border: `2px solid ${i <= step ? GOLD : GRAY_LIGHT}`,
                display: "flex', alignItems: 'center', justifyContent: 'center",
                transition: 'all 0.3s',
                zIndex: 1,
              }}>
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ ...bodyFont, fontSize: '11px', color: i === step ? '#fff' : GRAY_MID }}>
                    {i + 1}
                  </span>
                )}
              </div>
              {i < BOOKING_STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: '1px',
                  background: i < step ? GOLD : GRAY_LIGHT,
                  transition: 'background 0.4s',
                }} />
              )}
            </div>
            <span style={{ ...bodyFont, fontSize: '11px', color: i === step ? GOLD : GRAY_MID, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '280px' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Step 0 — Service */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ ...headingFont, fontSize: '22px', color: DARK, margin: '0 0 16px', fontStyle: 'italic' }}>
                  Quel soin souhaitez-vous ?
                </p>
                {SERVICES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedService(s.name)}
                    style={chipStyle(selectedService === s.name)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ display: 'block', fontWeight: 400 }}>{s.name}</span>
                        <span style={{ fontSize: '12px', color: GOLD }}>{s.price}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: GRAY_MID }}>{s.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1 — Date & Time */}
            {step === 1 && (
              <div>
                <p style={{ ...headingFont, fontSize: '22px', color: DARK, margin: '0 0 20px', fontStyle: 'italic' }}>
                  Choisissez votre créneau
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                    Heure
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        style={{
                          ...bodyFont,
                          padding: '10px 16px',
                          border: `1px solid ${selectedTime === t ? GOLD : GRAY_LIGHT}`,
                          background: selectedTime === t ? GOLD_PALE : '#fff',
                          color: selectedTime === t ? DARK : GRAY_MID,
                          cursor: 'pointer',
                          fontSize: '13px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Stylist */}
            {step === 2 && (
              <div>
                <p style={{ ...headingFont, fontSize: '22px', color: DARK, margin: '0 0 20px', fontStyle: 'italic' }}>
                  Votre styliste
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedStylist('any')}
                    style={chipStyle(selectedStylist === 'any')}
                  >
                    <span style={{ fontWeight: 400 }}>Aucune préférence — disponibilité optimale</span>
                  </button>
                  {STYLISTS.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedStylist(s.name)}
                      style={chipStyle(selectedStylist === s.name)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', ...headingFont, fontSize: '16px', flexShrink: 0 }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <span style={{ display: 'block', fontWeight: 400 }}>{s.name}</span>
                          <span style={{ fontSize: '12px', color: GOLD }}>{s.specialty}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <div>
                <p style={{ ...headingFont, fontSize: '22px', color: DARK, margin: '0 0 20px', fontStyle: 'italic' }}>
                  Vos coordonnées
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Prénom</label>
                      <input type="text" placeholder="Marie" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Nom</label>
                      <input type="text" placeholder="Dupont" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email</label>
                    <input type="email" placeholder="marie@exemple.fr" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Téléphone</label>
                    <input type="tel" placeholder="+33 6 12 34 56 78" style={inputStyle} />
                  </div>

                  {/* Summary */}
                  {(selectedService || selectedDate || selectedStylist) && (
                    <div style={{ background: GOLD_PALE, padding: '20px', border: `1px solid ${GOLD}`, marginTop: '8px' }}>
                      <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>Récapitulatif</p>
                      {selectedService && <p style={{ ...bodyFont, fontSize: '14px', color: DARK, margin: '0 0 6px' }}><strong>Service :</strong> {selectedService}</p>}
                      {selectedDate && <p style={{ ...bodyFont, fontSize: '14px', color: DARK, margin: '0 0 6px' }}><strong>Date :</strong> {selectedDate}{selectedTime && ` à ${selectedTime}`}</p>}
                      {selectedStylist && <p style={{ ...bodyFont, fontSize: '14px', color: DARK, margin: 0 }}><strong>Styliste :</strong> {selectedStylist === 'any' ? 'Aucune préférence' : selectedStylist}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${GRAY_LIGHT}` }}>
        {step > 0 ? (
          <button
            onClick={goPrev}
            style={{ ...bodyFont, padding: '14px 28px', border: `1px solid ${GRAY_LIGHT}`, background: 'transparent', color: GRAY_MID, cursor: 'pointer', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            ← Retour
          </button>
        ) : <div />}

        {step < BOOKING_STEPS.length - 1 ? (
          <button
            onClick={goNext}
            style={{ ...bodyFont, padding: '14px 36px', border: 'none', background: DARK, color: '#fff', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Continuer →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{ ...bodyFont, padding: '14px 36px', border: 'none', background: GOLD, color: '#fff', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Confirmer le Rendez-vous
          </button>
        )}
      </div>
    </div>
  )
}

// Gallery Grid Tile
function GalleryTile({ index }: { index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  const palettes = [
    { bg: '#2d2420', accent: brand ?? '#b8965a', label: 'Balayage Cuivré' },
    { bg: '#d4b896', accent: '#1a1209', label: 'Blond Platine' },
    { bg: '#3a2e24', accent: '#d4af7a', label: 'Châtain Profond' },
    { bg: '#c9a0a0', accent: '#fff', label: 'Couleur Rose' },
    { bg: '#1a1a2e', accent: brand ?? '#b8965a', label: 'Noir Bleuté' },
    { bg: '#e8d5b7', accent: '#6b4c2a', label: 'Caramel Glacé' },
  ]

  const p = palettes[index % palettes.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: (index % 6) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: index % 3 === 0 ? '3/4' : '4/3',
        cursor: 'pointer',
        background: p.bg,
      }}
    >
      {/* Simulated hair texture */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${(i / 12) * 100}%`,
            width: '3px',
            height: '100%',
            background: `linear-gradient(180deg, transparent 0%, ${p.accent}33 40%, ${p.accent}55 60%, transparent 100%)`,
            transform: `rotate(${(i % 5 - 2) * 2}deg)`,
            opacity: 0.7,
          }}
        />
      ))}

      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 16px 16px',
          background: 'linear-gradient(transparent, rgba(26,18,9,0.85))',
          zIndex: 2,
        }}
      >
        <span style={{ ...bodyFont, fontSize: '11px', color: GOLD_LIGHT, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {p.label}
        </span>
      </motion.div>
    </motion.div>
  )
}

// Section heading with scroll reveal
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ textAlign: 'center', marginBottom: '60px' }}
    >
      <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
        {eyebrow}
      </p>
      <h2 style={{ ...headingFont, fontSize: 'clamp(36px, 5vw, 56px)', color: DARK, margin: '0 0 20px', fontWeight: 400, lineHeight: 1.1, letterSpacing: '0.02em' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ ...bodyFont, fontSize: '15px', color: GRAY_MID, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
      <GoldDivider />
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Page() {
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

  const [scissorOpen, setScissorOpen] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Trigger scissor open on mount
    const t1 = setTimeout(() => setScissorOpen(true), 100)
    const t2 = setTimeout(() => setTitleVisible(true), 900)
    
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
return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = ['Services', 'Avant/Après', 'Équipe', 'Galerie', 'Réservation']

  return (
    <div style={{ background: BG, color: DARK, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── NAVIGATION ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 40px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(250,248,245,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${GRAY_LIGHT}` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <div>
          <span style={{ ...headingFont, fontSize: '20px', color: DARK, letterSpacing: '0.06em' }}>
            L'Atelier
          </span>
          <span style={{ ...bodyFont, fontSize: '9px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginTop: '-2px' }}>
            Coiffure & Beauté
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace('/', '').replace('é', 'e').replace('è', 'e').replace('î', 'i').replace('À', 'a')}`}
              style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = GRAY_MID)}
            >
              {link}
            </a>
          ))}
          <a
            href="#reservation"
            style={{
              ...bodyFont,
              fontSize: '11px',
              color: '#fff',
              background: DARK,
              padding: '10px 22px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Réserver
          </a>
        </div>
      </motion.nav>

      {/* ── HERO — SCISSOR REVEAL ───────────────────────────────────────────── */}
      <section id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${BG} 0%, #f0e8da 50%, #ede3d4 100%)`,
        }}
      >
        {/* Background decorative lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + i * 12}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              background: `linear-gradient(180deg, transparent, rgba(184,150,90,${0.03 + i * 0.01}), transparent)`,
              transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
            }}
          />
        ))}

        {/* Scissor animation container */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          {/* Top blade */}
          <motion.div
            initial={{ rotateZ: -45 }}
            animate={{ rotateZ: scissorOpen ? 0 : -45 }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              transformOrigin: '50% 100%',
              position: 'absolute',
              left: '50%',
              bottom: '50%',
              marginLeft: '-25px',
              width: '50px',
              height: '160px',
              background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
              borderRadius: '25px 25px 0 0',
              boxShadow: `0 -8px 30px rgba(184,150,90,0.3)`,
              zIndex: 11,
            }}
          />
          {/* Bottom blade */}
          <motion.div
            initial={{ rotateZ: 45 }}
            animate={{ rotateZ: scissorOpen ? 0 : 45 }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              transformOrigin: '50% 0%',
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: '-25px',
              width: '50px',
              height: '160px',
              background: `linear-gradient(0deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
              borderRadius: '0 0 25px 25px',
              boxShadow: `0 8px 30px rgba(184,150,90,0.3)`,
              zIndex: 11,
            }}
          />
          {/* Pivot point */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: DARK,
              border: `2px solid ${GOLD}`,
              zIndex: 12,
            }}
          />
        </div>

        {/* Hero content */}
        <div style={{ textAlign: 'center', zIndex: 5, padding: '0 40px', maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={titleVisible ? { opacity: 1, letterSpacing: '0.1em' } : {}}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              style={{
                ...headingFont,
                fontSize: 'clamp(52px, 9vw, 110px)',
                color: DARK,
                margin: '0 0 8px',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '0.1em',
              }}
            >{c?.heroHeadline ?? <>
              L'ART DU
            </>}</h1>
            <h1
              style={{
                ...headingFont,
                fontSize: 'clamp(52px, 9vw, 110px)',
                color: GOLD,
                margin: '0',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '0.1em',
              }}
            >
              CHEVEU
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <GoldDivider />
            <p style={{ ...bodyFont, fontSize: '15px', color: GRAY_MID, lineHeight: 1.8, maxWidth: '460px', margin: '0 auto 40px', letterSpacing: '0.02em' }}>{c?.heroSubline ?? fd?.tagline ?? <>
              Un salon d'exception au cœur de Paris. Chaque rendez-vous est une rencontre entre votre personnalité et l'expertise de nos artisans coiffeurs.
            </>}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <a
                href="#reservation"
                style={{
                  ...bodyFont,
                  fontSize: '12px',
                  color: '#fff',
                  background: DARK,
                  padding: '16px 40px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
              >
                Prendre Rendez-vous
              </a>
              <a
                href="#services"
                style={{
                  ...bodyFont,
                  fontSize: '12px',
                  color: GOLD,
                  background: 'transparent',
                  padding: '16px 40px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-block',
                  border: `1px solid ${GOLD}`,
                  transition: 'all 0.2s',
                }}
              >
                Nos Services
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ ...bodyFont, fontSize: '10px', color: GRAY_MID, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Défiler</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '32px', background: `linear-gradient(180deg, ${GOLD}, transparent)` }}
          />
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={titleVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            position: 'absolute',
            right: '60px',
            top: '50%',
            transform: 'translateY(-50%)',
            textAlign: 'center',
            padding: '24px 20px',
            border: `1px solid ${GOLD}`,
            background: 'rgba(250,248,245,0.8)',
          }}
        >
          <span style={{ ...headingFont, fontSize: '36px', color: GOLD, display: 'block' }}>15</span>
          <span style={{ ...bodyFont, fontSize: '10px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>Ans d'Excellence</span>
          <div style={{ width: '30px', height: '1px', background: GOLD, margin: '8px auto' }} />
          <span style={{ ...bodyFont, fontSize: '10px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>Paris VII</span>
        </motion.div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: '120px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHeading
          eyebrow="Notre Expertise"
          title="Prestations sur Mesure"
          subtitle="Chaque soin est pensé comme un rituel. Nos tarifs incluent le diagnostic, le soin, et le brushing de finition."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2px', background: GRAY_LIGHT }}>
          {SERVICES.map((service, i) => (
            <div key={service.name} style={{ background: BG }}>
              <ServiceCard service={service} index={i} />
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ ...bodyFont, fontSize: '12px', color: GRAY_MID, textAlign: 'center', marginTop: '32px', fontStyle: 'italic' }}
        >
          * Tarifs définitifs établis lors du diagnostic. TVA 20% incluse.
        </motion.p>
      </section>

      {/* ── BEFORE / AFTER ──────────────────────────────────────────────────── */}
      <section
        id="avantapres"
        style={{
          padding: '120px 40px',
          background: DARK,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              La Transformation
            </p>
            <h2 style={{ ...headingFont, fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', margin: '0 0 20px', fontWeight: 400, letterSpacing: '0.02em' }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              Avant & Après
            </>}</h2>
            <p style={{ ...bodyFont, fontSize: '15px', color: GRAY_LIGHT, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>{c?.aboutText ?? <>
              Faites glisser le curseur pour découvrir la métamorphose. Balayage soleil réalisé par Camille Rousseau.
            </>}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0', justifyContent: 'center' }}>
              <div style={{ flex: 1, maxWidth: '160px', height: '1px', background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD }} />
              <div style={{ flex: 1, maxWidth: '160px', height: '1px', background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BeforeAfterSlider />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ ...bodyFont, fontSize: '12px', color: GRAY_MID, textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}
          >
            Glissez le curseur pour comparer · Résultats individuels peuvent varier
          </motion.p>
        </div>
      </section>

      {/* ── PHILOSOPHY ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 40px', background: GOLD_PALE }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Notre Philosophie
            </p>
            <h2 style={{ ...headingFont, fontSize: '44px', color: DARK, margin: '0 0 24px', fontWeight: 400, lineHeight: 1.15 }}>
              Le Cheveu comme<br />Matière Première
            </h2>
            <GoldDivider />
            <p style={{ ...bodyFont, fontSize: '14px', color: GRAY_MID, lineHeight: 1.8, margin: '0 0 20px' }}>
              Chez L'Atelier, nous concevons chaque rendez-vous comme une commande d'atelier. Pas de formules standard, pas de routines imposées. Seulement un dialogue entre votre cheveu et les mains de nos artisans.
            </p>
            <p style={{ ...bodyFont, fontSize: '14px', color: GRAY_MID, lineHeight: 1.8 }}>
              Nous sélectionnons rigoureusement nos produits — Kérastase Couture Styling, L'Oréal Professionnel INOA pour la coloration sans ammoniaque, et des soins développés avec des laboratoires indépendants.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { num: '98%', label: 'Satisfaction client', desc: 'Selon nos enquêtes post-rendez-vous' },
                { num: '4.9', label: 'Note Google', desc: 'Sur 847 avis vérifiés' },
                { num: '0', label: 'Ammoniaque', desc: 'Dans nos gammes coloration' },
              ].map((stat) => (
                <div key={stat.num} style={{ padding: '24px', background: '#fff', borderLeft: `3px solid ${GOLD}`, display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span style={{ ...headingFont, fontSize: '42px', color: GOLD, flexShrink: 0 }}>{stat.num}</span>
                  <div>
                    <p style={{ ...bodyFont, fontSize: '13px', color: DARK, fontWeight: 400, margin: '0 0 4px' }}>{stat.label}</p>
                    <p style={{ ...bodyFont, fontSize: '12px', color: GRAY_MID, margin: 0 }}>{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────────── */}
      <section id="equipe" style={{ padding: '120px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHeading
          eyebrow="L'Équipe"
          title="Nos Artisans Coiffeurs"
          subtitle="Des professionnels passionnés, formés dans les plus grandes maisons parisiennes."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px', background: GRAY_LIGHT }}>
          {STYLISTS.map((stylist) => (
            <div key={stylist.name} style={{ background: BG, position: 'relative', overflow: 'hidden', minHeight: '340px' }}>
              <StylistCard stylist={stylist} />
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────────────────────── */}
      <section id="galerie" style={{ padding: '120px 40px', background: DARK }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              Galerie
            </p>
            <h2 style={{ ...headingFont, fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', margin: '0', fontWeight: 400, letterSpacing: '0.02em' }}>
              L'Atelier en Images
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <GalleryTile key={i} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: '120px 40px', background: BG }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ce que disent nos clientes"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Sophie M.', text: 'Le meilleur balayage que j\'aie jamais eu. Camille a su exactement ce que je voulais sans que j\'aie à l\'expliquer deux fois. Je reviens depuis 4 ans.', rating: 5 },
              { name: 'Clara R.', text: 'L\'ambiance est feutrée et luxueuse, le café offert, et Hugo m\'a donné une coupe qui a changé ma vie. Je ne vais nulle part ailleurs.', rating: 5 },
              { name: 'Amira K.', text: 'Yasmine est une magicienne. Mon lissage tient 6 mois et mes cheveux sont en meilleure santé qu\'avant le traitement. Incroyable.', rating: 5 },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ padding: '32px', background: '#fff', border: `1px solid ${GRAY_LIGHT}`, position: 'relative' }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill={GOLD}>
                      <path d="M7 1l1.5 4h4.5l-3.5 2.5 1.5 4L7 9 3 11.5 4.5 7.5 1 5h4.5z" />
                    </svg>
                  ))}
                </div>
                <p style={{ ...bodyFont, fontSize: '14px', color: GRAY_MID, lineHeight: 1.75, margin: '0 0 20px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: GOLD_PALE, border: `1px solid ${GOLD}` }} />
                  <span style={{ ...bodyFont, fontSize: '13px', color: DARK, fontWeight: 400 }}>{t.name}</span>
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <span style={{ ...headingFont, fontSize: '48px', color: GOLD_PALE, lineHeight: 1 }}>"</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ────────────────────────────────────────────────────── */}
      <section id="reservation" style={{ padding: '120px 40px', background: GOLD_PALE }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Rendez-vous"
            title="Réservez votre Séance"
            subtitle="Réservation en ligne sécurisée. Confirmation par email sous 2 heures."
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: '#fff',
              padding: '48px',
              border: `1px solid ${GRAY_LIGHT}`,
              boxShadow: '0 20px 60px rgba(26,18,9,0.08)',
            }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '120px 40px', background: DARK }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '72px' }}
          >
            <p style={{ ...bodyFont, fontSize: '11px', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              Nous Trouver
            </p>
            <h2 style={{ ...headingFont, fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', margin: '0', fontWeight: 400 }}>
              L'Atelier
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            {[
              { icon: '📍', label: 'Adresse', lines: ['14 rue de Varenne', '75007 Paris'] },
              { icon: '📞', label: 'Téléphone', lines: ['+33 1 42 22 33 44'] },
              { icon: '✉️', label: 'Email', lines: ['contact@latelier-coiffure.fr'] },
              { icon: '🕐', label: 'Horaires', lines: ['Mar–Sam : 9h – 19h', 'Dim–Lun : Fermé'] },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ marginBottom: '12px' }}><TemplateIcon emoji={item.icon} size={28} /></div>
                <p style={{ ...bodyFont, fontSize: '10px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  {item.label}
                </p>
                {item.lines.map((line) => (
                  <p key={line} style={{ ...bodyFont, fontSize: '14px', color: GRAY_LIGHT, margin: '0 0 4px', lineHeight: 1.6 }}>
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              width: '100%',
              height: '280px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(184,150,90,0.2)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: GOLD_PALE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin style={{ width: 20, height: 20 }} />
            </div>
            <p style={{ ...bodyFont, fontSize: '12px', color: GRAY_MID, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              14 rue de Varenne, Paris 7e
            </p>
            <p style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, margin: 0, opacity: 0.6 }}>
              Métro Varenne (ligne 13) · Bus 69, 87
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ padding: '48px 40px', background: '#0f0a05', borderTop: `1px solid rgba(184,150,90,0.15)` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '20px' }}>
          <div>
            <span style={{ ...headingFont, fontSize: '22px', color: '#fff' }}>L'Atelier</span>
            <p style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, margin: '4px 0 0', letterSpacing: '0.1em' }}>
              Coiffure & Beauté · Paris VII
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Instagram', 'Pinterest', 'Facebook'].map((social) => (
              <a
                key={social}
                href={
                  social === 'Instagram'
                    ? 'https://instagram.com'
                    : social === 'Pinterest'
                    ? 'https://pinterest.com'
                    : 'https://facebook.com'
                }
                style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = GRAY_MID)}
              >
                {social}
              </a>
            ))}
          </div>
          <p style={{ ...bodyFont, fontSize: '11px', color: GRAY_MID, margin: 0 }}>
            © 2024 L'Atelier Coiffure · Mentions légales · Politique de confidentialité
          </p>
        </div>
      </footer>
    </div>
  )
}
