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
  accentColor?: 'emerald' | 'purple' | 'blue' | 'amber';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  icon,
  isLoading = false,
  accentColor = 'emerald',
}) => {
  if (isLoading) {
    return <SkeletonCard />;
  }

  const trendStyles = {
    up: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
    },
    down: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/20',
    },
    neutral: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-muted',
    },
  };

  const accentStyles = {
    emerald: {
      gradient: 'from-primary/20 via-transparent to-transparent',
      glow: 'shadow-primary/10',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    purple: {
      gradient: 'from-accent/20 via-transparent to-transparent',
      glow: 'shadow-accent/10',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    blue: {
      gradient: 'from-chart-2/20 via-transparent to-transparent',
      glow: 'shadow-chart-2/10',
      iconBg: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
    },
    amber: {
      gradient: 'from-chart-4/20 via-transparent to-transparent',
      glow: 'shadow-chart-4/10',
      iconBg: 'bg-chart-4/10',
      iconColor: 'text-chart-4',
    },
  };

  const accent = accentStyles[accentColor];
  const trendStyle = trendStyles[trend];

  const trendIcons = {
    up: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div className={`glass-card rounded-2xl p-6 hover-lift relative overflow-hidden group`}>
      {/* Gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              {icon && (
                <div className={`p-2.5 rounded-xl ${accent.iconBg} ${accent.iconColor}`}>
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground/70">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {trendValue && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trendStyle.bg} ${trendStyle.text} border ${trendStyle.border}`}>
                {trendIcons[trend]}
                <span className="tabular-nums">{trendValue}</span>
              </div>
              <span className="text-xs text-muted-foreground/60">vs start of period</span>
            </div>
          </div>
        )}
      </div>
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
        accentColor="emerald"
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
        accentColor="purple"
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
        accentColor="blue"
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
