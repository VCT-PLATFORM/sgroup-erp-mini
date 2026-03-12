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

const MOCK_DEALS: Deal[] = [
  { id: 'd1', dealCode: 'GD-202603-A1', projectName: 'Masteri Waterfront', customerName: 'Lê Thị B', customerPhone: '0987654321', productCode: 'M2-1205', dealValue: 4.5, feeRate: 2, commission: 0.09, stage: 'CONTRACT', year: 2026, month: 3, status: 'ACTIVE', createdAt: new Date().toISOString(), source: 'MARKETING' },
  { id: 'd2', dealCode: 'GD-202603-A2', projectName: 'Vinhomes Smart City', customerName: 'Trần Văn C', customerPhone: '0912345678', productCode: 'S4-0812', dealValue: 3.2, feeRate: 2, commission: 0.064, stage: 'COMPLETED', year: 2026, month: 3, status: 'ACTIVE', createdAt: new Date().toISOString(), source: 'SELF_GEN' },
  { id: 'd3', dealCode: 'GD-202603-A3', projectName: 'The Global City', customerName: 'Hoàng Minh D', customerPhone: '0909876543', productCode: 'TGC-2B-2301', dealValue: 8.5, feeRate: 2.5, commission: 0.2125, stage: 'BOOKING', year: 2026, month: 3, status: 'ACTIVE', createdAt: new Date().toISOString(), source: 'REFERRAL' },
];

export function useDeals(filters?: Record<string, any>) {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dealsApi.list(filters);
      setDeals(data);
    } catch {
      console.warn('[useDeals] API offline, using mock data');
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
    try {
      const created = await dealsApi.create(data);
      setDeals(prev => [created, ...prev]);
      return created;
    } catch {
      const mock = { ...data, id: `d${Date.now()}`, createdAt: new Date().toISOString() } as Deal;
      setDeals(prev => [mock, ...prev]);
      return mock;
    }
  }, []);

  const updateDeal = useCallback(async (id: string, data: Partial<Deal>) => {
    try {
      const updated = await dealsApi.update(id, data);
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    } catch {
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    }
  }, []);

  return { deals, loading, stats, fetchDeals, fetchStats, createDeal, updateDeal };
}
