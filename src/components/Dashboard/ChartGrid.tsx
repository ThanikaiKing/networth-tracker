// Chart Grid Layout Component - Responsive grid for organizing multiple charts

'use client';

import React from 'react';
import { ChartGridProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export const ChartGrid: React.FC<ChartGridProps> = ({ 
  children, 
  columns = 2 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  };

  return (
    <div className={cn(
      'grid gap-6',
      gridClasses[columns]
    )}>
      {children}
    </div>
  );
};

// Individual chart container with consistent styling
interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
  title,
  subtitle,
  fullWidth = false,
}) => {
  return (
    <div className={cn(
      'glass-card rounded-2xl hover-lift transition-all duration-300',
      fullWidth && 'col-span-full',
      className
    )}>
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6 pt-4' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

// Section divider for organizing chart groups
interface ChartSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="relative">
        {/* Section header with gradient underline */}
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 ml-4">
              {description}
            </p>
          )}
        </div>
        {/* Gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/30 via-accent/20 to-transparent"></div>
      </div>
      {children}
    </div>
  );
};

// Chart toggle/switcher for mobile optimization
interface ChartToggleProps {
  charts: {
    id: string;
    name: string;
    icon?: React.ReactNode;
  }[];
  activeChart: string;
  onChartChange: (chartId: string) => void;
}

export const ChartToggle: React.FC<ChartToggleProps> = ({
  charts,
  activeChart,
  onChartChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 glass rounded-xl mb-6">
      <div className="text-sm font-medium text-muted-foreground mr-3 py-2">
        View:
      </div>
      {charts.map((chart) => (
        <button
          key={chart.id}
          onClick={() => onChartChange(chart.id)}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            activeChart === chart.id
              ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
              : 'bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary hover:text-foreground'
          )}
        >
          {chart.icon && (
            <span className="w-4 h-4">
              {chart.icon}
            </span>
          )}
          <span>{chart.name}</span>
        </button>
      ))}
    </div>
  );
};

// Quick stats bar for chart insights
interface QuickStatsProps {
  stats: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }[];
  className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ 
  stats, 
  className 
}) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="glass p-4 rounded-xl hover-lift transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
              <div className={cn(
                'text-lg font-bold mt-1 tabular-nums',
                stat.color || 'text-foreground'
              )}>
                {stat.value}
              </div>
            </div>
            {stat.trend && (
              <div className="flex-shrink-0">
                {getTrendIcon(stat.trend)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading state for chart grids
export const ChartGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  // Static heights for skeleton bars
  const barHeights = ['60%', '45%', '75%', '40%', '55%', '80%'];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded-lg w-1/3 mb-2"></div>
            <div className="h-4 bg-muted/50 rounded-lg w-1/2 mb-6"></div>
            <div className="h-64 bg-muted/30 rounded-xl flex items-end justify-center space-x-2 p-4">
              {barHeights.map((height, j) => (
                <div
                  key={j}
                  className="bg-muted/50 rounded-t animate-shimmer"
                  style={{
                    height,
                    width: '12%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
