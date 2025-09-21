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
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Data Available</h3>
            <p className="text-sm text-gray-500">
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

  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bank Accounts',
        data: bankAccountsData,
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Investments',
        data: investmentsData,
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        fill: '-1', // Fill to previous dataset
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Other Assets',
        data: otherAssetsData,
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        fill: '-1', // Fill to previous dataset
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        borderColor: 'rgb(59, 130, 246)',
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
        stacked: true, // Enable stacking
        display: true,
        title: {
          display: true,
          text: 'Asset Value (₹)',
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
        hoverRadius: 6,
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Asset Growth by Category</h2>
          <p className="text-sm text-gray-600">
            {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`} stacked growth
          </p>
        </div>

        {/* Growth Summary */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Growth</div>
          <div className={`text-xl font-bold ${totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(totalGrowth))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Growth Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">Bank Accounts</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold ${bankGrowth >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
              {bankGrowth >= 0 ? '+' : ''}{formatCurrency(bankGrowth)}
            </div>
            <div className="text-xs text-blue-600">
              Current: {formatCurrency(bankAccountsData[bankAccountsData.length - 1] || 0)}
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-900">Investments</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold ${investmentGrowth >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {investmentGrowth >= 0 ? '+' : ''}{formatCurrency(investmentGrowth)}
            </div>
            <div className="text-xs text-green-600">
              Current: {formatCurrency(investmentsData[investmentsData.length - 1] || 0)}
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-purple-900">Other Assets</span>
          </div>
          <div className="mt-2">
            <div className={`text-lg font-bold ${assetGrowth >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {assetGrowth >= 0 ? '+' : ''}{formatCurrency(assetGrowth)}
            </div>
            <div className="text-xs text-purple-600">
              Current: {formatCurrency(otherAssetsData[otherAssetsData.length - 1] || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Info Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        Stacked areas show cumulative asset composition over time • Hover for detailed breakdowns
      </div>
    </div>
  );
};
