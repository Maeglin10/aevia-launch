// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Satellite } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GridBackground } from "./shared";

export default function OrbitAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/templates/impact-75" },
    { name: "Constellation", href: "/templates/impact-75/constellation" },
    { name: "Intelligence", href: "/templates/impact-75/intelligence" },
    { name: "Telemetry", href: "/templates/impact-75/telemetry" },
  ];

  return (
    <div className="bg-[#050810] text-[#a0a0a0] font-mono min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden flex flex-col justify-between">
      <div>
        {/* ── MISSION CONTROL OVERLAY ── */}
        <div className="fixed inset-0 pointer-events-none z-[60] border-[40px] border-[#050810] opacity-40 md:opacity-100" />
        <div className="fixed top-20 left-20 pointer-events-none text-[10px] font-bold text-cyan-500/20 uppercase tracking-widest z-[70] hidden lg:block">
          Orbit_AI // Mission_Control_Active
        </div>

        {/* ── NAVBAR ────────────────── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
            scrolled
              ? "bg-[#050810]/95 backdrop-blur-xl border-b border-white/5 py-4"
              : "bg-transparent py-10"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
            <Link href="/templates/impact-75" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Satellite className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase text-white italic">
                Orbit<span className="text-cyan-500">AI</span>
              </span>
            </Link>
            <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? "text-cyan-500"
                      : "text-white/30 hover:text-cyan-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-8">
              <Link href="/templates/impact-75/telemetry">
                <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-cyan-500/30">
                  Network Status
                </button>
              </Link>
              <Link href="/templates/impact-75/contact">
                <button className="px-10 py-3.5 border border-cyan-500/40 text-cyan-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all duration-500">
                  Initiate Uplink
                </button>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2">
                    <Menu className="w-6 h-6 text-white" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-[#050810] border-white/5 p-12 text-white font-mono"
                >
                  <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-4xl hover:text-cyan-500 transition-all italic"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      href="/templates/impact-75/contact"
                      className="text-4xl hover:text-cyan-500 transition-all italic"
                    >
                      Contact
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <main className="pt-20">{children}</main>
      </div>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050810] pt-40 pb-12 px-6 border-t border-white/5 relative z-[70]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
          <div className="md:col-span-2">
            <Link href="/templates/impact-75" className="flex items-center gap-4 mb-10 group">
              <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase text-white italic">
                Orbit AI.
              </span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
              "Situational awareness is no longer a luxury. It is the primary
              variable of global leadership. Master the orbit."
            </p>
            <div className="flex gap-10">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-500 transition-colors italic"
              >
                GitHub
              </a>
              <Link
                href="/templates/impact-75/legal"
                className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-500 transition-colors italic"
              >
                Legal Hub
              </Link>
              <Link
                href="/templates/impact-75/contact"
                className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-500 transition-colors italic"
              >
                Contact
              </Link>
            </div>
          </div>

          {[
            {
              t: "CONSTELLATION",
              l: [
                { name: "Orbit_01: LEO", href: "/templates/impact-75/constellation" },
                { name: "Orbit_02: MEO", href: "/templates/impact-75/constellation" },
                { name: "Custom Nodes", href: "/templates/impact-75/constellation" },
              ],
            },
            {
              t: "INTELLIGENCE",
              l: [
                { name: "Maritime Lab", href: "/templates/impact-75/intelligence" },
                { name: "Energy Audit", href: "/templates/impact-75/intelligence" },
                { name: "Defense Intel", href: "/templates/impact-75/intelligence" },
              ],
            },
            {
              t: "SYSTEM",
              l: [
                { name: "Mission Control", href: "/templates/impact-75" },
                { name: "Security Protocol", href: "/templates/impact-75/telemetry" },
                { name: "Legal Hub", href: "/templates/impact-75/legal/mentions-legales" },
              ],
            },
          ].map((col, i) => (
            <div key={i} className="space-y-12">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-cyan-500/40">
                {col.t}
              </h4>
              <ul className="space-y-6">
                {col.l.map((link) => (
                  <li
                    key={link.name}
                    className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic"
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
          <span>© 2026 ORBIT AI GLOBAL NETWORK AG. THE UNIVERSAL EYE.</span>
          <div className="flex gap-12">
            <Link
              href="/templates/impact-75/telemetry"
              className="hover:text-cyan-500 transition-all underline decoration-cyan-500/20"
            >
              UPLINK: ACTIVE
            </Link>
            <Link
              href="/templates/impact-75/legal"
              className="hover:text-cyan-500 transition-all underline decoration-cyan-500/20"
            >
              SECURITY_LEVEL: OMEGA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
