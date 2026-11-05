"use client";

import type { ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";
import { Sparkles, Layers, GraduationCap } from "lucide-react";
import LiquidCard from "./LiquidCard";
import type { GlassVariant } from "./presets";

export interface TriangleGlassButtonsProps {
  /** Variante del cristal: "clear", "frosted" o "smoked" (por defecto: "smoked") */
  variant?: GlassVariant;
  /** Radio de curvatura en píxeles. Por defecto: 20 */
  cornerRadius?: number;
  /** Si está activo, oculta los botones con animación fluida */
  hidden?: boolean;
  /** Índice del proyecto activo seleccionado (0, 1 o 2) */
  activeProject?: number;
  /** Clases CSS adicionales */
  className?: string;
  /** Icono o nodo personalizado para el botón 1 */
  slot1Icon?: ReactNode;
  /** Icono o nodo personalizado para el botón 2 */
  slot2Icon?: ReactNode;
  /** Icono o nodo personalizado para el botón 3 */
  slot3Icon?: ReactNode;
  /** Callback al hacer clic en el botón 1 */
  onSoloMyCrmClick?: () => void;
  /** Callback opcional para el botón 2 */
  onButton2Click?: () => void;
  /** Callback opcional para el botón 3 */
  onButton3Click?: () => void;
}

/**
 * Configuración de shader calibrada para Liquid Glass ahumado interactivo
 * Reglas físicas de Liquid Glass:
 * - specular: 0.0 (elimina franjas blancas en esquinas y bisel)
 * - brightness: -0.35 (ahumado profundo de lujo con refracción visible)
 * - button: true (física WebGL de presionado interactivo: hover +0.20 brightness, active zRadius * 0.8)
 */
export const TRIANGLE_GLASS_CONFIG: Partial<GlassConfig> = {
  cornerRadius: 20,
  zRadius: 14,
  refraction: 0.78,
  blurAmount: 0.22,
  brightness: -0.32,
  chromAberration: 0.05,
  specular: 0.0,
  edgeHighlight: 0.14,
  fresnel: 0.5,
  shadowOpacity: 0.28,
  button: true,
};

/**
 * TriangleGlassButtons
 * Trío de botones en formación triangular (pirámide) con Liquid Glass WebGL real y acabado ahumado.
 */
export default function TriangleGlassButtons({
  variant = "smoked",
  cornerRadius = 20,
  hidden = false,
  activeProject = 0,
  className = "",
  slot1Icon,
  slot2Icon,
  slot3Icon,
  onSoloMyCrmClick,
  onButton2Click,
  onButton3Click,
}: TriangleGlassButtonsProps) {
  // Clases compartidas para cada botón de cristal líquido WebGL (sin bg opaco ni translate CSS que desfase html-to-image)
  const buttonBase =
    " isolate absolute z-20 flex items-center justify-center w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] cursor-pointer select-none transition-opacity duration-300";

  const visibilityClass = hidden
    ? "opacity-0 pointer-events-none"
    : "opacity-100 pointer-events-auto";

  return (
    <>
      {/* Botón 1 (Vértice Superior de la Pirámide) */}
      <LiquidCard
        variant={variant}
        cornerRadius={cornerRadius}
        config={TRIANGLE_GLASS_CONFIG}
        className={`${buttonBase} ${visibilityClass} left-[62px] sm:left-[98px] bottom-[104px] sm:bottom-[112px] ${
          activeProject === 0 ? "ring-2 ring-[#fcbf48]/70" : "ring-1 ring-white/20"
        } group ${className}`}
        onClick={onSoloMyCrmClick}
        id="btn-project-solomycrm"
      >
        <div
          aria-label="Acción 1"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white gap-1"
        >
          <span className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {slot1Icon ?? <Sparkles className="w-6 h-6 text-[#fcbf48]" />}
          </span>
          <span className="text-[8px] font-black uppercase tracking-wider text-white/90">
            CRM
          </span>
        </div>
      </LiquidCard>

      {/* Botón 2 (Base Izquierda de la Pirámide) */}
      <LiquidCard
        variant={variant}
        cornerRadius={cornerRadius}
        config={TRIANGLE_GLASS_CONFIG}
        className={`${buttonBase} ${visibilityClass} left-[18px] sm:left-[52px] bottom-[22px] sm:bottom-[26px] ${
          activeProject === 1 ? "ring-2 ring-sky-400/70" : "ring-1 ring-white/20"
        } group ${className}`}
        onClick={onButton2Click}
        id="btn-project-slot-2"
      >
        <div
          aria-label="Acción 2"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white gap-1"
        >
          <span className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {slot2Icon ?? <Layers className="w-6 h-6 text-sky-400" />}
          </span>
          <span className="text-[8px] font-black uppercase tracking-wider text-white/90">
            Stack
          </span>
        </div>
      </LiquidCard>

      {/* Botón 3 (Base Derecha de la Pirámide) */}
      <LiquidCard
        variant={variant}
        cornerRadius={cornerRadius}
        config={TRIANGLE_GLASS_CONFIG}
        className={`${buttonBase} ${visibilityClass} left-[106px] sm:left-[144px] bottom-[22px] sm:bottom-[26px] ${
          activeProject === 2 ? "ring-2 ring-emerald-400/70" : "ring-1 ring-white/20"
        } group ${className}`}
        onClick={onButton3Click}
        id="btn-project-slot-3"
      >
        <div
          aria-label="Acción 3"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white gap-1"
        >
          <span className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {slot3Icon ?? <GraduationCap className="w-6 h-6 text-emerald-400" />}
          </span>
          <span className="text-[8px] font-black uppercase tracking-wider text-white/90">
            Portal
          </span>
        </div>
      </LiquidCard>
    </>
  );
}
