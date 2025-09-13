'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Activity, DayType, TimePreference } from '@/types';
import { TIME_WINDOWS } from '@/stores/weekendStore';

interface DaySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSchedule: (day: DayType, timePreference: TimePreference) => void;
  saturdayCount: number;
  sundayCount: number;
}

export function DaySelectionModal({ 
  isOpen, 
  onClose, 
  activity, 
  onSchedule,
  saturdayCount,
  sundayCount 
}: DaySelectionModalProps) {
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const [step, setStep] = useState<'day' | 'time'>('day');

  if (!activity) return null;

  const handleDaySelection = (day: DayType) => {
    setSelectedDay(day);
    setStep('time');
  };

  const handleTimeSelection = (timePreference: TimePreference) => {
    if (selectedDay) {
      onSchedule(selectedDay, timePreference);          //we've got our day and timepref from the modal
      onClose();
      resetModal();
    }
  };

  const handleBack = () => {
    setStep('day');
    setSelectedDay(null);
  };

  const resetModal = () => {
    setStep('day');
    setSelectedDay(null);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-2">
                    {step === 'time' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <CardTitle className="text-lg">
                      {step === 'day' ? 'Add to Schedule' : 'Choose Time'}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Activity Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">$</span>
                        {activity.cost}
                      </div>
                      {selectedDay && (
                        <Badge variant="outline" className="capitalize">
                          {selectedDay}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 'day' ? (
                      <motion.div
                        key="day-selection"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <h4 className="font-medium text-center">Choose a day:</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {/* Saturday */}
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                            onClick={() => handleDaySelection('saturday')}
                          >
                            <Calendar className="h-5 w-5 text-primary" />
                            <div className="text-center">
                              <div className="font-medium">Saturday</div>
                              <div className="text-xs text-muted-foreground">
                                {saturdayCount} {saturdayCount === 1 ? 'activity' : 'activities'}
                              </div>
                            </div>
                          </Button>

                          {/* Sunday */}
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                            onClick={() => handleDaySelection('sunday')}
                          >
                            <Calendar className="h-5 w-5 text-primary" />
                            <div className="text-center">
                              <div className="font-medium">Sunday</div>
                              <div className="text-xs text-muted-foreground">
                                {sundayCount} {sundayCount === 1 ? 'activity' : 'activities'}
                              </div>
                            </div>
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="time-selection"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="font-medium text-center">When would you like to schedule this?</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(TIME_WINDOWS).map(([key, timeWindow]) => (
                            <Button
                              key={key}
                              variant="outline"
                              className="h-auto p-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                              onClick={() => handleTimeSelection(key as TimePreference)}
                            >
                              <div className="text-2xl">{timeWindow.icon}</div>
                              <div className="text-center">
                                <div className="font-medium">{timeWindow.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {key === 'auto' ? 'Next available slot' : `${timeWindow.start} - ${timeWindow.end}`}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>

                        {/* Helpful hint for time selection */}
                        <div className="text-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          💡 We&apos;ll find the best available time in your preferred window
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Helpful hint for day selection */}
                  {step === 'day' && (
                    <div className="text-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      💡 Next you&apos;ll choose your preferred time window
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


