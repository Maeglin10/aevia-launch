import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://launch.aevia.services";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { email } = await req.json().catch(() => ({}));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "fr",
    customer_email: email || undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 4900,
          product_data: {
            name: "Le Guide Complet de la Beauté du Regard",
            description: "244 pages · 7 chapitres · 4 bonus inclus — livraison PDF par email sous 30 min",
          },
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    billing_address_collection: "required",
    invoice_creation: { enabled: true },
    success_url: `${BASE_URL}/maison-maria/ebook/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/maison-maria/ebook#achat`,
  });

  return NextResponse.json({ url: session.url });
}
