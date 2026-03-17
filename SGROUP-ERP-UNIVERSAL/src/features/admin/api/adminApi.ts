/**
 * Admin API client — All endpoints for the Admin module
 */
import api from '../../../shared/api/apiClient';

// ═══════════════════════════════════════════
// DASHBOARD & HEALTH
// ═══════════════════════════════════════════

export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const getAdminHealth = async () => {
  const { data } = await api.get('/admin/health');
  return data;
};

// ═══════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════

export const getAdminUsers = async (params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const createUser = async (body: {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}) => {
  const { data } = await api.post('/admin/users', body);
  return data;
};

export const updateUser = async (id: string, body: {
  name?: string;
  role?: string;
  department?: string;
}) => {
  const { data } = await api.patch(`/admin/users/${id}`, body);
  return data;
};

export const deactivateUser = async (id: string) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const resetUserPassword = async (id: string, newPassword: string) => {
  const { data } = await api.post(`/admin/users/${id}/reset-password`, { newPassword });
  return data;
};

// ═══════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════

export const getAuditLogs = async (params: {
  action?: string;
  resource?: string;
  userName?: string;
  method?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data;
};

// ═══════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════

export const getSettings = async (group?: string) => {
  const { data } = await api.get('/admin/settings', { params: group ? { group } : {} });
  return data;
};

export const updateSetting = async (key: string, value: string) => {
  const { data } = await api.patch(`/admin/settings/${key}`, { value });
  return data;
};

export const createSetting = async (body: {
  key: string;
  value: string;
  group?: string;
  label?: string;
  description?: string;
  valueType?: string;
}) => {
  const { data } = await api.post('/admin/settings', body);
  return data;
};

export const seedSettings = async () => {
  const { data } = await api.post('/admin/settings/seed');
  return data;
};
