export { default as Glass } from "./Glass";
export type { GlassProps } from "./Glass";

export { default as LiquidGlassScene } from "./LiquidGlassScene";

export { default as ClearGlass } from "./ClearGlass";
export type { ClearGlassProps } from "./ClearGlass";

export { default as FrostedGlass } from "./FrostedGlass";
export type { FrostedGlassProps } from "./FrostedGlass";

export { default as SmokedGlass } from "./SmokedGlass";
export type { SmokedGlassProps } from "./SmokedGlass";

export { default as LiquidCard } from "./LiquidCard";
export type { LiquidCardProps } from "./LiquidCard";

export { default as SideLiquidCard } from "./SideLiquidCard";
export type { SideLiquidCardProps } from "./SideLiquidCard";

export { default as SocialGlassButtons } from "./SocialGlassButtons";
export type { SocialGlassButtonsProps } from "./SocialGlassButtons";

export { default as TriangleGlassButtons, TRIANGLE_GLASS_CONFIG } from "./TriangleGlassButtons";
export type { TriangleGlassButtonsProps } from "./TriangleGlassButtons";

export {
  GLASS_PRESETS,
  CLEAR_GLASS_CONFIG,
  FROSTED_GLASS_CONFIG,
  SMOKED_GLASS_CONFIG,
  BUTTON_GLASS_CONFIG,
  PILL_GLASS_CONFIG,
  type GlassVariant,
} from "./presets";

/* Re-exports del Sistema de Diseño UI Liquid Glass */
export {
  SMOKED_BUTTON_GLASS_CONFIG,
  DOME_GLASS_CONFIG,
  ACCENT_GLASS_CONFIG,
  getOpticalGlassVars,
  LiquidButton,
  LiquidIconButton,
  LiquidFAB,
  LiquidPill,
  LiquidSegmentedControl,
  LiquidInput,
  LiquidSelect,
  LiquidTextarea,
  LiquidProgress,
  LiquidSwitch,
  LiquidDesignSystemModal,
  type LiquidButtonProps,
  type LiquidIconButtonProps,
  type LiquidFABProps,
  type LiquidPillProps,
  type LiquidSegmentedControlProps,
  type LiquidInputProps,
  type LiquidProgressProps,
  type LiquidSwitchProps,
  type LiquidButtonVariant,
  type LiquidButtonSize,
  type LiquidShape,
} from "@/components/ui/liquid-glass";
