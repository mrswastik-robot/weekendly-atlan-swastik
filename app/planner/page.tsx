'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { 
  Calendar, 
  DollarSign, 
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityGrid } from '@/components/activity/ActivityGrid';
import { WeekendSchedule } from '@/components/schedule/WeekendSchedule';
import { ActivityCard } from '@/components/activity/ActivityCard';
import useWeekendStore from '@/stores/weekendStore';
import activities from '@/data/activities';
import type { Activity, ScheduledActivity } from '@/types';

export default function WeekendPlanner() {
  const [mounted, setMounted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Activity | ScheduledActivity | null>(null);
  
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag distance before starting drag
        delay: 50, // 50ms delay before starting drag
        tolerance: 3,
      },
    })
  );
  
  const { 
    setActivities, 
    createNewPlan, 
    currentPlan,
    getTotalEstimatedCost,
    getBudgetStatus,
    getScheduleForDay,
    addActivityToSchedule,
    moveActivity,
    reorderActivities,
    getNextAvailableTime
  } = useWeekendStore();

  useEffect(() => {
    setMounted(true);
    // Initialize activities on first load
    setActivities(activities);
    
    // Create a sample plan if none exists
    if (!currentPlan) {
      createNewPlan('My Weekend Plan', 'balanced', 150);
    }
  }, [setActivities, createNewPlan, currentPlan]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const saturdayActivities = getScheduleForDay('saturday');
  const sundayActivities = getScheduleForDay('sunday');
  const totalCost = getTotalEstimatedCost();
  const budgetStatus = getBudgetStatus();

  // Handle drag and drop across the entire planner
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    
    console.log('Drag Start - Active ID:', activeId); // Debug log
    
    // Check if it's a scheduled activity (they have 'scheduled-' prefix)
    if (activeId.startsWith('scheduled-')) {
      const scheduledActivity = [...saturdayActivities, ...sundayActivities].find(
        a => a.id === activeId
      );
      
      if (scheduledActivity) {
        console.log('Dragging scheduled activity:', scheduledActivity.name);
        setDraggedItem(scheduledActivity);
        return;
      }
    }
    
    // It's an activity from the grid (original activities)
    const activity = activities.find(a => a.id === activeId);
    if (activity) {
      console.log('Dragging activity from grid:', activity.name);
      setDraggedItem(activity);
    }
  };

  // Helper function to recalculate activity times in order
  const recalculateActivityTimes = (activities: ScheduledActivity[]): ScheduledActivity[] => {
    if (activities.length === 0) return activities;
    
    // Start from 9:00 AM
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0);
    
    return activities.map((activity) => {
      const startTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Calculate end time
      const endDate = new Date(currentTime.getTime() + activity.duration * 60000);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      // Set next start time (end time + 30 minutes gap)
      currentTime = new Date(endDate.getTime() + 30 * 60000);
      
      return {
        ...activity,
        startTime,
        endTime
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !draggedItem) {
      setDraggedItem(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    console.log('Global Drag End:', { activeId, overId, draggedItem });

    // Check if dragging from ActivityGrid to schedule
    const isFromActivityGrid = !activeId.startsWith('scheduled-');
    
    if (isFromActivityGrid) {
      // Dragging from ActivityGrid to schedule
      if (overId === 'saturday-droppable' || overId === 'sunday-droppable') {
        const toDay = overId.replace('-droppable', '') as 'saturday' | 'sunday';
        console.log('Adding activity from grid to', toDay);
        addActivityToSchedule(draggedItem as Activity, toDay, '');
      } else {
        console.log('Drop target not recognized for grid activity:', overId);
      }
    } else {
      // Dragging within schedule (reordering or moving between days)
      const scheduledActivity = draggedItem as ScheduledActivity;
      const fromDay = scheduledActivity.day;

      console.log('Dragging scheduled activity from', fromDay, 'to', overId);

      // Check if we're dropping on a droppable area (day column)
      if (overId === 'saturday-droppable' || overId === 'sunday-droppable') {
        const toDay = overId.replace('-droppable', '') as 'saturday' | 'sunday';
        
        if (fromDay !== toDay) {
          // Moving between days - use next available time
          console.log('Moving between days:', fromDay, '->', toDay);
          const nextTime = getNextAvailableTime(toDay);
          moveActivity(activeId, fromDay, toDay, nextTime);
        } else {
          console.log('Dropped on same day, no action needed');
        }
      } else {
        // Check if dropping on another scheduled activity (reordering)
        const targetActivity = [...saturdayActivities, ...sundayActivities].find(
          a => a.id === overId
        );
        
        if (targetActivity && targetActivity.day === fromDay && activeId !== overId) {
          // Reordering within same day
          console.log('Reordering within day:', fromDay, 'from', activeId, 'to', overId);
          const dayActivities = fromDay === 'saturday' ? saturdayActivities : sundayActivities;
          const oldIndex = dayActivities.findIndex(a => a.id === activeId);
          const newIndex = dayActivities.findIndex(a => a.id === overId);
          
          console.log('Reorder indices:', { oldIndex, newIndex, dayActivities: dayActivities.map(a => a.id) });
          
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reorderedActivities = arrayMove(dayActivities, oldIndex, newIndex);
            console.log('Performing reorder - before:', dayActivities.map(a => a.id));
            console.log('Performing reorder - after:', reorderedActivities.map(a => a.id));
            
            // Recalculate times based on new order
            const recalculatedActivities = recalculateActivityTimes(reorderedActivities);
            console.log('Recalculated times:', recalculatedActivities.map(a => ({ id: a.id, time: a.startTime })));
            
            reorderActivities(fromDay, recalculatedActivities);
          }
        } else if (targetActivity && targetActivity.day !== fromDay) {
          // Moving to different day via activity - use next available time
          console.log('Moving to different day via activity:', fromDay, '->', targetActivity.day);
          const nextTime = getNextAvailableTime(targetActivity.day);
          moveActivity(activeId, fromDay, targetActivity.day, nextTime);
        } else {
          console.log('No valid drop target found for scheduled activity');
        }
      }
    }

    setDraggedItem(null);
  };

  const budgetStatusConfig = {
    under: { color: 'text-green-600 bg-green-50', label: 'Under Budget' },
    near: { color: 'text-orange-600 bg-orange-50', label: 'Near Budget' },
    over: { color: 'text-red-600 bg-red-50', label: 'Over Budget' }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Hero Section */}
      <div className="relative">
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🌟 Budget Tracking Enabled
            </Badge>
            {/* <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Plan Your Perfect{' '}
              <span className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-1">
                Weekend
              </span>
            </h1> */}

            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-1"
          >
            Plan Your Perfect Weekend
          </motion.h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Design your ideal weekend with smart budget tracking, mood-based activities, 
              and intuitive scheduling. Make every weekend memorable.
            </p>
          </motion.div>

          {/* Quick Stats */}
          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{saturdayActivities.length + sundayActivities.length}</div>
                  <div className="text-sm text-muted-foreground">Activities</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">${totalCost}</div>
                  <div className="text-sm text-muted-foreground">Estimated Cost</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">${currentPlan.totalBudget}</div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${budgetStatusConfig[budgetStatus].color}`}>
                    {budgetStatusConfig[budgetStatus].label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Browser */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Browse Activities
              </h2>
              <ActivityGrid />
            </motion.div>
          </div>

          {/* Weekend Schedule */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Weekend Schedule
              </h2>
              
              {/* Drag & Drop Weekend Schedule */}
              <div className="space-y-4">
                <WeekendSchedule />

                {/* Budget Summary */}
                {currentPlan && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Budget Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Cost:</span>
                          <span className="font-medium">${totalCost}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Budget:</span>
                          <span className="font-medium">${currentPlan.totalBudget}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remaining:</span>
                          <span className={`font-medium ${currentPlan.totalBudget - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${currentPlan.totalBudget - totalCost}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              budgetStatus === 'over' ? 'bg-red-500' : 
                              budgetStatus === 'near' ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((totalCost / currentPlan.totalBudget) * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        {/* Timeline Generation Button */}
                        {(saturdayActivities.length > 0 || sundayActivities.length > 0) && (
                          <div className="pt-4 border-t">
                            <Button 
                              asChild 
                              className="w-full" 
                              variant="outline"
                              size="sm"
                            >
                              <Link href="/timeline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Generate Timeline
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Drag Overlay */}
      <DragOverlay>
        {draggedItem && (
          <div className="rotate-6 opacity-95 transform scale-105">
            {'day' in draggedItem ? (
              // Rendering scheduled activity
              <div className="bg-white border rounded-lg p-3 shadow-lg">
                <div className="font-medium text-sm">{draggedItem.name}</div>
                <div className="text-xs text-muted-foreground">
                  {draggedItem.startTime} • ${draggedItem.cost}
                </div>
              </div>
            ) : (
              // Rendering activity from grid
              <ActivityCard 
                activity={draggedItem} 
                onAddToSchedule={() => {}} 
                showAddButton={false}
                isDraggable={false}
              />
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
