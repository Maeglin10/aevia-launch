"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, ClipboardList, Clock, Clock3, HeartPulse, Home, Mail, MapPin, Phone, Star, Syringe } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ComposeIn } from "@/lib/templates/hero-kit-3";

/* Infirmiers libéraux, 2e variante, cabinet côtier moderne. Signature : ComposeIn — la tournée du jour qui se compose, soin par soin. Tuiles CSS sans photo. */

let C: Record<string, string> = {
  bg: "#f6f9fb",
  bgSection: "#e9f0f5",
  bgDark: "#12222e",
  text: "#132029",
  textMuted: "#54646e",
  accent: "var(--brand,#20648c)",
  accentDark: "#194e6d",
  accentLight: "#dbeaf3",
  hi: "#8cc0dd",
  white: "#ffffff",
  border: "#d9e4ea",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Soins", "h": "#services"}, {"l": "L'organisation", "h": "#methode"}, {"l": "Prise en charge", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [
  { k: "La tournée du matin", sub: "Composée la veille, tenue le jour même.", tiles: [{ icon: Syringe, t: "6h30 — À jeun d'abord", d: "Prélèvements et glycémies avant le petit-déjeuner des patients.", bg: "#dbeaf3", fg: "#194e6d" }, { icon: Home, t: "Matinée — Soins lourds", d: "Pansements complexes et perfusions, quand on a le temps de bien faire.", bg: "#12222e", fg: "#dbeaf3" }, { icon: Clock3, t: "Créneaux fiables", d: "SMS si la tournée glisse — votre matinée n'attend pas la nôtre.", bg: "#e9f0f5", fg: "#194e6d" }] },
  { k: "Le suivi partagé", sub: "La famille informée, le médecin aussi.", tiles: [{ icon: ClipboardList, t: "Dossier commun", d: "Six infirmiers, un seul dossier de soins — la continuité, vraiment.", bg: "#12222e", fg: "#dbeaf3" }, { icon: HeartPulse, t: "Appli famille", d: "Passage confirmé, constantes notées : les proches éloignés respirent.", bg: "#dbeaf3", fg: "#194e6d" }, { icon: Home, t: "Lien médecin", d: "Photos de plaies sécurisées, alertes précoces — le médecin sait avant que ça s'aggrave.", bg: "#e9f0f5", fg: "#194e6d" }] },
  { k: "Les soins techniques", sub: "L'hôpital à la maison, en sécurité.", tiles: [{ icon: Syringe, t: "Perfusions & PICC", d: "Antibiothérapies, nutrition, chimio orale accompagnée — protocoles hospitaliers.", bg: "#e9f0f5", fg: "#194e6d" }, { icon: ClipboardList, t: "Chimio & post-op", d: "Retours de bloc suivis en lien direct avec les services.", bg: "#dbeaf3", fg: "#194e6d" }, { icon: HeartPulse, t: "Palliatif coordonné", d: "Avec l'HAD et l'équipe mobile : rester chez soi, accompagné.", bg: "#12222e", fg: "#dbeaf3" }] }
];

const SERVICES_DEMO = [{"titre": "Prélèvements", "desc": "À domicile dès 6h30, au cabinet sans rendez-vous de 7h30 à 9h30. Acheminement direct aux deux laboratoires de la ville.", "tag": "Biologie"}, {"titre": "Plaies & cicatrisation", "desc": "Formation plaies et cicatrisation (DU) au cabinet : escarres, ulcères, plaies chroniques suivies par protocole photographié.", "tag": "Expertise"}, {"titre": "Perfusions à domicile", "desc": "PICC-line, chambres implantables, pompes : les soins d'hôpital à la maison, avec les protocoles de l'hôpital.", "tag": "Technique"}, {"titre": "Grand âge & dépendance", "desc": "Toilettes, piluliers, surveillance : des passages réguliers qui maintiennent à domicile dans la dignité.", "tag": "Autonomie"}, {"titre": "Diabète", "desc": "Éducation, glycémies, insuline, prévention du pied diabétique : le suivi rapproché qui évite les hospitalisations.", "tag": "Diabète"}, {"titre": "Coordination familles", "desc": "Application dédiée : passages confirmés, transmissions visibles, messagerie sécurisée. Les enfants à distance restent informés.", "tag": "Familles"}];
const METHODE = [{"n": "01", "t": "Un appel, une réponse", "d": "La secrétaire décroche de 8h à 18h : ordonnance reçue, tournée organisée, créneau confirmé dans l'heure."}, {"n": "02", "t": "La bonne compétence", "d": "Plaies complexes au titulaire du DU, perfusions aux référents techniques : chacun son domaine."}, {"n": "03", "t": "Le passage confirmé", "d": "SMS ou notification à chaque passage — utile pour les proches, rassurant pour tous."}, {"n": "04", "t": "Le lien qui remonte", "d": "Toute évolution signalée au médecin le jour même. Les urgences évitées valent mieux que les urgences gérées."}];
const ENGAGEMENT = ["Six infirmiers diplômés d'État, conventionnés CPAM, inscrits à l'Ordre", "Secrétariat humain 8h-18h — pas de répondeur qui promet de rappeler", "Dossier de soins unique partagé, messagerie sécurisée de santé (MSSanté)", "Zone d'intervention annoncée et tenue : on refuse plutôt que de mal faire"];
const TARIFS = [{"a": "Soins sur ordonnance", "p": "tiers payant", "n": "AMI/AIS selon nomenclature + indemnités de déplacement réglementaires."}, {"a": "Prélèvement au cabinet", "p": "tiers payant", "n": "Sans rendez-vous 7h30-9h30, résultats via votre laboratoire."}, {"a": "Bilan de soins infirmiers (BSI)", "p": "pris en charge", "n": "Pour les patients dépendants : évaluation complète, plan de soins transmis."}, {"a": "Appli familles", "p": "incluse", "n": "Pour tous les patients en soins réguliers, sans supplément."}];
const AVIS_DEMO = [{"texte": "Depuis Paris, je vois chaque passage chez mon père à Saint-Nazaire : confirmé, commenté, avec les constantes. Cette appli m'a rendu des nuits de sommeil.", "auteur": "Fils de M. G.", "detail": "Suivi à distance"}, {"texte": "Escarre de stade 3 reprise en trois mois par l'infirmière au DU plaies. Photos envoyées au médecin chaque semaine, protocole ajusté sans que je me déplace.", "auteur": "Épouse de R.", "detail": "Plaies complexes"}, {"texte": "Le secrétariat change tout : un humain répond, la tournée est calée le jour même. Après deux cabinets injoignables, on mesure la différence.", "auteur": "Nadège P.", "detail": "Perfusions post-op"}];
const STATS = [{"value": "6", "label": "Infirmiers D.E."}, {"value": "1", "label": "Secrétaire qui décroche"}, {"value": "20 km", "label": "De zone couverte annoncée"}, {"value": "98 %", "label": "De passages dans le créneau"}];

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

export default function SoinsEstuairePage() {
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
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  const tiles = S.tiles.map(({ icon: Icon, t: tt, d, bg, fg }, n) => ({
    from: (n === 0 ? "left" : n === 1 ? "right" : "bottom") as "left" | "right" | "bottom",
    node: (
      <div style={{ background: bg, color: fg, borderRadius: 14, padding: "20px 22px", height: "100%", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon size={22} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 5 }}>{tt}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, opacity: 0.85 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "02 40 00 00 01";
  const telHref = `tel:${fd?.phone ?? "+33240000001"}`;
  const mail = fd?.email ?? "secretariat@soins-estuaire.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i356-nav { display: none !important; } .i356-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i356-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i356-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i356-split { grid-template-columns: 1fr !important; }
          .i356-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i356-stats .i356-statcell { border-right: none !important; }
          .i356-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i356-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <HeartPulse size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? "Soins de l'Estuaire"}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Infirmiers</span>
            </>
          )}
        </div>
        <div id="i356-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href="tel:+33240000001" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Appeler le secrétariat
          </motion.a>
        </div>
        <button className="i356-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href="tel:+33240000001" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Appeler le secrétariat</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="i356-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Cabinet infirmier · Saint-Nazaire
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(34px, 4.6vw, 60px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>
            {c?.heroHeadline ?? (<>Votre traitement suit,<br /><em style={{ color: C.accentDark }}>même quand la vie bouge.</em></>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            {c?.heroSubline ?? fd?.tagline ?? "Six infirmiers, une secrétaire qui décroche, une application de suivi pour les familles : le cabinet infirmier organisé comme il devrait l'être partout. Conventionné, tiers payant."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Organiser des soins <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Nos soins
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
        <ComposeIn index={i} items={tiles}  style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "repeat(3, minmax(112px, auto))", gap: 12 }} />
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i356-stats i356-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i356-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i356-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos soins</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Techniques ou quotidiens,<br /><em>avec la même rigueur.</em>
              </h2>
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
      <section id="methode" className="i356-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'organisation</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Un cabinet qui tourne,<br /><em>des patients qui le sentent.</em>
              </h2>
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
      <section id="engagements" className="i356-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i356-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src="https://images.pexels.com/photos/7345459/pexels-photo-7345459.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Visite infirmière au domicile" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le cabinet</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                Organisés<br /><em>parce que c'est du soin.</em>
              </h2>
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
      <section id="tarifs" className="i356-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prise en charge</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Nomenclature, <em>tiers payant, point.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Actes cotés selon la NGAP, remboursés par l'Assurance Maladie sur prescription. Le tiers payant est systématique — vous ne sortez pas la carte bleue.</p>
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
      <section className="i356-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Des soins <em style={{ color: C.hi }}>qui s'organisent</em>.</h2>
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
      <section id="contact" className="i356-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Secrétariat 8h-18h</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            Une ordonnance ?<br /><em>La tournée s'organise aujourd'hui.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Appelez le secrétariat : créneau confirmé dans l'heure, premier passage souvent le jour même.</p>
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
      <footer className="i356-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? "Soins de l'Estuaire"}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Cabinet infirmier · Saint-Nazaire<br />Conventionné CPAM — Ordre national des infirmiers</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Saint-Nazaire, Loire-Atlantique" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Tournées 6h30–20h30 · permanence téléphonique 8h–18h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Soins de l'Estuaire"} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
