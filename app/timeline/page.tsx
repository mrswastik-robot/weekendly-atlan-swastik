'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useWeekendStore from '@/stores/weekendStore';

// timeline components
import { TimelineCustomizer } from './components/TimelineCustomizer';
import { TimelinePreview } from './components/TimelinePreview';
import { ExportControls } from './components/ExportControls';
import { ShareOptions } from './components/ShareOptions';
import { TimelineProgress } from './components/TimelineProgress';

interface TimelineConfig {
  format: 'story' | 'detailed' | 'compact' | 'professional';
  theme: 'default' | 'dark' | 'pastel' | 'vibrant' | 'minimal';
  showBudget: boolean;
  personalMessage: string;
}

export default function TimelinePage() {
  const { currentPlan } = useWeekendStore();
  const [step, setStep] = useState<'customize' | 'preview' | 'export'>('customize');
  const [timelineConfig, setTimelineConfig] = useState<TimelineConfig>({
    format: 'story',
    theme: 'default',
    showBudget: true,
    personalMessage: ''
  });

  // Check if we have a plan with activities
  const hasActivities = useMemo(() => {
    if (!currentPlan) return false;
    return (currentPlan.saturday.length + currentPlan.sunday.length) > 0;
  }, [currentPlan]);

  if (!currentPlan || !hasActivities) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">No Weekend Plan Found</h1>
          <p className="text-muted-foreground mb-6">
            Create a weekend plan with some activities first to generate a timeline.
          </p>
          <Button asChild>
            <Link href="/planner">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Planner
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Timeline Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a beautiful, shareable timeline of your weekend plan
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <TimelineProgress currentStep={step} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TimelineCustomizer 
                config={timelineConfig}
                onConfigChange={setTimelineConfig}
              />
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={() => setStep('preview')}
                  size="lg"
                  className="px-8"
                >
                  Preview Timeline
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TimelinePreview config={timelineConfig} />
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('customize')}
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button 
                  onClick={() => setStep('export')}
                  size="lg"
                  className="px-8"
                >
                  Export & Share
                  <Share2 className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <TimelinePreview config={timelineConfig} readonly />
                </div>
                <div className="space-y-6">
                  <ExportControls />
                  <ShareOptions planId={currentPlan.id} />
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('preview')}
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Preview
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
