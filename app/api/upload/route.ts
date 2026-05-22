import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!ALLOWED_MIME.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 415 });

  const ext = file.name.split(".").pop() ?? "bin";
  const slug = `brief/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(slug, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
