'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Wordmark */}
          <div>
            <h1 className="text-xl leading-none tracking-tight text-foreground">
              <span
                className="font-display italic font-semibold"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}
              >
                NetWorth
              </span>
              <span className="text-muted-foreground font-light ml-1.5 text-base not-italic">
                Atlas
              </span>
            </h1>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.18em] mt-0.5 font-sans">
              Financial Journey Tracker
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Live</span>
          </div>

        </div>
      </div>
    </header>
  );
};
