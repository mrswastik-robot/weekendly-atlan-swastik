'use client';

import React from 'react';
import { DayColumn } from './DayColumn';
import useWeekendStore from '@/stores/weekendStore';

export function WeekendSchedule() {
  const {
    getScheduleForDay,
    removeActivityFromSchedule
  } = useWeekendStore();

  const saturdayActivities = getScheduleForDay('saturday');
  const sundayActivities = getScheduleForDay('sunday');

  const handleRemoveActivity = (activityId: string, day: 'saturday' | 'sunday') => {
    removeActivityFromSchedule(activityId, day);
  };

  return (
    <div className="space-y-4">
      {/* Saturday Column */}
      <DayColumn
        day="saturday"
        activities={saturdayActivities}
        onRemoveActivity={handleRemoveActivity}
      />

      {/* Sunday Column */}
      <DayColumn
        day="sunday"
        activities={sundayActivities}
        onRemoveActivity={handleRemoveActivity}
      />
    </div>
  );
}
