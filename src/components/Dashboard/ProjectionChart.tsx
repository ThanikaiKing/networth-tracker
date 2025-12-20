// ProjectionChart component showing historical and projected net worth with all scenarios

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TooltipItem,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { ChartDataPoint, NetWorthEntry, ProjectionResult } from '@/lib/types';
import { SkeletonChart } from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Updated props interface - no longer needs selectedScenario
interface ProjectionChartComponentProps {
  data: NetWorthEntry[];
  projectionResult: ProjectionResult | null;
  isLoading: boolean;
}

export const ProjectionChart: React.FC<ProjectionChartComponentProps> = ({
  data,
  projectionResult,
  isLoading
}) => {
  const chartRef = useRef<ChartJS<'line', ChartDataPoint[], string>>(null);

  // Cleanup chart on unmount
  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  const chartConfig = useMemo(() => {
    if (isLoading || !data.length || !projectionResult) return null;

    // Combine historical and projection data
    const historicalPoints: ChartDataPoint[] = data.map(entry => ({
      x: entry.date,
      y: entry.netWorth
    }));

    // Get all three scenarios
    const conservativeScenario = projectionResult.scenarios.find(s => s.name === 'conservative');
    const moderateScenario = projectionResult.scenarios.find(s => s.name === 'moderate');
    const aggressiveScenario = projectionResult.scenarios.find(s => s.name === 'aggressive');

    const conservativePoints: ChartDataPoint[] = conservativeScenario?.data.map(point => ({
      x: point.x,
      y: point.y
    })) || [];

    const moderatePoints: ChartDataPoint[] = moderateScenario?.data.map(point => ({
      x: point.x,
      y: point.y
    })) || [];

    const aggressivePoints: ChartDataPoint[] = aggressiveScenario?.data.map(point => ({
      x: point.x,
      y: point.y
    })) || [];

    return {
      data: {
        datasets: [
          {
            label: 'Historical Net Worth',
            data: historicalPoints,
            borderColor: 'rgb(59, 130, 246)', // Blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Conservative',
            data: conservativePoints,
            borderColor: '#EF4444', // Red
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: '#EF4444',
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Moderate',
            data: moderatePoints,
            borderColor: '#F59E0B', // Orange
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: '#F59E0B',
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Aggressive',
            data: aggressivePoints,
            borderColor: '#10B981', // Green
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: '#10B981',
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index' as const,
        },
        scales: {
          x: {
            type: 'time' as const,
            time: {
              unit: 'month' as const,
              displayFormats: {
                month: 'MMM yyyy'
              }
            },
            title: {
              display: true,
              text: 'Time Period',
              font: {
                size: 12,
                weight: 500 as const
              },
              color: '#6B7280'
            },
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Net Worth (₹)',
              font: {
                size: 12,
                weight: 500 as const
              },
              color: '#6B7280'
            },
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              },
              callback: function(value: string | number) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgb(255, 255, 255)',
            bodyColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context: TooltipItem<'line'>[]) {
                const dataPoint = context[0];
                const date = new Date(dataPoint.parsed.x);
                return date.toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short' 
                });
              },
              label: function(context: TooltipItem<'line'>) {
                const label = context.dataset.label || '';
                const value = formatCurrency(context.parsed.y);
                return `${label}: ${value}`;
              }
            }
          },
          legend: {
            position: 'top' as const,
            labels: {
              usePointStyle: true,
              padding: 20,
              color: '#374151',
              font: {
                size: 12
              }
            }
          }
        }
      }
    };
  }, [data, projectionResult, isLoading]);

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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Projection Data</h3>
            <p className="text-sm text-gray-500">
              No historical data available for projection calculations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!projectionResult) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-6 w-6 text-yellow-400"
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
            <h3 className="text-sm font-medium text-gray-900 mb-1">Unable to Calculate Projections</h3>
            <p className="text-sm text-gray-500">
              Insufficient data for reliable projections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get final values for all scenarios
  const conservativeFinal = projectionResult.scenarios.find(s => s.name === 'conservative')?.data.slice(-1)[0]?.y || 0;
  const moderateFinal = projectionResult.scenarios.find(s => s.name === 'moderate')?.data.slice(-1)[0]?.y || 0;
  const aggressiveFinal = projectionResult.scenarios.find(s => s.name === 'aggressive')?.data.slice(-1)[0]?.y || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Net Worth Projection</h2>
          <p className="text-sm text-gray-600">
            Historical data with {projectionResult.projectionPeriodYears}-year projections
          </p>
        </div>
        
        {/* Chart Legend */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Historical</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Conservative</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-96">
        {chartConfig && (
          <Line
            ref={chartRef}
            data={chartConfig.data}
            options={chartConfig.options}
          />
        )}
      </div>

      {/* Chart Footer - Scenario Comparison */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current: </span>
            <span className="font-medium text-gray-900">
              {formatCurrency(projectionResult.summary.currentNetWorth)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Conservative ({projectionResult.projectionPeriodYears}Y): </span>
            <span className="font-medium text-red-600">
              {formatCurrency(conservativeFinal)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Moderate ({projectionResult.projectionPeriodYears}Y): </span>
            <span className="font-medium text-orange-600">
              {formatCurrency(moderateFinal)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Aggressive ({projectionResult.projectionPeriodYears}Y): </span>
            <span className="font-medium text-green-600">
              {formatCurrency(aggressiveFinal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
