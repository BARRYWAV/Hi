"use client";

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import {
  GLASS_PRESETS,
  getOpticalGlassVars,
  type GlassVariant,
} from "./presets";

export interface LiquidCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /**
   * Variante óptica de la tarjeta:
   * - "frosted": Cristal esmerilado satinado (blurAmount: 0.45)
   * - "clear": Cristal puro sin blur (refraction: 0.75)
   * - "smoked": Cristal oscuro ahumado de lujo (brightness: -0.55)
   * - "accent": Cristal teñido con el color de acento activo
   * - "dome": Superficie con curvatura plano-convexa
   */
  variant?: GlassVariant;
  /** Radio de curvatura en píxeles (por defecto: 16 para tarjetas estándar, 28 para paneles flotantes) */
  cornerRadius?: number;
  /** Permite arrastrar el componente en escenas WebGL (por defecto: false) */
  floating?: boolean;
  /** Activa física de botón/tarjeta presionable (button: true) */
  interactive?: boolean;
  /** Si la tarjeta está seleccionada (se ilumina con el cristal de acento) */
  selected?: boolean;
  /** Sobrescrituras opcionales del shader */
  config?: Partial<GlassConfig>;
}

const CARD_VARIANT_CLASSES: Record<GlassVariant, string> = {
  frosted: "lg-surface-frosted",
  clear: "lg-surface-clear",
  smoked: "lg-surface-smoked",
  accent: "lg-surface-accent",
  dome: "lg-surface-dome",
};

/**
 * LiquidCard
 * Contenedor principal del Sistema de Diseño Liquid Glass.
 * Calibrado con:
 * - specular: 0.00 (libre de franjas blancas difusas inferiores)
 * - edgeHighlight: 0.08 (resplandor fino perimetral con sesgo superior)
 * - fresnel: 0.40 - 0.45 (profundidad óptica en cantos curvos)
 * - zRadius: 18 (bisel de cristal templado)
 */
export const LiquidCard = forwardRef<HTMLDivElement, LiquidCardProps>(
  (
    {
      children,
      variant = "frosted",
      cornerRadius = 16,
      floating = false,
      interactive = false,
      selected = false,
      config = {},
      className = "",
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const baseConfig = GLASS_PRESETS[variant] || GLASS_PRESETS.frosted;
    const mergedConfig: Partial<GlassConfig> = {
      ...baseConfig,
      floating,
      cornerRadius,
      button: interactive || Boolean(onClick),
      ...config,
    };

    const opticalVars = getOpticalGlassVars(mergedConfig);

    return (
      <div
        ref={ref}
        data-liquid-glass="true"
        data-config={JSON.stringify(mergedConfig)}
        data-selected={selected ? "true" : undefined}
        onClick={onClick}
        style={{
          ...opticalVars,
          ...style,
        }}
        className={[
          "lg-card relative",
          CARD_VARIANT_CLASSES[variant],
          interactive || onClick ? "lg-card-interactive cursor-pointer" : "",
          selected ? "lg-card-selected" : "",
          floating ? "cursor-grab active:cursor-grabbing" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

LiquidCard.displayName = "LiquidCard";

export default LiquidCard;

