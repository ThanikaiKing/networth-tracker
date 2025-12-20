// TypeScript interfaces for Net Worth Dashboard

export interface BankAccount {
  name: string;
  values: number[];
}

export interface InvestmentAccount {
  name: string;
  values: number[];
}

export interface Asset {
  name: string;
  values: number[];
}

export interface Debt {
  name: string;
  values: number[];
}

export interface NetWorthEntry {
  date: string;
  bankAccounts: {
    accounts: BankAccount[];
    subtotal: number;
  };
  investments: {
    accounts: InvestmentAccount[];
    subtotal: number;
  };
  otherAssets: {
    assets: Asset[];
    subtotal: number;
  };
  debt: {
    debts: Debt[];
    subtotal: number;
  };
  totalAssets: number;
  totalDebt: number;
  netWorth: number;
  monthOverMonthChange?: number;
  yearOverYearChange?: number;
}

export interface DashboardData {
  entries: NetWorthEntry[];
  summary: {
    currentNetWorth: number;
    totalGrowth: number;
    growthRate: number;
    period: string;
    currency: string;
  };
}

// Configuration interfaces
export interface SheetsConfig {
  spreadsheetId: string;
  range: string; // 'Net Worth Tracker!A1:AA125' (to cover all data)
  apiKey: string;
  serviceAccountEmail?: string;
  privateKey?: string;
}

// UI Component Props
export interface MetricsCardsProps {
  currentNetWorth: number;
  totalGrowth: number;
  growthRate: number;
  isLoading: boolean;
}

export interface NetWorthChartProps {
  data: NetWorthEntry[];
  selectedPeriod: TimePeriod;
  isLoading: boolean;
}

export interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  availablePeriods: TimePeriod[];
}

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

// Chart data structure
export interface ChartDataPoint {
  x: string; // date
  y: number; // net worth value
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Period filter options
export type TimePeriod = 'all' | '6months' | '3months' | '1month';

// Asset allocation breakdown
export interface AssetAllocation {
  bankAccounts: number;
  investments: number;
  otherAssets: number;
}

// Performance highlights
export interface PerformanceHighlight {
  month: string;
  change: number;
  index: number;
}

export interface PerformanceHighlights {
  bestMonth: PerformanceHighlight;
  worstMonth: PerformanceHighlight;
}

// Enhanced chart component props
export interface AssetAllocationChartProps {
  data: NetWorthEntry[];
  isLoading: boolean;
}

export interface AssetGrowthChartProps {
  data: NetWorthEntry[];
  selectedPeriod: string;
  isLoading: boolean;
}

export interface DebtTrackingChartProps {
  data: NetWorthEntry[];
  selectedPeriod: string;
  isLoading: boolean;
}

export interface DebtCompositionChartProps {
  data: NetWorthEntry[];
  isLoading: boolean;
}

// Chart grid layout props
export interface ChartGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

// Detailed asset/debt information
export interface DetailedBankAccount {
  name: string;
  values: number[];
  currentValue: number;
  growth: number;
}

export interface DetailedInvestment {
  name: string;
  values: number[];
  currentValue: number;
  growth: number;
  category: InvestmentCategory;
  riskLevel: RiskLevel;
  liquidity: LiquidityLevel;
  taxStatus: TaxStatus;
  maturityDate?: string;
  sipAmount?: number;
  expenseRatio?: number;
}

export interface DetailedAsset {
  name: string;
  values: number[];
  currentValue: number;
  growth: number;
}

export interface DetailedDebt {
  name: string;
  values: number[];
  currentValue: number;
  reduction: number;
}

// Investment-specific types and interfaces
export type InvestmentCategory = 'equity' | 'debt' | 'hybrid' | 'alternative';
export type RiskLevel = 'low' | 'medium' | 'high';
export type LiquidityLevel = 'immediate' | 'short-term' | 'long-term';
export type TaxStatus = 'taxable' | 'tax-free' | 'tax-deferred';
export type InvestmentTrend = 'up' | 'down' | 'stable';

// Investment velocity analysis
export interface InvestmentVelocity {
  name: string;
  currentValue: number;
  growthRate: number; // Percentage
  absoluteGrowth: number; // Rupees
  consistencyScore: number; // 0-100 scale
  riskScore: RiskLevel;
  trend: InvestmentTrend;
  monthlyReturns: number[];
}

// Asset class allocation breakdown
export interface AssetClassAllocation {
  equity: number;
  debt: number;
  hybrid: number;
  alternative: number;
}

// Investment analytics data
export interface InvestmentAnalytics {
  totalInvestmentValue: number;
  monthlyInvestmentGrowth: number[];
  bestPerformer: InvestmentVelocity;
  worstPerformer: InvestmentVelocity;
  mostConsistent: InvestmentVelocity;
  highestContributor: InvestmentVelocity;
  portfolioAllocation: AssetClassAllocation;
  diversificationScore: number;
  overallRiskScore: number;
  averageGrowthRate: number;
}

// Investment chart component props
export interface InvestmentGrowthChartProps {
  data: NetWorthEntry[];
  selectedPeriod: TimePeriod;
  selectedInvestments?: string[]; // Allow filtering specific investments
  isLoading: boolean;
}

export interface InvestmentAllocationChartProps {
  data: NetWorthEntry[];
  isLoading: boolean;
}

export interface InvestmentVelocityCardProps {
  velocity: InvestmentVelocity;
  rank: number;
  isLoading: boolean;
}

export interface InvestmentPerformanceCardsProps {
  analytics: InvestmentAnalytics;
  isLoading: boolean;
}

export interface InvestmentDashboardProps {
  data: NetWorthEntry[];
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  isLoading: boolean;
}

// Investment colors configuration
export interface InvestmentColorConfig {
  [key: string]: string;
}

// Enhanced investment data for charts
export interface InvestmentChartData {
  name: string;
  data: ChartDataPoint[];
  color: string;
  category: InvestmentCategory;
}

// Projection feature types
export interface ProjectionDataPoint {
  x: string; // date (YYYY-MM format)
  y: number; // projected net worth value
  isProjected: boolean; // distinguish from historical data
}

export interface ProjectionParameters {
  annualInflationRate: number; // Expected inflation rate (%)
}

export interface GrowthAnalysis {
  averageMonthlyGrowthRate: number;
  medianMonthlyGrowthRate: number;
  standardDeviation: number;
  consistencyScore: number; // 0-100, higher = more consistent
  volatilityIndex: number; // 0-100, higher = more volatile
  trendDirection: 'positive' | 'negative' | 'neutral';
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
    totalContributions: number; // Sum of monthly contributions over projection period
  };
  growthAnalysis: GrowthAnalysis;
  parameters: ProjectionParameters;
}

// Component props for projection feature
export interface ProjectionSectionProps {
  data: NetWorthEntry[];
  isLoading: boolean;
}

export interface ProjectionChartProps {
  data: NetWorthEntry[];
  projectionResult: ProjectionResult | null;
  selectedScenario: 'conservative' | 'moderate' | 'aggressive';
  isLoading: boolean;
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

export interface ProjectionSummaryCardsProps {
  projectionResult: ProjectionResult | null;
  selectedScenario: 'conservative' | 'moderate' | 'aggressive';
  isLoading: boolean;
}
