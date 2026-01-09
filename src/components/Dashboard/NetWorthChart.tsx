// Interactive net worth chart component using Chart.js

'use client';

import React, { useEffect, useRef } from 'react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { NetWorthChartProps } from '@/lib/types';
import { useChartData } from '@/hooks/useChartData';
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

export const NetWorthChart: React.FC<NetWorthChartProps> = ({
  data,
  selectedPeriod,
  isLoading,
}) => {
  const chartRef = useRef<ChartJS<'line', number[], string>>(null);
  const { chartConfig } = useChartData(data);

  // Cleanup chart on unmount
  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  if (isLoading) {
    return <SkeletonChart className="h-96" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-4">
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
            <h3 className="text-sm font-medium text-foreground mb-1">No Data Available</h3>
            <p className="text-sm text-muted-foreground">
              No net worth data found for the selected period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-chart-1 to-chart-2"></div>
            Net Worth Trend
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`} performance
          </p>
        </div>
        
        {/* Chart info */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-chart-1 to-chart-2"></div>
            <span className="text-muted-foreground">Net Worth</span>
          </div>
          <div className="px-3 py-1.5 rounded-full glass text-muted-foreground tabular-nums">
            {data.length} point{data.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80">
        <Line
          ref={chartRef}
          data={chartConfig.data}
          options={chartConfig.options}
        />
      </div>

      {/* Chart Footer - Additional Info */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Period</span>
              <p className="font-medium text-foreground tabular-nums">
                {data[0]?.date} – {data[data.length - 1]?.date}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Highest</span>
              <p className="font-medium text-primary tabular-nums">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(Math.max(...data.map(d => d.netWorth)))}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <svg className="w-4 h-4 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <span className="text-muted-foreground/70 text-xs">Lowest</span>
              <p className="font-medium text-chart-4 tabular-nums">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(Math.min(...data.map(d => d.netWorth)))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
