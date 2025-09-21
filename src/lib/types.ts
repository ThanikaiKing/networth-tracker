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
