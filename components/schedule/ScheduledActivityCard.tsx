'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Clock, DollarSign, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ScheduledActivity } from '@/types';
import { cn } from '@/lib/utils';

interface ScheduledActivityCardProps {
  activity: ScheduledActivity;
  onRemove: () => void;
  isDragging?: boolean;
}

export function ScheduledActivityCard({ 
  activity, 
  onRemove, 
  isDragging = false 
}: ScheduledActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBeingDragged = isDragging || isSortableDragging;

  // Get mood color configuration
  const moodColors = {
    happy: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    relaxed: 'bg-green-100 border-green-300 text-green-800',
    energetic: 'bg-red-100 border-red-300 text-red-800',
    peaceful: 'bg-blue-100 border-blue-300 text-blue-800'
  };

  const categoryColors = {
    food: 'bg-orange-50 border-orange-200',
    outdoor: 'bg-green-50 border-green-200', 
    indoor: 'bg-purple-50 border-purple-200',
    social: 'bg-pink-50 border-pink-200',
    wellness: 'bg-cyan-50 border-cyan-200'
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      } as React.CSSProperties}
      {...attributes}
      {...listeners}
      data-draggable="true"
      className={cn(
        'group relative cursor-grab active:cursor-grabbing select-none',
        isBeingDragged && 'z-50 dragging'
      )}
    >

      <motion.div
        layout
        className={cn(
          'border rounded-lg p-3 bg-white shadow-sm transition-all relative z-10',
          categoryColors[activity.category] || 'bg-gray-50 border-gray-200',
          isBeingDragged && 'shadow-lg rotate-2 scale-105',
          !isBeingDragged && 'hover:shadow-md hover:border-primary/30'
        )}
        whileHover={!isBeingDragged ? { scale: 1.02 } : {}}
        whileTap={!isBeingDragged ? { scale: 0.98 } : {}}
      >
        {/* Drag Handle Indicator */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Remove Button */}
        <div 
          className="absolute right-1 top-1 z-20" 
          style={{ pointerEvents: 'auto' }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Remove button clicked for:', activity.name); // just for debugging man
            onRemove();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="pl-6 pr-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm leading-tight">
              {activity.name}
            </h4>
          </div>

          {/* Time and Cost */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{activity.startTime}</span>
              <span>-</span>
              <span>{activity.endTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>${activity.actualCost || activity.cost}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs px-2 py-0.5 border',
                moodColors[activity.mood]
              )}
            >
              {activity.mood}
            </Badge>
            
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {activity.duration}m
            </Badge>
          </div>

          {/* Description (if exists) */}
          {activity.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {activity.description}
            </p>
          )}
        </div>

        {/* Drag Indicator */}
        {isBeingDragged && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg pointer-events-none" />
        )}
      </motion.div>
    </div>
  );
}
