"use client";
import {
  clientCity,
  clientEmail,
  clientName,
} from "@/lib/templates/clientContent";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X, Menu, MapPin, Globe, Mail } from "lucide-react";
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setLayoutSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);
  const fd = __layoutSession?.formData;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTab, setBookingTab] = useState("service");

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  const bookingDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
      }),
    [],
  );

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) ?? null;
  const selectedDay =
    selectedDayOffset !== null ? bookingDays[selectedDayOffset] : null;

  const resetBooking = useCallback(() => {
    setBookingTab("service");
    setSelectedServiceId(null);
    setSelectedDayOffset(null);
    setSelectedTime(null);
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setBookingLoading(false);
    setBookingSent(false);
  }, []);

  const handleBookingOpenChange = useCallback(
    (open: boolean) => {
      setBookingOpen(open);
      if (!open) {
        // Let the closing animation finish before wiping the form.
        setTimeout(resetBooking, 300);
      }
    },
    [resetBooking],
  );

  const handleConfirmBooking = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedService || !selectedDay || !selectedTime) return;
      setBookingLoading(true);
      setTimeout(() => {
        setBookingLoading(false);
        setBookingSent(true);
      }, 2000);
    },
    [selectedService, selectedDay, selectedTime],
  );

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
          ) : (/* NOM_LOGO */ clientName(__layoutSession) ? (
              <span className="text-[10px] md:text-[12px] font-light uppercase tracking-[0.6em] text-[#1a1814]/40 mb-1">{clientName(__layoutSession)}</span>
            ) : (<>
            <>
            <span className="text-[10px] md:text-[12px] font-light uppercase tracking-[0.6em] text-[#1a1814]/40 mb-1">
              L'Atelier
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase text-[#1a1814]">
              BEAUTÉ
            </span>
          </>
          </>))}</Link>

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
              <span>{clientCity(__layoutSession) ?? "PARIS"} VIII</span>
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
                  et rituels d'exception au cœur de {clientCity(__layoutSession) ?? "Paris"}.
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
                    <Mail className="w-3 h-3" /> {clientEmail(__layoutSession) ?? "contact@exemple.fr"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} {clientName(__layoutSession) ?? "L'Atelier de Beauté"}.
              </span>
              <Link href="/templates/impact-66/legal" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Regulatory_Terms
              </Link>
            </div>
            <div className="flex gap-10">
              <span>{clientCity(__layoutSession) ?? "Paris"} VIII // {clientCity(__layoutSession) ?? "Lyon"} // {clientCity(__layoutSession) ?? "Bordeaux"}</span>
              <span>The Art of Precision</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={handleBookingOpenChange}>
        <DialogContent className="bg-[#faf9f6] border border-[#1a1814]/10 max-w-2xl max-h-[88vh] overflow-y-auto p-12 rounded-3xl shadow-2xl relative text-[#1a1814] outline-none">
          <button
            onClick={() => handleBookingOpenChange(false)}
            disabled={bookingLoading}
            aria-label="Fermer"
            className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center text-[#1a1814]/20 hover:text-[#c9b7a1] transition-colors bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="w-6 h-6" />
          </button>

          <AnimatePresence mode="wait">
            {bookingSent ? (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
                  className="w-16 h-16 rounded-full bg-[#c9b7a1]/15 border border-[#c9b7a1] text-[#c9b7a1] flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="w-7 h-7" />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9b7a1] mb-4 block">
                  Réservation confirmée
                </span>
                <h3 className="text-3xl font-light uppercase tracking-tighter italic mb-8">
                  À bientôt, {contactName.split(" ")[0] || "cher client"}.
                </h3>
                <div className="p-8 bg-black/5 rounded-2xl space-y-4 text-left mb-10">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                    <span className="text-[#1a1814]/40">Service</span>
                    <span>{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                    <span className="text-[#1a1814]/40">Date</span>
                    <span>
                      {selectedDay?.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} @ {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest pt-2">
                    <span className="text-[#1a1814]/40">Total</span>
                    <span className="text-[#c9b7a1]">{selectedService?.price}</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/30 mb-10">
                  Un email de confirmation a été envoyé à {contactEmail}.
                </p>
                <button
                  onClick={() => handleBookingOpenChange(false)}
                  className="w-full min-h-[44px] py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all border-none cursor-pointer"
                >
                  Fermer
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9b7a1] mb-4 block">
                    Espace Réservation
                  </span>
                  <h3 className="text-4xl font-light uppercase tracking-tighter italic">
                    Book your Ritual.
                  </h3>
                </div>

                <Tabs value={bookingTab} onValueChange={setBookingTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-10 bg-black/5 p-1 rounded-full border-none">
                    <TabsTrigger
                      value="service"
                      className="rounded-full text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-white cursor-pointer"
                    >
                      1. Service{selectedService ? " ✓" : ""}
                    </TabsTrigger>
                    <TabsTrigger
                      value="date"
                      className="rounded-full text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-white cursor-pointer"
                    >
                      2. Date{selectedDay && selectedTime ? " ✓" : ""}
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirm"
                      className="rounded-full text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-white cursor-pointer"
                    >
                      3. Confirm
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="service" className="space-y-4">
                    {SERVICES.map((s) => {
                      const isSelected = s.id === selectedServiceId;
                      return (
                        <div
                          key={s.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedServiceId(s.id);
                            setBookingTab("date");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedServiceId(s.id);
                              setBookingTab("date");
                            }
                          }}
                          className={`flex justify-between items-center p-6 border rounded-2xl cursor-pointer group transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9b7a1] ${isSelected ? "border-[#c9b7a1] bg-[#c9b7a1]/10" : "border-black/5 hover:border-[#c9b7a1]"}`}
                        >
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                              {s.name}
                              {isSelected && <Check className="w-4 h-4 text-[#c9b7a1]" />}
                            </h4>
                            <span className="text-[10px] text-[#1a1814]/40 font-bold uppercase tracking-widest">
                              {s.tag}
                            </span>
                          </div>
                          <span className="text-sm font-black text-[#c9b7a1]">
                            {s.price}
                          </span>
                        </div>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="date" className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1814]/30">
                        Select Date
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {bookingDays.map((d, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedDayOffset(i)}
                            aria-pressed={selectedDayOffset === i}
                            aria-label={d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                            className={`aspect-square min-h-[44px] flex items-center justify-center rounded-xl text-[10px] font-bold cursor-pointer border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9b7a1] ${selectedDayOffset === i ? "bg-[#1a1814] text-white border-[#1a1814]" : "border-black/5 hover:border-[#c9b7a1] bg-transparent"}`}
                          >
                            {d.getDate()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1814]/30">
                        Select Time
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map(
                          (t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setSelectedTime(t);
                                if (selectedDayOffset !== null) setBookingTab("confirm");
                              }}
                              aria-pressed={selectedTime === t}
                              className={`min-h-[44px] py-3 px-4 border rounded-xl text-[10px] font-bold text-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9b7a1] ${selectedTime === t ? "bg-[#1a1814] text-white border-[#1a1814]" : "border-black/5 hover:border-[#c9b7a1] bg-transparent"}`}
                            >
                              {t}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="confirm">
                    <form onSubmit={handleConfirmBooking} className="space-y-8 py-4">
                      <div className="p-8 bg-black/5 rounded-2xl space-y-4">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                          <span className="text-[#1a1814]/40">Service</span>
                          <span>{selectedService?.name ?? "—"}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                          <span className="text-[#1a1814]/40">Date</span>
                          <span>
                            {selectedDay
                              ? `${selectedDay.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}${selectedTime ? ` @ ${selectedTime}` : ""}`
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest pt-2">
                          <span className="text-[#1a1814]/40">Total</span>
                          <span className="text-[#c9b7a1]">{selectedService?.price ?? "—"}</span>
                        </div>
                      </div>

                      {(!selectedService || !selectedDay || !selectedTime) && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/30">
                          Choisissez un service et un créneau avant de finaliser.
                        </p>
                      )}

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label
                            htmlFor="booking-name"
                            className="text-[10px] font-black uppercase tracking-widest text-[#1a1814]/30 block"
                          >
                            Nom complet
                          </label>
                          <input
                            id="booking-name"
                            name="name"
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            disabled={bookingLoading}
                            placeholder="Jean Martin"
                            className="w-full min-h-[44px] bg-white border border-black/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9b7a1] focus-visible:ring-2 focus-visible:ring-[#c9b7a1] disabled:opacity-50"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label
                              htmlFor="booking-email"
                              className="text-[10px] font-black uppercase tracking-widest text-[#1a1814]/30 block"
                            >
                              Email
                            </label>
                            <input
                              id="booking-email"
                              name="email"
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              disabled={bookingLoading}
                              placeholder="jean@domain.com"
                              className="w-full min-h-[44px] bg-white border border-black/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9b7a1] focus-visible:ring-2 focus-visible:ring-[#c9b7a1] disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="booking-phone"
                              className="text-[10px] font-black uppercase tracking-widest text-[#1a1814]/30 block"
                            >
                              Téléphone
                            </label>
                            <input
                              id="booking-phone"
                              name="phone"
                              type="tel"
                              required
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              disabled={bookingLoading}
                              placeholder="06 12 34 56 78"
                              className="w-full min-h-[44px] bg-white border border-black/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9b7a1] focus-visible:ring-2 focus-visible:ring-[#c9b7a1] disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading || !selectedService || !selectedDay || !selectedTime}
                        className="w-full min-h-[44px] py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-3"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Envoi en cours…
                          </>
                        ) : (
                          "Finaliser la Réservation"
                        )}
                      </button>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
