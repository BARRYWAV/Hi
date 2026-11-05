"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import Glass from "./Glass";
import { GLASS_PRESETS, type GlassVariant } from "./presets";

export interface LiquidCardProps {
  children?: ReactNode;
  /**
   * Estilo de cristal líquido:
   * - "clear": Cristal puro sin desenfoque (refracción óptica limpia).
   * - "frosted": Cristal esmerilado satinado (blur suave).
   * - "smoked": Cristal oscuro ahumado de lujo (dark mode).
   * Por defecto: "frosted"
   */
  variant?: GlassVariant;
  /** Permite arrastrar el componente con el cursor (por defecto: false) */
  floating?: boolean;
  /** Radio de curvatura en píxeles (por defecto: 28) */
  cornerRadius?: number;
  /** Sobrescrituras opcionales de la configuración del shader */
  config?: Partial<GlassConfig>;
  className?: string;
  style?: CSSProperties;
  id?: string;
  onClick?: () => void;
}

/**
 * LiquidCard
 * Tarjeta base de Cristal Líquido WebGL calibrada sin artefactos.
 * Soporta las 3 variantes principales: 'clear', 'frosted' y 'smoked'.
 */
export default function LiquidCard({
  children,
  variant = "frosted",
  floating = false,
  cornerRadius = 28,
  config = {},
  className = "",
  style,
  id,
  onClick,
}: LiquidCardProps) {
  const baseConfig = GLASS_PRESETS[variant] || GLASS_PRESETS.frosted;

  const mergedConfig: Partial<GlassConfig> = {
    ...baseConfig,
    floating,
    cornerRadius,
    ...config,
  };

  return (
    <Glass
      id={id}
      config={mergedConfig}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </Glass>
  );
}
