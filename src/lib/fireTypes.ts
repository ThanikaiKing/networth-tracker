// TypeScript types and interfaces for FIRE and Post-FIRE Calculator

export interface FireParameters {
  currentPortfolio: number;       // In ₹ (defaults to live Total Investment Value)
  monthlyExpense: number;         // In ₹
  yearlyExpense: number;          // In ₹ (synced with monthlyExpense * 12)
  expectedAnnualReturn: number;   // Percentage, e.g., 12.0
  inflationRate: number;          // Percentage, e.g., 6.0
  safeWithdrawalRate: number;     // Percentage, e.g., 4.0 (25x) or 3.33 (30x)
  currentAge: number;             // e.g., 32
  targetRetirementAge: number;    // e.g., 45
  monthlySavings: number;         // Optional SIP in ₹
  annualSavingsStepUp: number;    // Percentage annual SIP increment, e.g., 5.0
}

export type FireTierType = 'coast' | 'barista' | 'lean' | 'standard' | 'fat';

export interface FireMilestone {
  type: FireTierType;
  title: string;
  tagline: string;
  description: string;
  targetCorpus: number;
  monthlyExpense: number;
  yearlyExpense: number;
  progressPercentage: number;
  isAchieved: boolean;
  surplusOrDeficit: number;
  projectedReachYear?: number;
  projectedReachMonth?: string;
  badgeLabel: string;
}

export interface PostFireYearData {
  year: number;                   // e.g., 1, 2, 3 ...
  calendarYear: number;           // e.g., 2026, 2027 ...
  age: number;                    // e.g., 33, 34 ...
  startBalance: number;           // In ₹
  annualReturnAmount: number;     // In ₹ (nominal gain)
  annualWithdrawalAmount: number; // In ₹ (inflation-escalated living expense)
  endBalance: number;             // In ₹ (startBalance + annualReturn - annualWithdrawal)
  realPurchasingPower: number;    // In ₹ (discounted back by cumulative inflation)
  cumulativeWithdrawals: number;  // In ₹
  netSurplusAnnual: number;       // annualReturnAmount - annualWithdrawalAmount
}

export interface PostFireAnalytics {
  isFireAttained: boolean;
  freedomRatio: number;               // Portfolio / Standard FIRE Number (e.g., 1.35 = 135%)
  guiltFreeMonthlyAllowance: number;  // Portfolio * (SWR / 100) / 12
  guiltFreeYearlyAllowance: number;   // Portfolio * (SWR / 100)
  netAnnualGrowthAmount: number;      // Annual growth minus annual expense
  netRealSurplusRate: number;         // (Real return % - SWR %)
  perpetualRunway: boolean;           // True if net real growth is positive
  runwayYears: number | 'Infinite';   // Number of years money lasts
  generationalWealth30y: number;      // Projected portfolio value in 30 years
  generationalWealthReal30y: number;  // Inflation-adjusted portfolio value in 30 years
  totalLifestyleFunded30y: number;    // Total spending funded over 30 years
  reinvestmentRatePercent: number;    // % of gross returns reinvested after spending
  stressTest25Percent: StressTestResult;
  stressTest40Percent: StressTestResult;
}

export interface StressTestResult {
  scenarioName: string;
  marketDropPercent: number;
  postDropPortfolio: number;
  newWithdrawalRate: number;          // Current expenses / postDropPortfolio * 100
  isStillSafe: boolean;               // If new withdrawal rate < 5.5%
  reboundYearsEstimate: number;       // Estimated years to recover at normal returns
  safetyMessage: string;
}

export interface AccumulationDataPoint {
  yearIndex: number;
  calendarYear: number;
  age: number;
  monthDate: string;
  portfolioValue: number;
  totalContributions: number;
  fireTargetNominal: number;
  fireTargetReal: number;
  isCrossoverYear: boolean;
}

export interface FireCalculationResult {
  parameters: FireParameters;
  standardFireNumber: number;
  leanFireNumber: number;
  fatFireNumber: number;
  coastFireNumber: number;
  baristaFireNumber: number;
  realReturnRate: number;             // ((1 + r) / (1 + i) - 1) * 100
  swrMultiplier: number;              // 100 / SWR (e.g., 25 for 4%)
  currentProgressPercentage: number;  // (currentPortfolio / standardFireNumber) * 100
  gapToStandardFire: number;          // Math.max(0, standardFireNumber - currentPortfolio)
  currentMonthlyPassiveIncome: number;
  yearsToFire: number;
  monthsToFire: number;
  projectedFireDate: string;
  projectedFireAge: number;
  isFireAchieved: boolean;
  milestones: FireMilestone[];
  postFireAnalytics: PostFireAnalytics;
  postFireTrajectory: PostFireYearData[];
  accumulationTrajectory: AccumulationDataPoint[];
  crossoverPoint: {
    calendarYear: number;
    monthDate: string;
    age: number;
    portfolioValue: number;
  } | null;
}
