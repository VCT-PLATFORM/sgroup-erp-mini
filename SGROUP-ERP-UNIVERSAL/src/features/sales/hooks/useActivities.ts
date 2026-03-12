/**
 * useActivities — hook for SalesActivity daily log CRUD
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

export function useActivities(filters?: Record<string, any>) {
  const [activities, setActivities] = useState<SalesActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await activitiesApi.list(filters);
      setActivities(data);
    } catch (e: any) {
      console.error('[useActivities] Failed to fetch activities:', e.message);
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
    const created = await activitiesApi.create(data);
    setActivities(prev => [created, ...prev]);
    return created;
  }, []);

  const updateActivity = useCallback(async (id: string, data: Partial<SalesActivityEntry>) => {
    const updated = await activitiesApi.update(id, data);
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  }, []);

  const deleteActivity = useCallback(async (id: string) => {
    await activitiesApi.remove(id);
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  return { activities, loading, summary, fetchActivities, fetchSummary, addActivity, updateActivity, deleteActivity };
}
