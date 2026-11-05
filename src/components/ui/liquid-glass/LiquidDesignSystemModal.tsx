"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Zap,
  Heart,
  Droplets,
  Wallet,
  Plus,
  Check,
  Search,
  Sliders,
  Eye,
  Flame,
  Shield,
} from "lucide-react";
import LiquidGlassSheet from "@/components/ui/LiquidGlassSheet";
import LiquidButton from "./LiquidButton";
import { LiquidIconButton, LiquidFAB } from "./LiquidIconButton";
import LiquidCard from "./LiquidCard";
import LiquidPill from "./LiquidPill";
import LiquidSegmentedControl from "./LiquidSegmentedControl";
import { LiquidInput } from "./LiquidInput";
import LiquidProgress from "./LiquidProgress";
import LiquidSwitch from "./LiquidSwitch";
import {
  CLEAR_GLASS_CONFIG,
  FROSTED_GLASS_CONFIG,
  SMOKED_GLASS_CONFIG,
  SMOKED_BUTTON_GLASS_CONFIG,
  PILL_GLASS_CONFIG,
  DOME_GLASS_CONFIG,
} from "./presets";
import LiquidGlassScene from "../../../../liquidglass/LiquidGlassScene";
import Glass from "../../../../liquidglass/Glass";
import ClearGlass from "../../../../liquidglass/ClearGlass";
import FrostedGlass from "../../../../liquidglass/FrostedGlass";
import SmokedGlass from "../../../../liquidglass/SmokedGlass";
import SideLiquidCard from "../../../../liquidglass/SideLiquidCard";
import TriangleGlassButtons from "../../../../liquidglass/TriangleGlassButtons";

interface LiquidDesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiquidDesignSystemModal({ isOpen, onClose }: LiquidDesignSystemModalProps) {
  const [tab, setTab] = useState<"components" | "surfaces" | "webgl">("components");
  const [segmentDemo, setSegmentDemo] = useState<"clear" | "frosted" | "smoked">("frosted");
  const [switchDemo, setSwitchDemo] = useState(true);
  const [progressDemo, setProgressDemo] = useState(68);
  const [activeTriBtn, setActiveTriBtn] = useState(0);

  return (
    <LiquidGlassSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      fullHeight={true}
    >
      {/* Drag handle */}
      <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto mt-2.5 mb-1 shrink-0" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-[var(--glass-border)] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl lg-btn-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-black tracking-tight text-[var(--mk-ink)] leading-none">
              Sistema de Diseño Liquid Glass
            </h2>
            <p className="text-[10px] font-semibold text-[var(--mk-muted)] mt-1">
              Calibración óptica física • @ybouane/liquidglass + Híbrido CSS
            </p>
          </div>
        </div>

        <LiquidIconButton
          size="icon-sm"
          variant="frosted"
          onClick={onClose}
          aria-label="Cerrar catálogo"
          title="Cerrar"
        >
          ✕
        </LiquidIconButton>
      </div>

      {/* Segmented Navigation */}
      <div className="px-5 py-2.5 shrink-0">
        <LiquidSegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { id: "components", label: "Botones & Controles", icon: <Zap className="w-3.5 h-3.5" /> },
            { id: "surfaces", label: "Cristales & Presets", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "webgl", label: "Escena WebGL 3D", icon: <Eye className="w-3.5 h-3.5" /> },
          ]}
        />
      </div>

      {/* Body */}
      <div className="px-5 pb-6 pt-1 flex-1 overflow-y-auto no-scrollbar space-y-5">
        {tab === "components" && (
          <>
            {/* 1. Variantes de Botones de Cristal (button: true) */}
            <section className="space-y-2">
              <span className="mk-label">1. Botones Interactivos (Física button: true)</span>
              <LiquidCard variant="frosted" className="p-4 space-y-3">
                <p className="text-[11px] text-[var(--mk-muted)] leading-relaxed">
                  Al pasar el cursor o tocar: <strong className="text-[var(--mk-ink)]">brightness +0.20</strong> y realce de bisel (<code className="text-[10px]">edgeHighlight: 0.10</code>). Al presionar: compresión física del bisel (<code className="text-[10px]">zRadius × 0.8</code>).
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <LiquidButton variant="accent" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Accent Glass
                  </LiquidButton>
                  <LiquidButton variant="frosted" leftIcon={<Layers className="w-3.5 h-3.5" />}>
                    Frosted Glass
                  </LiquidButton>
                  <LiquidButton variant="smoked" leftIcon={<Shield className="w-3.5 h-3.5" />}>
                    Smoked Glass
                  </LiquidButton>
                  <LiquidButton variant="clear" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Clear Glass
                  </LiquidButton>
                  <LiquidButton variant="primary" leftIcon={<Wallet className="w-3.5 h-3.5" />}>
                    Primary Deep
                  </LiquidButton>
                  <LiquidButton variant="success" leftIcon={<Check className="w-3.5 h-3.5" />}>
                    Confirmar
                  </LiquidButton>
                  <LiquidButton variant="danger" leftIcon={<Flame className="w-3.5 h-3.5" />}>
                    Crítico
                  </LiquidButton>
                </div>
              </LiquidCard>
            </section>

            {/* 2. Geometrías, Tamaños y Modo Domo */}
            <section className="space-y-2">
              <span className="mk-label">2. Geometrías (Pill, Rounded 20px, Card, Lente Domo)</span>
              <LiquidCard variant="frosted" className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <LiquidButton size="xs" variant="frosted" shape="pill">
                    XS Pill (999px)
                  </LiquidButton>
                  <LiquidButton size="sm" variant="frosted" shape="rounded">
                    SM Rounded (20px)
                  </LiquidButton>
                  <LiquidButton size="md" variant="accent" shape="card">
                    MD Card (14px)
                  </LiquidButton>
                  <LiquidButton size="lg" variant="smoked" shape="rounded" dome>
                    LG Lente Domo 3D
                  </LiquidButton>
                </div>

                {/* Botones de Acción e Iconos (Estilo TriangleGlassButtons & FAB) */}
                <div className="pt-2 border-t border-[var(--glass-border)] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <LiquidFAB fabSize="sm" variant="accent" title="FAB Compacto (38px)" />
                    <LiquidFAB
                      fabSize="md"
                      variant="primary"
                      icon={<Plus className="w-5 h-5 stroke-[2.8]" />}
                      title="FAB Mediano (44px)"
                    />
                    <LiquidIconButton
                      size="icon-lg"
                      shape="rounded"
                      variant="smoked"
                      bubbleEntrance
                      icon={<Sparkles className="w-6 h-6 text-[color:var(--accent-warm)]" />}
                      title="Botón Ahumado 20px (TriangleGlass preset)"
                    />
                    <LiquidIconButton
                      size="icon-lg"
                      shape="circle"
                      variant="clear"
                      dome
                      icon={<Droplets className="w-6 h-6 text-sky-400" />}
                      title="Lupa Domo Esférica (bevelMode: 1)"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--mk-muted)]">
                    Bisel biconvexo (0) y Domo (1)
                  </span>
                </div>
              </LiquidCard>
            </section>

            {/* 3. Píldoras, Chips, Inputs y Barras Capilares */}
            <section className="space-y-2">
              <span className="mk-label">3. Píldoras, Inputs & Tubos Capilares</span>
              <LiquidCard variant="frosted" className="p-4 space-y-4">
                {/* Píldoras interactivas */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <LiquidPill
                    active={segmentDemo === "frosted"}
                    onClick={() => setSegmentDemo("frosted")}
                    dotColor="var(--accent-warm)"
                  >
                    Frosted (0.45 blur)
                  </LiquidPill>
                  <LiquidPill
                    active={segmentDemo === "clear"}
                    onClick={() => setSegmentDemo("clear")}
                    dotColor="#2f8fdc"
                  >
                    Clear (0.75 refr)
                  </LiquidPill>
                  <LiquidPill
                    active={segmentDemo === "smoked"}
                    onClick={() => setSegmentDemo("smoked")}
                    dotColor="#1fa37a"
                  >
                    Smoked (-0.55 bri)
                  </LiquidPill>
                  <LiquidPill
                    variant="frosted"
                    onClick={() => setProgressDemo((p) => (p >= 100 ? 25 : Math.min(100, p + 15)))}
                    icon={<Droplets className="w-3 h-3 text-sky-500" />}
                  >
                    +250ml ({progressDemo}%)
                  </LiquidPill>
                </div>

                {/* Input y Switch */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <LiquidInput
                      leftIcon={<Search className="w-3.5 h-3.5" />}
                      placeholder="Campo de cristal esmerilado con halo refractivo..."
                    />
                  </div>
                  <LiquidSwitch
                    checked={switchDemo}
                    onChange={setSwitchDemo}
                    leftIcon={<Sparkles className="w-3 h-3" />}
                    thumbIcon={<Heart className="w-3 h-3 text-[color:var(--accent-warm)] fill-current" />}
                  />
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-[var(--mk-muted)]">
                    <span>Tubo capilar con menisco especular</span>
                    <span>{progressDemo}%</span>
                  </div>
                  <LiquidProgress value={progressDemo} size="lg" tone="accent" showValueInside />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <LiquidProgress value={82} size="sm" tone="emerald" />
                    <LiquidProgress value={64} size="sm" tone="sky" />
                  </div>
                </div>
              </LiquidCard>
            </section>
          </>
        )}

        {tab === "surfaces" && (
          <div className="space-y-3">
            <span className="mk-label">Las 5 Configuraciones Calibradas de ./liquidglass/presets.ts</span>

            {[
              {
                title: "1. ClearGlass (Cristal Puro - Sin Blur)",
                variant: "clear" as const,
                preset: CLEAR_GLASS_CONFIG,
                desc: "Refracción óptica pura (0.75) y aberración cromática (0.05) sin desenfoque gaussiano.",
              },
              {
                title: "2. FrostedGlass (Cristal Esmerilado Satinado)",
                variant: "frosted" as const,
                preset: FROSTED_GLASS_CONFIG,
                desc: "Acabado mate sedoso (blurAmount: 0.45, refraction: 0.65, specular: 0.0).",
              },
              {
                title: "3. SmokedGlass (Cristal Oscuro Ahumado de Lujo)",
                variant: "smoked" as const,
                preset: SMOKED_GLASS_CONFIG,
                desc: "Tinte oscuro profundo (brightness: -0.55, fresnel: 0.45, edgeHighlight: 0.08).",
              },
              {
                title: "4. ButtonGlass / TriangleGlass (Interactivo)",
                variant: "accent" as const,
                preset: SMOKED_BUTTON_GLASS_CONFIG,
                desc: "Física interactiva button: true con zRadius: 14, cornerRadius: 20-26 y rebote elástico.",
              },
              {
                title: "5. DomeGlass & PillGlass (Lupa Esférica y Dock)",
                variant: "dome" as const,
                preset: DOME_GLASS_CONFIG,
                desc: "bevelMode: 1 (plano-convexo) con cornerRadius = zRadius (56px) y refracción 1.2.",
              },
            ].map((item) => (
              <LiquidCard
                key={item.title}
                variant={item.variant}
                interactive
                cornerRadius={22}
                className="p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold">{item.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/15 dark:bg-white/15">
                    zR:{item.preset.zRadius} • ref:{item.preset.refraction}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 leading-snug">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] font-mono opacity-75">
                  <span>blur: {item.preset.blurAmount}</span>•
                  <span>edgeHL: {item.preset.edgeHighlight}</span>•
                  <span>fresnel: {item.preset.fresnel}</span>•
                  <span>spec: {item.preset.specular}</span>
                </div>
              </LiquidCard>
            ))}
          </div>
        )}

        {tab === "webgl" && (
          <div className="space-y-3">
            <span className="mk-label">Escena WebGL Real (@ybouane/liquidglass + Shaders GLSL)</span>
            <p className="text-[11px] text-[var(--mk-muted)]">
              Arrastra los paneles de cristal o la lupa esférica y presiona los botones triangulares o el panel lateral desplegable:
            </p>

            <div className="rounded-[24px] overflow-hidden border border-[var(--glass-border)] shadow-2xl">
              <LiquidGlassScene className="h-[440px] w-full">
                {/* 1. Píldora superior de Cristal */}
                <Glass
                  className="absolute left-4 top-4 h-12 px-5"
                  config={PILL_GLASS_CONFIG}
                >
                  <div className="flex items-center gap-2 px-3">
                    <Sparkles className="w-4 h-4 text-[#fcbf48]" />
                    <span className="text-xs font-black tracking-tight text-white">
                      Hi! Liquid Glass WebGL
                    </span>
                  </div>
                </Glass>

                {/* 2. Tres paneles flotantes arrastrables: Clear, Frosted, Smoked */}
                <ClearGlass
                  floating
                  cornerRadius={22}
                  className="absolute left-4 top-20 h-28 w-36"
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-sky-300">
                      Arrástrame
                    </span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Clear Glass</span>
                    <span className="text-[9px] text-white/75">Blur 0.0 • Refr 0.75</span>
                  </div>
                </ClearGlass>

                <FrostedGlass
                  floating
                  cornerRadius={22}
                  className="absolute left-[calc(50%-4.5rem)] top-20 h-28 w-36"
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-emerald-300">
                      Arrástrame
                    </span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Frosted Glass</span>
                    <span className="text-[9px] text-white/75">Blur 0.45 • Satinado</span>
                  </div>
                </FrostedGlass>

                <SmokedGlass
                  floating
                  cornerRadius={22}
                  className="absolute right-16 top-20 h-28 w-36"
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-amber-300">
                      Arrástrame
                    </span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Smoked Glass</span>
                    <span className="text-[9px] text-white/75">Ahumado -0.30</span>
                  </div>
                </SmokedGlass>

                {/* 3. Lupa Domo Esférica (bevelMode: 1) */}
                <Glass
                  className="absolute right-20 bottom-20 h-24 w-24 cursor-grab"
                  config={DOME_GLASS_CONFIG}
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[10px] font-black uppercase text-white drop-shadow">
                      Domo 3D
                    </span>
                    <span className="text-[8px] text-white/80">bevelMode: 1</span>
                  </div>
                </Glass>

                {/* 4. Trío de botones triangulares con física button: true */}
                <TriangleGlassButtons
                  activeProject={activeTriBtn}
                  onSoloMyCrmClick={() => setActiveTriBtn(0)}
                  onButton2Click={() => setActiveTriBtn(1)}
                  onButton3Click={() => setActiveTriBtn(2)}
                />

                {/* 5. Panel lateral desplegable SideLiquidCard */}
                <SideLiquidCard variant="smoked" cornerRadius={24}>
                  <div className="space-y-3 text-white">
                    <h4 className="text-sm font-black tracking-tight flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#fcbf48]" />
                      SideLiquidCard Activa
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Contenedor lateral con transición arquitectónica <code className="text-[10px]">cubic-bezier(0.25,1,0.3,1)</code> y capa hermana para preservar el padding sin distorsión WebGL.
                    </p>
                  </div>
                </SideLiquidCard>
              </LiquidGlassScene>
            </div>
          </div>
        )}
      </div>
    </LiquidGlassSheet>
  );
}

export default LiquidDesignSystemModal;
