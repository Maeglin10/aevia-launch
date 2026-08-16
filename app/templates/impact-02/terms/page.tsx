"use client";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;
import "../../premium.css";


export default function TermsPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="premium-theme bg-[#0a0a0a] text-white min-h-dvh selection:bg-amber-400 selection:text-black overflow-x-hidden font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference bg-black/50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
          <Link href="/templates/impact-02" className="relative z-50 group">
            <span className="text-lg font-light tracking-[0.3em] uppercase transition-colors group-hover:text-amber-400">
              Elena<span className="font-black">Korr</span>
            </span>
          </Link>
          <Link href="/templates/impact-02" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>
      </nav>

      <section className="pt-48 pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">Legal</span>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight leading-none mb-12">
              Terms of <span className="font-black italic">Service</span>
            </h1>
            <div className="space-y-8 text-white/60 font-light leading-relaxed text-lg">
              <p>
                These terms and conditions outline the rules and regulations for the use of Elena Korr Studio's Website.
              </p>
              <h2 className="text-2xl font-medium text-white mt-12 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use Elena Korr Studio if you do not agree to take all of the terms and conditions stated on this page.
              </p>
              <h2 className="text-2xl font-medium text-white mt-12 mb-4">2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise stated, Elena Korr Studio and/or its licensors own the intellectual property rights for all material on this site. All intellectual property rights are reserved. You may access this from Elena Korr Studio for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p>
                You must not:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Republish material from Elena Korr Studio</li>
                <li>Sell, rent or sub-license material from Elena Korr Studio</li>
                <li>Reproduce, duplicate or copy material from Elena Korr Studio</li>
                <li>Redistribute content from Elena Korr Studio</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#050505] pt-20 pb-12 px-6 md:px-12 border-t border-white/5 mt-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest font-mono">&copy; {new Date().getFullYear()} Elena Korr Studio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
