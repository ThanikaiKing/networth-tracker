// Custom hook for projection data calculations and memoization

import { useMemo, useState, useEffect } from 'react';
import { NetWorthEntry, ProjectionResult, ProjectionParameters } from '@/lib/types';
import { analyzeHistoricalGrowth, generateProjectionScenarios, validateProjectionData, getBaseMonthlySavingsINR } from '@/lib/utils';

export const useProjectionData = (
  data: NetWorthEntry[],
  projectionYears: number,
  parameters: ProjectionParameters
): {
  projectionResult: ProjectionResult | null;
  validationError: string | null;
  isValidData: boolean;
} => {
  return useMemo(() => {
    // Validate data first
    const validationError = validateProjectionData(data);
    if (validationError) {
      return {
        projectionResult: null,
        validationError,
        isValidData: false
      };
    }

    if (!data.length || projectionYears <= 0) {
      return {
        projectionResult: null,
        validationError: null,
        isValidData: false
      };
    }

    try {
      // Analyze historical growth patterns
      const growthAnalysis = analyzeHistoricalGrowth(data);
      
      // Generate projection scenarios
      const scenarios = generateProjectionScenarios(data, projectionYears, growthAnalysis, parameters);
      
      // Calculate summary values
      const currentNetWorth = data[data.length - 1]?.netWorth || 0;
      const moderateScenario = scenarios.find(s => s.name === 'moderate');
      const projectedNetWorth = moderateScenario?.data[moderateScenario.data.length - 1]?.y || 0;
      const totalGrowthProjected = projectedNetWorth - currentNetWorth;
      
      // Sum contributions with 10% annual step-ups
      const base = getBaseMonthlySavingsINR();
      let totalContributions = 0;
      for (let m = 1; m <= projectionYears * 12; m++) {
        const yearsForward = Math.floor((m - 1) / 12);
        totalContributions += base * Math.pow(1.1, yearsForward);
      }

      const projectionResult: ProjectionResult = {
        projectionPeriodYears: projectionYears,
        historicalData: data,
        scenarios,
        summary: {
          currentNetWorth,
          projectedNetWorth,
          totalGrowthProjected,
          averageMonthlyGrowth: growthAnalysis.averageMonthlyGrowthRate,
          totalContributions,
        },
        growthAnalysis,
        parameters
      };

      return {
        projectionResult,
        validationError: null,
        isValidData: true
      };
    } catch (error) {
      console.error('Error calculating projections:', error);
      return {
        projectionResult: null,
        validationError: 'Error calculating projections. Please try again.',
        isValidData: false
      };
    }
  }, [data, projectionYears, parameters]);
};

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
