"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X } from "lucide-react";
import { NAV_LINKS, GLOBAL_CSS, C } from "./shared";

export default function Impact50Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-50") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="bg-[#02040a] text-white font-sans min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── NAVBAR ────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-[#02040a]/90 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent py-10"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/templates/impact-50"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              Neural<span className="text-cyan-500">Mesh</span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`transition-colors ${
                  isActive(l.href)
                    ? "text-cyan-400"
                    : "hover:text-cyan-400"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/templates/impact-50/contact"
              className="hidden md:block px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-500"
            >
              Get Access
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ──────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#02040a]/98 backdrop-blur-xl flex flex-col items-start justify-center px-12">
          <div className="flex flex-col gap-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`text-4xl font-bold uppercase tracking-tighter transition-all ${
                  isActive(l.href)
                    ? "text-cyan-400"
                    : "hover:text-cyan-400"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────── */}
      {children}

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#02040a] pt-32 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link
              href="/templates/impact-50"
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                NeuralMesh
              </span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm font-light italic">
              Building the fabric of decentralized cognition. Empowering the
              world&apos;s most complex intelligence systems.
            </p>
            <div className="flex gap-8">
              {["GitBranch", "Discord", "MessageSquare", "Whitepaper"].map(
                (s) => (
                  <Link
                    key={s}
                    href="#"
                    className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors"
                  >
                    {s}
                  </Link>
                )
              )}
            </div>
          </div>

          {[
            {
              t: "SYSTEM",
              l: [
                { label: "Architecture", href: "/templates/impact-50/about" },
                { label: "Mesh Nodes", href: "/templates/impact-50/about" },
                { label: "Consensus", href: "/templates/impact-50/about" },
                { label: "Ecosystem", href: "/templates/impact-50/about" },
              ],
            },
            {
              t: "DOCS",
              l: [
                { label: "API Reference", href: "#" },
                { label: "Deployment", href: "#" },
                { label: "Security", href: "#" },
                { label: "Status", href: "#" },
              ],
            },
            {
              t: "ENTITY",
              l: [
                { label: "About", href: "/templates/impact-50/about" },
                { label: "Careers", href: "#" },
                { label: "Legal", href: "/templates/impact-50/legal" },
                { label: "Contact", href: "/templates/impact-50/contact" },
              ],
            },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500">
                {col.t}
              </h4>
              <ul className="space-y-6">
                {col.l.map((link) => (
                  <li
                    key={link.label}
                    className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>
            © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
          </span>
          <div className="flex gap-10 italic">
            <Link
              href="/templates/impact-50/legal"
              className="hover:text-white transition-colors"
            >
              Mentions Légales
            </Link>
            <Link
              href="/templates/impact-50/contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
