// Investment Dashboard - Main container component for the investments section

'use client';

import React, { useMemo } from 'react';
import { InvestmentDashboardProps } from '@/lib/types';
import { InvestmentGrowthChart } from '@/components/Charts/InvestmentGrowthChart';
import { InvestmentAllocationChart } from '@/components/Charts/InvestmentAllocationChart';
import { ResponsivePeriodSelector } from '@/components/Dashboard/PeriodSelector';
import { calculateInvestmentAnalytics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

export const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  isLoading,
}) => {
  // Calculate investment analytics
  const analytics = useMemo(() => {
    if (!data || data.length === 0) return null;
    return calculateInvestmentAnalytics(data);
  }, [data]);

  const totalInvestmentValue = analytics?.totalInvestmentValue || 0;
  const averageGrowthRate = analytics?.averageGrowthRate || 0;
  const diversificationScore = analytics?.diversificationScore || 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted/30 rounded-lg w-1/3 mb-2"></div>
          <div className="h-4 bg-muted/20 rounded-lg w-1/2"></div>
        </div>

        {/* Loading Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="glass-card rounded-2xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted/30 rounded-lg w-3/4 mb-3"></div>
                <div className="h-8 bg-muted/20 rounded-lg w-1/2 mb-2"></div>
                <div className="h-3 bg-muted/10 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 h-96">
            <div className="animate-pulse h-full bg-muted/10 rounded-xl"></div>
          </div>
          <div className="glass-card rounded-2xl p-6 h-96">
            <div className="animate-pulse h-full bg-muted/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl glass mb-6">
          <svg
            className="h-10 w-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Investment Data Available</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Investment tracking data is not available. Please ensure your Google Sheets contains investment information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Investment Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-chart-2 to-accent"></div>
            <span className="flex items-center gap-2">
              <span className="text-2xl">💼</span>
              Investment Portfolio
            </span>
          </h2>
          <p className="text-muted-foreground ml-4">
            Comprehensive analysis of your investment performance and allocation
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 md:mt-0">
          <ResponsivePeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            availablePeriods={['all', '6months', '3months', '1month']}
          />
        </div>
      </div>

      {/* Investment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Investment Value */}
        <div className="glass-card rounded-2xl p-6 hover-lift relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-chart-2 text-sm font-medium">Total Investment Value</p>
              <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
                {formatCurrency(totalInvestmentValue)}
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Across all investment types
              </p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>

        {/* Average Growth Rate */}
        <div className={`glass-card rounded-2xl p-6 hover-lift relative overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${averageGrowthRate >= 0 ? 'from-primary/10' : 'from-destructive/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${averageGrowthRate >= 0 ? 'text-primary' : 'text-destructive'}`}>
                Average Growth Rate
              </p>
              <p className={`text-2xl font-bold mt-1 tabular-nums ${averageGrowthRate >= 0 ? 'text-foreground' : 'text-foreground'}`}>
                {averageGrowthRate >= 0 ? '+' : ''}{averageGrowthRate.toFixed(1)}%
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Portfolio performance
              </p>
            </div>
            <div className="text-4xl opacity-80">
              {averageGrowthRate >= 0 ? '📈' : '📉'}
            </div>
          </div>
        </div>

        {/* Diversification Score */}
        <div className="glass-card rounded-2xl p-6 hover-lift relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-accent text-sm font-medium">Diversification Score</p>
              <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
                {diversificationScore.toFixed(0)}/100
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                {diversificationScore >= 70 ? 'Well diversified' : 
                 diversificationScore >= 50 ? 'Moderately diversified' : 
                 'Consider diversifying'}
              </p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>
      </div>


      {/* Main Investment Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment Growth Chart */}
        <div className="lg:col-span-2">
          <InvestmentGrowthChart
            data={data}
            selectedPeriod={selectedPeriod}
            isLoading={isLoading}
          />
        </div>

        {/* Investment Allocation Chart */}
        <div className="lg:col-span-2">
          <InvestmentAllocationChart
            data={data}
            isLoading={isLoading}
          />
        </div>
      </div>


      {/* Data Freshness Indicator */}
      <div className="flex items-center justify-center text-xs text-muted-foreground/60 py-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data as of {data[data.length - 1]?.date}</span>
          <span className="text-muted-foreground/40">•</span>
          <span>Updated from Google Sheets</span>
        </div>
      </div>
    </div>
  );
};
