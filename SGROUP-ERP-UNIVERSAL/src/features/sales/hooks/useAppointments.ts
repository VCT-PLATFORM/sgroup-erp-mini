/**
 * useAppointments — hook for Appointment calendar CRUD
 */
import { useState, useEffect, useCallback } from 'react';
import { appointmentsApi } from '../api/salesApi';

export type AppointmentType = 'MEETING' | 'SITE_VISIT' | 'FOLLOW_UP' | 'SIGNING';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type AppointmentEntry = {
  id: string;
  staffId: string;
  staffName?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  projectId?: string;
  projectName?: string;
  type: AppointmentType;
  scheduledAt: string;
  duration: number;
  location?: string;
  status: AppointmentStatus;
  outcome?: string;
  note?: string;
  createdAt: string;
};

const today = new Date();
const MOCK_APPOINTMENTS: AppointmentEntry[] = [
  {
    id: 'apt1', staffId: 'me', staffName: 'Tôi', customerName: 'Nguyễn Thị Hương', customerPhone: '0901 234 567',
    projectName: 'Vinhomes OP3', type: 'SITE_VISIT', scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
    duration: 90, location: 'Nhà mẫu Vinhomes', status: 'CONFIRMED', note: 'Khách quan tâm căn 2PN', createdAt: today.toISOString(),
  },
  {
    id: 'apt2', staffId: 'me', staffName: 'Tôi', customerName: 'Trần Đức Minh', customerPhone: '0912 345 678',
    projectName: 'Masteri Waterfront', type: 'MEETING', scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30).toISOString(),
    duration: 60, location: 'Văn phòng SGroup', status: 'SCHEDULED', note: 'Tư vấn phương thức thanh toán', createdAt: today.toISOString(),
  },
  {
    id: 'apt3', staffId: 'me', staffName: 'Tôi', customerName: 'Lê Thanh Tùng', customerPhone: '0933 456 789',
    projectName: 'The Global City', type: 'FOLLOW_UP', scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0).toISOString(),
    duration: 30, status: 'SCHEDULED', note: 'Gọi xác nhận giá chính thức', createdAt: today.toISOString(),
  },
  {
    id: 'apt4', staffId: 'me', staffName: 'Tôi', customerName: 'Đỗ Quốc Bảo', customerPhone: '0966 789 012',
    projectName: 'Grand Marina', type: 'SIGNING', scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0).toISOString(),
    duration: 120, location: 'Phòng công chứng', status: 'CONFIRMED', note: 'Ký HĐMB + nhận cọc', createdAt: today.toISOString(),
  },
];

export function useAppointments(filters?: Record<string, any>) {
  const [appointments, setAppointments] = useState<AppointmentEntry[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentsApi.list(filters);
      setAppointments(data);
    } catch {
      console.warn('[useAppointments] API offline, using mock data');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const createAppointment = useCallback(async (data: Partial<AppointmentEntry>) => {
    try {
      const created = await appointmentsApi.create(data);
      setAppointments(prev => [created, ...prev]);
      return created;
    } catch {
      const mock = { ...data, id: `apt${Date.now()}`, createdAt: new Date().toISOString() } as AppointmentEntry;
      setAppointments(prev => [mock, ...prev]);
      return mock;
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<AppointmentEntry>) => {
    try {
      const updated = await appointmentsApi.update(id, data);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    } catch {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    }
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    try { await appointmentsApi.remove(id); } catch { /* offline */ }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' as AppointmentStatus } : a));
  }, []);

  return { appointments, loading, fetchAppointments, createAppointment, updateAppointment, cancelAppointment };
}
