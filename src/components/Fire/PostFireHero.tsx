// PostFireHero - Celebratory, high-prestige hero section for users who have attained FIRE

'use client';

import React from 'react';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { Sparkles, ShieldCheck, TrendingUp, Infinity as InfinityIcon, Award, DollarSign } from 'lucide-react';

interface PostFireHeroProps {
  calculation: FireCalculationResult;
  onSwitchMode?: () => void;
  isAccumulationMode: boolean;
}

export const PostFireHero: React.FC<PostFireHeroProps> = ({
  calculation,
  onSwitchMode,
  isAccumulationMode,
}) => {
  const { postFireAnalytics, parameters } = calculation;
  const {
    freedomRatio,
    guiltFreeMonthlyAllowance,
    netAnnualGrowthAmount,
    generationalWealth30y,
    generationalWealthReal30y,
    perpetualRunway,
  } = postFireAnalytics;

  const fundingPercent = Math.round(freedomRatio * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 md:p-10 shadow-sm">
      {/* Background radial ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      {/* Top Banner Row */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/60">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 border border-primary/30 shadow-inner">
            <Award className="h-7 w-7 text-primary" />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="h-3 w-3" />
                Financial Independence Attained
              </span>
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                {fundingPercent}% Lifestyle Funded
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-1 font-display"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Living in Financial Freedom
            </h1>
          </div>
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

      {/* Main Quote / Status Message */}
      <div className="relative mt-6 mb-8 max-w-3xl">
        <p className="text-base sm:text-lg text-foreground/90 font-sans leading-relaxed">
          Your investment portfolio of{' '}
          <span className="font-semibold text-foreground font-mono">
            {formatCurrency(parameters.currentPortfolio)}
          </span>{' '}
          fully supports your lifestyle with a{' '}
          <span className="text-primary font-semibold">
            {fundingPercent >= 100 ? `${fundingPercent}% safety buffer` : 'near-complete buffer'}
          </span>
          . Your capital generates more passive wealth every year than your living expenses consume.
        </p>
      </div>

      {/* 4 Core Freedom Metric Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Guilt-Free Monthly Allowance */}
        <div className="glass-card rounded-2xl p-5 hover-lift relative overflow-hidden border-t-2 border-t-primary/70">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Monthly Safe Allowance</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrency(guiltFreeMonthlyAllowance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
            Guilt-free spending at {parameters.safeWithdrawalRate}% SWR
          </p>
        </div>

        {/* Metric 2: Net Annual Wealth Expansion */}
        <div className="glass-card rounded-2xl p-5 hover-lift relative overflow-hidden border-t-2 border-t-accent/70">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Net Annual Growth</span>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            +{formatCurrencyShort(netAnnualGrowthAmount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
            Surplus reinvested after all expenses
          </p>
        </div>

        {/* Metric 3: Freedom Runway */}
        <div className="glass-card rounded-2xl p-5 hover-lift relative overflow-hidden border-t-2 border-t-chart-2/70">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Financial Runway</span>
            <InfinityIcon className="h-4 w-4 text-chart-2" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight flex items-center gap-2">
            <span>{perpetualRunway ? 'Perpetual' : '30+ Years'}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-2 inline-block" />
            Self-sustaining perpetual capital
          </p>
        </div>

        {/* Metric 4: 30-Year Generational Legacy */}
        <div className="glass-card rounded-2xl p-5 hover-lift relative overflow-hidden border-t-2 border-t-chart-4/70">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
            <span>Generational Legacy (30y)</span>
            <ShieldCheck className="h-4 w-4 text-chart-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrencyShort(generationalWealth30y)}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-4 inline-block" />
            Real value: {formatCurrencyShort(generationalWealthReal30y)}
          </p>
        </div>
      </div>
    </div>
  );
};
