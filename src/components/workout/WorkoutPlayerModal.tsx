'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { X, Play, Pause, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_EXERCISES = [
  { name: 'Press Militar con Mancuernas', sets: 4, reps: '10-12 reps', target: 'Hombros & Tríceps' },
  { name: 'Sentadilla Búlgara en Cajón', sets: 4, reps: '12 reps / pierna', target: 'Cuádriceps & Glúteo' },
  { name: 'Remo Unilateral con Mancuerna', sets: 4, reps: '12 reps', target: 'Dorsales' },
  { name: 'Flexiones Diamante en Piso', sets: 3, reps: '15 reps', target: 'Pecho & Tríceps' },
  { name: 'Plancha Abdominal Activa', sets: 3, reps: '45 seg', target: 'Core' },
];

export default function WorkoutPlayerModal() {
  const {
    isWorkoutPlayerOpen,
    closeWorkoutPlayer,
    currentWorkoutProfile,
    completeWorkout,
    triggerHaptic,
  } = useApp();

  const targetDurationMin = currentWorkoutProfile?.durationPerSessionMin || 45;
  const targetDurationSec = targetDurationMin * 60;

  // Master Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Interval Rest Timer states
  const [intervalRestSeconds, setIntervalRestSeconds] = useState<number | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

  // Exercise pagination
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Master timer ticker
  useEffect(() => {
    if (isWorkoutPlayerOpen && isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWorkoutPlayerOpen, isRunning]);

  // Interval rest ticker
  useEffect(() => {
    if (intervalRestSeconds !== null && intervalRestSeconds > 0) {
      restTimerRef.current = setInterval(() => {
        setIntervalRestSeconds((prev) => {
          if (prev === null || prev <= 1) {
            triggerHaptic([100, 60, 100]);
            setSelectedBubble(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [intervalRestSeconds]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isOvertime = elapsedSeconds > targetDurationSec;
  const progressRatio = Math.min(1, elapsedSeconds / targetDurationSec);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleStartRest = (seconds: number, label: string) => {
    triggerHaptic(50);
    setSelectedBubble(label);
    setIntervalRestSeconds(seconds);
  };

  const handleNextExercise = () => {
    triggerHaptic(30);
    if (currentSet < SAMPLE_EXERCISES[currentExerciseIndex].sets) {
      setCurrentSet((s) => s + 1);
      handleStartRest(60, '1m');
    } else if (currentExerciseIndex < SAMPLE_EXERCISES.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
      setCurrentSet(1);
      handleStartRest(90, '2m');
    }
  };

  const handleFinishWorkout = () => {
    triggerHaptic([80, 50, 120]);
    const actualMin = Math.max(1, Math.round(elapsedSeconds / 60));
    completeWorkout('Día de Fuerza & Resistencia', actualMin);
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#003049', '#f67f00', '#fcbf48', '#ebe2b7'],
    });
    closeWorkoutPlayer();
  };

  const currentExercise = SAMPLE_EXERCISES[currentExerciseIndex];

  return (
    <AnimatePresence>
      {isWorkoutPlayerOpen && (
        /* ========================================================= */
        /* CAPA 3: NEUMORPHISM (EXCLUSIVAMENTE EN EL WORKOUT PLAYER) */
        /* Controles táctiles extruidos e indentados sobre base dinámica */
        /* ========================================================= */
        <motion.div
          layoutId="shared-workout-player"
          transition={{ duration: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[var(--neu-bg)] text-[var(--text-primary)] flex flex-col justify-between p-6 overflow-hidden select-none transition-colors duration-200"
        >
      {/* Top Bar: Close and Routine Info */}
      <div className="flex items-center justify-between pt-safe">
        <div>
          <span className="text-xs uppercase tracking-widest text-[color:var(--accent-warm)] font-bold block">
            Workout Player • Modo Enfoque
          </span>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
            Día de Fuerza ({currentWorkoutProfile?.daysPerWeek || 3} días/sem)
          </h2>
        </div>
        <button
          onClick={closeWorkoutPlayer}
          className="w-11 h-11 rounded-full neu-raised hover:neu-pressed text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center touch-target-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Center Area: Distraction-free Exercise & Neumorphic Master Timer */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 space-y-6">
        {/* Exercise Massive Title */}
        <div className="text-center px-4 max-w-md">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] mb-2 border border-[var(--border-card)]">
            Ejercicio {currentExerciseIndex + 1} de {SAMPLE_EXERCISES.length} • {currentExercise.target}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            {currentExercise.name}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs font-black text-[#ebe2b7] bg-[#003049] px-3.5 py-1.5 rounded-[var(--radius-card)] border border-[#003049]">
              Serie {currentSet} de {currentExercise.sets}
            </span>
            <span className="text-xs font-black text-[color:var(--accent-warm)] bg-[var(--bg-surface)] px-3.5 py-1.5 rounded-[var(--radius-card)] border border-[var(--border-card)]">
              {currentExercise.reps}
            </span>
          </div>
        </div>

        {/* Master Timer: Neumorphic Circular Container */}
        <div className="relative flex items-center justify-center">
          {/* Neumorphic outer extruded frame */}
          <div className="w-60 h-60 rounded-full neu-circle-raised flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full neu-circle-inset flex items-center justify-center relative">
              <svg className="w-52 h-52 transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="#242424"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Visualización de Datos: Anillo de datos #fcbf48 / #f67f00 */}
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke={isOvertime ? '#f67f00' : 'var(--accent-warm)'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Time digits and status in center */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-mono font-black tracking-tighter text-[var(--text-primary)]">
                  {formatTime(elapsedSeconds)}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${
                    isOvertime
                      ? 'bg-[#f67f00]/20 text-[#f67f00] border border-[#f67f00]/30'
                      : 'text-[#ebe2b7] bg-[#003049]/40'
                  }`}
                >
                  {isOvertime ? 'Tiempo Extra' : `Meta: ${targetDurationMin} min`}
                </span>

                {/* Neumorphic Play/Pause Button */}
                <button
                  onClick={() => {
                    triggerHaptic(30);
                    setIsRunning(!isRunning);
                  }}
                  className={`mt-2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRunning ? 'neu-raised text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'neu-pressed text-[color:var(--accent-warm)]'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise control buttons (Neumorphism: Tactile series switch) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (currentExerciseIndex > 0) {
                triggerHaptic(20);
                setCurrentExerciseIndex((i) => i - 1);
                setCurrentSet(1);
              }
            }}
            disabled={currentExerciseIndex === 0}
            className="w-12 h-12 rounded-[var(--radius-card)] neu-raised hover:neu-pressed disabled:opacity-30 text-[var(--text-primary)] flex items-center justify-center touch-target-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextExercise}
            className="px-6 py-3.5 rounded-[var(--radius-card)] neu-raised hover:neu-pressed text-[#ebe2b7] font-black text-xs flex items-center gap-2 active:scale-95 transition-all touch-target-lg border border-white/5"
          >
            {currentSet < currentExercise.sets ? 'Siguiente Serie' : 'Siguiente Ejercicio'}
            <ChevronRight className="w-4 h-4 text-[color:var(--accent-warm)]" />
          </button>
        </div>
      </div>

      {/* Interval Rest Timer Overlay (Tactile alert) */}
      {intervalRestSeconds !== null && (
        <div className="absolute inset-x-6 top-20 bg-[var(--bg-surface)] border border-[color:var(--accent-warm)]/50 rounded-[var(--radius-card)] p-5 shadow-2xl flex items-center justify-between z-20 animate-sheet-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[var(--radius-card)] neu-circle-inset flex items-center justify-center">
              <span className="text-xl font-mono font-black text-[color:var(--accent-warm)]">
                {intervalRestSeconds}s
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Descanso Activo</h4>
              <p className="text-xs text-[var(--text-secondary)]">Respira hondo y recupera</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIntervalRestSeconds(null);
              setSelectedBubble(null);
            }}
            className="px-3.5 py-2 rounded-[var(--radius-card)] neu-raised text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] touch-target-lg"
          >
            Saltar
          </button>
        </div>
      )}

      {/* Bottom Area: Burbujas de Intervalo Neumórficas & Finalizar Entrenamiento */}
      <div className="space-y-4 pb-safe">
        {/* Burbujas de Intervalo: [ 1m ] [ 2m ] [ 3m ] [ 4m ] [ 5m ] (Táctiles extruidos/indentados) */}
        <div>
          <span className="text-xs text-[var(--text-secondary)] block mb-2 text-center font-bold uppercase tracking-wider">
            Temporizador de Descanso:
          </span>
          <div className="grid grid-cols-5 gap-2.5">
            {[
              { label: '1m', sec: 60 },
              { label: '2m', sec: 120 },
              { label: '3m', sec: 180 },
              { label: '4m', sec: 240 },
              { label: '5m', sec: 300 },
            ].map((bubble) => {
              const isSelected = selectedBubble === bubble.label;
              return (
                <button
                  key={bubble.label}
                  onClick={() => handleStartRest(bubble.sec, bubble.label)}
                  className={`py-3 rounded-[var(--radius-card)] font-black text-xs text-center transition-all touch-target-lg ${
                    isSelected
                      ? 'neu-bubble-active text-[color:var(--accent-warm)]'
                      : 'neu-bubble text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {bubble.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Finalize Workout Button (Ley de Fitts: Altura 56px, toque amplio) */}
        <button
          id="btn-finish-workout"
          onClick={handleFinishWorkout}
          className="w-full py-4 rounded-[var(--radius-card)] neu-raised hover:neu-pressed text-[var(--text-primary)] font-black text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 touch-target-xl border border-white/5"
        >
          <CheckCircle2 className="w-5 h-5 text-[#ebe2b7]" /> Finalizar Entrenamiento
        </button>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
