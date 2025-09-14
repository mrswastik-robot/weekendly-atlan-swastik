declare module 'react-chrono' {
  import React from 'react';

  export interface TimelineItem {
    title?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardDetailedText?: string;
    media?: {
      source: {
        url: string;
      };
      type: 'IMAGE' | 'VIDEO';
    };
  }

  export interface ChronoTheme {
    primary?: string;
    secondary?: string;
    cardBgColor?: string;
    titleColor?: string;
    titleColorActive?: string;
    cardBorderColor?: string;
    detailsColor?: string;
  }

  export interface FontSizes {
    cardSubtitle?: string;
    cardText?: string;
    cardTitle?: string;
    title?: string;
  }

  export interface ChronoProps {
    items: TimelineItem[];
    mode?: 'VERTICAL' | 'HORIZONTAL' | 'VERTICAL_ALTERNATING' | 'HORIZONTAL_ALL';
    theme?: ChronoTheme;
    fontSizes?: FontSizes;
    cardHeight?: number;
    contentDetailsHeight?: number;
    enableOutline?: boolean;
    hideControls?: boolean;
    scrollable?: boolean;
    flipLayout?: boolean;
    disableNavOnKey?: boolean;
    allowDynamicUpdate?: boolean;
    parseDetailsAsHTML?: boolean;
    useReadMore?: boolean;
    cardLess?: boolean;
    borderLessCards?: boolean;
    className?: string;
    onScrollEnd?: () => void;
    onItemSelect?: (item: TimelineItem, index: number) => void;
  }

  export const Chrono: React.FC<ChronoProps>;
}

