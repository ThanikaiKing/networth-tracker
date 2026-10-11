// PostFireStressTest - Anti-fragility & recession resilience stress testing

'use client';

import React from 'react';
import { FireCalculationResult } from '@/lib/fireTypes';
import { formatCurrencyShort } from '@/lib/utils';
import { ShieldCheck, Activity } from 'lucide-react';

interface PostFireStressTestProps {
  calculation: FireCalculationResult;
}

export const PostFireStressTest: React.FC<PostFireStressTestProps> = ({ calculation }) => {
  const { postFireAnalytics } = calculation;
  const { stressTest25Percent, stressTest40Percent } = postFireAnalytics;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Activity className="h-4 w-4" />
            <span>Anti-Fragility Analysis</span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-semibold text-foreground mt-0.5 font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Market Crash & Recession Resilience Stress-Test
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Simulating extreme market drawdowns to ensure your lifestyle withdrawals never trigger capital exhaustion.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4" />
          <span>Anti-Fragile Portfolio</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario 1: -25% Correction */}
        <div className="rounded-2xl border border-border/80 bg-secondary/20 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Scenario A: Market Correction (-25%)
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Drop: -25%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-card border border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  Post-Crash Portfolio
                </span>
                <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
                  {formatCurrencyShort(stressTest25Percent.postDropPortfolio)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  New Withdrawal Rate
                </span>
                <span className="text-lg font-bold font-mono text-accent mt-0.5 block">
                  {stressTest25Percent.newWithdrawalRate.toFixed(2)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {stressTest25Percent.safetyMessage}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Historical Rebound Time:</span>
            <span className="font-semibold text-foreground font-mono">
              ~{stressTest25Percent.reboundYearsEstimate} Years
            </span>
          </div>
        </div>

        {/* Scenario 2: -40% Severe Recession */}
        <div className="rounded-2xl border border-border/80 bg-secondary/20 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-4" />
                Scenario B: Severe Recession Crash (-40%)
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Drop: -40%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-card border border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  Post-Crash Portfolio
                </span>
                <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
                  {formatCurrencyShort(stressTest40Percent.postDropPortfolio)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  New Withdrawal Rate
                </span>
                <span
                  className={`text-lg font-bold font-mono mt-0.5 block ${
                    stressTest40Percent.isStillSafe ? 'text-accent' : 'text-destructive'
                  }`}
                >
                  {stressTest40Percent.newWithdrawalRate.toFixed(2)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {stressTest40Percent.safetyMessage}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Historical Rebound Time:</span>
            <span className="font-semibold text-foreground font-mono">
              ~{stressTest40Percent.reboundYearsEstimate} Years
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
