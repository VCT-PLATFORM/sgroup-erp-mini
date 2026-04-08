/**
 * Column Mappings — Google Sheets column headers ↔ Entity field names.
 * Also includes type coercion rules for deserialization.
 */

export type FieldType = 'string' | 'number' | 'float' | 'boolean' | 'date' | 'json';

export interface ColumnMapping {
  sheetHeader: string;   // Column header in Google Sheets
  entityField: string;   // Entity property name
  type: FieldType;       // For auto-coercion
  required?: boolean;
}

// ── Type Coercion Helpers ──

export function coerceValue(raw: any, type: FieldType): any {
  if (raw === null || raw === undefined || raw === '') return null;
  switch (type) {
    case 'string':  return String(raw);
    case 'number':  return parseInt(raw, 10) || 0;
    case 'float':   return parseFloat(raw) || 0;
    case 'boolean': return raw === 'TRUE' || raw === true || raw === '1';
    case 'date':    return new Date(raw);
    case 'json':    try { return JSON.parse(raw); } catch { return raw; }
    default: return raw;
  }
}

export function rowToEntity<T>(row: Record<string, any>, mapping: ColumnMapping[]): T {
  const entity: any = {};
  for (const col of mapping) {
    const raw = row[col.sheetHeader];
    entity[col.entityField] = coerceValue(raw, col.type);
  }
  return entity as T;
}

export function entityToRow(entity: Record<string, any>, mapping: ColumnMapping[]): Record<string, any> {
  const row: Record<string, any> = {};
  for (const col of mapping) {
    row[col.sheetHeader] = entity[col.entityField];
  }
  return row;
}

export function getHeaders(mapping: ColumnMapping[]): string[] {
  return mapping.map(m => m.sheetHeader);
}

// ═══════════════════════════════════════════════════════════════
// Entity-Specific Column Mappings
// Sheet tab names follow convention: PascalCase entity name
// ═══════════════════════════════════════════════════════════════

export const SHEET_NAMES = {
  User: 'Users',
  Customer: 'Customers',
  Activity: 'Activities',
  Appointment: 'Appointments',
  Product: 'Products',
  Team: 'Teams',
  Staff: 'Staff',
  Project: 'Projects',
  Deal: 'Deals',
  Target: 'Targets',
  Commission: 'Commissions',
  BizflySyncLog: 'BizflySyncLogs',
  AuditLog: 'AuditLogs',
  SalesDaily: 'SalesDaily',
  PipelineSnapshot: 'PipelineSnapshots',
  ExecPlanLatest: 'ExecPlanLatest',
  ExecKpiLatest: 'ExecKpiLatest',
  SalePlanLatest: 'SalePlanLatest',
  SalePlanHeader: 'SalePlanHeaders',
  SalePlanMonth: 'SalePlanMonths',
  SalePlanTeam: 'SalePlanTeams',
  SalePlanStaff: 'SalePlanStaff',
  MktPlanHeader: 'MktPlanHeaders',
  MktPlanChannelBudget: 'MktPlanChannelBudgets',
  MktPlanKpiTarget: 'MktPlanKpiTargets',
  MktPlanAssumption: 'MktPlanAssumptions',
};

export const CUSTOMER_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'fullName', entityField: 'fullName', type: 'string', required: true },
  { sheetHeader: 'phone', entityField: 'phone', type: 'string' },
  { sheetHeader: 'email', entityField: 'email', type: 'string' },
  { sheetHeader: 'source', entityField: 'source', type: 'string' },
  { sheetHeader: 'projectInterest', entityField: 'projectInterest', type: 'string' },
  { sheetHeader: 'budget', entityField: 'budget', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'assignedTo', entityField: 'assignedTo', type: 'string' },
  { sheetHeader: 'assignedName', entityField: 'assignedName', type: 'string' },
  { sheetHeader: 'isVip', entityField: 'isVip', type: 'boolean' },
  { sheetHeader: 'lastContactAt', entityField: 'lastContactAt', type: 'date' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'month', entityField: 'month', type: 'number' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const ACTIVITY_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'date', entityField: 'date', type: 'date' },
  { sheetHeader: 'staffId', entityField: 'staffId', type: 'string', required: true },
  { sheetHeader: 'staffName', entityField: 'staffName', type: 'string' },
  { sheetHeader: 'postsCount', entityField: 'postsCount', type: 'number' },
  { sheetHeader: 'callsCount', entityField: 'callsCount', type: 'number' },
  { sheetHeader: 'newLeads', entityField: 'newLeads', type: 'number' },
  { sheetHeader: 'meetingsMade', entityField: 'meetingsMade', type: 'number' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'month', entityField: 'month', type: 'number' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const APPOINTMENT_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'staffId', entityField: 'staffId', type: 'string', required: true },
  { sheetHeader: 'staffName', entityField: 'staffName', type: 'string' },
  { sheetHeader: 'customerId', entityField: 'customerId', type: 'string' },
  { sheetHeader: 'customerName', entityField: 'customerName', type: 'string' },
  { sheetHeader: 'customerPhone', entityField: 'customerPhone', type: 'string' },
  { sheetHeader: 'projectId', entityField: 'projectId', type: 'string' },
  { sheetHeader: 'projectName', entityField: 'projectName', type: 'string' },
  { sheetHeader: 'type', entityField: 'type', type: 'string' },
  { sheetHeader: 'scheduledAt', entityField: 'scheduledAt', type: 'date' },
  { sheetHeader: 'duration', entityField: 'duration', type: 'number' },
  { sheetHeader: 'location', entityField: 'location', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'outcome', entityField: 'outcome', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const PRODUCT_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'projectId', entityField: 'projectId', type: 'string', required: true },
  { sheetHeader: 'projectName', entityField: 'projectName', type: 'string' },
  { sheetHeader: 'code', entityField: 'code', type: 'string', required: true },
  { sheetHeader: 'block', entityField: 'block', type: 'string' },
  { sheetHeader: 'floor', entityField: 'floor', type: 'number' },
  { sheetHeader: 'area', entityField: 'area', type: 'float' },
  { sheetHeader: 'price', entityField: 'price', type: 'float' },
  { sheetHeader: 'direction', entityField: 'direction', type: 'string' },
  { sheetHeader: 'bedrooms', entityField: 'bedrooms', type: 'number' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'bookedBy', entityField: 'bookedBy', type: 'string' },
  { sheetHeader: 'lockedUntil', entityField: 'lockedUntil', type: 'date' },
  { sheetHeader: 'customerPhone', entityField: 'customerPhone', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const TEAM_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'code', entityField: 'code', type: 'string', required: true },
  { sheetHeader: 'name', entityField: 'name', type: 'string', required: true },
  { sheetHeader: 'leaderId', entityField: 'leaderId', type: 'string' },
  { sheetHeader: 'leaderName', entityField: 'leaderName', type: 'string' },
  { sheetHeader: 'region', entityField: 'region', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'sortOrder', entityField: 'sortOrder', type: 'number' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const STAFF_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'userId', entityField: 'userId', type: 'string' },
  { sheetHeader: 'employeeCode', entityField: 'employeeCode', type: 'string' },
  { sheetHeader: 'fullName', entityField: 'fullName', type: 'string', required: true },
  { sheetHeader: 'phone', entityField: 'phone', type: 'string' },
  { sheetHeader: 'email', entityField: 'email', type: 'string' },
  { sheetHeader: 'teamId', entityField: 'teamId', type: 'string' },
  { sheetHeader: 'role', entityField: 'role', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'joinDate', entityField: 'joinDate', type: 'date' },
  { sheetHeader: 'leaveDate', entityField: 'leaveDate', type: 'date' },
  { sheetHeader: 'leadsCapacity', entityField: 'leadsCapacity', type: 'float' },
  { sheetHeader: 'personalTarget', entityField: 'personalTarget', type: 'float' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const DEAL_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'dealCode', entityField: 'dealCode', type: 'string' },
  { sheetHeader: 'bizflyCrmId', entityField: 'bizflyCrmId', type: 'string' },
  { sheetHeader: 'projectId', entityField: 'projectId', type: 'string' },
  { sheetHeader: 'projectName', entityField: 'projectName', type: 'string' },
  { sheetHeader: 'staffId', entityField: 'staffId', type: 'string' },
  { sheetHeader: 'staffName', entityField: 'staffName', type: 'string' },
  { sheetHeader: 'teamId', entityField: 'teamId', type: 'string' },
  { sheetHeader: 'teamName', entityField: 'teamName', type: 'string' },
  { sheetHeader: 'customerName', entityField: 'customerName', type: 'string' },
  { sheetHeader: 'customerPhone', entityField: 'customerPhone', type: 'string' },
  { sheetHeader: 'productCode', entityField: 'productCode', type: 'string' },
  { sheetHeader: 'productType', entityField: 'productType', type: 'string' },
  { sheetHeader: 'dealValue', entityField: 'dealValue', type: 'float' },
  { sheetHeader: 'feeRate', entityField: 'feeRate', type: 'float' },
  { sheetHeader: 'commission', entityField: 'commission', type: 'float' },
  { sheetHeader: 'stage', entityField: 'stage', type: 'string' },
  { sheetHeader: 'dealDate', entityField: 'dealDate', type: 'date' },
  { sheetHeader: 'bookingDate', entityField: 'bookingDate', type: 'date' },
  { sheetHeader: 'contractDate', entityField: 'contractDate', type: 'date' },
  { sheetHeader: 'source', entityField: 'source', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'month', entityField: 'month', type: 'number' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const PROJECT_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'projectCode', entityField: 'projectCode', type: 'string', required: true },
  { sheetHeader: 'name', entityField: 'name', type: 'string', required: true },
  { sheetHeader: 'developer', entityField: 'developer', type: 'string' },
  { sheetHeader: 'location', entityField: 'location', type: 'string' },
  { sheetHeader: 'type', entityField: 'type', type: 'string' },
  { sheetHeader: 'feeRate', entityField: 'feeRate', type: 'float' },
  { sheetHeader: 'avgPrice', entityField: 'avgPrice', type: 'float' },
  { sheetHeader: 'totalUnits', entityField: 'totalUnits', type: 'number' },
  { sheetHeader: 'soldUnits', entityField: 'soldUnits', type: 'number' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'startDate', entityField: 'startDate', type: 'date' },
  { sheetHeader: 'endDate', entityField: 'endDate', type: 'date' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const USER_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'email', entityField: 'email', type: 'string', required: true },
  { sheetHeader: 'name', entityField: 'name', type: 'string', required: true },
  { sheetHeader: 'password', entityField: 'password', type: 'string', required: true },
  { sheetHeader: 'role', entityField: 'role', type: 'string' },
  { sheetHeader: 'department', entityField: 'department', type: 'string' },
  { sheetHeader: 'salesRole', entityField: 'salesRole', type: 'string' },
  { sheetHeader: 'teamId', entityField: 'teamId', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const COMMISSION_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'dealId', entityField: 'dealId', type: 'string', required: true },
  { sheetHeader: 'staffId', entityField: 'staffId', type: 'string', required: true },
  { sheetHeader: 'staffName', entityField: 'staffName', type: 'string' },
  { sheetHeader: 'teamId', entityField: 'teamId', type: 'string' },
  { sheetHeader: 'role', entityField: 'role', type: 'string' },
  { sheetHeader: 'dealValue', entityField: 'dealValue', type: 'float' },
  { sheetHeader: 'commissionRate', entityField: 'commissionRate', type: 'float' },
  { sheetHeader: 'commissionAmount', entityField: 'commissionAmount', type: 'float' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'period', entityField: 'period', type: 'string' },
  { sheetHeader: 'approvedBy', entityField: 'approvedBy', type: 'string' },
  { sheetHeader: 'approvedAt', entityField: 'approvedAt', type: 'date' },
  { sheetHeader: 'paidAt', entityField: 'paidAt', type: 'date' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'month', entityField: 'month', type: 'number' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

export const TARGET_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'month', entityField: 'month', type: 'number' },
  { sheetHeader: 'teamId', entityField: 'teamId', type: 'string' },
  { sheetHeader: 'staffId', entityField: 'staffId', type: 'string' },
  { sheetHeader: 'targetGMV', entityField: 'targetGMV', type: 'float' },
  { sheetHeader: 'targetDeals', entityField: 'targetDeals', type: 'number' },
  { sheetHeader: 'targetLeads', entityField: 'targetLeads', type: 'number' },
  { sheetHeader: 'targetMeetings', entityField: 'targetMeetings', type: 'number' },
  { sheetHeader: 'targetBookings', entityField: 'targetBookings', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];
