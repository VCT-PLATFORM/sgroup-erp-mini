import { useState, useEffect, useCallback, useMemo } from 'react';
import { salesOpsApi, SalesActivity } from '../api/salesApi';
import { useSalesRole } from '../components/shared/RoleContext';


// ═══════════════════════════════════════════════════════════
// ACTIVITY DASHBOARD HOOK — Aggregate from real activity data
// Maps directly to 6 funnel metrics from Nhật Ký Kinh Doanh
// ═══════════════════════════════════════════════════════════

export interface FunnelTotals {
  calls: number;
  leads: number;      // Quan Tâm
  meetings: number;   // Tư Vấn
  visits: number;     // Trải Nghiệm
  bookings: number;   // Giữ Chỗ
  deposits: number;   // Đặt Cọc
  points: number;
}

export interface ConversionRates {
  leadsToMeetings: number;   // QT → TV
  meetingsToVisits: number;  // TV → TN
  visitsToBookings: number;  // TN → GC
  bookingsToDeposits: number; // GC → ĐC
}

export interface StaffBreakdown extends FunnelTotals {
  staffId: string;
  staffName: string;
  teamName: string;
}

export interface TeamBreakdown extends FunnelTotals {
  teamName: string;
  staffCount: number;
}

export interface ActivityDashboardData {
  totals: FunnelTotals;
  todayTotals: FunnelTotals;
  conversions: ConversionRates;
  staffRanking: StaffBreakdown[];
  teamRanking: TeamBreakdown[];
  myRank: number;
  totalStaff: number;
  loading: boolean;
  refetch: () => void;
}

const EMPTY_TOTALS: FunnelTotals = { calls: 0, leads: 0, meetings: 0, visits: 0, bookings: 0, deposits: 0, points: 0 };

function sumActivities(acts: SalesActivity[]): FunnelTotals {
  return acts.reduce((acc, a) => ({
    calls: acc.calls + (a.callsCount || 0),
    leads: acc.leads + (a.newLeads || 0),
    meetings: acc.meetings + (a.meetingsMade || 0),
    visits: acc.visits + (a.siteVisits || 0),
    bookings: acc.bookings + (a.bookingsCount || 0),
    deposits: acc.deposits + (a.depositsCount || 0),
    points: acc.points + (a.points || 0),
  }), { ...EMPTY_TOTALS });
}

function calcConversions(t: FunnelTotals): ConversionRates {
  return {
    leadsToMeetings: t.leads > 0 ? (t.meetings / t.leads) * 100 : 0,
    meetingsToVisits: t.meetings > 0 ? (t.visits / t.meetings) * 100 : 0,
    visitsToBookings: t.visits > 0 ? (t.bookings / t.visits) * 100 : 0,
    bookingsToDeposits: t.bookings > 0 ? (t.deposits / t.bookings) * 100 : 0,
  };
}

function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function useActivityDashboard(): ActivityDashboardData {
  const { role } = useSalesRole();
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await salesOpsApi.listActivities();
      let acts = res.data;

      // Filter based on role (Note: in production this should be handled by backend)
      if (role === 'sales_staff') {
        acts = acts.filter(a => a.staffId === 'S1');
      } else if (role === 'sales_manager') {
        acts = acts.filter(a => a.teamId === 'T1' || a.staffId === 'S1');
      }
      // Director/VP/Admin sees everything

      setActivities(acts);
    } catch (err) {
      console.error('Failed to load activities for dashboard', err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totals = useMemo(() => sumActivities(activities), [activities]);

  const todayTotals = useMemo(() => {
    const todayActs = activities.filter(a => isToday(a.activityDate));
    return sumActivities(todayActs);
  }, [activities]);

  const conversions = useMemo(() => calcConversions(totals), [totals]);

  const staffRanking = useMemo(() => {
    const map = new Map<string, { staffId: string; staffName: string; teamName: string; acts: SalesActivity[] }>();
    activities.forEach(a => {
      const key = a.staffId || a.staffName || 'unknown';
      if (!map.has(key)) {
        map.set(key, { staffId: a.staffId || key, staffName: a.staffName || 'N/A', teamName: a.teamName || '', acts: [] });
      }
      map.get(key)!.acts.push(a);
    });

    return Array.from(map.values())
      .map(({ staffId, staffName, teamName, acts }) => ({
        staffId,
        staffName,
        teamName,
        ...sumActivities(acts),
      }))
      .sort((a, b) => b.points - a.points);
  }, [activities]);

  const teamRanking = useMemo(() => {
    const map = new Map<string, SalesActivity[]>();
    activities.forEach(a => {
      const key = a.teamName || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });

    return Array.from(map.entries())
      .map(([teamName, acts]) => {
        const staffIds = new Set(acts.map(a => a.staffId || a.staffName));
        return {
          teamName,
          staffCount: staffIds.size,
          ...sumActivities(acts),
        };
      })
      .sort((a, b) => b.points - a.points);
  }, [activities]);

  const myRank = useMemo(() => {
    const idx = staffRanking.findIndex(s => s.staffId === 'S1');
    return idx >= 0 ? idx + 1 : staffRanking.length + 1;
  }, [staffRanking]);

  return {
    totals,
    todayTotals,
    conversions,
    staffRanking,
    teamRanking,
    myRank,
    totalStaff: staffRanking.length,
    loading,
    refetch: fetchData,
  };
}
