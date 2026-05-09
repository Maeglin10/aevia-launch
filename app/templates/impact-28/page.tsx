"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#ffffff",
  text: "#0a0a0a",
  accent: "#0a0a0a",
  white: "#ffffff",
  border: "2px solid #0a0a0a",
  borderThick: "4px solid #0a0a0a",
}

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["PROJETS", "APPROCHE", "ÉQUIPE", "MANIFESTE", "CONTACT"]

const STATS = [
  { value: "2003", label: "Fondée à Bruxelles" },
  { value: "85", label: "Bâtiments livrés" },
  { value: "12", label: "Distinctions nationales" },
  { value: "8", label: "Pays en Europe" },
]

const TABS = [
  {
    id: "logement",
    label: "LOGEMENT COLLECTIF",
    heading: "HABITAT RADICAL",
    body: "Nous concevons des immeubles résidentiels qui refusent la médiocrité. Chaque programme collectif est traité comme un manifeste urbain — masse assumée, matière brute, espaces communs imposants. Nos bâtiments vieillissent bien parce qu'ils sont honnêtes dès le départ.",
    tags: ["BÉTON BRUT", "MASSE CONSTRUITE", "ESPACES COMMUNS", "DURABILITÉ"],
    projects: ["Tour Molenbeek — 240 logements, 2022", "Résidence Anderlecht — 88 logements, 2019", "Complexe Schaerbeek — 160 logements, 2021"],
  },
  {
    id: "tertiaire",
    label: "TERTIAIRE",
    heading: "BUREAUX SANS COMPROMIS",
    body: "L'architecture de bureau n'a pas à être neutre. Nos immeubles tertiaires imposent leur présence dans le tissu urbain. Plateaux libres, structure apparente, façades qui n'imitent rien — des espaces de travail pensés pour durer 100 ans.",
    tags: ["OPEN SPACE", "STRUCTURE APPARENTE", "FAÇADE AUTONOME", "FLEXIBILITÉ"],
    projects: ["Siège BPT Group — 12 000 m², 2023", "Campus Axisparc — 3 bâtiments, 2020", "Tour Bastion — 8 000 m², 2018"],
  },
  {
    id: "equipements",
    label: "ÉQUIPEMENTS PUBLICS",
    heading: "ARCHITECTURE CIVIQUE",
    body: "Les bâtiments publics ont une responsabilité symbolique que les programmes privés n'ont pas. Nous prenons cette responsabilité au sérieux. Écoles, bibliothèques, centres culturels — des lieux qui affirment la présence de la collectivité dans l'espace urbain.",
    tags: ["COMMANDE PUBLIQUE", "PROGRAMME CIVIQUE", "MATÉRIAUX LOCAUX", "PÉRENNITÉ"],
    projects: ["Bibliothèque Centrale de Liège — 2021", "École Secondaire de Gand — 2020", "Centre Culturel de Namur — 2019"],
  },
  {
    id: "renovation",
    label: "RÉNOVATION RADICALE",
    heading: "TRANSFORMER SANS TRAHIR",
    body: "La rénovation radicale ne cache pas le passé — elle le confronte. Nous intervenons sur du bâti existant avec la même exigence que sur le neuf. Pas de plaquettes de faux matériaux, pas de ravalement cosmétique. Une transformation honnête qui reconnaît ce qu'était le bâtiment.",
    tags: ["PATRIMOINE INDUSTRIEL", "RÉHABILITATION", "SURÉLÉVATION", "RECONVERSION"],
    projects: ["Filature de Verviers — reconversion, 2022", "Entrepôts du Port — 4 000 m², 2021", "Brasserie Wielemans — logements, 2023"],
  },
]

const TESTIMONIALS = [
  {
    quote: "Brutco a eu le courage de défendre une vision quand nous voulions nous replier vers une solution plus conventionnelle. Aujourd'hui, la bibliothèque est devenue un repère de la ville. Ce n'est pas un hasard.",
    author: "MARC DEGREEF",
    role: "ÉCHEVIN DE L'URBANISME — VILLE DE LIÈGE",
  },
  {
    quote: "On nous avait conseillé de choisir un cabinet 'plus accessible'. Nous avons choisi Brutco. Trois ans après la livraison, nos locataires renouvellent leurs baux et la valeur vénale a progressé de 28%. L'architecture exigeante, ça paie.",
    author: "SOPHIE VANDENBERGHE",
    role: "DIRECTRICE — BPT REAL ESTATE PARTNERS",
  },
  {
    quote: "Brutco ne produit pas de beaux rendus pour gagner des concours puis livrer autre chose. Ce que vous voyez dans le dossier, c'est ce que vous obtenez en vrai. Dans notre métier, c'est extraordinairement rare.",
    author: "THOMAS LECLERCQ",
    role: "DIRECTEUR DES MARCHÉS PUBLICS — COMMUNAUTÉ FRANÇAISE",
  },
  {
    quote: "Ils nous ont dit clairement que notre budget initial était incompatible avec nos ambitions architecturales. Nous avons trouvé les moyens d'ajuster. Le résultat valait chaque euro supplémentaire.",
    author: "ANNE-SOPHIE MAES",
    role: "PDG — GROUPE MAES CONSTRUCTION",
  },
]

const PRICING = [
  {
    name: "CONSULTATION",
    price: "GRATUITE",
    sub: "1 HEURE — DIAGNOSTIC INITIAL",
    features: [
      "Analyse du site et du programme",
      "Évaluation de faisabilité brute",
      "Retour direct sans filtre",
      "Pas d'engagement",
    ],
    cta: "RÉSERVER UN CRÉNEAU",
    highlighted: false,
  },
  {
    name: "ESQUISSE CONCEPT",
    price: "3 500€",
    sub: "VISION BRUTE — 2 SEMAINES",
    features: [
      "Implantation et volumétrie",
      "2 options conceptuelles",
      "Maquette de masse 1:500",
      "Note d'intention architecturale",
      "Présentation en agence",
    ],
    cta: "DÉMARRER L'ESQUISSE",
    highlighted: true,
  },
  {
    name: "MISSION COMPLÈTE",
    price: "% CONSTRUCTION",
    sub: "MIN. 45 000€ — CLÉS EN MAIN",
    features: [
      "PC → APS → APD → DCE",
      "Suivi de chantier hebdomadaire",
      "Coordination BET",
      "Réception des travaux",
      "Garantie décennale",
      "Dossier des ouvrages exécutés",
    ],
    cta: "DISCUTER DE LA MISSION",
    highlighted: false,
  },
]

const FAQS = [
  {
    q: "QU'EST-CE QUE BRUTCO FAIT EXACTEMENT?",
    a: "Brutco est une agence d'architecture fondée à Bruxelles en 2003. Nous couvrons l'ensemble de la mission architecturale — de l'esquisse à la réception de chantier — sur des programmes résidentiels collectifs, tertiaires et d'équipements publics. Notre positionnement est radical : nous concevons des bâtiments qui ont un point de vue, pas des constructions génériques.",
  },
  {
    q: "TRAVAILLEZ-VOUS PARTOUT EN EUROPE?",
    a: "Oui. Nous avons livré des projets en Belgique, aux Pays-Bas, en Allemagne, en France, au Luxembourg, en Suisse, au Portugal, et en Pologne. Nos 8 pays d'intervention sont le résultat de commandes directes ou de concours remportés hors frontières. Nous ne nous déplaçons pas pour des projets en dessous de 3 millions d'euros de budget construction.",
  },
  {
    q: "QUEL EST LE BUDGET MINIMUM DE CHANTIER?",
    a: "Pour une mission complète, nous travaillons à partir de 3 millions d'euros de budget construction. En dessous, nos honoraires sur base de pourcentage ne permettent pas de constituer l'équipe projet nécessaire pour maintenir notre niveau d'exigence. Pour des projets plus petits, la prestation Esquisse Concept peut être pertinente pour cadrer une direction.",
  },
  {
    q: "QUEL EST LE DÉLAI MOYEN D'UN PROJET?",
    a: "Un projet résidentiel standard de permis à réception prend entre 36 et 54 mois selon la complexité, le programme et les délais d'instruction administrative. La phase de conception (esquisse + APS + APD + DCE) représente environ 12 à 18 mois. Nous ne promettons pas des délais que nous ne pouvons pas tenir — la qualité architecturale prend le temps qu'elle prend.",
  },
  {
    q: "PEUT-ON VISITER DES CHANTIERS EN COURS?",
    a: "Oui, nous organisons des visites de chantier pour les clients potentiels sur rendez-vous. C'est souvent la meilleure façon de comprendre comment nous travaillons et ce que nous défendons. Voir un bâtiment Brutco en construction — structure brute, matière visible, aucun artifice — est plus éloquent que n'importe quel portfolio.",
  },
  {
    q: "COMMENT BRUTCO GÈRE-T-IL LES DÉSACCORDS AVEC LE CLIENT?",
    a: "Franchement. Nous argumentons nos partis pris et nous pouvons évoluer si les arguments sont pertinents. Mais nous ne capitulons pas sous la pression commerciale. Si un client exige des choix que nous estimons architecturalement ou éthiquement problématiques, nous préférons nous retirer du projet. Cela ne s'est produit que trois fois en vingt ans.",
  },
]

// ─── STAT COUNTER ────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        textAlign: "center",
        padding: "40px 20px",
        borderRight: C.border,
        flex: 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: "clamp(48px, 6vw, 80px)",
          color: C.white,
          lineHeight: 1,
          letterSpacing: "-2px",
        }}
      >
        {value}
      </motion.div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: "12px",
          color: "rgba(255,255,255,0.6)",
          marginTop: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BrutcoPage() {
  const { scrollY } = useScroll()
  const heroTitleX = useTransform(scrollY, [0, 600], ["0%", "-2%"])
  const gridY = useTransform(scrollY, [0, 600], [0, -20])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)

  function goTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }
  function prevTestimonial() {
    const next = (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    setDirection(-1)
    setActiveTestimonial(next)
  }
  function nextTestimonial() {
    const next = (activeTestimonial + 1) % TESTIMONIALS.length
    setDirection(1)
    setActiveTestimonial(next)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ──────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "transparent",
          borderBottom: C.borderThick,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "64px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "18px",
            letterSpacing: "4px",
            color: C.text,
          }}
        >
          BRUTCO
        </div>
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "2px",
                color: C.text,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {link}
            </Link>
          ))}
          <motion.button
            whileHover={{ background: C.text, color: C.white }}
            transition={{ duration: 0.15 }}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "11px",
              letterSpacing: "2px",
              padding: "10px 24px",
              border: C.border,
              background: "transparent",
              color: C.text,
              cursor: "pointer",
            }}
          >
            PRENDRE CONTACT
          </motion.button>
        </div>
      </nav>

      {/* ── 2. HERO ────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: C.bg,
          paddingTop: "64px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo mark */}
        <div style={{ padding: "48px 40px 0" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              background: C.text,
              flexShrink: 0,
            }}
          />
        </div>

        {/* Main heading */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 0",
          }}
        >
          <motion.div style={{ x: heroTitleX }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "clamp(80px, 12vw, 180px)",
                lineHeight: 0.9,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "-4px",
              }}
            >
              ARCHITECTURE
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "clamp(80px, 12vw, 180px)",
                lineHeight: 0.9,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "-4px",
              }}
            >
              / RADICALE
            </div>
          </motion.div>

          <div
            style={{
              marginTop: "48px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "40px",
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "1px",
                color: C.text,
                maxWidth: "320px",
                lineHeight: 1.6,
                borderLeft: C.borderThick,
                paddingLeft: "20px",
              }}
            >
              Agence d'architecture fondée à Bruxelles en 2003. Nous concevons des bâtiments qui
              ont un point de vue. Pas de façades génériques. Pas de compromis esthétiques.
            </div>

            {/* Project grid — bottom right */}
            <motion.div style={{ y: gridY }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2px",
                  width: "480px",
                }}
              >
                {[
                  { label: "TOUR MOLENBEEK", year: "2022", type: "RÉSIDENTIEL" },
                  { label: "SIÈGE BPT GROUP", year: "2023", type: "TERTIAIRE" },
                  { label: "BIBLIOTHÈQUE LIÈGE", year: "2021", type: "ÉQUIPEMENT PUBLIC" },
                  { label: "FILATURE VERVIERS", year: "2022", type: "RÉNOVATION" },
                ].map((p) => (
                  <motion.div
                    key={p.label}
                    whileHover={{ background: "#111" }}
                    transition={{ duration: 0.1 }}
                    style={{
                      background: C.text,
                      padding: "24px",
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT,
                        fontWeight: 900,
                        fontSize: "11px",
                        color: C.white,
                        letterSpacing: "1px",
                        marginBottom: "8px",
                      }}
                    >
                      {p.label}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "2px",
                      }}
                    >
                      {p.type} — {p.year}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            padding: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ width: "40px", height: "2px", background: C.text }} />
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "10px",
              letterSpacing: "3px",
              color: C.text,
            }}
          >
            DÉFILER
          </span>
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 3. STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.text }}>
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                borderRight: i < STATS.length - 1 ? "2px solid rgba(255,255,255,0.15)" : "none",
              }}
            >
              <StatItem value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 4. FEATURES / TABS ─────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 40px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "3px",
              color: C.text,
            }}
          >
            DOMAINES D'INTERVENTION
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(40px, 5vw, 72px)",
            color: C.text,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            marginBottom: "60px",
            lineHeight: 1,
          }}
        >
          CE QUE NOUS
          <br />
          CONSTRUISONS
        </h2>

        {/* Tab labels */}
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #0a0a0a",
            marginBottom: "0",
            overflowX: "auto",
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "11px",
                letterSpacing: "2px",
                padding: "20px 32px",
                border: "none",
                borderBottom: activeTab === i ? "4px solid #0a0a0a" : "4px solid transparent",
                background: "transparent",
                color: activeTab === i ? C.text : "rgba(10,10,10,0.4)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginBottom: "-2px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            borderLeft: C.border,
            borderRight: C.border,
            borderBottom: C.border,
            minHeight: "360px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "48px" }}
            >
              <div style={{ display: "flex", gap: "80px" }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: "32px",
                      color: C.text,
                      textTransform: "uppercase",
                      letterSpacing: "-1px",
                      marginBottom: "24px",
                    }}
                  >
                    {TABS[activeTab].heading}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "16px",
                      color: C.text,
                      lineHeight: 1.7,
                      marginBottom: "32px",
                    }}
                  >
                    {TABS[activeTab].body}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {TABS[activeTab].tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: FONT,
                          fontWeight: 900,
                          fontSize: "10px",
                          letterSpacing: "2px",
                          padding: "6px 14px",
                          border: C.border,
                          color: C.text,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ width: "280px", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: "10px",
                      letterSpacing: "3px",
                      color: C.text,
                      marginBottom: "16px",
                    }}
                  >
                    PROJETS RÉFÉRENCES
                  </div>
                  {TABS[activeTab].projects.map((p) => (
                    <div
                      key={p}
                      style={{
                        fontFamily: FONT,
                        fontWeight: 400,
                        fontSize: "13px",
                        color: C.text,
                        padding: "14px 0",
                        borderBottom: "1px solid rgba(10,10,10,0.15)",
                        lineHeight: 1.4,
                      }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 5. TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 40px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "3px",
              color: C.text,
            }}
          >
            ILS ONT TRAVAILLÉ AVEC NOUS
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(40px, 5vw, 72px)",
            color: C.text,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            marginBottom: "60px",
            lineHeight: 1,
          }}
        >
          CE QU'ILS
          <br />
          EN DISENT
        </h2>

        <div style={{ position: "relative", overflow: "hidden" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTestimonial}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -80 }}
              transition={{ duration: 0.45 }}
              style={{
                border: C.border,
                padding: "56px 60px",
                borderRadius: 0,
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "clamp(24px, 3vw, 40px)",
                  color: C.text,
                  lineHeight: 1.3,
                  marginBottom: "48px",
                  letterSpacing: "-0.5px",
                }}
              >
                "{TESTIMONIALS[activeTestimonial].quote}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: C.text,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: "13px",
                      color: C.text,
                      letterSpacing: "2px",
                    }}
                  >
                    {TESTIMONIALS[activeTestimonial].author}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "11px",
                      color: "rgba(10,10,10,0.5)",
                      letterSpacing: "1px",
                      marginTop: "4px",
                    }}
                  >
                    {TESTIMONIALS[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "32px" : "8px",
                    height: "8px",
                    background: C.text,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "width 0.3s",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "0" }}>
              <motion.button
                whileHover={{ background: C.text, color: C.white }}
                transition={{ duration: 0.15 }}
                onClick={prevTestimonial}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "18px",
                  padding: "14px 24px",
                  border: C.border,
                  background: "transparent",
                  color: C.text,
                  cursor: "pointer",
                }}
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ background: C.text, color: C.white }}
                transition={{ duration: 0.15 }}
                onClick={nextTestimonial}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "18px",
                  padding: "14px 24px",
                  border: C.border,
                  borderLeft: "none",
                  background: "transparent",
                  color: C.text,
                  cursor: "pointer",
                }}
              >
                →
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 6. PRICING ─────────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 40px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "3px",
              color: C.text,
            }}
          >
            NOS PRESTATIONS
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(40px, 5vw, 72px)",
            color: C.text,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            marginBottom: "60px",
            lineHeight: 1,
          }}
        >
          COMMENT
          <br />
          TRAVAILLER AVEC NOUS
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0" }}>
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                border: C.border,
                borderLeft: i === 0 ? C.border : "none",
                padding: "48px 40px",
                borderRadius: 0,
                background: tier.highlighted ? C.text : C.bg,
                position: "relative",
              }}
            >
              {tier.highlighted && (
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: "9px",
                    letterSpacing: "3px",
                    color: C.white,
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    display: "inline-block",
                    marginBottom: "24px",
                  }}
                >
                  RECOMMANDÉ
                </div>
              )}
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "3px",
                  color: tier.highlighted ? C.white : C.text,
                  marginBottom: "16px",
                }}
              >
                {tier.name}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "clamp(28px, 3vw, 40px)",
                  color: tier.highlighted ? C.white : C.text,
                  letterSpacing: "-1px",
                  marginBottom: "8px",
                  lineHeight: 1,
                }}
              >
                {tier.price}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "11px",
                  color: tier.highlighted ? "rgba(255,255,255,0.6)" : "rgba(10,10,10,0.5)",
                  letterSpacing: "1px",
                  marginBottom: "36px",
                }}
              >
                {tier.sub}
              </div>
              <div
                style={{
                  borderTop: tier.highlighted ? "2px solid rgba(255,255,255,0.2)" : "2px solid #0a0a0a",
                  paddingTop: "28px",
                  marginBottom: "36px",
                }}
              >
                {tier.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 900,
                        fontSize: "12px",
                        color: tier.highlighted ? C.white : C.text,
                        marginTop: "1px",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 400,
                        fontSize: "13px",
                        color: tier.highlighted ? "rgba(255,255,255,0.8)" : C.text,
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{
                  background: tier.highlighted ? C.white : C.text,
                  color: tier.highlighted ? C.text : C.white,
                }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "11px",
                  letterSpacing: "2px",
                  padding: "16px 28px",
                  border: tier.highlighted ? "2px solid #ffffff" : C.border,
                  background: "transparent",
                  color: tier.highlighted ? C.white : C.text,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 7. FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 40px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "3px",
              color: C.text,
            }}
          >
            QUESTIONS FRÉQUENTES
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(40px, 5vw, 72px)",
            color: C.text,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            marginBottom: "60px",
            lineHeight: 1,
          }}
        >
          CE QU'ON
          <br />
          NOUS DEMANDE
        </h2>

        <div style={{ maxWidth: "960px" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderTop: "2px solid #0a0a0a" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "28px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: "clamp(14px, 1.6vw, 20px)",
                    color: C.text,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: "24px",
                    color: C.text,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 400,
                        fontSize: "15px",
                        color: C.text,
                        lineHeight: 1.75,
                        paddingBottom: "32px",
                        maxWidth: "760px",
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div style={{ borderTop: "2px solid #0a0a0a" }} />
        </div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid #0a0a0a" }} />

      {/* ── 8. CTA BANNER ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.text,
          padding: "120px 40px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "32px",
            }}
          >
            PRÊT À CONSTRUIRE AUTREMENT?
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "clamp(48px, 8vw, 120px)",
              color: C.white,
              textTransform: "uppercase",
              letterSpacing: "-3px",
              lineHeight: 0.95,
              marginBottom: "60px",
            }}
          >
            PRENONS
            <br />
            CONTACT
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "0" }}>
            <motion.a
              href="mailto:contact@brutco.be"
              whileHover={{ background: C.white, color: C.text }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "13px",
                letterSpacing: "3px",
                padding: "20px 48px",
                border: "2px solid #ffffff",
                color: C.white,
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              PRENDRE CONTACT
            </motion.a>
            <motion.a
              href="tel:+3225551234"
              whileHover={{ background: C.white, color: C.text }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "13px",
                letterSpacing: "2px",
                padding: "20px 48px",
                border: "2px solid #ffffff",
                borderLeft: "none",
                color: C.white,
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              +32 2 555 12 34
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Section divider */}
      <div style={{ borderTop: "2px solid rgba(255,255,255,0.2)" }} />

      {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.text,
          padding: "60px 40px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "60px",
            marginBottom: "60px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "24px",
                letterSpacing: "4px",
                color: C.white,
                marginBottom: "16px",
              }}
            >
              BRUTCO
            </div>
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                maxWidth: "260px",
              }}
            >
              Agence d'architecture brutaliste et design radical. Fondée à Bruxelles en 2003. 85 bâtiments livrés.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              {/* LinkedIn */}
              <a href="#" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Camera */}
              <a href="#" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(255,255,255,0.4)" stroke="none" />
                </svg>
              </a>
              {/* Behance */}
              <a href="#" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
                  <path d="M8.228 9c.549 0 .99.422.99.96 0 .524-.441.96-.99.96H5v-1.92h3.228zM5 12.48h3.762c.601 0 1.087.468 1.087 1.044 0 .576-.486 1.044-1.087 1.044H5v-2.088zM14.5 8h4v1h-4zM12.5 13.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-3c-.83 0-1.5.67-1.5 1.5zM12.5 11.5c0 .83.67 1.5 1.5 1.5h2.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H14c-.83 0-1.5.67-1.5 1.5z" />
                  <rect x="1" y="1" width="22" height="22" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "10px",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "20px",
              }}
            >
              NAVIGATION
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href="#"
                style={{
                  display: "block",
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "10px",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "20px",
              }}
            >
              DOMAINES
            </div>
            {TABS.map((tab) => (
              <div
                key={tab.id}
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "10px",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "20px",
              }}
            >
              CONTACT
            </div>
            {[
              "Rue de la Régence 14",
              "1000 Bruxelles, Belgique",
              "",
              "+32 2 555 12 34",
              "contact@brutco.be",
            ].map((line, i) =>
              line ? (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                  }}
                >
                  {line}
                </div>
              ) : (
                <div key={i} style={{ height: "8px" }} />
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "2px solid rgba(255,255,255,0.1)",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
            }}
          >
            © 2026 BRUTCO — TOUS DROITS RÉSERVÉS
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {["MENTIONS LÉGALES", "POLITIQUE DE CONFIDENTIALITÉ", "ORDRE DES ARCHITECTES"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
