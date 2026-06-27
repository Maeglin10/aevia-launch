"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu as MenuIcon, Globe, Mail, ArrowRight } from "lucide-react"

const LINKS = [
  { name: 'Home', path: '/templates/impact-04' },
  { name: 'Menu', path: '/templates/impact-04/menu' },
  { name: 'Reservation', path: '/templates/impact-04/reservation' },
  { name: 'About', path: '/templates/impact-04/about' },
  { name: 'Contact', path: '/templates/impact-04/contact' }
];

function Navbar({ currentPage }: { currentPage: string }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0c0a08]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
        <Link href="/templates/impact-04" className="bg-transparent border-none text-[#f5efe6] text-left cursor-pointer">
          <span className="text-2xl tracking-wide"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {LINKS.map(item => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-[10px] uppercase tracking-[0.25em] font-sans font-medium bg-transparent border-none transition-all duration-200 cursor-pointer \${currentPage === item.name.toLowerCase() ? 'text-[#f5efe6]' : 'text-[#f5efe6]/40 hover:text-[#f5efe6]'}`}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/templates/impact-04/reservation" className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-[10px] uppercase tracking-[0.2em] font-sans font-bold transition-all duration-200 rounded-sm cursor-pointer text-white">
            Reserve a Table
          </Link>
        </div>

        <Sheet>
          <SheetTrigger className="lg:hidden cursor-pointer"><MenuIcon className="w-5 h-5 text-[#f5efe6]" /></SheetTrigger>
          <SheetContent side="right" className="bg-[#0c0a08] border-white/10 text-[#f5efe6]">
            <div className="flex flex-col gap-8 mt-12">
              <span className="text-xl mb-6"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span>
              {LINKS.map(item => (
                <Link key={item.name} href={item.path} className="text-2xl font-light italic text-left bg-transparent border-none text-[#f5efe6] hover:text-amber-500 transition-all duration-200 cursor-pointer">{item.name}</Link>
              ))}
              <Link href="/templates/impact-04/reservation" className="mt-4 px-8 py-3 bg-amber-700 hover:bg-amber-600 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-white text-center">
                Reserve a Table
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/5 bg-[#0a0806] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        <div className="col-span-2 md:col-span-1">
          <span className="text-2xl mb-4 block"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span>
          <p className="text-sm font-sans text-[#f5efe6]/30 leading-relaxed">Two Michelin star restaurant in the heart of Paris. Cuisine driven by season, instinct, and provenance.</p>
        </div>
        {[
          { title: "Experience", items: [{ label: "Menu", path: "/templates/impact-04/menu" }, { label: "Reservations", path: "/templates/impact-04/reservation" }] },
          { title: "About", items: [{ label: "Our Story", path: "/templates/impact-04/about" }, { label: "Contact", path: "/templates/impact-04/contact" }] },
          { title: "Legal", items: [{ label: "Mentions Légales", path: "/templates/impact-04/mentions" }, { label: "Confidentialité", path: "/templates/impact-04/privacy" }] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-[9px] font-sans font-bold text-[#f5efe6]/30 uppercase tracking-[0.3em] mb-5">{col.title}</h4>
            <ul className="space-y-3">
              {col.items.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className="text-sm font-sans text-[#f5efe6]/50 hover:text-amber-400 transition-all duration-200 cursor-pointer bg-transparent border-none p-0 text-left block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator className="bg-white/5 mb-10" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider">&copy; 2026 L&apos;Étoile Paris · All Rights Reserved</span>
        <div className="flex gap-4">
          {[<Globe key="ig" className="w-4 h-4" />, <Globe key="fb" className="w-4 h-4" />, <Globe key="tw" className="w-4 h-4" />, <Mail key="mail" className="w-4 h-4" />].map((icon, i) => (
            <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#f5efe6]/30 hover:text-amber-500 hover:border-amber-600 transition-all duration-200 cursor-pointer">
              {icon}
            </a>
          ))}
        </div>
        <span className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider">Michelin ★★ · Paris, France</span>
      </div>
    </footer>
  )
}

export default function AboutPage() {
  return (
    <div className="bg-[#0c0a08] text-[#f5efe6] min-h-screen selection:bg-amber-700 selection:text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <Navbar currentPage="about" />
      <main style={{ padding: '120px 24px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">History</span>
          <h1 className="text-4xl md:text-5xl font-light text-[#f5efe6] font-serif mb-4">
            Our <span className="italic">Story</span>
          </h1>
          <p className="text-sm text-[#f5efe6]/35 leading-relaxed">
            Learn about our culinary heritage and vision.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 15, lineHeight: 1.8, color: 'rgba(245,239,230,0.6)' }}>
          <p>
            Chef Antoine Beaumont grew up among the lavender fields and olive groves of the Var, where his grandmother taught him that great cooking begins with reverence for the ingredient. After training at Le Cordon Bleu Paris and a seven-year apprenticeship under Alain Ducasse at Louis XV in Monaco, he opened L&apos;Étoile in 2018 with a singular vision: cuisine that honours its origins.
          </p>
          <p>
            The first Michelin star arrived in 2020. The second followed in 2022. Today, L&apos;Étoile holds a permanent position among France&apos;s most coveted dining destinations — a place where classical French technique and contemporary sensitivity produce something entirely its own.
          </p>
          <p>
            We source all our ingredients from local organic farms and biodynamic vineyards, upholding a zero food waste policy and supporting small-scale producers.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
