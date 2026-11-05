"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import Glass from "./Glass";
import { SMOKED_GLASS_CONFIG } from "./presets";

export interface SmokedGlassProps {
  children?: ReactNode;
  /** Nivel de oscurecimiento -0.5 a 0 (por defecto: -0.30) */
  brightness?: number;
  /** Intensidad del desenfoque 0 a 1 (por defecto: 0.35) */
  blurAmount?: number;
  /** Permite arrastrar el componente con el mouse (por defecto: false) */
  floating?: boolean;
  /** Radio de curvatura en píxeles (por defecto: 28) */
  cornerRadius?: number;
  /** Sobrescrituras opcionales del shader */
  config?: Partial<GlassConfig>;
  className?: string;
  style?: CSSProperties;
  id?: string;
  onClick?: () => void;
}

/**
 * SmokedGlass (Cristal Ahumado / Dark Glass)
 * Tinte oscuro sofisticado de alta gama con desenfoque de lujo.
 * Sin franjas especulares indeseadas ni esquinas cuadradas.
 */
export default function SmokedGlass({
  children,
  brightness = -0.3,
  blurAmount = 0.35,
  floating = false,
  cornerRadius = 28,
  config = {},
  className = "",
  style,
  id,
  onClick,
}: SmokedGlassProps) {
  const mergedConfig: Partial<GlassConfig> = {
    ...SMOKED_GLASS_CONFIG,
    brightness,
    blurAmount,
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
