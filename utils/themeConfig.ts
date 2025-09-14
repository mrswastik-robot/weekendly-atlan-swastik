import type { Activity } from '@/types';

export interface ThemeConfig {
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    badge: string;
  };
  personality: {
    greeting: string;
    motivation: string;
    activityPrompt: string;
    budgetTip: string;
  };
  preferredCategories: string[];
  backgroundStyle: string;
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  balanced: {
    name: 'Balanced Explorer',
    emoji: '⚖️',
    colors: {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-blue-100 to-purple-100',
      accent: 'border-blue-300 bg-blue-50 text-blue-800',
      gradient: 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50',
      badge: 'bg-blue-100 border-blue-300 text-blue-700'
    },
    personality: {
      greeting: "Perfect balance awaits! Let's create your ideal weekend mix.",
      motivation: "Great choice! A balanced weekend keeps you refreshed and fulfilled.",
      activityPrompt: "Try mixing some relaxing activities with exciting adventures:",
      budgetTip: "Smart spending! Balance splurges with budget-friendly activities."
    },
    preferredCategories: ['food', 'outdoor', 'wellness', 'social'],
    backgroundStyle: 'radial-gradient(circle 800px at 20% 50%, rgba(99, 102, 241, 0.1), transparent), radial-gradient(circle 600px at 80% 80%, rgba(168, 85, 247, 0.1), transparent)'
  },
  adventurous: {
    name: 'Adventure Seeker',
    emoji: '🚀',
    colors: {
      primary: 'from-orange-500 to-red-600',
      secondary: 'from-orange-100 to-red-100',
      accent: 'border-orange-300 bg-orange-50 text-orange-800',
      gradient: 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50',
      badge: 'bg-orange-100 border-orange-300 text-orange-700'
    },
    personality: {
      greeting: "Adventure calls! Let's pack your weekend with thrilling experiences.",
      motivation: "Excellent! Adventure weekends create the best memories.",
      activityPrompt: "Ready for some adrenaline? Check out these exciting options:",
      budgetTip: "Adventure smart! Some of the best thrills are surprisingly affordable."
    },
    preferredCategories: ['outdoor', 'social', 'food'],
    backgroundStyle: 'radial-gradient(circle 800px at 30% 40%, rgba(251, 146, 60, 0.15), transparent), radial-gradient(circle 600px at 70% 70%, rgba(239, 68, 68, 0.1), transparent)'
  },
  relaxed: {
    name: 'Zen Master',
    emoji: '🧘',
    colors: {
      primary: 'from-green-500 to-teal-600',
      secondary: 'from-green-100 to-teal-100',
      accent: 'border-green-300 bg-green-50 text-green-800',
      gradient: 'bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50',
      badge: 'bg-green-100 border-green-300 text-green-700'
    },
    personality: {
      greeting: "Peaceful vibes ahead! Let's craft your perfect relaxation weekend.",
      motivation: "Wonderful! Relaxed weekends are essential for recharging your soul.",
      activityPrompt: "Time to unwind! These peaceful activities await you:",
      budgetTip: "Mindful spending! The best relaxation often costs the least."
    },
    preferredCategories: ['wellness', 'indoor', 'food'],
    backgroundStyle: 'radial-gradient(circle 800px at 40% 60%, rgba(34, 197, 94, 0.1), transparent), radial-gradient(circle 600px at 60% 40%, rgba(20, 184, 166, 0.1), transparent)'
  },
  social: {
    name: 'Social Butterfly',
    emoji: '🦋',
    colors: {
      primary: 'from-purple-500 to-pink-600',
      secondary: 'from-purple-100 to-pink-100',
      accent: 'border-purple-300 bg-purple-50 text-purple-800',
      gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50',
      badge: 'bg-purple-100 border-purple-300 text-purple-700'
    },
    personality: {
      greeting: "Social magic incoming! Let's plan your people-powered weekend.",
      motivation: "Perfect! Social weekends strengthen bonds and create joy.",
      activityPrompt: "Connect and celebrate! These group activities are calling:",
      budgetTip: "Social savvy! Shared experiences often mean shared costs too."
    },
    preferredCategories: ['social', 'food', 'outdoor'],
    backgroundStyle: 'radial-gradient(circle 800px at 50% 30%, rgba(168, 85, 247, 0.12), transparent), radial-gradient(circle 600px at 80% 60%, rgba(236, 72, 153, 0.1), transparent)'
  }
};

export function getThemeConfig(theme: string): ThemeConfig {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.balanced;
}

export function getThemeSpecificActivities(theme: string, activities: Activity[]): Activity[] {
  const config = getThemeConfig(theme);
  return activities.filter(activity => 
    config.preferredCategories.includes(activity.category.toLowerCase())
  ).slice(0, 6); // Return top 6
}
