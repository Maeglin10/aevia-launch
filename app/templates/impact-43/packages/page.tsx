"use client";

import React, { useState } from "react";
import { C, PACKAGES, PackageCard, TextReveal } from "../shared";

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div style={{ background: C.cream, minHeight: "100vh", padding: "80px 5% 120px" }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
