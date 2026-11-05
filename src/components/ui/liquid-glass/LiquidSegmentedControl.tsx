"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { SegmentedControl } from "glisse";

export interface LiquidSegmentOption<T extends string> {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
}

export interface LiquidSegmentedControlProps<T extends string> {
  options: readonly LiquidSegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  accentThumb?: boolean;
  className?: string;
}

/**
 * LiquidSegmentedControl
 * Barra de selección basada en `SegmentedControl` de Glisse (https://glisse.kelvinzhang.ca/)
 * con física de resortes y lente refractivo al mantener o deslizar.
 */
export function LiquidSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = true,
  accentThumb = true,
  className = "",
}: LiquidSegmentedControlProps<T>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tabWidth, setTabWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!fullWidth) {
      setTabWidth(null);
      return;
    }
    const el = wrapperRef.current;
    if (!el || options.length === 0) return;

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setTabWidth(Math.floor(w / options.length));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullWidth, options.length]);

  const tabHeight = size === "sm" ? 30 : 34;

  return (
    <div
      ref={wrapperRef}
      className={[fullWidth ? "w-full flex" : "inline-flex w-fit", className]
        .filter(Boolean)
        .join(" ")}
    >
      <SegmentedControl
        value={value}
        onValueChange={(next: string) => {
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
              navigator.vibrate(15);
            } catch {
              // ignore
            }
          }
          onChange(next as T);
        }}
        className={accentThumb ? "glisse-segmented-accent" : ""}
        style={
          {
            "--lg-tab-height": `${tabHeight}px`,
            ...(tabWidth ? { "--lg-tab-width": `${tabWidth}px` } : {}),
          } as React.CSSProperties
        }
        items={options.map((opt) => ({
          value: opt.id,
          label: (
            <span className="inline-flex items-center justify-center gap-1.5 px-1.5 text-[11px] font-bold">
              {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
              <span className="truncate">{opt.label}</span>
              {opt.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-black/15 dark:bg-white/15">
                  {opt.badge}
                </span>
              )}
            </span>
          ),
        }))}
      />
    </div>
  );
}

export default LiquidSegmentedControl;
