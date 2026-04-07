// Debt Tracking Chart - Shows debt reduction progress with dual-axis for amount and ratio

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
import { DebtTrackingChartProps } from '@/lib/types';
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

export const DebtTrackingChart: React.FC<DebtTrackingChartProps> = ({
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Debt Data</h3>
            <p className="text-sm text-muted-foreground">
              Debt tracking data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Extract debt data from entries
  const labels = data.map(entry => parseChartDate(entry.date));
  const debtValues = data.map(entry => entry.totalDebt);
  const debtToAssetRatios = data.map(entry => 
    entry.totalAssets > 0 ? (entry.totalDebt / entry.totalAssets) * 100 : 0
  );

  // Check if there's any debt data
  const hasDebtData = debtValues.some(value => value > 0);

  // Simple placeholder calculations for the legacy component
  const currentDebt = debtValues[debtValues.length - 1] || 0;
  const initialDebt = debtValues[0] || 0;
  const monthlyReduction = debtValues.length > 1 ? (initialDebt - currentDebt) / (debtValues.length - 1) : 0;
  const currentRatio = debtToAssetRatios[debtToAssetRatios.length - 1] || 0;
  
  const debtAnalytics = {
    totalDebt: currentDebt,
    debtToAssetRatio: currentRatio,
    monthlyReduction: monthlyReduction,
    projectedPayoffMonths: monthlyReduction > 0 ? Math.ceil(currentDebt / monthlyReduction) : null
  };

  const riskLevel = {
    level: currentRatio > 50 ? 'high' : currentRatio > 30 ? 'medium' : 'low',
    color: currentRatio > 50 ? 'oklch(0.65 0.22 25)' : currentRatio > 30 ? 'oklch(0.75 0.18 85)' : 'oklch(0.72 0.19 165)',
    textClass: currentRatio > 50 ? 'text-destructive' : currentRatio > 30 ? 'text-chart-4' : 'text-primary',
    bgClass: currentRatio > 50 ? 'bg-destructive/10 border-destructive/30' : currentRatio > 30 ? 'bg-chart-4/10 border-chart-4/30' : 'bg-primary/10 border-primary/30',
    description: currentRatio > 50 ? 'High debt ratio requires attention' : 
                currentRatio > 30 ? 'Moderate debt ratio - manageable' : 'Low debt ratio - healthy'
  };

  if (!hasDebtData) {
    return (
      <div className="glass-card rounded-2xl p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Debt Free! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              You currently have no outstanding debt.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chart colors for dark theme
  const colors = {
    debt: { main: 'oklch(0.65 0.22 25)', fill: 'oklch(0.65 0.22 25 / 0.15)' },
    ratio: { main: 'oklch(0.75 0.18 85)', fill: 'oklch(0.75 0.18 85 / 0.1)' },
  };

  // Chart configuration with dual-axis
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Debt',
        data: debtValues,
        borderColor: colors.debt.main,
        backgroundColor: colors.debt.fill,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.debt.main,
        pointBorderColor: 'oklch(0.997 0.003 80)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Debt-to-Asset Ratio',
        data: debtToAssetRatios,
        borderColor: colors.ratio.main,
        backgroundColor: colors.ratio.fill,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: colors.ratio.main,
        pointBorderColor: 'oklch(0.997 0.003 80)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
        borderDash: [5, 5],
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
          color: 'oklch(0.52 0.02 75)',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
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
            return context[0]?.label || '';
          },
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('Ratio')) {
              return `${label}: ${value.toFixed(2)}%`;
            } else {
              return `${label}: ${formatCurrency(value)}`;
            }
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
          maxTicksLimit: 6,
        },
        grid: {
          display: true,
          color: 'oklch(0.875 0.013 80)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Debt Amount (₹)',
          color: colors.debt.main,
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          color: colors.debt.main,
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
          display: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Debt Ratio (%)',
          color: colors.ratio.main,
          font: {
            size: 11,
            weight: 500,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          color: colors.ratio.main,
          font: {
            size: 10,
          },
          callback: function(value: string | number) {
            return `${value}%`;
          },
        },
        grid: {
          display: true,
          color: 'oklch(0.875 0.013 80)',
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
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-destructive to-chart-4"></div>
            Debt Tracking
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Debt reduction progress over {selectedPeriod === 'all' ? 'all time' : `last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`}
          </p>
        </div>

        {/* Risk Level Indicator */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Risk Level</div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mt-1 border ${riskLevel.bgClass} ${riskLevel.textClass}`}>
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: riskLevel.color }}></div>
            {riskLevel.level.toUpperCase()}
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1">{riskLevel.description}</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-72 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Debt Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Current Debt */}
        <div className="p-4 glass rounded-xl border border-destructive/20">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-destructive">Current Debt</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(debtAnalytics.totalDebt)}
          </div>
        </div>

        {/* Debt-to-Asset Ratio */}
        <div className="p-4 glass rounded-xl border border-chart-4/20">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium text-chart-4">D/A Ratio</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {debtAnalytics.debtToAssetRatio.toFixed(1)}%
          </div>
        </div>

        {/* Monthly Reduction */}
        <div className="p-4 glass rounded-xl border border-primary/20">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium text-primary">Monthly Reduction</span>
          </div>
          <div className={`text-lg font-bold tabular-nums ${debtAnalytics.monthlyReduction >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {debtAnalytics.monthlyReduction >= 0 ? '+' : ''}{formatCurrency(debtAnalytics.monthlyReduction)}
          </div>
        </div>

        {/* Payoff Timeline */}
        <div className="p-4 glass rounded-xl border border-chart-2/20">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-chart-2">Payoff Timeline</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {debtAnalytics.projectedPayoffMonths 
              ? `${debtAnalytics.projectedPayoffMonths} mo`
              : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Progress Insight */}
      <div className="mt-4 p-4 glass rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-muted/30">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Progress Insight</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {debtAnalytics.monthlyReduction > 0 
                ? `Great progress! You're reducing debt by ${formatCurrency(debtAnalytics.monthlyReduction)} per month on average.`
                : debtAnalytics.monthlyReduction < 0
                ? `Debt has increased by ${formatCurrency(Math.abs(debtAnalytics.monthlyReduction))} per month on average. Consider focusing on debt reduction.`
                : 'Debt levels have remained stable. Consider creating a debt reduction plan.'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
