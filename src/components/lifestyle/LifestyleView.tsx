'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import LifestyleHubView from './LifestyleHubView';
import CoupleSpaceView from './CoupleSpaceView';
import HobbiesManagerView from './HobbiesManagerView';
import MealsView from '@/components/meals/MealsView';
import WorkoutView from '@/components/workout/WorkoutView';
import PracticeTimerModal from './PracticeTimerModal';
import { ChevronLeft } from 'lucide-react';

export default function LifestyleView() {
  const { lifestyleSubView, setLifestyleSubView, triggerHaptic } = useApp();

  return (
    <div className="w-full">
      {lifestyleSubView === 'hub' && <LifestyleHubView />}

      {lifestyleSubView === 'couple' && <CoupleSpaceView />}

      {lifestyleSubView === 'hobbies' && <HobbiesManagerView />}

      {lifestyleSubView === 'meals' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              triggerHaptic(20);
              setLifestyleSubView('hub');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-neutral-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a Estilo de Vida
          </button>
          <MealsView />
        </div>
      )}

      {lifestyleSubView === 'workout' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              triggerHaptic(20);
              setLifestyleSubView('hub');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-neutral-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a Estilo de Vida
          </button>
          <WorkoutView />
        </div>
      )}

      {/* Floating Practice Timer Modal */}
      <PracticeTimerModal />
    </div>
  );
}
