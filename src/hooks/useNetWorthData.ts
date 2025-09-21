// Custom hook for fetching and managing net worth data

import { useState, useEffect, useCallback } from 'react';
import { DashboardData, TimePeriod, ApiResponse } from '@/lib/types';

interface UseNetWorthDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNetWorthData = (period: TimePeriod = 'all'): UseNetWorthDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `/api/sheets/networth${period !== 'all' ? `?period=${period}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Disable caching to always get fresh data
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<DashboardData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Unknown API error');
      }

      if (!result.data) {
        throw new Error('No data received from API');
      }

      setData(result.data);
    } catch (err: unknown) {
      console.error('Error fetching net worth data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Initial data fetch and period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
