"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import LiquidCard from "./LiquidCard";
import type { GlassVariant } from "./presets";

export interface SideLiquidCardProps {
  /** Variante del cristal: "frosted" | "smoked" | "clear". Por defecto "smoked". */
  variant?: GlassVariant;
  /** Radio de curvatura en píxeles. Por defecto: 24. */
  cornerRadius?: number;
  /** Contenido opcional dentro del contenedor (por defecto: vacío). */
  children?: ReactNode;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Se notifica cada vez que el panel se abre o se cierra. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * SideLiquidCard
 * Contenedor Liquid Glass en el lateral de la pantalla:
 * - Se asoma en el lateral derecho (~48px).
 * - Al hacer clic, se desliza suavemente hacia afuera hasta ocupar ~55% de la escena.
 * - Utiliza los componentes y shaders WebGL oficiales de @ybouane/liquidglass.
 */
export default function SideLiquidCard({
  variant = "smoked",
  cornerRadius = 24,
  children = null,
  className = "",
  onOpenChange,
}: SideLiquidCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };
  const toggle = () => update(!isOpen);
  const close = () => update(false);

  const currentRadius = isOpen ? cornerRadius : 14;

  return (
    <>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-hidden="true"
            onClick={close}
            className="fixed inset-0 z-[15] cursor-pointer pointer-events-auto"
          />,
          document.body
        )}

      {/* Tarjeta de Cristal Líquido nativa como hijo directo de la escena WebGL */}
      <LiquidCard
        variant={variant}
        cornerRadius={currentRadius}
        className={`isolate absolute top-4 sm:top-5 bottom-4 sm:bottom-5 right-3 z-30 flex flex-col ring-1 ring-white/25 select-none cursor-default transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] will-change-[width] ${
          isOpen ? "w-[86%] sm:w-[62%] md:w-[48%]" : "w-11 sm:w-12"
        } ${className}`}
      >
        {!isOpen && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Mostrar panel lateral Liquid Glass"
            title="Abrir Panel Lateral"
            className="group z-20 flex items-center justify-center cursor-pointer transition-all duration-300 absolute inset-0 w-full h-full hover:bg-white/10"
          >
            <div className="flex items-center justify-center [writing-mode:vertical-rl] rotate-180 select-none">
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.32em] text-white/90 group-hover:text-[#fcbf48] transition-colors">
                PROYECTOS
              </span>
            </div>
          </button>
        )}
      </LiquidCard>

      {/* Capa hermana independiente para el contenido cuando el panel está desplegado */}
      {children ? (
        <div
          className={`absolute top-4 sm:top-5 bottom-4 sm:bottom-5 right-3 z-[31] overflow-y-auto w-[86%] sm:w-[62%] md:w-[48%] transition-[opacity,visibility] duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto delay-100 visible"
              : "opacity-0 pointer-events-none delay-0 invisible"
          }`}
          style={{ borderRadius: cornerRadius }}
        >
          <div className="box-border w-full min-h-full p-5 sm:p-7 flex flex-col justify-between">
            <div>{children}</div>
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={close}
                className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-extrabold text-white cursor-pointer transition-all"
              >
                Cerrar panel ✕
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
