"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Carrot, CheckCircle, Clock, Egg, Mail, MapPin, Phone, Sprout, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, HeldSwap, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* Producteur fermier en vente directe, 1re variante. Signature : HeldSwap — le panier de la semaine posé sur la table. Images nature déjà présentes dans le repo. */

let C: Record<string, string> = {
  bg: "#f9faf7",
  bgSection: "#eef2ea",
  bgDark: "#22271f",
  text: "#20251c",
  textMuted: "#5f6858",
  accent: "var(--brand,#5c7a4e)",
  accentDark: "#465e3a",
  accentLight: "#e4ecdd",
  hi: "#a9c491",
  white: "#ffffff",
  border: "#dde4d6",
};
const FONT = "'Libre Baskerville', Georgia, serif";
const FONT_BODY = "'Cabin', system-ui, sans-serif";

const NAV = [{"l": "Nos produits", "h": "#services"}, {"l": "La ferme", "h": "#methode"}, {"l": "Paniers & prix", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
function HERO_DEMO_LIVE() {
  return [{"k": "Le panier de la semaine", "line": "Composé mardi, cueilli jeudi, retiré vendredi.", "sub": "Légumes du moment, jamais les mêmes deux semaines de suite.", "img": (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"), "alt": "Légumes du jardin en permaculture"}, {"k": "Le jardin", "line": "Deux hectares menés en bio, sans raccourci.", "sub": "Certification AB, sol vivant, rotations longues.", "img": (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"), "alt": "Travail au jardin de la ferme"}, {"k": "Les saisons", "line": "En juin les fraises, en janvier les poireaux.", "sub": "On ne force rien — c'est le principe.", "img": (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"), "alt": "Rangs de culture à la belle saison"}];
}
let HERO_DEMO = HERO_DEMO_LIVE();
let HERO = HERO_DEMO;

const SERVICES_SOURCE = [{"titre": "Légumes de saison", "desc": "Quarante variétés sur l'année, cueillies la veille ou le matin de la vente. La tomate d'août et le panais de janvier — jamais l'inverse.", "tag": "Maraîchage"}, {"titre": "Œufs de plein air", "desc": "250 poules sur parcours herbeux, nourries au grain local complété par ce que la ferme produit. Ramassés chaque matin.", "tag": "Œufs"}, {"titre": "Volailles fermières", "desc": "Poulets élevés 110 jours minimum, en plein air, abattus en abattoir de proximité. Sur commande, retrait le vendredi.", "tag": "Volaille"}, {"titre": "Paniers hebdomadaires", "desc": "Petit (2 pers.) ou grand (4-5 pers.) : la récolte de la semaine, une recette pour le légume oublié, sans engagement.", "tag": "Paniers"}, {"titre": "Conserves de la ferme", "desc": "Coulis, ratatouille, soupes d'hiver : l'été mis en bocaux dans notre atelier agréé, pour les mois sans.", "tag": "Bocaux"}, {"titre": "Visites & œufs de vacances", "desc": "La ferme se visite le premier samedi du mois. Les enfants ramassent les œufs, les parents comprennent les prix.", "tag": "Visites"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Un sol vivant", "d": "Rotations longues, engrais verts, compost de la ferme : le sol est notre premier outil de travail."}, {"n": "02", "t": "Cueilli à maturité", "d": "La récolte se fait pour le lendemain, pas pour tenir une semaine de camion. Ça change le goût, vraiment."}, {"n": "03", "t": "Vendu en direct", "d": "Boutique à la ferme, marché de Cahors le samedi, paniers réservés : aucun intermédiaire, prix décidés ici."}, {"n": "04", "t": "Contrôlé chaque année", "d": "Certification AB par organisme agréé, contrôles annuels — le logo se mérite, il ne se déclare pas."}];
const ENGAGEMENT_DEMO = ["Certification Agriculture Biologique (AB), contrôles annuels d'organisme agréé", "Vente directe uniquement : ce qui est sur l'étal a poussé ici, point", "Prix affichés à l'année, décidés par la ferme — pas par un cours mondial", "La ferme se visite : premier samedi du mois, et sur demande pour les écoles"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Panier petit (2 pers.)", "p": "14 €", "n": "5-6 légumes de la semaine + la recette du légume oublié."}, {"a": "Panier grand (4-5 pers.)", "p": "24 €", "n": "8-10 légumes, de quoi tenir la semaine sans supermarché."}, {"a": "Œufs plein air (×6)", "p": "2,80 €", "n": "Ramassés du matin, boîtes consignées reprises."}, {"a": "Poulet fermier (~1,8 kg)", "p": "12,90 €/kg", "n": "Sur commande avant mercredi, retrait vendredi."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Deux ans de panier hebdomadaire : on a réappris à cuisiner avec les saisons, les enfants reconnaissent les légumes, et le goût des tomates d'août ne se compare à rien.", "auteur": "Famille Delmas", "detail": "Panier grand"}, {"texte": "La visite du premier samedi vaut tous les discours : on voit les poules, le compost, les rangs. Depuis, le prix des œufs me paraît même trop bas.", "auteur": "Nathalie C.", "detail": "Visite + cliente marché"}, {"texte": "Poulet de 110 jours commandé pour un dimanche de famille : mes parents ont retrouvé « le goût du poulet d'avant ». Tout est dit.", "auteur": "Julien F.", "detail": "Volaille fermière"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "AB", "label": "Certifiée agriculture biologique"}, {"value": "2 ha", "label": "De maraîchage diversifié"}, {"value": "250", "label": "Poules de plein air"}, {"value": "0 km", "label": "Entre le champ et la boutique"}];
let STATS = STATS_DEMO;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function QuatreVentsPage() {
  const [session, setSession] = useState<any>(null);

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
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fid = "fonts-i365";
    if (document.getElementById(fid)) return;
    const s = document.createElement("style");
    s.id = fid;
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cabin:wght@400;500;600;700&display=swap');`;
    document.head.appendChild(s);
  }, []);

  fd = session?.formData;

  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  HERO_DEMO = HERO_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO = HERO_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "05 65 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33565000000"}`;
  const mail = fd?.email ?? "panier@ferme-quatre-vents.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i365-nav { display: none !important; } .i365-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i365-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i365-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i365-split { grid-template-columns: 1fr !important; }
          .i365-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i365-stats .i365-statcell { border-right: none !important; }
          .i365-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i365-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Sprout size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Ferme des Quatre Vents"))}</span>
              
            </>
          )}
        </div>
        <div id="i365-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33565000000"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Panier de la semaine
          </motion.a>
        </div>
        <button className="i365-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${fd?.phone ?? "+33565000000"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Panier de la semaine</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="i365-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>{clientEyebrow(sessionData) ?? "Ferme bio · Vallée du Lot"}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(34px, 4.6vw, 60px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 14) ?? "Ce que la terre donne,"}<br /><em style={{ color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 14) ?? "la semaine où elle le donne."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Maraîchage bio, œufs de plein air, poulets fermiers : la ferme vend en direct ce qu'elle produit, au rythme des saisons. Paniers de la semaine, boutique à la ferme et marché de Cahors."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Réserver mon panier <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Ce qu'on produit
            </motion.a>
          </motion.div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 42, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
          </div>
        </div>
        <div className="i365-card">
          <HeldSwap index={i} tilt={9}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 18px 52px rgba(0,0,0,0.18)" }}>
              <img src={S.img} alt={S.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "22px 24px 24px", borderTop: `3px solid ${C.accent}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accentDark, marginBottom: 8 }}>{S.k}</div>
                <div style={{ fontFamily: FONT, fontSize: 19, color: C.text, lineHeight: 1.35 }}>{S.line}</div>
              </div>
            </div>
          </HeldSwap>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i365-stats i365-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i365-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i365-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos produits</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Peu de choses,<br /><em>mais les nôtres.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.white, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 18.5, color: C.text, margin: "15px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE / INFOS ─────────────────────────────────────────────── */}
      <section id="methode" className="i365-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>La ferme</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Bio, locale,<br /><em>et ça se vérifie.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontFamily: FONT, fontSize: 28, color: C.accentDark, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.text, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i365-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i365-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(4, "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80")} alt="Le jardin de la ferme en pleine saison" loading="lazy" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                La transparence<br /><em>jusqu'au bout du rang.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: C.accentDark, color: "#fff", borderRadius: 8, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.02 }}>
                Nous appeler <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i365-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Paniers & prix</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Le juste prix, <em>des deux côtés.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Sans engagement : on réserve son panier avant mardi soir, on le retire vendredi à la ferme ou samedi au marché.</p>
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
                  <div style={{ fontFamily: FONT, fontSize: 19, color: C.accentDark, whiteSpace: "nowrap" }}>{tt.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i365-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Ils mangent <em style={{ color: C.hi }}>la semaine de la ferme</em>.</>)}</h2>
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
      <section id="contact" className="i365-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>La boutique</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Passez à la ferme,<br /><em>repartez avec la semaine.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Boutique mercredi et vendredi soir, samedi matin. Paniers réservés par téléphone ou SMS avant mardi soir.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i365-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Ferme des Quatre Vents"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Ferme en agriculture biologique · Cahors<br />Certifiée AB — vente directe et marchés</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? clientCity(sessionData) ?? "Cahors, Lot" }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Boutique ferme : Mer & Ven 16h–19h · Sam 9h–13h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Ferme des Quatre Vents"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
