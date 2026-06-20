"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Terminal, Radio } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

import "../premium.css";

export default function VisionHomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleStartScan = () => {
    window.dispatchEvent(new Event("open-vision-scan"));
  };

  return (
    <div className="bg-[#050505] text-white font-mono min-h-screen">
      {/* ==========================================
          1. HERO (Cyber HUD Real Estate)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[85vh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="Vision Hero"
            fill
            className="object-cover brightness-[0.4] grayscale-[80%]"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)]" />
        </motion.div>

        {/* HUD GRID */}
        <div
          className="absolute inset-0 z-1 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-600/10 rounded-none border border-rose-600/30 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
              Live: Volumetric Stream 0x074F
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase italic pb-4">
              Space <br /> <span className="text-rose-600">As Data.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/30 leading-relaxed font-bold mb-12 uppercase tracking-tight">
              Sub-millimeter LiDAR scanning and neural radiance fields for
              immersive real estate experiences at the speed of thought.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn
                onClick={handleStartScan}
                className="px-12 py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer shadow-2xl shadow-rose-600/20"
              >
                Enter Property
              </MagneticBtn>
              <button
                onClick={() => {
                  document
                    .getElementById("technology")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer bg-transparent"
              >
                Portfolio_Manifesto
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3 text-right">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              TETRAHEDRON // SCAN_MODE_EN
            </span>
            <div className="w-32 h-[1px] bg-rose-600/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. THE SPATIAL ENGINE (Tech Protocol)
          ========================================== */}
      <section
        id="technology"
        className="py-32 bg-[#050505] border-y border-white/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-6 block">
                  Spatial Protocol
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-12 text-white uppercase italic">
                  Neural <br />{" "}
                  <span className="text-rose-600">Rendering.</span>
                </h2>
                <p className="text-lg text-white/30 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                  Our proprietary engine digitizes physical assets into
                  interactive volumetric twins with sub-millimeter precision.
                </p>

                <div className="space-y-10">
                  {[
                    {
                      label: "LiDAR Precision",
                      val: "±1",
                      suffix: "mm",
                      desc: "Military-grade sensors capturing every architectural nuance.",
                    },
                    {
                      label: "Polygon Count",
                      val: "1.2",
                      suffix: "B+",
                      desc: "Extreme density rendering for true photorealism.",
                    },
                    {
                      label: "Stream Latency",
                      val: "20",
                      suffix: "ms",
                      desc: "Instant response on any device, from VR to Mobile.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group border-l border-rose-600/20 pl-8 hover:border-rose-600 transition-all"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/60">
                        {item.label}
                      </h4>
                      <div className="text-3xl font-black text-rose-600 mb-2 uppercase italic tabular-nums">
                        {item.val}
                        {item.suffix}
                      </div>
                      <p className="text-[10px] text-white/20 leading-relaxed font-bold uppercase tracking-widest">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <div className="relative aspect-video rounded-none overflow-hidden shadow-2xl border border-white/5 bg-[#0a0a0a] p-1 group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)] animate-pulse" />
                  <div className="relative h-full w-full border border-white/5 bg-[#050505] p-8 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-rose-600" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-600">
                          Engine_Output_Live
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-rose-600/30 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-4 font-mono">
                      {[
                        {
                          time: "14:22:01.002",
                          op: "INIT",
                          val: "LOAD_GEOMETRY_0x77A",
                          status: "ACK",
                        },
                        {
                          time: "14:22:01.003",
                          op: "SCAN",
                          val: "RECONSTRUCTING_POINTS_1.2B",
                          status: "DONE",
                        },
                        {
                          time: "14:22:01.004",
                          op: "MESH",
                          val: "OPTIMIZING_POLY_DENSITY",
                          status: "DONE",
                        },
                        {
                          time: "14:22:01.005",
                          op: "PUBL",
                          val: "STREAMING_VOLUMETRIC_V2",
                          status: "LIVE",
                        },
                      ].map((log, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-6 text-[10px] py-2 border-b border-white/[0.02]"
                        >
                          <span className="text-white/20 italic">
                            {log.time}
                          </span>
                          <span className="text-rose-600 font-black uppercase tracking-widest">
                            {log.op}
                          </span>
                          <span className="text-white/40 flex-1 truncate">
                            {log.val}
                          </span>
                          <span className="text-rose-600/40">
                            [{log.status}]
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 p-8 bg-rose-600/5 border border-rose-600/10">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                        <span className="text-white/40 italic">Buffer Load</span>
                        <span className="text-rose-600">92%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "92%" }}
                          transition={{ duration: 2 }}
                          className="h-full bg-rose-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* ==========================================
          3. PORTFOLIO — Selected Properties
          ========================================== */}
      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-20">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-4 block">Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight uppercase italic text-white">
                Properties<br /><span className="text-rose-600">Scanned.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { id: "PRJ-0047", name: "Penthouse Trinity", loc: "Paris 8e", type: "Résidentiel", size: "340 m²", pts: "2.8B pts", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
              { id: "PRJ-0031", name: "HQ Montparnasse", loc: "Paris 14e", type: "Commercial", size: "4 200 m²", pts: "18.4B pts", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
              { id: "PRJ-0018", name: "Villa Antibes", loc: "Côte d'Azur", type: "Prestige", size: "820 m²", pts: "6.1B pts", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
            ].map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div className="bg-[#050505] group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover brightness-50 grayscale group-hover:brightness-[0.7] group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                    <div className="absolute top-4 left-4 text-[9px] font-mono font-bold text-rose-600 uppercase tracking-widest border border-rose-600/30 px-2 py-1">{p.id}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest mb-4">
                      <span>{p.loc}</span><span>{p.type}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-4">{p.name}</h3>
                    <div className="flex gap-6 text-[9px] font-mono">
                      <span className="text-white/30">{p.size}</span>
                      <span className="text-rose-600">{p.pts}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SERVICES
          ========================================== */}
      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-20">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-4 block">Services</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight uppercase italic text-white">
                Full-Spectrum<br /><span className="text-rose-600">Capture.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {[
              { code: "01", title: "Residential", price: "À partir de 2 400€", desc: "Scan complet appartements et maisons. Modèle 3D HD, plan de coupe, visite virtuelle haute résolution." },
              { code: "02", title: "Commercial", price: "Sur devis", desc: "Digitisation de bureaux, commerces et hôtels. Intégration BIM et livrables IFC/RVT pour promoteurs." },
              { code: "03", title: "Heritage & Museum", price: "Sur devis", desc: "Archivage de patrimoine architectural. Précision archéologique sub-millimétrique, livrables Matterport + nuage de points." },
              { code: "04", title: "Development Pipeline", price: "Abonnement mensuel", desc: "Suivi chantier en temps réel, comparaison BIM vs. As-built, rapport d'avancement automatisé." },
            ].map((s) => (
              <Reveal key={s.code}>
                <div className="bg-[#050505] p-12 group hover:bg-rose-600/5 transition-colors border border-white/5 hover:border-rose-600/20">
                  <div className="text-[9px] font-mono text-rose-600/60 uppercase tracking-[0.4em] mb-6">{s.code} //</div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-4">{s.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed font-mono mb-6">{s.desc}</p>
                  <div className="text-rose-600 text-[10px] font-black uppercase tracking-widest">{s.price}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CTA
          ========================================== */}
      <section className="py-40 bg-[#050505] border-t border-rose-600/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-6 block font-mono">Initialize Scan</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-8 leading-[0.95]">
              Book Your<br /><span className="text-rose-600">First Scan.</span>
            </h2>
            <p className="text-white/30 font-mono text-sm leading-relaxed mb-12 max-w-lg mx-auto uppercase tracking-wide">
              Première visite de repérage gratuite. Devis sous 24h. Livraison du scan en 5 jours ouvrés.
            </p>
            <MagneticBtn
              onClick={handleStartScan}
              className="px-16 py-6 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer shadow-2xl shadow-rose-600/20 border-none"
            >
              Launch Scan Protocol →
            </MagneticBtn>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
