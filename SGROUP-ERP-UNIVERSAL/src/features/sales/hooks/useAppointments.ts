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

export function useAppointments(filters?: Record<string, any>) {
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentsApi.list(filters);
      setAppointments(data);
    } catch (e: any) {
      console.error('[useAppointments] Failed to fetch appointments:', e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const createAppointment = useCallback(async (data: Partial<AppointmentEntry>) => {
    const created = await appointmentsApi.create(data);
    setAppointments(prev => [created, ...prev]);
    return created;
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<AppointmentEntry>) => {
    const updated = await appointmentsApi.update(id, data);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    await appointmentsApi.remove(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' as AppointmentStatus } : a));
  }, []);

  return { appointments, loading, fetchAppointments, createAppointment, updateAppointment, cancelAppointment };
}
