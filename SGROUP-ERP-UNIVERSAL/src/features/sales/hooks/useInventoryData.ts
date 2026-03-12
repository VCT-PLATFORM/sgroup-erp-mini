import { useMemo } from 'react';
import { useSalesStore, PropertyUnit, UnitStatus } from '../store/useSalesStore';

export type { PropertyUnit, UnitStatus };

export function useInventoryData() {
  const units = useSalesStore(s => s.units);
  const selectedProject = useSalesStore(s => s.selectedProject);
  const setSelectedProject = useSalesStore(s => s.setSelectedProject);
  const lockUnit = useSalesStore(s => s.lockUnit);
  // Optional: Add requestDeposit if we want inventory to expose it directly, or components can use useSalesStore directly.

  const stats = useMemo(() => {
    return {
      available: units.filter(u => u.status === 'AVAILABLE').length,
      booked: units.filter(u => u.status === 'BOOKED' || u.status === 'LOCKED').length,
      deposit: units.filter(u => u.status === 'DEPOSIT' || u.status === 'PENDING_DEPOSIT').length,
      sold: units.filter(u => u.status === 'SOLD' || u.status === 'WAITING_CONTRACT' || u.status === 'COMPLETED').length,
      total: units.length
    };
  }, [units]);

  return {
    units,
    selectedProject,
    setSelectedProject,
    stats,
    lockUnit
  };
}
