'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Dumbbell,
  Play,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkoutView() {
  const {
    activeUser,
    currentWorkoutProfile,
    updateWorkoutProfile,
    biometrics,
    addBiometricLog,
    openWorkoutPlayer,
    triggerHaptic,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [weightInput, setWeightInput] = useState(String(currentWorkoutProfile?.weightKg || ''));
  const [heightInput, setHeightInput] = useState(String(currentWorkoutProfile?.heightCm || ''));
  const [daysPerWeek, setDaysPerWeek] = useState(currentWorkoutProfile?.daysPerWeek || 3);
  const [durationMin, setDurationMin] = useState(currentWorkoutProfile?.durationPerSessionMin || 30);
  const [equipmentList, setEquipmentList] = useState<string[]>(currentWorkoutProfile?.equipment || ['mancuernas', 'piso']);
  const [newWeightLog, setNewWeightLog] = useState('');

  const [generatedRoutine, setGeneratedRoutine] = useState<Array<{
    name: string;
    target: string;
    sets: number;
    reps: string;
    equipment: string;
  }> | null>(null);

  const toggleEquipment = (eq: string) => {
    triggerHaptic(20);
    setEquipmentList((prev) =>
      prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]
    );
  };

  const handleSaveProfile = () => {
    triggerHaptic(30);
    updateWorkoutProfile({
      weightKg: parseFloat(weightInput) || currentWorkoutProfile.weightKg,
      heightCm: parseFloat(heightInput) || currentWorkoutProfile.heightCm,
      daysPerWeek,
      durationPerSessionMin: durationMin,
      equipment: equipmentList,
    });
    setIsEditingProfile(false);
  };

  const handleAddWeight = () => {
    const val = parseFloat(newWeightLog);
    if (isNaN(val) || val <= 0) return;
    addBiometricLog(val);
    setNewWeightLog('');
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#003049', '#f67f00', '#fcbf48', '#ebe2b7'],
    });
  };

  const handleGenerateTodayRoutine = () => {
    triggerHaptic([40, 50, 70]);
    const hasDumbbells = equipmentList.includes('mancuernas');
    const hasBox = equipmentList.includes('cajon');

    const exercises = [
      {
        name: hasDumbbells ? 'Press de Banca Plano con Mancuernas' : 'Flexiones Estrictas en Piso',
        target: 'Pecho & Tríceps',
        sets: 4,
        reps: '10-12 reps',
        equipment: hasDumbbells ? 'Mancuernas' : 'Piso',
      },
      {
        name: hasBox ? 'Subidas al Cajón con Peso' : 'Zancadas Dinámicas Caminando',
        target: 'Cuádriceps & Glúteos',
        sets: 4,
        reps: '12 por pierna',
        equipment: hasBox ? 'Cajón' : 'Piso',
      },
      {
        name: hasDumbbells ? 'Remo con Mancuerna a una Mano' : 'Remo Invertido / Flexiones Escapulares',
        target: 'Espalda & Dorsales',
        sets: 4,
        reps: '12 reps',
        equipment: hasDumbbells ? 'Mancuernas' : 'Piso',
      },
      {
        name: 'Elevaciones Laterales Estrictas',
        target: 'Deltoides Medios',
        sets: 3,
        reps: '15 reps',
        equipment: hasDumbbells ? 'Mancuernas' : 'Piso',
      },
      {
        name: 'Plancha Abdominal Isométrica',
        target: 'Core & Abdomen',
        sets: 3,
        reps: '45 seg',
        equipment: 'Piso',
      },
    ];

    setGeneratedRoutine(exercises);
  };

  const sortedBiometrics = [...biometrics].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const minWeight = Math.min(...sortedBiometrics.map((b) => b.weightKg), 50);
  const maxWeight = Math.max(...sortedBiometrics.map((b) => b.weightKg), 85);
  const range = maxWeight - minWeight || 1;

  const svgWidth = 320;
  const svgHeight = 100;
  const points = sortedBiometrics.map((item, idx) => {
    const x = (idx / (sortedBiometrics.length - 1 || 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 20 - ((item.weightKg - minWeight) / range) * (svgHeight - 40);
    return `${x},${y}`;
  }).join(' ');

  const currentWeight = sortedBiometrics[sortedBiometrics.length - 1]?.weightKg || currentWorkoutProfile?.weightKg || 0;
  const initialWeight = sortedBiometrics[0]?.weightKg || currentWeight;
  const weightDiff = Math.round((currentWeight - initialWeight) * 10) / 10;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[color:var(--accent-warm)] uppercase tracking-wider block">
            Perfil de {activeUser.displayName}
          </span>
          <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[color:var(--accent-warm)]" />
            Salud & Entrenamiento
          </h1>
        </div>

        <button
          onClick={() => {
            triggerHaptic(20);
            setIsEditingProfile(!isEditingProfile);
          }}
          className="p-2.5 rounded-[var(--radius-card)] flat-card text-neutral-300 hover:text-white transition-colors touch-target-lg flex items-center justify-center"
          title="Editar perfil de entrenamiento"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* ONBOARDING ESTÁTICO / EDICIÓN DE PARÁMETROS (Flat)       */}
      {/* ========================================================= */}
      {isEditingProfile && (
        <div className="p-5 rounded-[var(--radius-card)] flat-card space-y-4 animate-sheet-up">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[color:var(--accent-warm)]" />
            Configuración de Biometría & Equipo
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 mb-1 block font-bold">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 mb-1 block font-bold">Altura (cm)</label>
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
              />
            </div>
          </div>

          {/* Inventario de equipo con Toggles */}
          <div>
            <label className="text-[11px] text-neutral-400 mb-1.5 block font-bold">
              Inventario de Equipo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'mancuernas', label: 'Mancuernas' },
                { key: 'piso', label: 'Piso' },
                { key: 'cajon', label: 'Cajón' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleEquipment(item.key)}
                  className={`py-2.5 px-3 rounded-[var(--radius-card)] text-xs font-bold border transition-all touch-target-lg ${
                    equipmentList.includes(item.key)
                      ? 'bg-[#003049] border-[#003049] text-[#ebe2b7]'
                      : 'bg-[#181818] border-[#333333] text-neutral-400'
                  }`}
                >
                  [{item.label}]
                </button>
              ))}
            </div>
          </div>

          {/* Variables de Entrenamiento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 mb-1 block font-bold">Días / Semana</label>
              <select
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-[#181818]">
                    {n} días
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 mb-1 block font-bold">Duración / Sesión</label>
              <select
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
              >
                {[30, 40, 45, 50, 60].map((m) => (
                  <option key={m} value={m} className="bg-[#181818]">
                    {m} minutos
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="flex-1 py-3 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs font-bold text-neutral-300 touch-target-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 py-3 rounded-[var(--radius-card)] bg-[#003049] text-xs font-bold text-[#ebe2b7] touch-target-lg border border-[#003049]"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA DIARIA: BIOMETRÍA & GRÁFICO (Visualización de datos) */}
      {/* ========================================================= */}
      <div className="p-5 rounded-[var(--radius-card)] flat-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Evolución de Peso
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{currentWeight} kg</span>
              <span className="text-xs font-bold text-[color:var(--accent-warm)]">
                {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
              </span>
            </div>
          </div>

          {/* Quick weight logger */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.1"
              value={newWeightLog}
              onChange={(e) => setNewWeightLog(e.target.value)}
              placeholder="Peso kg"
              className="w-24 px-3 py-2 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white placeholder-neutral-500"
            />
            <button
              onClick={handleAddWeight}
              className="px-3.5 py-2 rounded-[var(--radius-card)] bg-[#003049] text-[#ebe2b7] font-bold text-xs touch-target-lg"
            >
              Log
            </button>
          </div>
        </div>

        {/* Minimalist SVG Line Chart (Visualización de datos: #fcbf48 / #f67f00) */}
        <div className="w-full overflow-hidden pt-2">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24">
            <polyline
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {sortedBiometrics.map((item, idx) => {
              const x = (idx / (sortedBiometrics.length - 1 || 1)) * (svgWidth - 40) + 20;
              const y = svgHeight - 20 - ((item.weightKg - minWeight) / range) * (svgHeight - 40);
              return (
                <circle
                  key={item.id}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#181818"
                  stroke="#f67f00"
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>
          <div className="flex justify-between text-[10px] text-neutral-500 px-2 mt-1 font-bold">
            <span>{sortedBiometrics[0]?.date}</span>
            <span>{sortedBiometrics[sortedBiometrics.length - 1]?.date}</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTÓN MASIVO CENTRAL: "GENERAR RUTINA DE HOY"            */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <button
          id="btn-generate-routine"
          onClick={handleGenerateTodayRoutine}
          className="w-full py-4 rounded-[var(--radius-card)] bg-[#003049] hover:bg-[#002538] text-[#ebe2b7] font-black text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 touch-target-xl border border-[#003049]"
        >
          <Sparkles className="w-5 h-5 text-[color:var(--accent-warm)]" />
          Generar Rutina de Hoy
        </button>

        {/* Workout Player Launch Banner (Abre el modo Neumórfico) */}
        <motion.div
          role="button"
          tabIndex={0}
          layoutId="shared-workout-player"
          transition={{ duration: 0.3 }}
          onClick={openWorkoutPlayer}
          className="p-4 rounded-[var(--radius-card)] flat-card hover:border-[color:var(--accent-warm)]/40 cursor-pointer flex items-center justify-between active:scale-[0.99] transition-all group touch-target-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[var(--radius-card)] bg-[#003049] text-[#ebe2b7] flex items-center justify-center font-bold">
              <Play className="w-5 h-5 fill-[#ebe2b7] ml-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:underline">
                Iniciar Workout Player Companion
              </h4>
              <p className="text-xs text-neutral-400">
                Master Timer ({currentWorkoutProfile.durationPerSessionMin} min) & Controles Neumórficos
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </div>

      {/* Tarjetas horizontales de ejercicios generados */}
      {generatedRoutine && (
        <div className="space-y-3 pt-2 animate-sheet-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Ejercicios Programados para Hoy ({generatedRoutine.length})
            </span>
          </div>

          <div className="space-y-2">
            {generatedRoutine.map((exercise, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[var(--radius-card)] flat-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] flex items-center justify-center font-bold text-xs text-[color:var(--accent-warm)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{exercise.name}</h5>
                    <p className="text-[10px] text-neutral-400 font-bold">
                      {exercise.target} • [{exercise.equipment}]
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#ebe2b7] block">
                    {exercise.sets} series
                  </span>
                  <span className="text-[10px] text-[color:var(--accent-warm)] font-black">
                    {exercise.reps}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
