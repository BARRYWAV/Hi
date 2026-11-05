"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import Glass from "./Glass";
import { FROSTED_GLASS_CONFIG } from "./presets";

export interface FrostedGlassProps {
  children?: ReactNode;
  /** Intensidad del desenfoque gaussiano 0 a 1 (por defecto: 0.45) */
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
 * FrostedGlass (Cristal Esmerilado - Con Blur)
 * Difumina suavemente el fondo con acabado satinado mate sedoso.
 * Libre de franjas difuminadas blancas en el fondo y con bordes perfectos.
 */
export default function FrostedGlass({
  children,
  blurAmount = 0.45,
  floating = false,
  cornerRadius = 28,
  config = {},
  className = "",
  style,
  id,
  onClick,
}: FrostedGlassProps) {
  const mergedConfig: Partial<GlassConfig> = {
    ...FROSTED_GLASS_CONFIG,
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
