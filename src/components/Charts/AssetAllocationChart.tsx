// Asset Allocation Pie Chart - Shows breakdown of assets by category

'use client';

import React, { useState, useEffect } from 'react';
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
import { calculateAssetAllocation } from '@/lib/utils';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Custom plugin to display center text with responsive font sizing
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
    
    // Calculate responsive font sizes based on chart dimensions
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    const baseSize = Math.min(chartWidth, chartHeight);
    
    // Responsive font sizes with minimum and maximum bounds
    const labelFontSize = Math.max(10, Math.min(16, baseSize * 0.04));
    const valueFontSize = Math.max(12, Math.min(20, baseSize * 0.05));
    
    // Set text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151'; // gray-700
    
    // Draw "Total Assets" label with responsive font size
    ctx.font = `bold ${labelFontSize}px sans-serif`;
    ctx.fillText('Total Assets', centerX, centerY - (labelFontSize * 0.75));
    
    // Draw the amount with responsive font size
    ctx.font = `bold ${valueFontSize}px sans-serif`;
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(totalAssets);
    
    // For very small screens, use short format to prevent overflow
    const displayAmount = baseSize < 200 ? formatCurrencyShort(totalAssets) : formattedAmount;
    ctx.fillText(displayAmount, centerX, centerY + (valueFontSize * 0.5));
    
    // Restore the context state
    ctx.restore();
  }
});

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  data,
  isLoading,
}) => {
  // State for responsive legend management
  const [isMobile, setIsMobile] = useState(false);

  // Effect to handle window resize and detect mobile screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  if (latestEntry.totalAssets === 0) {
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

  // Convert AssetAllocation object to array for chart - Fix: use actual amounts for values, percentages for percentages
  const assetCategories = [
    { 
      category: 'Bank Accounts', 
      value: latestEntry.bankAccounts.subtotal, // Actual amount in rupees
      percentage: allocationData.bankAccounts, // Percentage
      color: '#3B82F6' 
    },
    { 
      category: 'Investments', 
      value: latestEntry.investments.subtotal, // Actual amount in rupees
      percentage: allocationData.investments, // Percentage
      color: '#10B981' 
    },
    { 
      category: 'Other Assets', 
      value: latestEntry.otherAssets.subtotal, // Actual amount in rupees
      percentage: allocationData.otherAssets, // Percentage
      color: '#F59E0B' 
    },
  ].filter(item => item.value > 0);

  const chartData = {
    labels: assetCategories.map(item => item.category),
    datasets: [
      {
        data: assetCategories.map(item => item.value),
        backgroundColor: assetCategories.map(item => item.color),
        borderColor: assetCategories.map(item => item.color),
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
        display: !isMobile, // Hide legend on mobile screens
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
                const percentage = assetCategories[i]?.percentage || 0; // Fix: use percentage field, not value
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
        
        {/* Total Assets */}
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Assets</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(latestEntry.totalAssets)}
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

      {/* Allocation Details - Desktop Version */}
      <div className="space-y-3 hidden lg:block">
        <div className="text-sm font-medium text-gray-700">Allocation Details:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {assetCategories.map((item, index) => (
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

      {/* Allocation Details - Mobile Version */}
      <div className="space-y-3 lg:hidden">
        <div className="text-sm font-medium text-gray-700">Allocation Breakdown:</div>
        <div className="space-y-2">
          {assetCategories.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-900">
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {item.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrencyShort(item.value)}
                </div>
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
            <div className="text-sm text-blue-700">Diversify across different asset types for better risk management and growth potential.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
