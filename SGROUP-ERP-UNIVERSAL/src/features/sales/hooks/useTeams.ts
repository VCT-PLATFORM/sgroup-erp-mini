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

const MOCK_TEAMS: SalesTeamEntry[] = [
  { id: 't1', code: 'TEAM-A', name: 'Team Alpha', leaderName: 'Nguyễn Văn A', region: 'Hà Nội', status: 'ACTIVE', sortOrder: 1 },
  { id: 't2', code: 'TEAM-B', name: 'Team Beta', leaderName: 'Trần Thị B', region: 'Hồ Chí Minh', status: 'ACTIVE', sortOrder: 2 },
  { id: 't3', code: 'TEAM-C', name: 'Team Gamma', leaderName: 'Lê Quốc C', region: 'Đà Nẵng', status: 'ACTIVE', sortOrder: 3 },
];

const MOCK_STAFF: SalesStaffEntry[] = [
  { id: 's1', employeeCode: 'NV001', fullName: 'Phạm Đức Dũng', phone: '0901111222', teamId: 't1', role: 'sales', status: 'ACTIVE', leadsCapacity: 30, personalTarget: 5 },
  { id: 's2', employeeCode: 'NV002', fullName: 'Trần Minh Hải', phone: '0902222333', teamId: 't1', role: 'senior_sales', status: 'ACTIVE', leadsCapacity: 40, personalTarget: 8 },
  { id: 's3', employeeCode: 'NV003', fullName: 'Nguyễn Thị Mai', phone: '0903333444', teamId: 't2', role: 'sales', status: 'ACTIVE', leadsCapacity: 30, personalTarget: 5 },
  { id: 's4', employeeCode: 'NV004', fullName: 'Lê Hoàng Anh', phone: '0904444555', teamId: 't2', role: 'team_lead', status: 'ACTIVE', leadsCapacity: 25, personalTarget: 10 },
  { id: 's5', employeeCode: 'NV005', fullName: 'Vũ Quang Minh', phone: '0905555666', teamId: 't3', role: 'sales', status: 'ACTIVE', leadsCapacity: 35, personalTarget: 6 },
];

export function useTeams() {
  const [teams, setTeams] = useState<SalesTeamEntry[]>(MOCK_TEAMS);
  const [staff, setStaff] = useState<SalesStaffEntry[]>(MOCK_STAFF);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamsApi.list();
      setTeams(data);
    } catch {
      console.warn('[useTeams] API offline, using mock data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async (filters?: Record<string, any>) => {
    try {
      const data = await staffApi.list(filters);
      setStaff(data);
    } catch {
      console.warn('[useTeams] Staff API offline, using mock data');
    }
  }, []);

  useEffect(() => { fetchTeams(); fetchStaff(); }, []);

  const createTeam = useCallback(async (data: Partial<SalesTeamEntry>) => {
    try {
      const created = await teamsApi.create(data);
      setTeams(prev => [...prev, created]);
      return created;
    } catch {
      const mock = { ...data, id: `t${Date.now()}`, sortOrder: teams.length } as SalesTeamEntry;
      setTeams(prev => [...prev, mock]);
      return mock;
    }
  }, [teams.length]);

  const updateTeam = useCallback(async (id: string, data: Partial<SalesTeamEntry>) => {
    try { await teamsApi.update(id, data); } catch { /* offline */ }
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    try { await teamsApi.remove(id); } catch { /* offline */ }
    setTeams(prev => prev.filter(t => t.id !== id));
  }, []);

  const createStaff = useCallback(async (data: Partial<SalesStaffEntry>) => {
    try {
      const created = await staffApi.create(data);
      setStaff(prev => [...prev, created]);
      return created;
    } catch {
      const mock = { ...data, id: `s${Date.now()}` } as SalesStaffEntry;
      setStaff(prev => [...prev, mock]);
      return mock;
    }
  }, []);

  const updateStaff = useCallback(async (id: string, data: Partial<SalesStaffEntry>) => {
    try { await staffApi.update(id, data); } catch { /* offline */ }
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  return { teams, staff, loading, fetchTeams, fetchStaff, createTeam, updateTeam, deleteTeam, createStaff, updateStaff };
}
