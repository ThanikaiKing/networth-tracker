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

// Set default device pixel ratio for crisp rendering
ChartJS.defaults.devicePixelRatio = 2;

// Investment color configuration - updated for dark theme
const INVESTMENT_COLORS: Record<string, string> = {
  'Equity': 'oklch(0.68 0.18 220)',      // Blue
  'Mutual funds': 'oklch(0.72 0.19 165)', // Emerald  
  'Gold': 'oklch(0.75 0.18 85)',         // Amber
  'EPF': 'oklch(0.7 0.2 280)',           // Purple
  'NPS': 'oklch(0.7 0.15 195)',          // Cyan
  'FD': 'oklch(0.7 0.18 140)',           // Lime
  'BetterInvest': 'oklch(0.7 0.2 35)',   // Orange
  'Walmart shares': 'oklch(0.65 0.22 25)', // Red
  'US Stocks': 'oklch(0.65 0.18 250)',   // Indigo
  'Bhive': 'oklch(0.68 0.15 320)',       // Pink
  'Aston grey': 'oklch(0.5 0.02 260)',   // Gray
  'Unknown': 'oklch(0.5 0.02 260)',      // Gray
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
      backgroundColor: investment.color.replace(')', ' / 0.15)').replace('oklch', 'oklch'),
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: investment.color,
      pointBorderColor: 'oklch(0.997 0.003 80)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: investment.color,
      pointHoverBorderColor: 'oklch(0.25 0.02 260)',
      pointHoverBorderWidth: 2,
      borderWidth: 2,
    }));

    return { labels, datasets };
  }, [filteredData, selectedInvestments, data]);

  if (isLoading) {
    return <SkeletonChart className="h-96" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl glass mb-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
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
            <h3 className="text-sm font-medium text-foreground mb-1">No Investment Data</h3>
            <p className="text-sm text-muted-foreground">
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
    devicePixelRatio: 2,
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
            size: 10, 
            weight: 500 
          },
          color: 'oklch(0.52 0.02 75)',
          padding: 15,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      tooltip: {
        backgroundColor: 'oklch(0.18 0.025 60)',
        titleColor: 'oklch(0.92 0.006 80)',
        bodyColor: 'oklch(0.78 0.01 80)',
        borderColor: 'oklch(0.4 0.02 260)',
        borderWidth: 1,
        cornerRadius: 12,
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
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Month',
          color: 'oklch(0.52 0.02 75)',
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          color: 'oklch(0.52 0.02 75)',
          font: {
            size: 10,
          },
          maxRotation: 45,
        },
        grid: {
          display: true,
          color: 'oklch(0.875 0.013 80)',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Investment Value (₹)',
          color: 'oklch(0.52 0.02 75)',
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          color: 'oklch(0.52 0.02 75)',
          font: {
            size: 10,
          },
          callback: function(value: string | number) {
            const num = typeof value === 'number' ? value : parseFloat(value);
            return formatCurrencyShort(num);
          },
        },
        grid: {
          display: true,
          color: 'oklch(0.875 0.013 80)',
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
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-chart-2 to-primary"></div>
            Investment Growth
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Individual investment performance over time
          </p>
        </div>

        {/* Investment Summary */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Total Investments</div>
          <div className="text-xl font-bold text-chart-2 tabular-nums mt-1">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className={`text-sm font-medium tabular-nums ${
            totalGrowth >= 0 ? 'text-primary' : 'text-destructive'
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
              <div className="text-sm text-muted-foreground mb-2">No investment data to display</div>
              <div className="text-xs text-muted-foreground/60">
                Try adjusting the time period or check if investment data is available
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Investment Insights */}
      {chartData.datasets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 border border-chart-2/20">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="text-sm font-medium text-chart-2">Active Investments</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2 tabular-nums">
              {chartData.datasets.length}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Different investment types
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-sm font-medium text-primary">Period</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {selectedPeriod === 'all' ? 'All Time' : 
               selectedPeriod === '6months' ? '6M' :
               selectedPeriod === '3months' ? '3M' : '1M'}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Tracking period
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-accent/20">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="text-sm font-medium text-accent">Avg Growth</div>
            </div>
            <div className={`text-2xl font-bold mt-2 tabular-nums ${
              totalGrowthPercentage >= 0 ? 'text-primary' : 'text-destructive'
            }`}>
              {totalGrowthPercentage >= 0 ? '+' : ''}{totalGrowthPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Overall performance
            </div>
          </div>
        </div>
      )}

      {/* Chart Footer Note */}
      <div className="mt-6 pt-4 border-t border-border/30 text-xs text-muted-foreground/60 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Click legend items to show/hide investments</span>
          <span className="text-muted-foreground/30">•</span>
          <span>📈 Hover over points for detailed info</span>
          <span className="text-muted-foreground/30">•</span>
          <span>🎯 Track individual performance</span>
        </div>
      </div>
    </div>
  );
};
