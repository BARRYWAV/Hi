'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import LoginScreen from '@/components/auth/LoginScreen';
import PairingScreen from '@/components/auth/PairingScreen';
import BiometricReauthScreen from '@/components/auth/BiometricReauthScreen';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { authStatus, isBiometricsPromptOpen, isPairingFlowActive, theme } = useApp();

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        {/* Logotipo Hi!: Fondo blanco con isotipo rojo */}
        <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-2.5 border border-black/10 animate-pulse">
          <Image
            src="/logo-red.png"
            alt="Hi!"
            width={44}
            height={44}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return isBiometricsPromptOpen ? <BiometricReauthScreen /> : <LoginScreen />;
  }

  if (isPairingFlowActive) return <PairingScreen />;

  return <>{children}</>;
}
