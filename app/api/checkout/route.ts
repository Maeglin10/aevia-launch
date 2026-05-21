import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia",
}) : null;

// Simple in-memory rate limiter: max 10 checkout requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count += 1;
  return false;
}

const SITE_PRICES: Record<string, { label: string; price: number }> = {
  landing:       { label: "Landing Page",          price: 599  },
  saas:          { label: "SaaS Product",           price: 899  },
  agency:        { label: "Creative Agency",        price: 899  },
  vitrine:       { label: "Site Vitrine",           price: 899  },
  consultant:    { label: "Consultant / Coach",     price: 599  },
  portfolio:     { label: "Portfolio",              price: 599  },
  ecommerce:     { label: "E-Commerce",             price: 1499 },
  restaurant:    { label: "Restaurant / Food",      price: 899  },
  hotel:         { label: "Hôtel / B&B",            price: 899  },
  healthcare:    { label: "Santé / Clinique",       price: 899  },
  realestate:    { label: "Immobilier",             price: 899  },
  fitness:       { label: "Fitness / Wellness",     price: 899  },
  event:         { label: "Événement",              price: 599  },
  nonprofit:     { label: "Non-profit / ONG",       price: 599  },
  startup:       { label: "Startup Launch",         price: 599  },
  luxury:        { label: "Luxury / Couture",       price: 1499 },
  brutalist:     { label: "Brutalist Editorial",    price: 899  },
  magazine:      { label: "Magazine / Éditorial",   price: 899  },
  aurora:        { label: "Aurora / Wellness",      price: 899  },
  "3d-tech":     { label: "3D Tech / Web3",         price: 1499 },
  "minimal-pro": { label: "Minimal Pro",            price: 899  },
};

const MAINTENANCE_PRICE_CENTS = 5900; // 59€ in cents
const MAINTENANCE_LABEL = "Maintenance mensuelle";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    // Rate limiting — protect Stripe from checkout spam
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    const body = await req.json() as {
      type?: string;
      name?: string;
      theme?: string;
      maintenance?: string | number | boolean;
      brief?: Record<string, unknown>;
    };
    const { type, name, theme, maintenance, brief } = body;

    // Validate required fields
    const siteType = (typeof type === "string" && type) ? type : "landing";
    const siteName = (typeof name === "string" && name.trim()) ? name.trim() : "Votre site";
    const siteTheme = (typeof theme === "string" && theme) ? theme : siteType;
    const withMaintenance =
      maintenance === 1 || maintenance === "1" || maintenance === true;

    const siteInfo = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const successUrl =
      `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}` +
      `&name=${encodeURIComponent(siteName)}` +
      `&type=${encodeURIComponent(siteType)}`;

    const cancelUrl =
      `${baseUrl}/order` +
      `?type=${encodeURIComponent(siteType)}` +
      `&name=${encodeURIComponent(siteName)}` +
      `&theme=${encodeURIComponent(siteTheme)}` +
      `&maintenance=${withMaintenance ? "1" : "0"}`;

    const lineItems: any[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: siteInfo.label,
            description: "Création complète — livraison en 2 heures",
          },
          unit_amount: siteInfo.price * 100,
        },
        quantity: 1,
      },
    ];

    if (withMaintenance) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: MAINTENANCE_LABEL,
            description: "Mises à jour, hébergement & support",
          },
          // Recurring maintenance billed monthly — use a one-time line item
          // to avoid Stripe subscription complexity; displayed as monthly on order page
          unit_amount: MAINTENANCE_PRICE_CENTS,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: siteType,
        name: siteName,
        theme: siteTheme,
        maintenance: withMaintenance ? "1" : "0",
        // Brief fields — truncated to fit Stripe's 500-char limit per key
        ...(brief ? {
          company:    String(brief.company    ?? "").slice(0, 200),
          industry:   String(brief.industry   ?? "").slice(0, 100),
          tagline:    String(brief.tagline    ?? "").slice(0, 200),
          colors:     `${String(brief.colorPrimary ?? "")} / ${String(brief.colorSecondary ?? "")}`,
          description: String(brief.description ?? "").slice(0, 400),
          logo_url:   String(brief.logoUrl    ?? "").slice(0, 400),
          photos:     (Array.isArray(brief.photoUrls) ? (brief.photoUrls as string[]).join(",") : "").slice(0, 490),
          services:   JSON.stringify(brief.services ?? []).slice(0, 490),
          about:      String(brief.about      ?? "").slice(0, 400),
          contact:    `${String(brief.phone ?? "")} | ${String(brief.email ?? "")} | ${String(brief.address ?? "")}`.slice(0, 400),
          socials:    `IG:${String(brief.instagram ?? "")} LI:${String(brief.linkedin ?? "")} WEB:${String(brief.website ?? "")}`.slice(0, 400),
          notes:      String(brief.notes      ?? "").slice(0, 400),
        } : {}),
      },
      // Surface billing address collection for proper invoicing
      billing_address_collection: "auto",
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: "checkout" } });
    console.error("[checkout] Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
