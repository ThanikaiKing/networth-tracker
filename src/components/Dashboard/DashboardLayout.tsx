// Main dashboard layout component

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none"></div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none"></div>
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none"></div>
      
      {/* Floating accent orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="fixed top-2/3 left-1/3 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      {/* Content */}
      <div className="relative z-10">
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
              {/* Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Financial Overview
                  </h1>
                  <p className="text-muted-foreground">
                    Track your net worth growth and financial progress over time.
                  </p>
                </div>
                
                {/* Period Selector */}
                <div className="mt-4 sm:mt-0">
                  <ResponsivePeriodSelector
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={handlePeriodChange}
                    availablePeriods={AVAILABLE_PERIODS}
                  />
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <MetricsCards
                  currentNetWorth={data?.summary.currentNetWorth || 0}
                  totalGrowth={data?.summary.totalGrowth || 0}
                  growthRate={data?.summary.growthRate || 0}
                  isLoading={loading}
                />
              </div>

              {/* Main Net Worth Chart Section */}
              <div className="mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                <NetWorthChart
                  data={data?.entries || []}
                  selectedPeriod={selectedPeriod}
                  isLoading={loading}
                />
              </div>

              {/* Asset Analysis Section */}
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <ChartSection 
                  title="Asset Analysis"
                  description="Breakdown and growth analysis of your asset portfolio"
                  className="mb-8"
                >
                  <ChartGrid columns={2}>
                    <AssetAllocationChart
                      data={data?.entries || []}
                      isLoading={loading}
                    />
                    <AssetGrowthChart
                      data={data?.entries || []}
                      selectedPeriod={selectedPeriod}
                      isLoading={loading}
                    />
                  </ChartGrid>
                </ChartSection>
              </div>

              {/* Investment Portfolio Section */}
              <div className="mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <InvestmentDashboard
                  data={data?.entries || []}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  isLoading={loading}
                />
              </div>

              {/* Debt Analysis Section */}
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
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
                    <DebtCompositionChart
                      data={data?.entries || []}
                      isLoading={loading}
                    />
                  </ChartGrid>
                </ChartSection>
              </div>

              {/* Net Worth Projection Section */}
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <ProjectionSection
                  data={data?.entries || []}
                  isLoading={loading}
                />
              </div>

              {/* Additional content area */}
              {children && (
                <div className="space-y-6">
                  {children}
                </div>
              )}

              {/* Data Status Footer */}
              {data && !loading && (
                <div className="mt-8 p-4 glass-card rounded-xl opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-50"></div>
                        </div>
                        <span>Data refreshed on page load</span>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-muted-foreground/50">•</span>
                        <span className="ml-2">Period: {data.summary.period}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:bg-white/5 transition-all duration-300 group"
                    >
                      <svg
                        className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
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
    </div>
  );
};
