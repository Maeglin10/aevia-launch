"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const C = {
  bg: "#07070A",
  bgCard: "#0E0E14",
  text: "#E8E8F0",
  textMuted: "#7A7A90",
  textDim: "#2E2E40",
  border: "#14141E",
  borderBright: "#1E1E2E",
  violet: "#8B5CF6",
  violetLight: "#C4B5FD",
  violetDim: "#4C1D95",
  cyan: "#22D3EE",
  white: "#F0F0FF",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&family=DM+Sans:wght@300;400;500&display=swap');
`;

const PROJECTS = [
  {
    id: "01",
    title: "FLUX",
    client: "Adidas Originals",
    type: "Brand Film",
    year: "2024",
    duration: "1:30",
    awards: ["Cannes Lions Silver", "D&AD Wood Pencil"],
    tags: ["3D", "Motion", "Film"],
    color: C.violet,
  },
  {
    id: "02",
    title: "THRESHOLD",
    client: "Apple iPhone 16",
    type: "Product Reveal",
    year: "2024",
    duration: "3:00",
    awards: ["Cannes Lions Gold"],
    tags: ["Motion", "VFX", "Sound Design"],
    color: C.cyan,
  },
  {
    id: "03",
    title: "DISSOLVE",
    client: "Vuitton x Yayoi Kusama",
    type: "Installation Film",
    year: "2023",
    duration: "5:45",
    awards: ["SXSW Best Short", "FWA SOTM"],
    tags: ["Installation", "3D", "Generative"],
    color: "#FF4DAD",
  },
  {
    id: "04",
    title: "SIGNAL",
    client: "Spotify Wrapped",
    type: "Social Campaign",
    year: "2023",
    duration: "0:15 × 8",
    awards: ["Shorty Award Gold"],
    tags: ["Social", "Motion", "Loop"],
    color: "#1DB954",
  },
  {
    id: "05",
    title: "ECHOES",
    client: "Balenciaga",
    type: "Fashion Film",
    year: "2023",
    duration: "2:20",
    awards: ["British Arrows Gold", "D&AD Graphite"],
    tags: ["Fashion", "Film", "CGI"],
    color: C.white,
  },
];

const SERVICES = [
  { code: "01", title: "Brand Films", desc: "De 15 secondes à 6 minutes. Narration, esthétique, cut — chaque décision au service de la marque." },
  { code: "02", title: "Motion Design", desc: "Systèmes d'animation, titres génériques, motion guidelines. Le mouvement comme identité." },
  { code: "03", title: "CGI & VFX", desc: "3D photoréaliste, simulations physiques, compositing. Aucune limite technique." },
  { code: "04", title: "Installations", desc: "Expériences immersives pour espaces physiques. Son, image, espace fusionnés." },
];

const AWARDS_LIST = [
  "Cannes Lions — 3 Gold · 5 Silver · 8 Bronze",
  "D&AD — 1 Black Pencil · 4 Yellow Pencils",
  "SXSW Film — 2 Best Short",
  "FWA Site of the Month — 6×",
];

// ── Skew hover (signature element) ────────────────────────────────────────────
function SkewProjectItem({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", position: "relative", overflow: "hidden" }}
    >
      {/* Hover background */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scaleX: 0, skewX: "-5deg" }}
            animate={{ scaleX: 1, skewX: "0deg" }}
            exit={{ scaleX: 0, skewX: "5deg" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, background: project.color + "18", transformOrigin: "left" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={hovered ? { skewX: "-1.5deg", x: 8 } : { skewX: "0deg", x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "grid", gridTemplateColumns: "5rem 1fr auto auto", gap: "3rem", padding: "2rem 0", alignItems: "center", position: "relative", zIndex: 1 }}
      >
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textDim }}>
          {project.id}
        </div>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 800,
            color: hovered ? project.color : C.text,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            transition: "color 0.3s",
          }}>
            {project.title}
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginTop: "0.3rem" }}>
            {project.client} · {project.type}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              padding: "0.25rem 0.6rem",
              border: `1px solid ${hovered ? project.color + "60" : C.border}`,
              color: hovered ? project.color : C.textMuted,
              transition: "all 0.3s",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted }}>{project.year}</div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>{project.duration}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Distorted title (key visual element) ─────────────────────────────────────
function DistortedTitle() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skewX = useSpring(useTransform(x, [-300, 300], [-8, 8]), { stiffness: 80, damping: 15 });
  const skewY = useSpring(useTransform(y, [-200, 200], [-4, 4]), { stiffness: 80, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "default" }}
    >
      <motion.div style={{ skewX, skewY }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(4rem, 14vw, 14rem)",
          fontWeight: 800,
          color: C.text,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          userSelect: "none",
        }}>
          SKEW
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(4rem, 14vw, 14rem)",
          fontWeight: 800,
          color: "transparent",
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          WebkitTextStroke: `1px ${C.violet}`,
          userSelect: "none",
        }}>
          STUDIO
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SkewOS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const navOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* Scroll progress */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.violet, width: progressWidth, zIndex: 200 }} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          opacity: navOpacity,
          background: "rgba(7,7,10,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.05em" }}>
          SKEW<span style={{ color: C.violet }}>.</span>
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          {["Work", "Services", "Studio", "Contact"].map((item) => (
            <motion.button
              key={item} onClick={() => document.getElementById(({"Work": "work", "Services": "services", "Studio": "studio", "Contact": "contact"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.violetLight }}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ backgroundColor: C.violet, borderColor: C.violet }}
          style={{
            background: "transparent",
            border: `1px solid ${C.borderBright}`,
            color: C.textMuted,
            padding: "0.5rem 1.25rem",
            fontFamily: "'Syne Mono', monospace",
            fontSize: "0.65rem",
            cursor: "pointer",
            transition: "all 0.3s",
            letterSpacing: "0.1em",
          }}
        >
          START PROJECT
        </motion.button>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem", paddingTop: "8rem", position: "relative" }}>
        {/* Floating label */}
        <div style={{ position: "absolute", top: "2rem", right: "3rem" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", color: C.textDim }}>
            MOTION DESIGN STUDIO · PARIS
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "flex-end" }}>
          <DistortedTitle />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ maxWidth: "300px", paddingBottom: "1rem" }}
          >
            <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "2rem" }}>
              Studio de motion design & réalisation. Nous créons des films de marque, des expériences visuelles et des installations qui perturbent l'attention.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ backgroundColor: C.violetLight, color: C.bg }}
                style={{
                  background: C.violet,
                  color: C.text,
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              >
                SEE WORK →
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Awards quick bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", gap: "3rem" }}
        >
          {[
            { n: "3×", label: "Cannes Lions Gold" },
            { n: "1×", label: "D&AD Black Pencil" },
            { n: "80+", label: "Brand films livrés" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: C.violet }}>{stat.n}</div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.textDim }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Work ───────────────────────────────────────────────────────── */}
      <section id="work" style={{ padding: "5rem 3rem", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
                / SELECTED WORK
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
                Projects
              </h2>
            </div>
            <motion.a
              href="#"
              style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
              whileHover={{ color: C.violetLight }}
            >
              ALL WORK
              <div style={{ width: "2rem", height: "1px", background: "currentcolor" }} />
            </motion.a>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {PROJECTS.map((project, i) => (
              <SkewProjectItem key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "6rem 3rem", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / SERVICES
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
              Ce Que Nous Faisons
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.border }}>
            {SERVICES.map((svc, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={svc.code}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                  whileHover={{ backgroundColor: "#0E0E18" }}
                  style={{ background: C.bgCard, padding: "3rem", transition: "background 0.3s" }}
                >
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", color: C.violet, marginBottom: "1.5rem" }}>
                    {svc.code}
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.75 }}>
                    {svc.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Awards ─────────────────────────────────────────────────────── */}
      <section id="studio" style={{ padding: "6rem 3rem", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / RECOGNITION
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
              Awards
            </h2>
          </div>
          {AWARDS_LIST.map((award, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={award}
                ref={ref}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  padding: "1.5rem 0",
                  borderBottom: i < AWARDS_LIST.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div style={{ width: "6px", height: "6px", background: C.violet, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
                  {award}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "8rem 3rem", background: C.violet, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(6rem, 20vw, 18rem)",
            fontWeight: 800,
            color: "rgba(0,0,0,0.08)",
            letterSpacing: "-0.04em",
          }}>
            LET'S GO
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, color: C.bg, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "1.5rem" }}>
            On a un créneau<br />disponible pour vous.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(7,7,10,0.65)", lineHeight: 1.75, marginBottom: "3rem", maxWidth: "50ch", margin: "0 auto 3rem" }}>
            On ne travaille qu'avec 4 clients en simultané. Si votre projet mérite d'exister, écrivez-nous.
          </p>
          <motion.button
            whileHover={{ backgroundColor: C.bg, color: C.violet }}
            style={{
              background: "transparent",
              border: `2px solid ${C.bg}`,
              color: C.bg,
              padding: "1rem 3rem",
              fontFamily: "'Syne Mono', monospace",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            CONTACT US →
          </motion.button>
          <div style={{ marginTop: "2rem", fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: "rgba(7,7,10,0.5)" }}>
            hello@skewstudio.fr
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: C.text, marginBottom: "1rem" }}>
              SKEW<span style={{ color: C.violet }}>.</span>
            </div>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem", color: C.textDim, lineHeight: 1.8 }}>
              Motion design · Brand films · VFX<br />Paris, France
            </p>
          </div>
          {[
            { title: "WORK", items: ["All Projects", "Films", "Motion", "Installations"] },
            { title: "STUDIO", items: ["About", "Team", "Process", "Careers"] },
            { title: "CONTACT", items: ["New Projects", "Press", "Instagram", "Vimeo"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.violetLight }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>© 2025 SKEW STUDIO</div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>PARIS · MOTION · FILM</div>
        </div>
      </footer>
    </div>
  );
}
