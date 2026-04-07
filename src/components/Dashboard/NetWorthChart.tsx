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
      <div className="chart-card p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">No Data Available</p>
          <p className="text-sm text-muted-foreground">
            No net worth data found for the selected period.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card p-6 hover-lift">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="font-display text-xl font-semibold text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Net Worth Trend
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`} performance
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 glass rounded">
            <div className="w-2 h-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Net Worth</span>
          </div>
          <div className="px-2.5 py-1 glass rounded text-muted-foreground tabular-nums">
            {data.length} pt{data.length !== 1 ? 's' : ''}
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

      {/* Chart Footer */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Period</span>
            <p className="font-medium text-foreground tabular-nums mt-0.5">
              {data[0]?.date} – {data[data.length - 1]?.date}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Peak</span>
            <p className="font-medium text-primary tabular-nums mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(...data.map(d => d.netWorth)))}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Trough</span>
            <p className="font-medium text-muted-foreground tabular-nums mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.min(...data.map(d => d.netWorth)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
