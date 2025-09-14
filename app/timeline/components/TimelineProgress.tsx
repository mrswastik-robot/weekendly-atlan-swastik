'use client';

import React from 'react';
import { Check, Palette, Eye, Share2 } from 'lucide-react';

interface TimelineProgressProps {
  currentStep: 'customize' | 'preview' | 'export';
}

export function TimelineProgress({ currentStep }: TimelineProgressProps) {
  const steps = [
    { id: 'customize', title: 'Customize', icon: Palette },
    { id: 'preview', title: 'Preview', icon: Eye },
    { id: 'export', title: 'Export', icon: Share2 },
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={step.id} className="flex items-center">
            <div 
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${isActive ? 'border-primary bg-primary text-primary-foreground' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-muted-foreground/20 bg-background text-muted-foreground'}
              `}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <span 
              className={`
                ml-2 text-sm font-medium
                ${isActive ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-12 h-0.5 mx-4 transition-all
                  ${isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

