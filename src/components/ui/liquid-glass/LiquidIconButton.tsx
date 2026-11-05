"use client";

import React, { forwardRef, type ReactNode } from "react";
import { Plus } from "lucide-react";
import LiquidButton, { type LiquidButtonProps } from "./LiquidButton";

export interface LiquidIconButtonProps extends Omit<LiquidButtonProps, "leftIcon" | "rightIcon"> {
  icon?: ReactNode;
  /** Etiqueta inferior opcional (para tiles tipo Bento / Acciones Rápidas) */
  label?: string;
}

/**
 * LiquidIconButton
 * Botón de icono circular o cuadrado redondeado (20px) con bisel de cristal líquido.
 */
export const LiquidIconButton = forwardRef<HTMLButtonElement, LiquidIconButtonProps>(
  ({ icon, children, size = "icon", shape = "circle", variant = "frosted", className = "", ...rest }, ref) => {
    return (
      <LiquidButton
        ref={ref}
        size={size}
        shape={shape}
        variant={variant}
        className={`group ${className}`}
        {...rest}
      >
        <span className="inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          {icon ?? children}
        </span>
      </LiquidButton>
    );
  }
);

LiquidIconButton.displayName = "LiquidIconButton";

export interface LiquidFABProps extends Omit<LiquidButtonProps, "size" | "shape"> {
  /** Tamaño del FAB: "sm" (38px tipo mk-fab) o "lg" (56px tipo Dock Central) */
  fabSize?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

/**
 * LiquidFAB
 * Botón de Acción Flotante con física de Lente Domo (bevelMode: 1) y bisel especular.
 */
export const LiquidFAB = forwardRef<HTMLButtonElement, LiquidFABProps>(
  ({ fabSize = "sm", variant = "accent", dome = true, icon, children, className = "", ...rest }, ref) => {
    const dimClass =
      fabSize === "lg"
        ? "w-14 h-14 min-w-[3.5rem] min-h-[3.5rem]"
        : fabSize === "md"
        ? "w-11 h-11 min-w-[2.75rem] min-h-[2.75rem]"
        : "w-[38px] h-[38px] min-w-[38px] min-h-[38px]";

    return (
      <LiquidButton
        ref={ref}
        variant={variant}
        shape="circle"
        dome={dome}
        className={`${dimClass} !p-0 shrink-0 ${className}`}
        {...rest}
      >
        {icon ?? children ?? (
          <Plus
            className={fabSize === "lg" ? "w-7 h-7 stroke-[2.8]" : "w-5 h-5 stroke-[2.8]"}
          />
        )}
      </LiquidButton>
    );
  }
);

LiquidFAB.displayName = "LiquidFAB";

export default LiquidIconButton;

