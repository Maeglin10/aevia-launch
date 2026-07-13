"use client";
// @ts-nocheck

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import Link from "next/link";
import { C, F, projects, teamMembers, processSteps } from "./shared";

// ─── 3D BUILDING FACADE ───────────────────────────────────────────────────────
function Building3D({ rotateX }: { rotateX: any }) {
  const floors = Array.from({ length: 12 }, (_, i) => i);
  const windowCols = [0, 1, 2, 3];

  return (
    <div
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 60%',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          transformOrigin: '50% 100%',
        }}
      >
        {/* Building body */}
        <div
          style={{
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main facade */}
          <div style={{ position: 'relative', width: '100%' }}>
            {floors.map((floor) => {
              const isTop = floor === 0;
              const isCrown = floor <= 1;
              const opacity = 1 - floor * 0.04;
              return (
                <motion.div
                  key={floor}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity, y: 0 }}
                  transition={{
                    delay: 0.8 + floor * 0.06,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    height: isTop ? 16 : 38,
                    background: isCrown
                      ? `rgba(201,168,76,${isTop ? 0.9 : 0.4})`
                      : `rgba(20,20,16,${0.92 - floor * 0.02})`,
                    borderBottom: `1px solid rgba(201,168,76,${
                      isCrown ? 0.6 : 0.12
                    })`,
                    transform: `translateZ(${floor * -4}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Left structural band */}
                  <div
                    style={{
                      width: 28,
                      background: `rgba(10,10,8,${0.6 + floor * 0.02})`,
                      borderRight: '1px solid rgba(201,168,76,0.15)',
                      flexShrink: 0,
                    }}
                  />

                  {/* Window bays */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      gap: 4,
                      padding: '6px 8px',
                      alignItems: 'center',
                    }}
                  >
                    {!isTop &&
                      windowCols.map((w) => {
                        const lit =
                          (floor + w) % 3 !== 0 ||
                          floor < 3;
                        return (
                          <div
                            key={w}
                            style={{
                              flex: 1,
                              height: '100%',
                              background: lit
                                ? `rgba(201,168,76,${
                                    0.07 + Math.random() * 0.06
                                  })`
                                : 'rgba(0,0,0,0.3)',
                              border: `1px solid rgba(201,168,76,${
                                lit ? 0.25 : 0.06
                              })`,
                              transition: 'all 0.5s',
                            }}
                          />
                        );
                      })}
                  </div>

                  {/* Right structural band */}
                  <div
                    style={{
                      width: 28,
                      background: `rgba(10,10,8,${0.6 + floor * 0.02})`,
                      borderLeft: '1px solid rgba(201,168,76,0.15)',
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
              );
            })}

            {/* Ground podium */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              style={{
                height: 56,
                background: 'rgba(15,15,12,0.98)',
                borderTop: `2px solid ${C.accent}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 28px',
                gap: 4,
              }}
            >
              {/* Entrance arch */}
              <div
                style={{
                  flex: 0.8,
                  height: '80%',
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: '50% 50% 0 0',
                  background: 'rgba(201,168,76,0.04)',
                }}
              />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '70%',
                    background: 'rgba(201,168,76,0.06)',
                    border: `1px solid rgba(201,168,76,0.18)`,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 0.8,
                  height: '80%',
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: '50% 50% 0 0',
                  background: 'rgba(201,168,76,0.04)',
                }}
              />
            </motion.div>

            {/* Side face (3D depth) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: -32,
                bottom: 0,
                width: 32,
                background:
                  'linear-gradient(to right, rgba(5,5,4,0.9), rgba(5,5,4,0.4))',
                transform: 'rotateY(-90deg)',
                transformOrigin: 'left center',
                borderLeft: '1px solid rgba(201,168,76,0.1)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Ground plane reflection */}
      <div
        style={{
          height: 40,
          background:
            'linear-gradient(to bottom, rgba(201,168,76,0.08), transparent)',
          transform: 'scaleY(-0.3) translateY(-4px)',
          transformOrigin: 'top',
          filter: 'blur(2px)',
          opacity: 0.6,
        }}
      />
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.8], [-30, 0]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: C.bgDark,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Textured bg */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          scale: bgScale,
          backgroundImage: `
            radial-gradient(ellipse 60% 80% at 70% 50%, rgba(201,168,76,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(20,20,16,0.8) 0%, transparent 70%),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 47px,
              rgba(255,255,255,0.012) 48px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 47px,
              rgba(255,255,255,0.012) 48px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Top line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
        }}
      />

      <motion.div
        style={{
          y: heroY,
          opacity: heroOpacity,
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '120px 40px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
        className="two-col imx-mobstack"
      >
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 40,
            }}
          >
            <div
              style={{ width: 48, height: 1, background: C.accent }}
            />
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase' as const,
                color: C.accent,
                fontWeight: 500,
              }}
            >
              Architecture · Urbanism · Interior
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: F.sans,
              fontSize: 'clamp(52px, 6vw, 88px)',
              fontWeight: 700,
              color: C.white,
              lineHeight: 0.96,
              letterSpacing: '-0.03em',
              margin: '0 0 32px',
            }}
          >
            Space
            <br />
            <span style={{ color: C.accent }}>Defines</span>
            <br />
            Culture.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              fontFamily: F.sans,
              fontSize: 16,
              color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.8,
              maxWidth: 420,
              marginBottom: 52,
              letterSpacing: '0.01em',
            }}
          >
            Atelier Moreau·Leroy is a Paris-based architecture and urbanism studio. We design buildings, cities, and interiors that resist the ordinary and endure beyond fashion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}
          >
            <Link href="/templates/impact-48/projects" style={{ textDecoration: "none" }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: C.accent,
                  color: C.bgDark,
                  padding: '15px 36px',
                  fontFamily: F.sans,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#d9b85c')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = C.accent)
                }
              >
                View Projects
              </span>
            </Link>
            <Link href="/templates/impact-48/about" style={{ textDecoration: "none" }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.55)',
                  padding: '15px 36px',
                  fontFamily: F.sans,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accentBorder;
                  e.currentTarget.style.color = C.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    'rgba(255,255,255,0.14)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                Our Process
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{
              display: 'flex',
              gap: 48,
              marginTop: 72,
              paddingTop: 40,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              flexWrap: 'wrap' as const,
            }}
          >
            {[
              { val: '62', label: 'Buildings Completed' },
              { val: '23', label: 'Years Practice' },
              { val: '11', label: 'Countries' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 32,
                    fontWeight: 700,
                    color: C.accent,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.28)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D building */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Building3D rotateX={rotateX} />

          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 9,
                letterSpacing: '0.24em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase' as const,
              }}
            >
              Tour Silhouette — Paris 13e
            </span>
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 9,
                letterSpacing: '0.24em',
                color: C.accent,
                textTransform: 'uppercase' as const,
              }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          translateX: '-50%',
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
            margin: '0 auto',
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── PHILOSOPHY SECTION ───────────────────────────────────────────────────────
function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="philosophy"
      ref={ref}
      style={{ background: C.bg, padding: '160px 40px' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          className="two-col imx-mobstack"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 120,
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 32,
              }}
            >
              <div
                style={{ width: 40, height: 1, background: C.accent }}
              />
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                Studio Philosophy
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: F.sans,
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                margin: '0 0 40px',
              }}
            >
              We build
              <br />
              for the
              <br />
              <span style={{ color: C.accent }}>next century.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              style={{
                fontFamily: F.sans,
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.85,
                maxWidth: 440,
                letterSpacing: '0.01em',
              }}
            >
              Architecture's primary obligation is not to its client's ego or its architect's portfolio. It is to the public realm — the street, the neighbourhood, the city — that inherits every building long after the brief is forgotten.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.38 }}
              style={{
                fontFamily: F.sans,
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.85,
                maxWidth: 440,
                marginTop: 24,
                letterSpacing: '0.01em',
              }}
            >
              We work with robust materials, structural honesty, and spatial generosity. Our buildings are designed to be loved, maintained, and adapted — not demolished.
            </motion.p>
          </div>

          {/* Right column: principles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              {
                n: '01',
                title: 'Structure is Ornament',
                text: 'We expose what holds the building up. A concrete column, a steel truss, a timber beam — each is also the primary aesthetic experience. We never hide structure behind cladding.',
              },
              {
                n: '02',
                title: 'Section before Plan',
                text: 'The cross-section determines how light moves, how rooms relate vertically, how the building breathes. We draw sections before plans on every project.',
              },
              {
                n: '03',
                title: 'Material Honesty',
                text: "Concrete looks like concrete. Brick looks like brick. We don\'t apply thin veneers or use materials to simulate other materials. Authenticity ages better than novelty.",
              },
              {
                n: '04',
                title: 'Urban Generosity',
                text: 'Every building has a civic duty. A public colonnade, an active ground floor, a planted setback — small acts that repair the city rather than enclose it.',
              },
            ].map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
                style={{
                  display: 'flex',
                  gap: 28,
                  padding: '32px 36px',
                  background: C.bgCard,
                  borderLeft: `2px solid ${i === 0 ? C.accent : C.border}`,
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderLeftColor = C.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderLeftColor =
                    i === 0 ? C.accent : C.border)
                }
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    color: C.accent,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    flexShrink: 0,
                    paddingTop: 3,
                  }}
                >
                  {p.n}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: F.sans,
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.text,
                      letterSpacing: '-0.01em',
                      margin: '0 0 10px',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.sans,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      margin: 0,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {p.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS SECTION — SHARED LAYOUT ZOOM ────────────────────────────────────
function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = projects.find((p) => p.id === selectedId);

  // Keyboard ESC handler
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedId]);

  return (
    <section
      id="projects"
      ref={ref}
      style={{ background: C.bgDark, padding: '160px 40px' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 72,
            flexWrap: 'wrap' as const,
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{ width: 40, height: 1, background: C.accent }}
              />
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                Selected Work
              </span>
            </div>
            <h2
              style={{
                fontFamily: F.sans,
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 700,
                color: C.white,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                margin: 0,
              }}
            >
              Projects
            </h2>
          </div>
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
            }}
          >
            Click any project to expand
          </span>
        </motion.div>

        <LayoutGroup>
          {/* Project grid */}
          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 2,
            }}
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                layoutId={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.6, delay: i * 0.08 },
                  y: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
                }}
                onClick={() => setSelectedId(project.id)}
                style={{
                  background: project.color,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  justifyContent: 'flex-end',
                  padding: 32,
                  borderTop: `1px solid rgba(201,168,76,0.1)`,
                }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Blueprint grid overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent 0, transparent 39px, rgba(201,168,76,0.04) 40px),
                      repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(201,168,76,0.04) 40px)
                    `,
                    pointerEvents: 'none',
                  }}
                />

                {/* Architectural line element */}
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 80,
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }}
                  fill="none"
                >
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    stroke={C.accent}
                    strokeWidth="1"
                  />
                  <line
                    x1="20"
                    y1="100"
                    x2="180"
                    y2="100"
                    stroke={C.accent}
                    strokeWidth="0.5"
                  />
                  <line
                    x1="100"
                    y1="20"
                    x2="100"
                    y2="180"
                    stroke={C.accent}
                    strokeWidth="0.5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="40"
                    stroke={C.accent}
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase' as const,
                        color: C.accent,
                        fontWeight: 500,
                      }}
                    >
                      {project.category}
                    </span>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        letterSpacing: '0.16em',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: F.sans,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C.white,
                      letterSpacing: '-0.02em',
                      margin: '0 0 6px',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.sans,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.08em',
                      margin: 0,
                    }}
                  >
                    {project.location} · {project.area}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expanded overlay */}
          <AnimatePresence>
            {selectedId && selectedProject && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(null)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 300,
                    backdropFilter: 'blur(8px)',
                  }}
                />

                {/* Expanded card */}
                <motion.div className="imx-mobstack"
                  key={`expanded-${selectedId}`}
                  layoutId={`project-card-${selectedId}`}
                  style={{
                    position: 'fixed',
                    top: '5vh',
                    left: '5vw',
                    width: '90vw',
                    height: '90vh',
                    background: selectedProject.color,
                    zIndex: 301,
                    overflow: 'auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                  }}
                  transition={{
                    layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  {/* Left: visual */}
                  <div
                    style={{
                      position: 'relative',
                      padding: 60,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      justifyContent: 'flex-end',
                      minHeight: '100%',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                          repeating-linear-gradient(0deg, transparent 0, transparent 59px, rgba(201,168,76,0.05) 60px),
                          repeating-linear-gradient(90deg, transparent 0, transparent 59px, rgba(201,168,76,0.05) 60px)
                        `,
                      }}
                    />

                    {/* Large blueprint geometry */}
                    <svg
                      viewBox="0 0 400 400"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: '70%',
                        opacity: 0.2,
                      }}
                      fill="none"
                    >
                      <rect x="40" y="40" width="320" height="320" stroke={C.accent} strokeWidth="1" />
                      <rect x="80" y="80" width="240" height="240" stroke={C.accent} strokeWidth="0.5" />
                      <line x1="40" y1="200" x2="360" y2="200" stroke={C.accent} strokeWidth="0.5" />
                      <line x1="200" y1="40" x2="200" y2="360" stroke={C.accent} strokeWidth="0.5" />
                      <circle cx="200" cy="200" r="80" stroke={C.accent} strokeWidth="0.5" />
                      <circle cx="200" cy="200" r="40" stroke={C.accent} strokeWidth="0.5" />
                      <polygon points="200,80 320,320 80,320" stroke={C.accent} strokeWidth="0.5" fill="none" />
                    </svg>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <span
                        style={{
                          fontFamily: F.sans,
                          fontSize: 10,
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase' as const,
                          color: C.accent,
                          fontWeight: 500,
                          display: 'block',
                          marginBottom: 12,
                        }}
                      >
                        {selectedProject.category}
                      </span>
                      <h2
                        style={{
                          fontFamily: F.sans,
                          fontSize: 'clamp(32px, 4vw, 56px)',
                          fontWeight: 700,
                          color: C.white,
                          letterSpacing: '-0.02em',
                          margin: '0 0 16px',
                        }}
                      >
                        {selectedProject.title}
                      </h2>
                      <p
                        style={{
                          fontFamily: F.sans,
                          fontSize: 13,
                          color: 'rgba(255,255,255,0.4)',
                          letterSpacing: '0.08em',
                          margin: 0,
                        }}
                      >
                        {selectedProject.location} · {selectedProject.year} · {selectedProject.area}
                      </p>
                    </div>
                  </div>

                  {/* Right: copy */}
                  <div
                    style={{
                      background: 'rgba(15,15,12,0.96)',
                      borderLeft: `1px solid rgba(255,255,255,0.06)`,
                      padding: '80px 60px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setSelectedId(null)}
                      style={{
                        position: 'absolute',
                        top: 40,
                        right: 40,
                        fontFamily: F.sans,
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        color: C.accent,
                        textTransform: 'uppercase' as const,
                        cursor: 'pointer',
                        padding: 8,
                      }}
                    >
                      Close [Esc]
                    </button>

                    <div>
                      <p
                        style={{
                          fontFamily: F.sans,
                          fontSize: 16,
                          color: 'rgba(255,255,255,0.55)',
                          lineHeight: 1.85,
                          letterSpacing: '0.01em',
                          margin: '0 0 48px',
                        }}
                      >
                        {selectedProject.description}
                      </p>

                      <span
                        style={{
                          fontFamily: F.sans,
                          fontSize: 10,
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase' as const,
                          color: C.accent,
                          display: 'block',
                          marginBottom: 18,
                        }}
                      >
                        Specifications
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column' as const,
                          gap: 12,
                          marginBottom: 48,
                        }}
                      >
                        {selectedProject.specs.map((spec) => (
                          <div
                            key={spec}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              fontFamily: F.sans,
                              fontSize: 13,
                              color: 'rgba(255,255,255,0.45)',
                              letterSpacing: '0.02em',
                            }}
                          >
                            <div style={{ width: 20, height: 1, background: C.accent, flexShrink: 0 }} />
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/templates/impact-48/contact" style={{ textDecoration: "none" }}>
                      <button
                        onClick={() => setSelectedId(null)}
                        style={{
                          width: '100%',
                          background: C.accent,
                          color: C.bgDark,
                          padding: '16px 28px',
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
                        Discuter du projet
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

// ─── FLOOR PLAN SVG (scroll-driven stroke-dashoffset) ─────────────────────────
function FloorPlanSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const TOTAL = 2800;
  const dashOffset = useTransform(
    scrollYProgress,
    [0.05, 0.55],
    [TOTAL, 0]
  );
  const smoothDash = useSpring(dashOffset, { stiffness: 60, damping: 30 });

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ background: C.bg, padding: '160px 40px' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Heading */}
        <div
          className="two-col imx-mobstack"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
            marginBottom: 100,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{ width: 40, height: 1, background: C.accent }}
              />
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                How We Work
              </span>
            </div>
            <h2
              style={{
                fontFamily: F.sans,
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                margin: 0,
              }}
            >
              Process
              <br />
              as Method
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 28,
              paddingTop: 8,
            }}
          >
            {processSteps.map((s, i) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingBottom: 28,
                  borderBottom:
                    i < processSteps.length - 1
                      ? `1px solid ${C.border}`
                      : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    color: C.accent,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    flexShrink: 0,
                    paddingTop: 2,
                  }}
                >
                  {s.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: F.sans,
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.text,
                      letterSpacing: '0.02em',
                      margin: '0 0 8px',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.sans,
                      fontSize: 13,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor plan SVG — scroll-linked draw */}
        <div
          style={{
            position: 'relative',
            border: `1px solid ${C.border}`,
            background: C.bg,
            overflow: 'hidden',
          }}
        >
          {/* Blueprint label */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 2,
            }}
          >
            <div
              style={{ width: 20, height: 1, background: C.accent }}
            />
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 9,
                letterSpacing: '0.26em',
                textTransform: 'uppercase' as const,
                color: C.accent,
              }}
            >
              Level 04 — Floor Plan · 1:100
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 32,
              display: 'flex',
              gap: 24,
              zIndex: 2,
            }}
          >
            {['N', 'S', 'E', 'W'].map((d) => (
              <span
                key={d}
                style={{
                  fontFamily: F.sans,
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: 'rgba(15,15,15,0.2)',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <svg
            viewBox="0 0 1000 520"
            style={{ width: '100%', display: 'block' }}
            fill="none"
          >
            {/* Background grid */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 52}
                y1="0"
                x2={i * 52}
                y2="520"
                stroke="rgba(201,168,76,0.06)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 52}
                x2="1000"
                y2={i * 52}
                stroke="rgba(201,168,76,0.06)"
                strokeWidth="0.5"
              />
            ))}

            {/* Scroll-driven outer perimeter */}
            <motion.rect
              x="60"
              y="60"
              width="880"
              height="400"
              stroke={C.accent}
              strokeWidth="2"
              style={{
                pathLength: useTransform(scrollYProgress, [0.05, 0.4], [0, 1]),
              }}
            />

            {/* Interior walls — animated via dashoffset */}
            <motion.path
              d="
                M 60 200 L 940 200
                M 60 340 L 940 340
                M 200 60 L 200 460
                M 380 60 L 380 460
                M 560 60 L 560 460
                M 740 60 L 740 460
                M 200 200 L 380 260
                M 560 200 L 740 140
                M 380 340 L 560 280
                M 740 340 L 940 380
              "
              stroke={C.accent}
              strokeWidth="1"
              strokeOpacity="0.5"
              style={{
                strokeDasharray: TOTAL,
                strokeDashoffset: smoothDash,
              }}
            />

            {/* Room labels */}
            {[
              { x: 130, y: 136, label: 'Entrance' },
              { x: 290, y: 136, label: 'Living' },
              { x: 470, y: 136, label: 'Kitchen' },
              { x: 650, y: 136, label: 'Study' },
              { x: 840, y: 136, label: 'Terrace' },
              { x: 130, y: 276, label: 'Dining' },
              { x: 290, y: 276, label: 'Lounge' },
              { x: 470, y: 276, label: 'Bath' },
              { x: 650, y: 276, label: 'Bed 01' },
              { x: 840, y: 276, label: 'Bath' },
              { x: 130, y: 406, label: 'Service' },
              { x: 290, y: 406, label: 'Bed 02' },
              { x: 470, y: 406, label: 'Bed 03' },
              { x: 650, y: 406, label: 'Bed 04' },
              { x: 840, y: 406, label: 'Loggia' },
            ].map((l) => (
              <motion.text
                key={l.label + l.x}
                x={l.x}
                y={l.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontFamily={F.sans}
                letterSpacing="1.5"
                fill={C.accent}
                opacity={0.55}
                style={{
                  opacity: useTransform(
                    scrollYProgress,
                    [0.35, 0.55],
                    [0, 0.55]
                  ),
                }}
              >
                {l.label.toUpperCase()}
              </motion.text>
            ))}

            {/* North arrow */}
            <motion.g
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.55], [0, 1]),
              }}
            >
              <line
                x1="960"
                y1="480"
                x2="960"
                y2="440"
                stroke={C.accent}
                strokeWidth="1.5"
              />
              <polygon
                points="960,432 954,448 960,444 966,448"
                fill={C.accent}
              />
              <text
                x="960"
                y="492"
                textAnchor="middle"
                fontSize="9"
                fontFamily={F.sans}
                fill={C.accent}
                opacity="0.7"
                letterSpacing="2"
              >
                N
              </text>
            </motion.g>

            {/* Scale bar */}
            <motion.g
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.55], [0, 1]),
              }}
            >
              <line
                x1="60"
                y1="490"
                x2="220"
                y2="490"
                stroke={C.accent}
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="485"
                x2="60"
                y2="495"
                stroke={C.accent}
                strokeWidth="1"
              />
              <line
                x1="220"
                y1="485"
                x2="220"
                y2="495"
                stroke={C.accent}
                strokeWidth="1"
              />
              <text
                x="140"
                y="505"
                textAnchor="middle"
                fontSize="8"
                fontFamily={F.sans}
                fill={C.accent}
                opacity="0.6"
                letterSpacing="1"
              >
                10 m
              </text>
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── STATS SECTION — SCROLL-PINNED COUNTING NUMBERS ───────────────────────────
function useCountUp(target: number, active: boolean, duration = 1.8) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const tick = useCallback(
    (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = (timestamp - startTime.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    if (!active) return;
    startTime.current = null;
    setCurrent(0);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  return current;
}

function StatNumber({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active, 2);

  return (
    <div
      style={{
        textAlign: 'center' as const,
        padding: '60px 40px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 'clamp(64px, 8vw, 120px)',
          fontWeight: 700,
          color: C.white,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span>{count}</span>
        <span style={{ fontSize: '0.45em', color: C.accent }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.3)',
          marginTop: 16,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      style={{
        background: C.bgDark,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blueprint watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent 0, transparent 79px, rgba(201,168,76,0.03) 80px),
            repeating-linear-gradient(90deg, transparent 0, transparent 79px, rgba(201,168,76,0.03) 80px)
          `,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section label */}
        <div
          style={{
            padding: '80px 40px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 0,
          }}
        >
          <div style={{ width: 40, height: 1, background: C.accent }} />
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 10,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              color: C.accent,
            }}
          >
            By the Numbers
          </span>
        </div>

        {/* Stats row */}
        <div
          className="three-col"
          style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: 60,
          }}
        >
          <StatNumber value={62} suffix="+" label="Buildings Completed" active={inView} />
          <StatNumber value={23} suffix="" label="Years in Practice" active={inView} />
          <StatNumber value={11} suffix="" label="Countries Built" active={inView} />
        </div>

        {/* Second row */}
        <div
          className="four-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { val: 28, suffix: '', label: 'Awards Received' },
            { val: 340, suffix: '+', label: 'Collaborators' },
            { val: 4, suffix: '', label: 'Studio Locations' },
            { val: 98, suffix: '%', label: 'Client Retention' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: '48px 40px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <StatNumber
                value={s.val}
                suffix={s.suffix}
                label={s.label}
                active={inView}
              />
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div
          style={{
            padding: '40px 40px 80px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap' as const,
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.06em',
            }}
          >
            Established Paris, 2001
          </span>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Venice Biennale', 'Grand Prix National', 'RIBA International'].map(
              (award) => (
                <span
                  key={award}
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    color: C.accent,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {award}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BLUEPRINT LINE DRAWING (IntersectionObserver) ────────────────────────────
function BlueprintDrawing() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 600 320"
        style={{ width: '100%', display: 'block' }}
        fill="none"
      >
        {/* Outer shell */}
        <path
          d="M 40 280 L 40 80 L 160 40 L 440 40 L 560 80 L 560 280 Z"
          stroke={C.accent}
          strokeWidth="1.5"
          className={`blueprint-line${triggered ? ' animate' : ''}`}
          style={{ '--total-length': '1200px' } as React.CSSProperties}
        />

        {/* Interior cross section */}
        <path
          d="
            M 40 160 L 560 160
            M 160 40 L 160 280
            M 440 40 L 440 280
            M 160 160 L 200 120 L 400 120 L 440 160
            M 200 280 L 200 120
            M 400 280 L 400 120
          "
          stroke={C.accent}
          strokeWidth="0.8"
          strokeOpacity="0.6"
          className={`blueprint-line-2${triggered ? ' animate' : ''}`}
          style={{ '--total-length': '1400px' } as React.CSSProperties}
        />

        {/* Roof detail */}
        <path
          d="
            M 160 40 L 300 10 L 440 40
            M 300 10 L 300 160
            M 220 60 L 220 120
            M 380 60 L 380 120
          "
          stroke={C.accent}
          strokeWidth="0.6"
          strokeOpacity="0.4"
          className={`blueprint-line-3${triggered ? ' animate' : ''}`}
          style={{ '--total-length': '600px' } as React.CSSProperties}
        />

        {/* Dimension lines */}
        {[
          { x1: 40, y1: 298, x2: 560, y2: 298, label: '32.0 m', lx: 300, ly: 310 },
          { x1: 570, y1: 40, x2: 570, y2: 280, label: '14.0 m', lx: 586, ly: 165 },
        ].map((dim, i) => (
          <g key={i}>
            <line
              x1={dim.x1}
              y1={dim.y1}
              x2={dim.x2}
              y2={dim.y2}
              stroke={C.accent}
              strokeWidth="0.5"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            />
            <text
              x={dim.lx}
              y={dim.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontFamily={F.sans}
              fill={C.accent}
              opacity="0.5"
              letterSpacing="1"
            >
              {dim.label}
            </text>
          </g>
        ))}

        {/* Floor labels */}
        {[
          { x: 100, y: 100, t: 'R+2' },
          { x: 100, y: 220, t: 'R+1' },
          { x: 300, y: 220, t: 'SÉJOUR' },
          { x: 300, y: 100, t: 'BUREAU' },
          { x: 490, y: 160, t: 'R+0' },
        ].map((l) => (
          <text
            key={l.t}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fontFamily={F.sans}
            fill={C.accent}
            opacity="0.4"
            letterSpacing="2"
          >
            {l.t}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── TEAM SECTION ─────────────────────────────────────────────────────────────
function TeamSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="team"
      ref={ref}
      style={{ background: C.bg, padding: '160px 40px' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 80 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase' as const,
                color: C.accent,
              }}
            >
              The Studio
            </span>
          </div>
          <h2
            style={{
              fontFamily: F.sans,
              fontSize: 'clamp(40px, 4.5vw, 64px)',
              fontWeight: 700,
              color: C.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              margin: 0,
            }}
          >
            Who We Are
          </h2>
        </motion.div>

        {/* Blueprint drawing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            border: `1px solid ${C.border}`,
            padding: '32px',
            marginBottom: 80,
            background: C.bgCard,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 16, height: 1, background: C.accent }} />
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 9,
                letterSpacing: '0.26em',
                textTransform: 'uppercase' as const,
                color: C.accent,
              }}
            >
              Section coupe · Maison Éclat · Échelle 1:200
            </span>
          </div>
          <BlueprintDrawing />
        </motion.div>

        {/* Team cards */}
        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 2,
            background: C.border,
          }}
        >
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              style={{
                background: C.bgCard,
                padding: 48,
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
              {/* Monogram */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: C.accentDim,
                  border: `1px solid ${C.accentBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.accent,
                  }}
                >
                  {member.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: F.sans,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: '-0.01em',
                  margin: '0 0 6px',
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: 11,
                  color: C.accent,
                  letterSpacing: '0.1em',
                  margin: '0 0 4px',
                  fontWeight: 500,
                }}
              >
                {member.title}
              </p>
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: 11,
                  color: C.textDim,
                  letterSpacing: '0.06em',
                  margin: '0 0 24px',
                }}
              >
                {member.credentials}
              </p>

              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.8,
                  margin: '0 0 28px',
                  letterSpacing: '0.01em',
                }}
              >
                {member.bio}
              </p>

              <div className="imx-mobstack"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: 'Built', val: member.projects },
                  { label: 'Awards', val: member.awards },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '14px 16px',
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.sans,
                        fontSize: 16,
                        fontWeight: 700,
                        color: C.accent,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.val}
                    </div>
                    <div
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        color: C.textDim,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const,
                        marginTop: 2,
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 20,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 1,
                    background: C.accent,
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 12,
                    color: C.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {member.focus}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid rgba(255,255,255,0.1)`,
    color: C.white,
    fontFamily: F.sans,
    fontSize: 14,
    letterSpacing: '0.02em',
    padding: '14px 20px',
    outline: 'none',
    transition: 'border-color 0.3s',
    display: 'block',
    boxSizing: 'border-box' as const,
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: C.bgDark, padding: '160px 40px' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          className="two-col imx-mobstack"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 100,
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                <div
                  style={{ width: 40, height: 1, background: C.accent }}
                />
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase' as const,
                    color: C.accent,
                  }}
                >
                  New Enquiry
                </span>
              </div>

              <h2
                style={{
                  fontFamily: F.sans,
                  fontSize: 'clamp(40px, 4.5vw, 64px)',
                  fontWeight: 700,
                  color: C.white,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.0,
                  margin: '0 0 40px',
                }}
              >
                Start a
                <br />
                <span style={{ color: C.accent }}>Conversation</span>
              </h2>

              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.42)',
                  lineHeight: 1.85,
                  maxWidth: 380,
                  marginBottom: 64,
                  letterSpacing: '0.01em',
                }}
              >
                We begin every project with a conversation — no brief, no fee, no obligation. Tell us about your project and we will arrange an introductory meeting within five working days.
              </p>

              {/* Contact details */}
              <div
                style={{ display: 'flex', flexDirection: 'column' as const, gap: 24 }}
              >
                {[
                  { label: 'Paris Studio', val: '14 Rue du Dragon, 75006 Paris' },
                  { label: 'Geneva Office', val: '12 Quai du Mont-Blanc, 1201 Geneva' },
                  { label: 'Email', val: 'valentinmilliand@aevia.services' },
                  { label: 'Horaires', val: 'Lun – Ven · 9h – 19h' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: 20 }}>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        color: C.accent,
                        minWidth: 96,
                        flexShrink: 0,
                        paddingTop: 2,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.35)',
                        lineHeight: 1.5,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              style={{
                border: `1px solid rgba(255,255,255,0.07)`,
                padding: 48,
              }}
            >
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <h3 style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 12 }}>Thank you!</h3>
                  <p style={{ fontFamily: F.sans, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 20,
                  }}
                >
                  <div className="imx-mobstack"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                    }}
                  >
                    <input
                      placeholder="Full Name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = C.accentBorder)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(255,255,255,0.1)')
                      }
                    />
                    <input
                      placeholder="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = C.accentBorder)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(255,255,255,0.1)')
                      }
                    />
                  </div>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    style={{
                      ...inputStyle,
                      appearance: 'none' as const,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" style={{ background: C.bgDark }}>
                      Project Type
                    </option>
                    {[
                      'Private Residence',
                      'Mixed-Use Development',
                      'Cultural Institution',
                      'Corporate Headquarters',
                      'Collective Housing',
                      'Urban Planning',
                      'Interior Design',
                      'Other',
                    ].map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={{ background: C.bgDark }}
                      >
                        {t}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Tell us about your project — site, programme, timeline, budget if known."
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.7, minHeight: 140 }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = C.accentBorder)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.1)')
                    }
                  />

                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.bgDark,
                      fontFamily: F.sans,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase' as const,
                      padding: '16px 32px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#d9b85c')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                  >
                    Send Enquiry
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ArchitectureTemplate() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

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
  brand = fd?.brandColor ?? null; // null = keep template's original color

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <HeroSection />
      <PhilosophySection />
      <ProjectsSection />
      <FloorPlanSection />
      <StatsSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
