"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { C, F, PageHero, serviceDetails } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function Services() {
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

  return (
    <div>
      <PageHero
        eyebrow="Nos expertises"
        title={
          <>
            Services
            <br />& <span style={{ color: C.accent }}>savoir-faire</span>
          </>
        }
        subtitle="De l'esquisse à la livraison, nous intervenons sur l'ensemble du cycle d'un projet — architecture, urbanisme, intérieur, patrimoine — avec une même exigence de pérennité."
      />

      <section style={{ background: C.bg, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              background: C.border,
            }}
          >
            {serviceDetails.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                style={{
                  background: C.bgCard,
                  padding: 44,
                  borderTop: `2px solid ${i === 0 ? C.accent : 'transparent'}`,
                  transition: 'border-top-color 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderTopColor = C.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderTopColor =
                    i === 0 ? C.accent : 'transparent')
                }
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 11,
                    color: C.accent,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: 18,
                  }}
                >
                  {s.n}
                </span>
                <h3
                  style={{
                    fontFamily: F.sans,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.text,
                    letterSpacing: '-0.01em',
                    margin: '0 0 14px',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.75,
                    margin: '0 0 22px',
                    letterSpacing: '0.01em',
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 10,
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 20,
                  }}
                >
                  {s.points.map((pt) => (
                    <div
                      key={pt}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        fontFamily: F.sans,
                        fontSize: 13,
                        color: C.textMuted,
                        letterSpacing: '0.01em',
                        lineHeight: 1.5,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 1,
                          background: C.accent,
                          flexShrink: 0,
                          marginTop: 8,
                        }}
                      />
                      {pt}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA strip */}
          <div
            style={{
              background: C.bgDark,
              padding: '56px clamp(32px, 6vw, 72px)',
              marginTop: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap' as const,
              gap: 24,
              borderTop: `2px solid ${C.accent}`,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: F.sans,
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 700,
                  color: C.white,
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px',
                }}
              >
                Un projet à confier&nbsp;?
              </h2>
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                Le premier échange est gratuit et sans engagement. Parlez-nous de votre site, de votre programme et de vos délais.
              </p>
            </div>
            <Link href="/templates/impact-48/contact" style={{ textDecoration: "none" }}>
              <span
                style={{
                  background: C.accent,
                  color: C.bgDark,
                  padding: '15px 36px',
                  fontFamily: F.sans,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#d9b85c')}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
              >
                Nous contacter
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
