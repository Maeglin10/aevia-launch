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

// Shared grid overlay style — reuse across all sections
export const gridOverlay = {
  backgroundImage: `linear-gradient(rgba(155,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(155,92,246,0.5) 1px, transparent 1px)`,
  backgroundSize: "80px 80px"
}

// Monospace label style
export const monoStyle = { fontFamily: "'Space Mono', monospace" }

// Purple label utility
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={monoStyle}>
      {children}
    </p>
  )
}

export const projects = [
  {
    name: "VALO — Brand Identity in 3D",
    client: "Valo Corp",
    type: "3D Branding",
    category: "Branding",
    year: "2025",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&crop=center",
    result: "340% conversion uplift",
    tech: ["Three.js", "GLSL", "Blender"],
  },
  {
    name: "ArcSpace — AR Real Estate",
    client: "ArcSpace",
    type: "Augmented Reality",
    category: "AR",
    year: "2025",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&crop=center",
    result: "2.1M sessions in month 1",
    tech: ["WebXR", "ARKit", "R3F"],
  },
  {
    name: "Phantom — Product Visualizer",
    client: "Phantom Motors",
    type: "3D Configurator",
    category: "3D",
    year: "2024",
    img: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1200&h=800&fit=crop&crop=center",
    result: "78% bundle size reduction",
    tech: ["Babylon.js", "WASM", "WebGL"],
  },
  {
    name: "Luminary — Virtual Fashion",
    client: "Luminary Ltd",
    type: "Virtual Try-On",
    category: "AR",
    year: "2024",
    img: "https://images.unsplash.com/photo-1558618047-3c98d9a91fc6?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1558618047-3c98d9a91fc6?w=1200&h=800&fit=crop&crop=center",
    result: "60% return rate reduction",
    tech: ["TensorFlow.js", "WebGL", "R3F"],
  },
  {
    name: "Forma — Architectural Walkthrough",
    client: "Forma Studios",
    type: "Virtual Environments",
    category: "Real-time",
    year: "2024",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop&crop=center",
    result: "10,000 concurrent visitors",
    tech: ["PlayCanvas", "WebSockets", "GLSL"],
  },
  {
    name: "Nexus — Data Center Visualization",
    client: "Nexus Cloud",
    type: "Real-time Render",
    category: "Real-time",
    year: "2023",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop&crop=center",
    result: "Sub-12ms frame time",
    tech: ["Three.js", "WebWorkers", "GLSL"],
  },
  {
    name: "Studio Levi — Brand Universe",
    client: "Studio Levi",
    type: "3D Branding",
    category: "Branding",
    year: "2023",
    img: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=1200&h=800&fit=crop&crop=center",
    result: "Awwwards Site of Month",
    tech: ["Blender", "R3F", "Shader"],
  },
  {
    name: "Helio — Medical AR Training",
    client: "Helio Medical",
    type: "Augmented Reality",
    category: "AR",
    year: "2023",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop&crop=center",
    imgHigh: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop&crop=center",
    result: "FDA-cleared training module",
    tech: ["ARKit", "Unity WebGL", "WASM"],
  },
]
