/**
 * useCustomers — hook for Customer/Lead CRUD
 * Falls back to mock data when backend is offline.
 */
import { useState, useEffect, useCallback } from 'react';
import { customersApi } from '../api/salesApi';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'MEETING' | 'NEGOTIATION' | 'WON' | 'LOST';

export type Customer = {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  source?: string;
  projectInterest?: string;
  budget?: string;
  status: LeadStatus;
  assignedTo?: string;
  assignedName?: string;
  isVip?: boolean;
  lastContactAt?: string;
  note?: string;
  year: number;
  month: number;
  createdAt: string;
  updatedAt: string;
};

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', fullName: 'Nguyễn Thị Hương', phone: '0901 234 567', source: 'Facebook Ads', projectInterest: 'Vinhomes OP3', budget: '3 – 4 Tỷ', status: 'MEETING', lastContactAt: new Date().toISOString(), note: 'Hẹn xem nhà mẫu thứ 7', isVip: true, year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', fullName: 'Trần Đức Minh', phone: '0912 345 678', source: 'Hotline', projectInterest: 'Masteri Waterfront', budget: '5 – 7 Tỷ', status: 'NEGOTIATION', lastContactAt: new Date().toISOString(), note: 'Đang so sánh với dự án khác', year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', fullName: 'Lê Thanh Tùng', phone: '0933 456 789', source: 'Giới thiệu', projectInterest: 'The Global City', budget: '10+ Tỷ', status: 'INTERESTED', lastContactAt: new Date().toISOString(), isVip: true, year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', fullName: 'Phạm Lan Chi', phone: '0944 567 890', source: 'Sàn môi giới', projectInterest: 'Ecopark S2', budget: '7 – 9 Tỷ', status: 'CONTACTED', lastContactAt: new Date().toISOString(), year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', fullName: 'Vũ Hoàng Nam', phone: '0955 678 901', source: 'Website', projectInterest: 'Vinhomes OP3', budget: '2.5 – 3 Tỷ', status: 'NEW', lastContactAt: new Date().toISOString(), year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', fullName: 'Đỗ Quốc Bảo', phone: '0966 789 012', source: 'Google Ads', projectInterest: 'Grand Marina', budget: '15+ Tỷ', status: 'WON', lastContactAt: new Date().toISOString(), note: 'Đã đặt cọc 200tr', year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', fullName: 'Hoàng Kim Oanh', phone: '0977 890 123', source: 'Facebook Ads', projectInterest: 'Masteri Waterfront', budget: '4 – 5 Tỷ', status: 'NEW', lastContactAt: new Date().toISOString(), year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', fullName: 'Bùi Văn Phong', phone: '0988 901 234', source: 'Walk-in', projectInterest: 'Ecopark S2', budget: '8 Tỷ', status: 'LOST', lastContactAt: new Date().toISOString(), note: 'Đã mua dự án khác', year: 2026, month: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export function useCustomers(filters?: Record<string, any>) {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.list(filters);
      setCustomers(data);
    } catch (e: any) {
      console.warn('[useCustomers] API offline, using mock data:', e.message);
      // Keep mock data on API error
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const createCustomer = useCallback(async (data: Partial<Customer>) => {
    try {
      const now = new Date();
      const created = await customersApi.create({
        ...data,
        year: data.year || now.getFullYear(),
        month: data.month || now.getMonth() + 1,
      });
      setCustomers(prev => [created, ...prev]);
      return created;
    } catch (e: any) {
      // Offline fallback: add locally
      const mock: Customer = {
        ...data as any,
        id: `local-${Date.now()}`,
        status: data.status || 'NEW',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomers(prev => [mock, ...prev]);
      return mock;
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, data: Partial<Customer>) => {
    try {
      const updated = await customersApi.update(id, data);
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
      return updated;
    } catch {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    }
  }, []);

  const removeCustomer = useCallback(async (id: string) => {
    try {
      await customersApi.remove(id);
    } catch { /* offline */ }
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  return { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, removeCustomer };
}
