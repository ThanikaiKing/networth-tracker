// Metrics cards component for displaying key financial metrics

'use client';

import React from 'react';
import { MetricsCardsProps } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { SkeletonCard } from '@/components/common/LoadingSpinner';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  icon,
  isLoading = false,
}) => {
  if (isLoading) {
    return <SkeletonCard />;
  }

  const trendColors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-gray-400">{icon}</div>}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {trendValue && (
        <div className="mt-4 flex items-center space-x-2">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span>{trendValue}</span>
          </div>
          <span className="text-xs text-gray-500">vs start of period</span>
        </div>
      )}
    </div>
  );
};

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  currentNetWorth,
  totalGrowth,
  growthRate,
  isLoading,
}) => {
  // Determine trend direction for growth metrics
  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Net Worth */}
      <MetricCard
        title="Current Net Worth"
        value={formatCurrency(currentNetWorth)}
        subtitle="Total assets minus liabilities"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        }
        isLoading={isLoading}
      />

      {/* Total Growth */}
      <MetricCard
        title="Total Growth"
        value={formatCurrency(Math.abs(totalGrowth))}
        subtitle="Absolute change in net worth"
        trend={getTrend(totalGrowth)}
        trendValue={formatCurrency(totalGrowth)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        isLoading={isLoading}
      />

      {/* Growth Rate */}
      <MetricCard
        title="Growth Rate"
        value={formatPercentage(Math.abs(growthRate))}
        subtitle="Percentage change in net worth"
        trend={getTrend(growthRate)}
        trendValue={formatPercentage(growthRate)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        isLoading={isLoading}
      />
    </div>
  );
};
