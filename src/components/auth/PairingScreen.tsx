'use client';

import React, { useState } from 'react';
import { Heart, Copy, Check, Loader2, Link2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function PairingScreen() {
  const { generatePairingCode, activePairingCode, pairWithCode, skipPairingForNow, triggerHaptic } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!activePairingCode) return;
    try {
      await navigator.clipboard.writeText(activePairingCode);
    } catch {
      // clipboard may be unavailable; ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    triggerHaptic(30);
    setLoading(true);
    const res = await pairWithCode(code);
    setLoading(false);
    if (!res.success) {
      triggerHaptic([40, 30, 40]);
      setError(res.error || 'No se pudo vincular');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center px-5 py-10 relative overflow-hidden transition-colors duration-300">
      <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-[color:var(--accent-warm)]/15 blur-[110px] pointer-events-none hidden dark:block" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-[#f67f00]/10 blur-[110px] pointer-events-none hidden dark:block" aria-hidden="true" />

      <section className="liquid-glass-sheet relative w-full max-w-md rounded-[var(--radius-card)] p-6 sm:p-8 animate-sheet-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#d62725]/10 dark:bg-[color:var(--accent-warm)]/15">
            <Heart className="w-6 h-6 text-[#d62725] dark:text-[color:var(--accent-warm)]" />
          </div>
          <h1 className="mt-4 text-xl font-black tracking-tight">Vincula a tu pareja</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Comidas y Calendario compartido funcionan cuando ambos están vinculados.
          </p>
        </div>

        {/* Opción A: Invitar */}
        <div className="mt-6">
          {!activePairingCode ? (
            <button
              id="pairing-generate"
              onClick={() => {
                triggerHaptic(40);
                generatePairingCode();
              }}
              className="w-full min-h-16 px-5 py-4 rounded-full font-bold text-sm text-[color:var(--on-accent)] border border-white/60 shadow-lg active:scale-[0.98] transition-all"
              style={{
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%), linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-warm-2) 100%)',
                boxShadow: '0 12px 26px -8px rgba(214,39,37,0.35), inset 0 1.5px 0.5px rgba(255,255,255,0.7)',
              }}
            >
              Generar Código de Invitación para mi Pareja
            </button>
          ) : (
            <div className="rounded-[var(--radius-card)] p-4 text-center neu-input">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Comparte este código
              </p>
              <p className="mt-1 text-4xl font-black tracking-[0.3em] pl-[0.3em] text-[#d62725] dark:text-[color:var(--accent-warm)]" aria-live="polite">
                {activePairingCode}
              </p>
              <button
                onClick={copyCode}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar código'}
              </button>
            </div>
          )}
        </div>

        <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <span className="flex-1 h-px bg-[var(--border-subtle)]" /> o <span className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Opción B: Unirse */}
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="sr-only">Ingresar código de mi pareja</span>
            <input
              id="pairing-code-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="Ingresar código de mi pareja"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="neu-input w-full h-14 px-4 rounded-[var(--radius-card)] text-center text-sm font-bold tracking-widest outline-none placeholder:tracking-normal placeholder:font-semibold"
            />
          </label>
          {error && (
            <p role="alert" className="text-xs font-bold text-[#d62725] dark:text-[color:var(--accent-warm)] text-center">
              {error}
            </p>
          )}
          <button
            id="pairing-submit"
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full h-14 rounded-full bg-[#003049] hover:bg-[#002538] text-[#ebe2b7] font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            Vincular
          </button>
        </form>

        <button
          onClick={skipPairingForNow}
          className="mt-5 w-full text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          Más tarde
        </button>
      </section>
    </main>
  );
}
