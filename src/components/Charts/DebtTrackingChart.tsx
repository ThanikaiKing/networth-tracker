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
import { extractDebtCategoryData, calculateDebtAnalytics, classifyRiskLevel } from '@/lib/analytics';
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Debt Data</h3>
            <p className="text-sm text-gray-500">
              Debt tracking data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const debtData = extractDebtCategoryData(data);
  const debtAnalytics = calculateDebtAnalytics(data);
  const riskLevel = classifyRiskLevel(debtAnalytics.debtToAssetRatio);
  
  const labels = debtData.dates.map(date => parseChartDate(date));

  // Check if there's any debt data
  const hasDebtData = debtData.totalDebt.some(value => value > 0);

  if (!hasDebtData) {
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
            <h3 className="text-sm font-medium text-gray-900 mb-1">Debt Free! 🎉</h3>
            <p className="text-sm text-gray-500">
              You currently have no outstanding debt.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chart configuration with dual-axis
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Debt',
        data: debtData.totalDebt,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y',
      },
      {
        label: 'Debt-to-Asset Ratio',
        data: debtData.debtToAssetRatio,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y1',
        borderDash: [5, 5], // Dashed line to differentiate
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
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        cornerRadius: 8,
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
          maxTicksLimit: 6,
        },
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Debt Amount (₹)',
          color: 'rgb(239, 68, 68)',
          font: {
            size: 12,
            weight: 500,
          },
        },
        ticks: {
          color: 'rgb(239, 68, 68)',
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
          color: 'rgb(245, 158, 11)',
          font: {
            size: 12,
            weight: 500,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          color: 'rgb(245, 158, 11)',
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            return `${value}%`;
          },
        },
        grid: {
          display: true,
          color: 'rgba(229, 231, 235, 0.8)',
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Debt Tracking</h2>
          <p className="text-sm text-gray-600">
            Debt reduction progress over {selectedPeriod === 'all' ? 'all time' : `last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`}
          </p>
        </div>

        {/* Risk Level Indicator */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Risk Level</div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}
               style={{ backgroundColor: `${riskLevel.color}20`, color: riskLevel.color }}>
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: riskLevel.color }}></div>
            {riskLevel.level.toUpperCase()}
          </div>
          <div className="text-xs text-gray-500 mt-1">{riskLevel.description}</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Debt Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Current Debt */}
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-red-900">Current Debt</span>
          </div>
          <div className="text-lg font-bold text-red-700">
            {formatCurrency(debtAnalytics.totalDebt)}
          </div>
        </div>

        {/* Debt-to-Asset Ratio */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-yellow-900">D/A Ratio</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {debtAnalytics.debtToAssetRatio.toFixed(1)}%
          </div>
        </div>

        {/* Monthly Reduction */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium text-green-900">Monthly Reduction</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {debtAnalytics.monthlyReduction >= 0 ? '+' : ''}{formatCurrency(debtAnalytics.monthlyReduction)}
          </div>
        </div>

        {/* Payoff Timeline */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Payoff Timeline</span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {debtAnalytics.projectedPayoffMonths 
              ? `${debtAnalytics.projectedPayoffMonths} months`
              : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Progress Insight */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
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
          <div>
            <div className="text-sm font-medium text-gray-900">Progress Insight</div>
            <div className="text-sm text-gray-600">
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
