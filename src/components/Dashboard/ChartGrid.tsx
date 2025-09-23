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
      'bg-white rounded-lg shadow-sm border border-gray-200',
      fullWidth && 'col-span-full',
      className
    )}>
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
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
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
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
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg mb-6">
      <div className="text-sm font-medium text-gray-700 mr-3 py-2">
        View:
      </div>
      {charts.map((chart) => (
        <button
          key={chart.id}
          onClick={() => onChartChange(chart.id)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            activeChart === chart.id
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
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
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          </svg>
        );
    }
  };

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className={cn(
                'text-lg font-bold mt-1',
                stat.color || 'text-gray-900'
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-center space-x-2 p-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-t"
                  style={{
                    height: `${Math.random() * 60 + 40}%`,
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



