// Investment Performance Cards - Display key investment insights and top performers

'use client';

import React from 'react';
import { InvestmentPerformanceCardsProps } from '@/lib/types';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import { 
  formatGrowthRate, 
  getTrendEmoji, 
  getRiskColor 
} from '@/lib/analytics';

export const InvestmentPerformanceCards: React.FC<InvestmentPerformanceCardsProps> = ({
  analytics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="glass-card rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-muted/30 rounded-lg w-3/4 mb-3"></div>
              <div className="h-8 bg-muted/20 rounded-lg w-1/2 mb-2"></div>
              <div className="h-3 bg-muted/10 rounded-lg w-full mb-2"></div>
              <div className="h-3 bg-muted/10 rounded-lg w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const {
    bestPerformer,
    mostConsistent,
    highestContributor,
    diversificationScore,
    overallRiskScore,
    averageGrowthRate,
    totalInvestmentValue
  } = analytics;

  const cards = [
    {
      title: '🏆 Top Performer',
      subtitle: 'Highest growth rate',
      value: bestPerformer.name,
      metric: formatGrowthRate(bestPerformer.growthRate),
      subMetric: formatCurrency(bestPerformer.currentValue),
      trend: getTrendEmoji(bestPerformer.trend),
      isPositive: bestPerformer.growthRate >= 0,
      borderColor: bestPerformer.growthRate >= 0 ? 'border-primary/30' : 'border-destructive/30',
      accentBg: bestPerformer.growthRate >= 0 ? 'bg-primary/10' : 'bg-destructive/10',
      accentText: bestPerformer.growthRate >= 0 ? 'text-primary' : 'text-destructive',
    },
    {
      title: '📈 Most Consistent',
      subtitle: 'Steadiest growth pattern',
      value: mostConsistent.name,
      metric: `${mostConsistent.consistencyScore.toFixed(1)} Score`,
      subMetric: formatGrowthRate(mostConsistent.growthRate),
      trend: getTrendEmoji(mostConsistent.trend),
      isPositive: true,
      borderColor: 'border-chart-2/30',
      accentBg: 'bg-chart-2/10',
      accentText: 'text-chart-2',
    },
    {
      title: '💰 Highest Contributor',
      subtitle: 'Largest absolute growth',
      value: highestContributor.name,
      metric: formatCurrency(highestContributor.absoluteGrowth),
      subMetric: formatCurrency(highestContributor.currentValue),
      trend: getTrendEmoji(highestContributor.trend),
      isPositive: highestContributor.absoluteGrowth >= 0,
      borderColor: highestContributor.absoluteGrowth >= 0 ? 'border-primary/30' : 'border-destructive/30',
      accentBg: highestContributor.absoluteGrowth >= 0 ? 'bg-primary/10' : 'bg-destructive/10',
      accentText: highestContributor.absoluteGrowth >= 0 ? 'text-primary' : 'text-destructive',
    },
    {
      title: '📊 Portfolio Health',
      subtitle: 'Overall metrics',
      value: 'Portfolio Overview',
      metric: `${averageGrowthRate.toFixed(1)}% Avg`,
      subMetric: `${diversificationScore.toFixed(0)}/100 Diversification`,
      trend: averageGrowthRate >= 0 ? '📈' : '📉',
      isPositive: true,
      borderColor: 'border-accent/30',
      accentBg: 'bg-accent/10',
      accentText: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`glass-card rounded-2xl p-5 border ${card.borderColor} hover-lift transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className={`text-sm font-semibold ${card.accentText} mb-0.5`}>
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground/70">
                  {card.subtitle}
                </p>
              </div>
              <span className="text-lg">{card.trend}</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-medium text-foreground truncate" title={card.value}>
                {card.value}
              </div>
              
              <div className={`text-xl font-bold tabular-nums ${card.accentText}`}>
                {card.metric}
              </div>
              
              <div className="text-xs text-muted-foreground/70 tabular-nums">
                {card.subMetric}
              </div>
            </div>

            {/* Risk indicator for individual investments */}
            {index < 3 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground/70">Risk Level</span>
                  <div className="flex items-center space-x-1.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: getRiskColor(
                          index === 0 ? bestPerformer.riskScore :
                          index === 1 ? mostConsistent.riskScore :
                          highestContributor.riskScore
                        ) 
                      }}
                    />
                    <span className="capitalize text-muted-foreground">
                      {index === 0 ? bestPerformer.riskScore :
                       index === 1 ? mostConsistent.riskScore :
                       highestContributor.riskScore}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio overview metrics for the 4th card */}
            {index === 3 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground/70">Risk Score:</span>
                    <span className="font-medium text-foreground tabular-nums">{overallRiskScore.toFixed(0)}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground/70">Total Value:</span>
                    <span className="font-medium text-foreground tabular-nums">{formatCurrencyShort(totalInvestmentValue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Performance Analysis */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-accent"></div>
              Performance Analysis
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed breakdown of investment metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Performer Details */}
          <div className="glass rounded-xl p-5 border border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🏆</span>
              <div>
                <h4 className="font-medium text-primary">Best Performer</h4>
                <p className="text-sm text-muted-foreground">{bestPerformer.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Growth Rate:</span>
                <span className={`font-semibold tabular-nums ${bestPerformer.growthRate >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatGrowthRate(bestPerformer.growthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Current Value:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrencyShort(bestPerformer.currentValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Absolute Growth:</span>
                <span className={`font-semibold tabular-nums ${bestPerformer.absoluteGrowth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(bestPerformer.absoluteGrowth)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Consistency:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {bestPerformer.consistencyScore.toFixed(1)}/100
                </span>
              </div>
            </div>
          </div>

          {/* Most Consistent Details */}
          <div className="glass rounded-xl p-5 border border-chart-2/20">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-medium text-chart-2">Most Consistent</h4>
                <p className="text-sm text-muted-foreground">{mostConsistent.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Consistency Score:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {mostConsistent.consistencyScore.toFixed(1)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Growth Rate:</span>
                <span className={`font-semibold tabular-nums ${mostConsistent.growthRate >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatGrowthRate(mostConsistent.growthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Current Value:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrencyShort(mostConsistent.currentValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Risk Level:</span>
                <span className="font-semibold text-foreground capitalize">
                  {mostConsistent.riskScore}
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="glass rounded-xl p-5 border border-accent/20">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-medium text-accent">Portfolio Health</h4>
                <p className="text-sm text-muted-foreground">Overall metrics</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Avg Growth:</span>
                <span className={`font-semibold tabular-nums ${averageGrowthRate >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatGrowthRate(averageGrowthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Diversification:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {diversificationScore.toFixed(0)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Risk Score:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {overallRiskScore.toFixed(0)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Total Value:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrencyShort(totalInvestmentValue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Recommendations */}
        <div className="mt-6 p-4 glass rounded-xl border border-chart-2/20">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-chart-2/10">
              <svg className="w-4 h-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-chart-2 mb-2">Investment Insights & Recommendations</div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                {averageGrowthRate > 10 && (
                  <div className="flex items-center gap-2">
                    <span className="text-chart-2/70">•</span>
                    <span>Excellent portfolio performance with {averageGrowthRate.toFixed(1)}% average growth!</span>
                  </div>
                )}
                {diversificationScore < 60 && (
                  <div className="flex items-center gap-2">
                    <span className="text-chart-2/70">•</span>
                    <span>Consider diversifying your portfolio across more investment types</span>
                  </div>
                )}
                {overallRiskScore > 70 && (
                  <div className="flex items-center gap-2">
                    <span className="text-chart-2/70">•</span>
                    <span>Your portfolio has high risk - consider balancing with safer investments</span>
                  </div>
                )}
                {bestPerformer.growthRate > 20 && (
                  <div className="flex items-center gap-2">
                    <span className="text-chart-2/70">•</span>
                    <span>Your best performer ({bestPerformer.name}) is showing exceptional growth</span>
                  </div>
                )}
                {mostConsistent.consistencyScore > 80 && (
                  <div className="flex items-center gap-2">
                    <span className="text-chart-2/70">•</span>
                    <span>{mostConsistent.name} shows excellent consistency - a reliable foundation</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-chart-2/70">•</span>
                  <span>Review your portfolio monthly and rebalance quarterly for optimal performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
