"use client";

import React from "react";
import { Award, Users, BookOpen } from "lucide-react";
import { Reveal, INSTRUCTORS } from "../shared";

export default function AboutPage() {
  return (
    <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
            Formateurs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6">
            Des cours créés par des experts praticiens
          </h1>
          <p className="text-[#6B7280] font-medium leading-relaxed italic">
            Nous n'embauchons pas de théoriciens. Tous nos formateurs sont des professionnels seniors actuellement en poste dans les plus belles entreprises technologiques européennes.
          </p>
        </div>
      </Reveal>

      {/* Instructors grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {INSTRUCTORS.map((ins, i) => (
          <Reveal key={ins.name} delay={i * 0.1}>
            <div className="p-10 rounded-[2.5rem] bg-white border border-[#E5E7EB] shadow-sm hover:border-[#6366F1]/20 hover:shadow-[0_10px_30px_rgba(99,102,241,0.04)] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#6366F1] font-extrabold text-xl flex items-center justify-center mb-8">
                  {ins.name.split(" ").map(w => w[0]).join("")}
                </div>
                <h3 className="font-extrabold text-xl text-[#1E1B4B] mb-1">
                  {ins.name}
                </h3>
                <p className="text-xs font-semibold text-[#6366F1] mb-6">
                  {ins.specialty}
                </p>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-8">
                  {ins.bio}
                </p>
              </div>

              <div className="border-t border-[#EEF2FF] pt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-black text-[#1E1B4B]">
                    {ins.students}
                  </div>
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold">
                    Élèves
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-[#1E1B4B]">
                    {ins.courses}
                  </div>
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold">
                    Cours
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-[#1E1B4B]">
                    {ins.rating}★
                  </div>
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold">
                    Note
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-[#EEF2FF] to-white border border-[#E0E7FF] grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#1E1B4B] mb-2">
                Communauté d'entraide
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Posez vos questions à tout moment sur nos serveurs d'entraide et obtenez des réponses de formateurs et de pairs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#1E1B4B] mb-2">
                Contenu mis à jour
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Le web évolue vite. Nos formations sont constamment mises à jour pour vous éviter d'apprendre des technos obsolètes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#1E1B4B] mb-2">
                Certifications réelles
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Chaque parcours se conclut par un projet d'examen évalué à la main, validant votre certification professionnelle.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
