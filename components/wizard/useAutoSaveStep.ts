import { useEffect, useRef } from "react";

// Fires a debounced PATCH to /api/sessions whenever `data` changes, so a
// client who abandons mid-wizard still has their progress captured for a
// commercial follow-up. Silent — no loading spinner, no user-facing failure
// state (best-effort, matches the rest of this codebase's non-fatal pattern
// for background persistence).
export function useAutoSaveStep(sessionId: string | null, key: "formData" | "businessProfile", data: unknown) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId || !data) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(`/api/sessions?id=${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: data }),
      }).catch((err) => console.error("[wizard] auto-save failed", err));
    }, 800);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [sessionId, key, data]);
}
