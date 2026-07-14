"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../shared";

export default function RecruitPage() {
  const [formState, setFormState] = useState({ handle: '', role: '', region: '', clips: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            <span style={{ color: C.red }}>06</span> / RECRUITMENT
          </div>
          <h1
            className="glitch-text"
            data-text="JOIN THE VOID"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 20,
              margin: 0,
            }}
          >
            JOIN THE VOID
          </h1>
          <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, letterSpacing: '0.05em', maxWidth: 500, margin: '24px auto 0' }}>
            WE DON&apos;T TAKE GOOD PLAYERS. WE TAKE KILLERS. IF YOUR KD IS &gt; 10 AND YOUR EGO FITS IN A 1080P MONITOR, APPLY.
          </p>
        </div>

        <div style={{
          background: C.gray,
          border: `1px solid rgba(0,255,100,0.2)`,
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)',
          padding: '48px',
        }}>
          <div style={{ fontSize: 10, color: C.green, letterSpacing: '0.4em', marginBottom: 32 }}>
            // APPLICATION_FORM.EXE
          </div>
          {submitted ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: C.green }}>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 12 }}>Merci</div>
              <div style={{ fontSize: 13, color: C.textMid, letterSpacing: "0.05em" }}>Merci, nous vous répondrons sous 24h.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="two-col">
                {[
                  { label: 'IN-GAME HANDLE', key: 'handle', placeholder: 'WRAITHX' },
                  { label: 'PREFERRED ROLE', key: 'role', placeholder: 'IGL / ENTRY / AWP / SUPPORT' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
                      {field.label}
                    </label>
                    <input
                      required
                      value={formState[field.key as keyof typeof formState]}
                      onChange={e => setFormState(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: `1px solid rgba(0,255,100,0.2)`,
                        padding: '12px 16px',
                        color: C.white,
                        fontFamily: "'Courier New', monospace",
                        fontSize: 12,
                        letterSpacing: '0.1em',
                        outline: 'none',
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
                  REGION
                </label>
                <select
                  required
                  value={formState.region}
                  onChange={e => setFormState(prev => ({ ...prev, region: e.target.value }))}
                  style={{
                    width: '100%',
                    background: C.gray,
                    border: `1px solid rgba(0,255,100,0.2)`,
                    padding: '12px 16px',
                    color: C.textMid,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">SELECT REGION</option>
                  <option value="eu">EU — EUROPE</option>
                  <option value="na">NA — NORTH AMERICA</option>
                  <option value="apac">APAC — ASIA PACIFIC</option>
                  <option value="latam">LATAM — LATIN AMERICA</option>
                </select>
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 10, color: C.textDim, letterSpacing: '0.35em', marginBottom: 8 }}>
                  CLIP LINKS / VOD URL
                </label>
                <textarea
                  required
                  value={formState.clips}
                  onChange={e => setFormState(prev => ({ ...prev, clips: e.target.value }))}
                  placeholder="https://clips.twitch.tv/... or YouTube VOD link"
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: `1px solid rgba(0,255,100,0.2)`,
                    padding: '12px 16px',
                    color: C.white,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  background: C.green,
                  border: 'none',
                  color: C.bg,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: `0 0 30px rgba(0,255,100,0.3)`,
                }}
              >
                SUBMIT APPLICATION
              </motion.button>
            </form>
          )}
          <div style={{ marginTop: 16, fontSize: 10, color: C.textDim, letterSpacing: '0.2em', textAlign: 'center' }}>
            RESPONSE TIME: 48-72 HRS. WE REVIEW EVERY CLIP. NO BS.
          </div>
        </div>
      </div>
    </div>
  );
}
