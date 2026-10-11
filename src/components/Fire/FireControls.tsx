// FireControls - Dynamic interactive control panel with sliders, presets, and synchronized inputs

'use client';

import React, { useState } from 'react';
import { FireParameters } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { RotateCcw, Sliders, Calendar, Percent, Wallet, DollarSign } from 'lucide-react';

interface FireControlsProps {
  parameters: FireParameters;
  onParametersChange: (newParams: FireParameters) => void;
  liveTotalInvestmentValue: number;
}

export const FireControls: React.FC<FireControlsProps> = ({
  parameters,
  onParametersChange,
  liveTotalInvestmentValue,
}) => {
  // Expense mode: 'monthly' or 'yearly'
  const [expenseMode, setExpenseMode] = useState<'monthly' | 'yearly'>('monthly');

  const isCustomPortfolio = parameters.currentPortfolio !== liveTotalInvestmentValue;

  const handleMonthlyExpenseChange = (amount: number) => {
    const validAmount = Math.max(0, amount);
    onParametersChange({
      ...parameters,
      monthlyExpense: validAmount,
      yearlyExpense: validAmount * 12,
    });
  };

  const handleYearlyExpenseChange = (amount: number) => {
    const validAmount = Math.max(0, amount);
    onParametersChange({
      ...parameters,
      yearlyExpense: validAmount,
      monthlyExpense: Math.round(validAmount / 12),
    });
  };

  const handlePortfolioChange = (amount: number) => {
    onParametersChange({
      ...parameters,
      currentPortfolio: Math.max(0, amount),
    });
  };

  const handleResetToLive = () => {
    onParametersChange({
      ...parameters,
      currentPortfolio: liveTotalInvestmentValue,
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sliders className="h-5 w-5" />
          </span>
          <div>
            <h2
              className="text-xl font-semibold text-foreground font-display"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Interactive Variable Knobs
            </h2>
            <p className="text-xs text-muted-foreground">
              Adjust parameters in real time to simulate different financial scenarios
            </p>
          </div>
        </div>

        {isCustomPortfolio && (
          <button
            onClick={handleResetToLive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent/15 text-accent hover:bg-accent/25 transition-all self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Live Portfolio ({formatCurrencyShort(liveTotalInvestmentValue)})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Knob 1: Current Portfolio */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              Starting Portfolio
            </label>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isCustomPortfolio
                  ? 'bg-accent/20 text-accent font-semibold'
                  : 'bg-primary/15 text-primary font-medium'
              }`}
            >
              {isCustomPortfolio ? 'Custom Value' : 'Live Sync'}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
              ₹
            </span>
            <input
              type="number"
              value={parameters.currentPortfolio || ''}
              onChange={(e) => handlePortfolioChange(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="0"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Live Investments:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(liveTotalInvestmentValue)}
            </span>
          </div>
        </div>

        {/* Knob 2: Lifestyle Expenses (Synchronized Monthly/Yearly) */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-accent" />
              Living Expenses
            </label>
            {/* Monthly / Yearly Toggle */}
            <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                onClick={() => setExpenseMode('monthly')}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                  expenseMode === 'monthly'
                    ? 'bg-card text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setExpenseMode('yearly')}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                  expenseMode === 'yearly'
                    ? 'bg-card text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
              ₹
            </span>
            {expenseMode === 'monthly' ? (
              <input
                type="number"
                value={parameters.monthlyExpense || ''}
                onChange={(e) => handleMonthlyExpenseChange(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            ) : (
              <input
                type="number"
                value={parameters.yearlyExpense || ''}
                onChange={(e) => handleYearlyExpenseChange(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
          </div>

          {/* Corresponding other period indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {expenseMode === 'monthly' ? 'Annual Total:' : 'Monthly Equivalent:'}
            </span>
            <span className="font-mono font-medium text-foreground">
              {expenseMode === 'monthly'
                ? formatCurrency(parameters.yearlyExpense)
                : `${formatCurrency(parameters.monthlyExpense)}/mo`}
            </span>
          </div>
        </div>

        {/* Knob 3: Safe Withdrawal Rate (SWR) */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-chart-2" />
              Safe Withdrawal Rate (SWR)
            </label>
            <span className="text-xs font-mono font-bold text-chart-2">
              {parameters.safeWithdrawalRate.toFixed(2)}% ({Math.round(100 / parameters.safeWithdrawalRate)}x Rule)
            </span>
          </div>

          <input
            type="range"
            min={2.5}
            max={5.0}
            step={0.1}
            value={parameters.safeWithdrawalRate}
            onChange={(e) =>
              onParametersChange({
                ...parameters,
                safeWithdrawalRate: parseFloat(e.target.value),
              })
            }
            className="w-full accent-chart-2 h-2 bg-muted rounded-lg cursor-pointer"
          />

          <div className="flex justify-between gap-1 pt-1">
            {[
              { label: '40x (2.5%)', val: 2.5 },
              { label: '30x (3.3%)', val: 3.33 },
              { label: '25x (4.0%)', val: 4.0 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() =>
                  onParametersChange({
                    ...parameters,
                    safeWithdrawalRate: p.val,
                  })
                }
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                  Math.abs(parameters.safeWithdrawalRate - p.val) < 0.1
                    ? 'bg-chart-2 text-white font-bold'
                    : 'bg-muted/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Knob 4: Expected Annual Return */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-primary" />
              Expected Annual Return
            </label>
            <span className="text-xs font-mono font-bold text-primary">
              {parameters.expectedAnnualReturn.toFixed(1)}%
            </span>
          </div>

          <input
            type="range"
            min={6.0}
            max={18.0}
            step={0.5}
            value={parameters.expectedAnnualReturn}
            onChange={(e) =>
              onParametersChange({
                ...parameters,
                expectedAnnualReturn: parseFloat(e.target.value),
              })
            }
            className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
          />

          <div className="flex justify-between gap-1 pt-1">
            {[
              { label: 'Conservative (10%)', val: 10.0 },
              { label: 'Standard (13%)', val: 13.0 },
              { label: 'Aggressive (15%)', val: 15.0 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() =>
                  onParametersChange({
                    ...parameters,
                    expectedAnnualReturn: p.val,
                  })
                }
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                  parameters.expectedAnnualReturn === p.val
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-muted/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Knob 5: Expected Inflation Rate */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-accent" />
              Inflation Rate
            </label>
            <span className="text-xs font-mono font-bold text-accent">
              {parameters.inflationRate.toFixed(1)}%
            </span>
          </div>

          <input
            type="range"
            min={3.0}
            max={10.0}
            step={0.5}
            value={parameters.inflationRate}
            onChange={(e) =>
              onParametersChange({
                ...parameters,
                inflationRate: parseFloat(e.target.value),
              })
            }
            className="w-full accent-accent h-2 bg-muted rounded-lg cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>Real Net Return:</span>
            <span className="font-mono font-bold text-foreground">
              {(((1 + parameters.expectedAnnualReturn / 100) / (1 + parameters.inflationRate / 100) - 1) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Knob 6: Age Horizons & Savings */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-secondary/30 border border-border/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-chart-4" />
              Current Age / Horizon
            </label>
            <span className="text-xs font-mono font-bold text-chart-4">
              Age {parameters.currentAge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Age:</span>
            <input
              type="range"
              min={20}
              max={70}
              value={parameters.currentAge}
              onChange={(e) =>
                onParametersChange({
                  ...parameters,
                  currentAge: parseInt(e.target.value),
                })
              }
              className="w-full accent-chart-4 h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>Target Horizon Age:</span>
            <span className="font-mono font-medium text-foreground">
              Age {parameters.targetRetirementAge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
