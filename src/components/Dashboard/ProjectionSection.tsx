// Main ProjectionSection container component that orchestrates all projection components

'use client';

import React, { useState } from 'react';
import { ProjectionSectionProps, ProjectionParameters } from '@/lib/types';
import { useProjectionData } from '@/hooks/useProjectionData';
import { ProjectionControls } from './ProjectionControls';
import { ProjectionChart } from './ProjectionChart';
import { ChartSection } from './ChartGrid';

export const ProjectionSection: React.FC<ProjectionSectionProps> = ({ data, isLoading }) => {
  // State for projection settings - removed scenario selection as all are shown
  const [projectionYears, setProjectionYears] = useState(10);
  const [parameters, setParameters] = useState<ProjectionParameters>({
    annualInflationRate: 6.0   // Default inflation rate for India
  });

  // Get projection data using custom hook
  const { projectionResult, validationError, isValidData } = useProjectionData(
    data, 
    projectionYears, 
    parameters
  );

  // Handle validation errors
  if (!isLoading && validationError) {
    return (
      <ChartSection 
        title="Net Worth Projection" 
        description="Future net worth projections based on historical growth patterns"
        className="mb-8"
      >
        <div className="glass-card rounded-2xl p-6 border border-chart-4/30">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-chart-4/10">
              <svg className="h-6 w-6 text-chart-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-chart-4">
                Projection Unavailable
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{validationError}</p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Add more historical data points to enable reliable projections.
              </p>
            </div>
          </div>
        </div>
      </ChartSection>
    );
  }

  return (
    <ChartSection 
      title="Net Worth Projection" 
      description="Future net worth projections based on historical growth patterns and your savings plan"
      className="mb-8"
    >
      <div className="space-y-6">
        {/* Controls Section */}
        <ProjectionControls
          projectionYears={projectionYears}
          onProjectionChange={setProjectionYears}
          parameters={parameters}
          onParametersChange={setParameters}
          minYears={1}
          maxYears={50}
        />
        
        {/* Chart Section - Shows all 3 scenarios */}
        <ProjectionChart
          data={data}
          projectionResult={projectionResult}
          isLoading={isLoading}
        />
        
        {/* Scenario Summary Cards */}
        {isValidData && projectionResult && (
          <div className="glass-card rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-chart-5 to-chart-4"></div>
              Scenario Comparison at {projectionYears} Year{projectionYears !== 1 ? 's' : ''}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectionResult.scenarios.map((scenario) => {
                const finalValue = scenario.data[scenario.data.length - 1]?.y || 0;
                const totalGrowth = finalValue - projectionResult.summary.currentNetWorth;
                
                const scenarioStyles = {
                  conservative: {
                    gradient: 'from-chart-5/20 to-transparent',
                    border: 'border-chart-5/30',
                    text: 'text-chart-5',
                    dot: 'bg-chart-5'
                  },
                  moderate: {
                    gradient: 'from-chart-4/20 to-transparent',
                    border: 'border-chart-4/30',
                    text: 'text-chart-4',
                    dot: 'bg-chart-4'
                  },
                  aggressive: {
                    gradient: 'from-primary/20 to-transparent',
                    border: 'border-primary/30',
                    text: 'text-primary',
                    dot: 'bg-primary'
                  }
                };
                
                const style = scenarioStyles[scenario.name];

                return (
                  <div 
                    key={scenario.name}
                    className={`glass rounded-xl p-5 border-2 ${style.border} hover-lift relative overflow-hidden group`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className={`text-sm font-medium capitalize ${style.text}`}>{scenario.name}</h5>
                        <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                      </div>
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                          notation: 'compact',
                        }).format(finalValue)}
                      </p>
                      <p className={`text-xs mt-1 tabular-nums ${totalGrowth > 0 ? 'text-primary' : 'text-destructive'}`}>
                        {totalGrowth > 0 ? '+' : ''}{((totalGrowth / projectionResult.summary.currentNetWorth) * 100).toFixed(1)}% growth
                      </p>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium glass ${style.text}`}>
                          {scenario.confidenceLevel}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Methodology Explanation */}
        <div className="glass-card rounded-2xl p-6 border border-chart-2/30">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-chart-2/10">
              <svg className="h-6 w-6 text-chart-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-chart-2 mb-3">
                How Projections Work
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-chart-2">•</span>
                  <strong className="text-foreground/80">Historical Analysis:</strong> 
                  <span>Based on your {data.length} months of net worth data</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-chart-2">•</span>
                  <strong className="text-foreground/80">Inflation Adjustment:</strong> 
                  <span>Accounts for <span className="tabular-nums">{parameters.annualInflationRate}%</span> annual inflation</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-chart-2">•</span>
                  <strong className="text-foreground/80">Savings Integration:</strong> 
                  <span>Includes monthly contributions with 10% annual step-up</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-chart-2 mt-0.5">•</span>
                  <span>
                    <strong className="text-foreground/80">Three Scenarios:</strong>{' '}
                    <span className="text-chart-5">Conservative (70%)</span>,{' '}
                    <span className="text-chart-4">Moderate (100%)</span>,{' '}
                    <span className="text-primary">Aggressive (130%)</span> of historical growth
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/60 pt-3 border-t border-border/30 mt-3">
                  <em>Projections are estimates based on historical patterns. Actual results may vary due to market conditions and life events.</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartSection>
  );
};
