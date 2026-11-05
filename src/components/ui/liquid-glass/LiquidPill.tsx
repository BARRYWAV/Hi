"use client";

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import { PILL_GLASS_CONFIG, getOpticalGlassVars } from "./presets";

export interface LiquidPillProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Si el chip/píldora está activo o seleccionado */
  active?: boolean;
  /** Punto de color indicador a la izquierda */
  dotColor?: string;
  /** Icono a la izquierda */
  icon?: ReactNode;
  /** Tamaño de la píldora */
  size?: "xs" | "sm" | "md";
  /** Variante óptica */
  variant?: "frosted" | "smoked" | "clear" | "accent";
  /** Configuración opcional de shader */
  config?: Partial<GlassConfig>;
}

const PILL_SIZE_CLASSES = {
  xs: "px-2 py-0.5 text-[9px] gap-1 font-bold",
  sm: "px-3 py-1 text-[11px] gap-1.5 font-bold",
  md: "px-3.5 py-1.5 text-xs gap-2 font-extrabold",
};

/**
 * LiquidPill / LiquidChip
 * Basado en `PILL_GLASS_CONFIG` (cornerRadius: 999, zRadius: 20, refraction: 0.65).
 * Ideal para chips de hidratación, etiquetas de categorías, recordatorios de todo el día y filtros.
 */
export const LiquidPill = forwardRef<HTMLDivElement, LiquidPillProps>(
  (
    {
      children,
      active = false,
      dotColor,
      icon,
      size = "sm",
      variant = "frosted",
      config = {},
      className = "",
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const mergedConfig: Partial<GlassConfig> = {
      ...PILL_GLASS_CONFIG,
      button: Boolean(onClick),
      ...config,
    };

    const opticalVars = getOpticalGlassVars(mergedConfig);

    return (
      <div
        ref={ref}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        data-liquid-glass="true"
        data-config={JSON.stringify(mergedConfig)}
        data-active={active ? "true" : undefined}
        onClick={onClick}
        style={{
          ...opticalVars,
          ...style,
        }}
        className={[
          "lg-pill inline-flex items-center justify-center rounded-full shrink-0 select-none transition-all duration-200",
          PILL_SIZE_CLASSES[size],
          active || variant === "accent"
            ? "lg-btn-accent"
            : variant === "smoked"
            ? "lg-btn-smoked"
            : variant === "clear"
            ? "lg-btn-clear"
            : "lg-btn-frosted",
          onClick ? "cursor-pointer active:scale-95 hover:scale-[1.03]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {dotColor && (
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
            style={{ backgroundColor: dotColor, color: dotColor }}
          />
        )}
        {icon && <span className="shrink-0 inline-flex items-center">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
    );
  }
);

LiquidPill.displayName = "LiquidPill";

export default LiquidPill;

