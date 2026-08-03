import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This endpoint is intentionally unauthenticated — the wizard uploads the
// client's logo/photos before any account exists. A per-IP rate limiter is the
// backstop against abuse (using the public Blob store as free file hosting or
// filling it). In-memory + per-instance, so it only catches naive bursts on a
// warm lambda; pair with a WAF/edge limit for a hard guarantee.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 20) return true;
  entry.count += 1;
  return false;
}

// Extension is derived from the (validated) MIME type, never from the
// user-supplied filename — a "logo.html" named image/png must not be stored
// with an .html extension the Blob CDN could serve as text/html.
const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

/**
 * Les dimensions, lues dans l'en-tête du fichier.
 *
 * Le wizard mesure déjà dans le navigateur, ce qui donne au client une réponse
 * immédiate ; ceci est le garde-fou, parce qu'un contrôle côté client se
 * contourne avec une requête directe. Pas de bibliothèque : les trois formats
 * acceptés portent leurs dimensions dans les premiers octets.
 */
function dimensions(buf: Buffer): { width: number; height: number } | null {
  // PNG : signature de 8 octets, puis le chunk IHDR.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP : conteneur RIFF, variantes VP8 / VP8L / VP8X.
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8X") {
      return {
        width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
        height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
      };
    }
    return null;
  }
  // JPEG : parcourir les segments jusqu'au marqueur SOF.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // SOF0…SOF15, en excluant DHT (c4), JPG (c8) et DAC (cc).
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

/** En dessous, l'image est inutilisable quelle que soit sa place dans le thème. */
const MIN_COTE = 500;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again in a minute." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  const ext = MIME_EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Invalid file type" }, { status: 415 });

  const buf = Buffer.from(await file.arrayBuffer());
  const dim = dimensions(buf);
  if (!dim) {
    return NextResponse.json({ error: "Unreadable image" }, { status: 415 });
  }
  if (Math.max(dim.width, dim.height) < MIN_COTE) {
    return NextResponse.json(
      { error: `Image too small (${dim.width}×${dim.height}, minimum ${MIN_COTE}px)` },
      { status: 422 },
    );
  }

  const slug = `brief/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(slug, buf, { access: "public", contentType: file.type });
  return NextResponse.json({ url: blob.url, width: dim.width, height: dim.height });
}
