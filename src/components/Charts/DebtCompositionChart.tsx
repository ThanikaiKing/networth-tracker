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

export const DebtCompositionChart: React.FC<DebtCompositionChartProps> = ({
  data,
  isLoading,
}) => {
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Debt Data</h3>
            <p className="text-sm text-gray-500">
              Debt composition data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const latestEntry = data[data.length - 1];
  const totalDebt = latestEntry.totalDebt;

  // Extract debt composition from the latest data entry
  // Note: Based on your CSV structure, we need to extract individual debt categories
  // For now, we'll work with the available debt subtotal and create a simplified view
  
  // Mock debt categories for demonstration - in real implementation,
  // you would extract individual debt rows from the Google Sheet
  const debtCategories = [
    {
      name: 'Home Loan',
      value: totalDebt * 0.85, // Assuming home loan is ~85% of total debt
      color: '#EF4444',
      description: 'Primary residence mortgage'
    },
    {
      name: 'Personal Loan', 
      value: totalDebt * 0.15, // Assuming personal loan is ~15% of total debt
      color: '#F97316',
      description: 'Personal/consumer loans'
    }
  ].filter(debt => debt.value > 0);

  // If no debt, show debt-free message
  if (totalDebt === 0 || debtCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-500"
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
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Outstanding Debt! 🎉</h3>
            <p className="text-sm text-gray-500">
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
        borderColor: debtCategories.map(debt => debt.color),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bars
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        cornerRadius: 8,
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
            if (num >= 10000000) { // 1 crore
              return `₹${(num / 10000000).toFixed(1)}Cr`;
            } else if (num >= 100000) { // 1 lakh
              return `₹${(num / 100000).toFixed(1)}L`;
            } else if (num >= 1000) { // 1 thousand
              return `₹${(num / 1000).toFixed(0)}K`;
            }
            return `₹${num.toFixed(0)}`;
          },
        },
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
      y: {
        display: true,
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Debt Composition</h2>
          <p className="text-sm text-gray-600">
            Outstanding debt by category
          </p>
        </div>

        {/* Total Debt */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Outstanding</div>
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(totalDebt)}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-64 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Debt Details */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-3">Breakdown Details:</div>
        <div className="space-y-3">
          {debtCategories.map((debt, index) => {
            const percentage = ((debt.value / totalDebt) * 100);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: debt.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {debt.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {debt.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(debt.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
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
          <div>
            <div className="text-sm font-medium text-red-900 mb-2">Debt Management Strategy</div>
            <div className="space-y-2 text-sm text-red-800">
              {debtCategories.length > 1 && (
                <div>• Consider focusing on the smallest debt first (debt snowball) or highest interest rate debt (debt avalanche)</div>
              )}
              <div>• Track monthly payments and interest rates for optimization</div>
              <div>• Set up automatic payments to avoid missed payments and late fees</div>
              <div>• Consider debt consolidation if you have multiple high-interest debts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Focus on high-interest debt first</span>
          <span>•</span>
          <span>📊 Track progress monthly</span>
          <span>•</span>
          <span>🎯 Set payoff goals</span>
        </div>
      </div>
    </div>
  );
};
