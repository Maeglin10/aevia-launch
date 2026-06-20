"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, MagneticButton, TextReveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div style={{ background: C.cream, minHeight: "100vh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
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
              Reserve Your Stay
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
              Begin your retreat
            </h1>
          </TextReveal>
          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "#6b7265",
              lineHeight: 1.8,
              fontWeight: 300,
              marginTop: 24,
            }}
          >
            Availability is limited to thirty guests per day. We recommend booking at least two weeks in advance for weekend visits.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: C.white,
            border: `1px solid ${C.mist}`,
            padding: "56px 64px",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: 28,
                  fontWeight: 300,
                  color: C.charcoal,
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                Merci
              </h2>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 16,
                  color: "#6b7265",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Merci, nous vous répondrons sous 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginBottom: 24,
                }}
                className="two-col"
              >
                {[
                  { label: "First Name", type: "text", placeholder: "Ingrid" },
                  { label: "Last Name", type: "text", placeholder: "Halvorsen" },
                  { label: "Email Address", type: "email", placeholder: "your@email.com" },
                  { label: "Phone Number", type: "tel", placeholder: "+33 6 12 34 56 78" },
                ].map((field) => (
                  <div key={field.label}>
                    <label
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: C.charcoal,
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: `1px solid ${C.mist}`,
                        background: C.cream,
                        fontFamily: C.fontSans,
                        fontSize: 14,
                        color: C.charcoal,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.charcoal,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Preferred Package
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `1px solid ${C.mist}`,
                    background: C.cream,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    color: C.charcoal,
                    outline: "none",
                  }}
                >
                  <option>Solstice — Half Day (€290)</option>
                  <option>Equinox — Full Day (€490)</option>
                  <option>Zenith — 2-Night Retreat (€1,290)</option>
                </select>
              </div>

              <div style={{ marginBottom: 36 }}>
                <label
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.charcoal,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Special Requests
                </label>
                <textarea
                  rows={4}
                  placeholder="Any allergies, mobility considerations, or special intentions..."
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `1px solid ${C.mist}`,
                    background: C.cream,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    color: C.charcoal,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <MagneticButton
                style={{
                  width: "100%",
                  background: C.sage,
                  color: C.white,
                  border: "none",
                  padding: "18px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Request Reservation
              </MagneticButton>
            </form>
          )}
        </motion.div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Phone", value: "+33 4 76 12 34 56" },
            { label: "Email", value: "reservations@serene-retreat.com" },
            { label: "Location", value: "Chartreuse Massif, Isère" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: C.sage,
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 18,
                  color: C.charcoal,
                  fontWeight: 400,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
