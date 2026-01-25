// Debt Composition Chart - Shows different types of debt and their relative sizes

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DebtCompositionChartProps } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper functions for debt categorization - updated for dark theme
const getDebtColor = (debtName: string): string => {
  const name = debtName.toLowerCase();
  if (name.includes('home') || name.includes('mortgage')) return 'oklch(0.65 0.22 25)';
  if (name.includes('personal') || name.includes('consumer')) return 'oklch(0.7 0.2 35)';
  if (name.includes('credit') || name.includes('card')) return 'oklch(0.6 0.25 20)';
  if (name.includes('student') || name.includes('education')) return 'oklch(0.75 0.18 85)';
  if (name.includes('car') || name.includes('vehicle') || name.includes('auto')) return 'oklch(0.68 0.2 30)';
  return 'oklch(0.5 0.02 260)';
};

const getDebtDescription = (debtName: string): string => {
  const name = debtName.toLowerCase();
  if (name.includes('home') || name.includes('mortgage')) return 'Primary residence mortgage';
  if (name.includes('personal')) return 'Personal/consumer loans';
  if (name.includes('credit') || name.includes('card')) return 'Credit card balances';
  if (name.includes('student') || name.includes('education')) return 'Educational loans';
  if (name.includes('car') || name.includes('vehicle') || name.includes('auto')) return 'Vehicle financing';
  return 'Other debt obligations';
};

export const DebtCompositionChart: React.FC<DebtCompositionChartProps> = ({
  data,
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
            <h3 className="text-sm font-medium text-foreground mb-1">No Debt Data</h3>
            <p className="text-sm text-muted-foreground">
              Debt composition data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use only the latest month's data (current snapshot)
  const latestEntry = data[data.length - 1];
  const totalDebt = latestEntry.totalDebt;

  // Extract individual debt categories from the latest data entry
  const debtCategories = latestEntry.debt.debts
    .map(debt => {
      const currentValue = debt.values[debt.values.length - 1];
      return {
        name: debt.name,
        value: currentValue,
        color: getDebtColor(debt.name),
        description: getDebtDescription(debt.name)
      };
    })
    .filter(debt => debt.value > 0);

  // Fallback to estimated categories if debt.debts is empty
  if (debtCategories.length === 0 && totalDebt > 0) {
    debtCategories.push(
      {
        name: 'Home Loan',
        value: totalDebt * 0.85,
        color: 'oklch(0.65 0.22 25)',
        description: 'Primary residence mortgage'
      },
      {
        name: 'Personal Loan', 
        value: totalDebt * 0.15,
        color: 'oklch(0.7 0.2 35)',
        description: 'Personal/consumer loans'
      },
    );
  }

  // If no debt, show debt-free message
  if (totalDebt === 0 || debtCategories.length === 0) {
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
            <h3 className="text-sm font-medium text-foreground mb-1">No Outstanding Debt! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Congratulations on being debt-free!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chart configuration for horizontal bar chart
  const chartData = {
    labels: debtCategories.map(debt => debt.name),
    datasets: [
      {
        label: 'Outstanding Amount',
        data: debtCategories.map(debt => debt.value),
        backgroundColor: debtCategories.map(debt => debt.color),
        borderColor: 'oklch(0.18 0.02 260)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'oklch(0.16 0.02 260 / 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'oklch(0.4 0.02 260)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.x;
            const percentage = ((value / totalDebt) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}% of total debt)`;
          },
          afterLabel: (context: TooltipItem<'bar'>) => {
            const categoryIndex = context.dataIndex;
            const category = debtCategories[categoryIndex];
            return category?.description || '';
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Outstanding Amount (₹)',
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
      y: {
        display: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
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
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-chart-5 to-destructive"></div>
            Debt Composition
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Outstanding debt by category
          </p>
        </div>

        {/* Total Debt */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Total Outstanding</div>
          <div className="text-xl font-bold text-destructive tabular-nums mt-1">
            {formatCurrency(totalDebt)}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-56 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Debt Details */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Breakdown Details</div>
        <div className="space-y-2">
          {debtCategories.map((debt, index) => {
            const percentage = ((debt.value / totalDebt) * 100);
            return (
              <div key={index} className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ backgroundColor: debt.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {debt.name}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      {debt.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground tabular-nums">
                    {formatCurrency(debt.value)}
                  </div>
                  <div className="text-xs text-muted-foreground/70 tabular-nums">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="mt-6 p-4 glass rounded-xl border border-destructive/20">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-destructive/10">
            <svg
              className="w-4 h-4 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-destructive mb-2">Debt Management Strategy</div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {debtCategories.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-destructive/70">•</span>
                  Consider focusing on smallest debt first (snowball) or highest interest (avalanche)
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-destructive/70">•</span>
                Track monthly payments and interest rates for optimization
              </div>
              <div className="flex items-center gap-2">
                <span className="text-destructive/70">•</span>
                Set up automatic payments to avoid missed payments and late fees
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground/60 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Focus on high-interest debt first</span>
          <span className="text-muted-foreground/30">•</span>
          <span>📊 Track progress monthly</span>
          <span className="text-muted-foreground/30">•</span>
          <span>🎯 Set payoff goals</span>
        </div>
      </div>
    </div>
  );
};
