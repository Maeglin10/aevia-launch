import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { saveSessionToBlob, type FormData as SiteFormData, type GeneratedContent } from "@/lib/sessions";
import { generateMockContent } from "@/lib/mockContent";

// IMPORTANT: configure RESEND_FROM_EMAIL with a verified domain (e.g., noreply@aevia.io)
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── Clients ───────────────────────────────────────────────────────────────────

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

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


interface BriefMeta {
  company?: string;
  industry?: string;
  tagline?: string;
  colors?: string;
  description?: string;
  logo_url?: string;
  photos?: string;
  services?: string;
  about?: string;
  contact?: string;
  socials?: string;
  notes?: string;
}

function briefRow(label: string, value: string | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td colspan="2" style="padding:8px 0;border-bottom:1px solid #27272a;">
        <p style="margin:0 0 3px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">${label}</p>
        <p style="margin:0;font-size:13px;color:#d4d4d8;word-break:break-word;">${escapeHtml(value)}</p>
      </td>
    </tr>`;
}

function clientEmailHtml({ name, previewUrl }: { name: string; previewUrl: string }): string {
  const safeName = escapeHtml(name);
  const safeUrl  = escapeHtml(previewUrl);
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>Votre site — ${safeName}</title></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Arial,sans-serif;color:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,rgba(109,40,217,0.25),#18181b);padding:32px 36px;border-bottom:1px solid #27272a;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;font-weight:600;">AeviaLaunch</p>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Votre site est en préparation ✨</h1>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0 0 20px;font-size:14px;color:#a1a1aa;line-height:1.7;">
            Merci pour votre commande ! Nous avons généré un aperçu personnalisé de <strong style="color:#fff;">${safeName}</strong> basé sur vos informations.
          </p>
          <p style="margin:0 0 28px;font-size:14px;color:#a1a1aa;line-height:1.7;">
            Notre équipe finalise votre site et vous contacte sous <strong style="color:#fff;">2 heures</strong>. En attendant, découvrez votre aperçu :
          </p>
          <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;border-radius:10px;text-decoration:none;">
            Voir mon aperçu →
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#52525b;">
            Ou copiez ce lien : <span style="color:#7c3aed;">${safeUrl}</span>
          </p>
        </td></tr>
        <tr><td style="padding:16px 36px;border-top:1px solid #27272a;background:#0f0f12;">
          <p style="margin:0;font-size:11px;color:#52525b;text-align:center;">AeviaLaunch · Paiement traité par Stripe</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function orderEmailHtml(params: {
  name: string;
  type: string;
  typeLabel: string;
  maintenance: boolean;
  total: number; // euros
  date: string;
  sessionId: string;
  brief?: BriefMeta;
  previewUrl?: string;
}): string {
  const { name, typeLabel, maintenance, total, date, sessionId, brief, previewUrl } = params;
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

              <p style="margin:0 0 16px;font-size:13px;color:#71717a;line-height:1.6;">
                Action requise : démarrer la création et contacter le client sous 2 heures.
              </p>

              ${previewUrl ? `
              <a href="${escapeHtml(previewUrl)}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;border-radius:8px;text-decoration:none;margin-bottom:8px;">
                Voir l'aperçu généré →
              </a>` : ""}

              ${brief && Object.values(brief).some(Boolean) ? `
              <!-- Brief client -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #3f3f46;padding-top:20px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px;">
                    <h2 style="margin:0;font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Brief client</h2>
                  </td>
                </tr>
                ${briefRow("Entreprise", brief.company)}
                ${briefRow("Secteur", brief.industry)}
                ${briefRow("Accroche / Tagline", brief.tagline)}
                ${briefRow("Couleurs", brief.colors)}
                ${briefRow("Description", brief.description)}
                ${briefRow("À propos", brief.about)}
                ${briefRow("Services", brief.services)}
                ${briefRow("Contact", brief.contact)}
                ${briefRow("Réseaux sociaux", brief.socials)}
                ${brief.logo_url ? `
                <tr>
                  <td colspan="2" style="padding:8px 0;border-bottom:1px solid #27272a;">
                    <p style="margin:0 0 3px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Logo</p>
                    <a href="${escapeHtml(brief.logo_url)}" style="font-size:13px;color:#7c3aed;word-break:break-all;">Voir le logo</a>
                  </td>
                </tr>` : ""}
                ${brief.photos ? `
                <tr>
                  <td colspan="2" style="padding:8px 0;border-bottom:1px solid #27272a;">
                    <p style="margin:0 0 6px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Photos</p>
                    ${brief.photos.split(",").filter(Boolean).map((url, i) =>
                      `<a href="${escapeHtml(url.trim())}" style="display:inline-block;margin:0 6px 6px 0;font-size:12px;color:#7c3aed;">Photo ${i + 1}</a>`
                    ).join("")}
                  </td>
                </tr>` : ""}
                ${briefRow("Notes", brief.notes)}
              </table>` : ""}

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

// ─── Idempotency reservation via Blob ──────────────────────────────────────────

/**
 * Reserve a Stripe event ID by writing a marker blob. Returns false if the event
 * was already processed (duplicate webhook delivery), true otherwise. Fails open
 * if the Blob store is unreachable so valid events are never silently dropped.
 */
async function tryReserveEvent(eventId: string): Promise<boolean> {
  const key = `events/${eventId}.json`;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (blobs.length > 0) return false; // already processed
    await put(key, JSON.stringify({ processedAt: new Date().toISOString() }), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return true;
  } catch (err) {
    console.error("[webhook] reserve failed", err);
    return true; // fail-open to avoid blocking valid events
  }
}

// ─── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!stripe || !resend) {
    return NextResponse.json({ error: "Missing API keys" }, { status: 500 });
  }

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
    Sentry.captureException(err, { tags: { route: "webhook", stage: "signature-verification" } });
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Idempotency — Stripe may retry deliveries (up to 3 days). Reserve the
  //    event id in Blob before processing so duplicates short-circuit here.
  const reserved = await tryReserveEvent(event.id);
  if (!reserved) {
    console.log(`[webhook] Skipping duplicate event ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // 4. Acknowledge receipt fast — Stripe expects 2xx within 30 s.
  //    We process synchronously here (no queue) but keep it lightweight.
  //    For high-volume, move heavy work to a background job.

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const meta = session.metadata ?? {};
      const siteType   = meta.siteType   ?? meta.type ?? "landing";
      const siteName   = meta.siteName   ?? meta.name ?? "Votre site";
      const withMaint  = meta.maintenance === "1";
      const typeLabel  = SITE_LABELS[siteType] ?? siteType;

      // ── Resolve the full brief from Blob (we only store a briefId in Stripe metadata) ──
      const briefId = meta.briefId;
      let brief: BriefMeta = {};
      if (briefId) {
        try {
          const { list } = await import("@vercel/blob");
          const { blobs } = await list({ prefix: `briefs/${briefId}.json`, limit: 1 });
          if (blobs.length > 0) {
            const res = await fetch(blobs[0].url);
            if (res.ok) brief = await res.json() as BriefMeta;
          }
        } catch (err) {
          console.error("[webhook] brief fetch failed", err);
        }
      }

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

      // The brief from Blob is the raw onboarding payload (BriefData shape with
      // colorPrimary/colorSecondary/phone/email/etc as separate fields). We
      // normalise both shapes here so legacy events still work.
      const rawBrief = brief as BriefMeta & Record<string, unknown>;
      const briefCompany     = (rawBrief.company     as string | undefined) || undefined;
      const briefIndustry    = (rawBrief.industry    as string | undefined) || undefined;
      const briefTagline     = (rawBrief.tagline     as string | undefined) || undefined;
      const briefDescription = (rawBrief.description as string | undefined) || undefined;
      const briefAbout       = (rawBrief.about       as string | undefined) || undefined;
      const briefNotes       = (rawBrief.notes       as string | undefined) || undefined;
      const briefLogoUrl     = (rawBrief.logo_url    as string | undefined) || (rawBrief.logoUrl as string | undefined) || undefined;
      const briefPhotoUrlsArr = Array.isArray(rawBrief.photoUrls)
        ? (rawBrief.photoUrls as string[])
        : ((rawBrief.photos as string | undefined)?.split(",").map(u => u.trim()).filter(Boolean) ?? []);
      const briefColors = (rawBrief.colors as string | undefined)
        ?? `${String(rawBrief.colorPrimary ?? "")} / ${String(rawBrief.colorSecondary ?? "")}`;
      const briefContact = (rawBrief.contact as string | undefined)
        ?? `${String(rawBrief.phone ?? "")} | ${String(rawBrief.email ?? "")} | ${String(rawBrief.address ?? "")}`;
      const briefSocials = (rawBrief.socials as string | undefined)
        ?? `IG:${String(rawBrief.instagram ?? "")} LI:${String(rawBrief.linkedin ?? "")} WEB:${String(rawBrief.website ?? "")}`;
      const briefServicesStr = typeof rawBrief.services === "string"
        ? rawBrief.services
        : JSON.stringify(rawBrief.services ?? []);

      // Repopulate the structured brief used for the order email
      brief = {
        company:     briefCompany,
        industry:    briefIndustry,
        tagline:     briefTagline,
        colors:      briefColors,
        description: briefDescription,
        logo_url:    briefLogoUrl,
        photos:      briefPhotoUrlsArr.join(","),
        services:    briefServicesStr,
        about:       briefAbout,
        contact:     briefContact,
        socials:     briefSocials,
        notes:       briefNotes,
      };

      // ── Generate personalized site from brief ────────────────────────────────
      const primaryColor = briefColors.split("/")[0]?.trim() || "#7c3aed";
      const [phone = "", email = ""] = briefContact.split("|").map(s => s.trim());
      const igMatch = briefSocials.match(/IG:([^\s]+)/);
      const liMatch = briefSocials.match(/LI:([^\s]+)/);

      const formData: SiteFormData = {
        businessName:   briefCompany   ?? siteName,
        businessType:   siteType,
        tagline:        briefTagline   ?? "",
        city:           "",
        mainService:    briefDescription ?? "",
        benefits:       ["", "", ""],
        priceRange:     "",
        targetAudience: briefAbout     ?? "",
        brandColor:     primaryColor,
        tone:           "professional",
        template:       meta.theme      ?? siteType,
        heroImageUrl:   briefPhotoUrlsArr[0] ?? undefined,
        logoUrl:        briefLogoUrl   ?? undefined,
        photoUrls:      briefPhotoUrlsArr,
        email,
        phone:          phone || undefined,
        instagram:      igMatch?.[1]    ?? undefined,
        linkedin:       liMatch?.[1]    ?? undefined,
      };

      let generatedContent: GeneratedContent;
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey) {
        try {
          const Anthropic = (await import("@anthropic-ai/sdk")).default;
          const client = new Anthropic({ apiKey });
          const services = (() => {
            try { return JSON.parse(brief.services ?? "[]") as { name: string; description?: string }[]; }
            catch { return []; }
          })();
          const prompt = `Tu es un copywriter professionnel. Génère le contenu d'un site web en français pour cette entreprise:
- Nom: ${formData.businessName}
- Type: ${siteType}
- Accroche: ${formData.tagline}
- Description: ${formData.mainService}
- Services: ${services.map((s: { name: string; description?: string }) => s.name).join(", ")}
- Cible: ${formData.targetAudience}
- Secteur: ${brief.industry ?? siteType}

Génère du JSON avec exactement ces champs:
{
  "heroHeadline": "...",
  "heroSubline": "...",
  "aboutTitle": "...",
  "aboutText": "...",
  "services": [{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}],
  "testimonials": [{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5}],
  "ctaText": "...",
  "metaTitle": "...",
  "metaDescription": "..."
}
Retourne uniquement du JSON valide, sans markdown.`;

          const msg = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          });
          const text = msg.content[0].type === "text" ? msg.content[0].text : "";
          generatedContent = JSON.parse(text) as GeneratedContent;
        } catch (err) {
          console.error("[webhook] Claude generation failed, using mock:", err);
          generatedContent = generateMockContent(formData);
        }
      } else {
        generatedContent = generateMockContent(formData);
      }

      const previewSessionId = crypto.randomUUID();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://launch.aevia.services";
      const previewUrl = `${baseUrl}/preview/${previewSessionId}`;
      const fromAddress = process.env.RESEND_FROM_EMAIL || "Aevia Launch <onboarding@resend.dev>";

      // ── Persist the preview session to Blob — MUST succeed before emailing
      // the client a preview link (otherwise the link 404s and the client
      // believes they paid for nothing). On failure, we alert Valentin only.
      let blobSaveOk = true;
      try {
        await saveSessionToBlob(previewSessionId, {
          id: previewSessionId,
          formData,
          generatedContent,
          createdAt: new Date(),
        });
      } catch (err) {
        blobSaveOk = false;
        console.error("[webhook] saveSessionToBlob failed:", err);
        Sentry.captureException(err, { tags: { route: "webhook", stage: "session-save" } });
        try {
          await resend.emails.send({
            from: fromAddress,
            to: "v.milliand@gmail.com",
            subject: `🚨 Blob save FAILED — Commande à traiter manuellement (${siteName})`,
            html: `<p>La sauvegarde Blob de la session preview a échoué pour la commande <strong>${escapeHtml(siteName)}</strong>.</p>
              <p>Session Stripe : <code>${escapeHtml(session.id)}</code></p>
              <p>Le client n'a PAS reçu son lien de preview. À traiter manuellement.</p>
              <p>Erreur : <code>${escapeHtml(String(err))}</code></p>`,
          });
        } catch (mailErr) {
          console.error("[webhook] failed to send urgent alert email:", mailErr);
          Sentry.captureException(mailErr, { tags: { route: "webhook", stage: "urgent-alert" } });
        }
      }

      // ── Email to Valentin ────────────────────────────────────────────────────
      if (blobSaveOk) {
        await resend.emails.send({
          from: fromAddress,
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
            brief,
            previewUrl,
          }),
        });
      }

      // ── Email to client ──────────────────────────────────────────────────────
      // Skip the client email if the blob save failed — sending a dead preview
      // link to a paying customer is worse than no email at all.
      const clientEmail = session.customer_details?.email ?? email;
      if (clientEmail && blobSaveOk) {
        await resend.emails.send({
          from: fromAddress,
          to: clientEmail,
          subject: `Votre site est en cours de création — ${siteName}`,
          html: clientEmailHtml({ name: siteName, previewUrl }),
        });
      }

      console.log(`[webhook] Order processed — preview: ${previewUrl}`);
    }
    // Add handlers for other event types here:
    // payment_intent.payment_failed, charge.dispute.created, etc.
  } catch (err) {
    // Log processing errors but still return 200 to avoid Stripe retries
    // (which would resend the email). For critical failures, use a dead-letter queue.
    Sentry.captureException(err, { tags: { route: "webhook", stage: "event-processing", eventType: event.type } });
    console.error("[webhook] Error processing event:", event.type, err);
  }

  return NextResponse.json({ received: true });
}
