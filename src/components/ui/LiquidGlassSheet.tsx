'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FROSTED_GLASS_CONFIG,
  getOpticalGlassVars,
} from '@/components/ui/liquid-glass/presets';

interface LiquidGlassSheetProps {
  isOpen: boolean;
  onClose: () => void;
  layoutId?: string;
  maxWidth?: string;
  isCenter?: boolean;
  fullHeight?: boolean;
  children: React.ReactNode;
  className?: string;
  cornerRadius?: number;
  blurAmount?: number;
  refraction?: number;
  chromAberration?: number;
  edgeHighlight?: number;
}

/**
 * Capa 2: Liquid Glass Sheet (Calibrada con FROSTED_GLASS_CONFIG / SMOKED_GLASS_CONFIG).
 * Soporta Shared Element Transitions con framer-motion (<AnimatePresence> + <motion.div layoutId>).
 */
export default function LiquidGlassSheet({
  isOpen,
  onClose,
  layoutId,
  maxWidth = 'max-w-md',
  isCenter = true,
  fullHeight = false,
  children,
  className = '',
  cornerRadius = 28,
  blurAmount = FROSTED_GLASS_CONFIG.blurAmount ?? 0.45,
  refraction = FROSTED_GLASS_CONFIG.refraction ?? 0.65,
  chromAberration = FROSTED_GLASS_CONFIG.chromAberration ?? 0.03,
  edgeHighlight = FROSTED_GLASS_CONFIG.edgeHighlight ?? 0.08,
}: LiquidGlassSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.setAttribute('data-sheet-open', 'true');
    window.dispatchEvent(new CustomEvent('app-modal-change', { detail: { isOpen: true } }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.removeAttribute('data-sheet-open');
      window.dispatchEvent(new CustomEvent('app-modal-change', { detail: { isOpen: false } }));
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const sheetConfig = {
    ...FROSTED_GLASS_CONFIG,
    cornerRadius,
    blurAmount,
    refraction,
    chromAberration,
    edgeHighlight,
  };

  const opticalVars = getOpticalGlassVars(sheetConfig);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-center={isCenter ? 'true' : 'false'}
          data-fullheight={fullHeight ? 'true' : 'false'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        >
          {/* Scrim óptico: refracción ambiental sin negro opaco */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-900/35 dark:bg-black/55 backdrop-blur-[6px] cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Isla flotante centrada con animación rápida y limpia */}
          <motion.div
            layoutId={layoutId}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            data-liquid-glass="true"
            data-config={JSON.stringify(sheetConfig)}
            style={opticalVars}
            className={`relative w-full ${maxWidth} liquid-glass-sheet bg-[var(--lg-frosted-bg)] backdrop-blur-3xl saturate-[190%] border border-[var(--mk-border)] shadow-[var(--mk-shadow)] z-10 flex flex-col overflow-hidden rounded-[28px] max-h-[82dvh] ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
