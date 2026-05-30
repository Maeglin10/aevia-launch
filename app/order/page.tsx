import Link from "next/link";
import {
  ArrowRight, Check, ChevronLeft,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Sparkles, Hexagon, Minus, Globe,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import {
  SITE_PRICES, ADDONS, CURRENCIES, DEFAULT_CURRENCY,
  priceIn, formatPrice, isCurrency, type Currency,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Récapitulatif de commande",
  robots: { index: false, follow: false },
};

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
    branding?: string;
    currency?: string;
    color?: string;
    session?: string;
  }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const siteType  = params.type  ?? "landing";
  const name      = params.name  ?? "Votre site";
  const theme     = params.theme ?? siteType;
  const maintenance = params.maintenance === "1";
  const branding    = params.branding === "1";
  const currency: Currency = isCurrency(params.currency) ? params.currency : DEFAULT_CURRENCY;
  const sessionId = params.session;

  const siteInfo  = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
  const basePrice = siteInfo.price; // canonical EUR
  // One-time total (base + branding); maintenance is recurring, shown apart.
  const oneTimeEur = basePrice + (branding ? ADDONS.branding.price : 0);
  const total      = priceIn(oneTimeEur, currency);
  const IconCmp   = TEMPLATE_ICONS[theme] ?? TEMPLATE_ICONS[siteType] ?? Globe;

  // Preserve add-on + currency state across links.
  const stateQS = `&maintenance=${maintenance ? "1" : "0"}&branding=${branding ? "1" : "0"}&currency=${currency}`;

  // Build configure back-link with existing params preserved
  const configureHref = `/configure?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}`;

  // Forward session ID to onboarding so the brief can be pre-filled from
  // the data already collected during /configure (avoids asking the user
  // for the business name, services etc. a second time).
  const sessionParam = sessionId ? `&session=${encodeURIComponent(sessionId)}` : "";
  const checkoutHref = `/onboarding?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}${stateQS}${sessionParam}`;

  // Helper to build an order-page link toggling one param (server-side, no JS).
  const selfHref = (overrides: Record<string, string>) => {
    const merged: Record<string, string> = {
      type: siteType, name, theme,
      maintenance: maintenance ? "1" : "0",
      branding: branding ? "1" : "0",
      currency,
      ...(sessionId ? { session: sessionId } : {}),
      ...overrides,
    };
    return "/order?" + Object.entries(merged)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 pt-16 pb-0">
      {/* Back link + currency selector */}
      <div className="w-full max-w-lg mb-6 mt-0 flex items-center justify-between">
        <Link
          href={configureHref}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Modifier ma commande
        </Link>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
            <Link
              key={c}
              href={selfHref({ currency: c })}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                c === currency
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {CURRENCIES[c].label}
            </Link>
          ))}
        </div>
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
            sublabel="Création complète sur thème — livraison en 2 h"
            display={formatPrice(basePrice, currency)}
          />
          {branding && (
            <LineItem
              label={ADDONS.branding.label}
              sublabel={ADDONS.branding.sublabel}
              display={formatPrice(ADDONS.branding.price, currency)}
            />
          )}
          {maintenance && (
            <LineItem
              label={ADDONS.maintenance.label}
              sublabel={ADDONS.maintenance.sublabel}
              display={formatPrice(ADDONS.maintenance.price, currency)}
              recurring
            />
          )}
        </div>

        {/* Add-on toggles */}
        <div className="px-7 py-4 space-y-2 border-b border-zinc-800">
          <AddonToggle
            active={branding}
            href={selfHref({ branding: branding ? "0" : "1" })}
            label={ADDONS.branding.label}
            note={`+ ${formatPrice(ADDONS.branding.price, currency)}`}
          />
          <AddonToggle
            active={maintenance}
            href={selfHref({ maintenance: maintenance ? "0" : "1" })}
            label={ADDONS.maintenance.label}
            note={`+ ${formatPrice(ADDONS.maintenance.price, currency)}/mois`}
          />
        </div>

        {/* Total */}
        <div className="px-7 py-5 border-b border-zinc-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total</p>
              {maintenance && (
                <p className="text-zinc-500 text-xs mt-0.5">
                  + {formatPrice(ADDONS.maintenance.price, currency)}/mois après livraison
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {formatPrice(oneTimeEur, currency)}
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
            Personnaliser et commander
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-zinc-500 text-xs mt-3">
            Paiement sécurisé par Stripe · Aucun abonnement caché ·{" "}
            <Link href="/legal/cgu" className="underline hover:text-zinc-700">CGV</Link>
          </p>
        </div>
      </div>
      <div className="mb-16" />
      <LegalFooter variant="dark" />
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function LineItem({
  label,
  sublabel,
  display,
  recurring,
}: {
  label: string;
  sublabel?: string;
  display: string;
  recurring?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {sublabel && <p className="text-zinc-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <p className="text-white font-semibold text-sm shrink-0">
        {display}
        {recurring && <span className="text-zinc-400 font-normal">/mois</span>}
      </p>
    </div>
  );
}

function AddonToggle({
  active,
  href,
  label,
  note,
}: {
  active: boolean;
  href: string;
  label: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
        active
          ? "border-violet-500/60 bg-violet-600/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-md border ${
            active ? "bg-violet-600 border-violet-600" : "border-zinc-600"
          }`}
        >
          {active && <Check className="w-3.5 h-3.5 text-white" />}
        </span>
        <span className="text-sm text-white font-medium">{label}</span>
      </div>
      <span className="text-xs text-zinc-400 font-semibold shrink-0">{note}</span>
    </Link>
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
