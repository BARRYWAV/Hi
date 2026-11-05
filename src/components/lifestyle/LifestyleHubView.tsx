'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HeartPulse, HeartHandshake, UtensilsCrossed, Music, Dumbbell } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';

type HubView = 'couple' | 'meals' | 'hobbies' | 'workout';

export default function LifestyleHubView() {
  const { setLifestyleSubView, openCaptureSheet, triggerHaptic } = useApp();
  const [selected, setSelected] = React.useState<HubView | null>(null);

  const handleNavigate = (view: HubView) => {
    triggerHaptic(25);
    setSelected(view);
    setLifestyleSubView(view);
  };

  return (
    <div className="space-y-4 pb-24 max-w-xl mx-auto">
      {/* Cabecera con título "Estilo de Vida" y botón '+' según mockup */}
      <ScreenHeader
        title="Estilo de Vida"
        icon={HeartPulse}
        onAdd={() => openCaptureSheet('habits')}
        addLabel="Captura rápida"
        addId="btn-lifestyle-add"
      />

      {/* ========================================================= */}
      {/* BENTO BOX CON 4 TARJETAS DISPARADORAS (<motion.div>)       */}
      {/* ========================================================= */}
      <div className="space-y-3">
        {/* ========================================================= */}
        {/* TARJETA 1 (Superior, ancha): PAREJA (Nuestro Espacio)     */}
        {/* ========================================================= */}
        <div
          id="card-bento-couple"
          data-selected={selected === 'couple'}
          role="button"
          tabIndex={0}
          aria-label="Pareja - Nuestro Espacio"
          onClick={() => handleNavigate('couple')}
          className="mk-card mk-select-card p-6 sm:p-8 flex items-center justify-center cursor-pointer min-h-[140px] sm:min-h-[160px] group relative overflow-hidden"
          title="Nuestro Espacio de Pareja"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/30 dark:bg-white/10 blur-2xl"
          />
          <HeartHandshake className="mk-select-fg w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
        </div>

        {/* ========================================================= */}
        {/* FILA INTERMEDIA: 2 TARJETAS CUADRADAS                     */}
        {/* Izquierda: Comidas | Derecha: Hobbies                     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 gap-3">
          {/* TARJETA 2: COMIDAS (Planeador y Súper) */}
          <div
            id="card-bento-meals"
            data-selected={selected === 'meals'}
            role="button"
            tabIndex={0}
            aria-label="Comidas"
            onClick={() => handleNavigate('meals')}
            className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
            title="Comidas: Planeador y Súper"
          >
            <UtensilsCrossed className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
          </div>

          {/* TARJETA 3: HOBBIES (Proyectos y Metas) */}
          <div
            id="card-bento-hobbies"
            data-selected={selected === 'hobbies'}
            role="button"
            tabIndex={0}
            aria-label="Hobbies"
            onClick={() => handleNavigate('hobbies')}
            className="mk-card mk-select-card p-6 flex items-center justify-center cursor-pointer aspect-square group relative overflow-hidden"
            title="Hobbies: Proyectos y Metas"
          >
            <Music className="mk-select-fg w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* TARJETA 4 (Inferior, ancha): EJERCICIO (Workout y Rutinas) */}
        {/* ========================================================= */}
        <div
          id="card-bento-workout"
          data-selected={selected === 'workout'}
          role="button"
          tabIndex={0}
          aria-label="Ejercicio - Workout y Rutinas"
          onClick={() => handleNavigate('workout')}
          className="mk-card mk-select-card p-6 sm:p-8 flex items-center justify-center cursor-pointer min-h-[140px] sm:min-h-[160px] group relative overflow-hidden"
          title="Ejercicio: Workout y Rutinas"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/30 dark:bg-white/10 blur-2xl"
          />
          <Dumbbell className="mk-select-fg w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
