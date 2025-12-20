# Net Worth Projection Feature - Design & Implementation Plan

## Overview

This document outlines the design and implementation plan for adding a **Projection section** to the Net Worth Dashboard. The feature will analyze historical financial data to predict future net worth growth over user-selectable time horizons from 1 year to 50 years.

## Feature Requirements

### Core Functionality
- **Historical Analysis**: Use all available historical net worth data for prediction models
- **Multiple Scenarios**: Conservative, Moderate, and Aggressive projection models
- **Interactive Parameters**: Adjustable savings rate and inflation assumptions
- **Flexible Time Horizons**: Allow projections from 1 year to 50 years
- **Interactive Controls**: Slider for projection period + parameter adjustment controls
- **Visual Representation**: Single line projections showing historical data + projected future growth
- **Integration**: Separate section at the bottom of the dashboard

### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Projection updates as user changes time horizon
- **Clear Visualization**: Distinguish between historical and projected data
- **Performance**: Fast calculations and smooth interactions

## Technical Architecture

### Data Structure Extensions

```typescript
// Extended types for projection functionality
export interface ProjectionDataPoint {
  x: string; // date (YYYY-MM format)
  y: number; // projected net worth value
  isProjected: boolean; // distinguish from historical data
}

export interface ProjectionScenario {
  name: 'conservative' | 'moderate' | 'aggressive';
  monthlyGrowthRate: number; // calculated from historical data
  data: ProjectionDataPoint[];
  confidenceLevel: number; // 0-100 representing confidence in projection
}

export interface ProjectionResult {
  projectionPeriodYears: number;
  historicalData: NetWorthEntry[];
  scenarios: ProjectionScenario[];
  summary: {
    currentNetWorth: number;
    projectedNetWorth: number; // for moderate scenario
    totalGrowthProjected: number;
    averageMonthlyGrowth: number;
  };
}

export interface ProjectionChartProps {
  data: NetWorthEntry[];
  projectionYears: number;
  selectedScenario?: 'conservative' | 'moderate' | 'aggressive';
  isLoading: boolean;
}

export interface ProjectionParameters {
  monthlySavingsRate: number; // Additional monthly savings amount
  annualInflationRate: number; // Expected inflation rate (%)
}

export interface ProjectionControlsProps {
  projectionYears: number;
  onProjectionChange: (years: number) => void;
  selectedScenario: 'conservative' | 'moderate' | 'aggressive';
  onScenarioChange: (scenario: 'conservative' | 'moderate' | 'aggressive') => void;
  parameters: ProjectionParameters;
  onParametersChange: (params: ProjectionParameters) => void;
  minYears?: number;
  maxYears?: number;
}
```

### Projection Algorithms

#### 1. Historical Growth Rate Analysis
```typescript
/**
 * Calculates various growth metrics from historical data
 */
export interface GrowthAnalysis {
  averageMonthlyGrowthRate: number;
  medianMonthlyGrowthRate: number;
  standardDeviation: number;
  consistencyScore: number; // 0-100, higher = more consistent
  volatilityIndex: number; // 0-100, higher = more volatile
  trendDirection: 'positive' | 'negative' | 'neutral';
}

const analyzeHistoricalGrowth = (data: NetWorthEntry[]): GrowthAnalysis => {
  // Calculate month-over-month growth rates
  const growthRates = data
    .map(entry => entry.monthOverMonthChange || 0)
    .filter(rate => rate !== 0);

  // Statistical calculations
  const average = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const median = calculateMedian(growthRates);
  const stdDev = calculateStandardDeviation(growthRates, average);
  
  // Consistency score (inverse of coefficient of variation)
  const coefficientOfVariation = Math.abs(stdDev / average);
  const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 100));
  
  return {
    averageMonthlyGrowthRate: average,
    medianMonthlyGrowthRate: median,
    standardDeviation: stdDev,
    consistencyScore,
    volatilityIndex: Math.min(100, coefficientOfVariation * 100),
    trendDirection: average > 0 ? 'positive' : average < 0 ? 'negative' : 'neutral'
  };
};
```

#### 2. Multiple Projection Scenarios
```typescript
/**
 * Generate projection scenarios based on historical analysis
 */
const generateProjectionScenarios = (
  historicalData: NetWorthEntry[],
  projectionYears: number,
  growthAnalysis: GrowthAnalysis,
  parameters: ProjectionParameters
): ProjectionScenario[] => {
  const currentNetWorth = historicalData[historicalData.length - 1]?.netWorth || 0;
  const baseGrowthRate = growthAnalysis.averageMonthlyGrowthRate;
  const volatility = growthAnalysis.standardDeviation;

  // Define scenario multipliers based on historical performance
  const scenarios: Array<{
    name: 'conservative' | 'moderate' | 'aggressive';
    growthMultiplier: number;
    confidenceLevel: number;
  }> = [
    {
      name: 'conservative',
      growthMultiplier: 0.7, // 70% of historical average
      confidenceLevel: 85
    },
    {
      name: 'moderate',
      growthMultiplier: 1.0, // Historical average
      confidenceLevel: 70
    },
    {
      name: 'aggressive',
      growthMultiplier: 1.3, // 130% of historical average
      confidenceLevel: 50
    }
  ];

  return scenarios.map(scenario => {
    const monthlyGrowthRate = (baseGrowthRate * scenario.growthMultiplier) / 100;
    const monthlyInflationRate = parameters.annualInflationRate / 100 / 12;
    const realGrowthRate = monthlyGrowthRate - monthlyInflationRate; // Adjust for inflation
    const projectionData: ProjectionDataPoint[] = [];
    
    // Generate monthly projections
    let currentValue = currentNetWorth;
    const lastHistoricalDate = new Date(historicalData[historicalData.length - 1]?.date || '');
    
    for (let month = 1; month <= projectionYears * 12; month++) {
      const projectionDate = new Date(lastHistoricalDate);
      projectionDate.setMonth(projectionDate.getMonth() + month);
      
      // Apply compound growth (adjusted for inflation)
      currentValue = currentValue * (1 + realGrowthRate);
      
      // Add monthly savings (also adjusted for inflation over time)
      const inflationAdjustedSavings = parameters.monthlySavingsRate * 
        Math.pow(1 + monthlyInflationRate, month);
      currentValue += inflationAdjustedSavings;
      
      projectionData.push({
        x: projectionDate.toISOString().substring(0, 7), // YYYY-MM format
        y: Math.round(currentValue),
        isProjected: true
      });
    }

    return {
      name: scenario.name,
      monthlyGrowthRate: realGrowthRate * 100,
      data: projectionData,
      confidenceLevel: scenario.confidenceLevel
    };
  });
};
```

#### 3. Advanced Projection Models (Future Enhancement)
```typescript
/**
 * More sophisticated projection models for future implementation
 */

// Linear regression based projection
const linearRegressionProjection = (data: NetWorthEntry[], years: number) => {
  // Implementation using least squares method
};

// Exponential smoothing projection
const exponentialSmoothingProjection = (data: NetWorthEntry[], years: number) => {
  // Implementation using Holt-Winters method
};

// Monte Carlo simulation projection
const monteCarloProjection = (data: NetWorthEntry[], years: number, iterations: number = 1000) => {
  // Implementation with multiple random scenarios
};
```

## Component Design

### 1. ProjectionSection Component
```typescript
// Main container for the projection feature
interface ProjectionSectionProps {
  data: NetWorthEntry[];
  isLoading: boolean;
}

const ProjectionSection: React.FC<ProjectionSectionProps> = ({ data, isLoading }) => {
  const [projectionYears, setProjectionYears] = useState(10);
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [parameters, setParameters] = useState<ProjectionParameters>({
    monthlySavingsRate: 50000, // Default monthly savings in INR
    annualInflationRate: 6.0   // Default inflation rate for India
  });
  
  const projectionResult = useMemo(() => 
    generateProjectionAnalysis(data, projectionYears, parameters), 
    [data, projectionYears, parameters]
  );

  return (
    <ChartSection 
      title="Net Worth Projection"
      description="Future net worth projections based on historical growth patterns"
      className="mb-8"
    >
      <div className="space-y-6">
        <ProjectionControls
          projectionYears={projectionYears}
          onProjectionChange={setProjectionYears}
          selectedScenario={selectedScenario}
          onScenarioChange={setSelectedScenario}
          parameters={parameters}
          onParametersChange={setParameters}
          minYears={1}
          maxYears={50}
        />
        
        <ProjectionChart
          data={data}
          projectionResult={projectionResult}
          selectedScenario={selectedScenario}
          isLoading={isLoading}
        />
        
        <ProjectionSummaryCards
          projectionResult={projectionResult}
          selectedScenario={selectedScenario}
          isLoading={isLoading}
        />
      </div>
    </ChartSection>
  );
};
```

### 2. ProjectionControls Component
```typescript
const ProjectionControls: React.FC<ProjectionControlsProps> = ({
  projectionYears,
  onProjectionChange,
  selectedScenario,
  onScenarioChange,
  parameters,
  onParametersChange,
  minYears = 1,
  maxYears = 50
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Top Row: Time Period and Scenario */}
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{minYears} year</span>
              <span>{maxYears} years</span>
            </div>
          </div>
        </div>

        {/* Scenario Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Growth Scenario
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['conservative', 'moderate', 'aggressive'] as const).map((scenario) => (
              <button
                key={scenario}
                onClick={() => onScenarioChange(scenario)}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 capitalize ${
                  selectedScenario === scenario
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Adjustable Parameters */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Projection Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Savings Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Savings Addition
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={parameters.monthlySavingsRate}
                onChange={(e) => onParametersChange({
                  ...parameters,
                  monthlySavingsRate: Number(e.target.value)
                })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
                min="0"
                step="1000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Additional amount you plan to save monthly
            </p>
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
                  annualInflationRate: Number(e.target.value)
                })}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6.0"
                min="0"
                max="20"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Adjusts projections for inflation impact
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3. ProjectionChart Component
```typescript
const ProjectionChart: React.FC<ProjectionChartProps> = ({
  data,
  projectionResult,
  selectedScenario,
  isLoading
}) => {
  const chartData = useMemo(() => {
    if (isLoading || !data.length || !projectionResult) return null;

    // Combine historical and projection data
    const historicalPoints: ChartDataPoint[] = data.map(entry => ({
      x: entry.date,
      y: entry.netWorth
    }));

    const selectedProjection = projectionResult.scenarios.find(s => s.name === selectedScenario);
    const projectionPoints = selectedProjection?.data || [];

    return {
      datasets: [
        {
          label: 'Historical Net Worth',
          data: historicalPoints,
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F6',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
        },
        {
          label: `Projected (${selectedScenario})`,
          data: projectionPoints,
          borderColor: selectedScenario === 'conservative' ? '#EF4444' : 
                      selectedScenario === 'moderate' ? '#F59E0B' : '#10B981',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: false,
        }
      ]
    };
  }, [data, projectionResult, selectedScenario, isLoading]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM YYYY'
          }
        },
        title: {
          display: true,
          text: 'Time Period'
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number);
          }
        },
        title: {
          display: true,
          text: 'Net Worth'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const label = context.dataset.label || '';
            const value = formatCurrency(context.parsed.y);
            return `${label}: ${value}`;
          }
        }
      },
      legend: {
        position: 'top'
      }
    }
  };

  if (isLoading) {
    return <ChartSkeleton height="400px" />;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
```

### 4. ProjectionSummaryCards Component
```typescript
const ProjectionSummaryCards: React.FC<{
  projectionResult: ProjectionResult;
  selectedScenario: string;
  isLoading: boolean;
}> = ({ projectionResult, selectedScenario, isLoading }) => {
  if (isLoading) {
    return <MetricCardsSkeleton count={3} />;
  }

  const selectedProjection = projectionResult.scenarios.find(s => s.name === selectedScenario);
  const finalProjectedValue = selectedProjection?.data[selectedProjection.data.length - 1]?.y || 0;
  const totalGrowth = finalProjectedValue - projectionResult.summary.currentNetWorth;
  const annualizedGrowthRate = Math.pow(finalProjectedValue / projectionResult.summary.currentNetWorth, 1 / projectionResult.projectionPeriodYears) - 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Projected Net Worth"
        value={formatCurrency(finalProjectedValue)}
        subtitle={`In ${projectionResult.projectionPeriodYears} years (${selectedScenario})`}
        trend="up"
        isLoading={false}
      />
      
      <MetricCard
        title="Total Projected Growth"
        value={formatCurrency(totalGrowth)}
        subtitle={`${((totalGrowth / projectionResult.summary.currentNetWorth) * 100).toFixed(1)}% increase`}
        trend={totalGrowth > 0 ? "up" : "down"}
        isLoading={false}
      />
      
      <MetricCard
        title="Annualized Growth Rate"
        value={`${(annualizedGrowthRate * 100).toFixed(1)}%`}
        subtitle={`Based on ${selectedScenario} scenario`}
        trend={annualizedGrowthRate > 0 ? "up" : "down"}
        isLoading={false}
      />
    </div>
  );
};
```

## Integration Plan

### 1. Dashboard Layout Integration
```typescript
// Update DashboardLayout.tsx to include Projection section
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const { data, loading, error, refetch } = useNetWorthData(selectedPeriod);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Existing sections... */}

        {/* Projection Section - New */}
        <ProjectionSection
          data={data?.entries || []}
          isLoading={loading}
        />

        {/* Existing debt analysis and other sections... */}
      </main>
    </div>
  );
};
```

### 2. Custom Hook for Projection Logic
```typescript
// hooks/useProjectionData.ts
export const useProjectionData = (
  data: NetWorthEntry[],
  projectionYears: number,
  parameters: ProjectionParameters
) => {
  return useMemo(() => {
    if (!data.length || projectionYears <= 0) return null;

    const growthAnalysis = analyzeHistoricalGrowth(data);
    const scenarios = generateProjectionScenarios(data, projectionYears, growthAnalysis, parameters);
    
    const moderateScenario = scenarios.find(s => s.name === 'moderate');
    const projectedNetWorth = moderateScenario?.data[moderateScenario.data.length - 1]?.y || 0;
    const currentNetWorth = data[data.length - 1]?.netWorth || 0;
    
    return {
      projectionPeriodYears: projectionYears,
      historicalData: data,
      scenarios,
      summary: {
        currentNetWorth,
        projectedNetWorth,
        totalGrowthProjected: projectedNetWorth - currentNetWorth,
        averageMonthlyGrowth: growthAnalysis.averageMonthlyGrowthRate,
      },
      growthAnalysis,
      parameters
    };
  }, [data, projectionYears, parameters]);
};
```

## Mobile Responsiveness

### 1. Responsive Design Considerations
```typescript
// Mobile-optimized slider component
const MobileProjectionSlider = ({ value, onChange, min, max }: SliderProps) => {
  return (
    <div className="touch-pan-x">
      {/* Custom slider with larger touch targets */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`
          }}
        />
        {/* Custom thumb styling for mobile */}
      </div>
      
      {/* Quick select buttons for mobile */}
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {[1, 5, 10, 20, 30, 50].map(years => (
          <button
            key={years}
            onClick={() => onChange({ target: { value: years.toString() } })}
            className={`px-3 py-1 text-sm rounded-full border whitespace-nowrap ${
              value === years 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {years}Y
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 2. Mobile Chart Optimizations
```typescript
// Mobile-specific chart options
const getMobileChartOptions = (): Partial<ChartOptions<'line'>> => ({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 6, // Fewer labels on mobile
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
});
```

## Performance Considerations

### 1. Calculation Optimization
```typescript
// Memoized calculations to prevent unnecessary recomputation
const ProjectionSection = ({ data, isLoading }) => {
  // Memoize expensive calculations
  const growthAnalysis = useMemo(() => 
    analyzeHistoricalGrowth(data), 
    [data]
  );

  const projectionResults = useMemo(() => 
    generateProjectionScenarios(data, projectionYears, growthAnalysis),
    [data, projectionYears, growthAnalysis]
  );

  // Debounce slider changes to prevent excessive recalculations
  const [projectionYears, setProjectionYears] = useState(10);
  const debouncedProjectionYears = useDebounce(projectionYears, 300);
};
```

### 2. Chart Performance
```typescript
// Chart.js optimization options
const chartOptions = {
  animation: {
    duration: 1000,
    easing: 'easeOutCubic'
  },
  // Disable animations for better mobile performance
  ...(isMobile() && { 
    animation: false,
    responsive: true,
    maintainAspectRatio: false
  })
};
```

## Error Handling & Edge Cases

### 1. Data Validation
```typescript
const validateProjectionData = (data: NetWorthEntry[]): string | null => {
  if (!data.length) return "No historical data available for projections";
  if (data.length < 3) return "Minimum 3 months of data required for reliable projections";
  
  const hasValidGrowth = data.some(entry => entry.monthOverMonthChange && entry.monthOverMonthChange !== 0);
  if (!hasValidGrowth) return "No growth data found in historical records";
  
  return null;
};
```

### 2. Fallback States
```typescript
const ProjectionSection = ({ data, isLoading }) => {
  const validationError = validateProjectionData(data);
  
  if (validationError) {
    return (
      <ChartSection title="Net Worth Projection" className="mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Projection Unavailable
              </h3>
              <p className="mt-1 text-sm text-yellow-700">{validationError}</p>
            </div>
          </div>
        </div>
      </ChartSection>
    );
  }

  // Regular projection rendering...
};
```

## Testing Strategy

### 1. Unit Tests
```typescript
// tests/projection.test.ts
describe('Projection Calculations', () => {
  test('analyzeHistoricalGrowth calculates correct growth rates', () => {
    const mockData = generateMockNetWorthData();
    const analysis = analyzeHistoricalGrowth(mockData);
    
    expect(analysis.averageMonthlyGrowthRate).toBeGreaterThan(0);
    expect(analysis.consistencyScore).toBeBetween(0, 100);
  });

  test('generateProjectionScenarios creates valid scenarios', () => {
    const mockData = generateMockNetWorthData();
    const analysis = analyzeHistoricalGrowth(mockData);
    const scenarios = generateProjectionScenarios(mockData, 5, analysis);
    
    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].name).toBe('conservative');
    expect(scenarios[1].name).toBe('moderate');
    expect(scenarios[2].name).toBe('aggressive');
  });
});
```

### 2. Integration Tests
```typescript
// tests/projection-component.test.tsx
describe('ProjectionSection Component', () => {
  test('renders projection controls and chart', () => {
    render(<ProjectionSection data={mockData} isLoading={false} />);
    
    expect(screen.getByLabelText(/projection period/i)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText(/conservative/i)).toBeInTheDocument();
  });

  test('updates projections when slider changes', async () => {
    render(<ProjectionSection data={mockData} isLoading={false} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '20' } });
    
    await waitFor(() => {
      expect(screen.getByText(/20 years/i)).toBeInTheDocument();
    });
  });
});
```

## Implementation Timeline

### Phase 1: Core Functionality (Week 1)
- [ ] Set up projection calculation utilities
- [ ] Implement basic projection algorithms
- [ ] Create ProjectionControls component
- [ ] Add basic chart visualization

### Phase 2: Enhanced Features (Week 2)
- [ ] Implement multiple scenario projections
- [ ] Add projection summary cards
- [ ] Integrate with existing dashboard layout
- [ ] Mobile responsive design

### Phase 3: Polish & Testing (Week 3)
- [ ] Performance optimizations
- [ ] Error handling and edge cases
- [ ] Unit and integration tests
- [ ] Documentation and code review

### Phase 4: Advanced Features (Future)
- [ ] Monte Carlo simulations
- [ ] Confidence intervals
- [ ] Goal tracking integration
- [ ] Export functionality

## File Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── ProjectionSection.tsx          # Main projection container
│   │   ├── ProjectionChart.tsx            # Chart component
│   │   ├── ProjectionControls.tsx         # Time period/scenario controls
│   │   └── ProjectionSummaryCards.tsx     # Metrics cards
├── hooks/
│   └── useProjectionData.ts               # Projection logic hook
├── lib/
│   ├── projection.ts                      # Core projection algorithms
│   └── projectionTypes.ts                 # TypeScript interfaces
└── tests/
    ├── projection.test.ts                 # Unit tests
    └── projection-component.test.tsx      # Component tests
```

## Summary

This projection feature will provide users with valuable insights into their potential financial future based on their historical performance and adjustable parameters. The implementation focuses on:

### Key Features Implemented:
✅ **Multiple Scenarios**: Conservative, Moderate, and Aggressive projection models  
✅ **Interactive Parameters**: Adjustable monthly savings rate and annual inflation rate  
✅ **Flexible Time Horizons**: 1-50 year projection range with smooth slider control  
✅ **Single Line Visualization**: Clean chart showing historical data + single projected line  
✅ **Separate Dashboard Section**: Positioned at bottom of dashboard for clear focus  
✅ **Mobile Responsive**: Touch-friendly controls and optimized mobile experience  

### Technical Excellence:
1. **Accuracy**: Multiple projection models with inflation-adjusted calculations and savings additions
2. **Usability**: Intuitive parameter controls with real-time projection updates
3. **Performance**: Optimized calculations with memoization and debounced inputs
4. **Integration**: Seamless fit within existing dashboard architecture using established patterns

### User Benefits:
- **Financial Planning**: See how current growth patterns may continue with added savings
- **Scenario Planning**: Compare conservative vs aggressive growth assumptions
- **Inflation Awareness**: Real-world projections that account for inflation impact
- **Goal Setting**: Visual representation of long-term wealth building potential

The feature provides a sophisticated yet user-friendly tool for long-term financial planning that complements the existing net worth tracking capabilities.
