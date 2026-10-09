export interface MacroNutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  serving: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  imageUrl?: string;
  healthScore?: number;
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  category: 'sleep' | 'nutrition' | 'fitness' | 'work' | 'recovery';
  startTime: string; // "HH:mm" 24-hour format
  endTime: string;   // "HH:mm"
  color: string;
  description?: string;
  completed?: boolean;
}

export interface SleepData {
  bedtime: string; // "23:00"
  wakeTime: string; // "07:00"
  totalHours: number; // 8.0
  qualityScore: number; // 0-100
  stages: {
    deep: number;   // minutes
    rem: number;    // minutes
    light: number;  // minutes
    awake: number;  // minutes
  };
  heartRateResting: number; // bpm
  hrv: number;              // ms
}

export interface HealthTelemetry {
  heartRate: number;        // live bpm
  restingHeartRate: number; // bpm
  hrv: number;              // ms
  spo2: number;             // %
  activeBurn: number;       // kcal burned
  steps: number;            // count
  recoveryScore: number;    // 0-100%
}

export interface DailyHabit {
  id: string;
  title: string;
  category: 'medication' | 'mobility' | 'recovery' | 'mindfulness' | 'nutrition';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  completed: boolean;
  streakDays: number;
  notes?: string;
}

export interface DayData {
  date: string; // "YYYY-MM-DD"
  calorieTarget: number;
  foodItems: FoodItem[];
  waterTarget: number; // in ml
  waterLogs: WaterLog[];
  waterConsumed: number; // in ml
  sleep: SleepData;
  telemetry: HealthTelemetry;
  schedule: ScheduleEvent[];
  habits: DailyHabit[];
}
