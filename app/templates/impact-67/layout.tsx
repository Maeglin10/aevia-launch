"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Radio, Globe, Mail, Shield } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MagneticBtn, Reveal } from "./shared";

import "../premium.css";

export default function VisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpen = () => setTourOpen(true);
    window.addEventListener("open-vision-scan", handleOpen);
    return () => window.removeEventListener("open-vision-scan", handleOpen);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-67") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Portfolio", href: "/templates/impact-67/portfolio" },
    { label: "Spatial_Anatomy", href: "/templates/impact-67/spaces" },
    { label: "Consultation", href: "/templates/impact-67/contact" },
  ];

  return (
    <div
      className="premium-theme min-h-screen bg-[#050505] text-white font-mono selection:bg-rose-600 selection:text-white overflow-x-hidden relative"
      style={{ scrollBehavior: "smooth" }}
    >
      <style>{`::-webkit-scrollbar{width:4px;background:#050505}::-webkit-scrollbar-thumb{background:rgba(225,29,72,0.2)}`}</style>

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#050505]/95 backdrop-blur-md py-4 border-b border-white/5 shadow-lg" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-67" className="flex flex-col items-start" style={{ textDecoration: "none" }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40 mb-1">
              Plan.
            </span>
            <span className="text-xl md:text-2xl font-black tracking-[-0.04em] uppercase text-rose-600 italic">
              VISION<span className="text-white">.067</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-rose-600 transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#e11d48" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />
              <span>Lat: 45.322 // Lon: 0.127</span>
            </div>
            <MagneticBtn
              onClick={() => setTourOpen(true)}
              className="px-8 py-3 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-white hover:text-black transition-all shadow-xl shadow-rose-600/20 cursor-pointer"
            >
              START_SCAN
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden bg-transparent border-none text-white cursor-pointer">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-[#050505] p-8 pt-32 flex flex-col border-l border-white/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 bg-transparent border-none text-white cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic">
              <Link href="/templates/impact-67" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                Home
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/legal/mentions-legales" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                Regulatory
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-28" />

      {/* MAIN CONTENT */}
      <main className="relative z-10">
        {children}
      </main>

      {/* ==========================================
          MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#0a0a0a] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30 mb-1">
                    Plan.
                  </span>
                  <span className="text-2xl font-black tracking-[-0.04em] uppercase text-rose-600 italic">
                    VISION<span className="text-white">.067</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  Digitizing the physical world into volumetric data streams.
                  Built for the next era of luxury real estate.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="AUTHENTICATED_EMAIL"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-rose-600 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-600 hover:text-white transition-colors uppercase tracking-[0.3em] bg-transparent border-none cursor-pointer"
                  >
                    CONNECT
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-10">
                Nodes
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-67/portfolio" className="hover:text-rose-600 transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    NYC_Cluster
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-67/portfolio" className="hover:text-rose-600 transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    LDN_Hub
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-67/portfolio" className="hover:text-rose-600 transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    DXB_Node
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-10">
                The_Engine
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-67/spaces" className="hover:text-rose-600 transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Spatial_SDK
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-67/spaces" className="hover:text-rose-600 transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Neural_Rendering
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-10">
                Terminal
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-67/contact" className="hover:text-rose-600 transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-67/contact" className="hover:text-rose-600 transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Mail className="w-3 h-3" /> Contact_IRL
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} Vision Real Estate SA.
              </span>
              <Link href="/legal/mentions-legales" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Regulatory_Terms
              </Link>
            </div>
            <div className="flex gap-10">
              <span>NYC // London // Dubai</span>
              <span>Space As Data</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SCAN MODAL */}
      <Dialog open={tourOpen} onOpenChange={setTourOpen}>
        <DialogContent className="bg-[#050505] border border-rose-600/20 max-w-lg p-12 rounded-none shadow-2xl relative text-white outline-none">
          <button
            onClick={() => setTourOpen(false)}
            className="absolute top-8 right-8 text-white/20 hover:text-rose-600 transition-colors bg-transparent border-none cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-rose-600 mb-4 block">
              Secure Access
            </span>
            <h3 className="text-4xl font-black uppercase tracking-tighter italic">
              Initialize Node.
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                Authentication_Key
              </label>
              <input
                type="text"
                placeholder="NODE_ACCESS_0x00"
                className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                Target_Property
              </label>
              <select className="w-full bg-[#0a0a0a] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest">
                <option>Tribeca Penthouse</option>
                <option>Knightsbridge Suite</option>
                <option>Palm Jumeirah</option>
              </select>
            </div>
            <div className="pt-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/20 italic">
              <Shield className="w-4 h-4 text-rose-600" />
              Encrypted Stream Enabled
            </div>
            <button
              onClick={() => { setTourOpen(false); alert("Scanning session initialized on FIPS secure node."); }}
              className="w-full py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer border-none"
            >
              Initialize_Scan_Session
            </button>
            <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-bold">
              Node activation requires FIPS 140-2 verification.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
