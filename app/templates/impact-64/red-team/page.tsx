"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { C, mono, sans } from "../shared";

export default function RedTeamPage() {
  const workflow = [
    { step: "01", phase: "Reconnaissance (OSINT)", desc: "Cartographie passive de la surface d'attaque externe, fuites d'identifiants sur le Dark Web, fuites de métadonnées de documents." },
    { step: "02", phase: "Intrusion Initiale", desc: "Campagnes de spear-phishing ultra-ciblées, attaques par force brute, contournement MFA ou exploitation de vulnérabilités Zero-Day." },
    { step: "03", phase: "Persistance & Pivots", desc: "Installation de balises furtives (beacons), contournement EDR, élévation de privilèges Active Directory et mouvements latéraux." },
    { step: "04", phase: "Cible Finale", desc: "Simulations d'exfiltration de données, chiffrement de systèmes simulés ou perturbation d'infrastructures critiques." },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "5rem", textAlign: "center" }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// RED TEAM & AUDIT OFFENSIF</span>
          <h1 style={{ fontFamily: mono, fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.15, paddingBottom: "0.15em", color: C.text, marginBottom: "2rem" }}>
            Simulation d'Attaques <span style={{ color: C.green }}>Réelles.</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
            Nos experts Red Team simulent les techniques, tactiques et procédures des attaquants étatiques et cybercriminels les plus sophistiqués pour tester la résilience réelle de vos défenses.
          </p>
        </motion.div>

        {/* Core Methodology */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "6rem" }}>
          <div>
            <h2 style={{ fontFamily: mono, fontSize: "1.75rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem" }}>
              Pourquoi lancer un exercice <span style={{ color: C.green }}>Red Team</span> ?
            </h2>
            <p style={{ fontFamily: sans, fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Un test d'intrusion classique (pentest) valide la présence de vulnérabilités individuelles sur un périmètre restreint. L'exercice Red Team, quant à lui, teste la capacité de détection et de réaction globale de votre équipe de sécurité (Blue Team).
            </p>
            <p style={{ fontFamily: sans, fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "2rem" }}>
              Nous définissons des scénarios d'attaque spécifiques avec vous et opérons dans le secret le plus strict pour reproduire l'effet de surprise d'un hack réel.
            </p>
            <Link href="/templates/impact-64/contact" style={{
              fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
              background: C.green, color: C.bg, padding: "0.8rem 1.8rem", borderRadius: "4px",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem"
            }}>
              DEMANDER UN SCÉNARIO <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ background: C.bgCard, border: `1px solid ${C.greenBorder}`, padding: "3rem", borderRadius: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { title: "Habilitations ANSSI PRIS", desc: "Nos consultants respectent des protocoles stricts agréés.", icon: Shield },
                { title: "Couverture Social Engineering", desc: "Phishing, vishing, clé USB piégée et intrusion physique.", icon: Eye },
                { title: "Rapport de Remédiation Priorisé", desc: "Rapport avec score CVSS et plan d'action immédiat.", icon: Lock },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "6px", background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={C.green} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>{item.title}</h4>
                      <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phase Timeline */}
        <div>
          <h3 style={{ fontFamily: mono, fontSize: "1.5rem", fontWeight: 700, color: C.text, textAlign: "center", marginBottom: "4rem" }}>
            Notre Workflow Offensif
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
            {workflow.map((item, i) => (
              <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.greenBorder}`, padding: "2rem", borderRadius: "6px", position: "relative" }}>
                <div style={{ fontFamily: mono, fontSize: "2rem", fontWeight: 700, color: "rgba(0,230,118,0.15)", position: "absolute", top: "1rem", right: "1.5rem" }}>
                  {item.step}
                </div>
                <h4 style={{ fontFamily: mono, fontSize: "0.95rem", fontWeight: 700, color: C.green, marginBottom: "1rem" }}>{item.phase}</h4>
                <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
