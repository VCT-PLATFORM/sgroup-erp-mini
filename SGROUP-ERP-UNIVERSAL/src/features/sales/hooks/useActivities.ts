/**
 * useActivities — hook for SalesActivity daily log CRUD
 * Falls back to local mock when backend is offline.
 */
import { useState, useEffect, useCallback } from 'react';
import { activitiesApi } from '../api/salesApi';

export type SalesActivityEntry = {
  id: string;
  date: string;
  staffId: string;
  staffName?: string;
  postsCount: number;
  callsCount: number;
  newLeads: number;
  meetingsMade: number;
  note?: string;
  year: number;
  month: number;
  createdAt: string;
};

const MOCK_ACTIVITIES: SalesActivityEntry[] = [
  { id: 'a1', date: new Date().toISOString(), staffId: 'me', staffName: 'Tôi', postsCount: 2, callsCount: 45, newLeads: 12, meetingsMade: 3, year: 2026, month: 3, createdAt: new Date().toISOString() },
  { id: 'a2', date: new Date(Date.now() - 86400000).toISOString(), staffId: 'me', staffName: 'Tôi', postsCount: 1, callsCount: 30, newLeads: 8, meetingsMade: 2, year: 2026, month: 3, createdAt: new Date().toISOString() },
  { id: 'a3', date: new Date(Date.now() - 172800000).toISOString(), staffId: 'me', staffName: 'Tôi', postsCount: 3, callsCount: 52, newLeads: 15, meetingsMade: 4, year: 2026, month: 3, createdAt: new Date().toISOString() },
];

export function useActivities(filters?: Record<string, any>) {
  const [activities, setActivities] = useState<SalesActivityEntry[]>(MOCK_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await activitiesApi.list(filters);
      setActivities(data);
    } catch (e: any) {
      console.warn('[useActivities] API offline, using mock data');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const fetchSummary = useCallback(async (sumFilters?: Record<string, any>) => {
    try {
      const data = await activitiesApi.summary(sumFilters || filters);
      setSummary(data);
      return data;
    } catch {
      // compute from local
      const totals = activities.reduce(
        (acc, a) => ({
          postsCount: acc.postsCount + a.postsCount,
          callsCount: acc.callsCount + a.callsCount,
          newLeads: acc.newLeads + a.newLeads,
          meetingsMade: acc.meetingsMade + a.meetingsMade,
        }),
        { postsCount: 0, callsCount: 0, newLeads: 0, meetingsMade: 0 },
      );
      const s = { totalEntries: activities.length, ...totals };
      setSummary(s);
      return s;
    }
  }, [activities, JSON.stringify(filters)]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const addActivity = useCallback(async (data: Omit<SalesActivityEntry, 'id' | 'createdAt'>) => {
    try {
      const created = await activitiesApi.create(data);
      setActivities(prev => [created, ...prev]);
      return created;
    } catch {
      const mock = { ...data, id: `a${Date.now()}`, createdAt: new Date().toISOString() };
      setActivities(prev => [mock, ...prev]);
      return mock;
    }
  }, []);

  const updateActivity = useCallback(async (id: string, data: Partial<SalesActivityEntry>) => {
    try {
      const updated = await activitiesApi.update(id, data);
      setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    } catch {
      setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    }
  }, []);

  const deleteActivity = useCallback(async (id: string) => {
    try { await activitiesApi.remove(id); } catch { /* offline */ }
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  return { activities, loading, summary, fetchActivities, fetchSummary, addActivity, updateActivity, deleteActivity };
}
