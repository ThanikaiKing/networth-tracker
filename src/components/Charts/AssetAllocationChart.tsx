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
    const labelFontSize = Math.max(10, Math.min(14, baseSize * 0.035));
    const valueFontSize = Math.max(12, Math.min(18, baseSize * 0.045));
    
    // Set text properties - using light colors for dark theme
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw "Total Assets" label with responsive font size
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // muted-foreground
    ctx.font = `500 ${labelFontSize}px system-ui, sans-serif`;
    ctx.fillText('Total Assets', centerX, centerY - (labelFontSize * 0.75));
    
    // Draw the amount with responsive font size
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // foreground
    ctx.font = `700 ${valueFontSize}px system-ui, sans-serif`;
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
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Asset Data</h3>
            <p className="text-sm text-muted-foreground">
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
      <div className="glass-card rounded-2xl p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-sm font-medium text-foreground mb-1">No Assets Found</h3>
            <p className="text-sm text-muted-foreground">
              Add asset data to see allocation breakdown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Modern chart colors matching the theme
  const chartColors = {
    bank: 'oklch(0.68 0.18 220)',      // chart-2 (blue)
    investments: 'oklch(0.72 0.19 165)', // primary (emerald)
    other: 'oklch(0.7 0.2 280)',        // accent (purple)
  };

  // Convert AssetAllocation object to array for chart
  const assetCategories = [
    { 
      category: 'Bank Accounts', 
      value: latestEntry.bankAccounts.subtotal,
      percentage: allocationData.bankAccounts,
      color: chartColors.bank
    },
    { 
      category: 'Investments', 
      value: latestEntry.investments.subtotal,
      percentage: allocationData.investments,
      color: chartColors.investments
    },
    { 
      category: 'Other Assets', 
      value: latestEntry.otherAssets.subtotal,
      percentage: allocationData.otherAssets,
      color: chartColors.other
    },
  ].filter(item => item.value > 0);

  const chartData = {
    labels: assetCategories.map(item => item.category),
    datasets: [
      {
        data: assetCategories.map(item => item.value),
        backgroundColor: assetCategories.map(item => item.color),
        borderColor: 'oklch(0.18 0.02 260)',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBorderColor: 'oklch(0.3 0.02 260)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          generateLabels: (chart: ChartJS) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return (data.labels as string[]).map((label: string, i: number) => {
                const value = (data.datasets[0].data[i] as number) || 0;
                const percentage = assetCategories[i]?.percentage || 0;
                return {
                  text: `${label}\n${formatCurrency(value)} (${percentage.toFixed(1)}%)`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])?.[i] || '#000000',
                  strokeStyle: (data.datasets[0].borderColor as string) || '#000000',
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
        backgroundColor: 'oklch(0.16 0.02 260 / 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'oklch(0.4 0.02 260)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
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
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-chart-2 to-accent"></div>
            Asset Allocation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Current breakdown by category
          </p>
        </div>
        
        {/* Total Assets */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Total Assets</div>
          <div className="text-2xl font-bold text-chart-2 tabular-nums mt-1">
            {formatCurrency(latestEntry.totalAssets)}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-72 mb-6">
        <Doughnut 
          data={chartData} 
          options={chartOptions}
          plugins={[createCenterTextPlugin(latestEntry.totalAssets)]}
        />
      </div>

      {/* Allocation Details - Desktop Version */}
      <div className="space-y-3 hidden lg:block">
        <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Allocation Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {assetCategories.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 glass rounded-xl hover:bg-white/5 transition-colors">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {item.category}
                </div>
                <div className="text-xs text-muted-foreground/70 tabular-nums">
                  {formatCurrency(item.value)}
                </div>
              </div>
              <div className="text-sm font-semibold text-foreground tabular-nums">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Details - Mobile Version */}
      <div className="space-y-3 lg:hidden">
        <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Allocation Breakdown</div>
        <div className="space-y-2">
          {assetCategories.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 glass rounded-xl">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground tabular-nums">
                  {item.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground/70 tabular-nums">
                  {formatCurrencyShort(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Feedback */}
      <div className="mt-4 p-4 glass rounded-xl border border-chart-2/20">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-chart-2/10">
            <svg
              className="w-4 h-4 text-chart-2"
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
            <div className="text-sm font-medium text-chart-2">Allocation Insight</div>
            <div className="text-sm text-muted-foreground mt-0.5">Diversify across different asset types for better risk management and growth potential.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
