'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimelineConfig {
  format: 'story' | 'detailed' | 'compact' | 'professional';
  theme: 'default' | 'dark' | 'pastel' | 'vibrant' | 'minimal';
  showBudget: boolean;
  personalMessage: string;
}

interface TimelineCustomizerProps {
  config: TimelineConfig;
  onConfigChange: (config: TimelineConfig) => void;
}

const TIMELINE_FORMATS = {
  story: {
    description: '📱 Perfect for social sharing',
    details: 'Compact vertical layout with essential information'
  },
  detailed: {
    description: '📊 Complete activity information',
    details: 'Full details with budget, mood, and category information'
  },
  compact: {
    description: '📅 Clean overview format',
    details: 'Horizontal timeline for quick overview'
  },
  professional: {
    description: '💼 Business presentation style',
    details: 'Professional layout suitable for formal sharing'
  }
};

const THEME_OPTIONS = {
  default: {
    name: '🎨 Default',
    description: 'Clean, modern design'
  },
  dark: {
    name: '🌙 Dark Mode',
    description: 'Dark theme for low-light viewing'
  },
  pastel: {
    name: '🌸 Pastel Dreams',
    description: 'Soft, calming colors'
  },
  vibrant: {
    name: '🌈 Vibrant Energy',
    description: 'Bold, energetic colors'
  },
  minimal: {
    name: '⚪ Minimal Clean',
    description: 'Simple, distraction-free design'
  }
};

export function TimelineCustomizer({ config, onConfigChange }: TimelineCustomizerProps) {
  const updateConfig = (updates: Partial<TimelineConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize Your Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Format Selection */}
            <div className="space-y-3">
              <Label htmlFor="format" className="text-sm font-medium">
                Timeline Format
              </Label>
              <Select
                value={config.format}
                onValueChange={(value: 'story' | 'detailed' | 'compact' | 'professional') => 
                  updateConfig({ format: value })
                }
              >
                <SelectTrigger className='p-5 hover:bg-accent'>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIMELINE_FORMATS).map(([key, formatInfo]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{formatInfo.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatInfo.details}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Theme Selection */}
            <div className="space-y-3">
              <Label htmlFor="theme" className="text-sm font-medium">
                Color Theme
              </Label>
              <Select
                value={config.theme}
                onValueChange={(value: 'default' | 'dark' | 'pastel' | 'vibrant' | 'minimal') => 
                  updateConfig({ theme: value })
                }
              >
                <SelectTrigger className='p-5 hover:bg-accent'>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(THEME_OPTIONS).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {theme.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personal Message */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-medium">
                Personal Message (Optional)
              </Label>
              <Input
                id="message"
                placeholder="Our Epic Weekend guys! 🎉"
                value={config.personalMessage}
                onChange={(e) => updateConfig({ personalMessage: e.target.value })}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                This will appear at the top of your timeline
              </p>
            </div>

            {/* Budget Display Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Display Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-budget"
                  checked={config.showBudget}
                  onCheckedChange={(checked) => updateConfig({ showBudget: !!checked })}
                />
                <Label htmlFor="show-budget" className="text-sm">
                  💰 Show budget information
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Include cost details and budget summary in the timeline
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Format:</span>
              <p className="capitalize">{config.format}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Theme:</span>
              <p className="capitalize">{config.theme}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Budget:</span>
              <p>{config.showBudget ? 'Shown' : 'Hidden'}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Message:</span>
              <p className="truncate">
                {config.personalMessage || 'None'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

