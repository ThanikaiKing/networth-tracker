// Asset Growth Stacked Area Chart - Shows how different asset categories have grown over time

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AssetGrowthChartProps } from '@/lib/types';
import { formatCurrency, parseChartDate } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AssetGrowthChart: React.FC<AssetGrowthChartProps> = ({
  data,
  selectedPeriod,
  isLoading,
}) => {
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Data Available</h3>
            <p className="text-sm text-muted-foreground">
              Asset growth data is not available for the selected period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data for asset growth chart
  const labels = data.map(entry => parseChartDate(entry.date));
  const bankAccountsData = data.map(entry => entry.bankAccounts.subtotal);
  const investmentsData = data.map(entry => entry.investments.subtotal);
  const otherAssetsData = data.map(entry => entry.otherAssets.subtotal);

  // Calculate total assets for tooltips
  const getTotalAtIndex = (index: number): number => {
    return bankAccountsData[index] + investmentsData[index] + otherAssetsData[index];
  };

  // Chart colors matching the dark theme
  const colors = {
    bank: { main: 'oklch(0.68 0.18 220)', fill: 'oklch(0.68 0.18 220 / 0.2)' },
    investments: { main: 'oklch(0.72 0.19 165)', fill: 'oklch(0.72 0.19 165 / 0.2)' },
    other: { main: 'oklch(0.7 0.2 280)', fill: 'oklch(0.7 0.2 280 / 0.2)' },
  };

  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bank Accounts',
        data: bankAccountsData,
        backgroundColor: colors.bank.fill,
        borderColor: colors.bank.main,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.bank.main,
        pointBorderColor: 'oklch(0.18 0.02 260)',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Investments',
        data: investmentsData,
        backgroundColor: colors.investments.fill,
        borderColor: colors.investments.main,
        borderWidth: 2,
        fill: '-1',
        tension: 0.4,
        pointBackgroundColor: colors.investments.main,
        pointBorderColor: 'oklch(0.18 0.02 260)',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Other Assets',
        data: otherAssetsData,
        backgroundColor: colors.other.fill,
        borderColor: colors.other.main,
        borderWidth: 2,
        fill: '-1',
        tension: 0.4,
        pointBackgroundColor: colors.other.main,
        pointBorderColor: 'oklch(0.18 0.02 260)',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'oklch(0.16 0.02 260 / 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'oklch(0.4 0.02 260)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            return context[0]?.label || '';
          },
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
          afterBody: (context: TooltipItem<'line'>[]) => {
            if (context.length > 0) {
              const total = getTotalAtIndex(context[0].dataIndex);
              return [`Total Assets: ${formatCurrency(total)}`];
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
          maxTicksLimit: 6,
        },
        grid: {
          display: true,
          color: 'oklch(0.3 0.02 260 / 0.2)',
        },
      },
      y: {
        stacked: true,
        display: true,
        title: {
          display: true,
          text: 'Asset Value (₹)',
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
          callback: function(value: string | number) {
            const num = typeof value === 'number' ? value : parseFloat(value);
            if (num >= 10000000) {
              return `₹${(num / 10000000).toFixed(1)}Cr`;
            } else if (num >= 100000) {
              return `₹${(num / 100000).toFixed(1)}L`;
            } else if (num >= 1000) {
              return `₹${(num / 1000).toFixed(0)}K`;
            }
            return `₹${num.toFixed(0)}`;
          },
        },
        grid: {
          display: true,
          color: 'oklch(0.3 0.02 260 / 0.2)',
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
    elements: {
      point: {
        hoverRadius: 5,
      },
    },
  };

  // Calculate growth statistics
  const bankGrowth = bankAccountsData.length > 1 
    ? bankAccountsData[bankAccountsData.length - 1] - bankAccountsData[0]
    : 0;
  const investmentGrowth = investmentsData.length > 1 
    ? investmentsData[investmentsData.length - 1] - investmentsData[0]
    : 0;
  const assetGrowth = otherAssetsData.length > 1 
    ? otherAssetsData[otherAssetsData.length - 1] - otherAssetsData[0]
    : 0;

  const totalGrowth = bankGrowth + investmentGrowth + assetGrowth;

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-chart-2"></div>
            Asset Growth by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`} stacked growth
          </p>
        </div>

        {/* Growth Summary */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Total Growth</div>
          <div className={`text-xl font-bold tabular-nums mt-1 ${totalGrowth >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {totalGrowth >= 0 ? '+' : ''}{formatCurrency(totalGrowth)}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-72 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Growth Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 glass rounded-xl border border-chart-2/20">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.bank.main }}></div>
            <span className="text-sm font-medium text-chart-2">Bank Accounts</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold tabular-nums ${bankGrowth >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {bankGrowth >= 0 ? '+' : ''}{formatCurrency(bankGrowth)}
            </div>
            <div className="text-xs text-muted-foreground/70 tabular-nums">
              Current: {formatCurrency(bankAccountsData[bankAccountsData.length - 1] || 0)}
            </div>
          </div>
        </div>

        <div className="p-4 glass rounded-xl border border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.investments.main }}></div>
            <span className="text-sm font-medium text-primary">Investments</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold tabular-nums ${investmentGrowth >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {investmentGrowth >= 0 ? '+' : ''}{formatCurrency(investmentGrowth)}
            </div>
            <div className="text-xs text-muted-foreground/70 tabular-nums">
              Current: {formatCurrency(investmentsData[investmentsData.length - 1] || 0)}
            </div>
          </div>
        </div>

        <div className="p-4 glass rounded-xl border border-accent/20">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.other.main }}></div>
            <span className="text-sm font-medium text-accent">Other Assets</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold tabular-nums ${assetGrowth >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {assetGrowth >= 0 ? '+' : ''}{formatCurrency(assetGrowth)}
            </div>
            <div className="text-xs text-muted-foreground/70 tabular-nums">
              Current: {formatCurrency(otherAssetsData[otherAssetsData.length - 1] || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Info Footer */}
      <div className="mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground/60 text-center">
        Stacked areas show cumulative asset composition over time • Hover for detailed breakdowns
      </div>
    </div>
  );
};
