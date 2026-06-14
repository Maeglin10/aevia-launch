"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

export const C = {
  bg: "#0a0a0a",
  bgAlt: "#111111",
  bgCard: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  textDim: "#606060",
  accent: "#991b1b",
  accentHover: "#b91c1c",
  accentLight: "rgba(153,27,27,0.15)",
  gray: "#404040",
  grayLight: "#2a2a2a",
  border: "rgba(255,255,255,0.08)",
  borderAccent: "rgba(153,27,27,0.4)",
  white: "#ffffff",
};

export const navLinks = [
  { label: "Artists", href: "/templates/impact-45/artists" },
  { label: "Portfolio", href: "/templates/impact-45/portfolio" },
  { label: "Styles", href: "/templates/impact-45/styles" },
  { label: "Booking", href: "/templates/impact-45/booking" },
  { label: "FAQ", href: "/templates/impact-45/faq" },
];

export const artists = [
  {
    name: "Mara Voss",
    role: "Fine Line Specialist",
    experience: "9 years",
    bio: "Mara's fine line work is architectural in its precision. She brings a jeweler's eye to every piece — botanical details, portraiture, and geometric compositions that last a lifetime.",
    styles: ["Fine Line", "Botanical", "Portraiture", "Minimalist"],
    bookingLead: "6–8 weeks",
    startingAt: "€200",
    instagram: "@maravoss.ink",
  },
  {
    name: "Théo Marchais",
    role: "Blackwork & Dark Art",
    experience: "12 years",
    bio: "Théo works in bold darkness — heavy blackwork, neo-tribal, dark illustrative sleeves. His compositions are monumental and his black saturation unmatched in Paris.",
    styles: ["Blackwork", "Neo-Tribal", "Dark Illustrative", "Sleeve Work"],
    bookingLead: "10–14 weeks",
    startingAt: "€300",
    instagram: "@theo.noir",
  },
];

export const portfolioItems = [
  { id: 1, title: "Botanical Fine Line", artist: "Mara Voss", style: "Fine Line", size: "tall" },
  { id: 2, title: "Geometric Sleeve", artist: "Théo Marchais", style: "Blackwork", size: "wide" },
  { id: 3, title: "Portrait Study", artist: "Mara Voss", style: "Portraiture", size: "square" },
  { id: 4, title: "Dark Tribal", artist: "Théo Marchais", style: "Neo-Tribal", size: "square" },
  { id: 5, title: "Floral Minimalist", artist: "Mara Voss", style: "Minimalist", size: "tall" },
  { id: 6, title: "Full Chest Piece", artist: "Théo Marchais", style: "Blackwork", size: "wide" },
  { id: 7, title: "Script & Ornament", artist: "Mara Voss", style: "Fine Line", size: "square" },
  { id: 8, title: "Serpent & Dagger", artist: "Théo Marchais", style: "Dark Illustrative", size: "square" },
];

export const styleGuide = [
  {
    name: "Fine Line",
    artist: "Mara Voss",
    desc: "Ultra-thin single-needle linework with extraordinary precision. Perfect for delicate botanicals, fine portraiture, and minimalist compositions.",
    traits: ["Single needle", "High detail", "Minimal healing", "Feminine or unisex"],
    icon: "✦",
  },
  {
    name: "Blackwork",
    artist: "Théo Marchais",
    desc: "Bold, saturated black work with architectural impact. Includes neo-tribal, black fill, and heavy illustrative styles built to last decades.",
    traits: ["Bold statement", "Decades of staying power", "Large format", "Masculine edge"],
    icon: "◼",
  },
  {
    name: "Watercolor",
    artist: "Mara Voss",
    desc: "Ink washes and loose color transitions that mimic watercolor painting on skin. Abstract, artistic, and deeply personal.",
    traits: ["Painterly", "Abstract", "Color-driven", "Unique every time"],
    icon: "◈",
  },
];

export const testimonials = [
  {
    name: "Camille R.",
    location: "Paris, 11e",
    rating: 5,
    text: "Mara did a full forearm botanical piece for me. The line quality is unreal — three years later it still looks fresh. The studio is the cleanest I've ever been in, and the process was completely stress-free.",
    style: "Fine Line Botanical",
  },
  {
    name: "Antoine D.",
    location: "Lyon",
    rating: 5,
    text: "Théo designed my sleeve over two sessions. He took my vague ideas and created something I genuinely love waking up to every day. Worth every euro and every week of the wait.",
    style: "Blackwork Sleeve",
  },
  {
    name: "Léa M.",
    location: "Paris, 3e",
    rating: 5,
    text: "I was nervous for my first tattoo and the team made the entire experience remarkable. The design consultation alone felt like working with a fine artist. Noir Ink is a cut above.",
    style: "Minimalist Fine Line",
  },
  {
    name: "Marc T.",
    location: "Bordeaux",
    rating: 5,
    text: "Traveled from Bordeaux specifically for Théo's blackwork. The chest piece he created is the most important piece of art I own — and I wear it everywhere.",
    style: "Full Chest Blackwork",
  },
];

export const bookingTiers = [
  {
    name: "Consultation",
    price: "Free",
    duration: "30 min",
    desc: "Meet your artist, discuss your vision, review reference images, and get a custom quote.",
    includes: ["Artist Q&A", "Custom design brief", "Size & placement advice", "Pricing estimate"],
    cta: "Book Free Consult",
    featured: false,
  },
  {
    name: "Small Piece",
    price: "€200",
    duration: "2–4 hours",
    desc: "Standalone pieces up to 10cm. Perfect for fine line florals, scripts, geometric shapes, and minimalist icons.",
    includes: ["Custom design", "2–4 hour session", "Aftercare kit", "Touch-up included"],
    cta: "Book Session",
    featured: false,
  },
  {
    name: "Large Piece",
    price: "€600",
    duration: "Full day",
    desc: "Complex single pieces — ribcage, thigh, back panel, chest. Full day session with breaks.",
    includes: ["Custom design", "Full day (7 hrs)", "Stencil preview", "Aftercare kit", "Touch-up included"],
    cta: "Book Session",
    featured: true,
  },
  {
    name: "Sleeve / Project",
    price: "Custom",
    duration: "Multi-session",
    desc: "Full or half sleeves, back pieces, and multi-session projects. Priced per session with a dedicated plan.",
    includes: ["Design brief meeting", "Session-by-session planning", "Priority booking", "All aftercare", "Lifetime touch-ups"],
    cta: "Start Project",
    featured: false,
  },
];

export const faqs = [
  {
    q: "How do I care for my tattoo?",
    a: "We provide a full aftercare kit and written instructions. The basics: keep it clean, apply unscented moisturizer 3x daily, avoid sun and swimming for 3 weeks, don't pick or scratch. We're available by message for questions during healing.",
  },
  {
    q: "How long does healing take?",
    a: "Surface healing takes 2–3 weeks. Full dermal healing is 3–6 months. Fine line work may require a touch-up at the 3-month mark — included in your booking price.",
  },
  {
    q: "Can I bring my own design?",
    a: "Yes, and we love when clients bring references. Our artists will always adapt, refine, and optimize your idea for the skin. We don't do exact reproductions of another artist's work.",
  },
  {
    q: "Is there a minimum age requirement?",
    a: "Yes — 18 years old, strictly. We require valid ID at the door. No exceptions.",
  },
  {
    q: "What's the deposit policy?",
    a: "A 30% non-refundable deposit is required to hold your appointment. It applies toward your total. Cancellations within 48 hours forfeit the deposit.",
  },
  {
    q: "Does it hurt?",
    a: "Discomfort varies by placement. Ribs, inner arm, and feet are more sensitive. Outer arm, thigh, and calf are typically well-tolerated. Our artists work at a sustainable pace and take breaks as needed.",
  },
];

export const stats = [
  { value: "2,400+", label: "Pieces Completed" },
  { value: "12", label: "Years in Paris" },
  { value: "98%", label: "Client Return Rate" },
  { value: "4.9", label: "Average Rating" },
];

export function NeedleAnimation() {
  const pathLength = useMotionValue(0);
  const smoothLength = useSpring(pathLength, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const controls = animate(pathLength, 1, {
      duration: 3,
      delay: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    });
    return controls.stop;
  }, [pathLength]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg
        viewBox="0 0 600 800"
        style={{ width: "100%", height: "100%", opacity: 0.22 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 80 700 C 100 600, 200 500, 180 380 C 160 260, 300 200, 320 100 C 340 20, 400 40, 450 80 C 500 120, 520 180, 500 240 C 480 300, 420 310, 400 380 C 380 450, 440 490, 460 560 C 480 630, 440 700, 400 740"
          stroke={C.accent}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: smoothLength }}
        />
        <motion.path
          d="M 200 750 C 220 680, 280 620, 300 540 C 320 460, 260 400, 280 320 C 300 240, 380 220, 360 140"
          stroke={C.accent}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 8"
          style={{ pathLength: smoothLength, opacity: 0.5 }}
        />
        <motion.path
          d="M 350 760 C 340 690, 380 640, 360 560 C 340 480, 280 460, 300 380 C 320 300, 400 280, 380 200 C 360 130, 300 110, 320 50"
          stroke={C.gray}
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: smoothLength, opacity: 0.3 }}
        />
      </svg>
    </div>
  );
}
