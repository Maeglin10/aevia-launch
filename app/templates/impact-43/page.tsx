"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
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
const NAV_LINKS = ["Experiences", "Circuit", "Packages", "Philosophy", "Team", "Contact"];

const EXPERIENCES = [
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

const CIRCUIT_STEPS = [
  { step: "01", title: "Arrival & Intention", description: "Guests are welcomed with a warm tisane ceremony and invited to set a personal intention for their time at the retreat.", icon: "❧" },
  { step: "02", title: "Cold Plunge Activation", description: "A 3-minute immersion in 8°C mineral water awakens the circulatory system and activates cold-shock protein pathways.", icon: "◈" },
  { step: "03", title: "Infrared Sauna", description: "Far-infrared panels penetrate 4cm into tissue — twice the depth of conventional heat — releasing stored toxins at cellular level.", icon: "◉" },
  { step: "04", title: "Floatation Chamber", description: "1,000 litres of Epsom-saturated water at skin temperature. Zero gravity, zero sensory input. Forty minutes felt as four.", icon: "◇" },
  { step: "05", title: "Botanical Steam", description: "Steam infused with wild juniper, eucalyptus, and alpine thyme rises through a vaulted cedar room. Breathe slowly.", icon: "◎" },
  { step: "06", title: "Rest & Integration", description: "The thermal circuit ends in the Garden Lounge. Raw cacao ceremony, silence, and whatever arrives in the quiet.", icon: "◐" },
];

const PACKAGES = [
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

const TEAM = [
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

const TESTIMONIALS = [
  { quote: "I have visited six spas across Europe. Serene Retreat is categorically different. The silence alone is worth the journey.", author: "Charlotte V.", location: "Geneva" },
  { quote: "The Equinox package changed something fundamental in me. I left lighter in a way I cannot explain to people who haven't experienced it.", author: "James K.", location: "London" },
  { quote: "Ingrid's stone ritual addressed years of chronic tension in a single session. I wept. I recommend it without reservation.", author: "Sophie M.", location: "Paris" },
  { quote: "The floatation chamber was terrifying for the first five minutes and transcendent for the next thirty-five.", author: "Daniel R.", location: "Zürich" },
  { quote: "We came as a couple for the Equinox package. It is now a twice-yearly ritual that we protect like nothing else.", author: "Elena & Pierre B.", location: "Lyon" },
];

const MARQUEE_ITEMS = [
  "Alpine Mineral Waters",
  "Certified Organic Botanicals",
  "Biodynamic Treatments",
  "Carbon Neutral Retreat",
  "Wild-harvested Herbs",
  "Ancient Thermal Traditions",
  "Zero Fragrance Synthetics",
  "Forest-sourced Cedar",
];

// ─── Font Loader ──────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "impact-43-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

// ─── Ripple Animation CSS ─────────────────────────────────────────────────────
function useRippleCSS() {
  useEffect(() => {
    const id = "impact-43-ripple";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes ripple-out {
        0% { transform: scale(0); opacity: 0.6; }
        100% { transform: scale(4); opacity: 0; }
      }
      .ripple-ring {
        animation: ripple-out 3.5s ease-out infinite;
      }
      .ripple-ring:nth-child(2) { animation-delay: 1.1s; }
      .ripple-ring:nth-child(3) { animation-delay: 2.2s; }
      @keyframes float-up {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }
      .float-anim { animation: float-up 6s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ─── Shared Components ────────────────────────────────────────────────────────
function TextReveal({
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

function MagneticButton({
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

function SpotlightCard({
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

function MarqueeStrip({
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
function ExperienceCard({ exp, index }: { exp: (typeof EXPERIENCES)[0]; index: number }) {
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
          initial={{ height: 0, opacity: 0 }}
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
function CircuitStep({ step, index }: { step: (typeof CIRCUIT_STEPS)[0]; index: number }) {
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
function PackageCard({ pkg, index, isSelected, onSelect }: {
  pkg: (typeof PACKAGES)[0];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
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
function TherapistCard({ therapist, index }: { therapist: (typeof TEAM)[0]; index: number }) {
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
function TestimonialCard({ t, active }: { t: (typeof TESTIMONIALS)[0]; active: boolean }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Impact43Page() {
  useFonts();
  useRippleCSS();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const scrollProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <div ref={containerRef} style={{ background: C.cream, minHeight: "100vh", fontFamily: C.fontSans }}>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          background: C.gold,
          width: scrollProgress,
          zIndex: 1000,
          transformOrigin: "left",
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? `rgba(253,251,247,0.96)` : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.mist}` : "none",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: scrolled ? C.charcoal : C.white,
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "color 0.4s",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Serene Retreat
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: scrolled ? C.charcoal : "rgba(255,255,255,0.9)",
                padding: 0,
                transition: "color 0.3s, opacity 0.3s",
                display: window?.innerWidth < 768 ? "none" : "block",
              }}
            >
              {link}
            </button>
          ))}

          <MagneticButton
            onClick={() => scrollTo("Contact")}
            style={{
              background: C.gold,
              color: C.charcoal,
              border: "none",
              padding: "10px 24px",
              fontFamily: C.fontSans,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Book Now
          </MagneticButton>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 22,
                  height: 1.5,
                  background: scrolled ? C.charcoal : C.white,
                  display: "block",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translateY(6.5px)"
                      : menuOpen && i === 1
                      ? "scaleX(0)"
                      : menuOpen && i === 2
                      ? "rotate(-45deg) translateY(-6.5px)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              background: C.cream,
              zIndex: 998,
              padding: "32px 48px",
              borderBottom: `1px solid ${C.mist}`,
              boxShadow: "0 20px 60px rgba(44,48,40,0.1)",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(link)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.font,
                  fontSize: 28,
                  color: C.charcoal,
                  padding: "10px 0",
                  fontWeight: 300,
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop"
          alt="Serene spa landscape"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            y: heroY,
            scale: heroScale,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(44,48,40,0.65) 0%, rgba(107,143,113,0.3) 50%, rgba(44,48,40,0.55) 100%)",
          }}
        />

        {/* Ripple Water Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="ripple-ring"
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                border: `1px solid rgba(201,168,85,0.6)`,
                borderRadius: "50%",
              }}
            />
          ))}
          <div
            style={{
              width: 12,
              height: 12,
              background: C.gold,
              borderRadius: "50%",
              opacity: 0.8,
            }}
          />
        </div>

        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 760,
            padding: "0 32px",
            opacity: heroOpacity,
          }}
        >
          <TextReveal delay={0.2}>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Alpine Thermal Retreat
            </div>
          </TextReveal>

          <TextReveal delay={0.4}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(52px, 7vw, 96px)",
                fontWeight: 300,
                color: C.white,
                lineHeight: 1.05,
                marginBottom: 28,
                fontStyle: "italic",
              }}
            >
              Where stillness<br />becomes medicine
            </h1>
          </TextReveal>

          <TextReveal delay={0.6}>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.8,
                marginBottom: 48,
                fontWeight: 300,
                maxWidth: 500,
                margin: "0 auto 48px",
              }}
            >
              A curated sanctuary of thermal waters, ancient botanicals,
              and silence. Sixty kilometres from the city. A world apart.
            </p>
          </TextReveal>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => scrollTo("Packages")}
              style={{
                background: C.gold,
                color: C.charcoal,
                border: "none",
                padding: "16px 40px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Explore Packages
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("Experiences")}
              style={{
                background: "transparent",
                color: C.white,
                border: `1px solid rgba(255,255,255,0.5)`,
                padding: "16px 40px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Discover More
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Scroll
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            }}
          />
        </div>
      </section>

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.sage} textColor="rgba(255,255,255,0.85)" />

      {/* Experiences Section */}
      <section id="experiences" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 72, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.sage,
                    marginBottom: 16,
                  }}
                >
                  Our Treatments
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(36px, 4vw, 58px)",
                    fontWeight: 300,
                    color: C.charcoal,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                  }}
                >
                  Curated experiences<br />for body and mind
                </h2>
              </TextReveal>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                color: "#6b7265",
                maxWidth: 360,
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Each treatment is designed as a complete ceremony — not merely a service. We source botanicals from certified organic farms within 200km.
            </motion.p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {EXPERIENCES.map((exp, i) => (
              <ExperienceCard key={exp.title} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Thermal Circuit Section */}
      <section id="circuit" style={{ padding: "120px 80px", background: C.forest }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                The Journey
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 3.5vw, 52px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                  marginBottom: 28,
                }}
              >
                The Thermal Circuit
              </h2>
            </TextReveal>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                color: "#6b7265",
                lineHeight: 1.8,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              Our six-step thermal journey follows the ancient principle of contrast therapy — the deliberate alternation of heat and cold that activates the body's deepest healing mechanisms.
            </motion.p>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/3",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1400&auto=format&fit=crop"
                alt="Thermal circuit"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  background: "rgba(44,48,40,0.85)",
                  padding: "20px 24px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 18,
                    color: C.white,
                    marginBottom: 4,
                    fontStyle: "italic",
                  }}
                >
                  Available daily, 7am – 9pm
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Included in all packages
                </div>
              </div>
            </div>
          </div>

          <div>
            {CIRCUIT_STEPS.map((step, i) => (
              <CircuitStep key={step.step} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                Retreat Packages
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4vw, 58px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Choose your depth<br />of immersion
              </h2>
            </TextReveal>
          </div>

          <AnimatePresence mode="wait">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 0,
              }}
            >
              {PACKAGES.map((pkg, i) => (
                <PackageCard
                  key={pkg.name}
                  pkg={pkg}
                  index={i}
                  isSelected={selectedPackage === i}
                  onSelect={() => setSelectedPackage(i)}
                />
              ))}
            </div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: "center",
              marginTop: 32,
              fontFamily: C.fontSans,
              fontSize: 13,
              color: "#8a9085",
              fontWeight: 300,
            }}
          >
            All packages include full thermal circuit access, robes & slippers, organic amenities, and secure locker storage.
            Gift vouchers available.
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section
        id="philosophy"
        style={{
          padding: "120px 80px",
          background: C.charcoal,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,85,0.08)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,85,0.05)`,
          }}
        />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "center" }}>
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 16,
                  }}
                >
                  Our Philosophy
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(32px, 3.5vw, 48px)",
                    fontWeight: 300,
                    color: C.white,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                  }}
                >
                  The art of<br />doing nothing
                </h2>
              </TextReveal>
            </div>
            <div>
              {[
                { title: "Slow by design", body: "We cap daily arrivals at thirty guests. This is not a volume business. It is a precision one. Your experience of silence depends on us maintaining it." },
                { title: "Honest ingredients", body: "Every botanical in our treatments is certified organic and sourced within 200km. Our water comes from a granite spring at 1,400m. We don't compromise on materials." },
                { title: "Trained hands", body: "Our therapists complete 800 hours of training before their first independent session. Then they continue — workshops, apprenticeships, annual reviews." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  style={{
                    paddingBottom: 36,
                    marginBottom: 36,
                    borderBottom: i < 2 ? `1px solid rgba(255,255,255,0.08)` : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 22,
                      color: C.gold,
                      marginBottom: 10,
                      fontWeight: 400,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 15,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {item.body}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                The Practitioners
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4vw, 58px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Hands you can trust
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 48,
            }}
          >
            {TEAM.map((therapist, i) => (
              <TherapistCard key={therapist.name} therapist={therapist} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          background: C.forest,
          padding: "120px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                Guest Stories
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 3.5vw, 48px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  fontStyle: "italic",
                }}
              >
                What our guests say
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              position: "relative",
              minHeight: 280,
              background: C.white,
              border: `1px solid ${C.mist}`,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} t={t} active={activeTestimonial === i} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 28,
            }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeTestimonial === i ? C.sage : C.mist,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Strip */}
      <MarqueeStrip
        items={TESTIMONIALS.map((t) => `"${t.quote.substring(0, 60)}…" — ${t.author}`)}
        bg={C.charcoal}
        textColor="rgba(255,255,255,0.5)"
      />

      {/* Booking / Contact Section */}
      <section id="contact" style={{ padding: "120px 80px", background: C.cream }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 16,
                }}
              >
                Reserve Your Stay
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4vw, 58px)",
                  fontWeight: 300,
                  color: C.charcoal,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                  marginBottom: 20,
                }}
              >
                Begin your retreat
              </h2>
            </TextReveal>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                color: "#6b7265",
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Availability is limited to thirty guests per day. We recommend booking at least two weeks in advance for weekend visits.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: C.white,
              border: `1px solid ${C.mist}`,
              padding: "56px 64px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 24,
              }}
            >
              {[
                { label: "First Name", type: "text", placeholder: "Ingrid" },
                { label: "Last Name", type: "text", placeholder: "Halvorsen" },
                { label: "Email Address", type: "email", placeholder: "your@email.com" },
                { label: "Phone Number", type: "tel", placeholder: "+33 6 12 34 56 78" },
              ].map((field) => (
                <div key={field.label}>
                  <label
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: C.charcoal,
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: `1px solid ${C.mist}`,
                      background: C.cream,
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.charcoal,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.charcoal,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Preferred Package
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: `1px solid ${C.mist}`,
                  background: C.cream,
                  fontFamily: C.fontSans,
                  fontSize: 14,
                  color: C.charcoal,
                  outline: "none",
                }}
              >
                <option>Solstice — Half Day (€290)</option>
                <option>Equinox — Full Day (€490)</option>
                <option>Zenith — 2-Night Retreat (€1,290)</option>
              </select>
            </div>

            <div style={{ marginBottom: 36 }}>
              <label
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.charcoal,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Special Requests
              </label>
              <textarea
                rows={4}
                placeholder="Any allergies, mobility considerations, or special intentions..."
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: `1px solid ${C.mist}`,
                  background: C.cream,
                  fontFamily: C.fontSans,
                  fontSize: 14,
                  color: C.charcoal,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <MagneticButton
              style={{
                width: "100%",
                background: C.sage,
                color: C.white,
                border: "none",
                padding: "18px 40px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Request Reservation
            </MagneticButton>
          </motion.div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Phone", value: "+33 4 76 12 34 56" },
              { label: "Email", value: "reservations@serene-retreat.com" },
              { label: "Location", value: "Chartreuse Massif, Isère" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: C.sage,
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 18,
                    color: C.charcoal,
                    fontWeight: 400,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.charcoal,
          padding: "56px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: C.white,
            letterSpacing: "0.06em",
            fontStyle: "italic",
          }}
        >
          Serene Retreat
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em",
          }}
        >
          © 2025 Serene Retreat. All rights reserved. Chartreuse Massif, France.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Instagram", "Contact"].map((link) => (
            <button
              key={link}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
