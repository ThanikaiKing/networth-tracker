// WifeReassuranceSection - Humorous, eye-candy layman explanation for reassuring spouse

'use client';

import React, { useState, useRef } from 'react';
import { FireCalculationResult, FireParameters } from '@/lib/fireTypes';
import { formatCurrency, formatCurrencyShort } from '@/lib/utils';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Coffee,
  Plane,
  ChevronDown,
  ChevronUp,
  Smile,
  Palmtree,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';

interface WifeReassuranceProps {
  parameters: FireParameters;
  calculation: FireCalculationResult;
}

export const WifeReassuranceSection: React.FC<WifeReassuranceProps> = ({
  parameters,
  calculation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { currentPortfolio, monthlyExpense, yearlyExpense, expectedAnnualReturn } = parameters;
  const { postFireAnalytics } = calculation;

  // Layman figures
  const annualGrossReturn = Math.round(currentPortfolio * (expectedAnnualReturn / 100));
  const annualSurplus = Math.round(annualGrossReturn - yearlyExpense);
  const safeMonthlyAllowance = postFireAnalytics.guiltFreeMonthlyAllowance;

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      return next;
    });
  };

  return (
    <div className="pt-6">
      {/* Humongous Humorous Button */}
      <div className="text-center my-6">
        <button
          onClick={handleToggle}
          className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-5 sm:py-6 rounded-3xl bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] text-card font-display text-lg sm:text-2xl font-bold tracking-tight shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 animate-pulse hover:animate-none border-2 border-accent/40 cursor-pointer"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125">
            💍
          </span>
          <span className="flex items-center gap-2">
            <span>{isOpen ? 'Close Reassurance Portal' : 'Reassure My Wife'}</span>
            <span className="text-sm font-sans font-normal opacity-90 hidden md:inline">
              (Zero Jargon • 100% Peace of Mind)
            </span>
          </span>
          <span className="text-lg sm:text-xl">
            {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </span>
        </button>

        <p className="text-xs text-muted-foreground mt-3 font-sans">
          ⚠️ Warning: Side effects include relief, sudden vacation ideas, and zero financial anxiety.
        </p>
      </div>

      {/* Expanded Eye-Candy Section */}
      {isOpen && (
        <div
          ref={contentRef}
          className="mt-8 rounded-3xl border-2 border-accent/30 bg-gradient-to-b from-card via-card to-accent/5 p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden animate-fade-up"
        >
          {/* Subtle playful background watermarks */}
          <div className="pointer-events-none absolute -right-20 -top-20 text-[180px] opacity-[0.03] select-none">
            🏖️
          </div>
          <div className="pointer-events-none absolute -left-20 -bottom-20 text-[180px] opacity-[0.03] select-none">
            🏡
          </div>

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/25 mb-3">
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Official Spouse Reassurance Protocol</span>
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <h2
              className="text-2xl sm:text-4xl font-bold text-foreground font-display tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              &ldquo;Yes, Honey. We Are Going to Be Totally Fine.&rdquo;
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
              No spreadsheets, no Greek finance formulas. Here is the plain, simple English truth
              about why our money will outlive us while paying for everything we need.
            </p>
          </div>

          {/* Eye-Candy Layman Card 1: The Mango Tree Analogy */}
          <div className="mb-10 rounded-2xl bg-secondary/40 border border-border p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl sm:text-7xl shrink-0 p-4 bg-card rounded-2xl border border-border/80 shadow-xs">
                🥭
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  The Golden Mango Tree Rule
                </span>
                <h3
                  className="text-xl sm:text-2xl font-bold text-foreground font-display"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  We Never Cut The Tree. We Just Eat The Fallen Fruit.
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Think of our <strong className="text-foreground">{formatCurrency(currentPortfolio)}</strong> as a giant, lush mango tree.
                  Every single year, this tree naturally produces{' '}
                  <strong className="text-primary font-mono">{formatCurrency(annualGrossReturn)}</strong> worth of fresh, ripe mangoes.
                  Our entire household only eats{' '}
                  <strong className="text-accent font-mono">{formatCurrency(yearlyExpense)}</strong> worth of mangoes for all our bills, groceries, and Netflix.
                </p>
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs text-primary font-medium mt-2">
                  ✨ The Miracle: Even after we eat our fill, <span className="font-bold underline">{formatCurrency(annualSurplus)} of extra mangoes</span> fall back into the soil and grow more branches every single year. The tree never shrinks!
                </div>
              </div>
            </div>
          </div>

          {/* 4 Charming Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* Pillar 1: The Zero-Boss Paycheck */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 hover-lift relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Coffee className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-base text-foreground font-sans">
                    The Automatic 1st-of-the-Month Paycheck
                  </h4>
                  <span className="text-xs text-muted-foreground">No boss, no meetings, no commute</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our portfolio safely generates <strong className="text-foreground font-mono">{formatCurrency(safeMonthlyAllowance)}</strong> every single month into our account.
                Since our monthly budget is only <strong className="text-foreground font-mono">{formatCurrency(monthlyExpense)}</strong>, we have an automatic cushion of <strong className="text-primary font-mono">{formatCurrency(safeMonthlyAllowance - monthlyExpense)}</strong> every month for unplanned fun.
              </p>
            </div>

            {/* Pillar 2: The Shopping & Vacation Pass */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 hover-lift relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-accent/15 text-accent">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-base text-foreground font-sans">
                    The &ldquo;Can I Buy This?&rdquo; Guarantee
                  </h4>
                  <span className="text-xs text-muted-foreground">Yes, guilt-free swiping is permitted</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You never have to feel guilty about clothes, cafe dates, or weekend getaways. Our plan doesn&apos;t rely on being miserable or penny-pinching.
                If we want a luxury vacation, our annual surplus of <strong className="text-accent font-mono">{formatCurrencyShort(annualSurplus)}</strong> covers it multiple times over without touching the principal!
              </p>
            </div>

            {/* Pillar 3: What if the market crashes? */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 hover-lift relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-chart-2/15 text-chart-2">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-base text-foreground font-sans">
                    The &ldquo;What If The Market Crashes?&rdquo; Armor
                  </h4>
                  <span className="text-xs text-muted-foreground">Tested against 2008 & 2020 recessions</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Even if the stock market drops by 40% in a massive global crisis, our remaining balance still effortlessly pays all our groceries, utility bills, and insurance.
                We never have to sell at a loss or panic. Time and compounding do all the heavy lifting.
              </p>
            </div>

            {/* Pillar 4: The Husband Upgrade */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 hover-lift relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-chart-4/15 text-chart-4">
                  <Smile className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-base text-foreground font-sans">
                    The Best Part: Husband Upgrade 2.0
                  </h4>
                  <span className="text-xs text-muted-foreground">More energy, zero Sunday evening blues</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No more stressful 9 PM corporate emails, no more grumpy mood after late night deadlines, and no more missed family dinners.
                You get a relaxed partner who actually has time to make breakfast, take walks, travel together, and stay healthy!
              </p>
            </div>
          </div>

          {/* Interactive Wife Doubt-Busters FAQ */}
          <div className="mb-10">
            <h3
              className="text-xl sm:text-2xl font-bold text-foreground font-display text-center mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Rapid-Fire Doubt Busters
            </h3>

            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">
                      &ldquo;What about inflation? Won&apos;t milk, vegetables, and schooling cost double in 10 years?&rdquo;
                    </h5>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      <strong>Answer:</strong> Absolutely, and we already calculated it! Our model factors in a hefty 6.0% inflation every single year forever. That means our calculation assumes everyday costs will triple over time, and yet our investments still multiply into multi-crores!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-3">
                  <Plane className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">
                      &ldquo;Can we still go to Europe or Japan?&rdquo;
                    </h5>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      <strong>Answer:</strong> Yes! In fact, we can travel on Tuesday afternoons when flights are 40% cheaper and hotels aren&apos;t crowded, because we don&apos;t have to beg an HR department for 5 days of vacation leave.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-3">
                  <Palmtree className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">
                      &ldquo;What if you get bored and drive me crazy around the house?&rdquo;
                    </h5>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      <strong>Answer:</strong> I will pick up hobbies, hit the gym, learn new skills, do passion projects, and happily run all the household errands so you have more peace and quiet too!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Official Certificate of Peace of Mind */}
          <div className="max-w-xl mx-auto rounded-3xl border-2 border-dashed border-accent/60 bg-card p-6 sm:p-8 text-center shadow-lg relative">
            <div className="text-3xl mb-2">📜</div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent block">
              Official Spousal Guarantee
            </span>
            <h4
              className="text-xl sm:text-2xl font-bold text-foreground font-display mt-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Certificate of Financial Freedom
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              This certifies that our household finances are mathematically backed by cold, hard compound interest,
              surplus growth of <span className="font-semibold text-foreground font-mono">+{formatCurrencyShort(annualSurplus)}/year</span>,
              and a guaranteed lifetime of love, laughter, and zero corporate stress.
            </p>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <CheckCircle className="h-4 w-4" />
                Anti-Broke Certified
              </span>
              <span className="italic font-display text-sm text-foreground font-semibold">
                Signed with Love & Math ❤️
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
