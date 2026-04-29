import axios from 'axios';

// ═══════════════════════════════════════════════════════════
// SALES API CLIENT — Centralized HTTP layer
// ═══════════════════════════════════════════════════════════

const API_BASE = ((import.meta as any).env ? (import.meta as any).env.VITE_SALES_API_URL : undefined) || 'http://localhost:8083/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: unwrap { data } wrapper
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error?.message || err.message || 'Network error';
    console.error('[Sales API]', message);
    return Promise.reject(new Error(message));
  }
);

// ═══ Types ═══

export interface PaginationMeta { total: number; page: number; limit: number; pages: number; }
export interface ApiResponse<T> { data: T; meta?: PaginationMeta; }
export interface ListFilter {
  search?: string; status?: string; teamId?: string; staffId?: string;
  projectId?: string; dateFrom?: string; dateTo?: string;
  sortBy?: string; sortDir?: string; page?: number; limit?: number;
}

import { SalesTeam, SalesStaff, SalesBooking, KPIData, MonthlyRevenue } from '@sgroup/types';
export type { SalesTeam, SalesStaff, SalesBooking, KPIData, MonthlyRevenue };

export interface SalesActivity {
  id?: string;
  staffId?: string;
  staffName?: string;
  teamId?: string;
  teamName?: string;
  postsCount: number;
  callsCount: number;
  newLeads: number;
  meetingsMade: number;
  siteVisits: number;
  bookingsCount?: number;
  depositsCount?: number;
  points?: number;
  activityDate?: string;
  note?: string;
  createdAt?: string;
}

// KPIData is now imported and re-exported from @sgroup/types

export interface StageCount {
  stage: string; count: number; value: number;
}

export interface TeamPerformance {
  teamId: string; teamName: string; totalDeals: number;
  closedDeals: number; gmv: number; revenue: number; staffCount: number;
  totalActivityPoints: number;
  leaderName?: string;
  leads?: number;
  meetings?: number;
  visits?: number;
  bookings?: number;
}

export interface TopSeller {
  staffId: string; staffName: string; teamName: string;
  deals: number; gmv: number; revenue: number;
  activityPoints?: number;
  kpiPoints?: number;
  leads?: number;
  meetings?: number;
  visits?: number;
  bookings?: number;
}

// ═══ MOCK WRAPPER ═══

const mockDelay = <T>(data: T, ms = 400): Promise<ApiResponse<T>> => 
  new Promise(res => setTimeout(() => res({ data }), ms));

// ═══ Dashboard API ═══
export const dashboardApi = {
  getKPIs: () => api.get<any, ApiResponse<KPIData>>('/dashboard/kpi'),
  getMonthlyRevenue: (year?: number) => 
    api.get<any, ApiResponse<MonthlyRevenue[]>>('/dashboard/monthly-revenue', { params: { year } }),
  getPipelineSummary: () => api.get<any, ApiResponse<StageCount[]>>('/dashboard/pipeline-summary'),
  getTeamPerformance: () => api.get<any, ApiResponse<TeamPerformance[]>>('/dashboard/team-performance'),
  getTopSellers: (limit?: number) => 
    api.get<any, ApiResponse<TopSeller[]>>('/dashboard/top-sellers', { params: { limit } }),
};

// ═══ Sales Ops API ═══
export const salesOpsApi = {
  // Activities
  listActivities: (f?: ListFilter) => api.get<any, ApiResponse<SalesActivity[]>>('/sales-ops/activities', { params: f }),
  createActivity: (data: Partial<SalesActivity>) => api.post<any, ApiResponse<SalesActivity>>('/sales-ops/activities', data),
  updateActivity: (id: string, data: Partial<SalesActivity>) => api.patch<any, ApiResponse<SalesActivity>>(`/sales-ops/activities/${id}`, data),
  deleteActivity: (id: string) => api.delete<any, ApiResponse<void>>(`/sales-ops/activities/${id}`),
  
  // Bookings
  listBookings: (f?: ListFilter) => api.get<any, ApiResponse<SalesBooking[]>>('/sales-ops/bookings', { params: f }),
  createBooking: (data: Partial<SalesBooking>) => api.post<any, ApiResponse<SalesBooking>>('/sales-ops/bookings', data),
  updateBooking: (id: string, data: Partial<SalesBooking>) => api.patch<any, ApiResponse<SalesBooking>>(`/sales-ops/bookings/${id}`, data),
  approveBooking: (id: string) => api.post<any, ApiResponse<SalesBooking>>(`/sales-ops/bookings/${id}/approve`),
  rejectBooking: (id: string) => api.post<any, ApiResponse<SalesBooking>>(`/sales-ops/bookings/${id}/reject`),
  
  // Deposits
  listDeposits: (f?: ListFilter) => api.get<any, ApiResponse<SalesBooking[]>>('/sales-ops/deposits', { params: f }),
  createDeposit: (data: Partial<SalesBooking>) => api.post<any, ApiResponse<SalesBooking>>('/sales-ops/deposits', data),
  updateDeposit: (id: string, data: Partial<SalesBooking>) => api.patch<any, ApiResponse<SalesBooking>>(`/sales-ops/deposits/${id}`, data),
  confirmDeposit: (id: string) => api.post<any, ApiResponse<SalesBooking>>(`/sales-ops/deposits/${id}/confirm`),
  cancelDeposit: (id: string) => api.post<any, ApiResponse<SalesBooking>>(`/sales-ops/deposits/${id}/cancel`),
};

// ═══ Team & Staff API ═══
export const teamApi = {
  list: (f?: ListFilter) => api.get<any, ApiResponse<SalesTeam[]>>('/teams', { params: f }),
  getById: (id: string) => api.get<any, ApiResponse<SalesTeam>>(`/teams/${id}`),
  create: (data: unknown) => api.post<any, ApiResponse<SalesTeam>>('/teams', data),
  update: (id: string, data: unknown) => api.patch<any, ApiResponse<SalesTeam>>(`/teams/${id}`, data),
  delete: (id: string) => api.delete<any, ApiResponse<void>>(`/teams/${id}`),
};

export const staffApi = {
  list: (f?: ListFilter) => api.get<any, ApiResponse<SalesStaff[]>>('/staffs', { params: f }),
  getById: (id: string) => api.get<any, ApiResponse<SalesStaff>>(`/staffs/${id}`),
  create: (data: unknown) => api.post<any, ApiResponse<SalesStaff>>('/staffs', data),
  update: (id: string, data: unknown) => api.patch<any, ApiResponse<SalesStaff>>(`/staffs/${id}`, data),
};

export default api;
