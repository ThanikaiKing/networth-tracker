'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isFire = pathname === '/fire';

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Wordmark */}
          <Link href="/" className="group flex flex-col justify-center">
            <h1 className="text-xl leading-none tracking-tight text-foreground transition-opacity group-hover:opacity-80">
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
          </Link>

          {/* Center Navigation Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-secondary/50 p-1 rounded-2xl border border-border/80">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isHome
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Financial Overview</span>
            </Link>

            <Link
              href="/fire"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isFire
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFire ? 'text-primary-foreground' : 'text-accent'}`} />
              <span>FIRE & Freedom</span>
            </Link>
          </nav>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-pulse" />
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Live</span>
          </div>

        </div>
      </div>
    </header>
  );
};
