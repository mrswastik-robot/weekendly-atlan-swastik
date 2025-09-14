import type { WeekendPlan, ScheduledActivity } from '@/types';

export interface TimelineItem {
  title: string;
  cardTitle: string;
  cardSubtitle: string;
  cardDetailedText: string;
  media?: {
    source: { url: string };
    type: 'IMAGE';
  };
}

export interface TimelineConfig {
  format: 'story' | 'detailed' | 'compact' | 'professional';
  theme: 'default' | 'dark' | 'pastel' | 'vibrant' | 'minimal';
  showBudget: boolean;
  personalMessage: string;
}

export function transformToTimelineData(
  plan: WeekendPlan, 
  config: TimelineConfig
): TimelineItem[] {
  if (!plan) return [];

  // Combine all activities and sort by day and time
  const allActivities: ScheduledActivity[] = [
    ...plan.saturday.map(activity => ({ ...activity, day: 'saturday' as const })),
    ...plan.sunday.map(activity => ({ ...activity, day: 'sunday' as const }))
  ].sort((a, b) => {
    // First sort by day (Saturday first)
    if (a.day !== b.day) {
      return a.day === 'saturday' ? -1 : 1;
    }
    // Then sort by time
    return a.startTime.localeCompare(b.startTime);
  });

  if (allActivities.length === 0) return [];

  // Add personal message as first item if provided
  const timelineItems: TimelineItem[] = [];
  
  if (config.personalMessage) {
    timelineItems.push({
      title: 'Weekend Plan',
      cardTitle: config.personalMessage,
      cardSubtitle: `${plan.saturday.length + plan.sunday.length} activities planned`,
      cardDetailedText: config.showBudget 
        ? `Total Budget: $${plan.totalBudget} • Estimated Cost: $${plan.estimatedCost}`
        : `${plan.saturday.length} Saturday activities • ${plan.sunday.length} Sunday activities`
    });
  }

  // Transform activities to timeline items
  allActivities.forEach((activity) => {
    const timeOfDay = getTimeOfDay(activity.startTime);
    const dayLabel = activity.day.charAt(0).toUpperCase() + activity.day.slice(1);
    
    const item: TimelineItem = {
      title: `${dayLabel} ${timeOfDay}`,
      cardTitle: activity.name,
      cardSubtitle: formatCardSubtitle(activity, config),
      cardDetailedText: formatCardDescription(activity, config)
    };

    timelineItems.push(item);
  });

  // Add budget summary as last item if showing budget
  if (config.showBudget && config.format === 'detailed') {
    const budgetStatus = getBudgetStatus(plan);
    timelineItems.push({
      title: 'Budget Summary',
      cardTitle: `Total: $${plan.estimatedCost} / $${plan.totalBudget}`,
      cardSubtitle: `${budgetStatus.label}`,
      cardDetailedText: [
        `Estimated Cost: $${plan.estimatedCost}`,
        `Total Budget: $${plan.totalBudget}`,
        `Remaining: $${plan.totalBudget - plan.estimatedCost}`,
        `Activities: ${allActivities.length}`
      ].join('\n')
    });
  }

  return timelineItems;
}

function getTimeOfDay(time: string): string {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function formatCardSubtitle(
  activity: ScheduledActivity, 
  config: TimelineConfig
): string {
  const timeRange = `${activity.startTime} - ${activity.endTime}`;
  
  if (!config.showBudget) {
    return timeRange;
  }

  const costDisplay = activity.cost === 0 ? 'Free' : `$${activity.cost}`;
  return `${timeRange} • ${costDisplay}`;
}

function formatCardDescription(
  activity: ScheduledActivity, 
  config: TimelineConfig
): string {
  const details: string[] = [];

  // Activity description
  if (activity.description) {
    details.push(activity.description);
  }

  // Format-specific details
  switch (config.format) {
    case 'detailed':
    case 'professional':
      if (config.showBudget) {
        details.push(`💰 Cost: $${activity.cost} (${activity.costType})`);
      }
      details.push(`😊 Mood: ${activity.mood}`);
      details.push(`📂 Category: ${activity.category}`);
      details.push(`⏱️ Duration: ${activity.duration} minutes`);
      break;
      
    case 'story':
      if (config.showBudget && activity.cost > 0) {
        details.push(`💰 $${activity.cost}`);
      }
      details.push(`😊 ${activity.mood} • ${activity.category}`);
      break;
      
    case 'compact':
      details.push(`${activity.mood} • ${activity.category} • ${activity.duration}min`);
      if (config.showBudget && activity.cost > 0) {
        details.push(`$${activity.cost}`);
      }
      break;
  }

  return details.join('\n');
}

function getBudgetStatus(plan: WeekendPlan): { label: string; color: string } {
  const percentUsed = (plan.estimatedCost / plan.totalBudget) * 100;
  
  if (percentUsed >= 100) {
    return { label: 'Over Budget', color: 'text-red-600' };
  } else if (percentUsed >= 80) {
    return { label: 'Near Budget', color: 'text-orange-600' };
  } else {
    return { label: 'Under Budget', color: 'text-green-600' };
  }
}

export function getChronoTheme(theme: string) {
  const themes = {
    default: {
      primary: '#6366f1',
      secondary: '#ffffff',
      cardBgColor: '#ffffff',
      titleColor: '#000000',
      titleColorActive: '#6366f1',
      cardBorderColor: '#e5e7eb',
      detailsColor: '#000000',
    },
    dark: {
      primary: '#a78bfa',
      secondary: '#60a5fa',
      cardBgColor: '#1f2937',
      titleColor: '#f9fafb',
      titleColorActive: '#a78bfa',
      cardBorderColor: '#374151',
      detailsColor: '#d1d5db',
    },
    pastel: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      cardBgColor: '#fdf2f8',
      titleColor: '#701a75',
      titleColorActive: '#ec4899',
      cardBorderColor: '#f3e8ff',
      detailsColor: '#86198f',
    },
    vibrant: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      cardBgColor: '#ffffff',
      titleColor: '#111827',
      titleColorActive: '#f59e0b',
      cardBorderColor: '#fed7aa',
      detailsColor: '#1f2937',
    },
    minimal: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      cardBgColor: '#f9fafb',
      titleColor: '#374151',
      titleColorActive: '#6b7280',
      cardBorderColor: '#d1d5db',
      detailsColor: '#4b5563',
    }
  };

  return themes[theme as keyof typeof themes] || themes.default;
}

export function getChronoConfig(format: string) {
  const configs = {
    story: {
      mode: 'VERTICAL_ALTERNATING' as const,
      cardHeight: 80,
      contentDetailsHeight: 60,
      fontSizes: {
        cardSubtitle: '0.8rem',
        cardText: '0.75rem',
        cardTitle: '0.9rem',
        title: '1rem',
      }
    },
    detailed: {
      mode: 'VERTICAL_ALTERNATING' as const,
      cardHeight: 150,
      contentDetailsHeight: 120,
      fontSizes: {
        cardSubtitle: '0.85rem',
        cardText: '0.8rem',
        cardTitle: '1rem',
        title: '1.1rem',
      }
    },
    compact: {
      mode: 'HORIZONTAL' as const,
      cardHeight: 100,
      contentDetailsHeight: 80,
      fontSizes: {
        cardSubtitle: '0.75rem',
        cardText: '0.7rem',
        cardTitle: '0.85rem',
        title: '0.9rem',
      }
    },
    professional: {
      mode: 'VERTICAL_ALTERNATING' as const,
      cardHeight: 120,
      contentDetailsHeight: 100,
      fontSizes: {
        cardSubtitle: '0.85rem',
        cardText: '0.8rem',
        cardTitle: '1rem',
        title: '1.1rem',
      }
    }
  };

  return configs[format as keyof typeof configs] || configs.story;
}
