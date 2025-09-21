// Investment Growth Chart - Multi-line chart showing each investment type's performance over time

'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InvestmentGrowthChartProps, InvestmentChartData, TimePeriod, NetWorthEntry } from '@/lib/types';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Investment color configuration
const INVESTMENT_COLORS: Record<string, string> = {
  'Equity': '#3B82F6',      // Blue
  'Mutual funds': '#10B981', // Green  
  'Gold': '#F59E0B',        // Amber
  'EPF': '#8B5CF6',         // Purple
  'NPS': '#06B6D4',         // Cyan
  'FD': '#84CC16',          // Lime
  'BetterInvest': '#F97316', // Orange
  'Walmart shares': '#EF4444', // Red
  // Fallback colors for unknown investments
  'Unknown': '#6B7280',     // Gray
};

// Get color for investment, with fallback
const getInvestmentColor = (investmentName: string): string => {
  return INVESTMENT_COLORS[investmentName] || INVESTMENT_COLORS['Unknown'];
};

// Filter data based on selected period
const filterDataByPeriod = (data: NetWorthEntry[], period: TimePeriod) => {
  if (period === 'all' || data.length === 0) return data;
  
  const periodMap = {
    '1month': 1,
    '3months': 3,
    '6months': 6,
  };
  
  const monthsToShow = periodMap[period];
  return data.slice(-monthsToShow);
};

export const InvestmentGrowthChart: React.FC<InvestmentGrowthChartProps> = ({
  data,
  selectedPeriod,
  selectedInvestments = [],
  isLoading,
}) => {
  // Filter data by selected period (move before early returns)
  const filteredData = filterDataByPeriod(data || [], selectedPeriod);

  // Process investment data for chart (move before early returns)
  const chartData = useMemo(() => {
    if (!data || data.length === 0 || !filteredData.length) return { labels: [], datasets: [] };
    if (!filteredData.length) return { labels: [], datasets: [] };

    // Extract dates for x-axis
    const labels = filteredData.map(entry => entry.date);

    // Extract investment accounts from the data
    const investmentAccounts: InvestmentChartData[] = [];
    
    // Collect all unique investment names
    const allInvestmentNames = new Set<string>();
    filteredData.forEach(entry => {
      entry.investments.accounts.forEach((account: { name: string; values: number[] }) => {
        allInvestmentNames.add(account.name);
      });
    });

    // Create chart data for each investment
    Array.from(allInvestmentNames).forEach(investmentName => {
      // Skip if selectedInvestments is provided and this investment is not selected
      if (selectedInvestments.length > 0 && !selectedInvestments.includes(investmentName)) {
        return;
      }

      const investmentData: number[] = [];
      
      filteredData.forEach(entry => {
        const account = entry.investments.accounts.find((acc: { name: string; values: number[] }) => acc.name === investmentName);
        // Use the latest value for each month, or 0 if not found
        const value = account ? (account.values[account.values.length - 1] || 0) : 0;
        investmentData.push(value);
      });

      // Only add investments that have some non-zero values
      if (investmentData.some(value => value > 0)) {
        investmentAccounts.push({
          name: investmentName,
          data: investmentData.map((value, index) => ({
            x: labels[index],
            y: value
          })),
          color: getInvestmentColor(investmentName),
          category: 'equity' // Default category, can be enhanced later
        });
      }
    });

    // Create Chart.js datasets
    const datasets = investmentAccounts.map(investment => ({
      label: investment.name,
      data: investment.data.map(point => point.y),
      borderColor: investment.color,
      backgroundColor: investment.color + '20', // 20% opacity
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: investment.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: investment.color,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
      borderWidth: 2.5,
    }));

    return { labels, datasets };
  }, [filteredData, selectedInvestments, data]);

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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Investment Data</h3>
            <p className="text-sm text-gray-500">
              Investment growth data is not available.
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
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: { 
            size: 12, 
            weight: 500 
          },
          color: 'rgb(107, 114, 128)',
          padding: 20,
          boxWidth: 8,
          boxHeight: 8,
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
          title: (context: TooltipItem<'line'>[]) => {
            return `Month: ${context[0].label}`;
          },
          label: (context: TooltipItem<'line'>) => {
            const value = context.parsed.y;
            const datasetIndex = context.datasetIndex;
            
            // Calculate month-over-month growth
            let growthText = '';
            if (context.dataIndex > 0) {
              const previousValue = chartData.datasets[datasetIndex].data[context.dataIndex - 1];
              if (previousValue > 0) {
                const growth = ((value - previousValue) / previousValue) * 100;
                const growthSign = growth > 0 ? '+' : '';
                growthText = ` (${growthSign}${growth.toFixed(1)}%)`;
              }
            }
            
            return `${context.dataset.label}: ${formatCurrency(value)}${growthText}`;
          },
          afterLabel: () => {
            return 'Click legend to toggle visibility';
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Month',
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
            weight: 500,
          },
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Investment Value (₹)',
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
            weight: 500,
          },
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            const num = typeof value === 'number' ? value : parseFloat(value);
            return formatCurrencyShort(num);
          },
        },
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.8)',
        },
        beginAtZero: false,
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Calculate total investment value and growth
  const totalCurrentValue = chartData.datasets.reduce((total, dataset) => {
    const lastValue = dataset.data[dataset.data.length - 1];
    return total + (typeof lastValue === 'number' ? lastValue : 0);
  }, 0);

  const totalInitialValue = chartData.datasets.reduce((total, dataset) => {
    const firstValue = dataset.data[0];
    return total + (typeof firstValue === 'number' ? firstValue : 0);
  }, 0);

  const totalGrowth = totalCurrentValue - totalInitialValue;
  const totalGrowthPercentage = totalInitialValue > 0 
    ? ((totalGrowth / totalInitialValue) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Investment Growth</h2>
          <p className="text-sm text-gray-600">
            Individual investment performance over time
          </p>
        </div>

        {/* Investment Summary */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Investments</div>
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className={`text-sm font-medium ${
            totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalGrowth >= 0 ? '+' : ''}{formatCurrency(totalGrowth)} 
            ({totalGrowthPercentage >= 0 ? '+' : ''}{totalGrowthPercentage.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 mb-6">
        {chartData.datasets.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">No investment data to display</div>
              <div className="text-xs text-gray-400">
                Try adjusting the time period or check if investment data is available
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Investment Insights */}
      {chartData.datasets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="text-sm font-medium text-blue-900">Active Investments</div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              {chartData.datasets.length}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Different investment types
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div className="text-sm font-medium text-green-900">Period</div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {selectedPeriod === 'all' ? 'All Time' : 
               selectedPeriod === '6months' ? '6M' :
               selectedPeriod === '3months' ? '3M' : '1M'}
            </div>
            <div className="text-xs text-green-700 mt-1">
              Tracking period
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="text-sm font-medium text-purple-900">Avg Growth</div>
            </div>
            <div className={`text-2xl font-bold mt-2 ${
              totalGrowthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalGrowthPercentage >= 0 ? '+' : ''}{totalGrowthPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-purple-700 mt-1">
              Overall performance
            </div>
          </div>
        </div>
      )}

      {/* Chart Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Click legend items to show/hide investments</span>
          <span>•</span>
          <span>📈 Hover over points for detailed info</span>
          <span>•</span>
          <span>🎯 Track individual performance</span>
        </div>
      </div>
    </div>
  );
};
