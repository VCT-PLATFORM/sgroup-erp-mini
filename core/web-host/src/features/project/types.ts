export type REProjectStatus = 'UPCOMING' | 'SELLING' | 'HANDOVER' | 'CLOSED';
export type REPropertyType = 'LAND' | 'APARTMENT' | 'VILLA' | 'SHOPHOUSE';
export type REInventoryStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'LOCKED';
export type RELegalProcedureStatus = 'PREPARATION' | 'SUBMITTED' | 'ISSUE_FIXING' | 'APPROVED';

export interface REProject {
  id: string;
  name: string;
  code: string;
  description: string;
  status: REProjectStatus;
  type: REPropertyType;
  location: string;
  developer: string;
  totalUnits: number;
  startDate: string;
  endDate: string;
  managerId: string;
  managerName: string;
  teamSize: number;
  progress: number;
  createdAt: string;
  tags: string[];
}

export interface REInventory {
  id: string;
  projectId: string;
  code: string; // e.g. A1-01
  status: REInventoryStatus;
  type: REPropertyType;
  area: number; // m2
  direction: string;
  price: number; // raw price
  customerName?: string;
  salespersonId?: string;
}

export interface RELegalDoc {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: RELegalProcedureStatus;
  submitDate?: string;
  approveDate?: string;
  assigneeName?: string;
}
