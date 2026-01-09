// Loading spinner component

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className="relative">
        {/* Outer glow */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-primary/20 blur-md',
          sizeClasses[size]
        )} />
        {/* Spinner */}
        <div
          className={cn(
            'relative animate-spin rounded-full border-2 border-muted border-t-primary',
            sizeClasses[size]
          )}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('glass-card rounded-2xl p-6', className)}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-muted/50 rounded-xl"></div>
          <div className="h-4 bg-muted/50 rounded-lg w-1/3"></div>
        </div>
        <div className="h-8 bg-muted/30 rounded-lg w-2/3 mb-2"></div>
        <div className="h-3 bg-muted/20 rounded-lg w-1/2"></div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-muted/30 rounded-full"></div>
            <div className="h-3 w-24 bg-muted/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for chart
export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => {
  // Static heights to prevent hydration mismatch
  const barHeights = ['60%', '45%', '75%', '40%', '55%', '80%'];
  
  return (
    <div className={cn('glass-card rounded-2xl p-6', className)}>
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-muted/50 rounded-full"></div>
              <div className="h-6 bg-muted/50 rounded-lg w-40"></div>
            </div>
            <div className="h-4 bg-muted/30 rounded-lg w-32"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-7 w-24 bg-muted/30 rounded-full"></div>
            <div className="h-7 w-16 bg-muted/30 rounded-full"></div>
          </div>
        </div>
        
        {/* Chart area skeleton */}
        <div className="h-64 bg-muted/10 rounded-xl flex items-end justify-center space-x-3 p-4 border border-muted/20">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-muted/40 to-muted/10 rounded-t-lg animate-pulse"
              style={{
                height,
                width: '12%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        
        {/* Footer skeleton */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-muted/30 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-muted/20 rounded w-12 mb-1"></div>
                  <div className="h-4 bg-muted/30 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
