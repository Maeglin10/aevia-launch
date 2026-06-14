"use client";

import { motion } from "framer-motion";
import { Reveal, GridBackground } from "../shared";

export default function MaterialsPage() {
  const materialsList = [
    {
      name: "UD Carbon (Unidirectional)",
      desc: "Maximum strength along a single axis. Ideal for structural tubes, high-stress rods, and reinforcements where loading is predictable.",
      tensile: "4900 MPa",
      modulus: "240 GPa",
      density: "1.60 g/cm³",
      thermal: "Up to 180°C",
    },
    {
      name: "Woven Weave (2x2 Twill / Plain)",
      desc: "Bidirectional reinforcement with iconic carbon fiber aesthetics. Highly drapeable, making it perfect for complex organic shapes and impact protection.",
      tensile: "3800 MPa",
      modulus: "220 GPa",
      density: "1.55 g/cm³",
      thermal: "Up to 220°C",
    },
    {
      name: "Forged Composite (Chopped Fiber)",
      desc: "Composed of randomly oriented carbon fiber chips pressed under high pressure. Offers isotropic strength in all directions and a unique marbled look.",
      tensile: "3100 MPa",
      modulus: "180 GPa",
      density: "1.65 g/cm³",
      thermal: "Up to 250°C",
    },
    {
      name: "Hybrid Mesh (Carbon/Kevlar)",
      desc: "Combines the rigidity of carbon fiber with the extreme abrasion and puncture resistance of Kevlar. Ideal for impact zones and protective shielding.",
      tensile: "3500 MPa",
      modulus: "190 GPa",
      density: "1.50 g/cm³",
      thermal: "Up to 150°C",
    },
  ];

  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-screen py-24 px-6 relative">
      <GridBackground />
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="border-b border-white/5 pb-16 mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] block mb-6">Product Catalog</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[1.15] pb-4 text-white italic">
              Advanced <br /> <span className="font-light not-italic opacity-20 text-white">Composites.</span>
            </h1>
          </div>
        </Reveal>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {materialsList.map((mat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-12 bg-white/[0.01] border border-white/5 hover:border-[#0070f3]/50 transition-all duration-500 rounded-lg">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic mb-6">
                  {mat.name}
                </h3>
                <p className="text-sm font-light leading-relaxed mb-8 italic opacity-60">
                  {mat.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                  <div>
                    <span className="block text-[#0070f3]">Tensile Strength</span>
                    <span className="text-sm text-white italic mt-1 block">{mat.tensile}</span>
                  </div>
                  <div>
                    <span className="block text-[#0070f3]">Elastic Modulus</span>
                    <span className="text-sm text-white italic mt-1 block">{mat.modulus}</span>
                  </div>
                  <div>
                    <span className="block text-[#0070f3]">Density</span>
                    <span className="text-sm text-white italic mt-1 block">{mat.density}</span>
                  </div>
                  <div>
                    <span className="block text-[#0070f3]">Thermal Rating</span>
                    <span className="text-sm text-white italic mt-1 block">{mat.thermal}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </div>
  );
}
