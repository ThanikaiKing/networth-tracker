// Investment Allocation Chart - Pie chart showing current portfolio distribution across investment types

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { InvestmentAllocationChartProps } from '@/lib/types';
import { formatCurrency, formatCurrencyShort, getInvestmentAssetClass } from '@/lib/utils';
import { SkeletonChart } from '@/components/common/LoadingSpinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Set default device pixel ratio for crisp rendering
ChartJS.defaults.devicePixelRatio = 2;
ChartJS.defaults.color = 'oklch(0.52 0.02 75)';

// Investment color configuration - dark theme
const INVESTMENT_COLORS: Record<string, string> = {
  'Equity': 'oklch(0.68 0.18 220)',      // Blue
  'Mutual funds': 'oklch(0.72 0.19 165)', // Emerald  
  'Gold': 'oklch(0.75 0.18 85)',         // Amber
  'EPF': 'oklch(0.7 0.2 280)',           // Purple
  'NPS': 'oklch(0.7 0.15 195)',          // Cyan
  'FD': 'oklch(0.7 0.18 140)',           // Lime
  'BetterInvest': 'oklch(0.7 0.2 35)',   // Orange
  'Walmart shares': 'oklch(0.65 0.22 25)', // Red
  'US Stocks': 'oklch(0.65 0.18 250)',   // Indigo
  'Bhive': 'oklch(0.7 0.15 45)',
  'Aston grey': 'oklch(0.68 0.15 320)',       // Pink
  'Estates - Per Annum': 'oklch(0.68 0.12 210)',
};

// Asset class colors for category-based view
const ASSET_CLASS_COLORS: Record<string, string> = {
  'Real Estate':  'oklch(0.72 0.16 65)',   // Amber/terracotta
  'Stock Market': 'oklch(0.68 0.18 220)',  // Blue
  'Government':   'oklch(0.72 0.19 165)', // Emerald
  'Alternate':    'oklch(0.7 0.2 280)',   // Purple
  'Liquid':       'oklch(0.7 0.15 195)',  // Cyan
  'Gold':         'oklch(0.75 0.18 85)',  // Amber
  'Other':        'oklch(0.5 0.02 260)',  // Gray
};

// Get color for investment
const getInvestmentColor = (investmentName: string): string => {
  return INVESTMENT_COLORS[investmentName] || 'oklch(0.5 0.02 260)';
};

export const InvestmentAllocationChart: React.FC<InvestmentAllocationChartProps> = ({
  data,
  isLoading,
}) => {
  // Process allocation data (move before early returns)
  const { chartData, investmentBreakdown, assetClassBreakdown, totalInvestments } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: { labels: [], datasets: [] },
        investmentBreakdown: [],
        assetClassBreakdown: [],
        totalInvestments: 0,
      };
    }
    const latestEntry = data[data.length - 1];
    const investments = latestEntry.investments.accounts;
    const total = latestEntry.investments.subtotal;

    // Individual investment breakdown
    const investmentData = investments
      .map(investment => {
        // Use the latest value for each investment
        const currentValue = investment.values[investment.values.length - 1] || 0;
        return {
          name: investment.name,
          value: currentValue,
          percentage: total > 0 ? (currentValue / total) * 100 : 0,
          color: getInvestmentColor(investment.name),
          category: getInvestmentAssetClass(investment.name)
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Asset class breakdown
    const assetClasses = new Map();
    investmentData.forEach(item => {
      const category = item.category;
      if (assetClasses.has(category)) {
        assetClasses.set(category, assetClasses.get(category) + item.value);
      } else {
        assetClasses.set(category, item.value);
      }
    });

    const assetClassData = Array.from(assetClasses.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: ASSET_CLASS_COLORS[name] || 'oklch(0.5 0.02 260)'
    }));

    // Create chart data
    const chartLabels = investmentData.map(item => item.name);
    const chartValues = investmentData.map(item => item.value);
    const chartColors = investmentData.map(item => item.color);

    return {
      chartData: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: chartColors,
            borderColor: 'oklch(0.997 0.003 80)',
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverBorderColor: 'oklch(0.97 0.005 80)',
            hoverOffset: 8,
          },
        ],
      },
      investmentBreakdown: investmentData,
      assetClassBreakdown: assetClassData,
      totalInvestments: total,
    };
  }, [data]);

  // Expected returns per asset class (persisted in localStorage)
  const [expectedReturns, setExpectedReturns] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('investment-expected-returns') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('investment-expected-returns', JSON.stringify(expectedReturns));
  }, [expectedReturns]);

  const weightedReturn = useMemo(() => {
    if (totalInvestments === 0) return null;
    let sum = 0;
    let coveredWeight = 0;
    assetClassBreakdown.forEach(ac => {
      const ret = parseFloat(expectedReturns[ac.name] ?? '');
      if (!isNaN(ret)) {
        const weight = ac.value / totalInvestments;
        sum += weight * ret;
        coveredWeight += weight;
      }
    });
    if (coveredWeight === 0) return null;
    return { value: sum, coveredWeight };
  }, [assetClassBreakdown, expectedReturns, totalInvestments]);

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
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Investment Data</h3>
            <p className="text-sm text-muted-foreground">
              Investment allocation data is not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 10,
            weight: 500
          },
          color: 'oklch(0.52 0.02 75)',
          padding: 12,
          boxWidth: 8,
          boxHeight: 8,
          generateLabels: (chart: ChartJS) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return data.labels.map((label, index) => {
                const value = data.datasets[0].data[index] as number;
                const percentage = totalInvestments > 0 ? ((value / totalInvestments) * 100) : 0;
                return {
                  text: `${label} (${percentage.toFixed(1)}%)`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])?.[index] || 'oklch(0.5 0.02 260)',
                  strokeStyle: 'oklch(0.997 0.003 80)',
                  fontColor: 'oklch(0.52 0.02 75)',
                  lineWidth: 2,
                  hidden: false,
                  index,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'oklch(0.18 0.025 60)',
        titleColor: 'oklch(0.92 0.006 80)',
        bodyColor: 'oklch(0.78 0.01 80)',
        borderColor: 'oklch(0.4 0.02 260)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const percentage = totalInvestments > 0 ? ((value / totalInvestments) * 100) : 0;
            return `${context.label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;
          },
          afterLabel: (context: TooltipItem<'doughnut'>) => {
            const investmentName = context.label;
            const investment = investmentBreakdown.find(inv => inv.name === investmentName);
            return investment ? `Category: ${investment.category}` : '';
          },
        },
      },
    },
    cutout: '50%',
    animation: {
      animateRotate: true,
      duration: 750,
    },
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent to-chart-2"></div>
            Investment Allocation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio distribution by investment type
          </p>
        </div>

        {/* Total Investment Value */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground/70 uppercase tracking-wider">Total Invested</div>
          <div className="text-xl font-bold text-chart-2 tabular-nums mt-1">
            {formatCurrency(totalInvestments)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Container */}
        <div className="relative h-72">
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        {/* Investment Breakdown List */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Investment Breakdown</div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {investmentBreakdown.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ backgroundColor: investment.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {investment.name}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      {investment.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground tabular-nums">
                    {formatCurrencyShort(investment.value)}
                  </div>
                  <div className="text-xs text-muted-foreground/70 tabular-nums">
                    {investment.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Class Distribution with expected returns */}
      <div className="mt-6 p-4 glass rounded-xl border border-chart-2/20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-chart-2">Asset Class Distribution</div>
          {weightedReturn !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/70">Weighted Return</span>
              <span className="text-lg font-bold text-primary tabular-nums">
                {weightedReturn.value.toFixed(1)}%
              </span>
              {weightedReturn.coveredWeight < 0.999 && (
                <span className="text-xs text-muted-foreground/50">
                  ({(weightedReturn.coveredWeight * 100).toFixed(0)}% covered)
                </span>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {assetClassBreakdown.map((assetClass, index) => (
            <div key={index} className="p-3 glass rounded-lg space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: assetClass.color }} />
                <div className="text-xs font-medium text-foreground truncate">{assetClass.name}</div>
              </div>
              <div className="text-sm font-bold text-foreground tabular-nums">
                {assetClass.percentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground/50 tabular-nums">
                {formatCurrencyShort(assetClass.value)}
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="—"
                  value={expectedReturns[assetClass.name] ?? ''}
                  onChange={e => setExpectedReturns(prev => ({ ...prev, [assetClass.name]: e.target.value }))}
                  className="w-full text-xs text-right bg-transparent border border-border/40 rounded px-1.5 py-0.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 tabular-nums"
                />
                <span className="text-xs text-muted-foreground/50 flex-shrink-0">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diversification Insights */}
      <div className="mt-4 p-4 glass rounded-xl border border-primary/20">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-primary mb-2">Portfolio Insights</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-primary/70">•</span>
                <span>{investmentBreakdown.length} different investment types</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary/70">•</span>
                <span>{assetClassBreakdown.length} asset classes represented</span>
              </div>
              {investmentBreakdown.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">•</span>
                  <span>Largest allocation: {investmentBreakdown[0].name} ({investmentBreakdown[0].percentage.toFixed(1)}%)</span>
                </div>
              )}
              {investmentBreakdown.length >= 5 ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">•</span>
                  <span>Well diversified portfolio ✓</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">•</span>
                  <span>Consider diversifying across more investment types</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-6 pt-4 border-t border-border/30 text-xs text-muted-foreground/60 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>💡 Click segments to highlight details</span>
          <span className="text-muted-foreground/30">•</span>
          <span>📊 Based on latest month data</span>
          <span className="text-muted-foreground/30">•</span>
          <span>🎯 Review allocation quarterly</span>
        </div>
      </div>
    </div>
  );
};
