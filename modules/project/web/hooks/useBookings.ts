import { useState, useEffect } from 'react';
import { listBookings, updateBookingStatus } from '../api/projectMocks';
import type { REBooking } from '../types';

export function useBookings() {
  const [data, setData] = useState<REBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await listBookings();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const moveBooking = async (id: string, newStatus: REBooking['status']) => {
    // Optimistic update
    const oldData = [...data];
    setData(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    try {
      await updateBookingStatus(id, newStatus);
    } catch (err) {
      setData(oldData);
      alert('Failed to update status');
    }
  };

  return { data, loading, refetch: fetchBookings, moveBooking };
}
