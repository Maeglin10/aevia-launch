"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu as MenuIcon, Globe, Mail, ArrowRight } from "lucide-react"

const MENU_ITEMS = {
  starters: [
    { name: "Burrata Pugliese", desc: "Creamy burrata, heirloom tomatoes from Marmande, aged 12-year balsamic reduction, Ligurian basil oil, fleur de sel", price: "24", tag: "Chef's Pick", allergens: "Dairy" },
    { name: "Tartare de Saumon Écossais", desc: "Hand-cut Scottish salmon, avocado mousse, yuzu gel, crispy shallots, Oscietra caviar", price: "32", tag: "New", allergens: "Fish" },
    { name: "Velouté de Cèpes", desc: "Wild porcini mushroom velouté, truffle cream foam, sourdough croutons, aged parmesan snow", price: "22", allergens: "Gluten, Dairy" },
    { name: "Carpaccio di Manzo Wagyu", desc: "A5 Wagyu beef carpaccio, wild rocket, 36-month parmesan, lemon-caper dressing, truffle oil", price: "38", allergens: "Dairy" },
    { name: "Foie Gras de Canard", desc: "48-hour terrine of duck foie gras, Sauternes gel, toasted brioche, Périgord black truffle shavings", price: "42", tag: "Signature", allergens: "Gluten, Dairy" },
  ],
  mains: [
    { name: "Filet de Bœuf Rossini", desc: "220g prime Charolais tenderloin, pan-seared foie gras, black truffle jus, pomme purée Joël Robuchon", price: "68", tag: "Signature", allergens: "Dairy" },
    { name: "Homard Breton Entier", desc: "Whole Blue Lobster from Brittany, coral thermidor sauce, gratin dauphinois, seasonal micro greens", price: "84" },
    { name: "Risotto al Tartufo Nero", desc: "Carnaroli rice cooked 18 minutes, shaved fresh Périgord truffle, 36-month parmesan, Normandy brown butter", price: "52", allergens: "Dairy" },
    { name: "Sole de Petit Bateau", desc: "Dover sole meunière, capers, lemon beurre blanc, pommes vapeur, samphire", price: "58", allergens: "Fish, Dairy" },
    { name: "Canard de Challans", desc: "48-hour slow-confit duck leg, Griotte cherry reduction, roasted root vegetables, crispy skin", price: "54", tag: "New" },
    { name: "Agneau de Lozère", desc: "Rack of lamb, herb crust, Provençal jus, flageolet bean cassoulet, lamb sweetbread", price: "62", allergens: "Gluten, Dairy" },
  ],
  desserts: [
    { name: "Soufflé Grand Marnier", desc: "Classic soufflé with Valrhona 70% dark chocolate, vanilla bean crème anglaise, candied orange zest", price: "24", tag: "Must Try", allergens: "Gluten, Dairy, Eggs" },
    { name: "Tarte Tatin Tradition", desc: "Caramelized Granny Smith tart, Pays d'Auge calvados ice cream, salted butter caramel", price: "22", allergens: "Gluten, Dairy" },
    { name: "Crème Brûlée Tahitienne", desc: "Double Tahitian vanilla custard, caramelized sugar lacquer, Gariguette strawberries", price: "19", allergens: "Dairy, Eggs" },
    { name: "Assiette Fromagère", desc: "Five aged raw-milk French cheeses, Landes honeycomb, walnut bread, seasonal fruit preserves", price: "28", allergens: "Dairy, Gluten" },
  ],
  wines: [
    { name: "Chablis Premier Cru 'Montée de Tonnerre'", desc: "Domaine William Fèvre · Burgundy, France · 2022 — Mineral, flint, and white stone fruit", price: "90", allergens: "Sulfites" },
    { name: "Châteauneuf-du-Pape Blanc", desc: "Château de Beaucastel · Rhône Valley · 2020 — White peach, honeysuckle, extraordinary weight", price: "145", tag: "Sommelier Pick", allergens: "Sulfites" },
    { name: "Barolo Riserva 'Monfortino'", desc: "Giacomo Conterno · Piedmont, Italy · 2016 — Tar, roses, great tannin structure", price: "220", allergens: "Sulfites" },
    { name: "Dom Pérignon Rosé", desc: "Vintage Champagne · Épernay, France · 2013 — Raspberry, toast, exceptional mousse", price: "390", tag: "Prestige", allergens: "Sulfites" },
    { name: "Pétrus", desc: "Pomerol AOC · Bordeaux, France · 2015 — Truffles, dark plum, iron — the pinnacle", price: "980", allergens: "Sulfites" },
  ],
}

// Real menu from the client's wizard input (c?.menuItems) takes priority over
// the demo dishes above. Categories are derived from the items' `category`
// field (fallback "Menu"); prices are kept EXACTLY as provided (already strings).
function buildMenuRecord(items: { name: string; price: string; description?: string; category?: string }[]): Record<string, { name: string; desc: string; price: string; tag?: string; allergens?: string }[]> {
  const record: Record<string, { name: string; desc: string; price: string; tag?: string; allergens?: string }[]> = {};
  for (const item of items) {
    const cat = item.category || "Menu";
    (record[cat] = record[cat] || []).push({ name: item.name, desc: item.description || "", price: item.price });
  }
  return record;
}

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
            <a key={i} href="/templates/impact-04" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#f5efe6]/30 hover:text-amber-500 hover:border-amber-600 transition-all duration-200 cursor-pointer">
              {icon}
            </a>
          ))}
        </div>
        <span className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider">Michelin ★★ · Paris, France</span>
      </div>
    </footer>
  )
}

export default function MenuPage() {
  const [session, setSession] = useState<{
    generatedContent?: {
      menuItems?: { name: string; price: string; description?: string; category?: string }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  const c = session?.generatedContent;
  // Real client menu (from the wizard) or template demo dishes.
  const realMenuItems = c?.menuItems && c.menuItems.length > 0 ? c.menuItems : null;
  const menuData = realMenuItems ? buildMenuRecord(realMenuItems) : MENU_ITEMS;

  return (
    <div className="bg-[#0c0a08] text-[#f5efe6] min-h-screen selection:bg-amber-700 selection:text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <Navbar currentPage="menu" />
      <main style={{ padding: '120px 24px 100px', maxWidth: 1000, margin: '0 auto', fontFamily: "'Georgia', serif" }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">La Carte · Saison 2026</span>
          <h1 className="text-5xl md:text-7xl font-light text-[#f5efe6]">
            Our <span className="italic">Menu</span>
          </h1>
          <p className="mt-4 text-[#f5efe6]/40 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            Discover our selection of starters, mains, desserts, and curated wines.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          {Object.entries(menuData).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-light text-amber-500 mb-8 border-b border-white/10 pb-2 uppercase tracking-widest font-sans text-xs">
                {realMenuItems ? category : category === 'starters' ? 'Starters' : category === 'mains' ? 'Main Courses' : category === 'desserts' ? 'Desserts' : 'Wine List'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between py-6 border-b border-white/5">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <h3 className="text-xl font-light text-[#f5efe6]">{item.name}</h3>
                        {item.tag && <span className="px-2 py-0.5 bg-amber-700/20 text-amber-400 border border-amber-700/30 text-[8px] uppercase tracking-widest font-bold font-sans rounded">{item.tag}</span>}
                      </div>
                      <p className="text-sm font-sans text-[#f5efe6]/35 leading-relaxed">{item.desc}</p>
                      {item.allergens && <p className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider mt-1">Contains: {item.allergens}</p>}
                    </div>
                    <div style={{ marginLeft: 32, fontSize: 20, color: 'text-amber-500', fontWeight: 300, alignSelf: 'center' }}>
                      <span className="text-amber-500">{realMenuItems ? item.price : `${item.price}€`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
