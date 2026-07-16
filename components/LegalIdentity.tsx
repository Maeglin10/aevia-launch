"use client";

import { useLang } from "@/lib/LangContext";

/**
 * Shared legal identity blocks (Éditeur / Responsable du traitement + Hébergeur).
 *
 * LABELS are translated per locale via the existing LangContext i18n pattern.
 * The identity FACTS are CONSTANT across all locales (legal facts must not change):
 *   - Éditeur: Aevia WS — entrepreneur individuel (auto-entrepreneur)
 *   - Directeur de la publication: Valentin Milliand
 *   - SIREN: 852 546 225 — RCS Bourg-en-Bresse
 *   - Contact: valentin.milliand@aevia.service
 *   - TVA non applicable, art. 293 B du CGI
 *   - Hébergeur: Vercel Inc.
 *
 * ⚠️ The registered office street address is NEVER printed. It is "communiqué sur
 * demande à valentin.milliand@aevia.service" (label translated per locale).
 */

// ─── Constant identity facts (locale-independent) ────────────────────────────
const FACTS = {
  editeur: "Aevia WS",
  contactEmail: "valentin.milliand@aevia.service",
  director: "Valentin Milliand",
  siren: "852 546 225",
  rcs: "RCS Bourg-en-Bresse",
  hostName: "Vercel, Inc.",
  hostAddress: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  hostUrl: "https://vercel.com",
} as const;

// ─── Translated labels ───────────────────────────────────────────────────────
const T = {
  fr: {
    editeurTitle: "Éditeur",
    responsableTitle: "Responsable du traitement",
    legalForm: "Entrepreneur individuel (auto-entrepreneur)",
    director: "Directeur de la publication",
    siren: "SIREN",
    rcsLabel: "Immatriculation",
    contact: "Contact",
    address: "Adresse",
    addressValue: "Adresse du siège social communiquée sur demande à valentin.milliand@aevia.service",
    vat: "TVA",
    vatValue: "TVA non applicable, art. 293 B du CGI",
    hostTitle: "Hébergeur",
    hostRole: "Hébergement et déploiement du site",
    website: "Site",
  },
  en: {
    editeurTitle: "Publisher",
    responsableTitle: "Data controller",
    legalForm: "Sole trader (self-employed)",
    director: "Publication director",
    siren: "SIREN",
    rcsLabel: "Registration",
    contact: "Contact",
    address: "Address",
    addressValue: "Registered office address provided on request at valentin.milliand@aevia.service",
    vat: "VAT",
    vatValue: "VAT not applicable, art. 293 B of the French Tax Code",
    hostTitle: "Hosting provider",
    hostRole: "Website hosting and deployment",
    website: "Website",
  },
  es: {
    editeurTitle: "Editor",
    responsableTitle: "Responsable del tratamiento",
    legalForm: "Empresario individual (autónomo)",
    director: "Director de la publicación",
    siren: "SIREN",
    rcsLabel: "Registro",
    contact: "Contacto",
    address: "Dirección",
    addressValue: "Dirección del domicilio social facilitada previa solicitud a valentin.milliand@aevia.service",
    vat: "IVA",
    vatValue: "IVA no aplicable, art. 293 B del Código General de Impuestos francés",
    hostTitle: "Proveedor de alojamiento",
    hostRole: "Alojamiento y despliegue del sitio web",
    website: "Sitio web",
  },
  de: {
    editeurTitle: "Herausgeber",
    responsableTitle: "Verantwortlicher für die Verarbeitung",
    legalForm: "Einzelunternehmer (Kleinunternehmer)",
    director: "Verantwortlicher für die Veröffentlichung",
    siren: "SIREN",
    rcsLabel: "Registrierung",
    contact: "Kontakt",
    address: "Adresse",
    addressValue: "Anschrift des Firmensitzes auf Anfrage unter valentin.milliand@aevia.service",
    vat: "USt.",
    vatValue: "USt. nicht anwendbar, Art. 293 B des französischen Steuergesetzbuchs",
    hostTitle: "Hosting-Anbieter",
    hostRole: "Hosting und Bereitstellung der Website",
    website: "Website",
  },
  pt: {
    editeurTitle: "Editor",
    responsableTitle: "Responsável pelo tratamento",
    legalForm: "Empresário em nome individual (trabalhador independente)",
    director: "Diretor da publicação",
    siren: "SIREN",
    rcsLabel: "Registo",
    contact: "Contacto",
    address: "Morada",
    addressValue: "Morada da sede social fornecida mediante pedido para valentin.milliand@aevia.service",
    vat: "IVA",
    vatValue: "IVA não aplicável, art. 293.º B do Código Geral de Impostos francês",
    hostTitle: "Fornecedor de alojamento",
    hostRole: "Alojamento e implementação do site",
    website: "Site",
  },
} as const;

const rowLabel = "text-zinc-500";
const link = "text-red-600 hover:text-red-700 transition-colors";

/**
 * Publisher / data-controller identity block.
 * @param variant "editeur" (default) for mentions légales & CGV,
 *                "responsable" for the privacy policy (data controller).
 */
export function LegalEditeur({ variant = "editeur" }: { variant?: "editeur" | "responsable" }) {
  const { locale } = useLang();
  const t = T[locale];

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm space-y-1.5">
      <p>
        <span className="text-zinc-900 font-semibold">{FACTS.editeur}</span> — {t.legalForm}
      </p>
      <p><span className={rowLabel}>{t.director} :</span> {FACTS.director}</p>
      <p><span className={rowLabel}>{t.siren} :</span> {FACTS.siren}</p>
      <p><span className={rowLabel}>{t.rcsLabel} :</span> {FACTS.rcs}</p>
      <p>
        <span className={rowLabel}>{t.contact} :</span>{" "}
        <a href={`mailto:${FACTS.contactEmail}`} className={link}>
          {FACTS.contactEmail}
        </a>
      </p>
      <p><span className={rowLabel}>{t.address} :</span> {t.addressValue}</p>
      <p><span className={rowLabel}>{t.vat} :</span> {t.vatValue}</p>
    </div>
  );
}

/** Hosting provider identity block (Vercel). */
export function LegalHebergeur() {
  const { locale } = useLang();
  const t = T[locale];

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm space-y-1.5">
      <p><span className="text-zinc-900 font-semibold">{FACTS.hostName}</span></p>
      <p>{FACTS.hostAddress}</p>
      <p><span className={rowLabel}>{t.hostRole}</span></p>
      <p>
        <span className={rowLabel}>{t.website} :</span>{" "}
        <a href={FACTS.hostUrl} target="_blank" rel="noopener noreferrer" className={link}>
          {FACTS.hostUrl}
        </a>
      </p>
    </div>
  );
}

/** Re-exported facts for inline contact lines elsewhere on the legal pages. */
export const LEGAL_FACTS = FACTS;
