import { useState, useEffect, useCallback, useRef } from 'react';
import {
  dashboardApi, salesOpsApi, teamApi, staffApi,
  type KPIData, type MonthlyRevenue,
  type SalesTeam, type SalesStaff, type SalesBooking,
  type StageCount, type TeamPerformance, type TopSeller, type ListFilter,
} from '../api/salesApi';
import { useSalesRole } from '../components/shared/RoleContext';

// ═══════════════════════════════════════════════════════════
// GENERIC ASYNC HOOK — Reusable data fetching pattern
// ═══════════════════════════════════════════════════════════

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useAsync<T>(
  fetcher: () => Promise<{ data: T }>,
  deps: unknown[] = [],
  immediate = true
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result.data);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) execute();
    return () => { mountedRef.current = false; };
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD HOOKS
// ═══════════════════════════════════════════════════════════

export function useDashboardKPIs() {
  const { role } = useSalesRole();
  return useAsync<KPIData>(async () => {
    const res = await dashboardApi.getKPIs();
    if (role === 'sales_staff') {
      res.data.revenue /= 100;
      res.data.pipelineValue /= 100;
      res.data.totalLeads = Math.round(res.data.totalLeads / 100);
      res.data.totalDeals = Math.round(res.data.totalDeals / 100);
    } else if (role === 'sales_manager') {
      res.data.revenue /= 5;
      res.data.pipelineValue /= 5;
      res.data.totalLeads = Math.round(res.data.totalLeads / 5);
      res.data.totalDeals = Math.round(res.data.totalDeals / 5);
    }
    return res;
  }, [role]);
}

export function useMonthlyRevenue(year?: number) {
  const { role } = useSalesRole();
  return useAsync<MonthlyRevenue[]>(async () => {
    const res = await dashboardApi.getMonthlyRevenue(year);
    if (role === 'sales_staff') {
      res.data.forEach(m => { m.revenue /= 100; m.gmv /= 100; m.deals = Math.round(m.deals / 100); });
    } else if (role === 'sales_manager') {
      res.data.forEach(m => { m.revenue /= 5; m.gmv /= 5; m.deals = Math.round(m.deals / 5); });
    }
    return res;
  }, [year, role]);
}

export function usePipelineSummary() {
  const { role } = useSalesRole();
  return useAsync<StageCount[]>(async () => {
    const res = await dashboardApi.getPipelineSummary();
    if (role === 'sales_staff') {
      res.data.forEach(s => { s.count = Math.max(1, Math.round(s.count / 100)); s.value /= 100; });
    } else if (role === 'sales_manager') {
      res.data.forEach(s => { s.count = Math.max(1, Math.round(s.count / 5)); s.value /= 5; });
    }
    return res;
  }, [role]);
}

export function useTeamPerformance() {
  return useAsync<TeamPerformance[]>(() => dashboardApi.getTeamPerformance());
}

export function useTopSellers(limit = 10) {
  return useAsync<TopSeller[]>(() => dashboardApi.getTopSellers(limit), [limit]);
}

// ═══════════════════════════════════════════════════════════
// BOOKING & DEPOSIT HOOKS
// ═══════════════════════════════════════════════════════════

export function useBookings(filter?: ListFilter) {
  const [filterState, setFilter] = useState<ListFilter>(filter || { page: 1, limit: 20 });
  const result = useAsync<SalesBooking[]>(
    () => salesOpsApi.listBookings(filterState),
    [JSON.stringify(filterState)]
  );
  return { ...result, filter: filterState, setFilter };
}

// ═══════════════════════════════════════════════════════════
// TEAM & STAFF HOOKS
// ═══════════════════════════════════════════════════════════

export function useTeams() {
  return useAsync<SalesTeam[]>(() => teamApi.list());
}

export function useStaff(filter?: ListFilter) {
  const [filterState, setFilter] = useState<ListFilter>(filter || { page: 1, limit: 50 });
  const result = useAsync<SalesStaff[]>(
    () => staffApi.list(filterState),
    [JSON.stringify(filterState)]
  );
  return { ...result, filter: filterState, setFilter };
}

// ═══════════════════════════════════════════════════════════
// UTILITY: Format Vietnamese currency
// ═══════════════════════════════════════════════════════════

export function formatVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toFixed(0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
