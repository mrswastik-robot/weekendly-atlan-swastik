'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScheduledActivityCard } from './ScheduledActivityCard';
import type { ScheduledActivity } from '@/types';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  day: 'saturday' | 'sunday';
  activities: ScheduledActivity[];
  onRemoveActivity: (activityId: string, day: 'saturday' | 'sunday') => void;
}

export function DayColumn({ day, activities, onRemoveActivity }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${day}-droppable`,
  });

  const dayDisplayName = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <Card 
      className={cn(
        'transition-all duration-200',
        isOver && 'ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-lg'
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {dayDisplayName}
          </div>
          <Badge variant="outline" className="text-xs">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent ref={setNodeRef} className="min-h-[200px] space-y-2">
        <SortableContext 
          items={activities.map(a => a.id)} 
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg transition-colors',
                  isOver ? 'border-primary/70 bg-primary/10' : 'border-muted'
                )}
              >
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activities planned</p>
                <p className="text-xs">
                  {isOver 
                    ? 'Drop activity here' 
                    : 'Drag activities here or use the + button'
                  }
                </p>
              </motion.div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ScheduledActivityCard
                    activity={activity}
                    onRemove={() => onRemoveActivity(activity.id, day)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
