/**
 * useCustomers — hook for Customer/Lead CRUD
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

export function useCustomers(filters?: Record<string, any>) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.list(filters);
      setCustomers(data);
    } catch (e: any) {
      console.error('[useCustomers] Failed to fetch customers:', e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const createCustomer = useCallback(async (data: Partial<Customer>) => {
    const now = new Date();
    const created = await customersApi.create({
      ...data,
      year: data.year || now.getFullYear(),
      month: data.month || now.getMonth() + 1,
    });
    setCustomers(prev => [created, ...prev]);
    return created;
  }, []);

  const updateCustomer = useCallback(async (id: string, data: Partial<Customer>) => {
    const updated = await customersApi.update(id, data);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    return updated;
  }, []);

  const removeCustomer = useCallback(async (id: string) => {
    await customersApi.remove(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  return { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, removeCustomer };
}
