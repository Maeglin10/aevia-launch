"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, MessageSquare, Sparkles, ChevronDown, ExternalLink, Globe, User, LogOut } from "lucide-react";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

// ── Logo ──────────────────────────────────────────────────────────────────────
function AeviaProductLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/brand/aevia-logo.png"
        alt="Aevia"
        width={122}
        height={36}
        className="h-9 w-auto"
        priority
      />
      <span className="text-zinc-400 text-[9px] tracking-[0.2em] uppercase leading-none border-l border-zinc-700/80 pl-2.5 self-stretch flex items-center">
        Launch
      </span>
    </div>
  );
}

// ── Lang switcher ─────────────────────────────────────────────────────────────
function LangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALE_META.find(l => l.code === locale) ?? LOCALE_META[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={14} />
        <span className="hidden md:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="md:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          {LOCALE_META.map(l => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-800 ${l.code === locale ? "text-white font-semibold" : "text-zinc-400"}`}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Aevia account button ──────────────────────────────────────────────────────
const IDP_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_AEVIA_IDP_URL ||
      "https://skybot-inbox-production.up.railway.app"
    : "";

function AeviaAccountButton() {
  const [user, setUser] = useState<{ email?: string } | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/idp/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("aevia_return_to", window.location.pathname);
    window.location.href = `${IDP_URL}/api/v1/auth/google?return_to=${encodeURIComponent(window.location.origin)}`;
  };

  const handleLogout = async () => {
    await fetch("/api/idp/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (user === "loading") return <div className="w-8 h-8" />;

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        aria-label="Se connecter"
      >
        <User size={14} />
        <span className="hidden md:inline">Connexion</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="hidden md:block text-xs text-zinc-500 max-w-[120px] truncate">
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        aria-label="Se déconnecter"
        title="Se déconnecter"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
const allProducts = [
  { name: "AeviaSecurity", href: "https://security.aevia.services", descKey: "descSecurity", icon: Shield,        current: false },
  { name: "AeviaLaunch",   href: "/",                                descKey: "descLaunch",   icon: Sparkles,      current: true  },
  { name: "AeviaInbox",    href: "https://inbox.aevia.services",     descKey: "descInbox",    icon: MessageSquare, current: false },
] as const;

const HEADER_T = {
  fr: { templates: "Templates",    pricing: "Tarifs", products: "Produits", cta: "Démarrer un projet", current: "Actuel", descSecurity: "Audit sécurité & performance en 60s", descLaunch: "Sites web en 2 heures · IA", descInbox: "CRM multi-canal · WhatsApp & IA" },
  en: { templates: "Templates",    pricing: "Pricing", products: "Products", cta: "Start a project",    current: "Current", descSecurity: "Security & performance audit in 60s",    descLaunch: "Websites in 2 hours · AI",         descInbox: "Multi-channel CRM · WhatsApp & AI" },
  es: { templates: "Templates",    pricing: "Precios", products: "Productos", cta: "Iniciar un proyecto", current: "Actual", descSecurity: "Auditoría de seguridad en 60s",            descLaunch: "Sitios web en 2 horas · IA",       descInbox: "CRM multicanal · WhatsApp e IA" },
  de: { templates: "Templates",    pricing: "Preise",  products: "Produkte",  cta: "Projekt starten",    current: "Aktuell", descSecurity: "Sicherheits-Audit in 60s",                  descLaunch: "Websites in 2 Stunden · KI",       descInbox: "Multichannel-CRM · WhatsApp & KI" },
  pt: { templates: "Templates",    pricing: "Preços",  products: "Produtos",  cta: "Iniciar um projeto", current: "Atual",   descSecurity: "Auditoria de segurança em 60s",              descLaunch: "Sites em 2 horas · IA",            descInbox: "CRM multicanal · WhatsApp e IA" },
};

// ── Header ────────────────────────────────────────────────────────────────────
export function AeviaHeader() {
  const pathname = usePathname();
  const { locale } = useLang();
  const t = HEADER_T[locale as keyof typeof HEADER_T] ?? HEADER_T.fr;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isConfigurePage = pathname === "/configure";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="font-aevia-body fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <a href="https://aevia.services" className="hover:opacity-80 transition-opacity">
          <AeviaProductLogo />
        </a>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-1">
          {/* Products dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              aria-expanded={dropdownOpen}
              className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1"
            >
              {t.products}
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-80" onClick={() => setDropdownOpen(false)}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden p-2 flex flex-col gap-1">
                  {allProducts.map((p) => {
                    const Icon = p.icon;
                    return p.current ? (
                      <div key={p.name} className="flex gap-3 items-start p-2.5 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                        <Icon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-white text-sm">{p.name}</span>
                            <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium">{t.current}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{t[p.descKey]}</p>
                        </div>
                      </div>
                    ) : (
                      <a
                        key={p.name}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors group"
                      >
                        <Icon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-white text-sm group-hover:text-red-300 transition-colors">{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                          </div>
                          <p className="text-xs text-zinc-500">{t[p.descKey]}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/themes"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === "/themes" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"}`}
          >
            {t.templates}
          </Link>
          <Link
            href="/pricing"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === "/pricing" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"}`}
          >
            {t.pricing}
          </Link>

          <LangSwitcher />
          <AeviaAccountButton />

          {!isConfigurePage && (
            <Link
              href="/configure"
              className="ml-2 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
            >
              {t.cta}
            </Link>
          )}
        </nav>

        <button className="sm:hidden text-zinc-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-zinc-800 bg-[#09090b] px-6 py-4 flex flex-col gap-1">
          <Link href="/themes" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white">{t.templates}</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white">{t.pricing}</Link>

          <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-1">
            <p className="text-xs text-zinc-600 px-3 py-1 uppercase tracking-wider font-medium">{t.products}</p>
            {allProducts.map((p) => (
              p.current ? (
                <div key={p.name} className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-zinc-400">
                  <span>{p.name}</span>
                  <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded-full">{t.current}</span>
                </div>
              ) : (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                  <span>{p.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                </a>
              )
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 px-3 py-1 uppercase tracking-wider font-medium mb-1">Langue</p>
            <LangSwitcher />
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800">
            <AeviaAccountButton />
          </div>

          {!isConfigurePage && (
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <Link href="/configure" onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">
                {t.cta}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
