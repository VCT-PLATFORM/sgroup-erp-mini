import { useQuery } from '@tanstack/react-query';
import { mktApi } from '../api/mktApi';

// ── Dashboard ──
export function useMKTDashboard() {
  return useQuery({ queryKey: ['mkt', 'dashboard'], queryFn: mktApi.getDashboard });
}

export function useMKTActivities() {
  return useQuery({ queryKey: ['mkt', 'activities'], queryFn: mktApi.getActivities });
}

// ── Campaigns ──
export function useCampaigns() {
  return useQuery({ queryKey: ['mkt', 'campaigns'], queryFn: mktApi.getCampaigns });
}

// ── Leads ──
export function useLeads() {
  return useQuery({ queryKey: ['mkt', 'leads'], queryFn: mktApi.getLeads });
}

// ── Content ──
export function useContent() {
  return useQuery({ queryKey: ['mkt', 'content'], queryFn: mktApi.getContent });
}

// ── Budget ──
export function useBudget() {
  return useQuery({ queryKey: ['mkt', 'budget'], queryFn: mktApi.getBudget });
}

// ── Analytics ──
export function useMetrics() {
  return useQuery({ queryKey: ['mkt', 'metrics'], queryFn: mktApi.getMetrics });
}

// ── KOL ──
export function useKOLs() {
  return useQuery({ queryKey: ['mkt', 'kols'], queryFn: mktApi.getKOLs });
}
