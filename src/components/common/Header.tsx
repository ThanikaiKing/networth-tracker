// Header component for the dashboard

'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden border-b border-border/50">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-background">
        <div className="absolute inset-0 mesh-gradient opacity-50"></div>
      </div>
      
      {/* Subtle glow accent */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-64 h-24 bg-gradient-to-l from-accent/10 via-primary/5 to-transparent blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <svg 
                  className="w-5 h-5 text-primary-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                  />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-primary/30 blur-md -z-10"></div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="gradient-text">NetWorth</span>
                <span className="text-muted-foreground font-medium ml-1">Atlas</span>
              </h1>
              <p className="text-xs text-muted-foreground/70 tracking-wide">
                Financial Journey Tracker
              </p>
            </div>
          </div>

          {/* Right side - could add theme toggle or user menu here */}
          <div className="flex items-center space-x-3">
            {/* Live indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass">
              <div className="relative">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">Live Data</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </header>
  );
};
