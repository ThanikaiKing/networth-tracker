// Investment Dashboard - Main container component for the investments section

'use client';

import React, { useMemo } from 'react';
import { InvestmentDashboardProps } from '@/lib/types';
import { InvestmentGrowthChart } from '@/components/Charts/InvestmentGrowthChart';
import { InvestmentAllocationChart } from '@/components/Charts/InvestmentAllocationChart';
import { InvestmentPerformanceCards } from '@/components/Charts/InvestmentPerformanceCards';
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector';
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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Loading Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
            <div className="animate-pulse h-full"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
            <div className="animate-pulse h-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Investment Data Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            💼 Investment Portfolio
          </h2>
          <p className="text-gray-600">
            Comprehensive analysis of your investment performance and allocation
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 md:mt-0">
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            availablePeriods={['all', '6months', '3months', '1month']}
          />
        </div>
      </div>

      {/* Investment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Investment Value */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total Investment Value</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(totalInvestmentValue)}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Across all investment types
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        {/* Average Growth Rate */}
        <div className={`rounded-lg p-6 border ${
          averageGrowthRate >= 0 
            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                averageGrowthRate >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                Average Growth Rate
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                averageGrowthRate >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {averageGrowthRate >= 0 ? '+' : ''}{averageGrowthRate.toFixed(1)}%
              </p>
              <p className={`text-xs mt-1 ${
                averageGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Portfolio performance
              </p>
            </div>
            <div className="text-3xl">
              {averageGrowthRate >= 0 ? '📈' : '📉'}
            </div>
          </div>
        </div>

        {/* Diversification Score */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Diversification Score</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {diversificationScore.toFixed(0)}/100
              </p>
              <p className="text-purple-600 text-xs mt-1">
                {diversificationScore >= 70 ? 'Well diversified' : 
                 diversificationScore >= 50 ? 'Moderately diversified' : 
                 'Consider diversifying'}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Investment Performance Cards */}
      {analytics && (
        <InvestmentPerformanceCards 
          analytics={analytics}
          isLoading={isLoading}
        />
      )}

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

      {/* Investment Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-gray-900">Investment Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Health */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Portfolio Health</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div>• {data[0]?.investments.accounts.length || 0} active investments</div>
              <div>• Average growth: {averageGrowthRate.toFixed(1)}%</div>
              <div>• Diversification: {diversificationScore.toFixed(0)}/100</div>
              {analytics?.overallRiskScore && (
                <div>• Risk level: {analytics.overallRiskScore.toFixed(0)}/100</div>
              )}
            </div>
          </div>

          {/* Top Performance */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Best Performer</h4>
            <div className="space-y-2 text-sm text-green-800">
              {analytics && (
                <>
                  <div>• {analytics.bestPerformer.name}</div>
                  <div>• Growth: +{analytics.bestPerformer.growthRate.toFixed(1)}%</div>
                  <div>• Value: {formatCurrency(analytics.bestPerformer.currentValue)}</div>
                  <div>• Trend: {analytics.bestPerformer.trend === 'up' ? '📈 Rising' : 
                                 analytics.bestPerformer.trend === 'down' ? '📉 Declining' : 
                                 '➡️ Stable'}</div>
                </>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Recommendations</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              {diversificationScore < 60 && (
                <div>• Consider diversifying portfolio</div>
              )}
              {analytics?.overallRiskScore && analytics.overallRiskScore > 70 && (
                <div>• High risk - consider safer options</div>
              )}
              {averageGrowthRate > 15 && (
                <div>• Excellent performance! 🎉</div>
              )}
              <div>• Review monthly, rebalance quarterly</div>
              <div>• Track expense ratios and fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Strategy Guide */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Investment Strategy Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm text-indigo-800">
                <div className="font-medium">For Better Growth:</div>
                <div>• Increase equity allocation for higher returns</div>
                <div>• Consider SIP for rupee cost averaging</div>
                <div>• Review and eliminate underperforming assets</div>
              </div>
              <div className="space-y-2 text-sm text-indigo-800">
                <div className="font-medium">For Risk Management:</div>
                <div>• Maintain emergency fund (6-12 months expenses)</div>
                <div>• Balance equity with debt instruments</div>
                <div>• Avoid over-concentration in single asset</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center justify-center text-xs text-gray-500 py-4">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Data as of {data[data.length - 1]?.date} • Updated from Google Sheets
      </div>
    </div>
  );
};
