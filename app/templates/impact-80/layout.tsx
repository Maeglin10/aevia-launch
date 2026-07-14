"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SymmetryStudioLayout({
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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const basePath = "/templates/impact-80";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Identity", href: `${basePath}/identity` },
    { label: "Works", href: `${basePath}/works` },
    { label: "Materials", href: `${basePath}/materials` },
    { label: "Contact", href: `${basePath}/contact` },
  ];

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] font-sans min-h-dvh selection:bg-[#1a1a1a] selection:text-white overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
      `}</style>
      
      {/* ── GRID SYSTEM ───────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* ── NAVBAR ────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-4 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div className="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:bg-black transition-all duration-700">
              <Maximize2 className="w-5 h-5 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase">
              Symmetry <span className="font-bold">Studio</span>
            </span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-black transition-colors ${isActive ? "text-black" : "text-black/40"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-8">
            <Link href={`${basePath}/identity`}>
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors underline underline-offset-8 decoration-black/10">
                The Journal
              </span>
            </Link>
            <Link href={`${basePath}/contact`}>
              <button className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-black border border-transparent hover:border-black transition-all duration-700 shadow-xl shadow-black/5">
                Initiate Project
              </button>
            </Link>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger className="lg:hidden p-2">
                <Menu className="w-6 h-6 text-black" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#fcfcfc] border-none p-12 text-black z-[200]">
                <div className="flex flex-col gap-10 mt-16 text-left font-light uppercase tracking-widest">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl hover:italic transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <div className="relative z-10">{children}</div>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcfcfc] pt-40 pb-12 px-6 border-t border-black/5 relative z-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
          <div className="md:col-span-2">
            <Link href={basePath} className="flex items-center gap-4 mb-10 group">
              <div className="w-10 h-10 border border-black/10 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-black">
                Symmetry Studio
              </span>
            </Link>
            <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
              "Architecture is the learned game, correct and magnificent, of forms
              assembled in light."
            </p>
            <div className="flex gap-10">
              {["Camera", "Vimeo", "ArchDaily", "Journal"].map((s) => (
                <Link
                  key={s}
                  href={s === "Camera" ? "https://instagram.com" : s === "Vimeo" ? "https://vimeo.com" : s === "ArchDaily" ? "https://archdaily.com" : `${basePath}/identity`}
                  className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {[
            {
              t: "EXPERTISE",
              links: [
                { l: "Residential", href: `${basePath}/materials` },
                { l: "Commercial", href: `${basePath}/materials` },
                { l: "Interiors", href: `${basePath}/materials` },
                { l: "Landscape", href: `${basePath}/materials` },
              ],
            },
            {
              t: "IDENTITY",
              links: [
                { l: "The Vision", href: `${basePath}/identity` },
                { l: "Works", href: `${basePath}/works` },
                { l: "Philosophy", href: `${basePath}/identity` },
              ],
            },
            {
              t: "ENTITY",
              links: [
                { l: "Mentions légales", href: "/templates/impact-80/legal/mentions-legales" },
                { l: "Confidentialité", href: "/templates/impact-80/legal/confidentialite" },
                { l: "CGU", href: "/templates/impact-80/legal/cgu" },
                { l: "Contact", href: `${basePath}/contact` },
              ],
            },
          ].map((col, i) => (
            <div key={i} className="space-y-12">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">
                {col.t}
              </h4>
              <ul className="space-y-6">
                {col.links.map((link) => (
                  <li
                    key={link.l}
                    className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors italic"
                  >
                    <Link href={link.href}>{link.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
          <span>© 2026 SYMMETRY STUDIO ARCHITECTURE AG. PURE VOLUME.</span>
          <div className="flex gap-12">
            <Link href={`${basePath}/contact`} className="hover:text-black transition-all">
              BASEL
            </Link>
            <Link href={`${basePath}/contact`} className="hover:text-black transition-all">
              BERLIN
            </Link>
            <Link href={`${basePath}/contact`} className="hover:text-black transition-all">
              TOKYO
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
