'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Banknote,
  UtensilsCrossed,
  Dumbbell,
  Music,
  HeartHandshake,
  ChevronLeft,
} from 'lucide-react';
import FinancesView from '@/components/finances/FinancesView';
import MealsView from '@/components/meals/MealsView';
import WorkoutView from '@/components/workout/WorkoutView';
import CoupleSpaceView from '@/components/lifestyle/CoupleSpaceView';
import HobbiesManagerView from '@/components/lifestyle/HobbiesManagerView';
import PracticeTimerModal from '@/components/lifestyle/PracticeTimerModal';

export type AppSubView = 'finances' | 'meals' | 'workout' | 'couple' | 'hobbies' | null;

interface AppsViewProps {
  initialApp?: AppSubView;
}

export default function AppsView({ initialApp = null }: AppsViewProps) {
  const { setCurrentTab, triggerHaptic, setLifestyleSubView } = useApp();
  const [selectedApp, setSelectedApp] = useState<AppSubView>(initialApp);

  useEffect(() => {
    if (initialApp) {
      setSelectedApp(initialApp);
    }
  }, [initialApp]);

  const handleOpenApp = (appId: AppSubView) => {
    triggerHaptic(25);
    if (appId === 'couple' || appId === 'hobbies') {
      setLifestyleSubView(appId);
    }
    setSelectedApp(appId);
  };

  const handleBackToGrid = () => {
    triggerHaptic(20);
    setSelectedApp(null);
    setCurrentTab('apps');
  };

  // Cuando una app está seleccionada
  if (selectedApp) {
    return (
      <div className="w-full space-y-4 pt-3 pb-20 animate-fade-in">
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleBackToGrid}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-neutral-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a Apps
          </button>
        </div>

        <div>
          {selectedApp === 'finances' && <FinancesView />}
          {selectedApp === 'meals' && <MealsView />}
          {selectedApp === 'workout' && <WorkoutView />}
          {selectedApp === 'couple' && <CoupleSpaceView />}
          {selectedApp === 'hobbies' && <HobbiesManagerView />}
        </div>

        <PracticeTimerModal />
      </div>
    );
  }

  // Vista principal: Bento Mosaico con Liquid Glass (.mk-card .mk-select-card) e iconos de Lucide
  return (
    <div className="space-y-3.5 pb-24 max-w-xl mx-auto pt-11 sm:pt-14">
      {/* ========================================================= */}
      {/* TARJETA 1 (Superior, ancha): FINANZAS                     */}
      {/* ========================================================= */}
      <div
        id="card-bento-finances"
        role="button"
        tabIndex={0}
        aria-label="Finanzas"
        onClick={() => handleOpenApp('finances')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenApp('finances')}
        className="mk-card mk-select-card p-6 sm:p-8 flex items-center justify-center cursor-pointer min-h-[130px] sm:min-h-[150px] group relative overflow-hidden"
        title="Finanzas"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/30 dark:bg-white/10 blur-2xl"
        />
        <Banknote
          className="mk-select-fg w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.8}
        />
      </div>

      {/* ========================================================= */}
      {/* CUADRÍCULA 2x2 DE TARJETAS CUADRADAS                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* TARJETA 2: COMIDAS Y SÚPER */}
        <div
          id="card-bento-meals"
          role="button"
          tabIndex={0}
          aria-label="Comidas y Súper"
          onClick={() => handleOpenApp('meals')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenApp('meals')}
          className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
          title="Comidas y Súper"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/25 dark:bg-white/10 blur-2xl"
          />
          <UtensilsCrossed
            className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </div>

        {/* TARJETA 3: EJERCICIO Y RUTINAS */}
        <div
          id="card-bento-workout"
          role="button"
          tabIndex={0}
          aria-label="Ejercicio y Rutinas"
          onClick={() => handleOpenApp('workout')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenApp('workout')}
          className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
          title="Ejercicio y Rutinas"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/25 dark:bg-white/10 blur-2xl"
          />
          <Dumbbell
            className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </div>

        {/* TARJETA 4: HOBBIES Y PROYECTOS */}
        <div
          id="card-bento-hobbies"
          role="button"
          tabIndex={0}
          aria-label="Hobbies"
          onClick={() => handleOpenApp('hobbies')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenApp('hobbies')}
          className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
          title="Hobbies y Proyectos"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/25 dark:bg-white/10 blur-2xl"
          />
          <Music
            className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </div>

        {/* TARJETA 5: NUESTRO ESPACIO (PAREJA) */}
        <div
          id="card-bento-couple"
          role="button"
          tabIndex={0}
          aria-label="Pareja - Nuestro Espacio"
          onClick={() => handleOpenApp('couple')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenApp('couple')}
          className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
          title="Nuestro Espacio de Pareja"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/25 dark:bg-white/10 blur-2xl"
          />
          <HeartHandshake
            className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </div>
      </div>

      <PracticeTimerModal />
    </div>
  );
}
