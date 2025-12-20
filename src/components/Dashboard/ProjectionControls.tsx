// ProjectionControls component with time period slider and parameter inputs

'use client';

import React from 'react';
import { ProjectionParameters } from '@/lib/types';

// Simplified props - no longer needs scenario selection
interface ProjectionControlsComponentProps {
  projectionYears: number;
  onProjectionChange: (years: number) => void;
  parameters: ProjectionParameters;
  onParametersChange: (params: ProjectionParameters) => void;
  minYears?: number;
  maxYears?: number;
}

export const ProjectionControls: React.FC<ProjectionControlsComponentProps> = ({
  projectionYears,
  onProjectionChange,
  parameters,
  onParametersChange,
  minYears = 1,
  maxYears = 50
}) => {

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Top Row: Time Period and Inflation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Period Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Projection Period: {projectionYears} year{projectionYears !== 1 ? 's' : ''}
          </label>
          <div className="px-2">
            <input
              type="range"
              min={minYears}
              max={maxYears}
              value={projectionYears}
              onChange={(e) => onProjectionChange(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((projectionYears - minYears) / (maxYears - minYears)) * 100}%, #E5E7EB ${((projectionYears - minYears) / (maxYears - minYears)) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{minYears} year</span>
              <span>{maxYears} years</span>
            </div>
          </div>
          
          {/* Quick select buttons for mobile */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {[1, 5, 10, 20, 30, 50].map(years => (
              <button
                key={years}
                onClick={() => onProjectionChange(years)}
                className={`px-3 py-1 text-sm rounded-full border whitespace-nowrap transition-all duration-200 ${
                  projectionYears === years 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {years}Y
              </button>
            ))}
          </div>
        </div>

        {/* Inflation Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Inflation
          </label>
          <div className="relative">
            <input
              type="number"
              value={parameters.annualInflationRate}
              onChange={(e) => onParametersChange({
                ...parameters,
                annualInflationRate: Number(e.target.value) || 0
              })}
              className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="6.0"
              min="0"
              max="20"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Projections are shown in today&apos;s money (inflation-adjusted returns).
          </p>
        </div>
      </div>

      {/* Scenario Legend */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Growth Scenarios (all shown on chart)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-100">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <span className="text-sm font-medium text-red-700">Conservative</span>
              <p className="text-xs text-red-600">70% of historical growth</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div>
              <span className="text-sm font-medium text-orange-700">Moderate</span>
              <p className="text-xs text-orange-600">Historical average growth</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <span className="text-sm font-medium text-green-700">Aggressive</span>
              <p className="text-xs text-green-600">130% of historical growth</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              Projections are estimates based on historical data. Actual results may vary due to market conditions, life events, and other factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
