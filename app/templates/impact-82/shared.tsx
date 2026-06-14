"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

export interface Project {
  name: string
  type: string
  location: string
  size: string
  status: string
  image: string
  progress: number
}

export interface TeamMember {
  name: string
  title: string
  exp: string
  image: string
}

export const PROJECTS: Project[] = [
  { name: "Résidence Le Marais", type: "Résidentiel prestige", location: "Paris 4e", size: "42 appartements", status: "Livraison 2026", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", progress: 78 },
  { name: "Tour Verre & Acier", type: "Bureau premium", location: "La Défense", size: "18 000 m²", status: "En cours", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", progress: 45 },
  { name: "Domaine Bois-Fleuri", type: "Résidentiel luxe", location: "Neuilly-sur-Seine", size: "8 villas", status: "Livraison 2025", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80", progress: 92 },
  { name: "Le Carré Saint-Cloud", type: "Mixte", location: "Saint-Cloud", size: "120 logements + commerces", status: "Permis obtenu", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80", progress: 20 },
  { name: "Athéna Bureaux", type: "Tertiaire", location: "Paris 8e", size: "6 500 m²", status: "Livré 2024", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", progress: 100 },
  { name: "Villeneuve Parc", type: "Résidentiel senior", location: "Lyon", size: "96 logements", status: "En cours", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", progress: 60 },
]

export const TEAM: TeamMember[] = [
  { name: "Édouard Marchand", title: "Président Directeur Général", exp: "32 ans d'expérience", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Sophie Renault", title: "Directrice de programmes", exp: "18 ans d'expérience", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Luc Vigneron", title: "Directeur financier", exp: "24 ans d'expérience", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
]

export function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}
