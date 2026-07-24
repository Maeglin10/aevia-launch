import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { SITE_PRICES, ADDONS, priceIn, isCurrency, type Currency } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe currency codes are lowercase ISO-4217.
const STRIPE_CCY: Record<Currency, string> = { EUR: "eur", CHF: "chf", USD: "usd", GBP: "gbp" };

const stripeKey = process.env.STRIPE_SECRET_KEY;
// Omit apiVersion so Stripe uses the account's default version (avoids
// 'invalid_api_version' errors when the account hasn't been upgraded yet).
const stripe = stripeKey ? new Stripe(stripeKey) : null;

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
      branding?: string | number | boolean;
      currency?: string;
      brief?: Record<string, unknown>;
    };
    const { type, name, theme, maintenance, branding, currency, brief } = body;

    // Validate required fields
    const siteType = (typeof type === "string" && type) ? type : "landing";
    const siteName = (typeof name === "string" && name.trim()) ? name.trim() : "Votre site";
    const siteTheme = (typeof theme === "string" && theme) ? theme : siteType;
    const withMaintenance =
      maintenance === 1 || maintenance === "1" || maintenance === true;
    const withBranding =
      branding === 1 || branding === "1" || branding === true;
    const ccy: Currency = isCurrency(currency) ? currency : "EUR";
    const stripeCcy = STRIPE_CCY[ccy];

    const siteInfo = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // In production, refuse to create a checkout session with a localhost
    // redirect — the customer would pay and land on a dead URL.
    if (process.env.NODE_ENV === "production" && baseUrl.includes("localhost")) {
      console.error("[checkout] NEXT_PUBLIC_BASE_URL not set in production");
      Sentry.captureMessage("NEXT_PUBLIC_BASE_URL missing in production", "error");
      return NextResponse.json(
        { error: "Configuration serveur incorrecte. Contactez le support." },
        { status: 500 },
      );
    }

    const successUrl =
      `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}` +
      `&name=${encodeURIComponent(siteName)}` +
      `&type=${encodeURIComponent(siteType)}`;

    const cancelUrl =
      `${baseUrl}/order` +
      `?type=${encodeURIComponent(siteType)}` +
      `&name=${encodeURIComponent(siteName)}` +
      `&theme=${encodeURIComponent(siteTheme)}` +
      `&maintenance=${withMaintenance ? "1" : "0"}` +
      `&branding=${withBranding ? "1" : "0"}` +
      `&currency=${ccy}`;

    // All amounts resolved in the chosen currency via the pricing table so the
    // charge matches exactly what the order page displayed.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = [
      {
        price_data: {
          currency: stripeCcy,
          product_data: {
            name: siteInfo.label,
            description: "Création complète sur thème — livraison en 2 heures",
          },
          unit_amount: priceIn(siteInfo.price, ccy) * 100,
        },
        quantity: 1,
      },
    ];

    if (withBranding) {
      lineItems.push({
        price_data: {
          currency: stripeCcy,
          product_data: {
            name: ADDONS.branding.label,
            description: ADDONS.branding.sublabel,
          },
          unit_amount: priceIn(ADDONS.branding.price, ccy) * 100,
        },
        quantity: 1,
      });
    }

    // Free-hosting period by tier, matching the /pricing page promise
    // (Landing/Essentiel: none, Pro: 3 months, Premium: 6 months).
    const maintenanceTrialDays =
      siteInfo.price >= 1499 ? 180 : siteInfo.price >= 899 ? 90 : 0;

    if (withMaintenance) {
      lineItems.push({
        price_data: {
          currency: stripeCcy,
          product_data: {
            name: ADDONS.maintenance.label,
            description: ADDONS.maintenance.sublabel,
          },
          unit_amount: priceIn(ADDONS.maintenance.price, ccy) * 100,
          recurring: { interval: "month" },
        },
        quantity: 1,
      });
    }

    // Persist the full brief in Blob and pass only a briefId in Stripe metadata
    // (Stripe metadata is capped to ~500 chars per key and 50 keys total, so we
    // store the brief separately and resolve it from the webhook handler.)
    const briefId = crypto.randomUUID();
    if (brief && Object.keys(brief).length > 0) {
      try {
        await put(`briefs/${briefId}.json`, JSON.stringify(brief), {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
        });
      } catch (err) {
        console.error("[checkout] brief upload failed", err);
        Sentry.captureException(err, { tags: { route: "checkout", stage: "brief-upload" } });
      }
    }

    // With hosting selected, the site price + branding ride as one-time
    // invoice items on the subscription's first invoice (Stripe bills
    // non-recurring price_data line items once, immediately, even inside
    // mode:"subscription") while the maintenance line becomes the actual
    // recurring charge — trial_period_days defers only that recurring part.
    const session = await stripe.checkout.sessions.create({
      mode: withMaintenance ? "subscription" : "payment",
      // payment_method_types omitted → Stripe auto-enables all activated methods
      // (cards, Apple Pay, Google Pay, Link, SEPA…). Enable each one in
      // Stripe Dashboard → Settings → Payment methods. Apple Pay and Google Pay
      // appear automatically on Safari iOS / Chrome Android once domain is verified.
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Required by Stripe to show Apple Pay / Google Pay buttons.
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
      ...(withMaintenance && maintenanceTrialDays > 0
        ? { subscription_data: { trial_period_days: maintenanceTrialDays } }
        : {}),
      metadata: {
        siteName,
        siteType,
        theme: siteTheme,
        maintenance: withMaintenance ? "1" : "0",
        branding: withBranding ? "1" : "0",
        currency: ccy,
        briefId,
      },
      // Force Stripe to collect customer email (even though Checkout collects by default in payment mode)
      customer_email: undefined, // let Stripe collect it
      billing_address_collection: "auto",
      // customer_creation: "always", // only valid for `mode: "subscription"` - skip
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: "checkout" } });
    const errMsg = err instanceof Error ? err.message : String(err);
    const errType = (err as { type?: string; statusCode?: number })?.type ?? "unknown";
    console.error("[checkout] Stripe session creation failed:", errType, errMsg, err);
    // Return diagnostic info in dev mode or when explicitly enabled
    if (process.env.STRIPE_DEBUG === "true") {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement.", debug: { type: errType, message: errMsg } },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
