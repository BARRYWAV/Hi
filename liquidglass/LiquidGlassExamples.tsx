"use client";

import Glass from "./Glass";
import LiquidGlassScene from "./LiquidGlassScene";
import ClearGlass from "./ClearGlass";
import FrostedGlass from "./FrostedGlass";
import SmokedGlass from "./SmokedGlass";

/**
 * LiquidGlassExamples
 * Demostración fiel al repositorio oficial de @ybouane/liquidglass:
 * - Refracción física real con WebGL Shaders (sin trucos de CSS blur o cajas opacas).
 * - Botones reactivos con modo button: true (se iluminan al pasar el cursor y se aplanan al presionar).
 * - Paneles de vidrio arrastrables (floating: true) en 3 estilos: Clear, Frosted y Dark.
 * - Lupa esférica con modo domo (bevelMode: 1).
 * - Barra dock de navegación de cristal en la parte inferior.
 */
export default function LiquidGlassExamples() {
  return (
    <LiquidGlassScene>
      {/* 1. Header Principal: Píldora de Cristal */}
      <Glass
        className="absolute left-1/2 top-6 -translate-x-1/2 h-20 w-[90%] max-w-[560px]"
        config={{
          cornerRadius: 40,
          zRadius: 20,
          refraction: 0.75,
          blurAmount: 0.1,
          specular: 0.0,
          edgeHighlight: 0.08,
          fresnel: 0.4,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
            Portal UPDM
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300 drop-shadow">
            Liquid Glass WebGL Engine
          </span>
        </div>
      </Glass>

      {/* 2. Botones Interactivos de Cristal (con física button: true) */}
      <Glass
        className="absolute left-[calc(50%-170px)] top-30 -translate-x-1/2 h-13 w-40 cursor-pointer"
        config={{
          button: true,
          cornerRadius: 26,
          zRadius: 14,
          refraction: 0.7,
          blurAmount: 0.15,
          specular: 0.05,
          edgeHighlight: 0.1,
          fresnel: 0.5,
        }}
        onClick={() => alert("¡Botón Primario de Cristal!")}
      >
        <span className="text-sm font-bold tracking-wide text-white drop-shadow">
          Explorar ✦
        </span>
      </Glass>

      <Glass
        className="absolute left-[calc(50%+170px)] top-30 -translate-x-1/2 h-13 w-40 cursor-pointer"
        config={{
          button: true,
          cornerRadius: 26,
          zRadius: 14,
          refraction: 0.7,
          blurAmount: 0.25,
          brightness: -0.15,
          specular: 0.05,
          edgeHighlight: 0.1,
          fresnel: 0.5,
        }}
        onClick={() => alert("¡Botón Secundario de Cristal!")}
      >
        <span className="text-sm font-semibold tracking-wide text-white/90 drop-shadow">
          Proyectos →
        </span>
      </Glass>

      {/* 3. Tres Paneles Flotantes Arrastrables (Haz clic y muévelos con el mouse) */}
      {/* Panel 1: Cristal Claro (Refraction pura - Sin blur) */}
      <ClearGlass
        floating
        className="absolute left-[12%] top-[40%] h-44 w-64"
      >
        <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            Arrástrame
          </span>
          <span className="text-lg font-extrabold text-white">Cristal Puro</span>
          <span className="text-xs text-white/80">Sin desenfoque (Clear)</span>
        </div>
      </ClearGlass>

      {/* Panel 2: Cristal Esmerilado (Frosted Glass - Con blur) */}
      <FrostedGlass
        floating
        className="absolute left-1/2 top-[44%] -translate-x-1/2 h-44 w-64"
      >
        <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
            Arrástrame
          </span>
          <span className="text-lg font-extrabold text-white">Esmerilado</span>
          <span className="text-xs text-white/80">Textura satinada (Frosted)</span>
        </div>
      </FrostedGlass>

      {/* Panel 3: Cristal Oscuro Ahumado (Dark Glass - Ahumado) */}
      <SmokedGlass
        floating
        className="absolute right-[12%] top-[40%] h-44 w-64"
      >
        <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            Arrástrame
          </span>
          <span className="text-lg font-extrabold text-white">Cristal Oscuro</span>
          <span className="text-xs text-white/80">Tinte ahumado (Smoked)</span>
        </div>
      </SmokedGlass>

      {/* 4. Lupa Esférica / Domo Magnificador */}
      <Glass
        className="absolute left-1/2 top-[70%] -translate-x-1/2 h-28 w-28 cursor-grab"
        config={{
          floating: true,
          bevelMode: 1,
          cornerRadius: 56,
          zRadius: 56,
          refraction: 1.2,
          chromAberration: 0.1,
          specular: 0.15,
          edgeHighlight: 0.15,
          blurAmount: 0,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center p-2">
          <span className="text-xs font-black uppercase tracking-tight text-white drop-shadow">
            Lupa Domo
          </span>
          <span className="text-[10px] text-white/80">3D Magnifier</span>
        </div>
      </Glass>

      {/* 5. Dock / Barra Inferior de Cristal Líquido */}
      <Glass
        className="absolute left-1/2 bottom-6 -translate-x-1/2 h-16 w-[90%] max-w-[480px]"
        config={{
          cornerRadius: 999,
          zRadius: 20,
          refraction: 0.65,
          blurAmount: 0.2,
          specular: 0.0,
          edgeHighlight: 0.08,
          fresnel: 0.3,
        }}
      >
        <div className="flex w-full items-center justify-around px-4">
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all"
            onClick={() => alert("Inicio")}
          >
            ✦ Inicio
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all"
            onClick={() => alert("Servicios")}
          >
            ⚡ Servicios
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all"
            onClick={() => alert("Proyectos")}
          >
            📁 Proyectos
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all"
            onClick={() => alert("Contacto")}
          >
            ✉ Contacto
          </button>
        </div>
      </Glass>
    </LiquidGlassScene>
  );
}
