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
    sm: 'w-4 h-4 border',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-2',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-border border-t-primary',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

// Skeleton card
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('card accent-green p-5', className)}>
      <div className="animate-pulse space-y-3">
        <div className="h-3 bg-muted rounded w-2/5" />
        <div className="h-9 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="pt-2">
          <div className="h-5 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
};

// Skeleton chart
export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => {
  const barHeights = ['60%', '45%', '75%', '40%', '55%', '80%'];

  return (
    <div className={cn('chart-card p-6', className)}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="h-5 bg-muted rounded w-40 mb-1.5" />
            <div className="h-3.5 bg-muted/60 rounded w-28" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-22 bg-muted/60 rounded" />
            <div className="h-7 w-16 bg-muted/60 rounded" />
          </div>
        </div>

        {/* Chart area */}
        <div className="h-64 bg-muted/10 rounded flex items-end justify-center gap-3 p-4 border border-muted/20">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="bg-muted/40 rounded-t animate-shimmer"
              style={{ height, width: '12%', animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted/40 rounded" />
                <div className="flex-1">
                  <div className="h-2.5 bg-muted/30 rounded w-12 mb-1" />
                  <div className="h-3.5 bg-muted/40 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
