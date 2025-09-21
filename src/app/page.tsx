import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <DashboardLayout>
        {/* Additional dashboard sections can be added here in the future */}
      </DashboardLayout>
    </ErrorBoundary>
  );
}