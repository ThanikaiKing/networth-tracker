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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Projection Unavailable
              </h3>
              <p className="mt-1 text-sm text-yellow-700">{validationError}</p>
              <p className="mt-2 text-xs text-yellow-600">
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
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Scenario Comparison at {projectionYears} Year{projectionYears !== 1 ? 's' : ''}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectionResult.scenarios.map((scenario) => {
                const finalValue = scenario.data[scenario.data.length - 1]?.y || 0;
                const totalGrowth = finalValue - projectionResult.summary.currentNetWorth;
                
                const scenarioColors = {
                  conservative: 'text-red-600 bg-red-50 border-red-200',
                  moderate: 'text-orange-600 bg-orange-50 border-orange-200',
                  aggressive: 'text-green-600 bg-green-50 border-green-200'
                };

                return (
                  <div 
                    key={scenario.name}
                    className={`p-4 rounded-lg border-2 ${scenarioColors[scenario.name]}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium capitalize">{scenario.name}</h5>
                      <div className={`w-2 h-2 rounded-full ${
                        scenario.name === 'conservative' ? 'bg-red-500' :
                        scenario.name === 'moderate' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                        notation: 'compact',
                      }).format(finalValue)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalGrowth > 0 ? '+' : ''}{((totalGrowth / projectionResult.summary.currentNetWorth) * 100).toFixed(1)}% growth
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-50">
                        {scenario.confidenceLevel}% confidence
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Methodology Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                How Projections Work
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Historical Analysis:</strong> Based on your {data.length} months of net worth data</p>
                <p>• <strong>Inflation Adjustment:</strong> Accounts for {parameters.annualInflationRate}% annual inflation</p>
                <p>• <strong>Savings Integration:</strong> Includes monthly contributions with 10% annual step-up</p>
                <p>• <strong>Three Scenarios:</strong> <span className="text-red-600">Conservative (70%)</span>, <span className="text-orange-600">Moderate (100%)</span>, <span className="text-green-600">Aggressive (130%)</span> of historical growth</p>
                <p className="text-xs pt-1 border-t border-blue-200 mt-2">
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
