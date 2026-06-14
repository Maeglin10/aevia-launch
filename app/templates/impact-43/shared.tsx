"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const C = {
  sage: "#6b8f71",
  sageDark: "#4d6e52",
  sageLight: "#8fac94",
  forest: "#f0f5f1",
  cream: "#fdfbf7",
  gold: "#c9a855",
  goldLight: "#e2c97e",
  goldDark: "#a8882e",
  charcoal: "#2c3028",
  mist: "#e8ede9",
  white: "#ffffff",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'Inter', -apple-system, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Experiences", href: "/templates/impact-43/experiences" },
  { label: "Circuit", href: "/templates/impact-43/circuit" },
  { label: "Packages", href: "/templates/impact-43/packages" },
  { label: "Philosophy", href: "/templates/impact-43/philosophy" },
  { label: "Team", href: "/templates/impact-43/team" },
  { label: "Contact", href: "/templates/impact-43/contact" },
];

export const EXPERIENCES = [
  {
    title: "Alpine Stone Ritual",
    subtitle: "90 min",
    description: "Volcanic basalt stones, heated to 56°C, melt deep tension held in muscle and fascia. An ancient practice, refined.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop",
    icon: "◈",
    tag: "Signature",
  },
  {
    title: "Forest Immersion Bath",
    subtitle: "60 min",
    description: "Hinoki cypress and Nordic moss botanicals transform warm water into a meditative forest clearing.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1400&auto=format&fit=crop",
    icon: "◉",
    tag: "Botanical",
  },
  {
    title: "Jade Meridian Massage",
    subtitle: "75 min",
    description: "Traditional Chinese meridian mapping meets cold-pressed jade application along twelve energy pathways.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop",
    icon: "◇",
    tag: "Eastern",
  },
  {
    title: "Hammam & Scrub",
    subtitle: "50 min",
    description: "North African tradition: black soap paste, kessa exfoliation, and warm steam in our hand-tiled hammam chamber.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1400&auto=format&fit=crop",
    icon: "◎",
    tag: "Traditional",
  },
  {
    title: "Himalayan Sound Journey",
    subtitle: "45 min",
    description: "Tibetan singing bowls tuned to planetary frequencies create resonance that stills the autonomic nervous system.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop",
    icon: "◐",
    tag: "Sound",
  },
  {
    title: "Dawn Pranayama",
    subtitle: "30 min",
    description: "A guided breathwork practice as morning light filters through the cedar meditation pavilion. Includes herbal infusion.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop",
    icon: "◑",
    tag: "Breathwork",
  },
];

export const CIRCUIT_STEPS = [
  { step: "01", title: "Arrival & Intention", description: "Guests are welcomed with a warm tisane ceremony and invited to set a personal intention for their time at the retreat.", icon: "❧" },
  { step: "02", title: "Cold Plunge Activation", description: "A 3-minute immersion in 8°C mineral water awakens the circulatory system and activates cold-shock protein pathways.", icon: "◈" },
  { step: "03", title: "Infrared Sauna", description: "Far-infrared panels penetrate 4cm into tissue — twice the depth of conventional heat — releasing stored toxins at cellular level.", icon: "◉" },
  { step: "04", title: "Floatation Chamber", description: "1,000 litres of Epsom-saturated water at skin temperature. Zero gravity, zero sensory input. Forty minutes felt as four.", icon: "◇" },
  { step: "05", title: "Botanical Steam", description: "Steam infused with wild juniper, eucalyptus, and alpine thyme rises through a vaulted cedar room. Breathe slowly.", icon: "◎" },
  { step: "06", title: "Rest & Integration", description: "The thermal circuit ends in the Garden Lounge. Raw cacao ceremony, silence, and whatever arrives in the quiet.", icon: "◐" },
];

export const PACKAGES = [
  {
    name: "Solstice",
    duration: "Half Day",
    price: "€290",
    color: C.forest,
    accentColor: C.sage,
    features: [
      "Full Thermal Circuit access (3 hours)",
      "One 60-minute signature treatment",
      "Botanical tea ceremony",
      "Use of robes & slippers",
      "Locker & amenity access",
    ],
    popular: false,
  },
  {
    name: "Equinox",
    duration: "Full Day",
    price: "€490",
    color: C.charcoal,
    accentColor: C.gold,
    features: [
      "Full Thermal Circuit access (all day)",
      "Two signature treatments (180 min total)",
      "Forest immersion lunch (plant-based)",
      "Morning pranayama session",
      "Private meditation garden access",
      "Departure gift: botanical oil blend",
    ],
    popular: true,
  },
  {
    name: "Zenith",
    duration: "2-Night Retreat",
    price: "€1,290",
    color: C.forest,
    accentColor: C.sage,
    features: [
      "Two nights in a Forest Suite",
      "Unlimited thermal circuit",
      "Four curated treatments",
      "Daily guided forest bathing",
      "Private consultation with lead therapist",
      "Personalized herbal protocol to take home",
    ],
    popular: false,
  },
];

export const TEAM = [
  {
    name: "Ingrid Halvorsen",
    role: "Lead Holistic Therapist",
    bio: "Trained in Norway, Bali, and Kerala. Fifteen years of practice in somatic bodywork and botanical medicine.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?q=80&w=1400&auto=format&fit=crop",
    specialties: ["Somatic Bodywork", "Botanical Medicine", "Pranayama"],
  },
  {
    name: "Marc Thibault",
    role: "Thermal Therapist",
    bio: "Former competitive swimmer turned hydrotherapy specialist. Certified in Watsu, aquatic craniosacral, and Nordic bathing.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1400&auto=format&fit=crop",
    specialties: ["Hydrotherapy", "Watsu", "Nordic Bathing"],
  },
  {
    name: "Yuki Tanaka",
    role: "Sound & Meditation Guide",
    bio: "Studied under Tibetan Buddhist teachers for six years. Integrates sound healing with somatic presence practices.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1400&auto=format&fit=crop",
    specialties: ["Sound Healing", "Tibetan Bowls", "Meditation"],
  },
];

export const TESTIMONIALS = [
  { quote: "I have visited six spas across Europe. Serene Retreat is categorically different. The silence alone is worth the journey.", author: "Charlotte V.", location: "Geneva" },
  { quote: "The Equinox package changed something fundamental in me. I left lighter in a way I cannot explain to people who haven't experienced it.", author: "James K.", location: "London" },
  { quote: "Ingrid's stone ritual addressed years of chronic tension in a single session. I wept. I recommend it without reservation.", author: "Sophie M.", location: "Paris" },
  { quote: "The floatation chamber was terrifying for the first five minutes and transcendent for the next thirty-five.", author: "Daniel R.", location: "Zürich" },
  { quote: "We came as a couple for the Equinox package. It is now a twice-yearly ritual that we protect like nothing else.", author: "Elena & Pierre B.", location: "Lyon" },
];

export const MARQUEE_ITEMS = [
  "Alpine Mineral Waters",
  "Certified Organic Botanicals",
  "Biodynamic Treatments",
  "Carbon Neutral Retreat",
  "Wild-harvested Herbs",
  "Ancient Thermal Traditions",
  "Zero Fragrance Synthetics",
  "Forest-sourced Cedar",
];

// ─── Shared Components ────────────────────────────────────────────────────────
export function TextReveal({
  children,
  delay = 0,
  style: externalStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MagneticButton({
  children,
  style: externalStyle,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    },
    [x, y]
  );
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ ...externalStyle, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

export function SpotlightCard({
  children,
  style: externalStyle,
  accentColor,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
}) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);
  const handleMouseLeave = useCallback(
    () => setSpotlight((s) => ({ ...s, active: false })),
    []
  );
  const accent = accentColor || "107,143,113";
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(${accent},0.12) 0%, ${externalStyle?.background || C.forest} 60%)`
          : externalStyle?.background || C.forest,
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}

export function MarqueeStrip({
  items,
  bg,
  textColor,
}: {
  items: string[];
  bg: string;
  textColor: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: bg, paddingTop: 18, paddingBottom: 18 }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textColor,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              fontFamily: C.fontSans,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: textColor,
                opacity: 0.4,
                display: "inline-block",
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────
export function ExperienceCard({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: "3/4",
      }}
    >
      <img
        src={exp.image}
        alt={exp.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(44,48,40,0.92) 0%, rgba(44,48,40,0.3) 60%, transparent 100%)"
            : "linear-gradient(to top, rgba(44,48,40,0.75) 0%, rgba(44,48,40,0.1) 60%, transparent 100%)",
          transition: "background 0.5s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: C.sage,
          color: C.white,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "5px 12px",
          fontFamily: C.fontSans,
        }}
      >
        {exp.tag}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 24px 28px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: C.gold,
            marginBottom: 8,
            fontFamily: C.font,
          }}
        >
          {exp.icon}
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            color: C.white,
            fontWeight: 400,
            marginBottom: 4,
            lineHeight: 1.2,
          }}
        >
          {exp.title}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 12,
            color: C.gold,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {exp.subtitle}
        </div>
        <motion.div
          initial={false}
          animate={hovered ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7,
              paddingTop: 4,
            }}
          >
            {exp.description}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Circuit Step ─────────────────────────────────────────────────────────────
export function CircuitStep({ step, index }: { step: typeof CIRCUIT_STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        paddingBottom: 48,
        borderBottom: index < CIRCUIT_STEPS.length - 1 ? `1px solid ${C.mist}` : "none",
        marginBottom: index < CIRCUIT_STEPS.length - 1 ? 48 : 0,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 72,
          height: 72,
          border: `1px solid ${C.gold}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: C.font,
          fontSize: 28,
          color: C.gold,
        }}
      >
        {step.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: C.sage,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Step {step.step}
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 26,
            fontWeight: 400,
            color: C.charcoal,
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          {step.title}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 15,
            color: "#6b7265",
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          {step.description}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
export function PackageCard({ pkg, index, isSelected, onSelect, onBook }: {
  pkg: typeof PACKAGES[0];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onBook: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      style={{
        background: isSelected ? C.charcoal : pkg.color,
        border: isSelected ? `1px solid ${C.gold}` : `1px solid ${C.mist}`,
        padding: "48px 40px",
        cursor: "pointer",
        position: "relative",
        transition: "border-color 0.3s",
      }}
    >
      {pkg.popular && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.gold,
            color: C.charcoal,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "5px 20px",
            fontFamily: C.fontSans,
            fontWeight: 600,
          }}
        >
          Most Popular
        </div>
      )}
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: isSelected ? C.gold : C.sage,
          marginBottom: 12,
        }}
      >
        {pkg.duration}
      </div>
      <div
        style={{
          fontFamily: C.font,
          fontSize: 34,
          fontWeight: 400,
          color: isSelected ? C.white : C.charcoal,
          marginBottom: 6,
          lineHeight: 1,
        }}
      >
        {pkg.name}
      </div>
      <div
        style={{
          fontFamily: C.font,
          fontSize: 42,
          fontWeight: 300,
          color: isSelected ? C.gold : C.sage,
          marginBottom: 32,
          lineHeight: 1,
        }}
      >
        {pkg.price}
      </div>
      <div
        style={{
          width: 40,
          height: 1,
          background: isSelected ? C.gold : C.mist,
          marginBottom: 28,
          transition: "background 0.3s",
        }}
      />
      {pkg.features.map((f, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              color: isSelected ? C.gold : C.sage,
              fontSize: 14,
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            ◈
          </span>
          <span
            style={{
              fontFamily: C.fontSans,
              fontSize: 14,
              color: isSelected ? "rgba(255,255,255,0.85)" : "#5a6255",
              lineHeight: 1.5,
            }}
          >
            {f}
          </span>
        </div>
      ))}
      <motion.div
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          e.stopPropagation();
          onBook();
        }}
        style={{
          marginTop: 36,
          background: C.gold,
          color: C.charcoal,
          padding: "14px 32px",
          fontFamily: C.fontSans,
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Book This Package
      </motion.div>
    </motion.div>
  );
}

// ─── Therapist Card ───────────────────────────────────────────────────────────
export function TherapistCard({ therapist, index }: { therapist: typeof TEAM[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          marginBottom: 24,
          aspectRatio: "3/4",
        }}
      >
        <img
          src={therapist.image}
          alt={therapist.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
            filter: "grayscale(20%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(44,48,40,0.4) 0%, transparent 50%)",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: C.font,
          fontSize: 24,
          fontWeight: 400,
          color: C.charcoal,
          marginBottom: 4,
        }}
      >
        {therapist.name}
      </div>
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: C.sage,
          marginBottom: 14,
        }}
      >
        {therapist.role}
      </div>
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 14,
          color: "#6b7265",
          lineHeight: 1.7,
          marginBottom: 18,
          fontWeight: 300,
        }}
      >
        {therapist.bio}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {therapist.specialties.map((s, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.sage,
              border: `1px solid ${C.mist}`,
              padding: "5px 12px",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
export function TestimonialCard({ t, active }: { t: typeof TESTIMONIALS[0]; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.96 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div
        style={{
          fontFamily: C.font,
          fontSize: 72,
          color: C.gold,
          lineHeight: 0.6,
          marginBottom: 32,
          opacity: 0.5,
        }}
      >
        &ldquo;
      </div>
      <div
        style={{
          fontFamily: C.font,
          fontSize: 26,
          fontStyle: "italic",
          color: C.charcoal,
          lineHeight: 1.6,
          marginBottom: 32,
          maxWidth: 600,
        }}
      >
        {t.quote}
      </div>
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 13,
          color: C.sage,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {t.author} — {t.location}
      </div>
    </motion.div>
  );
}
