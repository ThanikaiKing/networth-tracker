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
    <div className={cn('grid gap-5', gridClasses[columns])}>
      {children}
    </div>
  );
};

// Individual chart container
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
      'chart-card hover-lift',
      fullWidth && 'col-span-full',
      className
    )}>
      {(title || subtitle) && (
        <div className="px-6 pt-5 pb-0">
          {title && (
            <h3
              className="font-display text-lg font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6 pt-4' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

// Section header with editorial serif title
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
    <div className={cn('space-y-5', className)}>
      <div>
        <h2
          className="font-display text-2xl font-semibold text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        <div className="mt-3 divider" />
      </div>
      {children}
    </div>
  );
};

// Chart view toggle
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
    <div className="period-tab-bar mb-5">
      {charts.map((chart) => (
        <button
          key={chart.id}
          onClick={() => onChartChange(chart.id)}
          className={cn(
            'period-tab flex items-center gap-1.5',
            activeChart === chart.id && 'active'
          )}
        >
          {chart.icon && <span className="w-3.5 h-3.5">{chart.icon}</span>}
          <span>{chart.name}</span>
        </button>
      ))}
    </div>
  );
};

// Quick stats bar
interface QuickStatsProps {
  stats: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }[];
  className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, className }) => {
  const getTrendArrow = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <span className="text-primary">↑</span>;
    if (trend === 'down') return <span className="text-destructive">↓</span>;
    return null;
  };

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="glass p-3.5 rounded hover-lift">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">
            {stat.label}
          </div>
          <div className={cn('text-base font-bold tabular-nums flex items-center gap-1', stat.color || 'text-foreground')}>
            {stat.value}
            {getTrendArrow(stat.trend)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for chart grids
export const ChartGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const barHeights = ['60%', '45%', '75%', '40%', '55%', '80%'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="chart-card p-6">
          <div className="animate-pulse">
            <div className="h-5 bg-muted rounded w-1/3 mb-1.5" />
            <div className="h-3.5 bg-muted/60 rounded w-1/2 mb-5" />
            <div className="h-56 bg-muted/20 rounded flex items-end justify-center gap-2 p-4 border border-muted/30">
              {barHeights.map((height, j) => (
                <div
                  key={j}
                  className="bg-muted/40 rounded-t animate-shimmer"
                  style={{ height, width: '12%' }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
