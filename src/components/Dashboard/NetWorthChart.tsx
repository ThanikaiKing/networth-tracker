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
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Data Available</h3>
            <p className="text-sm text-gray-500">
              No net worth data found for the selected period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Net Worth Trend</h2>
          <p className="text-sm text-gray-600">
            {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod.replace('months', ' months').replace('month', ' month')}`} performance
          </p>
        </div>
        
        {/* Chart info */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Net Worth</span>
          </div>
          <div>
            {data.length} data point{data.length !== 1 ? 's' : ''}
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
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Period: </span>
            <span className="font-medium text-gray-900">
              {data[0]?.date} - {data[data.length - 1]?.date}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Highest: </span>
            <span className="font-medium text-green-600">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(Math.max(...data.map(d => d.netWorth)))}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Lowest: </span>
            <span className="font-medium text-orange-600">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(Math.min(...data.map(d => d.netWorth)))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
