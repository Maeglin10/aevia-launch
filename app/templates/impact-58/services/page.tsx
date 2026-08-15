"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, C } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ServicesPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <section style={{ padding: "6rem 3rem", background: C.bgCard, minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
            / SERVICES
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.5rem" }}>
            Ce Que Nous Faisons
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1px", background: C.border }}>
          {SERVICES.map((svc, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={svc.code}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                whileHover={{ backgroundColor: "#0E0E18" }}
                style={{ background: C.bgCard, padding: "3rem", transition: "background 0.3s" }}
              >
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", color: C.violet, marginBottom: "1.5rem" }}>
                  {svc.code}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: "0.75rem", letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.25rem" }}>
                  {svc.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.75 }}>
                  {svc.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
