"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Rocket, Loader2 } from "lucide-react";
import GeneratedSite from "@/components/GeneratedSite";
import type { SessionData } from "@/lib/sessions";

export default function PreviewClient({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/sessions?id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setSession(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!session || !session.generatedContent) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Session not found.</p>
          <Link href="/configure" className="text-violet-400 hover:underline">Start over →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Floating action bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/configure" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Edit
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Share link"}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            Launch my site
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="pt-14">
        <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded-md px-3 py-1 text-zinc-500 text-xs font-mono truncate">
            Preview — {session.formData.businessName}
          </div>
        </div>

        <GeneratedSite session={session} />
      </div>

      {/* Launch modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Ready to launch!</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              We&apos;ll reach out to <span className="text-white font-medium">{session.formData.email}</span> within{" "}
              <span className="text-violet-400 font-semibold">2 hours</span> to finalise and deploy your site live.
            </p>
            <p className="text-zinc-500 text-xs mb-6">
              Your preview link: <span className="text-zinc-300 font-mono break-all">{typeof window !== "undefined" ? window.location.href : ""}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white transition-colors"
              >
                Back to preview
              </button>
              <a
                href={`mailto:contact@aevia.io?subject=Launch my site — ${session.formData.businessName}&body=Hi! I've configured my site and I'm ready to launch. Preview: ${typeof window !== "undefined" ? window.location.href : ""}`}
                className="flex-1 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors text-center"
              >
                Confirm launch
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
