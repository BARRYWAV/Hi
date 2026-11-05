'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, Fingerprint } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { GlassFold } from '@/components/ui/glass-fold';

export default function LoginScreen() {
  const { login, signup, theme, triggerHaptic, authUser, loginWithBiometrics, resetToEmptyState } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password || (isSignup && !name.trim())) {
      setError('Completa todos los campos');
      return;
    }
    if (isSignup && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    triggerHaptic(30);
    setLoading(true);
    const res = isSignup ? await signup(name, email, password) : await login(email, password);
    setLoading(false);
    if (!res.success) {
      triggerHaptic([40, 30, 40]);
      setError(res.error || 'No se pudo continuar');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden transition-colors duration-300">
      {/* Lienzo de fondo global */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <GlassFold
          mode={theme === 'light' ? 'light' : 'dark'}
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle variant="compact" />
      </div>

      <div className="relative z-10 w-full max-w-sm mk-card p-7 flex flex-col items-center backdrop-blur-3xl saturate-[190%]">
        {/* Logotipo Hi!: Lente Domo con isotipo dinámico (Rojo en Día / Amarillo en Noche) */}
        <div className="w-20 h-20 rounded-[24px] bg-white/90 dark:bg-white/95 shadow-lg flex items-center justify-center p-3 border border-white/80 lg-btn-dome">
          <div
            className="w-full h-full shrink-0 transition-colors duration-300"
            style={{
              maskImage: 'url(/logo-red.png)',
              WebkitMaskImage: 'url(/logo-red.png)',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              backgroundColor: 'var(--accent-warm)',
            }}
          />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-[color:var(--accent-warm)] transition-colors duration-300">
          Hi!
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)] text-center">
          {isSignup ? 'Crea tu cuenta para empezar' : 'Inicia sesión para continuar'}
        </p>

        <form onSubmit={submit} className="w-full mt-8 space-y-4" noValidate>
          {isSignup && (
            <label className="block">
              <span className="sr-only">Nombre</span>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neu-input w-full h-14 pl-11 pr-4 rounded-[var(--radius-card)] text-sm font-semibold outline-none"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="sr-only">Correo electrónico</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input w-full h-14 pl-11 pr-4 rounded-[var(--radius-card)] text-sm font-semibold outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Contraseña</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                id="auth-password"
                type={showPw ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input w-full h-14 pl-11 pr-12 rounded-[var(--radius-card)] text-sm font-semibold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="text-xs font-bold text-[#d62725] dark:text-[color:var(--accent-warm)] text-center">
              {error}
            </p>
          )}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-[#003049] hover:bg-[#002538] text-[#ebe2b7] font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSignup ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        {!isSignup && authUser?.biometricsEnabled && (
          <button
            type="button"
            onClick={() => loginWithBiometrics()}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Fingerprint className="w-4 h-4" /> Usar Face ID / Touch ID
          </button>
        )}

        <button
          id="auth-toggle-mode"
          type="button"
          onClick={() => {
            setError('');
            setMode(isSignup ? 'login' : 'signup');
          }}
          className="mt-6 text-sm font-bold text-[#d62725] dark:text-[color:var(--accent-warm)] hover:underline underline-offset-4"
        >
          {isSignup ? 'Ya tengo cuenta, iniciar sesión' : 'Crear cuenta nueva'}
        </button>

        <button
          id="auth-guest-mode"
          type="button"
          onClick={() => {
            triggerHaptic(20);
            resetToEmptyState();
          }}
          className="mt-3 text-xs font-semibold text-[var(--mk-muted)] hover:text-[var(--mk-ink)] transition-colors"
        >
          Explorar como nuevo usuario (Vacío)
        </button>
      </div>
    </main>
  );
}
