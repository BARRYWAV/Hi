import type { CSSProperties } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";

/**
 * ============================================================================
 * SISTEMA DE DISEÑO LIQUID GLASS — PRESETS Y CALIBRACIÓN ÓPTICA FÍSICA
 * ============================================================================
 * Basado en la arquitectura de `./liquidglass` y los shaders GLSL de `@ybouane/liquidglass`:
 * - Ley de Snell (IOR = 1.5) en superficie biconvexa (bevelMode: 0) o domo (bevelMode: 1).
 * - Eliminación de artefactos especulares inferiores (specular: 0.00 en contenedores, 0.05 en botones).
 * - Resplandor perimetral calibrado (edgeHighlight: 0.08 - 0.12) con sesgo superior (topBias).
 * - Reflexión de Fresnel en ángulos rasantes (fresnel: 0.35 - 0.50).
 * - Física interactiva de botones (button: true):
 *     • Hover:  brightness + 0.20 (iluminación interna reactiva)
 *     • Press:  zRadius * 0.80, shadowSpread * 1.20 (aplanamiento físico del bisel)
 */

/** 1. Cristal Puro (Sin Blur / Refracción Óptica Nítida) */
export const CLEAR_GLASS_CONFIG: Partial<GlassConfig> = {
  blurAmount: 0.0,
  refraction: 0.75,
  chromAberration: 0.05,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.4,
  cornerRadius: 28,
  zRadius: 18,
  bevelMode: 0,
};

/** 2. Cristal Esmerilado (Con Blur / Acabado Satinado Mate Sedoso) */
export const FROSTED_GLASS_CONFIG: Partial<GlassConfig> = {
  blurAmount: 0.45,
  refraction: 0.65,
  chromAberration: 0.03,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.4,
  cornerRadius: 28,
  zRadius: 18,
  bevelMode: 0,
};

/** 3. Cristal Oscuro Ahumado (Dark Glass / Tinte de Lujo) */
export const SMOKED_GLASS_CONFIG: Partial<GlassConfig> = {
  brightness: -0.55,
  blurAmount: 0.3,
  refraction: 0.7,
  chromAberration: 0.04,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.45,
  cornerRadius: 28,
  zRadius: 18,
  bevelMode: 0,
};

/** 4. Botón Interactivo de Cristal (Hover lift + Press bevel compression) */
export const BUTTON_GLASS_CONFIG: Partial<GlassConfig> = {
  button: true,
  cornerRadius: 26,
  zRadius: 14,
  refraction: 0.7,
  blurAmount: 0.15,
  specular: 0.05,
  edgeHighlight: 0.1,
  fresnel: 0.5,
  bevelMode: 0,
};

/** 5. Botón Ahumado Arquitectónico (Calibración TriangleGlassButtons) */
export const SMOKED_BUTTON_GLASS_CONFIG: Partial<GlassConfig> = {
  button: true,
  cornerRadius: 20,
  zRadius: 14,
  refraction: 0.75,
  blurAmount: 0.25,
  brightness: -0.5,
  chromAberration: 0.04,
  specular: 0.0,
  edgeHighlight: 0.12,
  fresnel: 0.45,
  shadowOpacity: 0.25,
  bevelMode: 0,
};

/** 6. Píldora / Chip / Dock Bar */
export const PILL_GLASS_CONFIG: Partial<GlassConfig> = {
  cornerRadius: 999,
  zRadius: 20,
  refraction: 0.65,
  blurAmount: 0.2,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.35,
  bevelMode: 0,
};

/** 7. Domo Magnificador Esférico (bevelMode: 1 — Plano-Convexo) */
export const DOME_GLASS_CONFIG: Partial<GlassConfig> = {
  bevelMode: 1,
  cornerRadius: 56,
  zRadius: 56,
  refraction: 1.2,
  chromAberration: 0.1,
  specular: 0.15,
  edgeHighlight: 0.15,
  fresnel: 0.5,
  blurAmount: 0.0,
};

/** 8. Cristal de Acento (Teñido con el color de marca activo) */
export const ACCENT_GLASS_CONFIG: Partial<GlassConfig> = {
  button: true,
  cornerRadius: 24,
  zRadius: 16,
  refraction: 0.72,
  blurAmount: 0.22,
  chromAberration: 0.04,
  specular: 0.04,
  edgeHighlight: 0.14,
  fresnel: 0.48,
  bevelMode: 0,
};

export const GLASS_PRESETS = {
  clear: CLEAR_GLASS_CONFIG,
  frosted: FROSTED_GLASS_CONFIG,
  smoked: SMOKED_GLASS_CONFIG,
  button: BUTTON_GLASS_CONFIG,
  smokedButton: SMOKED_BUTTON_GLASS_CONFIG,
  pill: PILL_GLASS_CONFIG,
  dome: DOME_GLASS_CONFIG,
  accent: ACCENT_GLASS_CONFIG,
} as const;

export type GlassVariant = "clear" | "frosted" | "smoked" | "accent" | "dome";

export type LiquidButtonVariant =
  | "frosted"
  | "smoked"
  | "clear"
  | "accent"
  | "primary"
  | "danger"
  | "success"
  | "ghost";

export type LiquidButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "icon-sm"
  | "icon"
  | "icon-lg";

export type LiquidShape = "pill" | "rounded" | "card" | "circle";

/**
 * Convierte un `GlassConfig` en variables CSS ópticas para que tanto el motor
 * híbrido CSS como el motor WebGL compartan exactamente la misma física visual.
 */
export function getOpticalGlassVars(config: Partial<GlassConfig>): CSSProperties {
  const blurPx = Math.round((config.blurAmount ?? 0.35) * 36);
  const edgeHL = config.edgeHighlight ?? 0.08;
  const fresnel = config.fresnel ?? 0.4;
  const zRadius = config.zRadius ?? 16;
  const radius = config.cornerRadius !== undefined ? `${config.cornerRadius}px` : undefined;

  return {
    borderRadius: radius,
    "--lg-blur": `${blurPx}px`,
    "--lg-edge-hl": String(edgeHL),
    "--lg-fresnel": String(fresnel),
    "--lg-z-radius": `${zRadius}px`,
  } as CSSProperties;
}

