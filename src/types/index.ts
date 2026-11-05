export type UserId = 'alejandro' | 'lesly' | string;

export interface User {
  id: UserId;
  name: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
}

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  displayName: string;
  avatarUrl: string;
  isPaired: boolean;
  partnerId?: string;
  partnerName?: string;
  partnerAvatarUrl?: string;
  pairingCode?: string;
  token?: string;
  tokenExpiry?: number; // timestamp
  biometricsEnabled?: boolean;
}

export interface HabitLog {
  id: string;
  userId: UserId;
  date: string; // YYYY-MM-DD
  poopCount: number;
  waterMl: number;
  loveCount: number;
  calories?: number;
}

export type AccountType = 'Nu' | 'BBVA' | 'Efectivo';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface FinanceTransaction {
  id: string;
  userId: UserId;
  type: TransactionType;
  amount: number;
  account: AccountType;
  concept?: string;
  category?: string;
  date: string; // ISO string
}

export type DebtType = 'I_OWE' | 'THEY_OWE';
export type DebtStatus = 'ACTIVE' | 'SETTLED';

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Debt {
  id: string;
  userId: UserId;
  contactName: string;
  totalAmount: number;
  paidAmount: number;
  type: DebtType;
  status: DebtStatus;
  notes?: string;
  createdAt: string;
  dueDate?: string; // ISO date límite (opcional)
  payments: DebtPayment[];
}

export interface SharedSavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

export type EventCategory = 'Trabajo' | 'Personal' | 'Salud' | 'Social' | 'Hogar';

export interface CalendarEvent {
  id: string;
  userId: UserId;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // "09:00"
  endTime?: string; // "10:30"
  isAllDay: boolean;
  category: EventCategory;
  color: string; // Hex color or Tailwind token
  isPrivate: boolean;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: 'Lácteos' | 'Proteínas' | 'Frutas y Verduras' | 'Despensa' | 'Panadería' | 'Otros';
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  calories: number;
  prepTimeMin: number;
  imageUrl?: string;
  description?: string;
  ingredients: Ingredient[];
}

export interface WeeklyMealPlanItem {
  id: string;
  dayOfWeek: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  mealType: MealType;
  mealId: string;
  portions: number;
}

export interface SupermarketItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  isCustom?: boolean;
}

export interface WorkoutProfile {
  userId: UserId;
  weightKg: number;
  heightCm: number;
  equipment: string[]; // ['mancuernas', 'piso', 'cajon']
  daysPerWeek: number;
  durationPerSessionMin: number;
}

export interface ExerciseItem {
  name: string;
  sets: number;
  repsOrSec: string;
  restSec: number;
  targetMuscle: string;
}

export interface WorkoutSession {
  id: string;
  userId: UserId;
  date: string;
  routineName: string;
  durationMin: number;
  completed: boolean;
  exercises: ExerciseItem[];
}

export interface BiometricLog {
  id: string;
  userId: UserId;
  date: string;
  weightKg: number;
}

export interface BucketListItem {
  id: string;
  title: string;
  imageUrl: string;
  progress: number; // 0 - 100
  targetYear?: string;
  category?: string;
}

export interface DateKanbanCard {
  id: string;
  title: string;
  column: 'ideas' | 'planeadas';
  category?: string;
  date?: string;
}

export interface LongTermGoal {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
}

export interface HobbyMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface HobbyProject {
  id: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  milestones: HobbyMilestone[];
  category?: string;
  practiceMinutesToday: number;
}
