// Investment Allocation Chart - Pie chart showing current portfolio distribution across investment types

'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { InvestmentAllocationChartProps } from '@/lib/types';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Investment color configuration (same as InvestmentGrowthChart)
const INVESTMENT_COLORS: Record<string, string> = {
  'Equity': '#3B82F6',      // Blue
  'Mutual funds': '#10B981', // Green  
  'Gold': '#F59E0B',        // Amber
  'EPF': '#8B5CF6',         // Purple
  'NPS': '#06B6D4',         // Cyan
  'FD': '#84CC16',          // Lime
  'BetterInvest': '#F97316', // Orange
  'Walmart shares': '#EF4444', // Red
};

// Asset class colors for category-based view
const ASSET_CLASS_COLORS: Record<string, string> = {
  'equity': '#3B82F6',      // Blue
  'debt': '#10B981',        // Green
  'hybrid': '#F59E0B',      // Amber
  'alternative': '#8B5CF6', // Purple
};

// Get color for investment
const getInvestmentColor = (investmentName: string): string => {
  return INVESTMENT_COLORS[investmentName] || '#6B7280';
};

// Categorize investments into asset classes
const categorizeInvestment = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('equity') || lowerName.includes('shares') || lowerName.includes('stock')) {
    return 'Equity';
  }
  if (lowerName.includes('fd') || lowerName.includes('epf') || lowerName.includes('nps') || lowerName.includes('fixed')) {
    return 'Debt';
  }
  if (lowerName.includes('gold') || lowerName.includes('real estate') || lowerName.includes('land')) {
    return 'Alternative';
  }
  if (lowerName.includes('mutual') || lowerName.includes('fund')) {
    return 'Hybrid';
  }
  return 'Other';
};

export const InvestmentAllocationChart: React.FC<InvestmentAllocationChartProps> = ({
  data,
  isLoading,
}) => {
  // Process allocation data (move before early returns)
  const { chartData, investmentBreakdown, assetClassBreakdown, totalInvestments } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: { labels: [], datasets: [] },
        investmentBreakdown: [],
        assetClassBreakdown: [],
        totalInvestments: 0,
      };
    }
    const latestEntry = data[data.length - 1];
    const investments = latestEntry.investments.accounts;
    const total = latestEntry.investments.subtotal;

    // Individual investment breakdown
    const investmentData = investments
      .map(investment => {
        // Use the latest value for each investment
        const currentValue = investment.values[investment.values.length - 1] || 0;
        return {
          name: investment.name,
          value: currentValue,
          percentage: total > 0 ? (currentValue / total) * 100 : 0,
          color: getInvestmentColor(investment.name),
          category: categorizeInvestment(investment.name)
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Asset class breakdown
    const assetClasses = new Map();
    investmentData.forEach(item => {
      const category = item.category;
      if (assetClasses.has(category)) {
        assetClasses.set(category, assetClasses.get(category) + item.value);
      } else {
        assetClasses.set(category, item.value);
      }
    });

    const assetClassData = Array.from(assetClasses.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: ASSET_CLASS_COLORS[name.toLowerCase()] || '#6B7280'
    }));

    // Create chart data
    const chartLabels = investmentData.map(item => item.name);
    const chartValues = investmentData.map(item => item.value);
    const chartColors = investmentData.map(item => item.color);
    const chartBorderColors = chartColors.map(color => color);

    return {
      chartData: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: chartColors,
            borderColor: chartBorderColors,
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      investmentBreakdown: investmentData,
      assetClassBreakdown: assetClassData,
      totalInvestments: total,
    };
  }, [data]);

  if (isLoading) {
    return <SkeletonChart className="h-96" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Investment Data</h3>
            <p className="text-sm text-gray-500">
              Investment allocation data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: { 
            size: 11, 
            weight: 500 
          },
          color: 'rgb(107, 114, 128)',
          padding: 15,
          boxWidth: 10,
          boxHeight: 10,
          generateLabels: (chart: ChartJS) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return data.labels.map((label, index) => {
                const value = data.datasets[0].data[index] as number;
                const percentage = totalInvestments > 0 ? ((value / totalInvestments) * 100) : 0;
                return {
                  text: `${label} (${percentage.toFixed(1)}%)`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])?.[index] || '#6B7280',
                  strokeStyle: (data.datasets[0].borderColor as string[])?.[index] || '#6B7280',
                  lineWidth: 2,
                  hidden: false,
                  index,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const percentage = totalInvestments > 0 ? ((value / totalInvestments) * 100) : 0;
            return `${context.label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;
          },
          afterLabel: (context: TooltipItem<'doughnut'>) => {
            const investmentName = context.label;
            const investment = investmentBreakdown.find(inv => inv.name === investmentName);
            return investment ? `Category: ${investment.category}` : '';
          },
        },
      },
    },
    cutout: '45%', // Makes it a doughnut chart
    animation: {
      animateRotate: true,
      duration: 750,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Investment Allocation</h2>
          <p className="text-sm text-gray-600">
            Portfolio distribution by investment type
          </p>
        </div>

        {/* Total Investment Value */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Invested</div>
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(totalInvestments)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Container */}
        <div className="relative h-80">
          <Doughnut data={chartData} options={chartOptions} />
          {/* Center label with total value */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrencyShort(totalInvestments)}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Breakdown List */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-3">Investment Breakdown:</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {investmentBreakdown.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: investment.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {investment.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {investment.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrencyShort(investment.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {investment.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Class Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-900 mb-3">Asset Class Distribution</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {assetClassBreakdown.map((assetClass, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-blue-800 font-medium">{assetClass.name}</div>
                  <div className="text-sm font-bold text-blue-900">
                    {assetClass.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-700">
                    {formatCurrencyShort(assetClass.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Diversification Insights */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-green-900 mb-2">Portfolio Insights</div>
            <div className="space-y-1 text-sm text-green-800">
              <div>• {investmentBreakdown.length} different investment types</div>
              <div>• {assetClassBreakdown.length} asset classes represented</div>
              {investmentBreakdown.length > 0 && (
                <div>• Largest allocation: {investmentBreakdown[0].name} ({investmentBreakdown[0].percentage.toFixed(1)}%)</div>
              )}
              {investmentBreakdown.length >= 5 ? (
                <div>• Well diversified portfolio ✓</div>
              ) : (
                <div>• Consider diversifying across more investment types</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Click segments to highlight details</span>
          <span>•</span>
          <span>📊 Based on latest month data</span>
          <span>•</span>
          <span>🎯 Review allocation quarterly</span>
        </div>
      </div>
    </div>
  );
};
