import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromBlob } from "@/lib/sessions";
import { SITE_PRICES, priceIn, isCurrency, type Currency } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_CCY: Record<Currency, string> = { EUR: "eur", CHF: "chf", USD: "usd", GBP: "gbp" };

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Rate limiter: max 5 checkout requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 10 * 60 * 1000;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + window }); return false; }
  if (entry.count >= 5) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: { sessionId?: string; currency?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { sessionId, currency } = body;
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

  // Load the already-generated session from Blob
  const session = await getSessionFromBlob(sessionId);
  if (!session?.generatedContent) {
    return NextResponse.json({ error: "Session not found or not generated" }, { status: 404 });
  }

  const { formData } = session;
  const siteType = formData.template || "landing";
  const siteName = formData.businessName || "Votre site";
  const clientEmail = formData.email || undefined;

  const ccy: Currency = isCurrency(currency) ? currency : "EUR";
  const siteInfo = SITE_PRICES[siteType] ?? SITE_PRICES["landing"];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://launch.aevia.services";
  const previewUrl = `${baseUrl}/preview/${sessionId}`;

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: STRIPE_CCY[ccy],
            product_data: {
              name: `${siteInfo.label} — ${siteName}`,
              description: "Site web premium + livraison instantanée — votre aperçu est prêt",
            },
            unit_amount: priceIn(siteInfo.price, ccy) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?sessionId=${sessionId}&siteName=${encodeURIComponent(siteName)}`,
      cancel_url: previewUrl,
      customer_email: clientEmail,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata: {
        // sessionId path: content already generated, webhook only sends emails
        sessionId,
        siteType,
        siteName,
        previewUrl,
        currency: ccy,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Stripe error: ${msg}` }, { status: 500 });
  }
}
