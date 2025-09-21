// Asset Allocation Pie Chart - Shows breakdown of assets by category

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
  TooltipItem
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AssetAllocationChartProps } from '@/lib/types';
import { calculateAssetAllocation, calculateAllocationScore } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Custom plugin to display center text
const createCenterTextPlugin = (totalAssets: number): Plugin<'doughnut'> => ({
  id: 'centerText',
  beforeDraw: (chart) => {
    const { ctx } = chart;
    const { chartArea } = chart;
    
    if (!chartArea) return;
    
    // Save the current context state
    ctx.save();
    
    // Calculate the center of the chart area (not the full canvas)
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    
    // Set text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151'; // gray-700
    
    // Draw "Total Assets" label
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Total Assets', centerX, centerY - 12);
    
    // Draw the amount
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(totalAssets), centerX, centerY + 12);
    
    // Restore the context state
    ctx.restore();
  }
});

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
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
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Asset Data</h3>
            <p className="text-sm text-gray-500">
              Asset allocation data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const latestEntry = data[data.length - 1];
  const allocationData = calculateAssetAllocation(latestEntry);
  const { score, feedback } = calculateAllocationScore(allocationData);

  if (allocationData.length === 0 || latestEntry.totalAssets === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Assets Found</h3>
            <p className="text-sm text-gray-500">
              Add asset data to see allocation breakdown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: allocationData.map(item => item.category),
    datasets: [
      {
        data: allocationData.map(item => item.value),
        backgroundColor: allocationData.map(item => item.color),
        borderColor: allocationData.map(item => item.color),
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverBorderColor: '#FFFFFF',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
          generateLabels: (chart: ChartJS) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return (data.labels as string[]).map((label: string, i: number) => {
                const value = (data.datasets[0].data[i] as number) || 0;
                const percentage = allocationData[i]?.percentage || 0;
                return {
                  text: `${label}\n${formatCurrency(value)} (${percentage.toFixed(1)}%)`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])?.[i] || '#000000',
                  strokeStyle: (data.datasets[0].borderColor as string[])?.[i] || '#000000',
                  lineWidth: (typeof data.datasets[0].borderWidth === 'number' ? data.datasets[0].borderWidth : 1),
                  hidden: false,
                  index: i,
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
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / latestEntry.totalAssets) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    cutout: '60%', // Creates doughnut effect
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Asset Allocation</h2>
          <p className="text-sm text-gray-600">
            Current breakdown by category
          </p>
        </div>
        
        {/* Allocation Score */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Allocation Score</div>
          <div className={`text-2xl font-bold ${
            score >= 80 ? 'text-green-600' : 
            score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}/100
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 mb-6">
        <Doughnut 
          data={chartData} 
          options={chartOptions}
          plugins={[createCenterTextPlugin(latestEntry.totalAssets)]}
        />
      </div>

      {/* Allocation Details */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Allocation Details:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allocationData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.category}
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(item.value)}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Feedback */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
            <div className="text-sm font-medium text-blue-900">Allocation Insight</div>
            <div className="text-sm text-blue-700">{feedback}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
