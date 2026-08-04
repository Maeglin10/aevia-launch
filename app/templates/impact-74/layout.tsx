// @ts-nocheck
"use client";
import { clientCity } from "@/lib/templates/clientContent";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail } from "lucide-react";
import { Reveal } from "./shared";
import "../premium.css";

export default function CyberSecurityLayout({
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
  return (
    <div
      className="premium-theme min-h-dvh bg-[#05060a] text-white font-mono selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col justify-between"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* page.tsx already renders its own complete nav (correct "Aevia
          Kitchen" restaurant branding, menu links, and mobile drawer) — this
          layout previously ALSO rendered a second, unrelated "AEVIACYBER"
          security-SaaS nav on top of it (orphaned content from a different
          generated template), producing two overlapping logos and CTA
          buttons in the header. Removed; this layout now only supplies the
          footer below. */}
      <div>
        <main>{children}</main>
      </div>

      {/* ==========================================
          7. FOOTER — rebranded from the orphaned "AEVIACYBER" security-SaaS
          copy (see note above) to match the actual Aevia Kitchen restaurant.
          ========================================== */}
      <footer className="bg-[#0a0c14] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                    Gastronomie.
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    AEVIA<span className="text-emerald-500">KITCHEN.</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  Restaurant gastronomique, {clientCity(__layoutSession) ?? "Paris"} 8ème. Cuisine de saison,
                  produits d'exception, service en salle irréprochable.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="VOTRE EMAIL"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-emerald-600 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    S'inscrire
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-10">
                Restaurant
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="/templates/impact-74"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-74#reservation"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    Réserver
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-74/contact"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-10">
                Informations
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="/templates/impact-74/legal"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-10">
                Suivez-nous
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-500 transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Instagram
                  </a>
                </li>
                <li>
                  <Link
                    href="/templates/impact-74/contact"
                    className="hover:text-emerald-500 transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} Aevia Kitchen
              </span>
              <Link href="/templates/impact-74/legal" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
            </div>
            <div className="flex gap-10">
              <span>{clientCity(__layoutSession) ?? "Paris"} 8ème</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#05060a}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,0.2)}
      `}</style>
    </div>
  );
}
