'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Glass, TabBar } from 'glisse';
import { useApp, type AppTab } from '@/context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Banknote,
  HeartPulse,
  Plus,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import QuickCaptureSheet from '@/components/modals/QuickCaptureSheet';
import WorkoutPlayerModal from '@/components/workout/WorkoutPlayerModal';
import SettingsView from '@/components/settings/SettingsView';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { GlassFold } from '@/components/ui/glass-fold';
import { applyAccent, loadSettings } from '@/lib/settings';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'finances', label: 'Finanzas', icon: Banknote },
  { id: 'lifestyle', label: 'Estilo de Vida', icon: HeartPulse },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {
    activeUser,
    authUser,
    logout,
    currentTab,
    setCurrentTab,
    openCaptureSheet,
    triggerHaptic,
    theme,
    setLifestyleSubView,
    isCaptureSheetOpen,
    isWorkoutPlayerOpen,
  } = useApp();

  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const [isModalActive, setIsModalActive] = React.useState(false);

  // Detección precisa de teclado virtual en iPhone / iOS y modales abiertos
  useEffect(() => {
    // 1. Detectar cuando un campo de texto toma o pierde el foco
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        setIsKeyboardVisible(true);
        document.body.classList.add('keyboard-visible');
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        const isEditing =
          active &&
          (active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.tagName === 'SELECT' ||
            active.isContentEditable);
        if (!isEditing) {
          setIsKeyboardVisible(false);
          document.body.classList.remove('keyboard-visible');
        }
      }, 80);
    };

    // 2. Detectar redimensionamiento del visualViewport en iOS Safari / PWA
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      const heightDiff = window.innerHeight - window.visualViewport.height;
      if (heightDiff > 120) {
        setIsKeyboardVisible(true);
        document.body.classList.add('keyboard-visible');
      } else {
        const active = document.activeElement as HTMLElement | null;
        const isEditing =
          active &&
          (active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.tagName === 'SELECT' ||
            active.isContentEditable);
        if (!isEditing) {
          setIsKeyboardVisible(false);
          document.body.classList.remove('keyboard-visible');
        }
      }
    };

    // 3. Listener para eventos de apertura de modales
    const handleModalChange = (e: Event) => {
      const custom = e as CustomEvent<{ isOpen?: boolean }>;
      setIsModalActive(Boolean(custom.detail?.isOpen));
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    window.addEventListener('app-modal-change', handleModalChange);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('app-modal-change', handleModalChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

  const shouldHideDock =
    isCaptureSheetOpen || isWorkoutPlayerOpen || isKeyboardVisible || isModalActive;

  const [previousTab, setPreviousTab] = React.useState<AppTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // Si algún componente invoca setCurrentTab('settings') (ej. Avatar en Dashboard),
  // abrimos la isla flotante centrada de Ajustes sin desmontar la vista de fondo.
  useEffect(() => {
    if (currentTab === 'settings') {
      setIsSettingsOpen(true);
      setCurrentTab(previousTab && previousTab !== 'settings' ? previousTab : 'home');
    }
  }, [currentTab, previousTab, setCurrentTab]);

  // Preferencias de Ajustes → Diseño (acento visual)
  useEffect(() => {
    const s = loadSettings();
    applyAccent(s.accent);
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-density');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTabActive = (id: string) =>
    (id === 'settings' && isSettingsOpen) ||
    currentTab === id ||
    (id === 'lifestyle' && (currentTab === 'workout' || currentTab === 'meals'));

  // El botón (+) siempre muestra todos los apartados; solo abre en la pestaña de la sección actual
  const handleFabCapture = () => {
    if (currentTab === 'finances') openCaptureSheet('finances', false);
    else if (currentTab === 'meals') openCaptureSheet('nutrition', false);
    else openCaptureSheet('habits', false);
  };

  const goTo = (id: (typeof NAV_ITEMS)[number]['id'] | 'settings') => {
    triggerHaptic(20);
    if (id === 'settings') {
      setIsSettingsOpen(true);
      return;
    }
    setIsSettingsOpen(false);
    if (id === 'lifestyle') setLifestyleSubView('hub');
    setPreviousTab(id);
    setCurrentTab(id);
  };

  const toggleSettings = () => {
    triggerHaptic(20);
    setIsSettingsOpen((v) => !v);
  };

  const handleLogout = () => {
    triggerHaptic(50);
    logout();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col lg:flex-row transition-colors duration-300 relative overflow-hidden">
      {/* Lienzo de fondo global */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <GlassFold
          mode={theme === 'light' ? 'light' : 'dark'}
          className="w-full h-full"
        />
      </div>

      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR                                           */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex w-76 flex-col justify-between p-6 bg-[var(--lg-frosted-bg)] backdrop-blur-3xl saturate-[185%] border-r border-[var(--mk-border)] shrink-0 sticky top-0 h-screen transition-all duration-300 z-20 shadow-[var(--mk-shadow)]">
        {/* Brand Logo & Sync Badge */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logotipo Hi! */}
              <div className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-white/95 shadow-md flex items-center justify-center p-2 border border-white/60 shrink-0 transition-transform hover:scale-105 active:scale-95 duration-200">
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
              <div>
                <h2 className="text-base font-black tracking-tight text-[color:var(--accent-warm)] transition-colors duration-300">
                  Hi!
                </h2>
                <p className="text-[11px] text-[#f67f00] font-bold">
                  {authUser?.isPaired
                    ? `${activeUser.displayName} & ${authUser.partnerName}`
                    : 'Espacio Personal'}
                </p>
              </div>
            </div>

            {/* Quick Sun/Moon toggle in sidebar top */}
            <ThemeToggle variant="compact" />
          </div>

          {/* Account Card (Desktop) */}
          <div className="p-3.5 rounded-[var(--radius-card)] mk-card space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--mk-muted)]">
                Mi cuenta
              </span>
              <button
                id="btn-logout-desktop"
                onClick={handleLogout}
                className="text-[11px] font-bold text-[#d62725] dark:text-[color:var(--accent-warm)] hover:opacity-80 inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full transition-opacity"
                title="Salir"
              >
                <LogOut className="w-3.5 h-3.5" /> Salir
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[color:var(--accent-warm)] p-0.5 shadow-sm shrink-0 bg-[var(--mk-tile)] flex items-center justify-center">
                {activeUser.avatarUrl ? (
                  <Image
                    src={activeUser.avatarUrl}
                    alt={activeUser.displayName || 'Usuario'}
                    width={44}
                    height={44}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 text-[color:var(--accent-warm)]" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold truncate text-[var(--text-primary)]">
                  {activeUser.displayName || 'Usuario'}
                </h4>
                <span className="text-[10px] text-[#003049] dark:text-[#ebe2b7] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {authUser?.isPaired ? `Vinculado con ${authUser.partnerName}` : 'Sin pareja vinculada'}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de Texturas On/Off Deslizante (Sol y Luna) */}
          <ThemeToggle variant="expanded" />

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {[...NAV_ITEMS, { id: 'settings', label: 'Ajustes', icon: Settings } as const].map((item) => {
              const Icon = item.icon;
              const isActive = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => {
                    if (item.id === 'settings') {
                      toggleSettings();
                    } else {
                      goTo(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full font-bold text-xs transition-all touch-target-lg lg-btn ${
                    isActive
                      ? 'lg-btn-accent shadow-md'
                      : 'text-[var(--mk-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--mk-tile)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick FAB capture trigger on desktop */}
        <div className="pt-4 border-t border-[var(--mk-border)] space-y-2.5">
          <button
            onClick={handleFabCapture}
            className="w-full py-3.5 rounded-full lg-btn lg-btn-primary text-[#ebe2b7] font-bold text-xs flex items-center justify-center gap-2 transition-all touch-target-lg shadow-md"
          >
            <Plus className="w-4 h-4" /> Captura Rápida
          </button>
          <div className="text-[10px] text-[var(--mk-muted)] text-center font-medium">
            PWA Ready • Railway PostgreSQL
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEW CONTENT AREA                                    */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent pb-24 lg:pb-0 transition-colors duration-300 relative z-10">
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 px-3 pt-3 pb-1">
          <Glass className="liquid-glass-pill rounded-full px-3.5 py-1.5 flex items-center justify-between gap-2 backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => goTo('home')}
              className="flex items-center gap-2 active:scale-95 transition-transform"
              aria-label="Ir al Dashboard"
            >
              <div
                className="w-6 h-6 shrink-0 transition-colors duration-300"
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
              <span className="text-[14px] font-black tracking-tight text-[color:var(--accent-warm)] transition-colors duration-300">
                Hi!
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <ThemeToggle variant="compact" />

              <button
                id="btn-settings-mobile"
                type="button"
                onClick={toggleSettings}
                aria-label={isSettingsOpen ? 'Salir de Ajustes' : 'Ajustes'}
                title={isSettingsOpen ? 'Salir de Ajustes' : 'Ajustes'}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                  isSettingsOpen
                    ? 'lg-btn-accent text-[color:var(--on-accent)] border-transparent shadow-md'
                    : 'lg-btn-frosted text-[color:var(--accent-warm)] border-[var(--mk-field-border)]'
                }`}
              >
                <Settings className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>
          </Glass>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 pt-3 pb-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MOBILE DOCK: Barra de selección Glisse TabBar + Botón (+) */}
      {/* ========================================================= */}
      <div
        id="mobile-dock-container"
        className={`lg:hidden fixed bottom-[calc(1.75rem+env(safe-area-inset-bottom))] inset-x-3 z-40 max-w-md mx-auto pointer-events-none transition-all duration-300 ease-out ${
          shouldHideDock
            ? 'dock-hidden translate-y-32 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center justify-center gap-2.5 pointer-events-auto">
          <TabBar
            aria-label="Navegación principal"
            className="glisse-dock-tabbar shadow-2xl"
            value={
              currentTab === 'workout' || currentTab === 'meals'
                ? 'lifestyle'
                : currentTab === 'settings'
                ? previousTab
                : currentTab
            }
            onValueChange={(id: string) => goTo(id as (typeof NAV_ITEMS)[number]['id'])}
            items={[
              {
                value: 'home',
                icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.2} />,
                label: '',
              },
              {
                value: 'calendar',
                icon: <Calendar className="w-5 h-5" strokeWidth={2.2} />,
                label: '',
              },
              {
                value: 'finances',
                icon: <Banknote className="w-5 h-5" strokeWidth={2.2} />,
                label: '',
              },
              {
                value: 'lifestyle',
                icon: <HeartPulse className="w-5 h-5" strokeWidth={2.2} />,
                label: '',
              },
            ]}
          />

          {/* FAB persistente de captura rápida (+) */}
          <motion.div
            id="fab-quick-capture"
            role="button"
            tabIndex={0}
            aria-label="Captura rápida"
            transition={{ duration: 0.3 }}
            onClick={handleFabCapture}
            className="w-[54px] h-[54px] shrink-0 rounded-full fab-floating-solid flex items-center justify-center active:scale-95 transition-all duration-200 cursor-pointer shadow-xl"
            title="Captura Rápida"
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </motion.div>
        </div>
      </div>

      {/* Islas Flotantes Globales (Centradas) */}
      <QuickCaptureSheet />
      <LiquidGlassSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        maxWidth="max-w-[380px]"
        isCenter={true}
      >
        <SettingsView onClose={() => setIsSettingsOpen(false)} />
      </LiquidGlassSheet>
      <WorkoutPlayerModal />
    </div>
  );
}
