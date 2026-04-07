// Custom hook for managing chart data and interactions

import { useMemo } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { NetWorthEntry, ChartDataPoint } from '@/lib/types';
import { generateChartData, parseChartDate } from '@/lib/utils';

// Set default device pixel ratio for crisp rendering on all charts
ChartJS.defaults.devicePixelRatio = 2;

interface UseChartDataReturn {
  chartData: ChartDataPoint[];
  labels: string[];
  values: number[];
  minValue: number;
  maxValue: number;
  chartConfig: {
    type: 'line';
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        [key: string]: unknown;
      }>;
    };
    options: {
      [key: string]: unknown;
    };
  };
}

export const useChartData = (data: NetWorthEntry[]): UseChartDataReturn => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return generateChartData(data);
  }, [data]);

  const labels = useMemo(() => {
    return chartData.map(point => parseChartDate(point.x));
  }, [chartData]);

  const values = useMemo(() => {
    return chartData.map(point => point.y);
  }, [chartData]);

  const minValue = useMemo(() => {
    if (values.length === 0) return 0;
    return Math.min(...values);
  }, [values]);

  const maxValue = useMemo(() => {
    if (values.length === 0) return 0;
    return Math.max(...values);
  }, [values]);

  const chartConfig = useMemo(() => ({
    type: 'line' as const,
    data: {
      labels,
      datasets: [
        {
          label: 'Net Worth',
          data: values,
          borderColor: 'oklch(0.38 0.095 152)', // Forest green
          backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
            const ctx = context.chart.ctx;
            const chartArea = context.chart.chartArea;
            if (!chartArea) return 'oklch(0.38 0.095 152 / 0.08)';

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'oklch(0.38 0.095 152 / 0.18)');
            gradient.addColorStop(0.6, 'oklch(0.38 0.095 152 / 0.05)');
            gradient.addColorStop(1, 'oklch(0.38 0.095 152 / 0)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'oklch(0.38 0.095 152)',
          pointBorderColor: 'oklch(0.997 0.003 80)',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'oklch(0.32 0.09 152)',
          pointHoverBorderColor: 'oklch(0.997 0.003 80)',
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'oklch(0.18 0.025 60)',
          titleColor: 'oklch(0.92 0.006 80)',
          bodyColor: 'oklch(0.78 0.01 80)',
          borderColor: 'oklch(0.38 0.095 152 / 0.4)',
          borderWidth: 1,
          cornerRadius: 6,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: function(context: Array<{ label?: string }>) {
              return context[0]?.label || '';
            },
            label: function(context: { parsed: { y: number } }) {
              const value = context.parsed.y;
              return `Net Worth: ${new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(value)}`;
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
            color: 'oklch(0.62 0.018 75)',
            font: { size: 11, weight: 500 },
          },
          ticks: {
            color: 'oklch(0.52 0.02 75)',
            font: { size: 10 },
            maxTicksLimit: 6,
          },
          grid: {
            display: true,
            color: 'oklch(0.875 0.013 80)',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Net Worth (₹)',
            color: 'oklch(0.62 0.018 75)',
            font: { size: 11, weight: 500 },
          },
          ticks: {
            color: 'oklch(0.52 0.02 75)',
            font: { size: 10 },
            callback: function(value: string | number) {
              // Format large numbers with K/M/Cr suffixes
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
            color: 'oklch(0.875 0.013 80)',
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
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
    },
  }), [labels, values]);

  return {
    chartData,
    labels,
    values,
    minValue,
    maxValue,
    chartConfig,
  };
};
