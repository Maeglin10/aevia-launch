// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Disc3, Mic2, Radio, Music2, Maximize2, Headphones, Shuffle, Repeat } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const RELEASES = [
  {
    id: "r-01",
    title: "Neon Genesis",
    artist: "Synthwave Collective",
    year: "2024",
    duration: "4:23",
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    color: "#a855f7", // Purple
  },
  {
    id: "r-02",
    title: "Midnight Drive",
    artist: "The Outrunners",
    year: "2023",
    duration: "3:45",
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899", // Pink
  },
  {
    id: "r-03",
    title: "Cybernetic Heart",
    artist: "Data Romance",
    year: "2024",
    duration: "5:12",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    color: "#8b5cf6", // Violet
  },
];

const TRACKLIST = [
  { num: "01", title: "Overture: The Grid", duration: "2:15", plays: "1.2M" },
  {
    num: "02",
    title: "Neon Genesis",
    duration: "4:23",
    plays: "3.4M",
    highlight: true,
  },
  { num: "03", title: "Digital Rain", duration: "3:58", plays: "890K" },
  { num: "04", title: "Mainframe Breach", duration: "5:01", plays: "2.1M" },
  { num: "05", title: "Memory Leak", duration: "3:30", plays: "1.5M" },
  { num: "06", title: "System Shutdown", duration: "6:45", plays: "950K" },
];

const TOUR_DATES = [
  {
    date: "Oct 12",
    city: "Tokyo, JP",
    venue: "Zepp DiverCity",
    status: "Sold Out",
  },
  {
    date: "Oct 18",
    city: "Seoul, KR",
    venue: "Yes24 Live Hall",
    status: "Available",
  },
  {
    date: "Nov 02",
    city: "London, UK",
    venue: "Printworks",
    status: "Sold Out",
  },
  {
    date: "Nov 15",
    city: "Berlin, DE",
    venue: "Berghain",
    status: "Available",
  },
  {
    date: "Dec 05",
    city: "New York, US",
    venue: "Brooklyn Mirage",
    status: "Available",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */

export default function SonicPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRelease, setActiveRelease] = useState(0);
  const [progress, setProgress] = useState(35); // simulated percentage
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate progress bar movement if playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentThemeColor = RELEASES[activeRelease].color;

  const nextRelease = () => {
    setActiveRelease((prev) => (prev + 1) % RELEASES.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevRelease = () => {
    setActiveRelease((prev) => (prev - 1 + RELEASES.length) % RELEASES.length);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="premium-theme min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      {/* Global Background Glow reflecting active release */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${currentThemeColor}, transparent 70%)`,
        }}
      />

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#030014]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="#hero"
            className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2"
          >
            <Disc3 className="w-6 h-6 animate-spin-slow" />
            SONIC<span className="font-light text-slate-500">WAVE</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#hero" className="hover:text-purple-400 transition-colors">
              Releases
            </Link>
            <Link href="#hero" className="hover:text-purple-400 transition-colors">
              Artists
            </Link>
            <Link href="#hero" className="hover:text-purple-400 transition-colors">
              Tour
            </Link>
            <Link href="#hero" className="hover:text-purple-400 transition-colors">
              Store
            </Link>
          </div>

          <button className="px-6 py-2 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all rounded-full flex items-center gap-2">
            <Headphones className="w-4 h-4" /> Listen Live
          </button>
        </div>
      </nav>

      {/* ==========================================
          1. IMMERSIVE PLAYER HERO
          ========================================== */}
      <section id="hero" className="relative w-full min-h-screen flex items-center pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Interactive Player UI */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-center lg:items-start">
            <motion.div
              key={activeRelease}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left w-full"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" /> New
                Release
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">
                {RELEASES[activeRelease].title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-light text-slate-400 mb-12">
                {RELEASES[activeRelease].artist}
              </h2>

              {/* Player Controls */}
              <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all duration-300 ease-linear"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>1:24</span>
                    <span>{RELEASES[activeRelease].duration}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-white transition-colors">
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevRelease}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>
                    <button
                      onClick={nextRelease}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                  </div>

                  <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Album Art Display */}
          <div className="lg:col-span-7 order-1 lg:order-2 perspective-[1000px] flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRelease}
                initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -20, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="relative w-full max-w-[500px] aspect-square"
              >
                {/* Vinyl Record Behind Art */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-black rounded-full border border-[#1a1a1a] shadow-2xl flex items-center justify-center translate-x-[15%] lg:translate-x-[25%]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #2a2a2a 10%, #000 70%)",
                  }}
                >
                  <div className="w-1/3 h-1/3 rounded-full overflow-hidden relative border border-slate-800">
                    <Image
                      src={RELEASES[activeRelease].image}
                      alt="Label"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute w-4 h-4 bg-[#030014] rounded-full" />
                </motion.div>

                {/* Album Cover */}
                <div className="absolute inset-0 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <Image
                    src={RELEASES[activeRelease].image}
                    alt={RELEASES[activeRelease].title}
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                  {/* Subtle reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay rounded-md pointer-events-none" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. TRACKLIST & DETAILS
          ========================================== */}
      <section id="about" className="py-24 bg-[#050318] border-y border-white/5 relative z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="text-[10px] uppercase tracking-widest font-bold text-purple-500 block mb-4">
                About the Album
              </span>
              <h3 className="text-3xl font-bold mb-6">
                A Journey Through Synthetic Soundscapes.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                The highly anticipated sophomore album fuses vintage analog
                synthesis with cutting-edge spatial audio production. It's a
                cinematic experience designed for late-night drives and
                introspective coding sessions.
              </p>
              <div className="flex flex-col gap-4">
                <button className="w-full py-4 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors rounded-sm">
                  Pre-save on Spotify
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors rounded-sm">
                  Pre-save on Apple Music
                </button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="border border-white/10 rounded-xl bg-[#030014]/50 backdrop-blur-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                  <h4 className="text-xs font-bold uppercase tracking-widest">
                    Tracklist
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    6 Tracks • 25:21
                  </span>
                </div>

                <div className="flex flex-col">
                  {TRACKLIST.map((track, i) => (
                    <div
                      key={i}
                      className={`group flex items-center justify-between p-4 px-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${track.highlight ? "bg-purple-500/10" : ""}`}
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className={`font-mono text-xs ${track.highlight ? "text-purple-400" : "text-slate-600"} group-hover:hidden`}
                        >
                          {track.num}
                        </span>
                        <Play
                          className={`w-4 h-4 hidden group-hover:block ${track.highlight ? "text-purple-400" : "text-white"}`}
                        />
                        <span
                          className={`font-medium ${track.highlight ? "text-purple-300" : "text-slate-300"}`}
                        >
                          {track.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-8 text-xs font-mono text-slate-500">
                        <span className="hidden md:block">{track.plays}</span>
                        <span>{track.duration}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-pink-500">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURED ARTISTS (Bento Grid)
          ========================================== */}
      <section id="contact" className="py-32 bg-[#030014]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              The Collective
            </h2>
            <p className="text-slate-400">
              Discover the minds behind the frequencies.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Main Artist */}
            <Reveal className="md:col-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1516280440502-6138c233157e?q=80&w=1200&auto=format&fit=crop"
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-purple-500/30">
                  Lead Producer
                </div>
                <h3 className="text-4xl font-bold">Kaelen Vance</h3>
              </div>
            </Reveal>

            {/* Vocalist */}
            <Reveal
              delay={0.2}
              className="relative rounded-2xl overflow-hidden group"
            >
              <Image
                src="https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b5?q=80&w=800&auto=format&fit=crop"
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-pink-500/30">
                  Vocals
                </div>
                <h3 className="text-2xl font-bold">Lumina</h3>
              </div>
            </Reveal>

            {/* Studio / Label */}
            <Reveal
              delay={0.4}
              className="relative rounded-2xl overflow-hidden group bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <div className="text-center p-8">
                <Mic2 className="w-12 h-12 text-slate-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">Neon Records</h3>
                <p className="text-sm text-slate-400">
                  Independent label pushing the boundaries of electronic music
                  since 2018.
                </p>
                <button className="mt-6 text-[10px] uppercase tracking-widest font-bold text-purple-400 hover:text-white transition-colors pb-1 border-b border-purple-500/30 hover:border-white">
                  Read Manifesto
                </button>
              </div>
            </Reveal>

            {/* Visual Artist */}
            <Reveal
              delay={0.6}
              className="md:col-span-2 relative rounded-2xl overflow-hidden group"
            >
              <Image
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop"
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-blue-500/30">
                  Visuals & 3D
                </div>
                <h3 className="text-3xl font-bold">Studio Void</h3>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. TOUR DATES
          ========================================== */}
      <section className="py-32 bg-[#050318] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-purple-500 block mb-4">
                Live Experiences
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                Global Tour '24
              </h2>
            </div>
            <button className="hidden md:block px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
              All Dates
            </button>
          </Reveal>

          <div className="flex flex-col">
            {TOUR_DATES.map((tour, i) => {
              const isSoldOut = tour.status === "Sold Out";
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-8 md:w-1/3 mb-4 md:mb-0">
                      <span className="font-mono text-xl text-purple-400 w-24">
                        {tour.date}
                      </span>
                      <h4 className="text-xl font-bold">{tour.city}</h4>
                    </div>
                    <div className="md:w-1/3 text-slate-400 mb-4 md:mb-0">
                      {tour.venue}
                    </div>
                    <div className="md:w-1/3 flex justify-start md:justify-end">
                      {isSoldOut ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-6 py-3 border border-slate-800 rounded-sm">
                          Sold Out
                        </span>
                      ) : (
                        <button className="text-[10px] font-bold uppercase tracking-widest text-black bg-purple-500 px-6 py-3 rounded-sm hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                          Get Tickets
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#02000a] pt-32 pb-12 px-6 md:px-12 border-t border-purple-900/20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <Link
                href="#hero"
                className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2"
              >
                <Disc3 className="w-6 h-6 text-purple-500" />
                SONIC<span className="font-light text-slate-500">WAVE</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Independent record label and artist collective exploring the
                intersection of synthetic audio and digital art.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Spt
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Apl
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Ytb
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-6">
                Music
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Latest Releases
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Playlists
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Stems & Samples
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-6">
                Store
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Vinyl & Cassettes
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Apparel
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Posters
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Digital Downloads
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-6">
                Join the Frequency
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                Get early access to tour tickets and limited vinyl pressing
                announcements.
              </p>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-bold text-purple-400 hover:text-white transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest font-bold text-slate-600">
            <span>
              &copy; {new Date().getFullYear()} SonicWave Records. All rights
              reserved.
            </span>
            <div className="flex gap-6">
              <Link href="#contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#contact" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
