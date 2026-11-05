"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import Glass from "./Glass";
import { CLEAR_GLASS_CONFIG } from "./presets";

export interface ClearGlassProps {
  children?: ReactNode;
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
 * ClearGlass (Cristal Puro - Sin Blur)
 * Refracción óptica pura y nítida sobre el fondo dinámico.
 * Libre de franjas difuminadas o esquinas cuadradas.
 */
export default function ClearGlass({
  children,
  floating = false,
  cornerRadius = 28,
  config = {},
  className = "",
  style,
  id,
  onClick,
}: ClearGlassProps) {
  const mergedConfig: Partial<GlassConfig> = {
    ...CLEAR_GLASS_CONFIG,
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
