"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Watch, Menu, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StyleInjector, NAV_LINKS } from "./shared";

export default function ZenithLayout({
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

  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-60") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-[#0a0c10] text-[#a0a0a0] font-sans min-h-screen selection:bg-[#c9a96e] selection:text-black overflow-x-hidden relative">
      <StyleInjector />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#0a0c10]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-60" className="flex items-center gap-4 group" style={{ textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div className="w-10 h-10 border border-[#c9a96e]/30 flex items-center justify-center group-hover:border-[#c9a96e] transition-all duration-700">
              <Watch className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Zenith <span className="font-bold">Watch</span></span>
          </>
          )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors" style={{ textDecoration: "none", color: isActive(l.href) ? "white" : "inherit" }}>{l.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8 font-sans">
            <Link href="/templates/impact-60/atelier" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-[#c9a96e]/20" style={{ textDecoration: "none" }}>Legacy Portal</Link>
            <Link href="/templates/impact-60/contact" className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#c9a96e] hover:text-black transition-all duration-700 text-center" style={{ textDecoration: "none" }}>Request Bespoke</Link>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2 bg-transparent border-none cursor-pointer">
                <Menu className="w-6 h-6 text-white" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0c10] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {NAV_LINKS.map(l => (
                    <Link key={l.href} href={l.href} className="text-4xl font-light uppercase tracking-widest hover:italic transition-all" style={{ textDecoration: "none", color: "inherit" }}>{l.label}</Link>
                  ))}
                  <Link href="/templates/impact-60/contact" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all" style={{ textDecoration: "none", color: "inherit" }}>Contact</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ──────────── */}
      <div style={{ paddingTop: scrolled ? "72px" : "112px" }} className="transition-all duration-1000">
        {children}
      </div>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-40 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
          <div className="md:col-span-2">
            <Link href="/templates/impact-60" className="flex items-center gap-4 mb-10 group" style={{ textDecoration: "none" }}>
              <div className="w-10 h-10 border border-[#c9a96e]/30 flex items-center justify-center">
                <Watch className="w-5 h-5 text-[#c9a96e]" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Zenith Watch</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
              &quot;In the silence of the gears, we find the absolute rhythm of existence. Mastered in Geneva since 1892.&quot;
            </p>
            <div className="flex gap-10">
              <Link href="/templates/impact-60/legal" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic" style={{ textDecoration: "none" }}>[Mentions Légales]</Link>
              <Link href="/templates/impact-60/legal" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic" style={{ textDecoration: "none" }}>[Confidentialité]</Link>
              <Link href="/templates/impact-60/legal" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic" style={{ textDecoration: "none" }}>[CGU]</Link>
            </div>
          </div>
          
          {[
            { t: "COLLECTIONS", l: [{ name: "Caliber Series", href: "/templates/impact-60/collections" }, { name: "Limited Editions", href: "/templates/impact-60/collections" }] },
            { t: "THE ATELIER", l: [{ name: "The Movement", href: "/templates/impact-60/movement" }, { name: "Bespoke Lab", href: "/templates/impact-60/contact" }] },
            { t: "SERVICE", l: [
              { name: "Global Registry", href: "/templates/impact-60/contact" },
              { name: "Mentions Légales", href: "/templates/impact-60/legal/mentions-legales" },
              { name: "Confidentialité", href: "/templates/impact-60/legal/confidentialite" },
              { name: "CGU", href: "/templates/impact-60/legal/cgu" }
            ] }
          ].map((col, i) => (
            <div key={i} className="space-y-12">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
              <ul className="space-y-6 list-none p-0">
                {col.l.map(link => (
                  <li key={link.name} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                    <Link href={link.href} style={{ textDecoration: "none", color: "inherit" }}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
          <span>© {new Date().getFullYear()} ZENITH WATCH ATELIER SA. VALENTIN MILLIAND. TIME IS AN ART.</span>
          <div className="flex gap-12">
            <span>GENEVA</span>
            <span>ZURICH</span>
            <span>TOKYO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
