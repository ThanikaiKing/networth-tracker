// PostFireGrowthChart - Interactive multi-decade visualization of finances during retirement/freedom

'use client';

import React, { useMemo, useState } from 'react';
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
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { TrendingUp, Shield, Sparkles } from 'lucide-react';

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

interface PostFireGrowthChartProps {
  calculation: FireCalculationResult;
}

export const PostFireGrowthChart: React.FC<PostFireGrowthChartProps> = ({ calculation }) => {
  const { postFireTrajectory, parameters } = calculation;
  const [horizonYears, setHorizonYears] = useState<15 | 30>(30);

  // Slice trajectory to selected horizon
  const visibleData = useMemo(() => {
    return postFireTrajectory.slice(0, horizonYears);
  }, [postFireTrajectory, horizonYears]);

  const labels = useMemo(() => {
    return visibleData.map((d) => `${d.calendarYear} (Age ${d.age})`);
  }, [visibleData]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value (Nominal ₹)',
          data: visibleData.map((d) => d.endBalance),
          borderColor: 'oklch(0.38 0.095 152)', // Forest Green primary
          backgroundColor: 'oklch(0.38 0.095 152 / 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: 'oklch(0.38 0.095 152)',
        },
        {
          label: 'Real Purchasing Power (Today\'s ₹)',
          data: visibleData.map((d) => d.realPurchasingPower),
          borderColor: 'oklch(0.48 0.10 235)', // Slate Blue chart-2
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Cumulative Lifestyle Funded',
          data: visibleData.map((d) => d.cumulativeWithdrawals),
          borderColor: 'oklch(0.60 0.13 80)', // Warm Amber accent
          backgroundColor: 'transparent',
          borderDash: [2, 3],
          tension: 0.35,
          borderWidth: 1.8,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [labels, visibleData]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          align: 'end' as const,
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            font: {
              family: 'var(--font-sans)',
              size: 12,
            },
            color: 'oklch(0.40 0.02 70)',
          },
        },
        tooltip: {
          backgroundColor: 'oklch(0.18 0.025 60 / 0.95)',
          titleFont: {
            family: 'var(--font-sans)',
            size: 13,
            weight: 'bold' as const,
          },
          bodyFont: {
            family: 'var(--font-mono)',
            size: 12,
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: TooltipItem<'line'>) => {
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.y;
              return ` ${datasetLabel}: ${formatCurrency(value)}`;
            },
            afterBody: (items: TooltipItem<'line'>[]) => {
              if (items.length > 0) {
                const index = items[0].dataIndex;
                const yearData = visibleData[index];
                if (yearData) {
                  return [
                    `-------------------------`,
                    `Annual Withdrawal: ${formatCurrency(yearData.annualWithdrawalAmount)}`,
                    `Net Annual Surplus: +${formatCurrency(yearData.netSurplusAnnual)}`,
                  ];
                }
              }
              return [];
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'oklch(0.875 0.013 80 / 0.4)',
          },
          ticks: {
            font: {
              family: 'var(--font-sans)',
              size: 11,
            },
            color: 'oklch(0.52 0.02 75)',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 7,
          },
        },
        y: {
          grid: {
            color: 'oklch(0.875 0.013 80 / 0.4)',
          },
          ticks: {
            font: {
              family: 'var(--font-mono)',
              size: 11,
            },
            color: 'oklch(0.52 0.02 75)',
            callback: (value: string | number) => {
              return formatCurrencyShort(Number(value));
            },
          },
        },
      },
    };
  }, [visibleData]);

  const endData = visibleData[visibleData.length - 1];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
      {/* Header with Title and Horizon Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>Perpetual Longevity Model</span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-semibold text-foreground mt-0.5 font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Post-FIRE Wealth Compounding Projection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Proof of sustainability: portfolio value continues to outgrow inflation even while fully funding your lifestyle.
          </p>
        </div>

        {/* Horizon selector buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setHorizonYears(15)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              horizonYears === 15
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            15 Years
          </button>
          <button
            onClick={() => setHorizonYears(30)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              horizonYears === 30
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            30 Years
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 sm:h-96 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Summary Footer Cards */}
      {endData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/70">
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
              Starting Portfolio
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-foreground mt-1 block">
              {formatCurrency(parameters.currentPortfolio)}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
              Today (Age {parameters.currentAge})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <span className="text-xs font-medium text-primary uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Projected Portfolio in {horizonYears}y
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-foreground mt-1 block">
              {formatCurrency(endData.endBalance)}
            </span>
            <span className="text-xs text-primary/80 mt-1 block">
              Real purchasing power: {formatCurrencyShort(endData.realPurchasingPower)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <span className="text-xs font-medium text-accent uppercase tracking-wider block flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Total Lifestyle Funded
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-foreground mt-1 block">
              {formatCurrency(endData.cumulativeWithdrawals)}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
              Guilt-free spending over {horizonYears} years
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
