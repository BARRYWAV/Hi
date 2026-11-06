'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import AuthGate from '@/components/auth/AuthGate';
import { useApp } from '@/context/AppContext';
import DashboardView from '@/components/dashboard/DashboardView';
import CalendarView from '@/components/calendar/CalendarView';
import AppsView from '@/components/apps/AppsView';
import SettingsView from '@/components/settings/SettingsView';

export default function Home() {
  const { currentTab } = useApp();

  return (
    <AuthGate>
      <AppLayout>
        {currentTab === 'home' && <DashboardView />}
        {currentTab === 'apps' && <AppsView />}
        {currentTab === 'calendar' && <CalendarView />}
        {currentTab === 'meals' && <AppsView initialApp="meals" />}
        {currentTab === 'finances' && <AppsView initialApp="finances" />}
        {currentTab === 'workout' && <AppsView initialApp="workout" />}
        {currentTab === 'lifestyle' && <AppsView initialApp="couple" />}
        {currentTab === 'settings' && <SettingsView />}
      </AppLayout>
    </AuthGate>
  );
}
