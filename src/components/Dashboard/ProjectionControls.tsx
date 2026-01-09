// ProjectionControls component for adjusting projection parameters

'use client';

import React from 'react';
import { ProjectionControlsProps } from '@/lib/types';

export const ProjectionControls: React.FC<ProjectionControlsProps> = ({
  projectionYears,
  onProjectionChange,
  parameters,
  onParametersChange,
  minYears = 1,
  maxYears = 50,
}) => {
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minYears && value <= maxYears) {
      onProjectionChange(value);
    }
  };

  const handleInflationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 20) {
      onParametersChange({ ...parameters, annualInflationRate: value });
    }
  };

  // Quick select buttons for common projection periods
  const quickSelectYears = [5, 10, 20, 30];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Projection Years Control */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Projection Period
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick select buttons */}
            <div className="flex gap-2">
              {quickSelectYears.map((year) => (
                <button
                  key={year}
                  onClick={() => onProjectionChange(year)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    projectionYears === year
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                      : 'glass text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {year}Y
                </button>
              ))}
            </div>
            
            {/* Custom input */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground/60 text-sm">or</span>
              <div className="relative">
                <input
                  type="number"
                  value={projectionYears}
                  onChange={handleYearsChange}
                  min={minYears}
                  max={maxYears}
                  className="w-20 px-3 py-2 glass rounded-lg text-foreground text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60">yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inflation Rate Control */}
        <div className="lg:w-72">
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Inflation Rate
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              value={parameters.annualInflationRate}
              onChange={handleInflationChange}
              min={0}
              max={15}
              step={0.5}
              className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-chart-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-chart-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-chart-4/30"
            />
            <div className="glass px-3 py-2 rounded-lg min-w-[4rem] text-center">
              <span className="text-sm font-medium text-foreground tabular-nums">{parameters.annualInflationRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span>Projections update in real-time</span>
        </div>
        <span className="tabular-nums">Range: {minYears}–{maxYears} years</span>
      </div>
    </div>
  );
};
