'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  Sparkles, 
  Heart, 
  Coffee,
  Zap,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanSetupModalProps {
  isOpen: boolean;
  onComplete: (setupData: {
    planName: string;
    budget: number;
    theme: string;
  }) => void;
  onClose: () => void;
}

interface SetupData {
  planName: string;
  budget: number;
  customBudget: string;
  theme: string;
}

const BUDGET_PRESETS = [
  { value: 50, label: '$50', icon: '💰', desc: 'Budget-friendly' },
  { value: 100, label: '$100', icon: '💸', desc: 'Moderate' },
  { value: 150, label: '$150', icon: '💵', desc: 'Popular choice' },
  { value: 200, label: '$200', icon: '💴', desc: 'Comfortable' },
  { value: 300, label: '$300', icon: '💎', desc: 'Premium' },
];

const THEME_OPTIONS = [
  { 
    value: 'balanced', 
    label: 'Balanced', 
    icon: <Coffee className="h-5 w-5" />, 
    desc: 'Mix of relaxation and adventure',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  { 
    value: 'adventurous', 
    label: 'Adventurous', 
    icon: <Zap className="h-5 w-5" />, 
    desc: 'High-energy activities',
    color: 'bg-orange-100 border-orange-300 text-orange-800'
  },
  { 
    value: 'relaxed', 
    label: 'Relaxed', 
    icon: <Heart className="h-5 w-5" />, 
    desc: 'Peaceful and restorative',
    color: 'bg-green-100 border-green-300 text-green-800'
  },
  { 
    value: 'social', 
    label: 'Social', 
    icon: <Users className="h-5 w-5" />, 
    desc: 'Friends and connections',
    color: 'bg-purple-100 border-purple-300 text-purple-800'
  },
];

export function PlanSetupModal({ isOpen, onComplete, onClose }: PlanSetupModalProps) {
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>({
    planName: '',
    budget: 150,
    customBudget: '',
    theme: 'balanced'
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    const finalBudget = setupData.customBudget 
      ? parseInt(setupData.customBudget) 
      : setupData.budget;
      
    onComplete({
      planName: setupData.planName || 'My Weekend Plan',
      budget: finalBudget,
      theme: setupData.theme
    });
  };

  const handleBudgetSelect = (value: number) => {
    setSetupData(prev => ({ ...prev, budget: value, customBudget: '' }));
  };

  const handleCustomBudgetChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSetupData(prev => ({ ...prev, customBudget: value, budget: numValue }));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return setupData.planName.trim().length > 0;
      case 2: return setupData.budget > 0;
      case 3: return setupData.theme.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl mx-4 bg-background border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Plan Name */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Lets Plan Your Perfect Weekend!</h2>
                  <p className="text-muted-foreground">
                    First, what would you like to call your weekend plan?
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="planName" className="text-sm font-medium">
                    Plan Name
                  </Label>
                  <Input
                    id="planName"
                    placeholder="e.g., Epic Weekend Adventure, Chill Saturday & Sunday..."
                    value={setupData.planName}
                    onChange={(e) => setSetupData(prev => ({ ...prev, planName: e.target.value }))}
                    className="text-lg"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps you identify your plan when you save multiple weekends
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto" />
                  <h2 className="text-2xl font-bold">Set Your Budget</h2>
                  <p className="text-muted-foreground">
                    How much would you like to spend this weekend?
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BUDGET_PRESETS.map((preset) => (
                    <Card
                      key={preset.value}
                      className={`cursor-pointer transition-all border-2 ${
                        setupData.budget === preset.value && !setupData.customBudget
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleBudgetSelect(preset.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-1">{preset.icon}</div>
                        <div className="font-bold text-lg">{preset.label}</div>
                        <div className="text-xs text-muted-foreground">{preset.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Or set a custom amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={setupData.customBudget}
                      onChange={(e) => handleCustomBudgetChange(e.target.value)}
                      className="pl-10"
                      min="1"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Theme */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <Heart className="h-12 w-12 text-red-500 mx-auto" />
                  <h2 className="text-2xl font-bold">What&apos;s Your Weekend Vibe?</h2>
                  <p className="text-muted-foreground">
                    Choose a style that matches your mood
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {THEME_OPTIONS.map((theme) => (
                    <Card
                      key={theme.value}
                      className={`cursor-pointer transition-all border-2 ${
                        setupData.theme === theme.value
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSetupData(prev => ({ ...prev, theme: theme.value }))}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${theme.color}`}>
                            {theme.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{theme.label}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{theme.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Ready */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-4">
                  <Clock className="h-16 w-16 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">Perfect! Let&apos;s Get Started</h2>
                  <p className="text-muted-foreground">
                    Your weekend plan is ready to be built
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Plan Name:</span>
                        <Badge variant="secondary" className="font-semibold">
                          {setupData.planName || 'My Weekend Plan'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Budget:</span>
                        <Badge variant="secondary" className="font-semibold text-green-700">
                          ${setupData.customBudget || setupData.budget}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Style:</span>
                        <Badge variant="secondary" className="font-semibold capitalize">
                          {THEME_OPTIONS.find(t => t.value === setupData.theme)?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                  You can always change these settings later in your plan
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {step} of 4
            </div>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <span>Start Planning!</span>
                <Sparkles className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
