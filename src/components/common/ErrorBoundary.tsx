// Error boundary component for handling React errors

'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          {/* Background effects */}
          <div className="fixed inset-0 mesh-gradient pointer-events-none"></div>
          <div className="fixed inset-0 grid-pattern pointer-events-none"></div>
          
          <div className="relative max-w-md w-full glass-card rounded-2xl p-8 mx-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-destructive/10 rounded-2xl mb-6">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                An unexpected error occurred while loading the dashboard.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 hover-lift"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error display component
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl p-6 border border-destructive/30 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-2 rounded-xl bg-destructive/10">
            <svg
              className="w-5 h-5 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-destructive">Error Loading Data</h3>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-5">
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
