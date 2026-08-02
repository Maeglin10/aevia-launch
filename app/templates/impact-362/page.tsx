"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Building, CheckCircle, Clock, Mail, MapPin, Paintbrush, Phone, Star, Users } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { InvertSweep } from "@/lib/templates/hero-kit-3";

/* Peintre en bâtiment, 2e variante, duo père-fille, rénovation. Signature : InvertSweep — le scroll bascule la page, l'avant/après du chantier. Sans photographie. */

let C: Record<string, string> = {
  bg: "#faf8f4",
  bgSection: "#f1ebe2",
  bgDark: "#191410",
  text: "#1e1812",
  textMuted: "#6b6052",
  accent: "var(--brand,#a4552e)",
  accentDark: "#7e3f20",
  accentLight: "#f6e5da",
  hi: "#c99f6a",
  white: "#ffffff",
  border: "#e3d9ca",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Chantiers", "h": "#services"}, {"l": "La méthode", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];

const SERVICES_DEMO = [{"titre": "Appartements locatifs", "desc": "Remise en blanc entre deux locataires : murs, plafonds, boiseries en une semaine, photos avant/après pour le dossier du propriétaire.", "tag": "Locatif"}, {"titre": "Cages d'escalier", "desc": "Le chantier que les copropriétés repoussent : échafaudage d'escalier, travail par demi-volées, immeuble praticable tous les jours.", "tag": "Copro"}, {"titre": "Maisons familiales", "desc": "Pièce par pièce ou tout d'un coup : on planifie avec votre vie, pas contre elle. Meubles déplacés et remis, sols garantis.", "tag": "Maison"}, {"titre": "Plafonds & dégâts des eaux", "desc": "Après sinistre : traitement des auréoles, sous-couche isolante, raccords invisibles. Facture conforme pour l'assurance.", "tag": "Sinistre"}, {"titre": "Boiseries & radiateurs", "desc": "Portes, plinthes, fenêtres, radiateurs déposés-peints-reposés : les finitions qui datent un intérieur — ou le rajeunissent.", "tag": "Boiseries"}, {"titre": "Petits chantiers assumés", "desc": "Une chambre, un couloir, un plafond : pas de chantier trop petit — le carnet de la semaine leur garde de la place.", "tag": "Petits"}];
const METHODE = [{"n": "01", "t": "Visite et devis en 48 h", "d": "Métré, état des supports, contraintes d'accès. Le devis détaille tout, y compris ce qu'on ne fera pas."}, {"n": "02", "t": "Dates bloquées, tenues", "d": "Le chantier commence à la date écrite. Si un imprévu décale, vous le savez une semaine avant — pas la veille."}, {"n": "03", "t": "Le carnet de chantier", "d": "Chaque jour : ce qui est fait, ce qui reste, photo à l'appui. Posé sur le chantier, consultable par tous."}, {"n": "04", "t": "Réception et retouches", "d": "Tour complet ensemble, retouches immédiates, garanties et factures remises le jour même."}];
const ENGAGEMENT = ["Garantie décennale et RC pro à jour, attestations jointes à chaque devis", "Jamais de sous-traitance ni d'intérim : ceux qui devisent sont ceux qui peignent", "Date de début écrite au devis, pénalité offerte si on la manque de notre fait", "Chantier aspiré et rangé chaque soir — la poussière ne fait pas partie du devis"];
const TARIFS = [{"a": "Remise en blanc (pièce 12 m²)", "p": "490 € forfait", "n": "Murs + plafond + plinthes, blanc satiné lessivable."}, {"a": "Murs & plafonds sur mesure", "p": "26–34 €/m²", "n": "Selon supports, teintes au choix sans supplément."}, {"a": "Cage d'escalier (par étage)", "p": "dès 890 €", "n": "Échafaudage, murs, plafonds, rampe — praticable chaque soir."}, {"a": "Plafond après dégât des eaux", "p": "dès 390 €", "n": "Traitement, sous-couche isolante, raccord invisible."}];
const AVIS_DEMO = [{"texte": "Trois appartements locatifs remis en blanc en trois semaines, photos avant/après envoyées à chaque fin. Mes locations repartent plus vite et je ne visite même plus les chantiers.", "auteur": "Propriétaire bailleur", "detail": "Remises en blanc"}, {"texte": "La cage d'escalier de notre copro repoussée depuis cinq ans : faite en huit jours, immeuble praticable tous les soirs. Le carnet de chantier posé dans le hall a mis tout le monde d'accord.", "auteur": "Conseil syndical, Orléans centre", "detail": "Copropriété"}, {"texte": "Un père et une fille qui bossent en silence, protègent tout, et laissent la maison plus propre que trouvée. Le devis n'a pas bougé d'un euro.", "auteur": "Régine M.", "detail": "Maison familiale"}];
const STATS = [{"value": "2", "label": "Compagnons — et pas d'intérim"}, {"value": "48 h", "label": "Devis après visite"}, {"value": "850+", "label": "Chantiers depuis 1998"}, {"value": "J+0", "label": "Chantier aspiré chaque soir"}];

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

export default function DuoPeinturesPage() {
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

  const phone = fd?.phone ?? "02 38 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33238000000"}`;
  const mail = fd?.email ?? "contact@duo-peintures.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i362-nav { display: none !important; } .i362-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i362-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i362-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i362-split { grid-template-columns: 1fr !important; }
          .i362-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i362-stats .i362-statcell { border-right: none !important; }
          .i362-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i362-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Paintbrush size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? "Duo Peintures"}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Père & fille</span>
            </>
          )}
        </div>
        <div id="i362-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href="tel:+33238000000" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Devis sous 48 h
          </motion.a>
        </div>
        <button className="i362-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href="tel:+33238000000" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Devis sous 48 h</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      <InvertSweep dark={C.bgDark} light={C.bg} textDark="#f4f2ee" textLight={C.text} accent={C.accent} className="">
        {(invert) => (
          <div className="i362-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 80px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "inherit", opacity: 0.7 }}>Peinture & rénovation · Orléans</span>
            <h1 style={{ fontFamily: FONT, fontSize: "clamp(36px, 5.4vw, 68px)", lineHeight: 1.08, margin: "18px 0 20px", maxWidth: 820 }}>
              {c?.heroHeadline ?? (<>Avant, après :<br /><em style={{ color: C.accent }}>c'est tout notre métier.</em></>)}
            </h1>
            <p style={{ fontSize: 16.5, opacity: 0.75, lineHeight: 1.75, maxWidth: 560, marginBottom: 32 }}>
              {c?.heroSubline ?? fd?.tagline ?? "Un père compagnon, une fille reprise d'entreprise : deux peintres qui rénovent cages d'escalier, appartements locatifs et maisons familiales — vite, proprement, au prix écrit."}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Demander un devis</a>
              <a href="#services" style={{ border: "1px solid currentColor", borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none", color: "inherit" }}>Nos chantiers</a>
            </div>
            <span style={{ marginTop: 44, fontSize: 12.5, opacity: 0.55 }}>Faites défiler — l'avant / après se révèle.</span>
          </div>
        )}
      </InvertSweep>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i362-stats i362-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i362-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i362-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Chantiers</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                La rénovation<br /><em>qui rafraîchit tout.</em>
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
      <section id="methode" className="i362-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>La méthode</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Deux compagnons,<br /><em>un carnet de chantier.</em>
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
      <section id="engagements" className="i362-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i362-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src="https://images.pexels.com/photos/7217983/pexels-photo-7217983.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Duo de peintres en chantier" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                Le prix écrit,<br /><em>le délai tenu.</em>
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
      <section id="tarifs" className="i362-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Simples, <em>tout compris.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Préparation, protection et deux couches comprises. Les remises en blanc locatives sont au forfait par pièce — le propriétaire sait d'avance.</p>
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
      <section className="i362-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Avant, après — <em style={{ color: C.hi }}>ils ont vu les deux</em>.</h2>
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
      <section id="contact" className="i362-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Devis sous 48 h</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            Montrez-nous l'avant,<br /><em>on s'occupe de l'après.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Visite gratuite à Orléans et 30 km. Envoyez des photos par mail pour un premier avis — on vous dit franchement si ça vaut un devis.</p>
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
      <footer className="i362-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? "Duo Peintures"}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Entreprise de peinture · Orléans<br />Décennale — deux compagnons, un carnet de chantier tenu</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Orléans, Loiret" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 7h30–18h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Duo Peintures"} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
