'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  ChevronLeft,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  Flame,
  Trash2,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import NewHobbyModal from './NewHobbyModal';

export default function HobbiesManagerView() {
  const {
    setLifestyleSubView,
    hobbies,
    toggleHobbyMilestone,
    deleteHobbyProject,
    openPracticeTimer,
    triggerHaptic,
  } = useApp();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleMilestoneCheck = (hobbyId: string, milestoneId: string, willCompleteAll: boolean) => {
    triggerHaptic(25);
    toggleHobbyMilestone(hobbyId, milestoneId);
    if (willCompleteAll) {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d62725', '#f67f00', '#fcbf48', '#ebe2b7'],
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Navigation & Header */}
      <div className="space-y-3">
        <button
          onClick={() => {
            triggerHaptic(20);
            setLifestyleSubView('hub');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-neutral-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Estilo de Vida
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d62725] text-white flex items-center justify-center shadow-lg shadow-[#d62725]/30">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#d62725] dark:text-[#fcbf48] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gestor de Metas & Hobbies
              </span>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Mis Pasiones & Proyectos
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HEADER: BOTÓN MASIVO "NUEVO PROYECTO / HOBBY"              */}
      {/* ========================================================= */}
      <motion.div
        id="btn-new-hobby-massive"
        layoutId="shared-new-hobby-modal"
        transition={{ duration: 0.3 }}
        role="button"
        tabIndex={0}
        onClick={() => {
          triggerHaptic(30);
          setIsNewModalOpen(true);
        }}
        className="w-full py-5 rounded-[var(--radius-card)] bg-gradient-to-r from-[#d62725] via-[#f67f00] to-[#d62725] bg-[length:200%_auto] hover:bg-right text-white font-black text-base shadow-xl shadow-[#d62725]/25 flex items-center justify-center gap-3 active:scale-[0.99] transition-all touch-target-xl border border-white/20 cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
        <span>Nuevo Proyecto / Hobby</span>
      </motion.div>

      {/* ========================================================= */}
      {/* VISTA PRINCIPAL: TARJETAS GRANDES HORIZONTALES            */}
      {/* ========================================================= */}
      <div className="space-y-5">
        {hobbies.length === 0 ? (
          <div className="p-8 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-dashed border-[var(--border-subtle)] text-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-base)] flex items-center justify-center mx-auto text-[#d62725] dark:text-[#fcbf48]">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              No tienes proyectos activos aún
            </p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Toca el botón &quot;Nuevo Proyecto / Hobby&quot; para registrar tu primera pasión, definir hitos y cronometrar tus sesiones de práctica.
            </p>
          </div>
        ) : (
          hobbies.map((hobby) => {
          const totalMilestones = hobby.milestones.length;
          const completedCount = hobby.milestones.filter((m) => m.completed).length;
          const progressPercent =
            totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
          const isComplete = progressPercent === 100;

          return (
            <div
              key={hobby.id}
              className="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-md relative overflow-hidden space-y-5 hover:border-[#d62725]/40 transition-all group"
            >
              {/* Subtle top accent bar */}
              <div
                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d62725] to-[#f67f00]"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Card Header: Title, Category, Deadline & Practice Timer Button in the corner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {hobby.category && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d62725]/10 text-[#d62725] dark:text-[#fcbf48] text-[10px] font-bold uppercase tracking-wider">
                        {hobby.category}
                      </span>
                    )}
                    {hobby.deadline && (
                      <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#f67f00]" />
                        Límite: {hobby.deadline}
                      </span>
                    )}
                    {hobby.practiceMinutesToday > 0 && (
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {hobby.practiceMinutesToday} min hoy
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
                    {hobby.title}
                  </h3>
                </div>

                {/* Corner: Practice Timer Button + Delete button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => deleteHobbyProject(hobby.id)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Botón de "Temporizador de Práctica" en la esquina (<motion.div> vinculado al modal) */}
                  <motion.div
                    layoutId={`shared-practice-timer-${hobby.id}`}
                    transition={{ duration: 0.3 }}
                    role="button"
                    tabIndex={0}
                    onClick={() => openPracticeTimer(hobby)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#003049] to-[#002538] hover:to-[#001d2d] text-[#ebe2b7] font-bold text-xs flex items-center gap-2 border border-[#003049] shadow-md transition-all active:scale-95 hover:shadow-lg cursor-pointer"
                    title="Iniciar cronómetro de práctica de hoy"
                  >
                    <Clock className="w-4 h-4 text-[#f67f00]" />
                    <span>Temporizador de Práctica</span>
                  </motion.div>
                </div>
              </div>

              {/* Automatic Progress Bar */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-400">
                    Progreso: {completedCount} de {totalMilestones} hitos completados
                  </span>
                  <span
                    className={`font-black ${
                      isComplete ? 'text-emerald-500' : 'text-[#d62725] dark:text-[#fcbf48]'
                    }`}
                  >
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-[#d62725] via-[#f67f00] to-[#fcbf48]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklists inside the card */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Hitos del Proyecto:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hobby.milestones.map((m) => {
                    const isNextToCompleteAll =
                      !m.completed && completedCount + 1 === totalMilestones;

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleMilestoneCheck(hobby.id, m.id, isNextToCompleteAll)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-neutral-400 dark:text-neutral-500'
                            : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#d62725]/40'
                        }`}
                      >
                        <button type="button" className="shrink-0">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                        <span className={`truncate ${m.completed ? 'line-through opacity-70' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Creation Modal */}
      <NewHobbyModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
}
