"use client";

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { GlassConfig } from "@ybouane/liquidglass";
import {
  BUTTON_GLASS_CONFIG,
  SMOKED_BUTTON_GLASS_CONFIG,
  CLEAR_GLASS_CONFIG,
  ACCENT_GLASS_CONFIG,
  DOME_GLASS_CONFIG,
  getOpticalGlassVars,
  type LiquidButtonVariant,
  type LiquidButtonSize,
  type LiquidShape,
} from "./presets";

export interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante óptica de Liquid Glass:
   * - "frosted": Cristal esmerilado satinado translúcido
   * - "smoked": Cristal oscuro ahumado de lujo (brightness -0.5)
   * - "clear": Cristal puro de refracción nítida sin blur
   * - "accent": Cristal teñido con el color de acento activo (--accent-warm)
   * - "primary": Cristal profundo (#003049) con bisel cálido
   * - "danger": Cristal rubí para acciones críticas
   * - "success": Cristal esmeralda para confirmaciones
   * - "ghost": Superficie sutil que despierta su bisel al interactuar
   */
  variant?: LiquidButtonVariant;
  /** Tamaño del botón */
  size?: LiquidButtonSize;
  /** Geometría del borde: "pill" (9999px), "rounded" (20px tipo TriangleGlass), "card" (14px), "circle" */
  shape?: LiquidShape;
  /** Si está en estado activo/seleccionado */
  active?: boolean;
  /** Modo domo magnificador (bevelMode: 1) */
  dome?: boolean;
  /** Ocupar el 100% del ancho disponible */
  fullWidth?: boolean;
  /** Estado de carga con spinner */
  loading?: boolean;
  /** Icono a la izquierda */
  leftIcon?: ReactNode;
  /** Icono a la derecha */
  rightIcon?: ReactNode;
  /** Animación de entrada tipo burbuja elástica (TriangleGlassButtons) */
  bubbleEntrance?: boolean;
  /** Retraso en ms para la animación escalonada */
  staggerDelayMs?: number;
  /** Configuración adicional para el shader WebGL */
  glassConfig?: Partial<GlassConfig>;
  /** Si debe emitir vibración háptica al presionar (por defecto: true) */
  haptic?: boolean;
}

const SIZE_CLASSES: Record<LiquidButtonSize, string> = {
  xs: "h-7 px-2.5 text-[10px] gap-1 font-bold",
  sm: "h-8 px-3.5 text-[11px] gap-1.5 font-bold",
  md: "h-10 px-4 text-xs gap-2 font-extrabold",
  lg: "h-12 px-5 text-sm gap-2.5 font-extrabold",
  xl: "h-14 px-6 text-base gap-3 font-black",
  "icon-sm": "w-8 h-8 p-0 flex items-center justify-center shrink-0",
  icon: "w-10 h-10 p-0 flex items-center justify-center shrink-0",
  "icon-lg": "w-14 h-14 p-0 flex items-center justify-center shrink-0",
};

const SHAPE_RADIUS: Record<LiquidShape, number> = {
  pill: 999,
  rounded: 20,
  card: 14,
  circle: 999,
};

const SHAPE_CLASSES: Record<LiquidShape, string> = {
  pill: "rounded-full",
  rounded: "lg-shape-rounded",
  card: "lg-shape-card",
  circle: "rounded-full aspect-square",
};

const VARIANT_CLASSES: Record<LiquidButtonVariant, string> = {
  frosted: "lg-btn-frosted",
  smoked: "lg-btn-smoked",
  clear: "lg-btn-clear",
  accent: "lg-btn-accent",
  primary: "lg-btn-primary",
  danger: "lg-btn-danger",
  success: "lg-btn-success",
  ghost: "lg-btn-ghost",
};

/**
 * LiquidButton
 * Botón interactivo del Sistema de Diseño Liquid Glass.
 * Implementa la física de `button: true` de @ybouane/liquidglass:
 * - Hover: incremento de brillo (+0.20) y realce de bisel perimetral (edgeHighlight).
 * - Active / Press: compresión del bisel (zRadius * 0.80) y expansión de sombra de contacto (1.2x).
 */
export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      children,
      variant = "frosted",
      size = "md",
      shape = "pill",
      active = false,
      dome = false,
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      bubbleEntrance = false,
      staggerDelayMs = 0,
      glassConfig,
      haptic = true,
      className = "",
      style,
      disabled,
      onClick,
      ...rest
    },
    ref
  ) => {
    const basePreset =
      dome
        ? DOME_GLASS_CONFIG
        : variant === "smoked" || variant === "primary"
        ? SMOKED_BUTTON_GLASS_CONFIG
        : variant === "clear"
        ? { ...CLEAR_GLASS_CONFIG, button: true }
        : variant === "accent"
        ? ACCENT_GLASS_CONFIG
        : BUTTON_GLASS_CONFIG;

    const mergedConfig: Partial<GlassConfig> = {
      ...basePreset,
      button: true,
      cornerRadius: SHAPE_RADIUS[shape],
      ...glassConfig,
    };

    const opticalVars = getOpticalGlassVars(mergedConfig);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(18);
        } catch {
          // ignore
        }
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        data-liquid-glass="true"
        data-config={JSON.stringify(mergedConfig)}
        data-active={active ? "true" : undefined}
        data-dome={dome ? "true" : undefined}
        onClick={handleClick}
        style={{
          ...opticalVars,
          ...(staggerDelayMs > 0 ? { animationDelay: `${staggerDelayMs}ms` } : {}),
          ...style,
        }}
        className={[
          "lg-btn relative inline-flex items-center justify-center select-none cursor-pointer",
          "transition-all duration-200 ease-[cubic-bezier(0.25,1,0.3,1)]",
          "disabled:opacity-45 disabled:pointer-events-none",
          SIZE_CLASSES[size],
          SHAPE_CLASSES[shape],
          VARIANT_CLASSES[variant],
          active ? "lg-btn-selected" : "",
          dome ? "lg-btn-dome" : "",
          fullWidth ? "w-full" : "",
          bubbleEntrance ? "lg-bubble-enter" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {/* Capa interna z-[2] para que el texto e iconos floten nítidos sobre el bisel refractivo */}
        <span className="relative z-[2] inline-flex items-center justify-center gap-[inherit] w-full h-full pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
          )}
          {children !== undefined && children !== null && (
            <span className="truncate leading-none">{children}</span>
          )}
          {!loading && rightIcon && (
            <span className="shrink-0 inline-flex items-center">{rightIcon}</span>
          )}
        </span>
      </button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";

export default LiquidButton;

