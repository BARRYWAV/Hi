"use client";

import React from "react";

export interface LiquidProgressProps {
  /** Valor de 0 a 100 */
  value: number;
  /** Altura de la barra */
  size?: "xs" | "sm" | "md" | "lg";
  /** Color o variante del líquido interior */
  tone?: "accent" | "emerald" | "sky" | "amber" | "neutral" | "gradient";
  /** Mostrar etiqueta de porcentaje dentro de la barra (solo size="lg") */
  showValueInside?: boolean;
  className?: string;
}

const HEIGHT_MAP = {
  xs: "h-1.5",
  sm: "h-2",
  md: "h-2.5",
  lg: "h-[14px]",
};

const FILL_MAP = {
  accent: "bg-[var(--accent-warm)] shadow-[0_0_12px_color-mix(in_srgb,var(--accent-warm)_65%,transparent)]",
  emerald: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.55)]",
  sky: "bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.55)]",
  amber: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.55)]",
  neutral: "bg-neutral-400 dark:bg-neutral-500",
  gradient: "bg-gradient-to-r from-[#d62725] via-[#f67f00] to-[#fcbf48] shadow-[0_0_12px_rgba(246,127,0,0.5)]",
};

/**
 * LiquidProgress
 * Tubo capilar de cristal líquido con menisco especular superior.
 */
export function LiquidProgress({
  value,
  size = "sm",
  tone = "accent",
  showValueInside = false,
  className = "",
}: LiquidProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`lg-track ${HEIGHT_MAP[size]} w-full rounded-full overflow-hidden relative ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] relative flex items-center justify-center ${
          FILL_MAP[tone]
        } ${showValueInside ? "min-w-[34px]" : ""}`}
        style={{ width: `${clamped}%` }}
      >
        {/* Brillo especular superior del menisco líquido */}
        <span
          aria-hidden="true"
          className="absolute inset-x-1 top-[1px] h-[35%] rounded-full bg-gradient-to-b from-white/55 to-transparent pointer-events-none"
        />
        {showValueInside && (
          <span className="relative z-10 text-[8px] font-black text-[color:var(--on-accent)] leading-none">
            {clamped}%
          </span>
        )}
      </div>
    </div>
  );
}

export default LiquidProgress;

