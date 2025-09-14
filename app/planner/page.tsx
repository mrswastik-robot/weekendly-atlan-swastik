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
import { PlanSetupModal } from '@/components/onboarding/PlanSetupModal';
import useWeekendStore from '@/stores/weekendStore';
import activities from '@/data/activities';
import { getThemeConfig, getThemeSpecificActivities } from '@/utils/themeConfig';
import { useToast } from '@/hooks/use-toast';
import type { Activity, ScheduledActivity } from '@/types';

export default function WeekendPlanner() {
  const [mounted, setMounted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Activity | ScheduledActivity | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const { toast } = useToast();
  
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
    _hasHydrated,
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
  }, [setActivities]);

  // first let's try to restore from localstorage, if not then create a new plan
  useEffect(() => {
    if (_hasHydrated && mounted && !currentPlan) {
      setShowSetupModal(true);
    }
  }, [_hasHydrated, mounted, currentPlan]);

  const handlePlanSetup = (setupData: { planName: string; budget: number; theme: string }) => {
    createNewPlan(setupData.planName, setupData.theme, setupData.budget);
    setShowSetupModal(false);
  };

  const handleModalClose = () => {
    // default plan if user dismisses modal without completing setup
    if (!currentPlan) {
      createNewPlan('My Weekend Plan', 'balanced', 150);
      toast({
        title: "Default Plan Created! 📅",
        description: "We've set up a $150 budget weekend plan for you. You can customize it anytime!",
      });
    }
    setShowSetupModal(false);
  };

  // Update document title with plan name
  useEffect(() => {
    if (currentPlan) {
      document.title = `${currentPlan.name} | Weekendly`;
    } else {
      document.title = 'Weekend Planner | Weekendly';
    }
  }, [currentPlan]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const saturdayActivities = getScheduleForDay('saturday');
  const sundayActivities = getScheduleForDay('sunday');
  const totalCost = getTotalEstimatedCost();
  const budgetStatus = getBudgetStatus();

  const themeConfig = currentPlan ? getThemeConfig(currentPlan.theme) : getThemeConfig('balanced');
  const themedActivities = currentPlan ? getThemeSpecificActivities(currentPlan.theme, activities) : [];
  const planName = currentPlan?.name || 'Your Weekend Plan';

  // Handle drag and drop across the entire planner
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    
    console.log('Drag Start - Active ID:', activeId); // Debug log
    
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
          console.log('Reordering within day:', fromDay, 'from', activeId, 'to', overId);
          const dayActivities = fromDay === 'saturday' ? saturdayActivities : sundayActivities;
          const oldIndex = dayActivities.findIndex(a => a.id === activeId);
          const newIndex = dayActivities.findIndex(a => a.id === overId);
          
          console.log('Reorder indices:', { oldIndex, newIndex, dayActivities: dayActivities.map(a => a.id) });
          
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reorderedActivities = arrayMove(dayActivities, oldIndex, newIndex);
            console.log('Performing reorder - before:', dayActivities.map(a => a.id));
            console.log('Performing reorder - after:', reorderedActivities.map(a => a.id));
            
            const recalculatedActivities = recalculateActivityTimes(reorderedActivities);
            console.log('Recalculated times:', recalculatedActivities.map(a => ({ id: a.id, time: a.startTime })));
            
            reorderActivities(fromDay, recalculatedActivities);
          }
        } else if (targetActivity && targetActivity.day !== fromDay) {
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
    <>
      {/* Plan Setup Modal */}
      <PlanSetupModal
        isOpen={showSetupModal}
        onComplete={handlePlanSetup}
        onClose={handleModalClose}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      {/* Hero Section */}
      <div className="relative">
        {/* Dynamic theme-based background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: themeConfig.backgroundStyle }}
        />
        
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className={`mb-4 ${themeConfig.colors.badge}`}>
              {themeConfig.emoji} {themeConfig.name} Mode
            </Badge>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`bg-gradient-to-r ${themeConfig.colors.primary} bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-1`}
            >
              {planName}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
            >
              {themeConfig.personality.greeting}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`${themeConfig.colors.accent} rounded-lg p-4 max-w-lg mx-auto`}
            >
              <p className="text-sm font-medium">
                {themeConfig.personality.motivation}
              </p>
            </motion.div>
          </motion.div>

          {/* Theme-Specific Activity Recommendations */}
          {currentPlan && themedActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className={`${themeConfig.colors.gradient} border-2 ${themeConfig.colors.accent.split(' ')[0]}`}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <span className="text-2xl">{themeConfig.emoji}</span>
                    {themeConfig.personality.activityPrompt}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {themedActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ActivityCard
                          activity={activity}
                          onAddToSchedule={(activity) => addActivityToSchedule(activity, 'saturday')}
                          showAddButton={true}
                          isDraggable={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

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
              
              <Card className={`${themeConfig.colors.secondary} border-2 ${themeConfig.colors.accent.split(' ')[0]}`}>
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${budgetStatusConfig[budgetStatus].color} mb-2`}>
                    {budgetStatusConfig[budgetStatus].label}
                  </div>
                  <div className="text-xs text-muted-foreground italic">
                    {themeConfig.personality.budgetTip}
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
    </>
  );
}
