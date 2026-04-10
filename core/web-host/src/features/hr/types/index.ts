export type HRRole = 'admin' | 'hr_manager' | 'hr_director' | 'staff';
export type WorkStatus = 'ACTIVE' | 'PROBATION' | 'ON_LEAVE' | 'TERMINATED';

export interface Department {
  id: string;
  name: string;
  code: string;
  manager?: {
    fullName: string;
  };
  _count?: {
    employees: number;
  };
}

export interface Position {
  id: string;
  name: string;
  code: string;
  level: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  fullName: string;
  englishName?: string;
  employeeCode: string;
  email: string;
  phone: string;
  
  departmentId?: string;
  department?: Department;
  
  positionId?: string;
  position?: Position;
  
  teamId?: string;
  team?: Team;

  status: WorkStatus;
  workStatus?: string;

  createdAt?: string;

  [key: string]: any; // fallback for other extra properties during migration
}

export interface TransferRecord {
  id: string;
  transferType: 'DEPARTMENT' | 'TEAM' | 'BOTH';
  fromDepartment?: Department;
  toDepartment?: Department;
  fromTeam?: Team;
  toTeam?: Team;
  effectiveDate: string;
}

export interface HRDashboardData {
  totalEmployees: number;
  activeEmployees: number;
  probationEmployees: number;
  pendingLeaves: number;
  departmentCount?: number;
  onLeaveCount?: number;
}
