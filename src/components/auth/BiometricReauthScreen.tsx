'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BiometricReauthScreen() {
  const { reauthenticateBiometrics, setIsBiometricsPromptOpen, authUser, theme } = useApp();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const fired = useRef(false);

  const run = useCallback(async () => {
    setBusy(true);
    setError('');
    const res = await reauthenticateBiometrics();
    setBusy(false);
    if (!res.success) setError(res.error || 'No se pudo verificar tu identidad');
  }, [reauthenticateBiometrics]);

  // Auto-trigger the native prompt once on mount (zero friction)
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    run();
  }, [run]);

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 text-center">
      {/* Logotipo Hi!: Fondo blanco con isotipo rojo */}
      <div className="w-18 h-18 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3 border border-black/10 mb-2">
        <Image
          src="/logo-red.png"
          alt="Hi!"
          width={48}
          height={48}
          priority
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="mt-4 text-xl font-black tracking-tight">
        Hola{authUser ? `, ${authUser.displayName}` : ''}
      </h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Confirma con Face ID / Touch ID para continuar</p>

      <button
        onClick={run}
        disabled={busy}
        aria-label="Verificar con biometría"
        className="mt-8 w-20 h-20 rounded-full flex items-center justify-center fab-floating-solid"
      >
        {busy ? <Loader2 className="w-8 h-8 animate-spin" /> : <Fingerprint className="w-8 h-8" />}
      </button>

      {error && (
        <p role="alert" className="mt-4 text-xs font-bold text-[#d62725] dark:text-[color:var(--accent-warm)]">
          {error}
        </p>
      )}

      <button
        onClick={() => setIsBiometricsPromptOpen(false)}
        className="mt-8 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        Usar correo y contraseña
      </button>
    </main>
  );
}
