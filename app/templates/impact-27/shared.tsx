"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"

export function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-27-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-27-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`
    document.head.appendChild(style)
  }, [])
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const projects = [
  { name: "VALO — Brand Identity in 3D", client: "Valo Corp", type: "3D Branding", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center" },
  { name: "ArcSpace — AR Real Estate", client: "ArcSpace", type: "Augmented Reality", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&crop=center" },
  { name: "Phantom — Product Visualizer", client: "Phantom Motors", type: "3D Configurator", img: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&h=400&fit=crop&crop=center" },
  { name: "Luminary — Virtual Fashion", client: "Luminary Ltd", type: "Virtual Try-On", img: "https://images.unsplash.com/photo-1558618047-3c98d9a91fc6?w=600&h=400&fit=crop&crop=center" },
]
