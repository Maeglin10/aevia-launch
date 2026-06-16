import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { list, put } from "@vercel/blob";
import type { SessionData } from "@/lib/sessions";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

const REMINDER_WINDOW_START_MS = 48 * 60 * 60 * 1000; // don't nudge before 48h
const REMINDER_WINDOW_END_MS = 14 * 24 * 60 * 60 * 1000; // stop nudging dead previews after 14d

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function reminderEmailHtml({ name, previewUrl }: { name: string; previewUrl: string }): string {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(previewUrl);
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>Votre aperçu vous attend — ${safeName}</title></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Arial,sans-serif;color:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,rgba(109,40,217,0.25),#18181b);padding:32px 36px;border-bottom:1px solid #27272a;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;font-weight:600;">AeviaLaunch</p>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Votre site ${safeName} vous attend ⏳</h1>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0 0 20px;font-size:14px;color:#a1a1aa;line-height:1.7;">
            Vous avez généré un aperçu personnalisé il y a 2 jours, mais il n'a pas encore été finalisé. Votre aperçu reste disponible — ne le laissez pas filer.
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

/** Lists every blob pathname under a prefix, following pagination cursors. */
async function listAllPathnames(prefix: string): Promise<string[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, cursor, limit: 1000 });
    pathnames.push(...result.blobs.map((b) => b.pathname));
    cursor = result.cursor;
  } while (cursor);
  return pathnames;
}

function idFromPathname(prefix: string, pathname: string): string {
  return pathname.slice(prefix.length).replace(/\.json$/, "");
}

export async function GET(req: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  // Vercel Cron sends Authorization: Bearer $CRON_SECRET automatically when
  // CRON_SECRET is set as a project env var. Reject anything else so this
  // route can't be used to spam the entire unpaid-preview list on demand.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://launch.aevia.services";
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "AeviaLaunch <noreply@aevia.io>";

  const [sessionPaths, paidPaths, remindedPaths] = await Promise.all([
    listAllPathnames("sessions/"),
    listAllPathnames("paid/"),
    listAllPathnames("reminders/"),
  ]);

  const paidIds = new Set(paidPaths.map((p) => idFromPathname("paid/", p)));
  const remindedIds = new Set(remindedPaths.map((p) => idFromPathname("reminders/", p)));

  const now = Date.now();
  let sent = 0;
  let skipped = 0;

  for (const pathname of sessionPaths) {
    const id = idFromPathname("sessions/", pathname);
    if (paidIds.has(id) || remindedIds.has(id)) {
      skipped++;
      continue;
    }

    try {
      const { blobs } = await list({ prefix: pathname, limit: 1 });
      if (blobs.length === 0) continue;
      const res = await fetch(blobs[0].url);
      if (!res.ok) continue;
      const data = (await res.json()) as SessionData;

      if (!data.generatedContent || !data.formData?.email) {
        skipped++;
        continue;
      }

      const ageMs = now - new Date(data.createdAt).getTime();
      if (ageMs < REMINDER_WINDOW_START_MS || ageMs > REMINDER_WINDOW_END_MS) {
        skipped++;
        continue;
      }

      const previewUrl = `${baseUrl}/preview/${id}`;
      await resend.emails.send({
        from: fromAddress,
        to: [data.formData.email],
        subject: `Votre site ${data.formData.businessName ?? ""} vous attend ⏳`,
        html: reminderEmailHtml({ name: data.formData.businessName ?? "votre site", previewUrl }),
      });

      await put(`reminders/${id}.json`, JSON.stringify({ sentAt: new Date().toISOString() }), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
      sent++;
    } catch (err) {
      console.error(`[cron/preview-reminder] failed for session ${id}`, err);
    }
  }

  return NextResponse.json({ sent, skipped, total: sessionPaths.length });
}
