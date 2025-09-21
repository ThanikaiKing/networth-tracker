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
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
      color: bestPerformer.growthRate >= 0 ? 'green' : 'red',
      bgColor: bestPerformer.growthRate >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: bestPerformer.growthRate >= 0 ? 'text-green-900' : 'text-red-900',
      metricColor: bestPerformer.growthRate >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: '📈 Most Consistent',
      subtitle: 'Steadiest growth pattern',
      value: mostConsistent.name,
      metric: `${mostConsistent.consistencyScore.toFixed(1)} Score`,
      subMetric: formatGrowthRate(mostConsistent.growthRate),
      trend: getTrendEmoji(mostConsistent.trend),
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      metricColor: 'text-blue-600',
    },
    {
      title: '💰 Highest Contributor',
      subtitle: 'Largest absolute growth',
      value: highestContributor.name,
      metric: formatCurrency(highestContributor.absoluteGrowth),
      subMetric: formatCurrency(highestContributor.currentValue),
      trend: getTrendEmoji(highestContributor.trend),
      color: highestContributor.absoluteGrowth >= 0 ? 'green' : 'red',
      bgColor: highestContributor.absoluteGrowth >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: highestContributor.absoluteGrowth >= 0 ? 'text-green-900' : 'text-red-900',
      metricColor: highestContributor.absoluteGrowth >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: '📊 Portfolio Health',
      subtitle: 'Overall metrics',
      value: 'Portfolio Overview',
      metric: `${averageGrowthRate.toFixed(1)}% Avg`,
      subMetric: `${diversificationScore.toFixed(0)}/100 Diversification`,
      trend: averageGrowthRate >= 0 ? '📈' : '📉',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      metricColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-sm font-semibold ${card.textColor} mb-1`}>
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {card.subtitle}
                </p>
              </div>
              <span className="text-lg">{card.trend}</span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-800 truncate" title={card.value}>
                {card.value}
              </div>
              
              <div className={`text-xl font-bold ${card.metricColor}`}>
                {card.metric}
              </div>
              
              <div className="text-xs text-gray-600">
                {card.subMetric}
              </div>
            </div>

            {/* Risk indicator for individual investments */}
            {index < 3 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Risk Level</span>
                  <div className="flex items-center space-x-1">
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
                    <span className="capitalize">
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
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk Score:</span>
                    <span className="font-medium">{overallRiskScore.toFixed(0)}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Value:</span>
                    <span className="font-medium">{formatCurrencyShort(totalInvestmentValue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Performance Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Analysis</h3>
            <p className="text-sm text-gray-600">
              Detailed breakdown of investment metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Performer Details */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h4 className="font-medium text-green-900">Best Performer</h4>
                <p className="text-sm text-green-700">{bestPerformer.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Growth Rate:</span>
                <span className="font-semibold text-green-900">
                  {formatGrowthRate(bestPerformer.growthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Current Value:</span>
                <span className="font-semibold text-green-900">
                  {formatCurrencyShort(bestPerformer.currentValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Absolute Growth:</span>
                <span className="font-semibold text-green-900">
                  {formatCurrency(bestPerformer.absoluteGrowth)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Consistency:</span>
                <span className="font-semibold text-green-900">
                  {bestPerformer.consistencyScore.toFixed(1)}/100
                </span>
              </div>
            </div>
          </div>

          {/* Most Consistent Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-medium text-blue-900">Most Consistent</h4>
                <p className="text-sm text-blue-700">{mostConsistent.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Consistency Score:</span>
                <span className="font-semibold text-blue-900">
                  {mostConsistent.consistencyScore.toFixed(1)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Growth Rate:</span>
                <span className="font-semibold text-blue-900">
                  {formatGrowthRate(mostConsistent.growthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Current Value:</span>
                <span className="font-semibold text-blue-900">
                  {formatCurrencyShort(mostConsistent.currentValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Risk Level:</span>
                <span className="font-semibold text-blue-900 capitalize">
                  {mostConsistent.riskScore}
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-medium text-purple-900">Portfolio Health</h4>
                <p className="text-sm text-purple-700">Overall metrics</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Avg Growth:</span>
                <span className="font-semibold text-purple-900">
                  {formatGrowthRate(averageGrowthRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Diversification:</span>
                <span className="font-semibold text-purple-900">
                  {diversificationScore.toFixed(0)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Risk Score:</span>
                <span className="font-semibold text-purple-900">
                  {overallRiskScore.toFixed(0)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Total Value:</span>
                <span className="font-semibold text-purple-900">
                  {formatCurrencyShort(totalInvestmentValue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Recommendations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-sm font-medium text-blue-900 mb-2">Investment Insights & Recommendations</div>
              <div className="space-y-1 text-sm text-blue-800">
                {averageGrowthRate > 10 && (
                  <div>• Excellent portfolio performance with {averageGrowthRate.toFixed(1)}% average growth!</div>
                )}
                {diversificationScore < 60 && (
                  <div>• Consider diversifying your portfolio across more investment types</div>
                )}
                {overallRiskScore > 70 && (
                  <div>• Your portfolio has high risk - consider balancing with safer investments</div>
                )}
                {bestPerformer.growthRate > 20 && (
                  <div>• Your best performer ({bestPerformer.name}) is showing exceptional growth</div>
                )}
                {mostConsistent.consistencyScore > 80 && (
                  <div>• {mostConsistent.name} shows excellent consistency - a reliable foundation</div>
                )}
                <div>• Review your portfolio monthly and rebalance quarterly for optimal performance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
