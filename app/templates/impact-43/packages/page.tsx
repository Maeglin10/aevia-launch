"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { C, PACKAGES, PackageCard, TextReveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PackagesPage() {
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div style={{ background: C.cream, minHeight: "100dvh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.sage,
                marginBottom: 16,
              }}
            >
              Retreat Packages
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.charcoal,
                lineHeight: 1.1,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Choose your depth of immersion
            </h1>
          </TextReveal>
          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "#6b7265",
              maxWidth: 600,
              lineHeight: 1.8,
              fontWeight: 300,
              margin: "24px auto 0",
            }}
          >
            All packages include full thermal circuit access, organic amenities, fresh juices, and secure locker storage. Select a package to book.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 24,
            marginBottom: 64,
          }}
        >
          {PACKAGES.map((pkg, i) => (
            <PackageCard
              key={pkg.name}
              pkg={pkg}
              index={i}
              isSelected={selectedPackage === i}
              onSelect={() => setSelectedPackage(i)}
              onBook={() => window.location.href = "/templates/impact-43/contact"}
            />
          ))}
        </div>

        <div style={{ background: C.forest, padding: 48, borderRadius: 2, textAlign: "center" }}>
          <h2 style={{ fontFamily: C.font, fontSize: 28, color: C.charcoal, marginBottom: 16, fontStyle: "italic" }}>
            Custom Corporate & Group Bookings
          </h2>
          <p style={{ fontFamily: C.fontSans, fontSize: 15, color: "#6b7265", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 28px" }}>
            We design custom retreats for corporate leadership teams, weddings, and private wellness groups of 8 to 24 guests. Includes exclusive hire options.
          </p>
          <button
            onClick={() => window.location.href = "/templates/impact-43/contact"}
            style={{
              background: C.gold,
              color: C.charcoal,
              border: "none",
              padding: "16px 40px",
              fontFamily: C.fontSans,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Inquire for Group Rates
          </button>
        </div>
      </div>
    </div>
  );
}
