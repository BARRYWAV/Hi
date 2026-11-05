'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, User, LogOut, Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  ACCENTS,
  AccentId,
  AppSettings,
  DEFAULT_SETTINGS,
  applyAccent,
  loadSettings,
  saveSettings,
} from '@/lib/settings';

/** Reduce la foto a 256px para que quepa en localStorage. */
function resizeImage(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas'));
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function SettingsView({ onClose }: { onClose?: () => void } = {}) {
  const {
    authUser,
    activeUser,
    updateProfile,
    currentWorkoutProfile,
    updateWorkoutProfile,
    setCurrentTab,
    logout,
    resetToEmptyState,
    loadDemoData,
    triggerHaptic,
  } = useApp();

  const fileRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [name, setName] = useState(activeUser.displayName === 'Usuario' ? '' : (activeUser.displayName || ''));
  const [email, setEmail] = useState(activeUser.email || '');
  const [height, setHeight] = useState(
    currentWorkoutProfile?.heightCm && currentWorkoutProfile.heightCm > 0
      ? String(currentWorkoutProfile.heightCm)
      : ''
  );
  const [weight, setWeight] = useState(
    currentWorkoutProfile?.weightKg && currentWorkoutProfile.weightKg > 0
      ? String(currentWorkoutProfile.weightKg)
      : ''
  );
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setName(activeUser.displayName === 'Usuario' ? '' : (activeUser.displayName || ''));
    setEmail(activeUser.email || '');
    setHeight(
      currentWorkoutProfile?.heightCm && currentWorkoutProfile.heightCm > 0
        ? String(currentWorkoutProfile.heightCm)
        : ''
    );
    setWeight(
      currentWorkoutProfile?.weightKg && currentWorkoutProfile.weightKg > 0
        ? String(currentWorkoutProfile.weightKg)
        : ''
    );
  }, [activeUser, currentWorkoutProfile]);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  };

  const patchSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
    flash();
  };

  const commitName = () => {
    const v = name.trim();
    if (v && v !== activeUser.displayName) {
      updateProfile({ displayName: v, name: v });
      flash();
    }
  };

  const commitEmail = () => {
    const v = email.trim().toLowerCase();
    if (v && v !== (authUser?.email || '') && /\S+@\S+\.\S+/.test(v)) {
      updateProfile({ email: v });
      flash();
    }
  };

  const commitBody = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const data: { heightCm?: number; weightKg?: number } = {};
    if (!isNaN(h) && h > 0 && h !== currentWorkoutProfile?.heightCm) data.heightCm = h;
    if (!isNaN(w) && w > 0 && w !== currentWorkoutProfile?.weightKg) data.weightKg = w;
    if (Object.keys(data).length) {
      updateWorkoutProfile(data);
      flash();
    }
  };

  const pickAccent = (id: AccentId) => {
    triggerHaptic(20);
    applyAccent(id);
    patchSettings({ accent: id });
  };


  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      updateProfile({ avatarUrl: dataUrl });
      flash();
    } catch {
      // ignore
    } finally {
      e.target.value = '';
    }
  };

  const hasCustomAvatar = Boolean(authUser?.avatarUrl);

  const handleClose = () => {
    triggerHaptic(20);
    if (onClose) {
      onClose();
    } else {
      setCurrentTab('home');
    }
  };

  return (
    <div className="p-5 space-y-4 overflow-y-auto no-scrollbar max-h-[80dvh]">
      {/* Cabecera: Título "Ajustes" + Avatar con "+" + Botón cerrar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--mk-ink)] leading-none">
            Ajustes
          </h1>
          <span
            className={`text-[10px] font-semibold text-emerald-500 flex items-center gap-1 mt-1 transition-opacity duration-300 ${
              savedFlash ? 'opacity-100' : 'opacity-0'
            }`}
            aria-live="polite"
          >
            <Check className="w-3 h-3" /> Guardado
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.div
            id="btn-avatar-upload"
            role="button"
            tabIndex={0}
            transition={{ duration: 0.3 }}
            onClick={() => fileRef.current?.click()}
            className="relative w-11 h-11 shrink-0 active:scale-95 transition-transform cursor-pointer"
            aria-label="Cambiar foto de perfil"
            title="Cambiar foto de perfil"
          >
            <span className="w-11 h-11 rounded-full overflow-hidden bg-[var(--mk-tile)] flex items-center justify-center border border-[var(--mk-field-border)]">
              {hasCustomAvatar ? (
                <Image
                  src={activeUser.avatarUrl}
                  alt={activeUser.displayName}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-[var(--mk-muted)]" />
              )}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#8d949c] text-white border-2 border-[var(--mk-card)] flex items-center justify-center">
              <Plus className="w-2.5 h-2.5" strokeWidth={3.5} />
            </span>
          </motion.div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar ajustes"
            title="Cerrar ajustes"
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 flex items-center justify-center text-[var(--mk-muted)] hover:text-[var(--mk-ink)] transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* INFORMACION PERSONAL */}
      <div className="space-y-1.5">
        <span className="mk-caption">Información personal</span>
        <input
          id="input-settings-name"
          className="mk-field"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          autoComplete="name"
        />
        <input
          id="input-settings-email"
          className="mk-field"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={commitEmail}
          autoComplete="email"
        />
      </div>

      {/* FISICO */}
      <div className="space-y-1.5">
        <span className="mk-caption">Físico</span>
        <div className="grid grid-cols-3 gap-2">
          <input
            id="input-settings-age"
            className="mk-field"
            inputMode="numeric"
            placeholder="Edad"
            value={settings.age}
            onChange={(e) => setSettings((p) => ({ ...p, age: e.target.value.replace(/[^\d]/g, '').slice(0, 3) }))}
            onBlur={() => patchSettings({ age: settings.age })}
          />
          <input
            id="input-settings-height"
            className="mk-field"
            inputMode="decimal"
            placeholder="Estatura"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={commitBody}
            aria-label="Estatura en centímetros"
          />
          <input
            id="input-settings-weight"
            className="mk-field"
            inputMode="decimal"
            placeholder="Peso"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={commitBody}
            aria-label="Peso en kilogramos"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-[9px] text-[var(--mk-muted)] px-1">
          <span>años</span>
          <span>cm</span>
          <span>kg</span>
        </div>
      </div>

      {/* DISEÑO */}
      <div className="space-y-2">
        <span className="mk-caption">Diseño</span>

        {/* 5 círculos de colores seleccionables */}
        <div className="rounded-[12px] border border-[var(--mk-field-border)] px-3.5 py-2.5 flex items-center justify-between">
          {ACCENTS.map((a) => {
            const active = settings.accent === a.id;
            return (
              <button
                key={a.id}
                id={`accent-${a.id}`}
                type="button"
                onClick={() => pickAccent(a.id)}
                aria-label={a.label}
                aria-pressed={active}
                title={a.label}
                className="w-8 h-8 flex items-center justify-center transition-transform active:scale-90 hover:scale-110"
              >
                <span
                  className="block w-[22px] h-[22px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: active ? a.color : a.soft,
                    boxShadow: active ? `0 4px 10px -2px ${a.color}99` : 'none',
                    transform: active ? 'scale(1.12)' : 'scale(1)',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* VACIADO Y DATOS DE PRUEBA */}
      <div className="space-y-2 pt-2 border-t border-[var(--mk-field-border)]">
        <span className="mk-caption">Modo de Datos</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([30, 40]);
              resetToEmptyState();
              flash();
            }}
            className="p-2.5 rounded-xl border border-[var(--mk-field-border)] bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-left transition-all active:scale-[0.98]"
          >
            <span className="text-[11px] font-bold text-[color:var(--accent-warm)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Vaciar Perfil
            </span>
            <span className="text-[9px] text-[var(--mk-muted)] block mt-0.5 leading-snug">
              Ver estado de recién llegado
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([30, 40]);
              loadDemoData();
              flash();
            }}
            className="p-2.5 rounded-xl border border-[var(--mk-field-border)] bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-left transition-all active:scale-[0.98]"
          >
            <span className="text-[11px] font-bold text-[var(--mk-ink)] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Cargar Demo
            </span>
            <span className="text-[9px] text-[var(--mk-muted)] block mt-0.5 leading-snug">
              Restaurar datos de ejemplo
            </span>
          </button>
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className="pt-2 border-t border-[var(--mk-field-border)] flex justify-center">
        <button
          id="btn-logout-settings"
          type="button"
          onClick={() => {
            triggerHaptic(50);
            if (onClose) onClose();
            logout();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold text-[var(--mk-muted)] hover:text-[color:var(--accent-warm)] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
