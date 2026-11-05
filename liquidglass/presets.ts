import type { GlassConfig } from "@ybouane/liquidglass";

/**
 * Presets calibrados de Liquid Glass para Portal UPDM
 * 
 * Reglas de calibración aplicadas para máxima estética física:
 * - specular: 0.00 (evita la franja difusa blanca en el borde inferior).
 * - edgeHighlight: 0.08 (resplandor fino y elegante de borde sin sobreexposición).
 * - fresnel: 0.35 - 0.45 (profundidad realista sin blanquear las curvas).
 * - zRadius: 16 - 20 (bisel estético de cristal templado).
 */

/** 1. Cristal Puro (Sin Blur / Refracción Pura) */
export const CLEAR_GLASS_CONFIG: Partial<GlassConfig> = {
  blurAmount: 0.0,
  refraction: 0.75,
  chromAberration: 0.05,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.4,
  cornerRadius: 28,
  zRadius: 18,
};

/** 2. Cristal Esmerilado (Con Blur / Satinado) */
export const FROSTED_GLASS_CONFIG: Partial<GlassConfig> = {
  blurAmount: 0.45,
  refraction: 0.65,
  chromAberration: 0.03,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.4,
  cornerRadius: 28,
  zRadius: 18,
};

/** 3. Cristal Oscuro Ahumado (Dark Glass / Tinte de Lujo) */
export const SMOKED_GLASS_CONFIG: Partial<GlassConfig> = {
  brightness: -0.55,
  blurAmount: 0.30,
  refraction: 0.7,
  chromAberration: 0.04,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.45,
  cornerRadius: 28,
  zRadius: 18,
};

/** 4. Botón Interactivo de Cristal (Hover lift + Press) */
export const BUTTON_GLASS_CONFIG: Partial<GlassConfig> = {
  button: true,
  cornerRadius: 26,
  zRadius: 14,
  refraction: 0.7,
  blurAmount: 0.15,
  specular: 0.05,
  edgeHighlight: 0.1,
  fresnel: 0.5,
};

/** 5. Píldora / Dock Bar */
export const PILL_GLASS_CONFIG: Partial<GlassConfig> = {
  cornerRadius: 999,
  zRadius: 20,
  refraction: 0.65,
  blurAmount: 0.2,
  specular: 0.0,
  edgeHighlight: 0.08,
  fresnel: 0.35,
};

export const GLASS_PRESETS = {
  clear: CLEAR_GLASS_CONFIG,
  frosted: FROSTED_GLASS_CONFIG,
  smoked: SMOKED_GLASS_CONFIG,
  button: BUTTON_GLASS_CONFIG,
  pill: PILL_GLASS_CONFIG,
} as const;

export type GlassVariant = "clear" | "frosted" | "smoked";
