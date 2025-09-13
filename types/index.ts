// Weekendly - Type Definitions

export interface Activity {
  id: string;
  name: string;
  category: 'food' | 'outdoor' | 'indoor' | 'social' | 'wellness';
  duration: number; // minutes
  mood: 'happy' | 'relaxed' | 'energetic' | 'peaceful';
  icon: string;
  color: string;
  description?: string;
  // BUDGET TRACKING PROPERTIES
  cost: number; // estimated cost in currency
  costType: 'free' | 'low' | 'medium' | 'high'; // cost category
  costVariability: 'fixed' | 'variable'; // whether cost can change
}

export interface ScheduledActivity extends Activity {
  day: 'saturday' | 'sunday';
  startTime: string; // HH:mm format
  endTime: string;
  actualCost?: number; // user should be able to adjust actual cost
}

export interface WeekendPlan {
  id: string;
  name: string;
  theme: string;
  saturday: ScheduledActivity[];
  sunday: ScheduledActivity[];
  // BUDGET TRACKING FEATURES
  totalBudget: number;
  estimatedCost: number;
  actualCost: number;
  budgetAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetPreset {
  id: string;
  name: string;
  description: string;
  maxBudget: number;
  recommendedActivities: string[]; // activity IDs
}

export type CategoryType = Activity['category'];
export type MoodType = Activity['mood'];
export type CostType = Activity['costType'];
export type DayType = 'saturday' | 'sunday';

export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'auto';

export interface TimeWindow {
  start: string;
  end: string;
  label: string;
  icon: string;
}

export interface SchedulingPreference {
  day: DayType;
  timePreference: TimePreference;
}
