import {
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
  BucketListItem,
  DateKanbanCard,
  LongTermGoal,
  HobbyProject,
} from '@/types';

export const DEFAULT_USER: User = {
  id: 'me',
  name: 'Usuario',
  displayName: 'Usuario',
  avatarUrl: '',
};

export const INITIAL_USERS: Record<string, User> = {
  me: DEFAULT_USER,
  alejandro: {
    id: 'alejandro',
    name: 'Alejandro',
    displayName: 'Alejandro',
    avatarUrl: '/alejandro.jpg',
  },
  lesly: {
    id: 'lesly',
    name: 'Lesly',
    displayName: 'Lesly',
    avatarUrl: '/lesly.jpg',
  },
};

export const INITIAL_SAVINGS_GOAL: SharedSavingsGoal = {
  id: 'goal-1',
  name: 'Meta de ahorro',
  targetAmount: 0,
  currentAmount: 0,
  targetDate: '',
};

export const INITIAL_MEALS: Meal[] = [
  {
    id: 'meal-1',
    name: 'Tostadas de Aguacate con Huevo Poché',
    type: 'BREAKFAST',
    calories: 420,
    prepTimeMin: 15,
    imageUrl: '/meals/breakfast.jpg',
    description: 'Pan de masa madre tostado con aguacate machacado, huevos poché y mix de semillas.',
    ingredients: [
      { name: 'Pan de masa madre', quantity: 2, unit: 'rebanadas', category: 'Panadería' },
      { name: 'Aguacate Hass', quantity: 1, unit: 'pieza', category: 'Frutas y Verduras' },
      { name: 'Huevos de campo', quantity: 2, unit: 'piezas', category: 'Proteínas' },
      { name: 'Semillas de sésamo y chía', quantity: 15, unit: 'g', category: 'Despensa' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml', category: 'Despensa' },
    ],
  },
  {
    id: 'meal-2',
    name: 'Bowl de Salmón con Quinoa y Aguacate',
    type: 'LUNCH',
    calories: 580,
    prepTimeMin: 25,
    imageUrl: '/meals/lunch.jpg',
    description: 'Filete de salmón sellado a la plancha con base de quinoa esponjosa, edamames y aderezo cítrico.',
    ingredients: [
      { name: 'Filete de salmón fresco', quantity: 200, unit: 'g', category: 'Proteínas' },
      { name: 'Quinoa cocida', quantity: 150, unit: 'g', category: 'Despensa' },
      { name: 'Aguacate fresco', quantity: 0.5, unit: 'pieza', category: 'Frutas y Verduras' },
      { name: 'Edamames pelados', quantity: 80, unit: 'g', category: 'Frutas y Verduras' },
      { name: 'Tomates cherry', quantity: 6, unit: 'piezas', category: 'Frutas y Verduras' },
      { name: 'Aderezo de sésamo y jengibre', quantity: 25, unit: 'ml', category: 'Despensa' },
    ],
  },
  {
    id: 'meal-3',
    name: 'Pechuga al Romero con Espárragos y Camote',
    type: 'DINNER',
    calories: 460,
    prepTimeMin: 30,
    imageUrl: '/meals/dinner.jpg',
    description: 'Pechuga marinada a las finas hierbas con espárragos crujientes y cuñas de camote asado.',
    ingredients: [
      { name: 'Pechuga de pollo orgánica', quantity: 220, unit: 'g', category: 'Proteínas' },
      { name: 'Espárragos verdes frescos', quantity: 120, unit: 'g', category: 'Frutas y Verduras' },
      { name: 'Camote naranja en cuñas', quantity: 150, unit: 'g', category: 'Frutas y Verduras' },
      { name: 'Romero y finas hierbas', quantity: 5, unit: 'g', category: 'Despensa' },
      { name: 'Aceite de oliva', quantity: 15, unit: 'ml', category: 'Despensa' },
    ],
  },
];

// Estado inicial vacío para el usuario que va llegando (Empty States)
export const INITIAL_WEEKLY_PLAN: WeeklyMealPlanItem[] = [];
export const INITIAL_SUPERMARKET: SupermarketItem[] = [];
export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];
export const INITIAL_HABITS: HabitLog[] = [];
export const INITIAL_FINANCES: FinanceTransaction[] = [];
export const INITIAL_DEBTS: Debt[] = [];
export const INITIAL_WORKOUT_PROFILES: Record<string, WorkoutProfile> = {
  me: {
    userId: 'me',
    weightKg: 0,
    heightCm: 0,
    equipment: ['mancuernas', 'piso'],
    daysPerWeek: 3,
    durationPerSessionMin: 30,
  },
};
export const INITIAL_WORKOUT_SESSIONS: WorkoutSession[] = [];
export const INITIAL_BIOMETRICS: BiometricLog[] = [];
export const INITIAL_BUCKET_LIST: BucketListItem[] = [];
export const INITIAL_DATE_KANBAN: DateKanbanCard[] = [];
export const INITIAL_COUPLE_LONG_TERM_GOALS: LongTermGoal[] = [];
export const INITIAL_HOBBIES: HobbyProject[] = [];

// =========================================================
// DATOS DEMO (Disponibles para restaurar con 1 clic en Ajustes)
// =========================================================
const DEMO_DATE = '2026-10-13';

export const DEMO_SAVINGS_GOAL: SharedSavingsGoal = {
  id: 'goal-demo',
  name: 'Viaje a Japón juntos ⛩️',
  targetAmount: 60000,
  currentAmount: 38450,
  targetDate: '2027-04-15',
};

export const DEMO_WEEKLY_PLAN: WeeklyMealPlanItem[] = [
  { id: 'wp-1', dayOfWeek: 'lunes', mealType: 'BREAKFAST', mealId: 'meal-1', portions: 2 },
  { id: 'wp-2', dayOfWeek: 'lunes', mealType: 'LUNCH', mealId: 'meal-2', portions: 2 },
  { id: 'wp-3', dayOfWeek: 'lunes', mealType: 'DINNER', mealId: 'meal-3', portions: 2 },
];

export const DEMO_SUPERMARKET: SupermarketItem[] = [
  { id: 'sp-1', name: 'Filete de salmón fresco', quantity: 800, unit: 'g', category: 'Proteínas', checked: false },
  { id: 'sp-2', name: 'Huevos de campo', quantity: 12, unit: 'piezas', category: 'Proteínas', checked: true },
  { id: 'sp-3', name: 'Aguacate Hass', quantity: 6, unit: 'piezas', category: 'Frutas y Verduras', checked: false },
];

export const DEMO_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    userId: 'me',
    title: 'Cena romántica en terraza',
    date: new Date().toISOString().split('T')[0],
    startTime: '20:30',
    endTime: '22:30',
    isAllDay: false,
    category: 'Social',
    color: '#EC4899',
    isPrivate: false,
  },
  {
    id: 'evt-2',
    userId: 'me',
    title: 'Entrenamiento de fuerza',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    isAllDay: false,
    category: 'Salud',
    color: '#10B981',
    isPrivate: false,
  },
];

export const DEMO_HABITS: HabitLog[] = [
  {
    id: 'hab-today',
    userId: 'me',
    date: new Date().toISOString().split('T')[0],
    poopCount: 1,
    waterMl: 1500,
    loveCount: 1,
    calories: 1200,
  },
];

export const DEMO_FINANCES: FinanceTransaction[] = [
  {
    id: 'fin-1',
    userId: 'me',
    type: 'EXPENSE',
    amount: 320,
    account: 'Nu',
    concept: 'Despensa básica',
    category: 'Comida',
    date: new Date().toISOString(),
  },
  {
    id: 'fin-2',
    userId: 'me',
    type: 'INCOME',
    amount: 14500,
    account: 'BBVA',
    concept: 'Nómina quincenal',
    category: 'Salario',
    date: new Date().toISOString(),
  },
];

export const DEMO_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    userId: 'me',
    contactName: 'Carlos M.',
    totalAmount: 1800,
    paidAmount: 600,
    type: 'THEY_OWE',
    status: 'ACTIVE',
    notes: 'Boletos concierto',
    createdAt: new Date().toISOString(),
    payments: [{ id: 'pay-1', debtId: 'debt-1', amount: 600, date: new Date().toISOString(), notes: 'Abono 1' }],
  },
];

export const DEMO_BUCKET_LIST: BucketListItem[] = [
  {
    id: 'bl-1',
    title: 'Viaje a Costa Rica 🌴',
    imageUrl: '/lifestyle/costa_rica.jpg',
    progress: 65,
    targetYear: '2027',
    category: 'Aventura & Viajes',
  },
];

export const DEMO_DATE_KANBAN: DateKanbanCard[] = [
  {
    id: 'dk-1',
    title: 'Cena sorpresa con velas y vino en la terraza',
    column: 'ideas',
    category: 'Cena Romántica',
  },
  {
    id: 'dk-2',
    title: 'Noche de pasta fresca artesanal y vino tinto',
    column: 'planeadas',
    category: 'Gastronomía',
    date: 'Este Sábado, 8:30 PM',
  },
];

export const DEMO_COUPLE_LONG_TERM_GOALS: LongTermGoal[] = [
  { id: 'ltg-1', title: 'Comprar nuestro departamento propio', completed: false, category: 'Patrimonio' },
  { id: 'ltg-2', title: 'Tener fondo de emergencia para 6 meses', completed: true, category: 'Finanzas' },
];

export const DEMO_HOBBIES: HobbyProject[] = [
  {
    id: 'hb-1',
    title: 'Guitarra: Fingerstyle & Solos',
    deadline: '2026-12-15',
    category: 'Música',
    practiceMinutesToday: 30,
    milestones: [
      { id: 'hb1-m1', title: 'Dominar escala pentatónica en 5 cajas', completed: true },
      { id: 'hb1-m2', title: 'Tocar Neon de John Mayer completo', completed: false },
    ],
  },
];
