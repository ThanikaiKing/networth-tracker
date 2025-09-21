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
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {filteredOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100',
            selectedPeriod === option.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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

  const selectedOption = filteredOptions.find(option => option.value === selectedPeriod);

  return (
    <div className="relative">
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as TimePeriod)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
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
