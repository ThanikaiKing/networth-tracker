// FireHero - Horizon & accumulation overview hero

'use client';

import React from 'react';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { Calendar, Target, DollarSign, ArrowUpRight } from 'lucide-react';

interface FireHeroProps {
  calculation: FireCalculationResult;
  onSwitchMode?: () => void;
  isAccumulationMode: boolean;
}

export const FireHero: React.FC<FireHeroProps> = ({
  calculation,
  onSwitchMode,
  isAccumulationMode,
}) => {
  const {
    standardFireNumber,
    currentProgressPercentage,
    currentMonthlyPassiveIncome,
    yearsToFire,
    projectedFireDate,
    projectedFireAge,
    isFireAchieved,
    parameters,
  } = calculation;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 md:p-10 shadow-sm">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-chart-2/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Top Banner Row */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chart-2/15 text-chart-2 border border-chart-2/25">
              <Target className="h-3 w-3" />
              FIRE Horizon Analysis
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {(currentProgressPercentage).toFixed(1)}% Completed
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-1 font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isFireAchieved
              ? 'Freedom Target Reached'
              : `Freedom Horizon: ${yearsToFire} Years`}
          </h1>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-muted/50 p-1 rounded-xl border border-border">
          <button
            onClick={() => onSwitchMode && isAccumulationMode && onSwitchMode()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isAccumulationMode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Freedom Celebration
          </button>
          <button
            onClick={() => onSwitchMode && !isAccumulationMode && onSwitchMode()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isAccumulationMode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Horizon Trajectory
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="relative mt-6 mb-8 max-w-3xl">
        <p className="text-base sm:text-lg text-foreground/90 font-sans leading-relaxed">
          {isFireAchieved ? (
            <span>
              Congratulations! Your current investment portfolio has surpassed your Standard FIRE threshold of{' '}
              <span className="font-semibold text-foreground font-mono">
                {formatCurrency(standardFireNumber)}
              </span>
              . You have achieved full financial sovereignty.
            </span>
          ) : (
            <span>
              At your current trajectory and parameters, your portfolio is on track to cross your FIRE target in{' '}
              <span className="font-semibold text-foreground">
                {projectedFireDate} (Age {projectedFireAge})
              </span>
              .
            </span>
          )}
        </p>
      </div>

      {/* 4 Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Standard FIRE Target</span>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrencyShort(standardFireNumber)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {calculation.swrMultiplier}x annual expenses
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Current Portfolio</span>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrencyShort(parameters.currentPortfolio)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(currentProgressPercentage).toFixed(1)}% of target
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Monthly Passive Income</span>
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrency(currentMonthlyPassiveIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Generated right now at {parameters.safeWithdrawalRate}% SWR
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Projected FIRE Date</span>
            <Calendar className="h-4 w-4 text-chart-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {isFireAchieved ? 'Achieved' : projectedFireDate}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isFireAchieved ? 'Living in Freedom' : `At Age ${projectedFireAge}`}
          </p>
        </div>
      </div>
    </div>
  );
};
