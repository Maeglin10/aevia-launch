"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../../premium.css";

export default function PrivacyPage() {
  return (
    <div className="premium-theme bg-[#0a0a0a] text-white min-h-screen selection:bg-amber-400 selection:text-black overflow-x-hidden font-sans">
      {/* Navigation */}
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

      {/* Hero */}
      <section className="pt-48 pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">Legal</span>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight leading-none mb-12">
              Privacy <span className="font-black italic">Policy</span>
            </h1>
            <div className="space-y-8 text-white/60 font-light leading-relaxed text-lg">
              <p>
                At Elena Korr Studio, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
              <h2 className="text-2xl font-medium text-white mt-12 mb-4">1. Important Information and Who We Are</h2>
              <p>
                This privacy policy aims to give you information on how Elena Korr Studio collects and processes your personal data through your use of this website, including any data you may provide through this website when you sign up to our newsletter, purchase a product or service, or take part in a competition.
              </p>
              <h2 className="text-2xl font-medium text-white mt-12 mb-4">2. The Data We Collect About You</h2>
              <p>
                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
              </p>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-20 pb-12 px-6 md:px-12 border-t border-white/5 mt-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest font-mono">&copy; {new Date().getFullYear()} Elena Korr Studio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
