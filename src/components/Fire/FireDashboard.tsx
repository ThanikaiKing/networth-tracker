// FireDashboard - Master container component orchestrating live data and FIRE features

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNetWorthData } from '@/hooks/useNetWorthData';
import { calculateInvestmentAnalytics } from '@/lib/analytics';
import { FireParameters } from '@/lib/fireTypes';
import { calculateFire } from '@/lib/fireCalculator';
import { PostFireHero } from './PostFireHero';
import { PostFireGrowthChart } from './PostFireGrowthChart';
import { PostFireFreedomMetrics } from './PostFireFreedomMetrics';
import { PostFireStressTest } from './PostFireStressTest';
import { FireHero } from './FireHero';
import { FireChart } from './FireChart';
import { FireControls } from './FireControls';
import { FireMilestones } from './FireMilestones';
import { WifeReassuranceSection } from './WifeReassuranceSection';
import { SkeletonChart } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorBoundary';

export const FireDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useNetWorthData('all');

  // Calculate live total investment value
  const liveTotalInvestmentValue = useMemo(() => {
    if (!data || !data.entries || data.entries.length === 0) return 0;
    const analytics = calculateInvestmentAnalytics(data.entries);
    if (analytics && analytics.totalInvestmentValue > 0) {
      return analytics.totalInvestmentValue;
    }
    const lastEntry = data.entries[data.entries.length - 1];
    return lastEntry?.investments?.subtotal || 0;
  }, [data]);

  // Initial parameters
  const [parameters, setParameters] = useState<FireParameters>({
    currentPortfolio: 0,
    monthlyExpense: 30000,
    yearlyExpense: 400000,
    expectedAnnualReturn: 13.0,
    inflationRate: 6.0,
    safeWithdrawalRate: 4.0,
    currentAge: 30,
    targetRetirementAge: 45,
    monthlySavings: 50000,
    annualSavingsStepUp: 10.0,
  });

  const [hasInitializedWithLive, setHasInitializedWithLive] = useState(false);
  const [isAccumulationMode, setIsAccumulationMode] = useState(false);

  // Sync initial portfolio with live investment value once fetched
  useEffect(() => {
    if (liveTotalInvestmentValue > 0 && !hasInitializedWithLive) {
      setParameters((prev) => ({
        ...prev,
        currentPortfolio: liveTotalInvestmentValue,
      }));
      setHasInitializedWithLive(true);
    }
  }, [liveTotalInvestmentValue, hasInitializedWithLive]);

  // Execute pure FIRE math engine
  const calculation = useMemo(() => {
    return calculateFire(parameters);
  }, [parameters]);

  if (loading && !hasInitializedWithLive) {
    return (
      <div className="space-y-8 animate-fade-up">
        <div className="h-48 rounded-3xl bg-muted/40 animate-pulse border border-border" />
        <SkeletonChart className="h-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-muted/30 animate-pulse border border-border" />
          <div className="h-64 rounded-3xl bg-muted/30 animate-pulse border border-border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        className="max-w-2xl mx-auto my-12"
      />
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Dynamic Hero Section */}
      {!isAccumulationMode ? (
        <PostFireHero
          calculation={calculation}
          onSwitchMode={() => setIsAccumulationMode(!isAccumulationMode)}
          isAccumulationMode={isAccumulationMode}
        />
      ) : (
        <FireHero
          calculation={calculation}
          onSwitchMode={() => setIsAccumulationMode(!isAccumulationMode)}
          isAccumulationMode={isAccumulationMode}
        />
      )}

      {/* Main Visual Chart */}
      {!isAccumulationMode ? (
        <PostFireGrowthChart calculation={calculation} />
      ) : (
        <FireChart calculation={calculation} />
      )}

      {/* Post-FIRE Freedom Metrics (Simulator & Surplus Engine) */}
      <PostFireFreedomMetrics calculation={calculation} />

      {/* Market Crash & Anti-Fragility Stress-Test */}
      <PostFireStressTest calculation={calculation} />

      {/* 5-Tier Milestone Spectrum */}
      <FireMilestones calculation={calculation} />

      {/* Dynamic Variable Knobs */}
      <FireControls
        parameters={parameters}
        onParametersChange={setParameters}
        liveTotalInvestmentValue={liveTotalInvestmentValue}
      />

      {/* Humorous Wife Reassurance Section */}
      <WifeReassuranceSection
        parameters={parameters}
        calculation={calculation}
      />
    </div>
  );
};
