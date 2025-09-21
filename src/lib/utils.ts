// Utility functions for Net Worth Dashboard

import { NetWorthEntry, AssetAllocation, PerformanceHighlights, TimePeriod } from './types';

// Row mapping constants for your specific sheet
export const SHEET_ROWS = {
  DATE_HEADERS: 2, // Row 3 (0-indexed)
  BANK_SUBTOTAL: 17, // Row 18
  INVESTMENT_SUBTOTAL: 35, // Row 36
  ASSETS_SUBTOTAL: 50, // Row 51
  DEBT_SUBTOTAL: 65, // Row 66
  TOTAL_ASSETS: 67, // Row 68
  TOTAL_DEBT: 68, // Row 69
  NET_WORTH: 69, // Row 70
  MONTH_CHANGE: 70, // Row 71
} as const;

export const SHEET_COLUMNS = {
  DATA_START: 3, // Column D (0-indexed)
  DATA_END: 26, // Column AA (0-indexed)
} as const;

// Enhanced Indian currency parser
export const parseIndianCurrency = (value: string | undefined): number => {
  if (!value || value === '' || value === '₹0') return 0;
  
  // Handle various formats: "₹33,940", "₹2,20,000", "-₹3,264,441"
  const cleaned = value
    .toString()
    .replace(/[₹,"]/g, '') // Remove currency symbol and commas
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Data extraction function tailored to your sheet
export const extractNetWorthData = (rawData: string[][]): NetWorthEntry[] => {
  const dateHeaders = rawData[SHEET_ROWS.DATE_HEADERS]
    .slice(SHEET_COLUMNS.DATA_START, SHEET_COLUMNS.DATA_END + 1);
  
  const entries: NetWorthEntry[] = [];
  
  dateHeaders.forEach((dateStr, colIndex) => {
    if (!dateStr) return; // Skip empty date columns
    
    const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
    
    // Extract all values for this month
    const netWorth = parseIndianCurrency(rawData[SHEET_ROWS.NET_WORTH][actualColIndex]);
    
    // Only process months with actual data
    if (netWorth > 0) {
      entries.push({
        date: dateStr,
        bankAccounts: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.BANK_SUBTOTAL][actualColIndex]),
          accounts: [] // Can be populated with individual account details if needed
        },
        investments: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.INVESTMENT_SUBTOTAL][actualColIndex]),
          accounts: []
        },
        otherAssets: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.ASSETS_SUBTOTAL][actualColIndex]),
          assets: []
        },
        debt: {
          subtotal: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.DEBT_SUBTOTAL][actualColIndex])),
          debts: []
        },
        totalAssets: parseIndianCurrency(rawData[SHEET_ROWS.TOTAL_ASSETS][actualColIndex]),
        totalDebt: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.TOTAL_DEBT][actualColIndex])),
        netWorth,
        monthOverMonthChange: parseIndianCurrency(rawData[SHEET_ROWS.MONTH_CHANGE][actualColIndex])
      });
    }
  });
  
  return entries;
};

// Growth Rate Calculation
export const calculateGrowthRate = (data: NetWorthEntry[]): number => {
  if (data.length < 2) return 0;
  
  const oldest = data[0].netWorth;
  const newest = data[data.length - 1].netWorth;
  
  return ((newest - oldest) / oldest) * 100;
};

// Total Growth (absolute change)
export const calculateTotalGrowth = (data: NetWorthEntry[]): number => {
  if (data.length < 2) return 0;
  return data[data.length - 1].netWorth - data[0].netWorth;
};

// Asset Allocation Breakdown
export const calculateAssetAllocation = (latestEntry: NetWorthEntry): AssetAllocation => {
  const total = latestEntry.totalAssets;
  return {
    bankAccounts: (latestEntry.bankAccounts.subtotal / total) * 100,
    investments: (latestEntry.investments.subtotal / total) * 100,
    otherAssets: (latestEntry.otherAssets.subtotal / total) * 100,
  };
};

// Debt-to-Asset Ratio
export const calculateDebtToAssetRatio = (entry: NetWorthEntry): number => {
  return (entry.totalDebt / entry.totalAssets) * 100;
};

// Monthly Growth Trend
export const calculateMonthlyGrowthTrend = (data: NetWorthEntry[]): number[] => {
  return data.map(entry => entry.monthOverMonthChange || 0);
};

// Best and Worst Performing Months
export const getPerformanceHighlights = (data: NetWorthEntry[]): PerformanceHighlights => {
  const validChanges = data
    .map((entry, index) => ({ 
      month: entry.date, 
      change: entry.monthOverMonthChange || 0,
      index 
    }))
    .filter(item => item.change !== 0);
    
  const bestMonth = validChanges.reduce((max, curr) => 
    curr.change > max.change ? curr : max
  );
  
  const worstMonth = validChanges.reduce((min, curr) => 
    curr.change < min.change ? curr : min
  );
  
  return { bestMonth, worstMonth };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage for display
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Filter data by time period
export const filterDataByPeriod = (data: NetWorthEntry[], period: TimePeriod): NetWorthEntry[] => {
  if (period === 'all' || data.length === 0) return data;
  
  const monthsToInclude = {
    '1month': 1,
    '3months': 3,
    '6months': 6,
  }[period] || data.length;
  
  return data.slice(-monthsToInclude);
};

// Generate chart data points
export const generateChartData = (data: NetWorthEntry[]) => {
  return data.map(entry => ({
    x: entry.date,
    y: entry.netWorth,
  }));
};

// Utility function to merge className strings (similar to clsx/cn)
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Date parsing helper for chart labels
export const parseChartDate = (dateStr: string): string => {
  // Convert "Apr, 2025" to a more chart-friendly format
  return dateStr.replace(',', '');
};

// Calculate compound annual growth rate (CAGR) if needed
export const calculateCAGR = (initialValue: number, finalValue: number, periods: number): number => {
  if (periods === 0 || initialValue === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / periods) - 1) * 100;
};

// Validate data integrity
export const validateNetWorthData = (data: NetWorthEntry[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false;
  
  return data.every(entry => 
    typeof entry.netWorth === 'number' &&
    typeof entry.totalAssets === 'number' &&
    typeof entry.totalDebt === 'number' &&
    entry.netWorth > 0 &&
    entry.date && entry.date.length > 0
  );
};

// Mock data generator for development/testing
export const generateMockData = (): NetWorthEntry[] => {
  const months = ['Apr, 2025', 'May, 2025', 'Jun, 2025', 'Jul, 2025', 'Aug, 2025', 'Sep, 2025'];
  
  return months.map((month, index) => ({
    date: month,
    bankAccounts: {
      accounts: [],
      subtotal: 500000 + (index * 50000)
    },
    investments: {
      accounts: [],
      subtotal: 4500000 + (index * 200000)
    },
    otherAssets: {
      assets: [],
      subtotal: 10650000
    },
    debt: {
      debts: [],
      subtotal: 2600000 - (index * 50000)
    },
    totalAssets: 15650000 + (index * 250000),
    totalDebt: 2600000 - (index * 50000),
    netWorth: 13050000 + (index * 300000),
    monthOverMonthChange: index === 0 ? 0 : 300000
  }));
};
