"use client";

import Link from "next/link";
import {
  ArrowRight, Check, ChevronLeft,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Sparkles, Hexagon, Minus, Globe,
  type LucideIcon,
} from "lucide-react";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";
import { useLang } from "@/lib/LangContext";
import {
  SITE_PRICES, ADDONS, CURRENCIES, DEFAULT_CURRENCY,
  priceIn, formatPrice, isCurrency, type Currency,
} from "@/lib/pricing";

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  landing: Rocket, saas: Zap, agency: Palette, vitrine: Building2,
  consultant: Target, portfolio: Briefcase, ecommerce: ShoppingBag, restaurant: UtensilsCrossed,
  hotel: BedDouble, healthcare: Stethoscope, realestate: Home, fitness: Dumbbell,
  event: CalendarDays, nonprofit: Heart, startup: Star, luxury: Gem,
  brutalist: Square, magazine: Newspaper, aurora: Sparkles, "3d-tech": Hexagon, "minimal-pro": Minus,
};

const T = {
  fr: {
    editOrder: "Modifier ma commande",
    summary: "Récapitulatif de commande",
    baseSublabel: "Création complète sur thème — livraison en 2 h",
    total: "Total",
    perMonthAfter: "/mois après livraison",
    vatIncluded: "TVA incluse",
    trust1: "Livraison en 2 heures",
    trust2: "Pré-visualisation gratuite",
    trust3: "Satisfait ou remboursé 7 j",
    cta: "Personnaliser et commander",
    securePay: "Paiement sécurisé par Stripe · Aucun abonnement caché ·",
    terms: "CGV",
    perMonth: "/mois",
  },
  en: {
    editOrder: "Edit my order",
    summary: "Order summary",
    baseSublabel: "Full theme-based build — delivered in 2 h",
    total: "Total",
    perMonthAfter: "/month after delivery",
    vatIncluded: "VAT included",
    trust1: "Delivered in 2 hours",
    trust2: "Free preview",
    trust3: "7-day money-back guarantee",
    cta: "Customize and order",
    securePay: "Secure payment by Stripe · No hidden subscription ·",
    terms: "Terms",
    perMonth: "/month",
  },
  es: {
    editOrder: "Editar mi pedido",
    summary: "Resumen del pedido",
    baseSublabel: "Creación completa sobre plantilla — entrega en 2 h",
    total: "Total",
    perMonthAfter: "/mes tras la entrega",
    vatIncluded: "IVA incluido",
    trust1: "Entrega en 2 horas",
    trust2: "Vista previa gratuita",
    trust3: "Satisfecho o reembolsado 7 días",
    cta: "Personalizar y pedir",
    securePay: "Pago seguro con Stripe · Sin suscripción oculta ·",
    terms: "Términos",
    perMonth: "/mes",
  },
  de: {
    editOrder: "Bestellung bearbeiten",
    summary: "Bestellübersicht",
    baseSublabel: "Komplette themenbasierte Erstellung — Lieferung in 2 Std.",
    total: "Gesamt",
    perMonthAfter: "/Monat nach Lieferung",
    vatIncluded: "inkl. MwSt.",
    trust1: "Lieferung in 2 Stunden",
    trust2: "Kostenlose Vorschau",
    trust3: "7 Tage Geld-zurück-Garantie",
    cta: "Anpassen und bestellen",
    securePay: "Sichere Zahlung mit Stripe · Kein verstecktes Abo ·",
    terms: "AGB",
    perMonth: "/Monat",
  },
  pt: {
    editOrder: "Editar meu pedido",
    summary: "Resumo do pedido",
    baseSublabel: "Criação completa sobre modelo — entrega em 2 h",
    total: "Total",
    perMonthAfter: "/mês após a entrega",
    vatIncluded: "IVA incluído",
    trust1: "Entrega em 2 horas",
    trust2: "Pré-visualização gratuita",
    trust3: "Satisfeito ou reembolsado 7 dias",
    cta: "Personalizar e encomendar",
    securePay: "Pagamento seguro via Stripe · Sem assinatura oculta ·",
    terms: "Termos",
    perMonth: "/mês",
  },
};

export interface OrderClientProps {
  siteType: string;
  name: string;
  theme: string;
  maintenance: boolean;
  branding: boolean;
  currency: Currency;
  sessionId?: string;
}

export default function OrderClient(props: OrderClientProps) {
  const { siteType, name, theme, maintenance, branding, currency, sessionId } = props;
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;

  const siteInfo  = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
  const basePrice = siteInfo.price;
  const oneTimeEur = basePrice + (branding ? ADDONS.branding.price : 0);
  const IconCmp   = TEMPLATE_ICONS[theme] ?? TEMPLATE_ICONS[siteType] ?? Globe;

  const stateQS = `&maintenance=${maintenance ? "1" : "0"}&branding=${branding ? "1" : "0"}&currency=${currency}`;
  const configureHref = `/configure?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}`;
  const sessionParam = sessionId ? `&session=${encodeURIComponent(sessionId)}` : "";
  const checkoutHref = `/onboarding?type=${encodeURIComponent(siteType)}&name=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}${stateQS}${sessionParam}`;

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
      <AeviaHeader />
      {/* Back link + currency selector */}
      <div className="w-full max-w-lg mb-6 mt-0 flex items-center justify-between">
        <Link
          href={configureHref}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.editOrder}
        </Link>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
            <Link
              key={c}
              href={selfHref({ currency: c })}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                c === currency
                  ? "bg-red-600 text-white"
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
        <div className="bg-gradient-to-br from-red-600/20 to-zinc-900 px-7 py-6 border-b border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1 font-semibold">{t.summary}</p>
          <div className="flex items-center gap-3 mt-2">
            <IconCmp className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">{name}</h1>
              <p className="text-red-400 text-sm">{siteInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="px-7 py-5 space-y-3 border-b border-zinc-800">
          <LineItem
            label={siteInfo.label}
            sublabel={t.baseSublabel}
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
              perMonth={t.perMonth}
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
            note={`+ ${formatPrice(ADDONS.maintenance.price, currency)}${t.perMonth}`}
          />
        </div>

        {/* Total */}
        <div className="px-7 py-5 border-b border-zinc-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-zinc-400 text-sm">{t.total}</p>
              {maintenance && (
                <p className="text-zinc-500 text-xs mt-0.5">
                  + {formatPrice(ADDONS.maintenance.price, currency)}{t.perMonthAfter}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {formatPrice(oneTimeEur, currency)}
              </p>
              <p className="text-zinc-500 text-xs">{t.vatIncluded}</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="px-7 py-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-2.5">
          <TrustBadge text={t.trust1} />
          <TrustBadge text={t.trust2} />
          <TrustBadge text={t.trust3} />
        </div>

        {/* CTA */}
        <div className="px-7 py-6">
          <Link
            href={checkoutHref}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-colors shadow-lg shadow-red-900/30"
          >
            {t.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-zinc-500 text-xs mt-3">
            {t.securePay}{" "}
            <Link href="/legal/cgu" className="underline hover:text-zinc-700">{t.terms}</Link>
          </p>
        </div>
      </div>
      <div className="mb-16" />
      <LegalFooter variant="dark" />
    </main>
  );
}

function LineItem({
  label,
  sublabel,
  display,
  recurring,
  perMonth,
}: {
  label: string;
  sublabel?: string;
  display: string;
  recurring?: boolean;
  perMonth?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {sublabel && <p className="text-zinc-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <p className="text-white font-semibold text-sm shrink-0">
        {display}
        {recurring && <span className="text-zinc-400 font-normal">{perMonth}</span>}
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
          ? "border-red-500/60 bg-red-600/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-md border ${
            active ? "bg-red-600 border-red-600" : "border-zinc-600"
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
