"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GlassConfig } from "@ybouane/liquidglass";

export interface GlassProps {
  children?: ReactNode;
  config?: Partial<GlassConfig>;
  className?: string;
  style?: CSSProperties;
  id?: string;
  onClick?: () => void;
}

/**
 * Glass Component
 * Representa un elemento de cristal líquido nativo de @ybouane/liquidglass.
 * Contiene el envoltorio relativo z-[2] para que el contenido (texto/iconos)
 * flote nítidamente por encima del lienzo WebGL inyectado por el shader.
 */
export default function Glass({
  children,
  config = {},
  className = "",
  style,
  id,
  onClick,
}: GlassProps) {
  const radius = config.cornerRadius !== undefined ? `${config.cornerRadius}px` : undefined;

  return (
    <div
      id={id}
      data-liquid-glass="true"
      data-config={JSON.stringify(config)}
      onClick={onClick}
      style={{
        borderRadius: radius,
        ...style,
      }}
      className={`isolate z-10 select-none text-white ${className}`}
    >
      {children ? (
        <div className="relative z-[2] w-full h-full pointer-events-auto flex items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
