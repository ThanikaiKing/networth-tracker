// FireChart - Trajectory chart for accumulation phase with crossover point

'use client';

import React, { useMemo } from 'react';
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
import { TrendingUp, Flag } from 'lucide-react';

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

interface FireChartProps {
  calculation: FireCalculationResult;
}

export const FireChart: React.FC<FireChartProps> = ({ calculation }) => {
  const { accumulationTrajectory, crossoverPoint } = calculation;

  const labels = useMemo(() => {
    return accumulationTrajectory.map((d) => `${d.calendarYear} (Age ${d.age})`);
  }, [accumulationTrajectory]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Projected Net Worth',
          data: accumulationTrajectory.map((d) => d.portfolioValue),
          borderColor: 'oklch(0.38 0.095 152)', // Forest Green
          backgroundColor: 'oklch(0.38 0.095 152 / 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: accumulationTrajectory.map((d) => (d.isCrossoverYear ? 6 : 2)),
          pointHoverRadius: 7,
          pointBackgroundColor: accumulationTrajectory.map((d) =>
            d.isCrossoverYear ? 'oklch(0.60 0.13 80)' : 'oklch(0.38 0.095 152)'
          ),
        },
        {
          label: 'Total Principal Invested',
          data: accumulationTrajectory.map((d) => d.totalContributions),
          borderColor: 'oklch(0.48 0.10 235)', // Slate Blue
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'FIRE Target (Inflation Adjusted)',
          data: accumulationTrajectory.map((d) => d.fireTargetNominal),
          borderColor: 'oklch(0.60 0.13 80)', // Warm Amber
          backgroundColor: 'transparent',
          borderDash: [3, 3],
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [labels, accumulationTrajectory]);

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
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>Horizon Projection</span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-semibold text-foreground mt-0.5 font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Net Worth Accumulation & Crossover
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualizing the exponential curve where investment compounding overtakes future living costs.
          </p>
        </div>

        {crossoverPoint && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/25 text-accent text-xs font-semibold self-start sm:self-auto font-mono">
            <Flag className="h-4 w-4" />
            <span>Crossover: {crossoverPoint.monthDate} (Age {crossoverPoint.age})</span>
          </div>
        )}
      </div>

      <div className="h-80 sm:h-96 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
