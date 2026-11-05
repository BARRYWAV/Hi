"use client";

import React, {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";

export interface LiquidInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  label?: string;
}

/**
 * LiquidInput
 * Campo de entrada con cavidad óptica de cristal esmerilado/ahumado,
 * borde interno luminoso (edgeHighlight) y halo de refracción al enfocar.
 */
export const LiquidInput = forwardRef<HTMLInputElement, LiquidInputProps>(
  ({ leftIcon, rightSlot, label, className = "", ...rest }, ref) => {
    const field = (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--mk-muted)] pointer-events-none z-10">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={[
            "lg-field w-full rounded-xl text-xs font-semibold outline-none transition-all duration-200",
            leftIcon ? "pl-10" : "px-3.5",
            rightSlot ? "pr-11" : "pr-3.5",
            "py-2.5",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {rightSlot && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10">{rightSlot}</div>
        )}
      </div>
    );

    if (label) {
      return (
        <label className="block space-y-1">
          <span className="mk-caption">{label}</span>
          {field}
        </label>
      );
    }

    return field;
  }
);

LiquidInput.displayName = "LiquidInput";

export interface LiquidSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const LiquidSelect = forwardRef<HTMLSelectElement, LiquidSelectProps>(
  ({ label, children, className = "", ...rest }, ref) => {
    const selectEl = (
      <select
        ref={ref}
        className={`lg-field w-full rounded-xl px-3 py-2 text-xs font-bold outline-none transition-all duration-200 cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </select>
    );

    if (label) {
      return (
        <label className="block space-y-1">
          <span className="mk-caption">{label}</span>
          {selectEl}
        </label>
      );
    }

    return selectEl;
  }
);

LiquidSelect.displayName = "LiquidSelect";

export interface LiquidTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  rightBottomSlot?: ReactNode;
}

export const LiquidTextarea = forwardRef<HTMLTextAreaElement, LiquidTextareaProps>(
  ({ label, rightBottomSlot, className = "", ...rest }, ref) => {
    const area = (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={`lg-field w-full rounded-2xl p-3 text-xs font-semibold outline-none transition-all duration-200 resize-none ${
            rightBottomSlot ? "pr-12" : ""
          } ${className}`}
          {...rest}
        />
        {rightBottomSlot && (
          <div className="absolute right-2.5 bottom-2.5 z-10">{rightBottomSlot}</div>
        )}
      </div>
    );

    if (label) {
      return (
        <label className="block space-y-1">
          <span className="mk-caption">{label}</span>
          {area}
        </label>
      );
    }

    return area;
  }
);

LiquidTextarea.displayName = "LiquidTextarea";

export default LiquidInput;

