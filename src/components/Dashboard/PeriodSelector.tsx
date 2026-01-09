// Period selector component for filtering time ranges

'use client';

import React from 'react';
import { PeriodSelectorProps, TimePeriod } from '@/lib/types';
import { cn } from '@/lib/utils';

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: '6months', label: '6 Months' },
  { value: '3months', label: '3 Months' },
  { value: '1month', label: '1 Month' },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
}) => {
  const filteredOptions = PERIOD_OPTIONS.filter(option =>
    availablePeriods.includes(option.value)
  );

  return (
    <div className="flex items-center space-x-1 glass rounded-xl p-1">
      {filteredOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            selectedPeriod === option.value
              ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Mobile-friendly dropdown version
export const PeriodSelectorDropdown: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
}) => {
  const filteredOptions = PERIOD_OPTIONS.filter(option =>
    availablePeriods.includes(option.value)
  );

  return (
    <div className="relative">
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as TimePeriod)}
        className="appearance-none glass rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        {filteredOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-background text-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

// Responsive wrapper that shows tabs on desktop and dropdown on mobile
export const ResponsivePeriodSelector: React.FC<PeriodSelectorProps> = (props) => {
  return (
    <>
      {/* Desktop version - tabs */}
      <div className="hidden sm:block">
        <PeriodSelector {...props} />
      </div>
      
      {/* Mobile version - dropdown */}
      <div className="sm:hidden">
        <PeriodSelectorDropdown {...props} />
      </div>
    </>
  );
};
