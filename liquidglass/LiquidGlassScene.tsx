"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LiquidGlass, type GlassConfig } from "@ybouane/liquidglass";
import { GlassFold } from "@/components/ui/glass-fold";

interface LiquidGlassSceneProps {
  children: ReactNode;
  defaults?: Partial<GlassConfig>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LiquidGlassScene
 * Root orchestrator for @ybouane/liquidglass.
 * - Espera la carga de tipografías web para precisión geométrica.
 * - GlassFold tiene data-dynamic para que el motor re-muestree la animación automáticamente.
 * - Todos los hijos con [data-liquid-glass] son inicializados con sus WebGL shaders.
 */
export default function LiquidGlassScene({ children, defaults, className, style }: LiquidGlassSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let instance: LiquidGlass | null = null;

    // Evitar que el colapso de la barra de direcciones en móviles dispare resize en WebGL (pantallazo negro)
    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const filterMobileResize = (e: UIEvent) => {
      // En móviles, el scroll solo cambia innerHeight por la barra del navegador; innerWidth no cambia.
      // Si el ancho no cambió, cancelamos la propagación para que LiquidGlass no reinicie sus FBOs.
      if (window.innerWidth === lastWidth) {
        e.stopImmediatePropagation();
        return;
      }
      lastWidth = window.innerWidth;
    };
    window.addEventListener("resize", filterMobileResize, { capture: true });

    (async () => {
      // Esperar a que las fuentes estén listas
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Localizar todos los elementos de vidrio (directos o anidados)
      const glassElements = Array.from(
        root.querySelectorAll<HTMLElement>("[data-liquid-glass]")
      );

      if (glassElements.length === 0 || cancelled) return;

      try {
        instance = await LiquidGlass.init({ root, glassElements, defaults });
        if (cancelled) {
          instance.destroy();
        }
      } catch (err) {
        console.error("[LiquidGlass] Error al inicializar:", err);
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", filterMobileResize, { capture: true });
      if (instance) {
        instance.destroy();
      }
    };
  }, [defaults]);

  return (
    <div
      ref={rootRef}
      style={style}
      className={`relative w-full overflow-hidden bg-black text-white ${className || "min-h-screen"}`}
    >
      {/* Fondo shader con data-dynamic para captura fluida */}
      <GlassFold className="absolute inset-0 pointer-events-none" />

      {/* Elementos de vidrio reales */}
      {children}
    </div>
  );
}
