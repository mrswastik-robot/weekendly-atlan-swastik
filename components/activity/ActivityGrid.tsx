'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  DollarSign, 
  Heart, 
  Zap, 
  Smile, 
  Leaf,
  ChefHat,
  Mountain,
  Home,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityCard } from './ActivityCard';
import { DaySelectionModal } from '@/components/schedule/DaySelectionModal';
import useWeekendStore from '@/stores/weekendStore';
import type { Activity, CategoryType, MoodType, CostType, DayType, TimePreference } from '@/types';
import { cn } from '@/lib/utils';

interface ActivityGridProps {
  onSelectActivity?: (activity: Activity) => void;
  className?: string;
}

const categoryConfig = {
  food: { icon: ChefHat, label: 'Food', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  outdoor: { icon: Mountain, label: 'Outdoor', color: 'text-green-600 bg-green-50 border-green-200' },
  indoor: { icon: Home, label: 'Indoor', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  social: { icon: Users, label: 'Social', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  wellness: { icon: Sparkles, label: 'Wellness', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' }
};

const moodConfig = {
  happy: { icon: Smile, label: 'Happy', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  relaxed: { icon: Leaf, label: 'Relaxed', color: 'text-green-600 bg-green-50 border-green-200' },
  energetic: { icon: Zap, label: 'Energetic', color: 'text-red-600 bg-red-50 border-red-200' },
  peaceful: { icon: Heart, label: 'Peaceful', color: 'text-blue-600 bg-blue-50 border-blue-200' }
};

const costConfig = {
  free: { label: 'Free', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  low: { label: 'Low ($)', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  medium: { label: 'Medium ($$)', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  high: { label: 'High ($$$)', color: 'text-red-600 bg-red-50 border-red-200' }
};

export function ActivityGrid({ onSelectActivity, className }: ActivityGridProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedActivityForScheduling, setSelectedActivityForScheduling] = useState<Activity | null>(null);
  
  const {
    getFilteredActivities,
    selectedCategory,
    selectedMood,
    selectedCostType,
    searchQuery,
    setSelectedCategory,
    setSelectedMood,
    setSelectedCostType,
    setSearchQuery,
    clearFilters,
    addActivityWithTimePreference,
    getScheduleForDay
  } = useWeekendStore();

  const filteredActivities = getFilteredActivities();
  const activeFiltersCount = [selectedCategory, selectedMood, selectedCostType].filter(Boolean).length;

  const handleActivitySelect = (activity: Activity) => {
    onSelectActivity?.(activity);
  };

  const handleAddToSchedule = (activity: Activity) => {
    setSelectedActivityForScheduling(activity);
    setShowDayModal(true);
  };

  const handleScheduleWithTimePreference = (day: DayType, timePreference: TimePreference) => {
    if (selectedActivityForScheduling) {
      addActivityWithTimePreference(selectedActivityForScheduling, day, timePreference);
      setSelectedActivityForScheduling(null);
      setShowDayModal(false);
    }
  };

  const saturdayActivities = getScheduleForDay('saturday');
  const sundayActivities = getScheduleForDay('sunday');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Category Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(categoryConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        const isSelected = selectedCategory === key;
                        
                        return (
                          <Button
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(isSelected ? null : key as CategoryType)}
                            className={cn(
                              'flex items-center gap-2',
                              !isSelected && config.color
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Mood</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(moodConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        const isSelected = selectedMood === key;
                        
                        return (
                          <Button
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMood(isSelected ? null : key as MoodType)}
                            className={cn(
                              'flex items-center gap-2',
                              !isSelected && config.color
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Budget Range</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(costConfig).map(([key, config]) => {
                        const isSelected = selectedCostType === key;
                        
                        return (
                          <Button
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCostType(isSelected ? null : key as CostType)}
                            className={cn(
                              'flex items-center gap-2',
                              !isSelected && config.color
                            )}
                          >
                            <DollarSign className="h-4 w-4" />
                            {config.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
        </span>
        
        {filteredActivities.length > 0 && (
          <span>
            Budget range: ${Math.min(...filteredActivities.map(a => a.cost))} - ${Math.max(...filteredActivities.map(a => a.cost))}
          </span>
        )}
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: index * 0.05 }
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleActivitySelect(activity)}
            >
              <ActivityCard
                activity={activity}
                onAddToSchedule={handleAddToSchedule}
                showAddButton={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No activities found</h3>
            <p className="text-sm">
              Try adjusting your filters or search terms to find more activities.
            </p>
          </div>
          
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Enhanced Day & Time Selection Modal */}
      <DaySelectionModal
        isOpen={showDayModal}
        onClose={() => {
          setShowDayModal(false);
          setSelectedActivityForScheduling(null);
        }}
        activity={selectedActivityForScheduling}
        onSchedule={handleScheduleWithTimePreference}
        saturdayCount={saturdayActivities.length}
        sundayCount={sundayActivities.length}
      />
    </div>
  );
}

export default ActivityGrid;
