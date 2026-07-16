"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("c");

  useEffect(() => {
    if (!code) {
      router.replace("/?auth_error=missing_code");
      return;
    }

    fetch(`/api/idp/auth/oauth-session?c=${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("exchange_failed");
        // Confirm session is active before redirecting.
        const me = await fetch("/api/idp/auth/me");
        if (!me.ok) throw new Error("session_invalid");
        const returnTo = sessionStorage.getItem("aevia_return_to") || "/";
        sessionStorage.removeItem("aevia_return_to");
        router.replace(returnTo);
      })
      .catch(() => router.replace("/?auth_error=oauth_failed"));
  }, [code, router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Connexion en cours…</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
