'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import AuthGate from '@/components/auth/AuthGate';
import { useApp } from '@/context/AppContext';
import DashboardView from '@/components/dashboard/DashboardView';
import CalendarView from '@/components/calendar/CalendarView';
import MealsView from '@/components/meals/MealsView';
import FinancesView from '@/components/finances/FinancesView';
import LifestyleView from '@/components/lifestyle/LifestyleView';
import SettingsView from '@/components/settings/SettingsView';

export default function Home() {
  const { currentTab } = useApp();

  return (
    <AuthGate>
      <AppLayout>
        {currentTab === 'home' && <DashboardView />}
        {currentTab === 'calendar' && <CalendarView />}
        {currentTab === 'meals' && <MealsView />}
        {currentTab === 'finances' && <FinancesView />}
        {(currentTab === 'lifestyle' || currentTab === 'workout') && <LifestyleView />}
        {currentTab === 'settings' && <SettingsView />}
      </AppLayout>
    </AuthGate>
  );
}
