// Weekendly - State Management with Zustand
// Centralized store for functions

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Activity, ScheduledActivity, WeekendPlan, BudgetPreset } from '@/types';

interface WeekendStore {
  // Core state
  activities: Activity[];
  currentPlan: WeekendPlan | null;
  savedPlans: WeekendPlan[];
  budgetPresets: BudgetPreset[];
  
  // UI state
  selectedCategory: string | null;
  selectedMood: string | null;
  selectedCostType: string | null;
  searchQuery: string;
  
  // Budget state
  budgetAlerts: boolean;
  showBudgetBreakdown: boolean;
  
  // Actions - Activities
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  
  // Actions - Schedule Management
  createNewPlan: (name: string, theme: string, totalBudget: number) => void;
  addActivityToSchedule: (activity: Activity, day: 'saturday' | 'sunday', startTime: string) => void;
  removeActivityFromSchedule: (activityId: string, day: 'saturday' | 'sunday') => void;
  moveActivity: (activityId: string, fromDay: 'saturday' | 'sunday', toDay: 'saturday' | 'sunday', newTime: string) => void;
  reorderActivities: (day: 'saturday' | 'sunday', activities: ScheduledActivity[]) => void;
  
  // Actions - Budget Management
  updateBudget: (newBudget: number) => void;
  updateActivityCost: (activityId: string, day: 'saturday' | 'sunday', actualCost: number) => void;
  setBudgetAlerts: (enabled: boolean) => void;
  
  // Actions - Filters and Search
  setSelectedCategory: (category: string | null) => void;
  setSelectedMood: (mood: string | null) => void;
  setSelectedCostType: (costType: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Actions - Plan Management
  savePlan: () => void;
  loadPlan: (planId: string) => void;
  deletePlan: (planId: string) => void;
  
  // getters
  getFilteredActivities: () => Activity[];
  getTotalEstimatedCost: () => number;
  getTotalActualCost: () => number;
  getBudgetStatus: () => 'under' | 'near' | 'over';
  getScheduleForDay: (day: 'saturday' | 'sunday') => ScheduledActivity[];
}

const useWeekendStore = create<WeekendStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activities: [],
      currentPlan: null,
      savedPlans: [],
      budgetPresets: [],
      selectedCategory: null,
      selectedMood: null,
      selectedCostType: null,
      searchQuery: '',
      budgetAlerts: true,
      showBudgetBreakdown: false,

      // Activities actions
      setActivities: (activities) => set({ activities }),
      
      addActivity: (activity) => set((state) => ({
        activities: [...state.activities, activity]
      })),
      
      updateActivity: (id, updates) => set((state) => ({
        activities: state.activities.map(activity => 
          activity.id === id ? { ...activity, ...updates } : activity
        )
      })),

      // Schedule management
      createNewPlan: (name, theme, totalBudget) => {
        const newPlan: WeekendPlan = {
          id: `plan-${Date.now()}`,
          name,
          theme,
          saturday: [],
          sunday: [],
          totalBudget,
          estimatedCost: 0,
          actualCost: 0,
          budgetAlerts: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set({ currentPlan: newPlan });
      },

      addActivityToSchedule: (activity, day, startTime) => {
        const state = get();
        if (!state.currentPlan) return;

        const endTime = calculateEndTime(startTime, activity.duration);
        const scheduledActivity: ScheduledActivity = {
          ...activity,
          day,
          startTime,
          endTime
        };

        const updatedPlan = {
          ...state.currentPlan,
          [day]: [...state.currentPlan[day], scheduledActivity],
          estimatedCost: state.currentPlan.estimatedCost + activity.cost,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      removeActivityFromSchedule: (activityId, day) => {
        const state = get();
        if (!state.currentPlan) return;

        const activityToRemove = state.currentPlan[day].find(a => a.id === activityId);
        if (!activityToRemove) return;

        const updatedPlan = {
          ...state.currentPlan,
          [day]: state.currentPlan[day].filter(a => a.id !== activityId),
          estimatedCost: state.currentPlan.estimatedCost - activityToRemove.cost,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      moveActivity: (activityId, fromDay, toDay, newTime) => {
        const state = get();
        if (!state.currentPlan) return;

        const activity = state.currentPlan[fromDay].find(a => a.id === activityId);
        if (!activity) return;

        const updatedActivity = {
          ...activity,
          day: toDay,
          startTime: newTime,
          endTime: calculateEndTime(newTime, activity.duration)
        };

        const updatedPlan = {
          ...state.currentPlan,
          [fromDay]: state.currentPlan[fromDay].filter(a => a.id !== activityId),
          [toDay]: [...state.currentPlan[toDay], updatedActivity],
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      reorderActivities: (day, activities) => {
        const state = get();
        if (!state.currentPlan) return;

        const updatedPlan = {
          ...state.currentPlan,
          [day]: activities,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      // Budget management
      updateBudget: (newBudget) => {
        const state = get();
        if (!state.currentPlan) return;

        const updatedPlan = {
          ...state.currentPlan,
          totalBudget: newBudget,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      updateActivityCost: (activityId, day, actualCost) => {
        const state = get();
        if (!state.currentPlan) return;

        const updatedActivities = state.currentPlan[day].map(activity =>
          activity.id === activityId 
            ? { ...activity, actualCost }
            : activity
        );

        const totalActualCost = [
          ...state.currentPlan.saturday,
          ...state.currentPlan.sunday
        ].reduce((sum, activity) => sum + (activity.actualCost || activity.cost), 0);

        const updatedPlan = {
          ...state.currentPlan,
          [day]: updatedActivities,
          actualCost: totalActualCost,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      setBudgetAlerts: (enabled) => set({ budgetAlerts: enabled }),

      // Filters and search
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedMood: (mood) => set({ selectedMood: mood }),
      setSelectedCostType: (costType) => set({ selectedCostType: costType }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearFilters: () => set({
        selectedCategory: null,
        selectedMood: null,
        selectedCostType: null,
        searchQuery: ''
      }),

      // Plan management
      savePlan: () => {
        const state = get();
        if (!state.currentPlan) return;

        const existingIndex = state.savedPlans.findIndex(p => p.id === state.currentPlan!.id);
        
        if (existingIndex >= 0) {
          const updatedPlans = [...state.savedPlans];
          updatedPlans[existingIndex] = state.currentPlan;
          set({ savedPlans: updatedPlans });
        } else {
          set({ savedPlans: [...state.savedPlans, state.currentPlan] });
        }
      },

      loadPlan: (planId) => {
        const state = get();
        const plan = state.savedPlans.find(p => p.id === planId);
        if (plan) {
          set({ currentPlan: plan });
        }
      },

      deletePlan: (planId) => {
        const state = get();
        const updatedPlans = state.savedPlans.filter(p => p.id !== planId);
        set({ savedPlans: updatedPlans });
        
        if (state.currentPlan?.id === planId) {
          set({ currentPlan: null });
        }
      },

      // getters functions
      getFilteredActivities: () => {
        const state = get();
        let filtered = state.activities;

        if (state.selectedCategory) {
          filtered = filtered.filter(a => a.category === state.selectedCategory);
        }

        if (state.selectedMood) {
          filtered = filtered.filter(a => a.mood === state.selectedMood);
        }

        if (state.selectedCostType) {
          filtered = filtered.filter(a => a.costType === state.selectedCostType);
        }

        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(query) ||
            a.description?.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      getTotalEstimatedCost: () => {
        const state = get();
        if (!state.currentPlan) return 0;
        return state.currentPlan.estimatedCost;
      },

      getTotalActualCost: () => {
        const state = get();
        if (!state.currentPlan) return 0;
        return state.currentPlan.actualCost;
      },

      getBudgetStatus: () => {
        const state = get();
        if (!state.currentPlan) return 'under';
        
        const percentUsed = (state.currentPlan.estimatedCost / state.currentPlan.totalBudget) * 100;
        
        if (percentUsed >= 100) return 'over';
        if (percentUsed >= 80) return 'near';
        return 'under';
      },

      getScheduleForDay: (day) => {
        const state = get();
        if (!state.currentPlan) return [];
        return state.currentPlan[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      }
    }),
    {
      name: 'weekendly-store',
      // Only persist essential data, not UI state
      partialize: (state) => ({
        activities: state.activities,
        savedPlans: state.savedPlans,
        budgetPresets: state.budgetPresets,
        budgetAlerts: state.budgetAlerts
      })
    }
  )
);

// function to calculate end time
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
}

export default useWeekendStore;
