import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

// ─── Clients ───────────────────────────────────────────────────────────────────

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error("[webhook] STRIPE_SECRET_KEY is not set — refusing to start");
const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia",
});

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) throw new Error("[webhook] RESEND_API_KEY is not set — refusing to start");
const resend = new Resend(resendKey);

// ─── Price map (for the email order summary) ───────────────────────────────────

const SITE_LABELS: Record<string, string> = {
  landing:       "Landing Page",
  saas:          "SaaS Product",
  agency:        "Creative Agency",
  vitrine:       "Site Vitrine",
  consultant:    "Consultant / Coach",
  portfolio:     "Portfolio",
  ecommerce:     "E-Commerce",
  restaurant:    "Restaurant / Food",
  hotel:         "Hôtel / B&B",
  healthcare:    "Santé / Clinique",
  realestate:    "Immobilier",
  fitness:       "Fitness / Wellness",
  event:         "Événement",
  nonprofit:     "Non-profit / ONG",
  startup:       "Startup Launch",
  luxury:        "Luxury / Couture",
  brutalist:     "Brutalist Editorial",
  magazine:      "Magazine / Éditorial",
  aurora:        "Aurora / Wellness",
  "3d-tech":     "3D Tech / Web3",
  "minimal-pro": "Minimal Pro",
};

const SITE_PRICES: Record<string, number> = {
  landing: 599, saas: 899, agency: 899, vitrine: 899, consultant: 599,
  portfolio: 599, ecommerce: 1499, restaurant: 899, hotel: 899,
  healthcare: 899, realestate: 899, fitness: 899, event: 599, nonprofit: 599,
  startup: 599, luxury: 1499, brutalist: 899, magazine: 899, aurora: 899,
  "3d-tech": 1499, "minimal-pro": 899,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Escape HTML special characters — prevents HTML injection in email body from Stripe metadata */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
}

function orderEmailHtml(params: {
  name: string;
  type: string;
  typeLabel: string;
  maintenance: boolean;
  total: number; // euros
  date: string;
  sessionId: string;
}): string {
  const { name, typeLabel, maintenance, total, date, sessionId } = params;
  const basePrice = SITE_PRICES[params.type] ?? total;
  const maintenancePrice = 59;

  // Escape all Stripe metadata values before injecting into HTML
  const safeName = escapeHtml(name);
  const safeTypeLabel = escapeHtml(typeLabel);
  const safeDate = escapeHtml(date);
  const safeSessionId = escapeHtml(sessionId);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nouvelle commande — ${safeName}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Arial,sans-serif;color:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(109,40,217,0.25),#18181b);padding:32px 36px;border-bottom:1px solid #27272a;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;font-weight:600;">AeviaLaunch</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
                Nouvelle commande
              </h1>
              <p style="margin:6px 0 0;font-size:14px;color:#7c3aed;">
                ${safeName}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 36px;">

              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
                Une nouvelle commande vient d'être complétée via Stripe.
              </p>

              <!-- Order details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#a1a1aa;">Nom du site</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#ffffff;font-weight:600;">${safeName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#a1a1aa;">Type de site</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#ffffff;font-weight:600;">${safeTypeLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#a1a1aa;">Création site</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#ffffff;">${basePrice.toLocaleString("fr-FR")}€</span>
                  </td>
                </tr>
                ${maintenance ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#a1a1aa;">Maintenance mensuelle</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:13px;color:#ffffff;">${maintenancePrice}€/mois</span>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:14px 0 0;">
                    <span style="font-size:15px;color:#ffffff;font-weight:700;">Total encaissé</span>
                  </td>
                  <td align="right" style="padding:14px 0 0;">
                    <span style="font-size:20px;color:#7c3aed;font-weight:800;">${total.toLocaleString("fr-FR")}€</span>
                  </td>
                </tr>
              </table>

              <!-- Meta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f12;border:1px solid #27272a;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Date</p>
                    <p style="margin:0;font-size:13px;color:#d4d4d8;">${safeDate}</p>
                  </td>
                  <td align="right">
                    <p style="margin:0 0 4px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Session ID</p>
                    <p style="margin:0;font-size:11px;color:#71717a;font-family:monospace;">${safeSessionId}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                Action requise : démarrer la création et contacter le client sous 2 heures.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 36px;border-top:1px solid #27272a;background:#0f0f12;">
              <p style="margin:0;font-size:11px;color:#52525b;text-align:center;">
                AeviaLaunch · Paiement traité par Stripe
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Preserve the raw body — required for signature verification.
  //    Next.js App Router gives us a ReadableStream; consume it as ArrayBuffer.
  const rawBody = await req.arrayBuffer();
  const rawBodyBuffer = Buffer.from(rawBody);

  // 2. Verify the Stripe-Signature header immediately.
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBodyBuffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    // Invalid signature — reject immediately, do NOT process
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Acknowledge receipt fast — Stripe expects 2xx within 30 s.
  //    We process synchronously here (no queue) but keep it lightweight.
  //    For high-volume, move heavy work to a background job.

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const meta = session.metadata ?? {};
      const siteType   = meta.type       ?? "landing";
      const siteName   = meta.name       ?? "Votre site";
      const withMaint  = meta.maintenance === "1";
      const typeLabel  = SITE_LABELS[siteType] ?? siteType;

      // Re-derive total from Stripe's authoritative amount (server-side validation)
      const totalCents = session.amount_total ?? 0;
      const totalEuros = totalCents / 100;

      const date = new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      });

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "v.milliand@gmail.com",
        subject: `Nouvelle commande — ${siteName}`,
        html: orderEmailHtml({
          name: siteName,
          type: siteType,
          typeLabel,
          maintenance: withMaint,
          total: totalEuros,
          date,
          sessionId: session.id,
        }),
      });

      console.log(`[webhook] Order email sent for session ${session.id} (${siteName})`);
    }
    // Add handlers for other event types here:
    // payment_intent.payment_failed, charge.dispute.created, etc.
  } catch (err) {
    // Log processing errors but still return 200 to avoid Stripe retries
    // (which would resend the email). For critical failures, use a dead-letter queue.
    console.error("[webhook] Error processing event:", event.type, err);
  }

  return NextResponse.json({ received: true });
}
