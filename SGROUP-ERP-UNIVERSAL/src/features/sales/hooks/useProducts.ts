/**
 * useProducts — hook for PropertyProduct (Inventory) CRUD
 */
import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/salesApi';

export type ProductStatus = 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'PENDING_DEPOSIT' | 'DEPOSIT' | 'SOLD' | 'COMPLETED';

export type PropertyProduct = {
  id: string;
  projectId: string;
  projectName?: string;
  code: string;
  block?: string;
  floor: number;
  area: number;
  price: number;
  direction?: string;
  bedrooms: number;
  status: ProductStatus;
  bookedBy?: string;
  lockedUntil?: string;
  customerPhone?: string;
  note?: string;
};

export function useProducts(filters?: Record<string, any>) {
  const [products, setProducts] = useState<PropertyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.list(filters);
      setProducts(data);
    } catch (e: any) {
      console.error('[useProducts] Failed to fetch products:', e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const fetchStats = useCallback(async (projectId?: string) => {
    try {
      const data = await productsApi.stats(projectId);
      setStats(data);
      return data;
    } catch {
      // Compute from local
      const byStatus = products.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const s = { total: products.length, byStatus };
      setStats(s);
      return s;
    }
  }, [products]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const lockUnit = useCallback(async (id: string, bookedBy: string, durationMinutes?: number) => {
    const updated = await productsApi.lock(id, { bookedBy, durationMinutes });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  }, []);

  const requestDeposit = useCallback(async (id: string, customerName: string, customerPhone: string) => {
    const updated = await productsApi.requestDeposit(id, { customerName, customerPhone });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  }, []);

  const approveDeposit = useCallback(async (id: string) => {
    const updated = await productsApi.approveDeposit(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    const updated = await productsApi.cancelBooking(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  }, []);

  return { products, loading, stats, fetchProducts, fetchStats, lockUnit, requestDeposit, approveDeposit, cancelBooking };
}
