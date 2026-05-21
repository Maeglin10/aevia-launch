import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "bin";
  const slug = `brief/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(slug, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
