// Investment Analytics and Velocity Analysis
// Functions to calculate investment performance metrics, growth rates, and consistency scores

import { 
  InvestmentVelocity, 
  InvestmentAnalytics, 
  AssetClassAllocation, 
  NetWorthEntry, 
  DetailedInvestment,
  InvestmentCategory,
  RiskLevel,
  InvestmentTrend
} from './types';

/**
 * Calculate investment velocity metrics for a single investment
 */
export const calculateInvestmentVelocity = (
  investment: DetailedInvestment
): InvestmentVelocity => {
  const values = investment.values.filter(v => v > 0);
  
  if (values.length < 2) {
    return {
      name: investment.name,
      currentValue: investment.currentValue,
      growthRate: 0,
      absoluteGrowth: 0,
      consistencyScore: 0,
      riskScore: 'low',
      trend: 'stable',
      monthlyReturns: []
    };
  }

  // Calculate growth metrics
  const initialValue = values[0];
  const currentValue = values[values.length - 1];
  const absoluteGrowth = currentValue - initialValue;
  const growthRate = initialValue > 0 ? (absoluteGrowth / initialValue) * 100 : 0;

  // Calculate monthly returns
  const monthlyReturns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > 0) {
      const monthlyReturn = ((values[i] - values[i - 1]) / values[i - 1]) * 100;
      monthlyReturns.push(monthlyReturn);
    }
  }

  // Calculate consistency score (0-100, higher is more consistent)
  const consistencyScore = calculateConsistencyScore(monthlyReturns);

  // Determine risk score based on volatility
  const riskScore = calculateRiskScore(monthlyReturns);

  // Determine trend based on recent performance
  const trend = determineTrend(monthlyReturns);

  return {
    name: investment.name,
    currentValue,
    growthRate,
    absoluteGrowth,
    consistencyScore,
    riskScore,
    trend,
    monthlyReturns
  };
};

/**
 * Calculate consistency score based on standard deviation of monthly returns
 * Lower volatility = higher consistency score
 */
export const calculateConsistencyScore = (monthlyReturns: number[]): number => {
  if (monthlyReturns.length < 2) return 0;

  // Calculate mean return
  const meanReturn = monthlyReturns.reduce((sum, ret) => sum + ret, 0) / monthlyReturns.length;

  // Calculate standard deviation
  const variance = monthlyReturns.reduce((sum, ret) => {
    return sum + Math.pow(ret - meanReturn, 2);
  }, 0) / monthlyReturns.length;

  const standardDeviation = Math.sqrt(variance);

  // Convert to consistency score (0-100)
  // Lower standard deviation = higher consistency
  const maxStdDev = 20; // Assume max reasonable std dev is 20%
  const consistencyScore = Math.max(0, 100 - (standardDeviation / maxStdDev) * 100);

  return Math.round(consistencyScore * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate risk score based on volatility
 */
export const calculateRiskScore = (monthlyReturns: number[]): RiskLevel => {
  if (monthlyReturns.length < 2) return 'low';

  const standardDeviation = calculateStandardDeviation(monthlyReturns);

  // Risk classification based on monthly volatility
  if (standardDeviation <= 5) return 'low';      // <= 5% monthly volatility
  if (standardDeviation <= 15) return 'medium';  // 5-15% monthly volatility
  return 'high';                                 // > 15% monthly volatility
};

/**
 * Determine investment trend based on recent performance
 */
export const determineTrend = (monthlyReturns: number[]): InvestmentTrend => {
  if (monthlyReturns.length < 2) return 'stable';

  // Look at the last 3 months or all available data if less
  const recentReturns = monthlyReturns.slice(-3);
  const avgRecentReturn = recentReturns.reduce((sum, ret) => sum + ret, 0) / recentReturns.length;

  if (avgRecentReturn > 5) return 'up';      // Average > 5% growth
  if (avgRecentReturn < -2) return 'down';   // Average < -2% decline
  return 'stable';                           // Between -2% and 5%
};

/**
 * Calculate standard deviation helper function
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length < 2) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return Math.sqrt(variance);
};

/**
 * Categorize investments into asset classes
 */
export const categorizeInvestment = (name: string): InvestmentCategory => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('equity') || lowerName.includes('shares') || lowerName.includes('stock')) {
    return 'equity';
  }
  
  if (lowerName.includes('fd') || lowerName.includes('epf') || lowerName.includes('nps') || 
      lowerName.includes('fixed') || lowerName.includes('deposit')) {
    return 'debt';
  }
  
  if (lowerName.includes('gold') || lowerName.includes('real estate') || 
      lowerName.includes('land') || lowerName.includes('commodity') ||
      lowerName.includes('bhive') || lowerName.includes('aston grey') ||
      lowerName.includes('edyar')) {
    return 'alternative';
  }
  
  // Default to hybrid for mutual funds and other mixed instruments
  return 'hybrid';
};

/**
 * Calculate asset class allocation from investment data
 */
export const calculateAssetClassAllocation = (investments: DetailedInvestment[]): AssetClassAllocation => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  if (totalValue === 0) {
    return { equity: 0, debt: 0, hybrid: 0, alternative: 0 };
  }

  const allocation = { equity: 0, debt: 0, hybrid: 0, alternative: 0 };
  
  investments.forEach(investment => {
    const category = categorizeInvestment(investment.name);
    const percentage = (investment.currentValue / totalValue) * 100;
    allocation[category] += percentage;
  });

  return allocation;
};

/**
 * Calculate comprehensive investment analytics
 */
export const calculateInvestmentAnalytics = (data: NetWorthEntry[]): InvestmentAnalytics => {
  if (!data || data.length === 0) {
    return {
      totalInvestmentValue: 0,
      monthlyInvestmentGrowth: [],
      bestPerformer: createEmptyVelocity('N/A'),
      worstPerformer: createEmptyVelocity('N/A'),
      mostConsistent: createEmptyVelocity('N/A'),
      highestContributor: createEmptyVelocity('N/A'),
      portfolioAllocation: { equity: 0, debt: 0, hybrid: 0, alternative: 0 },
      diversificationScore: 0,
      overallRiskScore: 0,
      averageGrowthRate: 0
    };
  }

  // Extract investment data from NetWorthEntry format
  const investments = extractDetailedInvestments(data);

  // Calculate velocity for each investment
  const velocities = investments.map(inv => calculateInvestmentVelocity(inv));

  // Find best/worst performers
  const bestPerformer = velocities.reduce((best, current) => 
    current.growthRate > best.growthRate ? current : best, velocities[0] || createEmptyVelocity('N/A'));

  const worstPerformer = velocities.reduce((worst, current) => 
    current.growthRate < worst.growthRate ? current : worst, velocities[0] || createEmptyVelocity('N/A'));

  const mostConsistent = velocities.reduce((consistent, current) => 
    current.consistencyScore > consistent.consistencyScore ? current : consistent, 
    velocities[0] || createEmptyVelocity('N/A'));

  const highestContributor = velocities.reduce((contributor, current) => 
    current.absoluteGrowth > contributor.absoluteGrowth ? current : contributor, 
    velocities[0] || createEmptyVelocity('N/A'));

  // Calculate portfolio metrics
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  const monthlyInvestmentGrowth = data.map(entry => entry.investments.subtotal);
  
  const portfolioAllocation = calculateAssetClassAllocation(investments);
  
  const diversificationScore = calculateDiversificationScore(investments);
  
  const overallRiskScore = calculateOverallRiskScore(velocities);
  
  const averageGrowthRate = velocities.length > 0 
    ? velocities.reduce((sum, vel) => sum + vel.growthRate, 0) / velocities.length 
    : 0;

  return {
    totalInvestmentValue,
    monthlyInvestmentGrowth,
    bestPerformer,
    worstPerformer,
    mostConsistent,
    highestContributor,
    portfolioAllocation,
    diversificationScore,
    overallRiskScore,
    averageGrowthRate
  };
};

/**
 * Extract detailed investments from NetWorthEntry data
 */
export const extractDetailedInvestments = (data: NetWorthEntry[]): DetailedInvestment[] => {
  if (!data || data.length === 0) return [];

  // Get all unique investment names
  const investmentNames = new Set<string>();
  data.forEach(entry => {
    entry.investments.accounts.forEach(account => {
      investmentNames.add(account.name);
    });
  });

  // Create DetailedInvestment objects
  return Array.from(investmentNames).map(name => {
    const values: number[] = [];
    
    // Extract values for each month for this investment
    data.forEach(entry => {
      const account = entry.investments.accounts.find(acc => acc.name === name);
      if (account && account.values.length > 0) {
        // Use the latest value for each month
        values.push(account.values[account.values.length - 1]);
      } else {
        values.push(0);
      }
    });

    const currentValue = values[values.length - 1] || 0;
    const initialValue = values.find(v => v > 0) || 0;
    const growth = initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0;

    return {
      name,
      values,
      currentValue,
      growth,
      category: categorizeInvestment(name),
      riskLevel: 'medium' as RiskLevel, // Default, can be enhanced
      liquidity: 'short-term' as const,  // Default, can be enhanced
      taxStatus: 'taxable' as const      // Default, can be enhanced
    };
  }).filter(inv => inv.currentValue > 0); // Only include investments with current value
};

/**
 * Calculate diversification score (0-100)
 */
export const calculateDiversificationScore = (investments: DetailedInvestment[]): number => {
  if (investments.length === 0) return 0;

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  if (totalValue === 0) return 0;

  // Calculate Herfindahl-Hirschman Index (HHI) for concentration
  const hhi = investments.reduce((sum, inv) => {
    const share = (inv.currentValue / totalValue) * 100;
    return sum + Math.pow(share, 2);
  }, 0);

  // Convert HHI to diversification score (lower HHI = higher diversification)
  // HHI ranges from 0 to 10,000, we convert to 0-100 scale
  const maxHHI = 10000;
  const diversificationScore = 100 - (hhi / maxHHI) * 100;

  return Math.max(0, Math.min(100, Math.round(diversificationScore * 10) / 10));
};

/**
 * Calculate overall portfolio risk score
 */
export const calculateOverallRiskScore = (velocities: InvestmentVelocity[]): number => {
  if (velocities.length === 0) return 0;

  // Weight risk scores: low=1, medium=2, high=3
  const riskWeights = { low: 1, medium: 2, high: 3 };
  const totalValue = velocities.reduce((sum, vel) => sum + vel.currentValue, 0);
  
  if (totalValue === 0) return 0;

  const weightedRisk = velocities.reduce((sum, vel) => {
    const weight = vel.currentValue / totalValue;
    const riskValue = riskWeights[vel.riskScore];
    return sum + (weight * riskValue);
  }, 0);

  // Convert to 0-100 scale (3 being max risk)
  return Math.round((weightedRisk / 3) * 100 * 10) / 10;
};

/**
 * Create empty velocity object for fallback
 */
export const createEmptyVelocity = (name: string): InvestmentVelocity => ({
  name,
  currentValue: 0,
  growthRate: 0,
  absoluteGrowth: 0,
  consistencyScore: 0,
  riskScore: 'low',
  trend: 'stable',
  monthlyReturns: []
});

/**
 * Format growth rate for display
 */
export const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};

/**
 * Get trend emoji for display
 */
export const getTrendEmoji = (trend: InvestmentTrend): string => {
  switch (trend) {
    case 'up': return '📈';
    case 'down': return '📉';
    case 'stable': return '➡️';
    default: return '➡️';
  }
};

/**
 * Get risk color for UI display
 */
export const getRiskColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'low': return '#10B981';    // Green
    case 'medium': return '#F59E0B'; // Amber  
    case 'high': return '#EF4444';   // Red
    default: return '#6B7280';       // Gray
  }
};