'use client';

import React from 'react';
import { MetricsCardsProps } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentClass?: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  accentClass = 'accent-green',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={`card ${accentClass} p-5`}>
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-muted rounded w-2/5" />
          <div className="h-9 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="pt-2">
            <div className="h-5 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  const badgeClass =
    trend === 'up' ? 'badge-positive' : trend === 'down' ? 'badge-negative' : 'badge-neutral';

  const trendArrow =
    trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className={`card ${accentClass} p-5 hover-lift`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-2">
        {title}
      </p>

      <p className="text-[1.7rem] sm:text-[2.1rem] font-bold leading-none text-foreground tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
      )}

      {trendValue && (
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            <span>{trendArrow}</span>
            <span className="tabular-nums">{trendValue}</span>
          </span>
          <span className="text-[11px] text-muted-foreground/60">vs start of period</span>
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
  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard
        title="Current Net Worth"
        value={formatCurrency(currentNetWorth)}
        subtitle="Total assets minus liabilities"
        accentClass="accent-green"
        isLoading={isLoading}
      />

      <MetricCard
        title="Total Growth"
        value={formatCurrency(Math.abs(totalGrowth))}
        subtitle="Absolute change in net worth"
        trend={getTrend(totalGrowth)}
        trendValue={formatCurrency(totalGrowth)}
        accentClass="accent-amber"
        isLoading={isLoading}
      />

      <MetricCard
        title="Growth Rate"
        value={formatPercentage(Math.abs(growthRate))}
        subtitle="Percentage change in net worth"
        trend={getTrend(growthRate)}
        trendValue={formatPercentage(growthRate)}
        accentClass="accent-blue"
        isLoading={isLoading}
      />
    </div>
  );
};
