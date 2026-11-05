'use client';

import React from 'react';
import { ChevronLeft, Plus, type LucideIcon } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  icon?: LucideIcon;
  onBack?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  addId?: string;
  children?: React.ReactNode; // controles extra antes del "+"
}

/** Cabecera estándar de los mockups: [icono] Título ............ [extras] (+) */
export default function ScreenHeader({
  title,
  icon: Icon,
  onBack,
  onAdd,
  addLabel = 'Agregar',
  addId,
  children,
}: ScreenHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="w-8 h-8 -ml-1 flex items-center justify-center text-[var(--mk-muted)] hover:text-[var(--mk-ink)] active:scale-90 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {Icon && <Icon className="w-5 h-5 text-[color:var(--accent-warm)] shrink-0" strokeWidth={2} />}
        <h1 className="text-[19px] font-extrabold tracking-tight text-[var(--mk-ink)] truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2.5">
        {children}
        {onAdd && (
          <button id={addId} type="button" onClick={onAdd} aria-label={addLabel} title={addLabel} className="mk-fab">
            <Plus className="w-5 h-5" strokeWidth={2.8} />
          </button>
        )}
      </div>
    </div>
  );
}
