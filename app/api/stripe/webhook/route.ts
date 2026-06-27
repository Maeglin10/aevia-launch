import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const PDF_DOWNLOAD_URL = process.env.EBOOK_PDF_URL ?? "";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any;
    const email = session.customer_email ?? session.customer_details?.email ?? "";
    const name = session.customer_details?.name ?? "";

    if (email && resend && PDF_DOWNLOAD_URL) {
      await resend.emails.send({
        from: "Maison Maria <guide@maison-maria.fr>",
        to: email,
        replyTo: "contact@maisonmarialyon69.fr",
        subject: "✨ Votre guide est prêt — Maison Maria",
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdfaf5;font-family:'DM Sans',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #ede4d6;border-radius:4px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#1a1412 0%,#2d1a17 100%);padding:40px 48px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#fff;letter-spacing:0.05em;">Maison Maria</div>
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#e8b4ad;margin-top:8px;">Institut de beauté · Vénissieux</div>
    </div>
    <div style="padding:48px;">
      <p style="font-size:16px;color:#2d2220;line-height:1.7;margin:0 0 20px;">Bonjour${name ? ` ${name.split(" ")[0]}` : ""} 👋</p>
      <p style="font-size:15px;color:#8a7570;line-height:1.75;margin:0 0 32px;">
        Merci pour votre achat ! Voici votre guide complet — <strong style="color:#2d2220;">244 pages, 7 chapitres, 4 bonus</strong>.
        Téléchargez-le en cliquant sur le bouton ci-dessous.
      </p>
      <div style="text-align:center;margin:0 0 32px;">
        <a href="${PDF_DOWNLOAD_URL}" style="display:inline-block;background:#c4847a;color:#fff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:16px 40px;border-radius:2px;">
          Télécharger mon guide PDF →
        </a>
      </div>
      <p style="font-size:12px;color:#b0a09a;line-height:1.7;margin:0 0 8px;">
        Ce lien est personnel et non transférable. Conservez cet e-mail dans un endroit sûr.
      </p>
      <hr style="border:none;border-top:1px solid #ede4d6;margin:32px 0;">
      <p style="font-size:13px;color:#8a7570;line-height:1.7;margin:0;">
        Un problème ? Répondez à cet email ou écrivez-nous à <a href="mailto:contact@maisonmarialyon69.fr" style="color:#c4847a;text-decoration:none;">contact@maisonmarialyon69.fr</a>
      </p>
    </div>
    <div style="background:#f7f2ea;padding:20px 48px;text-align:center;">
      <p style="font-size:11px;color:#b0a09a;margin:0;">© 2026 Maison Maria · <a href="https://www.instagram.com/maisonmarialyon69" style="color:#c4847a;text-decoration:none;">@maisonmarialyon69</a></p>
    </div>
  </div>
</body>
</html>`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
