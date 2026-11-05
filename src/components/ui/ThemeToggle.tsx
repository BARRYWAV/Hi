'use client';

import React from 'react';
import { Switch } from 'glisse';
import { useApp } from '@/context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

/**
 * Interruptor On / Off Sol & Luna con el componente `Switch` de Glisse (https://glisse.kelvinzhang.ca/).
 * Al mantener presionado o arrastrar, el pulgar se eleva como lente óptico refractivo real.
 */
export default function ThemeToggle({
  variant = 'compact',
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme, triggerHaptic } = useApp();
  const isLight = theme === 'light';
  const isDark = !isLight;

  const handleSwitchChange = (nextDark: boolean) => {
    if (nextDark !== isDark) {
      triggerHaptic([35]);
      toggleTheme();
    }
  };

  const control = (
    <div
      className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full"
      title={isLight ? 'Cambiar a Noche' : 'Cambiar a Día'}
    >
      <button
        type="button"
        onClick={() => {
          if (!isLight) {
            triggerHaptic([35]);
            toggleTheme();
          }
        }}
        aria-label="Modo Día"
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          isLight
            ? 'text-[#d62725] scale-105'
            : 'text-[var(--mk-muted)] opacity-55 hover:opacity-90'
        }`}
      >
        <Sun className="w-3.5 h-3.5" strokeWidth={2.4} />
      </button>

      <Switch
        checked={isDark}
        onCheckedChange={handleSwitchChange}
        aria-label="Alternar entre formato día y formato noche"
        style={
          {
            '--lg-scale': 0.34,
            '--lg-on': '#fcbf48',
            '--lg-track': isLight ? 'rgba(214, 39, 37, 0.24)' : 'rgba(235, 235, 245, 0.3)',
          } as React.CSSProperties
        }
      />

      <button
        type="button"
        onClick={() => {
          if (isLight) {
            triggerHaptic([35]);
            toggleTheme();
          }
        }}
        aria-label="Modo Noche"
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          isDark
            ? 'text-[#fcbf48] scale-105'
            : 'text-[var(--mk-muted)] opacity-55 hover:opacity-90'
        }`}
      >
        <Moon className="w-3.5 h-3.5" strokeWidth={2.4} />
      </button>
    </div>
  );

  if (variant === 'expanded') {
    return (
      <div
        className={`inline-flex w-fit items-center justify-between gap-2.5 pl-3 pr-1.5 py-1 rounded-[var(--radius-card)] flat-card ${className}`}
      >
        <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
          {isLight ? 'Día' : 'Noche'}
        </span>
        {control}
      </div>
    );
  }

  return <div className={`inline-flex items-center ${className}`}>{control}</div>;
}
