'use client';

import React from 'react';
import { X, type LucideIcon } from 'lucide-react';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';

/**
 * Isla flotante centrada con el mismo formato que el menú de Captura Rápida.
 * Se usa para los formularios de Finanzas (nuevo banco, crear ahorro, aportar).
 */
export default function FormSheet({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <LiquidGlassSheet isOpen={isOpen} onClose={onClose} maxWidth="max-w-[370px]" isCenter={true}>
      <div className="flex items-center justify-between px-4 pb-2 pt-3 border-b border-black/5 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon className="w-4 h-4 text-[color:var(--accent-warm)]" strokeWidth={2.3} />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-warm)] shadow-[0_0_8px_var(--accent-warm)]" />
          )}
          <h2 className="text-sm font-extrabold text-[var(--mk-ink)] tracking-tight">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 flex items-center justify-center text-neutral-500 hover:text-[var(--mk-ink)] transition-all"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
      <div className="px-4 pb-4 pt-3 overflow-y-auto no-scrollbar space-y-3">{children}</div>
    </LiquidGlassSheet>
  );
}

/** Etiqueta + campo con el estilo de la Captura Rápida */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold text-neutral-400 mb-1 block uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  'w-full h-10 px-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-sm text-[var(--mk-ink)] placeholder-neutral-400 focus:outline-none focus:border-[var(--accent-warm)]';

export function SubmitButton({
  children,
  disabled,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-11 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-extrabold text-xs shadow-md active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
    >
      {children}
    </button>
  );
}

