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

// Generate mock inventory
function generateMockProducts(): PropertyProduct[] {
  const products: PropertyProduct[] = [];
  const blocks = ['S4.01', 'S4.02'];
  const directions = ['Đông Nam', 'Tây Bắc', 'Đông Bắc', 'Tây Nam'];
  const statuses: ProductStatus[] = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'BOOKED', 'DEPOSIT', 'COMPLETED', 'LOCKED'];

  blocks.forEach(block => {
    for (let floor = 2; floor <= 12; floor++) {
      for (let pos = 1; pos <= 6; pos++) {
        const isCorner = pos === 1 || pos === 6;
        const code = `${block}-${floor}${pos < 10 ? '0' : ''}${pos}`;
        products.push({
          id: code,
          projectId: 'proj-vinhomes',
          projectName: 'Vinhomes Smart City',
          code,
          block,
          floor,
          area: isCorner ? 85 : Math.floor(Math.random() * 30 + 45),
          price: Number((Math.random() * 3 + 2).toFixed(2)),
          direction: directions[Math.floor(Math.random() * directions.length)],
          bedrooms: isCorner ? 3 : (Math.random() > 0.5 ? 2 : 1),
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
    }
  });
  return products;
}

const MOCK_PRODUCTS = generateMockProducts();

export function useProducts(filters?: Record<string, any>) {
  const [products, setProducts] = useState<PropertyProduct[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.list(filters);
      setProducts(data);
    } catch {
      console.warn('[useProducts] API offline, using mock data');
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
    try {
      const updated = await productsApi.lock(id, { bookedBy, durationMinutes });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? {
        ...p, status: 'BOOKED' as ProductStatus, bookedBy,
        lockedUntil: new Date(Date.now() + (durationMinutes || 30) * 60000).toISOString()
      } : p));
    }
  }, []);

  const requestDeposit = useCallback(async (id: string, customerName: string, customerPhone: string) => {
    try {
      const updated = await productsApi.requestDeposit(id, { customerName, customerPhone });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? {
        ...p, status: 'PENDING_DEPOSIT' as ProductStatus, bookedBy: customerName, customerPhone
      } : p));
    }
  }, []);

  const approveDeposit = useCallback(async (id: string) => {
    try {
      const updated = await productsApi.approveDeposit(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'DEPOSIT' as ProductStatus } : p));
    }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    try {
      const updated = await productsApi.cancelBooking(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? {
        ...p, status: 'AVAILABLE' as ProductStatus, bookedBy: undefined, customerPhone: undefined, lockedUntil: undefined
      } : p));
    }
  }, []);

  return { products, loading, stats, fetchProducts, fetchStats, lockUnit, requestDeposit, approveDeposit, cancelBooking };
}
