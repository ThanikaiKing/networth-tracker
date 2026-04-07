'use client';

import React from 'react';
import { PeriodSelectorProps, TimePeriod } from '@/lib/types';
import { cn } from '@/lib/utils';

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'all',      label: 'All Time' },
  { value: '6months',  label: '6 Months' },
  { value: '3months',  label: '3 Months' },
  { value: '1month',   label: '1 Month'  },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
}) => {
  const filteredOptions = PERIOD_OPTIONS.filter(o => availablePeriods.includes(o.value));

  return (
    <div className="period-tab-bar">
      {filteredOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            'period-tab focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            selectedPeriod === option.value && 'active'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Mobile dropdown
export const PeriodSelectorDropdown: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
}) => {
  const filteredOptions = PERIOD_OPTIONS.filter(o => availablePeriods.includes(o.value));

  return (
    <div className="relative">
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as TimePeriod)}
        className="appearance-none glass rounded px-4 py-2 pr-9 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer bg-card border border-border"
      >
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-card text-foreground">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// Responsive wrapper
export const ResponsivePeriodSelector: React.FC<PeriodSelectorProps> = (props) => {
  return (
    <>
      <div className="hidden sm:block">
        <PeriodSelector {...props} />
      </div>
      <div className="sm:hidden">
        <PeriodSelectorDropdown {...props} />
      </div>
    </>
  );
};
