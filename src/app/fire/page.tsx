import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { FireDashboard } from '@/components/Fire/FireDashboard';

export const metadata: Metadata = {
  title: 'FIRE & Freedom Calculator | NetWorth Atlas',
  description: 'Interactive FIRE calculator and post-FIRE financial growth projector.',
};

export default function FirePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <FireDashboard />
        </ErrorBoundary>
      </main>
    </div>
  );
}
