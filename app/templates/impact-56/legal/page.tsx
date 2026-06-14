"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="relative h-48 flex items-end bg-[#2D1B0E]">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <h1 className="text-4xl font-serif text-white leading-none pb-2">Informations Réglementaires</h1>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-6 font-sans text-zinc-600">
        <Tabs defaultValue="mentions" className="w-full">
          <TabsList className="grid grid-cols-2 bg-transparent gap-4 items-stretch font-sans border-b border-[#2D1B0E]/10 pb-4 mb-8">
            <TabsTrigger
              value="mentions"
              className="py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:text-[#2D1B0E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A265] rounded-none bg-transparent hover:text-[#2D1B0E] transition-all"
            >
              Mentions Légales
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:text-[#2D1B0E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A265] rounded-none bg-transparent hover:text-[#2D1B0E] transition-all"
            >
              Confidentialité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentions" className="outline-none">
            <div className="space-y-10 font-sans">
              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Éditeur du site</h2>
                <p className="text-sm leading-relaxed">
                  Le site Château Vestige est édité par <strong className="text-[#2D1B0E]">Valentin Milliand</strong>, micro-entrepreneur.<br />
                  <strong>SIREN :</strong> 852 546 225<br />
                  <strong>RCS :</strong> Bourg-en-Bresse<br />
                  <strong>Contact :</strong> <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a><br />
                  <strong>Adresse du siège social :</strong> Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à contact@aevia.io).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Hébergement</h2>
                <p className="text-sm leading-relaxed">
                  Ce site est hébergé par <strong className="text-[#2D1B0E]">Vercel Inc.</strong><br />
                  340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.<br />
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#2D1B0E] underline underline-offset-2">vercel.com</a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Propriété intellectuelle</h2>
                <p className="text-sm leading-relaxed">
                  L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Responsabilité</h2>
                <p className="text-sm leading-relaxed">
                  L&apos;éditeur s&apos;efforce de maintenir le site accessible et les informations exactes, mais ne peut garantir l&apos;exactitude, l&apos;exhaustivité ou l&apos;actualité des informations publiées. L&apos;éditeur décline toute responsabilité pour des dommages directs ou indirects résultant de l&apos;utilisation du site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Avertissement — Alcool</h2>
                <p className="text-sm leading-relaxed">
                  La vente et la consommation d&apos;alcool sont réservées aux personnes majeures (18 ans et plus). L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération. La vente à distance de boissons alcoolisées est régie par les articles L. 3342-1 et suivants du Code de la santé publique.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="outline-none">
            <div className="space-y-10 font-sans">
              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Responsable du traitement</h2>
                <p className="text-sm leading-relaxed">
                  <strong>Valentin Milliand</strong> — SIREN 852 546 225<br />
                  Contact DPO : <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Données collectées</h2>
                <p className="text-sm leading-relaxed mb-3">
                  Dans le cadre de l&apos;utilisation de ce site, nous collectons uniquement les données que vous nous transmettez volontairement via les formulaires de contact, de réservation ou de commande :
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Adresse postale (uniquement pour les commandes)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Finalité et base légale</h2>
                <p className="text-sm leading-relaxed">
                  Vos données sont utilisées exclusivement pour traiter vos demandes (réservations, commandes, contact), dans le cadre de l&apos;exécution d&apos;un contrat ou de votre consentement (RGPD, art. 6). Elles ne sont jamais cédées ou vendues à des tiers.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Conservation</h2>
                <p className="text-sm leading-relaxed">
                  Les données sont conservées le temps nécessaire au traitement de votre demande, puis archivées conformément aux obligations légales (5 ans pour les données à caractère commercial).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Vos droits</h2>
                <p className="text-sm leading-relaxed">
                  Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation et d&apos;opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>. En cas de litige, vous pouvez saisir la CNIL (cnil.fr).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2D1B0E] mb-4 font-bold leading-snug">Cookies</h2>
                <p className="text-sm leading-relaxed">
                  Ce site n&apos;utilise pas de cookies de traçage ou publicitaires. Des cookies techniques strictement nécessaires au fonctionnement peuvent être déposés sans consentement préalable (art. 5§3 directive ePrivacy).
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
