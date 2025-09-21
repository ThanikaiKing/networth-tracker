// Custom hook for managing chart data and interactions

import { useMemo } from 'react';
import { NetWorthEntry, ChartDataPoint } from '@/lib/types';
import { generateChartData, parseChartDate } from '@/lib/utils';

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
          borderColor: 'rgb(59, 130, 246)', // Blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'rgb(255, 255, 255)',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: 'rgb(37, 99, 235)', // Blue-600
          pointHoverBorderColor: 'rgb(255, 255, 255)',
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Hide legend since we only have one dataset
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'rgb(255, 255, 255)',
          bodyColor: 'rgb(255, 255, 255)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          cornerRadius: 8,
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
            color: 'rgb(107, 114, 128)', // Gray-500
            font: {
              size: 12,
              weight: 500,
            },
          },
          ticks: {
            color: 'rgb(107, 114, 128)', // Gray-500
            font: {
              size: 11,
            },
            maxTicksLimit: 6,
          },
          grid: {
            display: true,
            color: 'rgba(229, 231, 235, 0.8)', // Gray-200 with opacity
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Net Worth (₹)',
            color: 'rgb(107, 114, 128)', // Gray-500
            font: {
              size: 12,
              weight: 500,
            },
          },
          ticks: {
            color: 'rgb(107, 114, 128)', // Gray-500
            font: {
              size: 11,
            },
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
            color: 'rgba(229, 231, 235, 0.8)', // Gray-200 with opacity
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
          hoverRadius: 8,
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
