"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Layers } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function CarbonLayout({
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
    if (href === "/templates/impact-65") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Materials", href: "/templates/impact-65/materials" },
    { label: "Research", href: "/templates/impact-65/research" },
    { label: "Contact", href: "/templates/impact-65/contact" },
  ];

  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-screen selection:bg-[#0070f3] selection:text-white overflow-x-hidden relative">
      
      {/* ── CARBON TEXTURE OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-65" className="flex items-center gap-4 group">
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div className="w-10 h-10 bg-[#0070f3] flex items-center justify-center group-hover:-skew-x-12 transition-transform duration-500">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Carbon<span className="text-[#0070f3]">Lab</span></span>
          </>
          )}</Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`hover:text-[#0070f3] transition-colors ${isActive(l.href) ? "text-[#0070f3]" : "text-white/40"}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <Link href="/templates/impact-65/materials" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-8 decoration-[#0070f3]/30">
              Engineer Portal
            </Link>
            <Link href="/templates/impact-65/contact" className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#0070f3] hover:text-white transition-all duration-500 italic">
              Get Quote
            </Link>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2">
                <Menu className="w-6 h-6 text-white" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#050505] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left font-black uppercase tracking-tighter">
                  <Link href="/templates/impact-65" className="text-4xl hover:text-[#0070f3] transition-all italic">Home</Link>
                  {navLinks.map(l => (
                    <Link key={l.href} href={l.href} className="text-4xl hover:text-[#0070f3] transition-all italic">{l.label}</Link>
                  ))}
                  <Link href="/templates/impact-65/legal" className="text-4xl hover:text-[#0070f3] transition-all italic">Legal</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Spacer for Fixed Nav */}
      <div className="h-28" />

      {/* ── CHILDREN CONTENT ── */}
      <main>
        {children}
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 border-t border-white/5 font-sans relative z-[60]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/templates/impact-65" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-[#0070f3] flex items-center justify-center -skew-x-12">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase text-white italic">Carbon Lab.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Materials define the limit. We push the limit. Engineering the foundation of future performance."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Journal", "SLA Reports", "Network"].map(s => (
                   <Link key={s} href="/templates/impact-65/contact" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#0070f3] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "MATERIALS", l: [
               { name: "UD Carbon", href: "/templates/impact-65/materials" },
               { name: "Woven Weave", href: "/templates/impact-65/materials" },
               { name: "Forged Composite", href: "/templates/impact-65/materials" },
               { name: "Hybrid Mesh", href: "/templates/impact-65/materials" },
             ] },
             { t: "INDUSTRIES", l: [
               { name: "Formula 1", href: "/templates/impact-65/research" },
               { name: "Orbital Hub", href: "/templates/impact-65/research" },
               { name: "Marine Tech", href: "/templates/impact-65/research" },
               { name: "Performance Cycle", href: "/templates/impact-65/research" },
             ] },
             { t: "RESOURCES", l: [
               { name: "Lab Data", href: "/templates/impact-65/contact" },
               { name: "Safety Sheets", href: "/templates/impact-65/contact" },
               { name: "Mentions Légales", href: "/templates/impact-65/legal/mentions-legales" },
               { name: "Confidentialité", href: "/templates/impact-65/legal/confidentialite" },
               { name: "CGU", href: "/templates/impact-65/legal/cgu" },
             ] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3]/40">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link.name} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href={link.href}>{link.name}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 CARBON LAB ADVANCED MATERIALS AG. STRENGTH IN WEIGHT.</span>
           <div className="flex gap-12">
              <Link href="/templates/impact-65/legal" className="hover:text-white transition-all underline decoration-[#0070f3]/30">Mentions Légales</Link>
              <Link href="/templates/impact-65/legal" className="hover:text-white transition-all underline decoration-[#0070f3]/30">Confidentialité</Link>
              <Link href="/templates/impact-65/legal" className="hover:text-white transition-all underline decoration-[#0070f3]/30">CGU</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
