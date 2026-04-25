"use client";

import { use, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { SessionData } from "@/lib/sessions";
import { generateMockContent } from "@/lib/mockContent";

// Prevent SSR to avoid Framer Motion useScroll ref hydration error
const GeneratedSite = dynamic(
  () => import("@/components/GeneratedSite").then((m) => ({ default: m.GeneratedSite })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-600">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading preview…</p>
        </div>
      </div>
    ),
  }
);

// All available themes with display metadata
const THEMES_META: Record<string, { label: string; icon: string; category: string; premium: boolean }> = {
  landing:      { label: "Landing Page",        icon: "🚀", category: "Marketing",   premium: false },
  saas:         { label: "SaaS Product",         icon: "⚡", category: "Tech",        premium: false },
  agency:       { label: "Creative Agency",      icon: "🎨", category: "Agency",      premium: false },
  vitrine:      { label: "Business Vitrine",     icon: "🏢", category: "Business",    premium: false },
  consultant:   { label: "Consultant & Coach",   icon: "🎯", category: "Personal",    premium: false },
  portfolio:    { label: "Portfolio",            icon: "💼", category: "Personal",    premium: false },
  ecommerce:    { label: "E-commerce Store",     icon: "🛍️", category: "Commerce",    premium: false },
  restaurant:   { label: "Restaurant & Food",    icon: "🍽️", category: "Hospitality", premium: false },
  hotel:        { label: "Hotel & B&B",          icon: "🏨", category: "Hospitality", premium: false },
  healthcare:   { label: "Healthcare & Clinic",  icon: "🏥", category: "Health",      premium: false },
  realestate:   { label: "Real Estate",          icon: "🏠", category: "Property",    premium: false },
  fitness:      { label: "Fitness & Wellness",   icon: "💪", category: "Health",      premium: false },
  event:        { label: "Event & Conference",   icon: "🎪", category: "Events",      premium: false },
  nonprofit:    { label: "Non-profit & NGO",     icon: "❤️", category: "Social",      premium: false },
  startup:      { label: "Startup Launch",       icon: "🌟", category: "Tech",        premium: false },
  luxury:       { label: "Luxury & Couture",     icon: "💎", category: "Premium",     premium: true },
  brutalist:    { label: "Brutalist Editorial",  icon: "◼", category: "Premium",     premium: true },
  magazine:     { label: "Magazine & Editorial", icon: "📰", category: "Premium",     premium: true },
  aurora:       { label: "Aurora & Wellness",    icon: "✦", category: "Premium",     premium: true },
  "3d-tech":    { label: "3D Tech & Web3",       icon: "⬡", category: "Premium",     premium: true },
  "minimal-pro":{ label: "Minimal Pro",          icon: "—", category: "Premium",     premium: true },
  marketplace:  { label: "Marketplace",          icon: "🏪", category: "Commerce",    premium: true },
  livestream:   { label: "Live & Streaming",     icon: "📡", category: "Events",      premium: true },
};

const ORDERED_THEME_IDS = [
  "landing", "saas", "agency", "vitrine", "consultant", "portfolio",
  "ecommerce", "restaurant", "hotel", "healthcare", "realestate", "fitness",
  "event", "nonprofit", "startup", "luxury", "brutalist", "magazine",
  "aurora", "3d-tech", "minimal-pro", "marketplace", "livestream",
];

// Mock form data tailored per template for most realistic previews
const MOCK_FORM_DATA: Record<string, { businessName: string; businessType: string; tagline: string; city: string; brandColor: string }> = {
  landing:      { businessName: "Launchify",         businessType: "SaaS",         tagline: "Launch faster",              city: "San Francisco",  brandColor: "#7c3aed" },
  saas:         { businessName: "NexusAI",            businessType: "SaaS",         tagline: "Intelligence at scale",      city: "New York",       brandColor: "#2563eb" },
  agency:       { businessName: "Studio Volta",       businessType: "Agency",       tagline: "Digital experiences",        city: "London",         brandColor: "#d97706" },
  vitrine:      { businessName: "Meridian Partners",  businessType: "Consultant",   tagline: "Results you can measure",    city: "Paris",          brandColor: "#059669" },
  consultant:   { businessName: "Claire Moreau",      businessType: "Coach",        tagline: "Your breakthrough starts",   city: "Lyon",           brandColor: "#0891b2" },
  portfolio:    { businessName: "Alex Torres",        businessType: "Portfolio",    tagline: "Design that tells stories",  city: "Barcelona",      brandColor: "#7c3aed" },
  ecommerce:    { businessName: "Maison Blanche",     businessType: "E-commerce",   tagline: "Curated essentials",         city: "Paris",          brandColor: "#dc2626" },
  restaurant:   { businessName: "Le Jardin",          businessType: "Restaurant",   tagline: "Where every meal matters",   city: "Bordeaux",       brandColor: "#d97706" },
  hotel:        { businessName: "Hôtel Lumière",      businessType: "Hotel",        tagline: "A place apart",              city: "Nice",           brandColor: "#b45309" },
  healthcare:   { businessName: "Centre Santé+",      businessType: "Healthcare",   tagline: "Your health, our priority",  city: "Nantes",         brandColor: "#16a34a" },
  realestate:   { businessName: "Étoile Immobilier",  businessType: "RealEstate",   tagline: "Find the place you love",    city: "Marseille",      brandColor: "#7c3aed" },
  fitness:      { businessName: "Form Studio",        businessType: "Fitness",      tagline: "Transform your body",        city: "Toulouse",       brandColor: "#dc2626" },
  event:        { businessName: "Summit 2026",        businessType: "Event",        tagline: "Ideas worth following",      city: "Geneva",         brandColor: "#9333ea" },
  nonprofit:    { businessName: "Terre & Avenir",     businessType: "NonProfit",    tagline: "Together we change things",  city: "Brussels",       brandColor: "#e11d48" },
  startup:      { businessName: "Orbit",              businessType: "Startup",      tagline: "We're changing how work",    city: "Berlin",         brandColor: "#7c3aed" },
  luxury:       { businessName: "Maison Aurore",      businessType: "Luxury",       tagline: "Crafted for those who know", city: "Paris",          brandColor: "#c9a96e" },
  brutalist:    { businessName: "Studio FORM",        businessType: "Brutalist",    tagline: "Form follows force",         city: "Oslo",           brandColor: "#ffffff" },
  magazine:     { businessName: "Meridian",           businessType: "Magazine",     tagline: "Ideas worth following",      city: "London",         brandColor: "#1e1e1e" },
  aurora:       { businessName: "Lumière",            businessType: "Aurora",       tagline: "Radiate from within",        city: "Copenhagen",     brandColor: "#a855f7" },
  "3d-tech":    { businessName: "NexusAI",            businessType: "TechAI",       tagline: "Intelligence at the edge",   city: "San Francisco",  brandColor: "#06b6d4" },
  "minimal-pro":{ businessName: "Studio Blanc",       businessType: "MinimalPro",   tagline: "Space. Light. Purpose.",     city: "Zurich",         brandColor: "#18181b" },
  marketplace:  { businessName: "TradeVault",          businessType: "Marketplace",  tagline: "Everything, from everyone",  city: "London",         brandColor: "#f59e0b" },
  livestream:   { businessName: "StreamHub",            businessType: "Streaming",    tagline: "Live, everywhere, anytime",  city: "Los Angeles",    brandColor: "#ef4444" },
};

function buildMockSession(id: string): SessionData {
  const meta = MOCK_FORM_DATA[id] ?? MOCK_FORM_DATA["landing"];

  const formData = {
    businessName: meta.businessName,
    businessType: meta.businessType,
    tagline: meta.tagline,
    city: meta.city,
    mainService: "Premium service",
    benefits: ["Exceptional quality", "Expert team", "Proven results"] as [string, string, string],
    priceRange: "Premium",
    targetAudience: "Discerning clients",
    brandColor: meta.brandColor,
    tone: "Professional",
    template: id,
    email: "hello@example.com",
    phone: "+33 1 23 45 67 89",
    instagram: "@example",
    linkedin: "linkedin.com/company/example",
  };

  const generatedContent = generateMockContent(formData);

  return {
    id: `preview-${id}`,
    formData,
    generatedContent,
    createdAt: new Date(),
  };
}

export default function ThemePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const meta = THEMES_META[id];

  if (!meta) notFound();

  const session = buildMockSession(id);

  const currentIndex = ORDERED_THEME_IDS.indexOf(id);
  const prevId = currentIndex > 0 ? ORDERED_THEME_IDS[currentIndex - 1] : null;
  const nextId = currentIndex < ORDERED_THEME_IDS.length - 1 ? ORDERED_THEME_IDS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Floating top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: navigation */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/themes"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All themes</span>
          </Link>

          <span className="text-zinc-700 hidden sm:inline">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">{meta.icon}</span>
            <div className="min-w-0">
              <span className="text-white text-sm font-semibold truncate block">{meta.label}</span>
            </div>
            {meta.premium && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0" style={{ background: "#c9a96e20", border: "1px solid #c9a96e40" }}>
                <Sparkles className="w-3 h-3" style={{ color: "#c9a96e" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c9a96e" }}>Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: prev / next */}
        <div className="flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/themes/${prevId}`}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center opacity-30">
              <ArrowLeft className="w-4 h-4 text-zinc-600" />
            </div>
          )}
          <span className="text-zinc-600 text-xs font-mono tabular-nums hidden sm:inline">
            {currentIndex + 1} / {ORDERED_THEME_IDS.length}
          </span>
          {nextId ? (
            <Link
              href={`/themes/${nextId}`}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center opacity-30">
              <ArrowRight className="w-4 h-4 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Right: CTA */}
        <Link
          href={`/configure?template=${id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          Use this theme
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Browser chrome mockup */}
      <div className="pt-14">
        <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded px-3 py-1 text-zinc-500 text-xs font-mono truncate">
            preview — {session.formData.businessName} · {meta.label}
          </div>
          <div className="shrink-0 text-[10px] text-zinc-600 font-mono uppercase tracking-widest hidden sm:block">
            Demo mode
          </div>
        </div>

        {/* The actual site — only render client-side to avoid FM ref hydration error */}
        {mounted && <GeneratedSite session={session} />}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div
          className="pointer-events-auto mx-auto max-w-lg mb-6 mx-6 sm:mx-auto rounded-2xl border border-zinc-700/80 px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-md"
          style={{ background: "rgba(9, 9, 11, 0.92)" }}
        >
          <div>
            <p className="text-white text-sm font-semibold">{meta.icon} {meta.label}</p>
            <p className="text-zinc-500 text-xs">This is a live preview with sample content</p>
          </div>
          <Link
            href={`/configure?template=${id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors shrink-0"
          >
            Build with this
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
