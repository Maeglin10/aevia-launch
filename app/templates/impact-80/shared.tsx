"use client";
import { clientPhotoAt } from "@/lib/templates/clientContent";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

function PROJECTS_LIVE() {
  return [
  { name: "The Obsidian Villa", loc: "Malibu, CA", img: clientPhotoAt(8, "https://pixabay.com/get/gbbc299ba5a29ed0555cf1c54627eeedced3b56da4ab3b8d994362e3f17e955190dcc51994644ffcd245bec92f89bcf8f6ed108e88c080f73448414fe39e6dd59_1280.jpg") },
  { name: "Glass Monolith", loc: "Berlin, DE", img: clientPhotoAt(9, "https://pixabay.com/get/gbbc299ba5a29ed0555cf1c54627eeedced3b56da4ab3b8d994362e3f17e955190dcc51994644ffcd245bec92f89bcf8f6ed108e88c080f73448414fe39e6dd59_1280.jpg") },
  { name: "Serene Heights", loc: "Kyoto, JP", img: clientPhotoAt(10, "https://pixabay.com/get/gbf229731283bc77e3f7157e49babac2ce178bdd21ca4e30d4f054f360a58915f6ff48497f682d50f8f41749a12bf114615e43e019f0e018c1325fab57f37dec3_1280.jpg") },
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
