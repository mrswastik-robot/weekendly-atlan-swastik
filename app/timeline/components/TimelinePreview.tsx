'use client';

import React, { useMemo } from 'react';
import { Chrono } from 'react-chrono';
import '../styles/timeline.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import useWeekendStore from '@/stores/weekendStore';
import { 
  transformToTimelineData, 
  getChronoTheme, 
  getChronoConfig,
  type TimelineConfig 
} from '../utils/timelineData';

interface TimelinePreviewProps {
  config: TimelineConfig;
  readonly?: boolean;
}

export function TimelinePreview({ config, readonly = false }: TimelinePreviewProps) {
  const { currentPlan } = useWeekendStore();

  // Transform data for React-Chrono
  const timelineData = useMemo(() => {
    if (!currentPlan) return [];
    return transformToTimelineData(currentPlan, config);
  }, [currentPlan, config]);

  // Get theme and configuration for React-Chrono
  const chronoTheme = useMemo(() => getChronoTheme(config.theme), [config.theme]);
  const chronoConfig = useMemo(() => getChronoConfig(config.format), [config.format]);

  if (!currentPlan || timelineData.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Activities to Display</h3>
          <p className="text-muted-foreground text-center">
            Add some activities to your weekend plan to see the timeline preview.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Timeline Stats */}
      {!readonly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {currentPlan.saturday.length + currentPlan.sunday.length}
                </div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    [...currentPlan.saturday, ...currentPlan.sunday]
                      .reduce((total, activity) => total + activity.duration, 0) / 60
                  )}h
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </CardContent>
          </Card>
          
          {config.showBudget && (
            <Card>
              <CardContent className="flex items-center p-4">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">${currentPlan.estimatedCost}</div>
                  <div className="text-sm text-muted-foreground">
                    of ${currentPlan.totalBudget}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Timeline Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {config.personalMessage || 'Weekend Timeline'}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {config.format}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {config.theme}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline Export Container */}
          <div 
            id="timeline-export" 
            className={`timeline-container timeline-theme-${config.theme} bg-background p-6 rounded-lg`}
            style={{ 
              minHeight: config.format === 'compact' ? '300px' : '500px',
              backgroundColor: chronoTheme.cardBgColor 
            }}
          >
            <Chrono
              items={timelineData}
              mode={chronoConfig.mode}
              theme={chronoTheme}
              fontSizes={chronoConfig.fontSizes}
              cardHeight={chronoConfig.cardHeight}
              contentDetailsHeight={chronoConfig.contentDetailsHeight}
              enableOutline
              hideControls={readonly}
              scrollable={!readonly}
              flipLayout={false}
              disableNavOnKey={readonly}
              allowDynamicUpdate={!readonly}
              parseDetailsAsHTML={false}
              useReadMore={false}
              cardLess={false}
              borderLessCards={config.theme === 'pastel'}
            />
          </div>
          
          {/* Timeline Footer */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Generated on {new Date().toLocaleDateString()}
              </span>
              <span>
                Made with Weekendly
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format-specific tips */}
      {!readonly && (
        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-lg">💡</div>
                <div>
                  <h4 className="font-medium mb-1">Timeline Tips</h4>
                  <div className="text-sm text-muted-foreground">
                    {getFormatTips(config.format)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function getFormatTips(format: string): string {
  const tips = {
    story: 'Perfect for sharing on social media. Compact format highlights key information.',
    detailed: 'Complete information display. Great for planning and detailed sharing.',
    compact: 'Horizontal timeline provides quick overview. Best for presentations.',
    professional: 'Business-friendly format suitable for formal contexts.'
  };
  
  return tips[format as keyof typeof tips] || tips.story;
}
