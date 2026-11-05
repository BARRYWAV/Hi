"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { GlassFold } from "@/components/ui/glass-fold";
import {
  LiquidButton,
  LiquidIconButton,
  LiquidFAB,
  LiquidCard,
  LiquidPill,
  LiquidSegmentedControl,
  LiquidInput,
  LiquidSelect,
  LiquidTextarea,
  LiquidProgress,
  LiquidSwitch,
  CLEAR_GLASS_CONFIG,
  FROSTED_GLASS_CONFIG,
  SMOKED_GLASS_CONFIG,
  PILL_GLASS_CONFIG,
  DOME_GLASS_CONFIG,
  BUTTON_GLASS_CONFIG,
  SMOKED_BUTTON_GLASS_CONFIG,
} from "@/components/ui/liquid-glass";
import LiquidGlassScene from "../../../liquidglass/LiquidGlassScene";
import Glass from "../../../liquidglass/Glass";
import ClearGlass from "../../../liquidglass/ClearGlass";
import FrostedGlass from "../../../liquidglass/FrostedGlass";
import SmokedGlass from "../../../liquidglass/SmokedGlass";
import SideLiquidCard from "../../../liquidglass/SideLiquidCard";
import TriangleGlassButtons from "../../../liquidglass/TriangleGlassButtons";
import SocialGlassButtons from "../../../liquidglass/SocialGlassButtons";

export default function LiquidGlassDesignSystemPage() {
  const [tab, setTab] = useState<"all" | "webgl" | "buttons" | "surfaces">("all");
  const [segmentDemo, setSegmentDemo] = useState<"frosted" | "clear" | "smoked">("frosted");
  const [switchDemo, setSwitchDemo] = useState(true);
  const [progressDemo, setProgressDemo] = useState(72);
  const [activeTriBtn, setActiveTriBtn] = useState(0);
  const [selectedBento, setSelectedBento] = useState<number>(0);
  const [webglStatus, setWebglStatus] = useState<string>(
    "Arrastra las tarjetas y la Lupa Domo 3D, o presiona los botones de cristal"
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white relative overflow-x-hidden pb-24">
      {/* Lienzo dinámico global de pliegues lumínicos para que TODO el sistema refracte luz real */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-90" aria-hidden="true">
        <GlassFold className="w-full h-full" />
      </div>

      {/* Top Sticky Navbar */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2 max-w-6xl mx-auto">
        <div className="lg-card lg-surface-smoked rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <LiquidIconButton
                size="icon-sm"
                variant="smoked"
                aria-label="Volver a Hi!"
                title="Volver a la app principal"
              >
                <ArrowLeft className="w-4 h-4" />
              </LiquidIconButton>
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl lg-btn-accent flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-none">
                  Liquid Glass Design System
                </h1>
                <p className="text-[10px] font-semibold text-white/70 mt-0.5">
                  Motor WebGL Real (@ybouane/liquidglass) + Componentes Ópticos Interactivos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-extrabold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WebGL Shaders Activos
            </span>
            <ThemeToggle variant="compact" />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-3 space-y-6">
        {/* Selector de Vista */}
        <LiquidSegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { id: "all", label: "Todo el Sistema", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: "webgl", label: "Escena WebGL 3D", icon: <Eye className="w-3.5 h-3.5" /> },
            { id: "buttons", label: "Botones & Controles", icon: <Zap className="w-3.5 h-3.5" /> },
            { id: "surfaces", label: "Tarjetas & Presets", icon: <Layers className="w-3.5 h-3.5" /> },
          ]}
        />

        {/* SECCIÓN 1: ESCENA WEBGL INTERACTIVA REAL (@ybouane/liquidglass) */}
        {(tab === "all" || tab === "webgl") && (
          <section className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#fcbf48]">
                ✦ Motor WebGL Real (@ybouane/liquidglass) — Arrastra los cristales y presiona los botones
              </span>
              <span className="text-[11px] font-bold text-emerald-300 bg-black/40 px-3 py-1 rounded-full border border-white/15">
                {webglStatus}
              </span>
            </div>

            <div className="rounded-[28px] overflow-hidden border border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
              <LiquidGlassScene className="h-[560px] sm:h-[620px] w-full">
                {/* Enlaces sociales flotantes (SocialGlassButtons de ./liquidglass) */}
                <SocialGlassButtons
                  showLabels={false}
                  onWhatsAppClick={() => setWebglStatus("SocialGlassButtons: WhatsApp")}
                  onFacebookClick={() => setWebglStatus("SocialGlassButtons: Facebook")}
                  onInstagramClick={() => setWebglStatus("SocialGlassButtons: Instagram")}
                />

                {/* 1. Píldora Header de Cristal WebGL */}
                <Glass
                  className="absolute left-[calc(50%-145px)] sm:left-[calc(50%-180px)] top-4 h-14 w-[290px] sm:w-[360px]"
                  config={PILL_GLASS_CONFIG}
                >
                  <div className="flex items-center gap-2.5 px-4">
                    <Sparkles className="w-4 h-4 text-[#fcbf48] shrink-0" />
                    <div className="text-left">
                      <span className="text-xs sm:text-sm font-black tracking-tight text-white block leading-none">
                        Hi! Liquid Glass WebGL
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                        Snell Refraction • Fresnel • Bevel 3D
                      </span>
                    </div>
                  </div>
                </Glass>

                {/* 2. Tres Botones WebGL Reales con física button: true */}
                <Glass
                  className="absolute left-4 sm:left-8 top-22 h-11 w-36 sm:w-40 cursor-pointer"
                  config={{
                    ...BUTTON_GLASS_CONFIG,
                    cornerRadius: 999,
                    refraction: 0.78,
                    blurAmount: 0.12,
                  }}
                  onClick={() => setWebglStatus("¡Botón WebGL Clear presionado! (zRadius × 0.8)")}
                >
                  <span className="text-xs font-extrabold tracking-wide text-white drop-shadow">
                    ✦ Botón Clear
                  </span>
                </Glass>

                <Glass
                  className="absolute left-[calc(50%-72px)] sm:left-[calc(50%-80px)] top-22 h-11 w-36 sm:w-40 cursor-pointer"
                  config={{
                    ...BUTTON_GLASS_CONFIG,
                    cornerRadius: 999,
                    blurAmount: 0.45,
                    refraction: 0.68,
                  }}
                  onClick={() => setWebglStatus("¡Botón WebGL Frosted presionado! (Blur 0.45)")}
                >
                  <span className="text-xs font-extrabold tracking-wide text-[#fcbf48] drop-shadow">
                    ⚡ Botón Frosted
                  </span>
                </Glass>

                <Glass
                  className="absolute right-16 sm:right-20 top-22 h-11 w-36 sm:w-40 cursor-pointer"
                  config={{
                    ...SMOKED_BUTTON_GLASS_CONFIG,
                    cornerRadius: 20,
                    brightness: -0.32,
                  }}
                  onClick={() => setWebglStatus("¡Botón WebGL Smoked presionado! (Bri -0.32)")}
                >
                  <span className="text-xs font-extrabold tracking-wide text-emerald-300 drop-shadow">
                    ◆ Botón Smoked
                  </span>
                </Glass>

                {/* 3. Tres Paneles Flotantes Arrastrables (floating: true) */}
                <ClearGlass
                  floating
                  cornerRadius={26}
                  className="absolute left-4 sm:left-8 top-38 h-36 w-44 sm:w-52"
                >
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[9px] uppercase font-black tracking-wider text-sky-300 bg-black/35 px-2 py-0.5 rounded-full">
                      ✋ Arrástrame
                    </span>
                    <span className="text-base font-black text-white mt-1.5 drop-shadow">
                      Clear Glass
                    </span>
                    <span className="text-[10px] font-semibold text-white/90">
                      Blur 0.0 • Refracción 0.75
                    </span>
                  </div>
                </ClearGlass>

                <FrostedGlass
                  floating
                  cornerRadius={26}
                  className="absolute left-[calc(50%-88px)] sm:left-[calc(50%-104px)] top-38 h-36 w-44 sm:w-52"
                >
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[9px] uppercase font-black tracking-wider text-emerald-300 bg-black/35 px-2 py-0.5 rounded-full">
                      ✋ Arrástrame
                    </span>
                    <span className="text-base font-black text-white mt-1.5 drop-shadow">
                      Frosted Glass
                    </span>
                    <span className="text-[10px] font-semibold text-white/90">
                      Blur 0.45 • Satinado
                    </span>
                  </div>
                </FrostedGlass>

                <SmokedGlass
                  floating
                  cornerRadius={26}
                  className="absolute right-16 sm:right-20 top-38 h-36 w-44 sm:w-52"
                >
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[#fcbf48] bg-black/45 px-2 py-0.5 rounded-full">
                      ✋ Arrástrame
                    </span>
                    <span className="text-base font-black text-white mt-1.5 drop-shadow">
                      Smoked Glass
                    </span>
                    <span className="text-[10px] font-semibold text-white/90">
                      Ahumado • Fresnel 0.45
                    </span>
                  </div>
                </SmokedGlass>

                {/* 4. Lupa Esférica Domo 3D (bevelMode: 1) Arrastrable */}
                <Glass
                  className="absolute left-[calc(50%-56px)] bottom-24 h-28 w-28 cursor-grab"
                  config={DOME_GLASS_CONFIG}
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[11px] font-black uppercase text-white drop-shadow">
                      🔍 Lupa Domo
                    </span>
                    <span className="text-[9px] font-bold text-[#fcbf48] drop-shadow">
                      Arrástrame (3D)
                    </span>
                  </div>
                </Glass>

                {/* 5. Trío de Botones en Pirámide (TriangleGlassButtons) */}
                <TriangleGlassButtons
                  activeProject={activeTriBtn}
                  onSoloMyCrmClick={() => {
                    setActiveTriBtn(0);
                    setWebglStatus("TriangleGlassButtons: Proyecto 1 (CRM) activo");
                  }}
                  onButton2Click={() => {
                    setActiveTriBtn(1);
                    setWebglStatus("TriangleGlassButtons: Proyecto 2 (Stack) activo");
                  }}
                  onButton3Click={() => {
                    setActiveTriBtn(2);
                    setWebglStatus("TriangleGlassButtons: Proyecto 3 (Portal) activo");
                  }}
                />

                {/* 6. Dock Inferior de Cristal Líquido WebGL */}
                <Glass
                  className="hidden md:flex absolute left-[calc(50%-180px)] bottom-4 h-14 w-[360px]"
                  config={{
                    cornerRadius: 999,
                    zRadius: 18,
                    refraction: 0.7,
                    blurAmount: 0.25,
                    specular: 0.0,
                    edgeHighlight: 0.1,
                    fresnel: 0.38,
                  }}
                >
                  <div className="flex w-full items-center justify-around px-4">
                    {["✦ Cristal", "⚡ Botones", "🔍 Lupa 3D", "📁 Panel"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setWebglStatus(`Dock WebGL: ${item} seleccionado`)}
                        className="px-3 py-1.5 rounded-full text-xs font-extrabold text-white hover:bg-white/20 transition-all cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </Glass>

                {/* 7. Tarjeta Lateral Desplegable (SideLiquidCard) */}
                <SideLiquidCard
                  variant="smoked"
                  cornerRadius={24}
                  onOpenChange={(open) =>
                    setWebglStatus(
                      open
                        ? "SideLiquidCard: Panel lateral desplegado"
                        : "SideLiquidCard: Panel lateral cerrado"
                    )
                  }
                >
                  <div className="space-y-3 text-white">
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#fcbf48]" />
                      SideLiquidCard Desplegable
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                      Este contenedor lateral de <code>./liquidglass/SideLiquidCard.tsx</code> usa{" "}
                      <code className="text-[#fcbf48]">SMOKED_GLASS_CONFIG</code> en una capa WebGL
                      hija directa de la escena y separa su contenido en una capa hermana para que el
                      padding CSS se mantenga intacto.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                        <span className="text-[10px] font-bold uppercase text-[#fcbf48] block">
                          Refracción
                        </span>
                        <span className="text-base font-black">0.65 Snell</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                        <span className="text-[10px] font-bold uppercase text-emerald-300 block">
                          Fresnel Rim
                        </span>
                        <span className="text-base font-black">0.45 Óptico</span>
                      </div>
                    </div>
                  </div>
                </SideLiquidCard>
              </LiquidGlassScene>
            </div>
          </section>
        )}

        {/* SECCIÓN 2: BOTONES INTERACTIVOS Y CONTROLES DEL SISTEMA */}
        {(tab === "all" || tab === "buttons") && (
          <section className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#fcbf48] block px-1">
              ✦ Catálogo de Botones & Controles Liquid Glass (Física button: true)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variantes de Botones */}
              <LiquidCard variant="smoked" cornerRadius={24} className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fcbf48]">
                    1. Variantes Ópticas de Botón (LiquidButton)
                  </span>
                  <p className="text-xs text-white/75 mt-1">
                    Iluminación reactiva al hover (+0.20 brightness) y compresión física del bisel al presionar (zRadius × 0.8).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <LiquidButton variant="accent" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Accent Glass
                  </LiquidButton>
                  <LiquidButton variant="frosted" leftIcon={<Layers className="w-3.5 h-3.5" />}>
                    Frosted Satin
                  </LiquidButton>
                  <LiquidButton variant="smoked" leftIcon={<Shield className="w-3.5 h-3.5" />}>
                    Smoked Dark
                  </LiquidButton>
                  <LiquidButton variant="clear" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Clear Pure
                  </LiquidButton>
                  <LiquidButton variant="primary" leftIcon={<Wallet className="w-3.5 h-3.5" />}>
                    Primary Deep
                  </LiquidButton>
                  <LiquidButton variant="success" leftIcon={<Check className="w-3.5 h-3.5" />}>
                    Confirmar
                  </LiquidButton>
                  <LiquidButton variant="danger" leftIcon={<Flame className="w-3.5 h-3.5" />}>
                    Eliminar
                  </LiquidButton>
                  <LiquidButton variant="ghost">Ghost Glass</LiquidButton>
                </div>
              </LiquidCard>

              {/* Formas, Tamaños y Botones de Icono / FAB */}
              <LiquidCard variant="smoked" cornerRadius={24} className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                    2. Geometrías, Tamaños & Lentes Domo (bevelMode: 1)
                  </span>
                  <p className="text-xs text-white/75 mt-1">
                    Formas Pill (999px), Rounded (20px tipo TriangleGlass), Card (14px) y Circle Dome.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <LiquidButton size="xs" variant="frosted" shape="pill">
                    XS Pill
                  </LiquidButton>
                  <LiquidButton size="sm" variant="frosted" shape="rounded">
                    SM 20px
                  </LiquidButton>
                  <LiquidButton size="md" variant="accent" shape="card">
                    MD Card 14px
                  </LiquidButton>
                  <LiquidButton size="lg" variant="smoked" shape="rounded" dome>
                    LG Lente Domo
                  </LiquidButton>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center gap-3.5 flex-wrap">
                  <LiquidFAB fabSize="sm" variant="accent" title="FAB 38px" />
                  <LiquidFAB
                    fabSize="md"
                    variant="primary"
                    icon={<Plus className="w-5 h-5 stroke-[2.8]" />}
                    title="FAB 44px"
                  />
                  <LiquidFAB
                    fabSize="lg"
                    variant="accent"
                    icon={<Plus className="w-7 h-7 stroke-[2.8]" />}
                    title="FAB Dock Central 56px"
                  />
                  <LiquidIconButton
                    size="icon-lg"
                    shape="rounded"
                    variant="smoked"
                    bubbleEntrance
                    icon={<Sparkles className="w-6 h-6 text-[#fcbf48]" />}
                    title="Botón Ahumado 20px (TriangleGlass)"
                  />
                  <LiquidIconButton
                    size="icon-lg"
                    shape="circle"
                    variant="clear"
                    dome
                    icon={<Droplets className="w-6 h-6 text-sky-400" />}
                    title="Lupa Domo Circular"
                  />
                </div>
              </LiquidCard>
            </div>

            {/* Píldoras, Inputs, Switch y Barras Capilares */}
            <LiquidCard variant="smoked" cornerRadius={24} className="p-5 space-y-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 block">
                3. Píldoras (PILL_GLASS_CONFIG), Campos Ópticos, Switch Domo y Tubos Capilares
              </span>

              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                <LiquidPill
                  active={segmentDemo === "frosted"}
                  onClick={() => setSegmentDemo("frosted")}
                  dotColor="var(--accent-warm)"
                >
                  Frosted Chip
                </LiquidPill>
                <LiquidPill
                  active={segmentDemo === "clear"}
                  onClick={() => setSegmentDemo("clear")}
                  dotColor="#38bdf8"
                >
                  Clear Chip
                </LiquidPill>
                <LiquidPill
                  active={segmentDemo === "smoked"}
                  onClick={() => setSegmentDemo("smoked")}
                  dotColor="#10b981"
                >
                  Smoked Chip
                </LiquidPill>
                <LiquidPill
                  variant="smoked"
                  onClick={() => setProgressDemo((p) => (p >= 100 ? 20 : Math.min(100, p + 15)))}
                  icon={<Droplets className="w-3.5 h-3.5 text-sky-400" />}
                >
                  +250ml Agua ({progressDemo}%)
                </LiquidPill>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <LiquidInput
                  label="Input de Cristal"
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                  placeholder="Buscar o capturar..."
                />
                <LiquidSelect label="Selector de Cristal" defaultValue="frosted">
                  <option value="frosted">Preset: Frosted Glass (0.45)</option>
                  <option value="clear">Preset: Clear Glass (0.00)</option>
                  <option value="smoked">Preset: Smoked Glass (-0.55)</option>
                </LiquidSelect>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/20">
                  <span className="text-xs font-bold text-white">Switch Lente Domo</span>
                  <LiquidSwitch
                    checked={switchDemo}
                    onChange={setSwitchDemo}
                    leftIcon={<Sparkles className="w-3 h-3" />}
                    thumbIcon={<Heart className="w-3 h-3 text-[#d62725] fill-current" />}
                  />
                </div>
              </div>

              <LiquidTextarea
                label="Área de Texto con Botón Flotante"
                rows={2}
                placeholder="Escribe en lenguaje natural sobre la cavidad de cristal esmerilado..."
                rightBottomSlot={
                  <LiquidIconButton size="icon-sm" variant="accent" shape="rounded">
                    <Sparkles className="w-3.5 h-3.5" />
                  </LiquidIconButton>
                }
              />

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-white/80">
                  <span>Barra de Progreso Capilar (LiquidProgress con menisco especular)</span>
                  <span className="text-[#fcbf48]">{progressDemo}%</span>
                </div>
                <LiquidProgress value={progressDemo} size="lg" tone="accent" showValueInside />
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <LiquidProgress value={85} size="sm" tone="emerald" />
                  <LiquidProgress value={65} size="sm" tone="sky" />
                  <LiquidProgress value={90} size="sm" tone="gradient" />
                </div>
              </div>
            </LiquidCard>
          </section>
        )}

        {/* SECCIÓN 3: TARJETAS Y PRESETS CALIBRADOS */}
        {(tab === "all" || tab === "surfaces") && (
          <section className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#fcbf48] block px-1">
              ✦ Las Superficies Calibradas + Tarjetas Bento Seleccionables
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 0,
                  title: "ClearGlass",
                  subtitle: "Refracción 0.75 • Blur 0.0",
                  variant: "clear" as const,
                  config: CLEAR_GLASS_CONFIG,
                },
                {
                  id: 1,
                  title: "FrostedGlass",
                  subtitle: "Refracción 0.65 • Blur 0.45",
                  variant: "frosted" as const,
                  config: FROSTED_GLASS_CONFIG,
                },
                {
                  id: 2,
                  title: "SmokedGlass",
                  subtitle: "Brightness -0.55 • Fresnel 0.45",
                  variant: "smoked" as const,
                  config: SMOKED_GLASS_CONFIG,
                },
              ].map((card) => (
                <LiquidCard
                  key={card.id}
                  variant={card.variant}
                  interactive
                  selected={selectedBento === card.id}
                  onClick={() => setSelectedBento(card.id)}
                  cornerRadius={24}
                  className="p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black">{card.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/25 text-white">
                      zR: {card.config.zRadius}px
                    </span>
                  </div>
                  <p className="text-xs opacity-90 font-semibold">{card.subtitle}</p>
                  <p className="text-[10px] opacity-75 font-mono">
                    edgeHL: {card.config.edgeHighlight} • spec: {card.config.specular}
                  </p>
                </LiquidCard>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
