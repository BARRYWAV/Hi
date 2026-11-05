"use client";

import React from "react";

export interface GlassFoldProps {
  className?: string;
  style?: React.CSSProperties;
  /** Tema activo: "dark" | "light". */
  mode?: "dark" | "light";
}

/**
 * GlassFold
 * Fondo oficial de la aplicación para Modo Oscuro (/bg-dark.jpg) y Modo Claro (/bg-light.jpg),
 * con transparencia calibrada y movimiento orbital infinito.
 */
export function GlassFold({ className = "", style, mode = "dark" }: GlassFoldProps) {
  const isLight = mode === "light";

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`relative block w-full h-full select-none pointer-events-none overflow-hidden ${className}`}
    >
      {/* MODO OSCURO: Capas translúcidas con movimiento infinito */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src="/bg-dark.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.20] bg-infinite-drift-primary"
        />
        <img
          src="/bg-dark.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.10] mix-blend-screen bg-infinite-drift-secondary"
        />
      </div>

      {/* MODO CLARO: Capas translúcidas con movimiento infinito */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="/bg-light.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.20] bg-infinite-drift-primary"
        />
        <img
          src="/bg-light.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.10] mix-blend-multiply bg-infinite-drift-secondary"
        />
      </div>
    </div>
  );
}

export default GlassFold;
