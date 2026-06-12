"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useEffect } from "react"
import Image from "next/image"

export function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-28-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-28-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])
}

export function ScrollImage({ src, alt, width, height, className = "", dir = 1, yRange = 60 }: {
  src: string; alt: string; width: number; height: number; className?: string; dir?: number; yRange?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-6 * dir, 6 * dir])
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.0, 1.12])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ rotate, y, scale }}>
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )
}

export function Reveal({ children, className = "", delay = 0, from = "bottom" }: {
  children: React.ReactNode; className?: string; delay?: number; from?: "bottom" | "left" | "right"
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const initial = from === "left" ? { opacity: 0, x: -40 } : from === "right" ? { opacity: 0, x: 40 } : { opacity: 0, y: 32 }
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

export const projects = [
  { 
    name: "BLOC K — Social Housing Complex", 
    loc: "Paris 19ème", 
    year: "2024", 
    type: "Residential", 
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop&crop=center",
    area: "8,200 sqm",
    concrete: "CEM III/A with local Seine aggregate",
    structure: "Load-bearing raw concrete facade & precast slabs",
    description: "A compact block designed with raw grey textures and strict modular layouts. Features passive thermal mass management and open-gallery circulation."
  },
  { 
    name: "BUNKER OFFICE — HQ Renovation", 
    loc: "La Défense", 
    year: "2023", 
    type: "Commercial", 
    img: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=800&h=600&fit=crop&crop=center",
    area: "14,500 sqm",
    concrete: "Recycled aggregate concrete with matte finish",
    structure: "Exposed waffle slabs and central core reinforcement",
    description: "Transformation of a 1980s tower basement into high-concept brutalist workspaces. The raw structural concrete remains visible in all boardrooms."
  },
  { 
    name: "CONCRETE CHAPEL", 
    loc: "Marseille", 
    year: "2023", 
    type: "Cultural", 
    img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop&crop=center",
    area: "420 sqm",
    concrete: "Ultra-high performance white concrete with silica sand",
    structure: "Self-supporting monolithic cast-in-place shell",
    description: "A spiritual structure carved from light and stone. Sound is absorbed by raw bush-hammered concrete walls, creating an acoustics sanctuary."
  },
  { 
    name: "SILOS — Mixed Use Development", 
    loc: "Lyon", 
    year: "2022", 
    type: "Mixed Use", 
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=600&fit=crop&crop=center",
    area: "22,000 sqm",
    concrete: "Raw exposed grey Portland cement",
    structure: "Steel frame integrated with pre-cast ribbed panels",
    description: "Conversion of former grain silos into mixed-use cultural hubs and micro-apartments. Keeps the industrial concrete cylindrical volumes intact."
  },
  { 
    name: "RAW TOWER — Office Tower", 
    loc: "Bordeaux", 
    year: "2022", 
    type: "Commercial", 
    img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&h=600&fit=crop&crop=center",
    area: "31,000 sqm",
    concrete: "High-performance concrete C60/75 with dark dye pigment",
    structure: "Post-tensioned suspended slabs & core shear walls",
    description: "An imposing dark concrete tower asserting its presence on the skyline. Uses horizontal wood-formwork impressions to soften light reflection."
  },
]

export const services = [
  { n: "01", title: "Architecture", desc: "New construction from concept to delivery. We design buildings that endure." },
  { n: "02", title: "Urban Planning", desc: "Master plans for districts, campuses, and large-scale developments." },
  { n: "03", title: "Interior Architecture", desc: "Raw material interiors — concrete, steel, glass. No compromise." },
  { n: "04", title: "Heritage Renovation", desc: "Transforming industrial heritage into contemporary programme." },
  { n: "05", title: "Competition", desc: "Architectural competition strategy. We win because we think differently." },
]

export const team = [
  { name: "Viktor Brunel", role: "Founding Partner", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Anaïs Cornet", role: "Associate Architect", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { name: "Marc Delvaux", role: "Urban Planning", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Sonia Lehmann", role: "Project Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
]
