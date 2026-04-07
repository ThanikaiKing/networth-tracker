'use client';

import React, { useState } from 'react';
import { DashboardLayoutProps, TimePeriod } from '@/lib/types';
import { useNetWorthData } from '@/hooks/useNetWorthData';
import { Header } from '@/components/common/Header';
import { ErrorDisplay } from '@/components/common/ErrorBoundary';
import { MetricsCards } from './MetricsCards';
import { NetWorthChart } from './NetWorthChart';
import { ResponsivePeriodSelector } from './PeriodSelector';
import { ChartGrid, ChartSection } from './ChartGrid';
import { AssetAllocationChart } from '@/components/Charts/AssetAllocationChart';
import { AssetGrowthChart } from '@/components/Charts/AssetGrowthChart';
import { DebtTrackingChart } from '@/components/Charts/DebtTrackingChart';
import { DebtCompositionChart } from '@/components/Charts/DebtCompositionChart';
import { InvestmentDashboard } from './InvestmentDashboard';
import { ProjectionSection } from './ProjectionSection';

const AVAILABLE_PERIODS: TimePeriod[] = ['all', '6months', '3months', '1month'];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const { data, loading, error, refetch } = useNetWorthData(selectedPeriod);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-2xl mx-auto"
          />
        ) : (
          <>
            {/* Page controls bar */}
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
            >
              <div>
                <h2
                  className="font-display text-3xl font-semibold text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Financial Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your net worth growth and financial progress over time.
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <ResponsivePeriodSelector
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  availablePeriods={AVAILABLE_PERIODS}
                />
              </div>
            </div>

            {/* Metrics */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '0.13s', animationFillMode: 'forwards' }}
            >
              <MetricsCards
                currentNetWorth={data?.summary.currentNetWorth || 0}
                totalGrowth={data?.summary.totalGrowth || 0}
                growthRate={data?.summary.growthRate || 0}
                isLoading={loading}
              />
            </div>

            {/* Net Worth Trend */}
            <div
              className="mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.21s', animationFillMode: 'forwards' }}
            >
              <NetWorthChart
                data={data?.entries || []}
                selectedPeriod={selectedPeriod}
                isLoading={loading}
              />
            </div>

            {/* Asset Analysis */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '0.29s', animationFillMode: 'forwards' }}
            >
              <ChartSection
                title="Asset Analysis"
                description="Breakdown and growth analysis of your asset portfolio"
                className="mb-8"
              >
                <ChartGrid columns={2}>
                  <AssetAllocationChart data={data?.entries || []} isLoading={loading} />
                  <AssetGrowthChart
                    data={data?.entries || []}
                    selectedPeriod={selectedPeriod}
                    isLoading={loading}
                  />
                </ChartGrid>
              </ChartSection>
            </div>

            {/* Investment Portfolio */}
            <div
              className="mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.37s', animationFillMode: 'forwards' }}
            >
              <InvestmentDashboard
                data={data?.entries || []}
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                isLoading={loading}
              />
            </div>

            {/* Debt Analysis */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
            >
              <ChartSection
                title="Debt Analysis"
                description="Track your debt reduction progress and composition"
                className="mb-8"
              >
                <ChartGrid columns={2}>
                  <DebtTrackingChart
                    data={data?.entries || []}
                    selectedPeriod={selectedPeriod}
                    isLoading={loading}
                  />
                  <DebtCompositionChart data={data?.entries || []} isLoading={loading} />
                </ChartGrid>
              </ChartSection>
            </div>

            {/* Projections */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '0.53s', animationFillMode: 'forwards' }}
            >
              <ProjectionSection data={data?.entries || []} isLoading={loading} />
            </div>

            {children && <div className="space-y-6">{children}</div>}

            {/* Footer status */}
            {data && !loading && (
              <div
                className="mt-8 pt-4 border-t border-border opacity-0 animate-fade-up"
                style={{ animationDelay: '0.61s', animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-pulse" />
                      <span>Refreshed on load</span>
                    </div>
                    <span className="hidden sm:inline text-muted-foreground/40">·</span>
                    <span className="hidden sm:inline">Period: {data.summary.period}</span>
                  </div>

                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded glass hover:bg-muted transition-all duration-200 text-muted-foreground hover:text-foreground group"
                  >
                    <svg
                      className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
