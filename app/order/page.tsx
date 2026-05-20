import Link from "next/link";
import {
  ArrowRight, Check, ChevronLeft,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Sparkles, Hexagon, Minus, Globe,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Récapitulatif de commande",
  robots: { index: false, follow: false },
};

// ─── Pricing config ────────────────────────────────────────────────────────────

const SITE_PRICES: Record<string, { label: string; price: number }> = {
  landing:     { label: "Landing Page",    price: 599  },
  saas:        { label: "SaaS Product",    price: 899  },
  agency:      { label: "Creative Agency", price: 899  },
  vitrine:     { label: "Site Vitrine",    price: 899  },
  consultant:  { label: "Consultant / Coach", price: 599 },
  portfolio:   { label: "Portfolio",       price: 599  },
  ecommerce:   { label: "E-Commerce",      price: 1499 },
  restaurant:  { label: "Restaurant / Food", price: 899 },
  hotel:       { label: "Hôtel / B&B",     price: 899  },
  healthcare:  { label: "Santé / Clinique", price: 899 },
  realestate:  { label: "Immobilier",      price: 899  },
  fitness:     { label: "Fitness / Wellness", price: 899 },
  event:       { label: "Événement",       price: 599  },
  nonprofit:   { label: "Non-profit / ONG", price: 599 },
  startup:     { label: "Startup Launch",  price: 599  },
  luxury:      { label: "Luxury / Couture", price: 1499 },
  brutalist:   { label: "Brutalist Editorial", price: 899 },
  magazine:    { label: "Magazine / Éditorial", price: 899 },
  aurora:      { label: "Aurora / Wellness", price: 899 },
  "3d-tech":   { label: "3D Tech / Web3",  price: 1499 },
  "minimal-pro": { label: "Minimal Pro",   price: 899  },
};

const MAINTENANCE_PRICE = 59;

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  landing: Rocket, saas: Zap, agency: Palette, vitrine: Building2,
  consultant: Target, portfolio: Briefcase, ecommerce: ShoppingBag, restaurant: UtensilsCrossed,
  hotel: BedDouble, healthcare: Stethoscope, realestate: Home, fitness: Dumbbell,
  event: CalendarDays, nonprofit: Heart, startup: Star, luxury: Gem,
  brutalist: Square, magazine: Newspaper, aurora: Sparkles, "3d-tech": Hexagon, "minimal-pro": Minus,
};

// ─── Page ──────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    type?: string;
    name?: string;
    theme?: string;
    maintenance?: string;
    color?: string;
  }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const siteType  = params.type  ?? "landing";
  const name      = params.name  ?? "Votre site";
  const theme     = params.theme ?? siteType;
  const maintenance = params.maintenance === "1";

  const siteInfo  = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
  const basePrice = siteInfo.price;
  const total     = basePrice + (maintenance ? MAINTENANCE_PRICE : 0);
  const IconCmp   = TEMPLATE_ICONS[theme] ?? TEMPLATE_ICONS[siteType] ?? Globe;

  // Build configure back-link with existing params preserved
  const configureHref = `/configure?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}`;

  // Checkout link — wire Stripe later
  const checkoutHref = `/checkout?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}&maintenance=${maintenance ? "1" : "0"}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Back link */}
      <div className="w-full max-w-lg mb-6">
        <Link
          href={configureHref}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Modifier ma commande
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600/20 to-zinc-900 px-7 py-6 border-b border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1 font-semibold">Récapitulatif de commande</p>
          <div className="flex items-center gap-3 mt-2">
            <IconCmp className="w-8 h-8 text-violet-400" />
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">{name}</h1>
              <p className="text-violet-400 text-sm">{siteInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="px-7 py-5 space-y-3 border-b border-zinc-800">
          <LineItem
            label={siteInfo.label}
            sublabel="Création complète — livraison en 2 h"
            price={basePrice}
          />
          {maintenance && (
            <LineItem
              label="Maintenance mensuelle"
              sublabel="Mises à jour, hébergement & support"
              price={MAINTENANCE_PRICE}
              recurring
            />
          )}
        </div>

        {/* Total */}
        <div className="px-7 py-5 border-b border-zinc-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total</p>
              {maintenance && (
                <p className="text-zinc-500 text-xs mt-0.5">
                  + {MAINTENANCE_PRICE}€/mois après livraison
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {total.toLocaleString("fr-FR")}€
              </p>
              <p className="text-zinc-500 text-xs">TVA incluse</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="px-7 py-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-2.5">
          <TrustBadge text="Livraison en 2 heures" />
          <TrustBadge text="Pré-visualisation gratuite" />
          <TrustBadge text="Satisfait ou remboursé 7 j" />
        </div>

        {/* CTA */}
        <div className="px-7 py-6">
          <Link
            href={checkoutHref}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-colors shadow-lg shadow-violet-900/30"
          >
            Payer et lancer mon site
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-zinc-500 text-xs mt-3">
            Paiement sécurisé par Stripe · Aucun abonnement caché
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function LineItem({
  label,
  sublabel,
  price,
  recurring,
}: {
  label: string;
  sublabel?: string;
  price: number;
  recurring?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {sublabel && <p className="text-zinc-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <p className="text-white font-semibold text-sm shrink-0">
        {price.toLocaleString("fr-FR")}€
        {recurring && <span className="text-zinc-400 font-normal">/mois</span>}
      </p>
    </div>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
      <Check className="w-3.5 h-3.5 shrink-0" />
      {text}
    </div>
  );
}
