'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Heart, 
  Sparkles, 
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityGrid } from '@/components/activity/ActivityGrid';
import useWeekendStore from '@/stores/weekendStore';
import activities from '@/data/activities';

export default function WeekendPlanner() {
  const [mounted, setMounted] = useState(false);
  const { 
    setActivities, 
    createNewPlan, 
    currentPlan,
    getTotalEstimatedCost,
    getBudgetStatus,
    getScheduleForDay
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

  const budgetStatusConfig = {
    under: { color: 'text-green-600 bg-green-50', label: 'Under Budget' },
    near: { color: 'text-orange-600 bg-orange-50', label: 'Near Budget' },
    over: { color: 'text-red-600 bg-red-50', label: 'Over Budget' }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <div className="bg-primary/5 absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🌟 Budget Tracking Enabled
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Plan Your Perfect{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Weekend
              </span>
            </h1>
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
              
              <div className="space-y-4">
                {/* Saturday */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Saturday
                      <Badge variant="outline" className="text-xs">
                        {saturdayActivities.length} activities
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {saturdayActivities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activities planned</p>
                        <p className="text-xs">Select activities to add them here</p>
                      </div>
                    ) : (
                      saturdayActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-2 border rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {activity.startTime} • ${activity.cost}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Sunday */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Sunday
                      <Badge variant="outline" className="text-xs">
                        {sundayActivities.length} activities
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sundayActivities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activities planned</p>
                        <p className="text-xs">Select activities to add them here</p>
                      </div>
                    ) : (
                      sundayActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-2 border rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {activity.startTime} • ${activity.cost}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
