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

// Set default device pixel ratio for crisp rendering
ChartJS.defaults.devicePixelRatio = 2;

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

    // Dark theme colors
    const colors = {
      historical: 'oklch(0.68 0.18 220)',  // Blue
      conservative: 'oklch(0.65 0.22 25)', // Rose
      moderate: 'oklch(0.75 0.18 85)',     // Amber
      aggressive: 'oklch(0.72 0.19 165)',  // Emerald
    };

    return {
      data: {
        datasets: [
          {
            label: 'Historical Net Worth',
            data: historicalPoints,
            borderColor: colors.historical,
            backgroundColor: 'oklch(0.68 0.18 220 / 0.15)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: colors.historical,
            pointBorderColor: 'oklch(0.18 0.02 260)',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Conservative',
            data: conservativePoints,
            borderColor: colors.conservative,
            backgroundColor: 'oklch(0.65 0.22 25 / 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: colors.conservative,
            pointBorderColor: 'oklch(0.18 0.02 260)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Moderate',
            data: moderatePoints,
            borderColor: colors.moderate,
            backgroundColor: 'oklch(0.75 0.18 85 / 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: colors.moderate,
            pointBorderColor: 'oklch(0.18 0.02 260)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Aggressive',
            data: aggressivePoints,
            borderColor: colors.aggressive,
            backgroundColor: 'oklch(0.72 0.19 165 / 0.05)',
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: colors.aggressive,
            pointBorderColor: 'oklch(0.18 0.02 260)',
            pointBorderWidth: 1,
            tension: 0.4,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
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
                size: 11,
                weight: 500 as const
              },
              color: 'rgba(255, 255, 255, 0.5)'
            },
            grid: {
              color: 'oklch(0.3 0.02 260 / 0.2)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              font: {
                size: 10
              }
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Net Worth (₹)',
              font: {
                size: 11,
                weight: 500 as const
              },
              color: 'rgba(255, 255, 255, 0.5)'
            },
            grid: {
              color: 'oklch(0.3 0.02 260 / 0.2)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              font: {
                size: 10
              },
              callback: function(value: string | number) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        plugins: {
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
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 11
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Projection Data</h3>
            <p className="text-sm text-muted-foreground">
              No historical data available for projection calculations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!projectionResult) {
    return (
      <div className="glass-card rounded-2xl p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-chart-4/10 mb-4">
              <svg
                className="h-8 w-8 text-chart-4"
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
            <h3 className="text-sm font-medium text-foreground mb-1">Unable to Calculate Projections</h3>
            <p className="text-sm text-muted-foreground">
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
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-chart-2 to-primary"></div>
            Net Worth Projection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historical data with {projectionResult.projectionPeriodYears}-year projections
          </p>
        </div>
        
        {/* Chart Legend */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full glass">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'oklch(0.68 0.18 220)' }}></div>
            <span className="text-muted-foreground">Historical</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full glass">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.22 25)' }}></div>
            <span className="text-muted-foreground">Conservative</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full glass">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'oklch(0.75 0.18 85)' }}></div>
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full glass">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'oklch(0.72 0.19 165)' }}></div>
            <span className="text-muted-foreground">Aggressive</span>
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
      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <svg className="w-4 h-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Current</span>
              <p className="font-medium text-foreground tabular-nums">
                {formatCurrency(projectionResult.summary.currentNetWorth)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-chart-5/10">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.22 25)' }}></div>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Conservative ({projectionResult.projectionPeriodYears}Y)</span>
              <p className="font-medium text-chart-5 tabular-nums">
                {formatCurrency(conservativeFinal)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'oklch(0.75 0.18 85)' }}></div>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Moderate ({projectionResult.projectionPeriodYears}Y)</span>
              <p className="font-medium text-chart-4 tabular-nums">
                {formatCurrency(moderateFinal)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'oklch(0.72 0.19 165)' }}></div>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Aggressive ({projectionResult.projectionPeriodYears}Y)</span>
              <p className="font-medium text-primary tabular-nums">
                {formatCurrency(aggressiveFinal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
