"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, MessageSquare, ChevronDown, ExternalLink, Globe } from "lucide-react";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

function LangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = LOCALE_META.find(l => l.code === locale) ?? LOCALE_META[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          {LOCALE_META.map(l => (
            <button key={l.code} onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-800 ${l.code === locale ? "text-white font-semibold" : "text-zinc-400"}`}
            >
              <span>{l.flag}</span><span>{l.label}</span>
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AeviaLogoSvg() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="30" height="26" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="silver-h" x1="0" y1="0" x2="36" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#c0c8d8" />
            <stop offset="100%" stopColor="#8896aa" />
          </linearGradient>
        </defs>
        <path d="M8 16L13 9L14.5 10.5L10.5 16L14.5 21.5L13 23L8 16Z" fill="url(#silver-h)" />
        <path d="M4 16L10 8L11.5 9.5L7 16L11.5 22.5L10 24L4 16Z" fill="url(#silver-h)" opacity="0.7" />
        <path d="M28 16L23 9L21.5 10.5L25.5 16L21.5 21.5L23 23L28 16Z" fill="url(#silver-h)" />
        <path d="M32 16L26 8L24.5 9.5L29 16L24.5 22.5L26 24L32 16Z" fill="url(#silver-h)" opacity="0.7" />
        <path d="M18 4L23 16H20.5L18 10.5L15.5 16H13L18 4Z" fill="url(#silver-h)" />
        <path d="M14.5 17.5H21.5L22.5 20H13.5L14.5 17.5Z" fill="url(#silver-h)" opacity="0.6" />
        <path d="M13.5 20H15.5L16.5 24H13L13.5 20Z" fill="url(#silver-h)" opacity="0.8" />
        <path d="M22.5 20H20.5L19.5 24H23L22.5 20Z" fill="url(#silver-h)" opacity="0.8" />
      </svg>
      <span className="text-white font-bold text-lg tracking-[0.15em]">AEVIA</span>
    </div>
  );
}

const otherProducts = [
  { name: "AeviaSecurity", href: "https://web-bx4tjhk2h-valentins-projects-7cad2c95.vercel.app", descKey: "descSecurity", icon: Shield, status: "live" },
  { name: "AeviaInbox", href: "#", descKey: "descInbox", icon: MessageSquare, status: "soon" },
  { name: "Aevia.app", href: "https://valentin-milliand.vercel.app", descKey: "descHome", icon: Globe, status: "live" },
] as const;

const HEADER_T = {
  fr: { templates: "Templates IA", pricing: "Tarifs", products: "Produits", cta: "Démarrer un projet", soon: "Bientôt", live: "Live", descSecurity: "Audit sécurité en 60s", descInbox: "CRM multi-canal", descHome: "Accueil Aevia" },
  en: { templates: "AI Templates", pricing: "Pricing", products: "Products", cta: "Start a project", soon: "Soon", live: "Live", descSecurity: "Security audit in 60s", descInbox: "Multi-channel CRM", descHome: "Aevia home" },
  es: { templates: "Plantillas IA", pricing: "Precios", products: "Productos", cta: "Iniciar un proyecto", soon: "Pronto", live: "Live", descSecurity: "Auditoría de seguridad en 60s", descInbox: "CRM multicanal", descHome: "Inicio Aevia" },
  de: { templates: "KI-Vorlagen", pricing: "Preise", products: "Produkte", cta: "Projekt starten", soon: "Bald", live: "Live", descSecurity: "Sicherheits-Audit in 60s", descInbox: "Multichannel-CRM", descHome: "Aevia-Startseite" },
  pt: { templates: "Modelos IA", pricing: "Preços", products: "Produtos", cta: "Iniciar um projeto", soon: "Em breve", live: "Live", descSecurity: "Auditoria de segurança em 60s", descInbox: "CRM multicanal", descHome: "Início Aevia" },
};

export function AeviaHeader() {
  const pathname = usePathname();
  const { locale } = useLang();
  const t = HEADER_T[locale as keyof typeof HEADER_T] ?? HEADER_T.fr;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="https://aevia.vercel.app" className="hover:opacity-80 transition-opacity">
          <AeviaLogoSvg />
        </a>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/themes"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === "/themes" ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/10"}`}
          >
            {t.templates}
          </Link>
          <Link
            href="/pricing"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === "/pricing" ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/10"}`}
          >
            {t.pricing}
          </Link>

          {/* Other products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1">
              {t.products}
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
                <div className="p-2 flex flex-col gap-1">
                  {otherProducts.map((p) => {
                    const Icon = p.icon;
                    const isLive = p.status === "live";
                    return isLive ? (
                      <a
                        key={p.name}
                        href={p.href}
                        target={p.href.startsWith("http") && !p.href.includes("aevia.vercel") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white text-sm font-medium group-hover:text-violet-300 transition-colors">{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-600" />
                          </div>
                          <p className="text-zinc-500 text-xs">{t[p.descKey]}</p>
                        </div>
                      </a>
                    ) : (
                      <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-lg opacity-50">
                        <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400 text-sm font-medium">{p.name}</span>
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full">{t.soon}</span>
                          </div>
                          <p className="text-zinc-600 text-xs">{t[p.descKey]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <LangSwitcher />

          <a
            href="https://aevia.vercel.app/contact"
            className="ml-1 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            {t.cta}
          </a>
        </nav>

        <button className="sm:hidden text-white/60 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-white/10 bg-black/90 px-6 py-4 flex flex-col gap-2">
          <Link href="/themes" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white text-sm py-2">{t.templates}</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white text-sm py-2">{t.pricing}</Link>
          <div className="border-t border-white/10 pt-2 mt-1 flex flex-col gap-2">
            {otherProducts.map((p) => p.status === "live" ? (
              <a key={p.name} href={p.href} className="text-white/70 hover:text-white text-sm py-2 flex items-center justify-between">
                {p.name} <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full">{t.live}</span>
              </a>
            ) : (
              <div key={p.name} className="text-white/40 text-sm py-2 flex items-center justify-between">
                {p.name} <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full">{t.soon}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-2 mt-1"><LangSwitcher /></div>
          <a href="https://aevia.vercel.app/contact" className="mt-2 text-center px-4 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold">
            {t.cta}
          </a>
        </div>
      )}
    </header>
  );
}
