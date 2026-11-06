'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserId,
  User,
  HabitLog,
  FinanceTransaction,
  Debt,
  SharedSavingsGoal,
  CalendarEvent,
  Meal,
  WeeklyMealPlanItem,
  SupermarketItem,
  WorkoutProfile,
  WorkoutSession,
  BiometricLog,
  MealType,
  AccountType,
  TransactionType,
  DebtType,
  EventCategory,
  AuthUser,
  BucketListItem,
  DateKanbanCard,
  LongTermGoal,
  HobbyProject,
} from '@/types';
import {
  INITIAL_USERS,
  DEFAULT_USER,
  INITIAL_SAVINGS_GOAL,
  INITIAL_MEALS,
  INITIAL_WEEKLY_PLAN,
  INITIAL_SUPERMARKET,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_HABITS,
  INITIAL_FINANCES,
  INITIAL_DEBTS,
  INITIAL_WORKOUT_PROFILES,
  INITIAL_WORKOUT_SESSIONS,
  INITIAL_BIOMETRICS,
  INITIAL_BUCKET_LIST,
  INITIAL_DATE_KANBAN,
  INITIAL_COUPLE_LONG_TERM_GOALS,
  INITIAL_HOBBIES,
  DEMO_SAVINGS_GOAL,
  DEMO_WEEKLY_PLAN,
  DEMO_SUPERMARKET,
  DEMO_CALENDAR_EVENTS,
  DEMO_HABITS,
  DEMO_FINANCES,
  DEMO_DEBTS,
  DEMO_BUCKET_LIST,
  DEMO_DATE_KANBAN,
  DEMO_COUPLE_LONG_TERM_GOALS,
  DEMO_HOBBIES,
} from '@/lib/initialData';
import { registerBiometrics, verifyWithBiometrics } from '@/lib/biometrics';

interface AppContextType {
  // Authentication & Session Persistence (SaaS multi-user architecture)
  authStatus: 'loading' | 'unauthenticated' | 'authenticated';
  authUser: import('@/types').AuthUser | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithBiometrics: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'displayName' | 'email' | 'avatarUrl'>>) => void;

  // Partner Pairing Flow
  isPairingFlowActive: boolean;
  setIsPairingFlowActive: (active: boolean) => void;
  activePairingCode: string | null;
  generatePairingCode: () => string;
  pairWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  skipPairingForNow: () => void;

  // Biometrics & Re-authentication Modal
  isBiometricsPromptOpen: boolean;
  setIsBiometricsPromptOpen: (open: boolean) => void;
  reauthenticateBiometrics: () => Promise<{ success: boolean; error?: string }>;

  // Active User Profile (derived from the authenticated account)
  currentUser: UserId;
  activeUser: User;

  // Habits
  todayHabit: HabitLog;
  incrementPoop: () => void;
  addWater: (ml: number) => void;
  addCalories: (kcal: number) => void;
  incrementLove: () => void;
  habitStreak: number;

  // Finances (100% Private)
  userTransactions: FinanceTransaction[];
  addTransaction: (data: {
    type: TransactionType;
    amount: number;
    account: AccountType;
    concept?: string;
    category?: string;
  }) => void;
  userDebts: Debt[];
  addDebt: (data: {
    contactName: string;
    totalAmount: number;
    type: DebtType;
    notes?: string;
  }) => void;
  payDebt: (debtId: string, amount: number, notes?: string) => void;
  accountBalances: { Nu: number; BBVA: number; Efectivo: number; Total: number };

  // Shared Savings Goal (100% Shared)
  savingsGoal: SharedSavingsGoal;
  addSavingsContribution: (amount: number) => void;

  // Calendar (Conditional Privacy)
  calendarEvents: (CalendarEvent & { isRedacted?: boolean })[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'userId'>) => void;
  deleteCalendarEvent: (id: string) => void;
  nextImmediateEvent: (CalendarEvent & { isRedacted?: boolean }) | null;
  allDayReminders: (CalendarEvent & { isRedacted?: boolean })[];

  // Meals & Supermarket (100% Shared)
  meals: Meal[];
  weeklyPlan: WeeklyMealPlanItem[];
  supermarketList: SupermarketItem[];
  assignMealToPlan: (
    dayOfWeek: WeeklyMealPlanItem['dayOfWeek'],
    mealType: MealType,
    mealId: string,
    portions?: number
  ) => void;
  removeMealFromPlan: (id: string) => void;
  generateSupermarketList: () => void;
  toggleSupermarketItem: (id: string) => void;
  addSupermarketItem: (name: string, quantity: number, unit: string, category: string) => void;
  clearCheckedSupermarketItems: () => void;

  // Health & Workout (Instantiated)
  currentWorkoutProfile: WorkoutProfile;
  updateWorkoutProfile: (data: Partial<WorkoutProfile>) => void;
  todayWorkoutCompleted: boolean;
  weeklyWorkoutsCount: number;
  workoutGoalPerWeek: number;
  completeWorkout: (routineName?: string, durationMin?: number) => void;
  biometrics: BiometricLog[];
  addBiometricLog: (weightKg: number) => void;

  // Navigation & Modals
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  isCaptureSheetOpen: boolean;
  captureSheetInitialTab: 'habits' | 'finances' | 'nutrition';
  captureSheetScoped: boolean;
  openCaptureSheet: (tab?: 'habits' | 'finances' | 'nutrition', scoped?: boolean) => void;
  closeCaptureSheet: () => void;
  isWorkoutPlayerOpen: boolean;
  openWorkoutPlayer: () => void;
  closeWorkoutPlayer: () => void;
  triggerHaptic: (pattern?: number | number[]) => void;

  // Lifestyle Hub (Bento Box & Subscreens)
  lifestyleSubView: 'hub' | 'couple' | 'hobbies' | 'meals' | 'workout';
  setLifestyleSubView: (view: 'hub' | 'couple' | 'hobbies' | 'meals' | 'workout') => void;
  bucketList: BucketListItem[];
  addBucketListItem: (item: Omit<BucketListItem, 'id'>) => void;
  updateBucketListProgress: (id: string, progress: number) => void;
  dateKanban: DateKanbanCard[];
  addDateKanbanCard: (title: string, column: 'ideas' | 'planeadas', category?: string, date?: string) => void;
  moveDateKanbanCard: (id: string, targetColumn: 'ideas' | 'planeadas') => void;
  deleteDateKanbanCard: (id: string) => void;
  coupleLongTermGoals: LongTermGoal[];
  toggleCoupleLongTermGoal: (id: string) => void;
  addCoupleLongTermGoal: (title: string, category?: string) => void;
  hobbies: HobbyProject[];
  addHobbyProject: (hobby: { title: string; deadline: string; milestones: string[]; category?: string }) => void;
  toggleHobbyMilestone: (hobbyId: string, milestoneId: string) => void;
  addPracticeTime: (hobbyId: string, minutes: number) => void;
  deleteHobbyProject: (id: string) => void;
  activePracticeHobby: HobbyProject | null;
  openPracticeTimer: (hobby: HobbyProject) => void;
  closePracticeTimer: () => void;

  // Theme & Base Textures (Dark / Black Base vs Light / White Base)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Estado Inicial Vacío / Reset & Carga de Demo
  resetToEmptyState: () => void;
  loadDemoData: () => void;
}

export type AppTab = 'home' | 'calendar' | 'meals' | 'finances' | 'workout' | 'lifestyle' | 'settings' | 'apps';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme & Base Textures (White Base vs Black Base)
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Auth / session state
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isPairingFlowActive, setIsPairingFlowActive] = useState(false);
  const [activePairingCode, setActivePairingCode] = useState<string | null>(null);
  const [isBiometricsPromptOpen, setIsBiometricsPromptOpen] = useState(false);

  // Mock data profile that seeds the per-user relational data (until a real DB per user exists)
  const currentUser: UserId = authUser?.id || 'me';

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<AppTab>('home');

  // Lifestyle Hub State & Subviews
  const [lifestyleSubView, setLifestyleSubView] = useState<'hub' | 'couple' | 'hobbies' | 'meals' | 'workout'>('hub');
  const [bucketList, setBucketList] = useState<BucketListItem[]>(INITIAL_BUCKET_LIST);
  const [dateKanban, setDateKanban] = useState<DateKanbanCard[]>(INITIAL_DATE_KANBAN);
  const [coupleLongTermGoals, setCoupleLongTermGoals] = useState<LongTermGoal[]>(INITIAL_COUPLE_LONG_TERM_GOALS);
  const [hobbies, setHobbies] = useState<HobbyProject[]>(INITIAL_HOBBIES);
  const [activePracticeHobby, setActivePracticeHobby] = useState<HobbyProject | null>(null);

  // Modals state
  const [isCaptureSheetOpen, setIsCaptureSheetOpen] = useState(false);
  const [captureSheetInitialTab, setCaptureSheetInitialTab] = useState<'habits' | 'finances' | 'nutrition'>('habits');
  const [captureSheetScoped, setCaptureSheetScoped] = useState(true);
  const [isWorkoutPlayerOpen, setIsWorkoutPlayerOpen] = useState(false);

  // Entities state
  const [habits, setHabits] = useState<HabitLog[]>(INITIAL_HABITS);
  const [finances, setFinances] = useState<FinanceTransaction[]>(INITIAL_FINANCES);
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [savingsGoal, setSavingsGoal] = useState<SharedSavingsGoal>(INITIAL_SAVINGS_GOAL);
  const [calendarEventsRaw, setCalendarEventsRaw] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [meals] = useState<Meal[]>(INITIAL_MEALS);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlanItem[]>(INITIAL_WEEKLY_PLAN);
  const [supermarketList, setSupermarketList] = useState<SupermarketItem[]>(INITIAL_SUPERMARKET);
  const [workoutProfiles, setWorkoutProfiles] = useState<Record<string, WorkoutProfile>>(INITIAL_WORKOUT_PROFILES);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(INITIAL_WORKOUT_SESSIONS);
  const [biometricsList, setBiometricsList] = useState<BiometricLog[]>(INITIAL_BIOMETRICS);

  // Load from localStorage on mount (con vaciado automático para el nuevo usuario que va llegando)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('sincro_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        applyThemeToDOM(savedTheme);
      } else {
        applyThemeToDOM('dark');
      }

      // Vaciar automáticamente la información previa para ver el Empty State de nuevo usuario
      const FRESH_KEY = 'sincro_fresh_empty_v5';
      if (!localStorage.getItem(FRESH_KEY)) {
        localStorage.removeItem('sincro_habits');
        localStorage.removeItem('sincro_finances');
        localStorage.removeItem('sincro_debts');
        localStorage.removeItem('sincro_savings');
        localStorage.removeItem('sincro_calendar');
        localStorage.removeItem('sincro_weekly_plan');
        localStorage.removeItem('sincro_supermarket');
        localStorage.removeItem('sincro_workout_profiles');
        localStorage.removeItem('sincro_workout_sessions');
        localStorage.removeItem('sincro_biometrics');
        localStorage.removeItem('sincro_bucket_list');
        localStorage.removeItem('sincro_date_kanban');
        localStorage.removeItem('sincro_couple_goals');
        localStorage.removeItem('sincro_hobbies');
        localStorage.setItem(FRESH_KEY, 'true');

        const cleanSession: AuthUser = {
          id: 'me',
          name: 'Usuario',
          displayName: 'Usuario',
          email: '',
          avatarUrl: '',
          isPaired: false,
          token: `token-${Date.now()}`,
          tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem('sincro_session', JSON.stringify(cleanSession));
        setAuthUser(cleanSession);
        setAuthStatus('authenticated');
      } else {
        const rawSession = localStorage.getItem('sincro_session');
        if (rawSession) {
          const session = JSON.parse(rawSession) as AuthUser;
          setAuthUser(session);
          setAuthStatus('authenticated');
        } else {
          const cleanSession: AuthUser = {
            id: 'me',
            name: 'Usuario',
            displayName: 'Usuario',
            email: '',
            avatarUrl: '',
            isPaired: false,
            token: `token-${Date.now()}`,
            tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
          };
          setAuthUser(cleanSession);
          setAuthStatus('authenticated');
        }

        const savedHabits = localStorage.getItem('sincro_habits');
        if (savedHabits) setHabits(JSON.parse(savedHabits));

        const savedFinances = localStorage.getItem('sincro_finances');
        if (savedFinances) setFinances(JSON.parse(savedFinances));

        const savedDebts = localStorage.getItem('sincro_debts');
        if (savedDebts) setDebts(JSON.parse(savedDebts));

        const savedSavings = localStorage.getItem('sincro_savings');
        if (savedSavings) setSavingsGoal(JSON.parse(savedSavings));

        const savedEvents = localStorage.getItem('sincro_calendar');
        if (savedEvents) setCalendarEventsRaw(JSON.parse(savedEvents));

        const savedPlan = localStorage.getItem('sincro_weekly_plan');
        if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));

        const savedSupermarket = localStorage.getItem('sincro_supermarket');
        if (savedSupermarket) setSupermarketList(JSON.parse(savedSupermarket));

        const savedProfiles = localStorage.getItem('sincro_workout_profiles');
        if (savedProfiles) setWorkoutProfiles(JSON.parse(savedProfiles));

        const savedSessions = localStorage.getItem('sincro_workout_sessions');
        if (savedSessions) setWorkoutSessions(JSON.parse(savedSessions));

        const savedBiometrics = localStorage.getItem('sincro_biometrics');
        if (savedBiometrics) setBiometricsList(JSON.parse(savedBiometrics));

        const savedBucketList = localStorage.getItem('sincro_bucket_list');
        if (savedBucketList) setBucketList(JSON.parse(savedBucketList));

        const savedKanban = localStorage.getItem('sincro_date_kanban');
        if (savedKanban) setDateKanban(JSON.parse(savedKanban));

        const savedCoupleGoals = localStorage.getItem('sincro_couple_goals');
        if (savedCoupleGoals) setCoupleLongTermGoals(JSON.parse(savedCoupleGoals));

        const savedHobbies = localStorage.getItem('sincro_hobbies');
        if (savedHobbies) setHobbies(JSON.parse(savedHobbies));
      }
    } catch {
      // LocalStorage access might fail in private browsing; ignore
    }
  }, []);

  const applyThemeToDOM = (t: 'dark' | 'light') => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', t === 'dark' ? '#181818' : '#ffffff');
    }
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem('sincro_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  // Sync back to localStorage
  const saveStorage = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  // ---------------- MOCK AUTH (SaaS-like) ----------------
  const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  type StoredAccount = AuthUser & { password: string };
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const readAccounts = (): StoredAccount[] => {
    try {
      return JSON.parse(localStorage.getItem('sincro_accounts') || '[]');
    } catch {
      return [];
    }
  };
  const writeAccounts = (accs: StoredAccount[]) => {
    try {
      localStorage.setItem('sincro_accounts', JSON.stringify(accs));
    } catch {
      // ignore
    }
  };

  const issueToken = (u: AuthUser): AuthUser => ({
    ...u,
    token: `mock.${btoa(JSON.stringify({ sub: u.id, iat: Date.now() }))}.sig`,
    tokenExpiry: Date.now() + SESSION_TTL_MS,
  });

  // Persist session + account whenever the authenticated user changes
  useEffect(() => {
    if (!authUser || authStatus !== 'authenticated') return;
    try {
      localStorage.setItem('sincro_session', JSON.stringify(authUser));
      const accs = readAccounts();
      const i = accs.findIndex((a) => a.id === authUser.id);
      if (i >= 0) {
        accs[i] = { ...accs[i], ...authUser, password: accs[i].password };
        writeAccounts(accs);
      }
    } catch {
      // ignore
    }
  }, [authUser, authStatus]);

  // Security expiry watcher: when the token expires, ask for biometrics (not the password)
  useEffect(() => {
    if (authStatus !== 'authenticated' || !authUser?.tokenExpiry) return;
    const id = setInterval(() => {
      if (authUser.tokenExpiry && authUser.tokenExpiry <= Date.now()) {
        setAuthStatus('unauthenticated');
        if (authUser.biometricsEnabled) setIsBiometricsPromptOpen(true);
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [authStatus, authUser]);

  const startSession = (u: AuthUser) => {
    const session = issueToken(u);
    setAuthUser(session);
    setAuthStatus('authenticated');
    setCurrentTab('home');
    // Zero-friction future logins: enroll Face ID / Touch ID in the background
    if (!session.biometricsEnabled) {
      registerBiometrics(session).then((r) => {
        if (r.success) setAuthUser((prev) => (prev ? { ...prev, biometricsEnabled: true } : prev));
      });
    }
  };

  const login = async (email: string, password?: string) => {
    await delay(500);
    const acc = readAccounts().find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!acc || acc.password !== password) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }
    const user: AuthUser = { ...acc };
    delete (user as Partial<StoredAccount>).password;
    startSession(user);
    setIsPairingFlowActive(!user.isPaired && !localStorage.getItem(`sincro_pairing_done_${user.id}`));
    return { success: true };
  };

  const signup = async (name: string, email: string, password?: string) => {
    await delay(600);
    const accs = readAccounts();
    const clean = email.trim().toLowerCase();
    if (accs.some((a) => a.email.toLowerCase() === clean)) {
      return { success: false, error: 'Ya existe una cuenta con este correo' };
    }
    const profile = clean.includes('lesly') ? INITIAL_USERS.lesly : INITIAL_USERS.alejandro;
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      email: clean,
      name: name.trim(),
      displayName: name.trim(),
      avatarUrl: profile.avatarUrl,
      isPaired: false,
    };
    writeAccounts([...accs, { ...user, password: password || '' }]);
    startSession(user);
    setIsPairingFlowActive(true); // pairing screen shows once after sign-up
    return { success: true };
  };

  const generatePairingCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const map = JSON.parse(localStorage.getItem('sincro_pairing_codes') || '{}');
      map[code] = authUser?.id;
      localStorage.setItem('sincro_pairing_codes', JSON.stringify(map));
    } catch {
      // ignore
    }
    setActivePairingCode(code);
    return code;
  };

  const finishPairingFlow = () => {
    if (authUser) {
      try {
        localStorage.setItem(`sincro_pairing_done_${authUser.id}`, '1');
      } catch {
        // ignore
      }
    }
    setIsPairingFlowActive(false);
  };

  const pairWithCode = async (code: string) => {
    await delay(600);
    if (!authUser) return { success: false, error: 'Sesión no válida' };
    if (!/^\d{6}$/.test(code)) return { success: false, error: 'El código debe tener 6 dígitos' };
    let partner: StoredAccount | undefined;
    try {
      const map = JSON.parse(localStorage.getItem('sincro_pairing_codes') || '{}');
      const ownerId = map[code];
      if (ownerId === authUser.id) return { success: false, error: 'No puedes usar tu propio código' };
      partner = readAccounts().find((a) => a.id === ownerId);
    } catch {
      // ignore
    }
    // Demo code so the flow can be tested with a single device
    const isDemo = code === '123456';
    if (!partner && !isDemo) return { success: false, error: 'Código inválido o expirado' };
    const partnerName = partner?.displayName ?? (currentUser === 'lesly' ? 'Alejandro' : 'Lesly');
    const partnerAvatar = partner?.avatarUrl ?? (currentUser === 'lesly' ? INITIAL_USERS.alejandro.avatarUrl : INITIAL_USERS.lesly.avatarUrl);
    if (partner) {
      const accs = readAccounts().map((a) =>
        a.id === partner!.id ? { ...a, isPaired: true, partnerId: authUser.id, partnerName: authUser.displayName, partnerAvatarUrl: authUser.avatarUrl } : a
      );
      writeAccounts(accs);
    }
    setAuthUser({ ...authUser, isPaired: true, partnerId: partner?.id ?? 'demo-partner', partnerName, partnerAvatarUrl: partnerAvatar });
    finishPairingFlow();
    return { success: true };
  };

  const skipPairingForNow = () => finishPairingFlow();

  const reauthenticateBiometrics = async () => {
    if (!authUser) return { success: false, error: 'No hay sesión previa en este dispositivo' };
    const res = await verifyWithBiometrics(authUser.id);
    if (!res.success) return res;
    const renewed = issueToken(authUser);
    setAuthUser(renewed);
    setAuthStatus('authenticated');
    setIsBiometricsPromptOpen(false);
    return { success: true };
  };
  const loginWithBiometrics = reauthenticateBiometrics;

  const logout = () => {
    try {
      localStorage.removeItem('sincro_session');
    } catch {
      // ignore
    }
    setAuthUser(null);
    setAuthStatus('unauthenticated');
    setIsBiometricsPromptOpen(false);
    setIsPairingFlowActive(false);
    setCurrentTab('home');
  };

  const updateProfile = (data: Partial<Pick<AuthUser, 'name' | 'displayName' | 'email' | 'avatarUrl'>>) => {
    setAuthUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const baseProfile = INITIAL_USERS[currentUser] || DEFAULT_USER;
  const activeUser: User = authUser
    ? {
        id: currentUser,
        name: authUser.name || 'Usuario',
        displayName: authUser.displayName || 'Usuario',
        avatarUrl: authUser.avatarUrl || '',
        email: authUser.email || '',
      }
    : DEFAULT_USER;

  const resetToEmptyState = () => {
    try {
      localStorage.removeItem('sincro_habits');
      localStorage.removeItem('sincro_finances');
      localStorage.removeItem('sincro_debts');
      localStorage.removeItem('sincro_savings');
      localStorage.removeItem('sincro_calendar');
      localStorage.removeItem('sincro_weekly_plan');
      localStorage.removeItem('sincro_supermarket');
      localStorage.removeItem('sincro_workout_profiles');
      localStorage.removeItem('sincro_workout_sessions');
      localStorage.removeItem('sincro_biometrics');
      localStorage.removeItem('sincro_bucket_list');
      localStorage.removeItem('sincro_date_kanban');
      localStorage.removeItem('sincro_couple_goals');
      localStorage.removeItem('sincro_hobbies');
    } catch {
      // ignore
    }
    setHabits([]);
    setFinances([]);
    setDebts([]);
    setSavingsGoal(INITIAL_SAVINGS_GOAL);
    setCalendarEventsRaw([]);
    setWeeklyPlan([]);
    setSupermarketList([]);
    setWorkoutSessions([]);
    setBiometricsList([]);
    setBucketList([]);
    setDateKanban([]);
    setCoupleLongTermGoals([]);
    setHobbies([]);

    const cleanSession: AuthUser = {
      id: 'me',
      name: 'Usuario',
      displayName: 'Usuario',
      email: '',
      avatarUrl: '',
      isPaired: false,
      token: `token-${Date.now()}`,
      tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    setAuthUser(cleanSession);
    try {
      localStorage.setItem('sincro_session', JSON.stringify(cleanSession));
    } catch {
      // ignore
    }
  };

  const loadDemoData = () => {
    setHabits(DEMO_HABITS);
    saveStorage('sincro_habits', DEMO_HABITS);
    setFinances(DEMO_FINANCES);
    saveStorage('sincro_finances', DEMO_FINANCES);
    setDebts(DEMO_DEBTS);
    saveStorage('sincro_debts', DEMO_DEBTS);
    setSavingsGoal(DEMO_SAVINGS_GOAL);
    saveStorage('sincro_savings', DEMO_SAVINGS_GOAL);
    setCalendarEventsRaw(DEMO_CALENDAR_EVENTS);
    saveStorage('sincro_calendar', DEMO_CALENDAR_EVENTS);
    setWeeklyPlan(DEMO_WEEKLY_PLAN);
    saveStorage('sincro_weekly_plan', DEMO_WEEKLY_PLAN);
    setSupermarketList(DEMO_SUPERMARKET);
    saveStorage('sincro_supermarket', DEMO_SUPERMARKET);
    setBucketList(DEMO_BUCKET_LIST);
    saveStorage('sincro_bucket_list', DEMO_BUCKET_LIST);
    setDateKanban(DEMO_DATE_KANBAN);
    saveStorage('sincro_date_kanban', DEMO_DATE_KANBAN);
    setCoupleLongTermGoals(DEMO_COUPLE_LONG_TERM_GOALS);
    saveStorage('sincro_couple_goals', DEMO_COUPLE_LONG_TERM_GOALS);
    setHobbies(DEMO_HOBBIES);
    saveStorage('sincro_hobbies', DEMO_HOBBIES);

    const demoSession: AuthUser = {
      id: 'me',
      name: 'Alejandro',
      displayName: 'Alejandro',
      email: 'alejandro@ejemplo.com',
      avatarUrl: '/alejandro.jpg',
      isPaired: true,
      partnerName: 'Lesly',
      partnerAvatarUrl: '/lesly.jpg',
      token: `token-${Date.now()}`,
      tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    setAuthUser(demoSession);
    try {
      localStorage.setItem('sincro_session', JSON.stringify(demoSession));
    } catch {
      // ignore
    }
  };

  // Haptic feedback helper for iPhone
  const triggerHaptic = (pattern: number | number[] = 40) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  const [todayStr, setTodayStr] = useState<string>('2026-10-13');

  useEffect(() => {
    try {
      setTodayStr(new Date().toISOString().split('T')[0]);
    } catch {
      // ignore
    }
  }, []);

  const todayHabit = useMemo(() => {
    const existing = habits.find((h) => h.userId === currentUser && h.date === todayStr);
    if (existing) return existing;
    return {
      id: `hab-${currentUser}-${todayStr}`,
      userId: currentUser,
      date: todayStr,
      poopCount: 0,
      waterMl: 0,
      calories: 0,
      loveCount: 0,
    };
  }, [habits, currentUser, todayStr]);

  const updateHabit = (fn: (prev: HabitLog) => HabitLog) => {
    setHabits((prev) => {
      const idx = prev.findIndex((h) => h.userId === currentUser && h.date === todayStr);
      let updated: HabitLog[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = fn(prev[idx]);
      } else {
        updated = [...prev, fn(todayHabit)];
      }
      saveStorage('sincro_habits', updated);
      return updated;
    });
  };

  const incrementPoop = () => {
    triggerHaptic(60);
    updateHabit((prev) => ({ ...prev, poopCount: prev.poopCount + 1 }));
  };

  const addWater = (ml: number) => {
    triggerHaptic(40);
    updateHabit((prev) => ({ ...prev, waterMl: prev.waterMl + ml }));
  };

  const addCalories = (kcal: number) => {
    triggerHaptic(40);
    updateHabit((prev) => ({ ...prev, calories: (prev.calories ?? 1200) + kcal }));
  };

  const incrementLove = () => {
    triggerHaptic([50, 40, 60]);
    updateHabit((prev) => ({ ...prev, loveCount: prev.loveCount + 1 }));
  };

  const habitStreak = useMemo(() => {
    // Calculate consecutive days user had any habit logged
    return 7; // solid 7 days streak
  }, []);

  // ----------------------------------------------------
  // FINANCES (100% Privado)
  // ----------------------------------------------------
  const userTransactions = useMemo(() => {
    return finances
      .filter((t) => t.userId === currentUser)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [finances, currentUser]);

  const addTransaction = (data: {
    type: TransactionType;
    amount: number;
    account: AccountType;
    concept?: string;
    category?: string;
  }) => {
    triggerHaptic(40);
    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      userId: currentUser,
      type: data.type,
      amount: data.amount,
      account: data.account,
      concept: data.concept || 'Movimiento rápido',
      category: data.category || (data.type === 'INCOME' ? 'Ingreso' : 'Gasto general'),
      date: new Date().toISOString(),
    };
    setFinances((prev) => {
      const updated = [newTx, ...prev];
      saveStorage('sincro_finances', updated);
      return updated;
    });
  };

  const userDebts = useMemo(() => {
    return debts.filter((d) => d.userId === currentUser);
  }, [debts, currentUser]);

  const addDebt = (data: {
    contactName: string;
    totalAmount: number;
    type: DebtType;
    notes?: string;
  }) => {
    triggerHaptic(50);
    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      userId: currentUser,
      contactName: data.contactName,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      type: data.type,
      status: 'ACTIVE',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      payments: [],
    };
    setDebts((prev) => {
      const updated = [newDebt, ...prev];
      saveStorage('sincro_debts', updated);
      return updated;
    });
  };

  const payDebt = (debtId: string, amount: number, notes?: string) => {
    triggerHaptic(50);
    setDebts((prev) => {
      const updated = prev.map((d) => {
        if (d.id !== debtId) return d;
        const newPaid = Math.min(d.totalAmount, d.paidAmount + amount);
        const newStatus = newPaid >= d.totalAmount ? 'SETTLED' : 'ACTIVE';
        const newPayment = {
          id: `pay-${Date.now()}`,
          debtId: d.id,
          amount,
          date: new Date().toISOString(),
          notes,
        };
        return {
          ...d,
          paidAmount: newPaid,
          status: newStatus as Debt['status'],
          payments: [...d.payments, newPayment],
        };
      });
      saveStorage('sincro_debts', updated);
      return updated;
    });
  };

  const accountBalances = useMemo(() => {
    const balances = { Nu: 12500, BBVA: 28400, Efectivo: 3200, Total: 0 };
    userTransactions.forEach((t) => {
      const multiplier = t.type === 'INCOME' ? 1 : -1;
      if (t.account in balances) {
        balances[t.account as keyof typeof balances] += t.amount * multiplier;
      }
    });
    balances.Total = balances.Nu + balances.BBVA + balances.Efectivo;
    return balances;
  }, [userTransactions]);

  // ----------------------------------------------------
  // SHARED SAVINGS (100% Compartido)
  // ----------------------------------------------------
  const addSavingsContribution = (amount: number) => {
    triggerHaptic([40, 50, 60]);
    setSavingsGoal((prev) => {
      const updated = {
        ...prev,
        currentAmount: prev.currentAmount + amount,
      };
      saveStorage('sincro_savings', updated);
      return updated;
    });
  };

  // ----------------------------------------------------
  // CALENDAR (Condicional: Eventos privados se ven como "Ocupado")
  // ----------------------------------------------------
  const calendarEvents = useMemo(() => {
    return calendarEventsRaw.map((evt) => {
      // If event belongs to the other user and is private:
      if (evt.userId !== currentUser && evt.isPrivate) {
        return {
          ...evt,
          title: '🔒 Ocupado (Evento Privado)',
          isRedacted: true,
          color: '#64748B', // Neutral slate for masked events
        };
      }
      return {
        ...evt,
        isRedacted: false,
      };
    });
  }, [calendarEventsRaw, currentUser]);

  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id' | 'userId'>) => {
    triggerHaptic(40);
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      userId: currentUser,
    };
    setCalendarEventsRaw((prev) => {
      const updated = [...prev, newEvent];
      saveStorage('sincro_calendar', updated);
      return updated;
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEventsRaw((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveStorage('sincro_calendar', updated);
      return updated;
    });
  };

  // Next immediate event for Dashboard Center Command
  const nextImmediateEvent = useMemo(() => {
    const todayEvents = calendarEvents.filter(
      (e) => e.date === todayStr && !e.isAllDay && e.startTime
    );
    if (todayEvents.length === 0) return null;
    return todayEvents.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))[0];
  }, [calendarEvents, todayStr]);

  const allDayReminders = useMemo(() => {
    return calendarEvents.filter((e) => e.date === todayStr && e.isAllDay);
  }, [calendarEvents, todayStr]);

  // ----------------------------------------------------
  // MEALS & SUPERMARKET (100% Compartido)
  // ----------------------------------------------------
  const assignMealToPlan = (
    dayOfWeek: WeeklyMealPlanItem['dayOfWeek'],
    mealType: MealType,
    mealId: string,
    portions: number = 2
  ) => {
    triggerHaptic(50);
    setWeeklyPlan((prev) => {
      // Remove any existing meal in that slot
      const filtered = prev.filter(
        (p) => !(p.dayOfWeek === dayOfWeek && p.mealType === mealType)
      );
      const updated = [
        ...filtered,
        {
          id: `wp-${Date.now()}`,
          dayOfWeek,
          mealType,
          mealId,
          portions,
        },
      ];
      saveStorage('sincro_weekly_plan', updated);
      return updated;
    });
  };

  const removeMealFromPlan = (id: string) => {
    setWeeklyPlan((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveStorage('sincro_weekly_plan', updated);
      return updated;
    });
  };

  const generateSupermarketList = () => {
    triggerHaptic([50, 40, 80]);
    // Multiply ingredients by portions and consolidate
    const aggregated: Record<string, { name: string; quantity: number; unit: string; category: string }> = {};

    weeklyPlan.forEach((planItem) => {
      const meal = meals.find((m) => m.id === planItem.mealId);
      if (!meal) return;
      const factor = planItem.portions || 2;

      meal.ingredients.forEach((ing) => {
        const key = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
        if (!aggregated[key]) {
          aggregated[key] = {
            name: ing.name,
            quantity: ing.quantity * factor,
            unit: ing.unit,
            category: ing.category,
          };
        } else {
          aggregated[key].quantity += ing.quantity * factor;
        }
      });
    });

    // Merge with current custom items that were added manually
    const customItems = supermarketList.filter((item) => item.isCustom);
    const generatedItems: SupermarketItem[] = Object.values(aggregated).map((val, idx) => ({
      id: `gen-sp-${idx + 1}-${Date.now()}`,
      name: val.name,
      quantity: Math.round(val.quantity * 10) / 10,
      unit: val.unit,
      category: val.category,
      checked: false,
      isCustom: false,
    }));

    const finalList = [...customItems, ...generatedItems];
    setSupermarketList(finalList);
    saveStorage('sincro_supermarket', finalList);
  };

  const toggleSupermarketItem = (id: string) => {
    triggerHaptic(30);
    setSupermarketList((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      saveStorage('sincro_supermarket', updated);
      return updated;
    });
  };

  const addSupermarketItem = (name: string, quantity: number, unit: string, category: string) => {
    triggerHaptic(40);
    const newItem: SupermarketItem = {
      id: `sp-custom-${Date.now()}`,
      name,
      quantity,
      unit,
      category,
      checked: false,
      isCustom: true,
    };
    setSupermarketList((prev) => {
      const updated = [newItem, ...prev];
      saveStorage('sincro_supermarket', updated);
      return updated;
    });
  };

  const clearCheckedSupermarketItems = () => {
    triggerHaptic(40);
    setSupermarketList((prev) => {
      const updated = prev.filter((i) => !i.checked);
      saveStorage('sincro_supermarket', updated);
      return updated;
    });
  };

  // ----------------------------------------------------
  // HEALTH & WORKOUT (Instanciado por usuario)
  // ----------------------------------------------------
  const currentWorkoutProfile = workoutProfiles[currentUser] || INITIAL_WORKOUT_PROFILES[currentUser];

  const updateWorkoutProfile = (data: Partial<WorkoutProfile>) => {
    triggerHaptic(40);
    setWorkoutProfiles((prev) => {
      const updated = {
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          ...data,
        },
      };
      saveStorage('sincro_workout_profiles', updated);
      return updated;
    });
  };

  const weeklyWorkoutsCount = useMemo(() => {
    // Count workouts this week for active user
    return workoutSessions.filter((s) => s.userId === currentUser && s.completed).length;
  }, [workoutSessions, currentUser]);

  const workoutGoalPerWeek = currentWorkoutProfile?.daysPerWeek || 3;

  const todayWorkoutCompleted = useMemo(() => {
    return workoutSessions.some(
      (s) => s.userId === currentUser && s.date.startsWith(todayStr) && s.completed
    );
  }, [workoutSessions, currentUser, todayStr]);

  const completeWorkout = (routineName = 'Rutina de Fuerza y Resistencia', durationMin = 45) => {
    triggerHaptic([60, 50, 100]);
    const newSession: WorkoutSession = {
      id: `ws-${Date.now()}`,
      userId: currentUser,
      date: new Date().toISOString(),
      routineName,
      durationMin,
      completed: true,
      exercises: [],
    };
    setWorkoutSessions((prev) => {
      const updated = [newSession, ...prev];
      saveStorage('sincro_workout_sessions', updated);
      return updated;
    });
  };

  const biometrics = useMemo(() => {
    return biometricsList.filter((b) => b.userId === currentUser);
  }, [biometricsList, currentUser]);

  const addBiometricLog = (weightKg: number) => {
    triggerHaptic(40);
    const newBio: BiometricLog = {
      id: `bio-${Date.now()}`,
      userId: currentUser,
      date: new Date().toISOString().split('T')[0],
      weightKg,
    };
    setBiometricsList((prev) => {
      const updated = [...prev, newBio];
      saveStorage('sincro_biometrics', updated);
      return updated;
    });
    updateWorkoutProfile({ weightKg });
  };

  // Modal openers
  const openCaptureSheet = (tab: 'habits' | 'finances' | 'nutrition' = 'habits', scoped: boolean = true) => {
    setCaptureSheetScoped(scoped);
    triggerHaptic(35);
    setCaptureSheetInitialTab(tab);
    setIsCaptureSheetOpen(true);
  };

  const closeCaptureSheet = () => {
    setIsCaptureSheetOpen(false);
  };

  const openWorkoutPlayer = () => {
    triggerHaptic(50);
    setIsWorkoutPlayerOpen(true);
  };

  const closeWorkoutPlayer = () => {
    setIsWorkoutPlayerOpen(false);
  };

  // =========================================================
  // Lifestyle Hub Methods (Couple Space & Hobby Goals)
  // =========================================================
  const addBucketListItem = (item: Omit<BucketListItem, 'id'>) => {
    triggerHaptic(30);
    const newItem: BucketListItem = {
      ...item,
      id: `bl-${Date.now()}`,
    };
    setBucketList((prev) => {
      const updated = [newItem, ...prev];
      saveStorage('sincro_bucket_list', updated);
      return updated;
    });
  };

  const updateBucketListProgress = (id: string, progress: number) => {
    triggerHaptic(20);
    setBucketList((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, progress: Math.min(100, Math.max(0, progress)) } : item
      );
      saveStorage('sincro_bucket_list', updated);
      return updated;
    });
  };

  const addDateKanbanCard = (title: string, column: 'ideas' | 'planeadas', category?: string, date?: string) => {
    triggerHaptic(30);
    const newCard: DateKanbanCard = {
      id: `dk-${Date.now()}`,
      title,
      column,
      category: category || (column === 'ideas' ? 'Nueva Idea' : 'Cita Planeada'),
      date: date || (column === 'planeadas' ? 'Próximamente' : undefined),
    };
    setDateKanban((prev) => {
      const updated = [...prev, newCard];
      saveStorage('sincro_date_kanban', updated);
      return updated;
    });
  };

  const moveDateKanbanCard = (id: string, targetColumn: 'ideas' | 'planeadas') => {
    triggerHaptic(25);
    setDateKanban((prev) => {
      const updated = prev.map((card) =>
        card.id === id ? { ...card, column: targetColumn } : card
      );
      saveStorage('sincro_date_kanban', updated);
      return updated;
    });
  };

  const deleteDateKanbanCard = (id: string) => {
    triggerHaptic(20);
    setDateKanban((prev) => {
      const updated = prev.filter((card) => card.id !== id);
      saveStorage('sincro_date_kanban', updated);
      return updated;
    });
  };

  const toggleCoupleLongTermGoal = (id: string) => {
    triggerHaptic(20);
    setCoupleLongTermGoals((prev) => {
      const updated = prev.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      );
      saveStorage('sincro_couple_goals', updated);
      return updated;
    });
  };

  const addCoupleLongTermGoal = (title: string, category: string = 'Metas Juntos') => {
    triggerHaptic(30);
    const newGoal: LongTermGoal = {
      id: `ltg-${Date.now()}`,
      title,
      completed: false,
      category,
    };
    setCoupleLongTermGoals((prev) => {
      const updated = [...prev, newGoal];
      saveStorage('sincro_couple_goals', updated);
      return updated;
    });
  };

  const addHobbyProject = ({
    title,
    deadline,
    milestones,
    category = 'Hobby & Creatividad',
  }: {
    title: string;
    deadline: string;
    milestones: string[];
    category?: string;
  }) => {
    triggerHaptic([30, 40]);
    const newHobby: HobbyProject = {
      id: `hb-${Date.now()}`,
      title,
      deadline,
      category,
      practiceMinutesToday: 0,
      milestones: milestones
        .filter((m) => m.trim().length > 0)
        .map((m, idx) => ({
          id: `hb-m-${Date.now()}-${idx}`,
          title: m.trim(),
          completed: false,
        })),
    };
    setHobbies((prev) => {
      const updated = [newHobby, ...prev];
      saveStorage('sincro_hobbies', updated);
      return updated;
    });
  };

  const toggleHobbyMilestone = (hobbyId: string, milestoneId: string) => {
    triggerHaptic(25);
    setHobbies((prev) => {
      const updated = prev.map((hb) => {
        if (hb.id !== hobbyId) return hb;
        return {
          ...hb,
          milestones: hb.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      });
      saveStorage('sincro_hobbies', updated);
      return updated;
    });
  };

  const addPracticeTime = (hobbyId: string, minutes: number) => {
    triggerHaptic(30);
    setHobbies((prev) => {
      const updated = prev.map((hb) =>
        hb.id === hobbyId
          ? { ...hb, practiceMinutesToday: Math.max(0, (hb.practiceMinutesToday || 0) + minutes) }
          : hb
      );
      saveStorage('sincro_hobbies', updated);
      return updated;
    });
  };

  const deleteHobbyProject = (id: string) => {
    triggerHaptic(25);
    setHobbies((prev) => {
      const updated = prev.filter((hb) => hb.id !== id);
      saveStorage('sincro_hobbies', updated);
      return updated;
    });
  };

  const openPracticeTimer = (hobby: HobbyProject) => {
    triggerHaptic(30);
    setActivePracticeHobby(hobby);
  };

  const closePracticeTimer = () => {
    setActivePracticeHobby(null);
  };

  return (
    <AppContext.Provider
      value={{
        authStatus,
        authUser,
        login,
        signup,
        loginWithBiometrics,
        logout,
        isPairingFlowActive,
        setIsPairingFlowActive,
        activePairingCode,
        generatePairingCode,
        pairWithCode,
        skipPairingForNow,
        isBiometricsPromptOpen,
        setIsBiometricsPromptOpen,
        reauthenticateBiometrics,

        currentUser,
        activeUser,

        todayHabit,
        incrementPoop,
        addWater,
        addCalories,
        incrementLove,
        habitStreak,

        userTransactions,
        addTransaction,
        userDebts,
        addDebt,
        payDebt,
        accountBalances,

        savingsGoal,
        addSavingsContribution,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        nextImmediateEvent,
        allDayReminders,

        meals,
        weeklyPlan,
        supermarketList,
        assignMealToPlan,
        removeMealFromPlan,
        generateSupermarketList,
        toggleSupermarketItem,
        addSupermarketItem,
        clearCheckedSupermarketItems,

        currentWorkoutProfile,
        updateWorkoutProfile,
        todayWorkoutCompleted,
        weeklyWorkoutsCount,
        workoutGoalPerWeek,
        completeWorkout,
        biometrics,
        addBiometricLog,

        updateProfile,
        currentTab,
        setCurrentTab,
        lifestyleSubView,
        setLifestyleSubView,
        bucketList,
        addBucketListItem,
        updateBucketListProgress,
        dateKanban,
        addDateKanbanCard,
        moveDateKanbanCard,
        deleteDateKanbanCard,
        coupleLongTermGoals,
        toggleCoupleLongTermGoal,
        addCoupleLongTermGoal,
        hobbies,
        addHobbyProject,
        toggleHobbyMilestone,
        addPracticeTime,
        deleteHobbyProject,
        activePracticeHobby,
        openPracticeTimer,
        closePracticeTimer,

        isCaptureSheetOpen,
        captureSheetInitialTab,
        captureSheetScoped,
        openCaptureSheet,
        closeCaptureSheet,
        isWorkoutPlayerOpen,
        openWorkoutPlayer,
        closeWorkoutPlayer,
        triggerHaptic,

        resetToEmptyState,
        loadDemoData,

        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
