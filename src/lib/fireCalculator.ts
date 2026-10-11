// Pure mathematical calculation engine for FIRE and Post-FIRE Financial Independence

import {
  FireParameters,
  FireCalculationResult,
  FireMilestone,
  PostFireYearData,
  PostFireAnalytics,
  StressTestResult,
  AccumulationDataPoint,
} from './fireTypes';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Calculates comprehensive FIRE and Post-FIRE analytics
 */
export function calculateFire(params: FireParameters): FireCalculationResult {
  const {
    currentPortfolio,
    monthlyExpense,
    yearlyExpense,
    expectedAnnualReturn,
    inflationRate,
    safeWithdrawalRate,
    currentAge,
    targetRetirementAge,
    monthlySavings,
    annualSavingsStepUp,
  } = params;

  // 1. Effective annual and monthly rates
  const rNominal = Math.max(0, expectedAnnualReturn) / 100;
  const iInflation = Math.max(0, inflationRate) / 100;
  const swr = Math.max(0.01, safeWithdrawalRate) / 100;

  // Real return rate via Fisher equation: (1 + r) / (1 + i) - 1
  const rReal = (1 + rNominal) / (1 + iInflation) - 1;
  const realReturnRatePercent = rReal * 100;

  // Multiplier, e.g. 25x for 4% SWR
  const swrMultiplier = swr > 0 ? 1 / swr : 25;

  // 2. Base FIRE targets (in today's purchasing power)
  const effectiveMonthlyExpense = monthlyExpense > 0 ? monthlyExpense : Math.round(yearlyExpense / 12);
  const effectiveYearlyExpense =
    yearlyExpense > 0 && Math.abs(yearlyExpense - effectiveMonthlyExpense * 12) < 50
      ? yearlyExpense
      : effectiveMonthlyExpense * 12;
  const standardFireNumber = Math.round(effectiveYearlyExpense * swrMultiplier);
  const leanFireNumber = Math.round(standardFireNumber * 0.75); // 75% bare-bones lifestyle
  const fatFireNumber = Math.round(standardFireNumber * 1.30);  // 130% luxury & buffer
  const baristaFireNumber = Math.round(standardFireNumber * 0.50); // 50% passive, 50% active

  // Coast FIRE: Amount needed today so compound growth hits Standard FIRE at retirement age with ₹0 further savings
  const yearsToRetirementAge = Math.max(0, targetRetirementAge - currentAge);
  const coastDiscountFactor = Math.pow(1 + rReal, yearsToRetirementAge);
  const coastFireNumber = Math.round(
    coastDiscountFactor > 0 ? standardFireNumber / coastDiscountFactor : standardFireNumber
  );

  // 3. Current Progress and Milestones
  const currentProgressPercentage =
    standardFireNumber > 0 ? (currentPortfolio / standardFireNumber) * 100 : 100;
  const gapToStandardFire = Math.max(0, standardFireNumber - currentPortfolio);
  const isFireAchieved = currentPortfolio >= standardFireNumber;

  // Current passive monthly income generated at chosen SWR
  const currentMonthlyPassiveIncome = Math.round((currentPortfolio * swr) / 12);

  // Milestones breakdown
  const milestones: FireMilestone[] = [
    {
      type: 'coast',
      title: 'Coast FIRE',
      tagline: 'Zero Future Savings Required',
      description: `Invested corpus today will compound to full FIRE at age ${targetRetirementAge} without adding another rupee.`,
      targetCorpus: coastFireNumber,
      monthlyExpense: Math.round(effectiveMonthlyExpense),
      yearlyExpense: Math.round(effectiveYearlyExpense),
      progressPercentage: Math.min(
        100,
        coastFireNumber > 0 ? (currentPortfolio / coastFireNumber) * 100 : 100
      ),
      isAchieved: currentPortfolio >= coastFireNumber,
      surplusOrDeficit: currentPortfolio - coastFireNumber,
      badgeLabel: currentPortfolio >= coastFireNumber ? 'Freedom Secured' : 'In Progress',
    },
    {
      type: 'barista',
      title: 'Barista FIRE',
      tagline: 'Semi-Retirement / Passion Work',
      description: '50% of living expenses covered by investments; remaining 50% from passion projects or low-stress work.',
      targetCorpus: baristaFireNumber,
      monthlyExpense: Math.round(effectiveMonthlyExpense * 0.5),
      yearlyExpense: Math.round(effectiveYearlyExpense * 0.5),
      progressPercentage: Math.min(
        100,
        baristaFireNumber > 0 ? (currentPortfolio / baristaFireNumber) * 100 : 100
      ),
      isAchieved: currentPortfolio >= baristaFireNumber,
      surplusOrDeficit: currentPortfolio - baristaFireNumber,
      badgeLabel: currentPortfolio >= baristaFireNumber ? 'Freedom Secured' : 'In Progress',
    },
    {
      type: 'lean',
      title: 'Lean FIRE',
      tagline: 'Essential Survival Freedom',
      description: 'Covers 75% of your current budget. Guarantees complete baseline independence and security.',
      targetCorpus: leanFireNumber,
      monthlyExpense: Math.round(effectiveMonthlyExpense * 0.75),
      yearlyExpense: Math.round(effectiveYearlyExpense * 0.75),
      progressPercentage: Math.min(
        100,
        leanFireNumber > 0 ? (currentPortfolio / leanFireNumber) * 100 : 100
      ),
      isAchieved: currentPortfolio >= leanFireNumber,
      surplusOrDeficit: currentPortfolio - leanFireNumber,
      badgeLabel: currentPortfolio >= leanFireNumber ? 'Freedom Secured' : 'In Progress',
    },
    {
      type: 'standard',
      title: 'Standard FIRE',
      tagline: 'Complete Lifestyle Independence',
      description: 'Fully sustains 100% of your current lifestyle indefinitely with complete work optionality.',
      targetCorpus: standardFireNumber,
      monthlyExpense: Math.round(effectiveMonthlyExpense),
      yearlyExpense: Math.round(effectiveYearlyExpense),
      progressPercentage: Math.min(100, currentProgressPercentage),
      isAchieved: isFireAchieved,
      surplusOrDeficit: currentPortfolio - standardFireNumber,
      badgeLabel: isFireAchieved ? 'Freedom Secured' : 'In Progress',
    },
    {
      type: 'fat',
      title: 'Fat FIRE',
      tagline: 'Abundance & Luxury Freedom',
      description: 'Provides 130% of current expenses with generous buffers for luxury travel, upgrades, and gifts.',
      targetCorpus: fatFireNumber,
      monthlyExpense: Math.round(effectiveMonthlyExpense * 1.3),
      yearlyExpense: Math.round(effectiveYearlyExpense * 1.3),
      progressPercentage: Math.min(
        100,
        fatFireNumber > 0 ? (currentPortfolio / fatFireNumber) * 100 : 100
      ),
      isAchieved: currentPortfolio >= fatFireNumber,
      surplusOrDeficit: currentPortfolio - fatFireNumber,
      badgeLabel: currentPortfolio >= fatFireNumber ? 'Freedom Secured' : 'In Progress',
    },
  ];

  // 4. Multi-Decade Post-FIRE Compounding Trajectory (30 Years)
  const currentCalendarYear = new Date().getFullYear();
  const postFireTrajectory: PostFireYearData[] = [];
  let postBalance = currentPortfolio;
  let cumulativeWithdrawals = 0;
  const projectionHorizonYears = 30;

  for (let y = 1; y <= projectionHorizonYears; y++) {
    const calendarYear = currentCalendarYear + y;
    const age = currentAge + y;
    const startBal = postBalance;

    // Withdrawal in year y adjusted for inflation
    const annualWithdrawal = effectiveYearlyExpense * Math.pow(1 + iInflation, y - 1);
    cumulativeWithdrawals += annualWithdrawal;

    // Investment return during the year
    // Modeling mid-year withdrawal convention: returns earned on (startBal - withdrawal/2)
    const investableBase = Math.max(0, startBal - annualWithdrawal / 2);
    const annualReturn = investableBase * rNominal;

    const endBal = Math.max(0, startBal + annualReturn - annualWithdrawal);
    const realPower = endBal / Math.pow(1 + iInflation, y);
    const netSurplus = annualReturn - annualWithdrawal;

    postFireTrajectory.push({
      year: y,
      calendarYear,
      age,
      startBalance: Math.round(startBal),
      annualReturnAmount: Math.round(annualReturn),
      annualWithdrawalAmount: Math.round(annualWithdrawal),
      endBalance: Math.round(endBal),
      realPurchasingPower: Math.round(realPower),
      cumulativeWithdrawals: Math.round(cumulativeWithdrawals),
      netSurplusAnnual: Math.round(netSurplus),
    });

    postBalance = endBal;
  }

  // 5. Post-FIRE Analytics & Stress Testing
  const guiltFreeYearlyAllowance = Math.round(currentPortfolio * swr);
  const guiltFreeMonthlyAllowance = Math.round(guiltFreeYearlyAllowance / 12);
  const annualReturnCurrent = currentPortfolio * rNominal;
  const netAnnualGrowthAmount = Math.round(annualReturnCurrent - effectiveYearlyExpense);
  const netRealSurplusRate = realReturnRatePercent - safeWithdrawalRate;
  const perpetualRunway = netRealSurplusRate > 0;

  // Estimate runway if not perpetual
  let runwayYears: number | 'Infinite' = 'Infinite';
  if (!perpetualRunway) {
    const exhaustedYear = postFireTrajectory.find((d) => d.endBalance <= 0);
    runwayYears = exhaustedYear ? exhaustedYear.year : 'Infinite';
  }

  const final30y = postFireTrajectory[postFireTrajectory.length - 1];
  const generationalWealth30y = final30y ? final30y.endBalance : 0;
  const generationalWealthReal30y = final30y ? final30y.realPurchasingPower : 0;
  const totalLifestyleFunded30y = final30y ? final30y.cumulativeWithdrawals : 0;
  const reinvestmentRatePercent =
    annualReturnCurrent > 0
      ? Math.max(0, Math.min(100, (netAnnualGrowthAmount / annualReturnCurrent) * 100))
      : 0;

  // Stress tests
  const stressTest25Percent: StressTestResult = runStressTest(
    'Market Correction (-25%)',
    25,
    currentPortfolio,
    effectiveYearlyExpense,
    rNominal
  );
  const stressTest40Percent: StressTestResult = runStressTest(
    'Severe Recession Crash (-40%)',
    40,
    currentPortfolio,
    effectiveYearlyExpense,
    rNominal
  );

  const postFireAnalytics: PostFireAnalytics = {
    isFireAttained: isFireAchieved,
    freedomRatio: standardFireNumber > 0 ? currentPortfolio / standardFireNumber : 1,
    guiltFreeMonthlyAllowance,
    guiltFreeYearlyAllowance,
    netAnnualGrowthAmount,
    netRealSurplusRate: parseFloat(netRealSurplusRate.toFixed(2)),
    perpetualRunway,
    runwayYears,
    generationalWealth30y,
    generationalWealthReal30y,
    totalLifestyleFunded30y,
    reinvestmentRatePercent: parseFloat(reinvestmentRatePercent.toFixed(1)),
    stressTest25Percent,
    stressTest40Percent,
  };

  // 6. Accumulation Trajectory (for Path to FIRE & Horizon Planning)
  const { accumulationTrajectory, crossoverPoint, yearsToFire, monthsToFire, projectedFireDate, projectedFireAge } =
    simulateAccumulation(
      currentPortfolio,
      standardFireNumber,
      monthlySavings,
      annualSavingsStepUp,
      rNominal,
      iInflation,
      currentAge,
      currentCalendarYear,
      isFireAchieved
    );

  return {
    parameters: params,
    standardFireNumber,
    leanFireNumber,
    fatFireNumber,
    coastFireNumber,
    baristaFireNumber,
    realReturnRate: parseFloat(realReturnRatePercent.toFixed(2)),
    swrMultiplier: parseFloat(swrMultiplier.toFixed(1)),
    currentProgressPercentage: parseFloat(currentProgressPercentage.toFixed(1)),
    gapToStandardFire,
    currentMonthlyPassiveIncome,
    yearsToFire,
    monthsToFire,
    projectedFireDate,
    projectedFireAge,
    isFireAchieved,
    milestones,
    postFireAnalytics,
    postFireTrajectory,
    accumulationTrajectory,
    crossoverPoint,
  };
}

/**
 * Runs stress testing on the portfolio
 */
function runStressTest(
  scenarioName: string,
  dropPercent: number,
  portfolio: number,
  yearlyExpense: number,
  expectedReturnRate: number
): StressTestResult {
  const postDropPortfolio = portfolio * (1 - dropPercent / 100);
  const newWithdrawalRate = postDropPortfolio > 0 ? (yearlyExpense / postDropPortfolio) * 100 : 100;
  const isStillSafe = newWithdrawalRate <= 5.5;

  // Simple rebound time estimate back to previous high
  // P_drop * (1 + r)^t = P_orig => (1 + r)^t = 1 / (1 - drop)
  const reboundYears =
    expectedReturnRate > 0
      ? Math.log(1 / (1 - dropPercent / 100)) / Math.log(1 + expectedReturnRate)
      : 5;

  const safetyMessage = isStillSafe
    ? `Safe & Resilient: Even after a ${dropPercent}% crash, your withdrawal rate rises to only ${newWithdrawalRate.toFixed(1)}%, well within sustainable recovery limits.`
    : `Caution: A ${dropPercent}% drawdown pushes withdrawal rate to ${newWithdrawalRate.toFixed(1)}%. Temporarily trimming discretionary expenses by 15% would restore complete safety.`;

  return {
    scenarioName,
    marketDropPercent: dropPercent,
    postDropPortfolio: Math.round(postDropPortfolio),
    newWithdrawalRate: parseFloat(newWithdrawalRate.toFixed(2)),
    isStillSafe,
    reboundYearsEstimate: parseFloat(reboundYears.toFixed(1)),
    safetyMessage,
  };
}

/**
 * Month-by-month accumulation simulation
 */
function simulateAccumulation(
  initialPortfolio: number,
  targetFireNumber: number,
  monthlySavings: number,
  annualSavingsStepUp: number,
  rNominal: number,
  iInflation: number,
  currentAge: number,
  currentCalendarYear: number,
  alreadyAchieved: boolean
) {
  const rMonthly = Math.pow(1 + rNominal, 1 / 12) - 1;
  const iMonthly = Math.pow(1 + iInflation, 1 / 12) - 1;
  const stepUpAnnual = Math.max(0, annualSavingsStepUp) / 100;

  const currentMonthIdx = new Date().getMonth();
  const maxSimulationMonths = 40 * 12; // 40 years max

  let balance = initialPortfolio;
  let totalContributed = initialPortfolio;
  let currentMonthlySip = monthlySavings;

  let crossoverMonthIndex = alreadyAchieved ? 0 : -1;
  let crossoverData: {
    calendarYear: number;
    monthDate: string;
    age: number;
    portfolioValue: number;
  } | null = alreadyAchieved
    ? {
        calendarYear: currentCalendarYear,
        monthDate: `${MONTH_NAMES[currentMonthIdx]} ${currentCalendarYear}`,
        age: currentAge,
        portfolioValue: Math.round(initialPortfolio),
      }
    : null;

  const trajectory: AccumulationDataPoint[] = [];

  for (let m = 0; m <= maxSimulationMonths; m++) {
    const yearOffset = Math.floor(m / 12);
    const monthInYear = (currentMonthIdx + (m % 12)) % 12;
    const calendarYear = currentCalendarYear + Math.floor((currentMonthIdx + m) / 12);
    const age = currentAge + yearOffset;
    const monthDate = `${MONTH_NAMES[monthInYear]} ${calendarYear}`;

    // Target corpus inflates with time
    const fireTargetNominal = targetFireNumber * Math.pow(1 + iMonthly, m);
    const fireTargetReal = targetFireNumber;

    const isCrossover = crossoverMonthIndex === m;

    // Record sample points (annually + crossover point)
    if (m % 12 === 0 || isCrossover || m === maxSimulationMonths) {
      trajectory.push({
        yearIndex: yearOffset,
        calendarYear,
        age,
        monthDate,
        portfolioValue: Math.round(balance),
        totalContributions: Math.round(totalContributed),
        fireTargetNominal: Math.round(fireTargetNominal),
        fireTargetReal: Math.round(fireTargetReal),
        isCrossoverYear: isCrossover,
      });
    }

    // Check crossover if not found yet
    if (!alreadyAchieved && crossoverMonthIndex === -1 && balance >= fireTargetNominal) {
      crossoverMonthIndex = m;
      crossoverData = {
        calendarYear,
        monthDate,
        age,
        portfolioValue: Math.round(balance),
      };
    }

    // Step up SIP annually
    if (m > 0 && m % 12 === 0) {
      currentMonthlySip = currentMonthlySip * (1 + stepUpAnnual);
    }

    // Monthly compounding step
    balance = (balance + currentMonthlySip) * (1 + rMonthly);
    totalContributed += currentMonthlySip;
  }

  const monthsToFire = crossoverMonthIndex >= 0 ? crossoverMonthIndex : maxSimulationMonths;
  const yearsToFire = parseFloat((monthsToFire / 12).toFixed(1));
  const projectedFireAge = currentAge + Math.floor(monthsToFire / 12);
  const projectedFireDate = crossoverData ? crossoverData.monthDate : 'Beyond 40 Years';

  return {
    accumulationTrajectory: trajectory,
    crossoverPoint: crossoverData,
    yearsToFire,
    monthsToFire,
    projectedFireDate,
    projectedFireAge,
  };
}
