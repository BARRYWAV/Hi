'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Play, Pause, RotateCcw, Check, X, Clock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeTimerModal() {
  const {
    activePracticeHobby,
    closePracticeTimer,
    addPracticeTime,
    triggerHaptic,
  } = useApp();

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when hobby changes
  useEffect(() => {
    if (activePracticeHobby) {
      setSeconds(0);
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setSeconds(0);
    }
  }, [activePracticeHobby]);

  // Stopwatch interval
  useEffect(() => {
    if (isRunning && activePracticeHobby) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, activePracticeHobby]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggle = () => {
    triggerHaptic(25);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    triggerHaptic(20);
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSaveAndClose = () => {
    if (!activePracticeHobby) return;
    triggerHaptic([30, 50, 70]);
    const minutesToAdd = Math.max(1, Math.round(seconds / 60));
    addPracticeTime(activePracticeHobby.id, minutesToAdd);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#d62725', '#f67f00', '#fcbf48', '#ebe2b7'],
    });
    closePracticeTimer();
  };

  return (
    <AnimatePresence>
      {activePracticeHobby && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="practice-timer-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            layoutId={`shared-practice-timer-${activePracticeHobby.id}`}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xl p-6 space-y-6 relative overflow-hidden"
          >
            {/* Subtle accent glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#d62725]/20 blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d62725]/15 text-[#d62725] dark:text-[#fcbf48] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Temporizador de Práctica
                  </span>
                  <h3 id="practice-timer-title" className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[200px]">
                    {activePracticeHobby.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  triggerHaptic(20);
                  closePracticeTimer();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stopwatch display */}
            <div className="text-center py-4 bg-[var(--bg-base)]/60 rounded-2xl border border-[var(--border-subtle)]">
              <span className="text-5xl font-black tracking-tight font-mono text-[var(--text-primary)] drop-shadow-sm">
                {formatTime(seconds)}
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-[#f67f00]">
                <Flame className="w-3.5 h-3.5 fill-[#f67f00]" />
                <span>
                  {activePracticeHobby.practiceMinutesToday > 0
                    ? `${activePracticeHobby.practiceMinutesToday} min acumulados hoy`
                    : 'Sesión activa de enfoque'}
                </span>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center justify-center gap-4 relative z-10">
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-[var(--text-primary)] flex items-center justify-center transition-transform active:scale-90"
                title="Reiniciar cronómetro"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handleToggle}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                  isRunning ? 'bg-[#f67f00]' : 'bg-[#d62725]'
                }`}
                title={isRunning ? 'Pausar' : 'Iniciar'}
              >
                {isRunning ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
              </button>

              <button
                onClick={handleSaveAndClose}
                className="w-12 h-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center transition-transform active:scale-90 shadow-md"
                title="Guardar minutos y cerrar"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Footer info */}
            <p className="text-[11px] text-center text-neutral-400">
              Toca el botón verde para registrar el tiempo invertido en este hobby hoy.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
