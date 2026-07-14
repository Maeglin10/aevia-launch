"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu, MapPin, Globe, Mail } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SERVICES, MagneticBtn, Reveal } from "./shared";

import "../premium.css";

export default function AtelierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [__layoutSession, __setLayoutSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(__setLayoutSession)
      .catch(() => {});
  }, []);
  const fd = __layoutSession?.formData;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpen = () => setBookingOpen(true);
    window.addEventListener("open-atelier-booking", handleOpen);
    return () => window.removeEventListener("open-atelier-booking", handleOpen);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-66") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Services", href: "/templates/impact-66/services" },
    { label: "Rituals", href: "/templates/impact-66/rituals" },
    { label: "Contact", href: "/templates/impact-66/contact" },
  ];

  return (
    <div
      className="premium-theme min-h-dvh bg-[#faf9f6] text-[#1a1814] font-sans selection:bg-[#c9b7a1] selection:text-white overflow-x-hidden relative"
      style={{ scrollBehavior: "smooth" }}
    >
      <style>{`::-webkit-scrollbar{width:4px;background:#faf9f6}::-webkit-scrollbar-thumb{background:#c9b7a140}`}</style>

      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#faf9f6]/95 backdrop-blur-md py-4 border-b border-[#1a1814]/5 shadow-sm" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-66" className="flex flex-col items-center" style={{ textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <span className="text-[10px] md:text-[12px] font-light uppercase tracking-[0.6em] text-[#1a1814]/40 mb-1">
              L'Atelier
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase text-[#1a1814]">
              BEAUTÉ
            </span>
          </>
          )}</Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1814]/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#1a1814] transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#1a1814" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>PARIS VIII</span>
            </div>
            <MagneticBtn
              onClick={() => setBookingOpen(true)}
              className="px-8 py-3 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all shadow-xl cursor-pointer"
            >
              RÉSERVER
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden bg-transparent border-none cursor-pointer text-[#1a1814]">
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
            className="fixed inset-0 z-[100] bg-[#faf9f6] p-8 pt-32 flex flex-col border-l border-black/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 bg-transparent border-none cursor-pointer text-[#1a1814]"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light tracking-tighter uppercase italic">
              <Link href="/templates/impact-66" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                Accueil
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/templates/impact-66/legal" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                Mentions Légales
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for navigation */}
      <div className="h-28" />

      {/* ── CHILDREN CONTENT ── */}
      <main>
        {children}
      </main>

      {/* ── MEGA FOOTER ── */}
      <footer className="bg-[#1a1814] pt-32 pb-12 px-6 md:px-12 relative overflow-hidden text-white">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30 mb-1">
                    L'Atelier
                  </span>
                  <span className="text-2xl font-light tracking-[0.4em] uppercase">
                    BEAUTÉ
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  Une exploration architecturale de la beauté. Précision, pureté
                  et rituels d'exception au cœur de Paris.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                Services
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-66/services" className="hover:text-[#c9b7a1] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Nail_Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-66/services" className="hover:text-[#c9b7a1] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Lash_Couture
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-66/services" className="hover:text-[#c9b7a1] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Ritual_Facials
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                L'Atelier
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-66/rituals" className="hover:text-[#c9b7a1] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Philosophie
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-66/contact" className="hover:text-[#c9b7a1] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Carte_Cadeau
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-66/contact" className="hover:text-[#c9b7a1] transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-66/contact" className="hover:text-[#c9b7a1] transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Mail className="w-3 h-3" /> valentinmilliand@aevia.services
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} L'Atelier de Beauté.
              </span>
              <Link href="/templates/impact-66/legal" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Regulatory_Terms
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Paris VIII // Lyon // Bordeaux</span>
              <span>The Art of Precision</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="bg-[#faf9f6] border border-[#1a1814]/10 max-w-2xl p-12 rounded-3xl shadow-2xl relative text-[#1a1814] outline-none">
          <button
            onClick={() => setBookingOpen(false)}
            className="absolute top-8 right-8 text-[#1a1814]/20 hover:text-[#c9b7a1] transition-colors bg-transparent border-none cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9b7a1] mb-4 block">
              Espace Réservation
            </span>
            <h3 className="text-4xl font-light uppercase tracking-tighter italic">
              Book your Ritual.
            </h3>
          </div>

          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 bg-black/5 p-1 rounded-full border-none">
              <TabsTrigger
                value="service"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                1. Service
              </TabsTrigger>
              <TabsTrigger
                value="date"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                2. Date
              </TabsTrigger>
              <TabsTrigger
                value="confirm"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                3. Confirm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="space-y-4">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { alert(`Selected: ${s.name}`); }}
                  className="flex justify-between items-center p-6 border border-black/5 hover:border-[#c9b7a1] rounded-2xl cursor-pointer group transition-all"
                >
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">
                      {s.name}
                    </h4>
                    <span className="text-[10px] text-[#1a1814]/40 font-bold uppercase tracking-widest">
                      {s.tag}
                    </span>
                  </div>
                  <span className="text-sm font-black text-[#c9b7a1]">
                    {s.price}
                  </span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="date" className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1814]/30">
                  Select Date
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold cursor-pointer border ${i === 3 ? "bg-[#1a1814] text-white" : "border-black/5 hover:border-[#c9b7a1]"}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1814]/30">
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map(
                    (t) => (
                      <div
                        key={t}
                        className="py-3 px-4 border border-black/5 rounded-xl text-[10px] font-bold text-center cursor-pointer hover:border-[#c9b7a1]"
                      >
                        {t}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="confirm" className="space-y-8 py-10">
              <div className="p-8 bg-black/5 rounded-2xl space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                  <span className="text-[#1a1814]/40">Service</span>
                  <span>Architectural Nails</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                  <span className="text-[#1a1814]/40">Date</span>
                  <span>12 Mai 2026 @ 14:00</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest pt-2">
                  <span className="text-[#1a1814]/40">Total</span>
                  <span className="text-[#c9b7a1]">85.00 €</span>
                </div>
              </div>
              <button
                onClick={() => { setBookingOpen(false); alert("Réservation validée ! Un email de confirmation a été envoyé."); }}
                className="w-full py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all border-none cursor-pointer"
              >
                Finaliser la Réservation
              </button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
