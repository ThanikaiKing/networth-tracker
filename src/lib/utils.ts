// Utility functions for Net Worth Dashboard

import { 
  NetWorthEntry, 
  AssetAllocation, 
  PerformanceHighlights, 
  TimePeriod, 
  InvestmentAccount,
  BankAccount,
  Asset,
  Debt,
  GrowthAnalysis,
  ProjectionScenario,
  ProjectionParameters,
  ProjectionDataPoint
} from './types';

// Row mapping constants for your specific sheet
export const SHEET_ROWS = {
  DATE_HEADERS: 2, // Row 3 (0-indexed)
  
  // Bank Accounts (rows 7-10)
  BANK_ACCOUNTS_START: 6, // Row 7 (HDFC account)
  BANK_ACCOUNTS_END: 9,   // Row 10 (Zerodha funds)
  BANK_SUBTOTAL: 17, // Row 18
  
  // Investment Accounts (rows 22-32) - now includes all investments
  INVESTMENT_ACCOUNTS_START: 21, // Row 22 (Equity)
  INVESTMENT_ACCOUNTS_END: 32,   // Row 32 (Aston grey) - expanded to include real estate
  INVESTMENT_SUBTOTAL: 35, // Row 36
  
  // Other Assets (now empty since real estate moved to investments)
  ASSETS_START: 39, // Row 40 
  ASSETS_END: 41,   // Row 42 (but all empty now)
  ASSETS_SUBTOTAL: 50, // Row 51
  
  // Debt (rows 55-56)
  DEBT_START: 54, // Row 55 (Home loan)
  DEBT_END: 56,   // Row 56 (Personal loan)
  DEBT_SUBTOTAL: 65, // Row 66
  
  // Summary rows
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

// Extract individual bank accounts from the sheet
export const extractBankAccounts = (rawData: string[][], dateHeaders: string[]): BankAccount[] => {
  const accounts: BankAccount[] = [];
  
  for (let rowIndex = SHEET_ROWS.BANK_ACCOUNTS_START; rowIndex <= SHEET_ROWS.BANK_ACCOUNTS_END; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row) continue;
    
    const accountName = row[2]; // Column C contains account names
    if (!accountName || accountName.trim() === '') continue;
    
    const values: number[] = [];
    
    // Extract values for each date column
    dateHeaders.forEach((_, colIndex) => {
      const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
      const value = parseIndianCurrency(row[actualColIndex]);
      values.push(value);
    });
    
    // Only include accounts that have some non-zero values
    if (values.some(v => v > 0)) {
      accounts.push({
        name: accountName.trim(),
        values
      });
    }
  }
  
  return accounts;
};

// Extract individual investment accounts from the sheet (now includes all investments including real estate)
export const extractInvestmentAccounts = (rawData: string[][], dateHeaders: string[]): InvestmentAccount[] => {
  const accounts: InvestmentAccount[] = [];
  
  // Extract all investment accounts (rows 22-32, now includes real estate)
  for (let rowIndex = SHEET_ROWS.INVESTMENT_ACCOUNTS_START; rowIndex <= SHEET_ROWS.INVESTMENT_ACCOUNTS_END; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row) continue;
    
    const accountName = row[2]; // Column C contains investment names
    if (!accountName || accountName.trim() === '') continue;
    
    const values: number[] = [];
    
    // Extract values for each date column
    dateHeaders.forEach((_, colIndex) => {
      const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
      const value = parseIndianCurrency(row[actualColIndex]);
      values.push(value);
    });
    
    // Only include investments that have some non-zero values
    if (values.some(v => v > 0)) {
      accounts.push({
        name: accountName.trim(),
        values
      });
    }
  }
  
  return accounts;
};

// Extract individual assets from the sheet
export const extractAssets = (rawData: string[][], dateHeaders: string[]): Asset[] => {
  const assets: Asset[] = [];
  
  for (let rowIndex = SHEET_ROWS.ASSETS_START; rowIndex <= SHEET_ROWS.ASSETS_END; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row) continue;
    
    const assetName = row[2]; // Column C contains asset names
    if (!assetName || assetName.trim() === '') continue;
    
    const values: number[] = [];
    
    // Extract values for each date column
    dateHeaders.forEach((_, colIndex) => {
      const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
      const value = parseIndianCurrency(row[actualColIndex]);
      values.push(value);
    });
    
    // Only include assets that have some non-zero values
    if (values.some(v => v > 0)) {
      assets.push({
        name: assetName.trim(),
        values
      });
    }
  }
  
  return assets;
};

// Extract individual debts from the sheet
export const extractDebts = (rawData: string[][], dateHeaders: string[]): Debt[] => {
  const debts: Debt[] = [];
  
  for (let rowIndex = SHEET_ROWS.DEBT_START; rowIndex <= SHEET_ROWS.DEBT_END; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row) continue;
    
    const debtName = row[2]; // Column C contains debt names
    if (!debtName || debtName.trim() === '') continue;
    
    const values: number[] = [];
    
    // Extract values for each date column
    dateHeaders.forEach((_, colIndex) => {
      const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
      const rawValue = parseIndianCurrency(row[actualColIndex]);
      // Convert to positive value for debt amounts
      const value = Math.abs(rawValue);
      values.push(value);
    });
    
    // Only include debts that have some non-zero values
    if (values.some(v => v > 0)) {
      debts.push({
        name: debtName.trim(),
        values
      });
    }
  }
  
  return debts;
};

// Data extraction function tailored to your sheet
export const extractNetWorthData = (rawData: string[][]): NetWorthEntry[] => {
  const dateHeaders = rawData[SHEET_ROWS.DATE_HEADERS]
    .slice(SHEET_COLUMNS.DATA_START, SHEET_COLUMNS.DATA_END + 1);
  
  // Extract individual accounts using helper functions
  const bankAccounts = extractBankAccounts(rawData, dateHeaders);
  const investmentAccounts = extractInvestmentAccounts(rawData, dateHeaders);
  const assets = extractAssets(rawData, dateHeaders);
  const debts = extractDebts(rawData, dateHeaders);
  
  const entries: NetWorthEntry[] = [];
  
  dateHeaders.forEach((dateStr, colIndex) => {
    if (!dateStr) return; // Skip empty date columns
    
    const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
    
    // Extract all values for this month
    const netWorth = parseIndianCurrency(rawData[SHEET_ROWS.NET_WORTH][actualColIndex]);
    
    // Only process months with actual data
    if (netWorth > 0) {
      // Create account snapshots for this specific month
      const monthlyBankAccounts: BankAccount[] = bankAccounts.map(account => ({
        name: account.name,
        values: [account.values[colIndex]] // Only the value for this month
      }));

      const monthlyInvestmentAccounts: InvestmentAccount[] = investmentAccounts.map(account => ({
        name: account.name,
        values: [account.values[colIndex]] // Only the value for this month
      }));

      const monthlyAssets: Asset[] = assets.map(asset => ({
        name: asset.name,
        values: [asset.values[colIndex]] // Only the value for this month
      }));

      const monthlyDebts: Debt[] = debts.map(debt => ({
        name: debt.name,
        values: [debt.values[colIndex]] // Only the value for this month
      }));

      entries.push({
        date: dateStr,
        bankAccounts: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.BANK_SUBTOTAL][actualColIndex]),
          accounts: monthlyBankAccounts
        },
        investments: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.INVESTMENT_SUBTOTAL][actualColIndex]),
          accounts: monthlyInvestmentAccounts
        },
        otherAssets: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.ASSETS_SUBTOTAL][actualColIndex]),
          assets: monthlyAssets
        },
        debt: {
          subtotal: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.DEBT_SUBTOTAL][actualColIndex])),
          debts: monthlyDebts
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

// Enhanced data extraction that provides full historical data for investments
export const extractNetWorthDataWithHistory = (rawData: string[][]): NetWorthEntry[] => {
  const dateHeaders = rawData[SHEET_ROWS.DATE_HEADERS]
    .slice(SHEET_COLUMNS.DATA_START, SHEET_COLUMNS.DATA_END + 1);
  
  // Extract individual accounts with full historical data
  const bankAccounts = extractBankAccounts(rawData, dateHeaders);
  const investmentAccounts = extractInvestmentAccounts(rawData, dateHeaders);
  const assets = extractAssets(rawData, dateHeaders);
  const debts = extractDebts(rawData, dateHeaders);
  
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
          accounts: bankAccounts // Full historical data for analysis
        },
        investments: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.INVESTMENT_SUBTOTAL][actualColIndex]),
          accounts: investmentAccounts // Full historical data for analysis
        },
        otherAssets: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.ASSETS_SUBTOTAL][actualColIndex]),
          assets: assets // Full historical data for analysis
        },
        debt: {
          subtotal: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.DEBT_SUBTOTAL][actualColIndex])),
          debts: debts // Full historical data for analysis
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

// Format currency in short format (e.g., ₹1.2L, ₹5.3Cr)
export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toFixed(0)}`;
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

// Asset class mapping — maps exact investment names to their asset class
export const INVESTMENT_ASSET_CLASS_MAP: Record<string, string> = {
  'Bhive': 'Real Estate',
  'Aston grey': 'Real Estate',
  'Estates - Per Annum': 'Real Estate',
  'Mutual funds': 'Stock Market',
  'Equity': 'Stock Market',
  'US Stocks': 'Stock Market',
  'Walmart shares': 'Stock Market',
  'EPF': 'Government',
  'NPS': 'Government',
  'BetterInvest': 'Alternate',
  'Liquid funds': 'Liquid',
  'Gold': 'Gold',
};

export const getInvestmentAssetClass = (name: string): string => {
  return INVESTMENT_ASSET_CLASS_MAP[name] ?? 'Other';
};

// PROJECTION UTILITIES

/**
 * Analyzes historical growth patterns to inform projections
 */
// Base monthly savings (current year) - no UI input; configurable via env with fallback
export const getBaseMonthlySavingsINR = (): number => {
  const envValue = process.env.NEXT_PUBLIC_BASE_MONTHLY_SAVINGS;
  const parsed = envValue ? parseFloat(envValue) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 150000; // default ₹1.5L
};

// Estimate monthly savings for a given historical index, assuming +10% per year
// i: index in data (0..N-1); N-1 is latest
export const estimateHistoricalMonthlySavings = (dataLength: number, i: number): number => {
  const monthsFromEnd = (dataLength - 1) - i;
  const yearsBack = Math.floor(monthsFromEnd / 12);
  const base = getBaseMonthlySavingsINR();
  return base / Math.pow(1.1, yearsBack);
};

export const analyzeHistoricalGrowth = (data: NetWorthEntry[]): GrowthAnalysis => {
  if (!data.length) {
    return {
      averageMonthlyGrowthRate: 0,
      medianMonthlyGrowthRate: 0,
      standardDeviation: 0,
      consistencyScore: 0,
      volatilityIndex: 0,
      trendDirection: 'neutral'
    };
  }

  // Calculate month-over-month percentage returns excluding contributions
  const growthRates: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const prevNW = data[i - 1].netWorth;
    const currNW = data[i].netWorth;
    if (!prevNW || prevNW <= 0) continue;
    const assumedSaving = estimateHistoricalMonthlySavings(data.length, i);
    const monthlyReturnDecimal = (currNW - prevNW - assumedSaving) / prevNW; // decimal
    growthRates.push(monthlyReturnDecimal * 100); // store as percent
  }

  if (!growthRates.length) {
    return {
      averageMonthlyGrowthRate: 0,
      medianMonthlyGrowthRate: 0,
      standardDeviation: 0,
      consistencyScore: 0,
      volatilityIndex: 0,
      trendDirection: 'neutral'
    };
  }

  // Calculate mean
  const sum = growthRates.reduce((acc, rate) => acc + rate, 0);
  const average = sum / growthRates.length; // percent

  // Calculate median
  const sorted = [...growthRates].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // Calculate standard deviation
  const squaredDifferences = growthRates.map(rate => Math.pow(rate - average, 2));
  const variance = squaredDifferences.reduce((acc, sq) => acc + sq, 0) / growthRates.length;
  const stdDev = Math.sqrt(variance);

  // Calculate consistency score (inverse of coefficient of variation)
  const coefficientOfVariation = Math.abs(stdDev / (average || 1));
  const consistencyScore = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 20)));

  // Calculate volatility index
  const volatilityIndex = Math.min(100, coefficientOfVariation * 20);

  // Determine trend direction
  const trendDirection: 'positive' | 'negative' | 'neutral' = 
    average > 0 ? 'positive' : average < 0 ? 'negative' : 'neutral';

  return {
    averageMonthlyGrowthRate: average, // percent
    medianMonthlyGrowthRate: median,   // percent
    standardDeviation: stdDev,         // percent std dev
    consistencyScore,
    volatilityIndex,
    trendDirection
  };
};

/**
 * Generates projection scenarios based on historical analysis and parameters
 */
export const generateProjectionScenarios = (
  historicalData: NetWorthEntry[],
  projectionYears: number,
  growthAnalysis: GrowthAnalysis,
  parameters: ProjectionParameters
): ProjectionScenario[] => {
  const currentNetWorth = historicalData[historicalData.length - 1]?.netWorth || 0;
  const baseGrowthRatePercent = growthAnalysis.averageMonthlyGrowthRate; // percent per month

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
    const adjustedGrowthRatePercent = baseGrowthRatePercent * scenario.growthMultiplier; // percent
    const monthlyInflationRate = parameters.annualInflationRate / 100 / 12; // decimal
    const monthlyReturnDecimal = (adjustedGrowthRatePercent / 100) - monthlyInflationRate; // real return decimal
    const projectionData: ProjectionDataPoint[] = [];
    
    // Generate monthly projections
    let currentValue = currentNetWorth;
    const lastHistoricalDate = new Date(historicalData[historicalData.length - 1]?.date || '');
    
    for (let month = 1; month <= projectionYears * 12; month++) {
      const projectionDate = new Date(lastHistoricalDate);
      projectionDate.setMonth(projectionDate.getMonth() + month);
      
      // Apply compound growth (real growth rate)
      currentValue = currentValue * (1 + monthlyReturnDecimal);
      
      // Add monthly savings with 10% annual step-up (nominal schedule, no inflation compounding here)
      const base = getBaseMonthlySavingsINR();
      const yearsForward = Math.floor((month - 1) / 12);
      const steppedSavings = base * Math.pow(1.1, yearsForward);
      currentValue += steppedSavings;
      
      projectionData.push({
        x: projectionDate.toISOString().substring(0, 7), // YYYY-MM format
        y: Math.round(currentValue),
        isProjected: true
      });
    }

    return {
      name: scenario.name,
      monthlyGrowthRate: monthlyReturnDecimal * 100, // percent
      data: projectionData,
      confidenceLevel: scenario.confidenceLevel
    };
  });
};

/**
 * Validates projection data for minimum requirements
 */
export const validateProjectionData = (data: NetWorthEntry[]): string | null => {
  if (!data.length) return "No historical data available for projections";
  if (data.length < 3) return "Minimum 3 months of data required for reliable projections";
  
  const hasValidGrowth = data.some(entry => entry.monthOverMonthChange && entry.monthOverMonthChange !== 0);
  if (!hasValidGrowth) return "No growth data found in historical records";
  
  return null;
};

