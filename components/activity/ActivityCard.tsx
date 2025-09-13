'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { 
  DollarSign, 
  Plus, 
  Heart, 
  Zap, 
  Smile, 
  Leaf,
  Star,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Activity } from '@/types';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onAddToSchedule?: (activity: Activity) => void;
  isSelected?: boolean;
  showAddButton?: boolean;
  className?: string;
  isDraggable?: boolean;
}

const moodIcons = {
  happy: Smile,
  relaxed: Leaf,
  energetic: Zap,
  peaceful: Heart
};

const moodColors = {
  happy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  relaxed: 'bg-green-100 text-green-700 border-green-200',
  energetic: 'bg-red-100 text-red-700 border-red-200',
  peaceful: 'bg-blue-100 text-blue-700 border-blue-200'
};

const costTypeColors = {
  free: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  high: 'bg-red-100 text-red-700 border-red-200'
};

const categoryColors = {
  food: 'border-l-orange-400',
  outdoor: 'border-l-green-400',
  indoor: 'border-l-purple-400',
  social: 'border-l-pink-400',
  wellness: 'border-l-cyan-400'
};

export function ActivityCard({ 
  activity, 
  onAddToSchedule, 
  isSelected = false, 
  showAddButton = true,
  className,
  isDraggable = true
}: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: activity.id,
    disabled: !isDraggable,
  });
  const MoodIcon = moodIcons[activity.mood];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Free';
    return `$${cost}`;
  };

  const getCostTypeLabel = (costType: Activity['costType']) => {
    const labels = {
      free: 'Free',
      low: '$',
      medium: '$$',
      high: '$$$'
    };
    return labels[costType];
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: isDragging ? 0 : -2 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
    >
      <Card 
        ref={setNodeRef}
        {...(isDraggable ? { ...attributes, ...listeners } : {})}
        data-draggable={isDraggable}
        className={cn(
          'h-full border-l-4 transition-all duration-200 hover:shadow-lg',
          isDragging && 'opacity-50 rotate-2 scale-105 z-50 dragging',
          isDraggable && 'cursor-grab active:cursor-grabbing select-none',
          !isDraggable && 'cursor-pointer',
          categoryColors[activity.category],
          isSelected && 'ring-2 ring-primary shadow-lg',
          'group relative'
        )}
        style={{
          ...style,
          userSelect: isDraggable ? 'none' : 'auto',
          WebkitUserSelect: isDraggable ? 'none' : 'auto',
        } as React.CSSProperties}
      >

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                {activity.name}
              </h3>
              
              {activity.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {activity.description}
                </p>
              )}
            </div>
            
            {showAddButton && (
              <div 
                className="relative z-20" 
                style={{ pointerEvents: 'auto' }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add button clicked for:', activity.name); // Debug log
                  onAddToSchedule?.(activity);
                }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Category and Mood Tags */}
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs px-2 py-0.5 font-medium capitalize',
                moodColors[activity.mood]
              )}
            >
              <MoodIcon className="w-3 h-3 mr-1" />
              {activity.mood}
            </Badge>
            
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-0.5 font-medium capitalize"
            >
              {activity.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          {/* Duration and Cost Info */}
          <div className="space-y-2">
            {/* Duration */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{formatDuration(activity.duration)}</span>
            </div>

            {/* Cost Information - Key Budget Feature */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" />
                <span className="font-medium text-green-600">
                  {formatCost(activity.cost)}
                </span>
              </div>
              
              <Badge 
                variant="outline"
                className={cn(
                  'text-xs px-2 py-0.5 font-medium',
                  costTypeColors[activity.costType]
                )}
              >
                {getCostTypeLabel(activity.costType)}
              </Badge>
            </div>

            {/* Cost Variability Indicator */}
            {activity.costVariability === 'variable' && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Cost may vary
              </div>
            )}
          </div>

          {/* Action Button for Mobile */}
          {showAddButton && (
            <div 
              className="relative z-20 mt-3 md:hidden" 
              style={{ pointerEvents: 'auto' }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Mobile add button clicked for:', activity.name); // Debug log
                onAddToSchedule?.(activity);
              }}
            >
              <Button
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ActivityCard;
