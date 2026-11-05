"use client";

import React, { type ReactNode } from "react";
import { Switch } from "glisse";

export interface LiquidSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  thumbIcon?: ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
  scale?: number;
}

/**
 * LiquidSwitch
 * Interruptor On/Off basado en el componente `Switch` de Glisse (https://glisse.kelvinzhang.ca/)
 * con física de resortes y lente óptico refractivo al presionar o arrastrar.
 */
export function LiquidSwitch({
  checked,
  onChange,
  leftIcon,
  rightIcon,
  ariaLabel = "Alternar opción",
  title,
  className = "",
  scale = 0.36,
}: LiquidSwitchProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
      title={title}
    >
      {leftIcon && (
        <span
          className={`flex items-center justify-center transition-colors duration-200 ${
            !checked ? "text-[color:var(--accent-warm)]" : "text-[var(--mk-muted)] opacity-60"
          }`}
        >
          {leftIcon}
        </span>
      )}
      <Switch
        checked={checked}
        aria-label={ariaLabel}
        style={{ "--lg-scale": scale } as React.CSSProperties}
        onCheckedChange={(next) => {
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
              navigator.vibrate(20);
            } catch {
              // ignore
            }
          }
          onChange(next);
        }}
      />
      {rightIcon && (
        <span
          className={`flex items-center justify-center transition-colors duration-200 ${
            checked ? "text-[color:var(--accent-warm)]" : "text-[var(--mk-muted)] opacity-60"
          }`}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}

export default LiquidSwitch;
