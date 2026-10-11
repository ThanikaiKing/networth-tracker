// FireMilestones - Multi-tier FIRE milestones breakdown

'use client';

import React from 'react';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { CheckCircle2, Target, Shield, Coffee, Award, Crown } from 'lucide-react';

interface FireMilestonesProps {
  calculation: FireCalculationResult;
}

export const FireMilestones: React.FC<FireMilestonesProps> = ({ calculation }) => {
  const { milestones, currentMonthlyPassiveIncome } = calculation;

  const getTierIcon = (type: string) => {
    switch (type) {
      case 'coast':
        return <Shield className="h-5 w-5 text-chart-2" />;
      case 'barista':
        return <Coffee className="h-5 w-5 text-accent" />;
      case 'lean':
        return <Target className="h-5 w-5 text-primary" />;
      case 'standard':
        return <Award className="h-5 w-5 text-primary" />;
      case 'fat':
        return <Crown className="h-5 w-5 text-chart-4" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2
            className="text-xl sm:text-2xl font-semibold text-foreground font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FIRE Milestone Tiers
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Progress across financial independence archetypes, from essential security to luxury freedom.
          </p>
        </div>

        <div className="text-xs text-muted-foreground self-start sm:self-auto font-mono bg-secondary/50 px-3 py-1.5 rounded-xl border border-border">
          Current Passive Yield: <span className="text-foreground font-bold">{formatCurrency(currentMonthlyPassiveIncome)}/mo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {milestones.map((m) => {
          const isFull = m.progressPercentage >= 100;

          return (
            <div
              key={m.type}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${isFull
                ? 'bg-gradient-to-b from-primary/10 to-transparent border-primary/30 shadow-xs'
                : 'bg-card border-border/80'
                }`}
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-secondary/60">
                    {getTierIcon(m.type)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isFull
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {isFull && <CheckCircle2 className="h-3 w-3" />}
                    {m.badgeLabel}
                  </span>
                </div>

                <h3 className="font-semibold text-base text-foreground font-sans">
                  {m.title}
                </h3>
                <p className="text-[11px] text-muted-foreground/90 mt-0.5 leading-tight min-h-[28px]">
                  {m.tagline}
                </p>

                {/* Target Number */}
                <div className="my-4">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block">
                    Target Corpus
                  </span>
                  <div
                    className="text-xl font-bold font-mono text-foreground mt-0.5"
                    title={formatCurrency(m.targetCorpus)}
                  >
                    {formatCurrencyShort(m.targetCorpus)}
                  </div>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    {formatCurrency(m.monthlyExpense)}/mo
                  </span>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                  <span>Funded</span>
                  <span className="font-bold text-foreground">
                    {m.progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${isFull ? 'bg-primary' : 'bg-chart-2'
                      }`}
                    style={{ width: `${Math.min(100, m.progressPercentage)}%` }}
                  />
                </div>

                <div className="text-[10px] text-muted-foreground mt-2 font-mono text-right">
                  {isFull ? (
                    <span className="text-primary font-medium">
                      +{formatCurrencyShort(m.surplusOrDeficit)} surplus
                    </span>
                  ) : (
                    <span>
                      {formatCurrencyShort(Math.abs(m.surplusOrDeficit))} to go
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
