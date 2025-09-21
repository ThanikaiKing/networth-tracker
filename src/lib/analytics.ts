// Advanced analytics utilities for detailed financial analysis

import { NetWorthEntry } from './types';

export interface AssetAllocationData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DebtAnalytics {
  totalDebt: number;
  debtToAssetRatio: number;
  monthlyReduction: number;
  projectedPayoffMonths?: number;
}

export interface PerformanceMetrics {
  cagr: number;
  volatility: number;
  maxDrawdown: number;
  bestMonth: { date: string; change: number };
  worstMonth: { date: string; change: number };
  averageMonthlyGrowth: number;
}

// Calculate asset allocation from the latest entry
export const calculateAssetAllocation = (latestEntry: NetWorthEntry): AssetAllocationData[] => {
  const total = latestEntry.totalAssets;
  
  if (total === 0) return [];

  const allocation = [
    {
      category: 'Bank Accounts',
      value: latestEntry.bankAccounts.subtotal,
      percentage: (latestEntry.bankAccounts.subtotal / total) * 100,
      color: '#3B82F6' // Blue
    },
    {
      category: 'Investments',
      value: latestEntry.investments.subtotal,
      percentage: (latestEntry.investments.subtotal / total) * 100,
      color: '#10B981' // Green
    },
    {
      category: 'Other Assets',
      value: latestEntry.otherAssets.subtotal,
      percentage: (latestEntry.otherAssets.subtotal / total) * 100,
      color: '#8B5CF6' // Purple
    }
  ];

  return allocation.filter(item => item.value > 0);
};

// Extract time-series data for asset categories
export const extractAssetCategoryData = (entries: NetWorthEntry[]) => {
  const dates = entries.map(entry => entry.date);
  
  return {
    dates,
    bankAccounts: entries.map(entry => entry.bankAccounts.subtotal),
    investments: entries.map(entry => entry.investments.subtotal),
    otherAssets: entries.map(entry => entry.otherAssets.subtotal)
  };
};

// Calculate debt analytics
export const calculateDebtAnalytics = (entries: NetWorthEntry[]): DebtAnalytics => {
  if (entries.length === 0) {
    return {
      totalDebt: 0,
      debtToAssetRatio: 0,
      monthlyReduction: 0
    };
  }

  const latest = entries[entries.length - 1];
  const totalDebt = latest.totalDebt;
  const debtToAssetRatio = (totalDebt / latest.totalAssets) * 100;
  
  // Calculate average monthly debt reduction
  let monthlyReduction = 0;
  if (entries.length > 1) {
    const first = entries[0];
    const periods = entries.length - 1;
    monthlyReduction = (first.totalDebt - totalDebt) / periods;
  }

  // Estimate payoff timeline (if debt is being reduced)
  let projectedPayoffMonths: number | undefined;
  if (monthlyReduction > 0 && totalDebt > 0) {
    projectedPayoffMonths = Math.ceil(totalDebt / monthlyReduction);
  }

  return {
    totalDebt,
    debtToAssetRatio,
    monthlyReduction,
    projectedPayoffMonths
  };
};

// Extract debt category data for visualization
export const extractDebtCategoryData = (entries: NetWorthEntry[]) => {
  const dates = entries.map(entry => entry.date);
  const totalDebt = entries.map(entry => entry.totalDebt);
  const debtToAssetRatio = entries.map(entry => 
    (entry.totalDebt / entry.totalAssets) * 100
  );

  return {
    dates,
    totalDebt,
    debtToAssetRatio
  };
};

// Calculate compound annual growth rate
export const calculateCAGR = (initialValue: number, finalValue: number, periods: number): number => {
  if (periods === 0 || initialValue === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / periods) - 1) * 100;
};

// Calculate volatility (standard deviation of returns)
export const calculateVolatility = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const returns = values.slice(1).map((val, i) => (val - values[i]) / values[i]);
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100;
};

// Calculate maximum drawdown
export const calculateMaxDrawdown = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  let maxDrawdown = 0;
  let peak = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    } else {
      const drawdown = ((peak - values[i]) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
};

// Get best and worst performing months
export const getPerformanceHighlights = (entries: NetWorthEntry[]) => {
  const validChanges = entries
    .map((entry, index) => ({ 
      date: entry.date, 
      change: entry.monthOverMonthChange || 0,
      index 
    }))
    .filter(item => item.change !== 0);
    
  if (validChanges.length === 0) {
    return {
      bestMonth: { date: '', change: 0 },
      worstMonth: { date: '', change: 0 }
    };
  }

  const bestMonth = validChanges.reduce((max, curr) => 
    curr.change > max.change ? curr : max
  );
  
  const worstMonth = validChanges.reduce((min, curr) => 
    curr.change < min.change ? curr : min
  );
  
  return { bestMonth, worstMonth };
};

// Calculate comprehensive performance metrics
export const calculatePerformanceMetrics = (entries: NetWorthEntry[]): PerformanceMetrics => {
  if (entries.length < 2) {
    return {
      cagr: 0,
      volatility: 0,
      maxDrawdown: 0,
      bestMonth: { date: '', change: 0 },
      worstMonth: { date: '', change: 0 },
      averageMonthlyGrowth: 0
    };
  }

  const netWorthValues = entries.map(entry => entry.netWorth);
  const monthlyChanges = entries.map(entry => entry.monthOverMonthChange || 0).filter(change => change !== 0);
  
  const cagr = calculateCAGR(netWorthValues[0], netWorthValues[netWorthValues.length - 1], entries.length - 1);
  const volatility = calculateVolatility(netWorthValues);
  const maxDrawdown = calculateMaxDrawdown(netWorthValues);
  const { bestMonth, worstMonth } = getPerformanceHighlights(entries);
  const averageMonthlyGrowth = monthlyChanges.length > 0 
    ? monthlyChanges.reduce((a, b) => a + b, 0) / monthlyChanges.length 
    : 0;

  return {
    cagr,
    volatility,
    maxDrawdown,
    bestMonth,
    worstMonth,
    averageMonthlyGrowth
  };
};

// Format large numbers with appropriate suffixes
export const formatLargeNumber = (value: number): string => {
  if (value >= 10000000) { // 1 crore
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) { // 1 lakh
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) { // 1 thousand
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

// Generate color palette for charts
export const generateColorPalette = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#F59E0B', // Yellow
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#84CC16'  // Lime
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors if needed
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return colors;
};

// Risk level classification
export const classifyRiskLevel = (debtToAssetRatio: number): { 
  level: 'low' | 'medium' | 'high'; 
  color: string; 
  description: string 
} => {
  if (debtToAssetRatio < 20) {
    return {
      level: 'low',
      color: '#10B981',
      description: 'Excellent debt management'
    };
  } else if (debtToAssetRatio < 40) {
    return {
      level: 'medium', 
      color: '#F59E0B',
      description: 'Moderate debt levels'
    };
  } else {
    return {
      level: 'high',
      color: '#EF4444',
      description: 'High debt risk - focus on reduction'
    };
  }
};

// Asset allocation health score
export const calculateAllocationScore = (allocation: AssetAllocationData[]): {
  score: number;
  feedback: string;
} => {
  const bankPercentage = allocation.find(a => a.category === 'Bank Accounts')?.percentage || 0;
  const investmentPercentage = allocation.find(a => a.category === 'Investments')?.percentage || 0;
  const assetPercentage = allocation.find(a => a.category === 'Other Assets')?.percentage || 0;

  let score = 0;
  let feedback = '';

  // Ideal allocation rough guidelines (can be customized)
  if (investmentPercentage >= 30 && investmentPercentage <= 70) score += 40;
  if (bankPercentage >= 5 && bankPercentage <= 30) score += 30;
  if (assetPercentage >= 20 && assetPercentage <= 60) score += 30;

  if (score >= 80) {
    feedback = 'Excellent asset allocation balance';
  } else if (score >= 60) {
    feedback = 'Good diversification with room for optimization';
  } else if (score >= 40) {
    feedback = 'Consider rebalancing your portfolio';
  } else {
    feedback = 'Review allocation strategy for better diversification';
  }

  return { score, feedback };
};
