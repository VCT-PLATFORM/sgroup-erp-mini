/**
 * useTeams — hook for SalesTeam management
 */
import { useState, useEffect, useCallback } from 'react';
import { teamsApi, staffApi } from '../api/salesApi';

export type SalesTeamEntry = {
  id: string;
  code: string;
  name: string;
  leaderId?: string;
  leaderName?: string;
  region?: string;
  status: string;
  sortOrder: number;
};

export type SalesStaffEntry = {
  id: string;
  userId?: string;
  employeeCode?: string;
  fullName: string;
  phone?: string;
  email?: string;
  teamId?: string;
  role: string;
  status: string;
  leadsCapacity: number;
  personalTarget: number;
};

export function useTeams() {
  const [teams, setTeams] = useState<SalesTeamEntry[]>([]);
  const [staff, setStaff] = useState<SalesStaffEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamsApi.list();
      setTeams(data);
    } catch (e: any) {
      console.error('[useTeams] Failed to fetch teams:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async (filters?: Record<string, any>) => {
    try {
      const data = await staffApi.list(filters);
      setStaff(data);
    } catch (e: any) {
      console.error('[useTeams] Failed to fetch staff:', e.message);
    }
  }, []);

  useEffect(() => { fetchTeams(); fetchStaff(); }, []);

  const createTeam = useCallback(async (data: Partial<SalesTeamEntry>) => {
    const created = await teamsApi.create(data);
    setTeams(prev => [...prev, created]);
    return created;
  }, []);

  const updateTeam = useCallback(async (id: string, data: Partial<SalesTeamEntry>) => {
    await teamsApi.update(id, data);
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    await teamsApi.remove(id);
    setTeams(prev => prev.filter(t => t.id !== id));
  }, []);

  const createStaff = useCallback(async (data: Partial<SalesStaffEntry>) => {
    const created = await staffApi.create(data);
    setStaff(prev => [...prev, created]);
    return created;
  }, []);

  const updateStaff = useCallback(async (id: string, data: Partial<SalesStaffEntry>) => {
    await staffApi.update(id, data);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  return { teams, staff, loading, fetchTeams, fetchStaff, createTeam, updateTeam, deleteTeam, createStaff, updateStaff };
}
