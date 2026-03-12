/**
 * useDeals — hook for FactDeal pipeline
 */
import { useState, useEffect, useCallback } from 'react';
import { dealsApi } from '../api/salesApi';

export type DealStage = 'LEAD' | 'MEETING' | 'BOOKING' | 'DEPOSIT' | 'CONTRACT' | 'COMPLETED' | 'CANCELLED';

export type Deal = {
  id: string;
  dealCode?: string;
  projectId?: string;
  projectName?: string;
  staffId?: string;
  staffName?: string;
  teamId?: string;
  teamName?: string;
  customerName?: string;
  customerPhone?: string;
  productCode?: string;
  productType?: string;
  dealValue: number;
  feeRate: number;
  commission: number;
  stage: DealStage;
  dealDate?: string;
  bookingDate?: string;
  contractDate?: string;
  source?: string;
  note?: string;
  year: number;
  month: number;
  status: string;
  createdAt: string;
};

export function useDeals(filters?: Record<string, any>) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dealsApi.list(filters);
      setDeals(data);
    } catch (e: any) {
      console.error('[useDeals] Failed to fetch deals:', e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const fetchStats = useCallback(async (stFilters?: Record<string, any>) => {
    try {
      const data = await dealsApi.stats(stFilters || filters);
      setStats(data);
      return data;
    } catch {
      const byStage = deals.reduce((acc, d) => {
        acc[d.stage] = (acc[d.stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const s = {
        total: deals.length,
        totalGMV: deals.reduce((s, d) => s + d.dealValue, 0),
        totalRevenue: deals.reduce((s, d) => s + d.commission, 0),
        byStage,
      };
      setStats(s);
      return s;
    }
  }, [deals, JSON.stringify(filters)]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const createDeal = useCallback(async (data: Partial<Deal>) => {
    const created = await dealsApi.create(data);
    setDeals(prev => [created, ...prev]);
    return created;
  }, []);

  const updateDeal = useCallback(async (id: string, data: Partial<Deal>) => {
    const updated = await dealsApi.update(id, data);
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  }, []);

  return { deals, loading, stats, fetchDeals, fetchStats, createDeal, updateDeal };
}
