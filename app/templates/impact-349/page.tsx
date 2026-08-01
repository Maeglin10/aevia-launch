"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CalendarCheck, CheckCircle, Clock, Gauge, Mail, MapPin, Phone, Star, Wrench } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { GhostSolid } from "@/lib/templates/hero-kit-2";

/* Centre de contrôle technique, 1re variante. Signature : GhostSolid — le châssis en fil de fer qui devient solide, comme un véhicule validé. Sans photographie. */

let C: Record<string, string> = {
  bg: "#0b0d11",
  bgSection: "#101319",
  bgDark: "#07090c",
  text: "#f2f1ed",
  textMuted: "#9aa0ab",
  accent: "var(--brand,#f2760a)",
  accentDark: "#f2a25c",
  accentLight: "#1c1610",
  hi: "#f2a25c",
  white: "#12151b",
  border: "rgba(255,255,255,0.09)",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Contrôles", "h": "#services"}, {"l": "Le déroulé", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];

const SERVICES_DEMO = [{"titre": "Contrôle technique périodique", "desc": "Les 133 points réglementaires : freinage, direction, liaisons au sol, pollution, éclairage. Rapport remis et expliqué ligne à ligne.", "tag": "VL"}, {"titre": "Contre-visite", "desc": "Incluse pendant deux mois : revenez quand c'est réparé, on ne re-contrôle que les points défaillants. Sans rendez-vous le samedi matin.", "tag": "Incluse"}, {"titre": "Véhicules électriques & hybrides", "desc": "Contrôleurs habilités haute tension, points spécifiques VE vérifiés selon la réglementation en vigueur.", "tag": "Électrique"}, {"titre": "Utilitaires & camping-cars", "desc": "Jusqu'à 3,5 t, ligne adaptée aux gabarits hauts. Contrôle pollution renforcé des utilitaires diesel.", "tag": "Utilitaire"}, {"titre": "Contrôle volontaire", "desc": "Avant un achat d'occasion ou un long trajet : le même banc, sans enregistrement officiel. Savoir avant d'acheter.", "tag": "Volontaire"}, {"titre": "Deux-roues motorisés", "desc": "Le contrôle des motos et scooters, désormais obligatoire, réalisé sur ligne dédiée par contrôleur formé.", "tag": "Moto"}];
const METHODE = [{"n": "01", "t": "RDV en ligne ou par téléphone", "d": "Créneaux du lundi au samedi midi, rappel SMS la veille, dépôt des clés possible dès 7 h 45."}, {"n": "02", "t": "Le contrôle, visible", "d": "La baie vitrée donne sur les lignes : regardez votre véhicule passer les bancs, un café à la main."}, {"n": "03", "t": "Le rapport, expliqué", "d": "Chaque défaillance montrée sur le véhicule quand c'est possible, mineure/majeure/critique clairement distinguées."}, {"n": "04", "t": "La suite, sans pression", "d": "Nous ne vendons aucune réparation. Vous réparez où vous voulez, la contre-visite est incluse deux mois."}];
const ENGAGEMENT = ["Centre agréé par la préfecture de la Drôme (S 026 X 042), contrôleurs agréés individuellement", "Indépendance totale : la loi nous interdit la réparation, nous ne recommandons aucun garage", "Prix affichés en salle d'attente et en ligne — le même pour tout le monde", "Équipements calibrés et vérifiés selon le référentiel OTC en vigueur"];
const TARIFS = [{"a": "Contrôle technique VL essence/diesel", "p": "79 €", "n": "133 points, rapport expliqué, contre-visite incluse 2 mois."}, {"a": "Véhicule électrique ou hybride", "p": "85 €", "n": "Points haute tension inclus, contrôleur habilité."}, {"a": "Deux-roues motorisé", "p": "60 €", "n": "Ligne dédiée, contrôle réglementaire complet."}, {"a": "Contrôle volontaire avant achat", "p": "59 €", "n": "Même banc, rapport détaillé, sans enregistrement officiel."}];
const AVIS_DEMO = [{"texte": "Défaillance majeure sur le freinage : le contrôleur m'a montré la pièce sous le pont, expliqué le risque, et ne m'a orienté vers personne. Réparé chez mon garagiste, contre-visite en dix minutes.", "auteur": "Marielle P.", "detail": "Contrôle + contre-visite"}, {"texte": "Contrôle volontaire avant d'acheter une occasion : 340 € de frais cachés détectés, prix renégocié d'autant. Les 59 € les plus rentables de l'année.", "auteur": "Hugo D.", "detail": "Contrôle avant achat"}, {"texte": "Camping-car passé sans stress, ligne adaptée, contrôleur qui connaît les porteurs. RDV pris en ligne la veille pour le samedi matin.", "auteur": "Jean-Luc et Françoise", "detail": "Camping-car"}];
const STATS = [{"value": "45 min", "label": "Contrôle complet, montre en main"}, {"value": "133", "label": "Points de contrôle réglementaires"}, {"value": "0", "label": "Réparation vendue — jamais"}, {"value": "2 mois", "label": "Pour la contre-visite incluse"}];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function ControleRhodanienPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);


  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    bp?.services?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "04 75 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33475000000"}`;
  const mail = fd?.email ?? "rdv@controle-rhodanien.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i349-nav { display: none !important; } .i349-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i349-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i349-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i349-split { grid-template-columns: 1fr !important; }
          .i349-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i349-stats .i349-statcell { border-right: none !important; }
          .i349-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i349-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Gauge size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? "Contrôle Rhodanien"}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Contrôle technique</span>
            </>
          )}
        </div>
        <div id="i349-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href="tel:+33475000000" style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            RDV en 2 min
          </motion.a>
        </div>
        <button className="i349-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href="tel:+33475000000" style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>RDV en 2 min</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      <section className="i349-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px 64px 70px", maxWidth: 1080, margin: "0 auto" }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Contrôle technique · Valence</span>
        <div style={{ margin: "18px 0 8px" }}><GhostSolid ghost="VOTRE VÉHICULE" solid="VALIDÉ." accent={C.accent} className="" /></div>
        <p style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 560, margin: "14px 0 32px" }}>
          {c?.heroSubline ?? fd?.tagline ?? "Un contrôle honnête, expliqué point par point, sans vente forcée : nous ne réparons pas, nous contrôlons — c'est la garantie de notre indépendance. Rendez-vous en ligne, résultat en 45 minutes."}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
            Prendre rendez-vous <ArrowRight size={16} />
          </motion.a>
          <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
            Les contrôles
          </motion.a>
        </div>
        
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i349-stats i349-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i349-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i349-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Contrôles</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Tout ce qui roule<br /><em>passe au banc.</em>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.white, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accent, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 18.5, color: C.text, margin: "15px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE / INFOS ─────────────────────────────────────────────── */}
      <section id="methode" className="i349-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Le déroulé</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                45 minutes,<br /><em>rien de caché.</em>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontFamily: FONT, fontSize: 28, color: C.accent, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.text, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i349-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i349-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Gauge size={80} color={C.accent} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                Indépendants<br /><em>par la loi, et par conviction.</em>
              </h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: C.accent, color: "#101010", borderRadius: 8, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.02 }}>
                Nous appeler <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i349-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Affichés, <em>identiques pour tous.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>La contre-visite est incluse pendant deux mois pour tout contrôle réalisé au centre.</p>
            </div>
          </Reveal>
          <div style={{ marginTop: 38 }}>
            {TARIFS.map((tt, idx) => (
              <Reveal key={tt.a} delay={idx * 0.06}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 17.5, color: C.text }}>{tt.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{tt.n}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 19, color: C.accent, whiteSpace: "nowrap" }}>{tt.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i349-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Contrôlés, <em style={{ color: C.hi }}>pas arnaqués</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.hi} color={C.hi} />)}
                </div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.hi, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i349-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>On vous attend</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            45 minutes,<br /><em>et vous êtes fixé.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Rendez-vous par téléphone ou en ligne, dépôt des clés possible. Salle d'attente avec café et wifi — ou regardez le contrôle derrière la baie.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i349-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? "Contrôle Rhodanien"}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Centre de contrôle technique agréé · Valence<br />Agrément préfectoral S 026 X 042 — contrôleurs agréés</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Valence, Drôme" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 8h–12h / 13h30–18h30 · Sam 8h–12h30" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Contrôle Rhodanien"} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
