// PostFireFreedomMetrics - Freedom Surplus Engine and Lifestyle Upgrade Simulator

'use client';

import React, { useState } from 'react';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { Sliders, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface PostFireFreedomMetricsProps {
  calculation: FireCalculationResult;
}

export const PostFireFreedomMetrics: React.FC<PostFireFreedomMetricsProps> = ({ calculation }) => {
  const { parameters, postFireAnalytics } = calculation;
  const { currentPortfolio, expectedAnnualReturn, monthlyExpense } = parameters;
  const { reinvestmentRatePercent, netRealSurplusRate } = postFireAnalytics;

  // State for Lifestyle Upgrade Simulator (+ ₹ per month)
  const [upgradeAddMonthly, setUpgradeAddMonthly] = useState<number>(0);

  const upgradedMonthlyExpense = monthlyExpense + upgradeAddMonthly;
  const upgradedYearlyExpense = upgradedMonthlyExpense * 12;
  const upgradedWithdrawalRate =
    currentPortfolio > 0 ? (upgradedYearlyExpense / currentPortfolio) * 100 : 0;
  const isUpgradeSafe = upgradedWithdrawalRate <= 5.0;

  const upgradedAnnualSurplus =
    currentPortfolio * (expectedAnnualReturn / 100) - upgradedYearlyExpense;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Lifestyle Upgrade Simulator */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-accent/15 text-accent">
                <Sliders className="h-5 w-5" />
              </span>
              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-foreground font-display"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Lifestyle Upgrade Simulator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Simulate luxury spending increases to test portfolio resilience
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                isUpgradeSafe
                  ? 'bg-primary/15 text-primary border border-primary/25'
                  : 'bg-destructive/15 text-destructive border border-destructive/25'
              }`}
            >
              {isUpgradeSafe ? 'Safe & Sustainable' : 'Stretches Buffer'}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Wondering if you can afford that luxury vacation, car upgrade, or bigger home?
            Slide to see how increasing your monthly lifestyle budget impacts your wealth engine.
          </p>

          {/* Slider for monthly upgrade */}
          <div className="space-y-3 mb-6 bg-secondary/30 p-4 rounded-2xl border border-border/70">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-muted-foreground">Additional Monthly Spend:</span>
              <span className="font-mono font-bold text-accent text-base">
                +{formatCurrency(upgradeAddMonthly)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={5000}
              value={upgradeAddMonthly}
              onChange={(e) => setUpgradeAddMonthly(Number(e.target.value))}
              className="w-full accent-accent h-2 bg-muted rounded-lg cursor-pointer"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[0, 15000, 30000, 50000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setUpgradeAddMonthly(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    upgradeAddMonthly === preset
                      ? 'bg-accent text-accent-foreground font-bold shadow-xs'
                      : 'bg-muted/70 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {preset === 0 ? 'Current Baseline' : `+${formatCurrencyShort(preset)}/mo`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Outcome Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/70">
          <div className="p-3 rounded-xl bg-card border border-border/60">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
              Total Monthly Budget
            </span>
            <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
              {formatCurrency(upgradedMonthlyExpense)}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Effective SWR: {upgradedWithdrawalRate.toFixed(2)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/60">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
              Net Wealth Surplus After Spending
            </span>
            <span
              className={`text-lg font-bold font-mono mt-0.5 block ${
                upgradedAnnualSurplus >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            >
              {upgradedAnnualSurplus >= 0 ? '+' : ''}
              {formatCurrencyShort(upgradedAnnualSurplus)}/yr
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {upgradedAnnualSurplus >= 0 ? 'Portfolio continues growing' : 'Consuming capital'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: The Freedom Surplus Engine */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-primary/15 text-primary">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h3
                className="text-lg sm:text-xl font-semibold text-foreground font-display"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The Freedom Surplus Engine
              </h3>
              <p className="text-xs text-muted-foreground">
                How every rupee of portfolio return is distributed
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Unlike an active salary where 100% of your time is traded for income, your invested corpus
            generates a continuous compounding dividend. Here is how your wealth engine is currently
            allocating annual returns:
          </p>

          {/* Visual Distribution Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent inline-block" />
                Lifestyle Spending ({((100 - reinvestmentRatePercent)).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
                Reinvested Surplus ({reinvestmentRatePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                className="bg-accent transition-all duration-500"
                style={{ width: `${Math.max(5, 100 - reinvestmentRatePercent)}%` }}
              />
              <div
                className="bg-primary transition-all duration-500"
                style={{ width: `${Math.min(95, reinvestmentRatePercent)}%` }}
              />
            </div>
          </div>

          {/* Psychological & Wealth Principles */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-foreground">Anti-Depletion Guarantee: </span>
                <span className="text-muted-foreground">
                  With a real return surplus rate of +{netRealSurplusRate}%, your money is statistically
                  impossible to run out across a normal lifespan.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-foreground">Generational Compounding: </span>
                <span className="text-muted-foreground">
                  Every year you spend normally, your portfolio compounds an extra{' '}
                  <span className="font-mono font-medium text-foreground">
                    +{formatCurrencyShort(postFireAnalytics.netAnnualGrowthAmount)}
                  </span>{' '}
                  into long-term family wealth.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer stat */}
        <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
          <span>Target SWR Multiplier: {calculation.swrMultiplier}x Expenses</span>
          <span className="font-mono font-medium text-foreground">
            Current Buffer: {(calculation.currentProgressPercentage).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
