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
import LiquidEther from '@/components/LiquidEther';

const AVAILABLE_PERIODS: TimePeriod[] = ['all', '6months', '3months', '1month'];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [backgroundEnabled, setBackgroundEnabled] = useState<boolean>(true);
  const { data, loading, error, refetch } = useNetWorthData(selectedPeriod);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const toggleBackground = () => {
    setBackgroundEnabled(!backgroundEnabled);
  };

  return (
    <div className={`min-h-screen relative ${!backgroundEnabled ? 'bg-gray-50' : ''}`}>
      {/* LiquidEther Background */}
      {backgroundEnabled && (
        <div 
          className="fixed inset-0 w-full h-full"
          style={{ zIndex: -1 }}
        >
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10">
        <Header backgroundEnabled={backgroundEnabled} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {error ? (
          <ErrorDisplay 
            error={error}
            onRetry={refetch}
            className="max-w-2xl mx-auto"
          />
        ) : (
          <>
            {/* Dashboard Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 rounded-lg p-6 shadow-sm border ${
              backgroundEnabled 
                ? 'bg-white/90 backdrop-blur-sm border-white/20' 
                : 'bg-white border-gray-200'
            }`}>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Financial Overview
                </h1>
                <p className="text-gray-600">
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
            <MetricsCards
              currentNetWorth={data?.summary.currentNetWorth || 0}
              totalGrowth={data?.summary.totalGrowth || 0}
              growthRate={data?.summary.growthRate || 0}
              isLoading={loading}
            />

            {/* Main Net Worth Chart Section */}
            <div className="mb-8">
              <NetWorthChart
                data={data?.entries || []}
                selectedPeriod={selectedPeriod}
                isLoading={loading}
              />
            </div>

            {/* Asset Analysis Section */}
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

            {/* Investment Portfolio Section */}
            <div className="mb-8">
              <InvestmentDashboard
                data={data?.entries || []}
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                isLoading={loading}
              />
            </div>

            {/* Debt Analysis Section */}
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

            {/* Additional content area */}
            {children && (
              <div className="space-y-6">
                {children}
              </div>
            )}

            {/* Data Status Footer */}
            {data && !loading && (
              <div className={`mt-8 p-4 rounded-lg shadow-sm border ${
                backgroundEnabled 
                  ? 'bg-white/90 backdrop-blur-sm border-white/20' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Data refreshed on page load</span>
                    </div>
                    <div>
                      Period: {data.summary.period}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
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

      {/* Dev Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleBackground}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
            transition-all duration-200 shadow-lg hover:shadow-xl
            ${backgroundEnabled 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
            }
          `}
          title="Toggle liquid background effect"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {backgroundEnabled ? (
              // Eye open icon
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            ) : (
              // Eye closed icon
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" 
              />
            )}
          </svg>
          {backgroundEnabled ? 'Liquid ON' : 'Liquid OFF'}
        </button>
      </div>
    </div>
  );
};
