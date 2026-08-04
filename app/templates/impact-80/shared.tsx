"use client";
import { clientPhotoAt } from "@/lib/templates/clientContent";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

function PROJECTS_LIVE() {
  return [
  { name: "The Obsidian Villa", loc: "Malibu, CA", img: clientPhotoAt(8, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200") },
  { name: "Glass Monolith", loc: "Berlin, DE", img: clientPhotoAt(9, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200") },
  { name: "Serene Heights", loc: "Kyoto, JP", img: clientPhotoAt(10, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200") },
];
}
export let PROJECTS = PROJECTS_LIVE();

export function Reveal({ children, delay = 0, y = 30, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}


/*
  Rappelé par la page une fois la session retenue : sans cet appel, les
  tableaux ci-dessus gardent la valeur qu'ils avaient à l'import, quand le
  client n'existait pas encore.
*/
export function rafraichirPartage(): void {
  PROJECTS = PROJECTS_LIVE();
}
