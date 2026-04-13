import { apiClient } from '../../../core/api/apiClient';
import { mockHRData, mockRespond } from './hrMocks';
import { Employee, Department, Team, Position } from '../types';

export const hrApi = {
  // Dashboard
  getDashboard: async () => mockRespond(mockHRData.getDashboard),

  // Departments
  getDepartments: async () => {
    const res = await apiClient.get('/hr/v1/departments');
    return res.data;
  },
  createDepartment: async (data: Omit<Department, 'id'>) => {
    const res = await apiClient.post('/hr/v1/departments', data);
    return res.data;
  },
  updateDepartment: async (id: string, data: Partial<Department>) => {
    const res = await apiClient.put(`/hr/v1/departments/${id}`, data);
    return res.data;
  },
  deleteDepartment: async (id: string) => {
    const res = await apiClient.delete(`/hr/v1/departments/${id}`);
    return res.data;
  },

  // Positions
  getPositions: async () => {
    const res = await apiClient.get('/hr/v1/positions');
    return res.data;
  },
  createPosition: async (data: Omit<Position, 'id'>) => {
    const res = await apiClient.post('/hr/v1/positions', data);
    return res.data;
  },
  updatePosition: async (id: string, data: Partial<Position>) => {
    const res = await apiClient.put(`/hr/v1/positions/${id}`, data);
    return res.data;
  },
  deletePosition: async (id: string) => {
    const res = await apiClient.delete(`/hr/v1/positions/${id}`);
    return res.data;
  },

  // Teams
  getTeams: async (deptId?: string) => {
    const url = deptId ? `/hr/v1/teams?departmentId=${deptId}` : '/hr/v1/teams';
    const res = await apiClient.get(url);
    return res.data;
  },
  createTeam: async (data: Omit<Team, 'id'>) => {
    const res = await apiClient.post('/hr/v1/teams', data);
    return res.data;
  },
  updateTeam: async (id: string, data: Partial<Team>) => {
    const res = await apiClient.put(`/hr/v1/teams/${id}`, data);
    return res.data;
  },
  deleteTeam: async (id: string) => {
    const res = await apiClient.delete(`/hr/v1/teams/${id}`);
    return res.data;
  },

  // Employees
  getEmployees: async (params?: Record<string, unknown>) => {
    const res = await apiClient.get('/hr/v1/employees', { params });
    return res.data;
  },
  getEmployee: async (id: string) => {
    const res = await apiClient.get(`/hr/v1/employees/${id}`);
    return res.data;
  },
  createEmployee: async (data: Omit<Employee, 'id'>) => {
    const res = await apiClient.post('/hr/v1/employees', data);
    return res.data;
  },
  updateEmployee: async (id: string, data: Partial<Employee>) => {
    const res = await apiClient.put(`/hr/v1/employees/${id}`, data);
    return res.data;
  },
  deleteEmployee: async (id: string) => {
    const res = await apiClient.delete(`/hr/v1/employees/${id}`);
    return res.data;
  },

  // Contracts
  getContracts: async (params?: any) => mockRespond(mockHRData.getContracts),
  createContract: async (data: any) => {
    const res = await apiClient.post('/hr/contracts', data);
    return res.data;
  },
  updateContract: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/contracts/${id}`, data);
    return res.data;
  },

  // Attendance
  getAttendance: async (params?: any) => {
    const res = await apiClient.get('/hr/v1/attendance', { params });
    return res.data;
  },
  createAttendance: async (data: any) => {
    const res = await apiClient.post('/hr/v1/attendance/check-in', data);
    return res.data;
  },
  updateAttendance: async (id: string, data: any) => {
    // Usually mapped to check out based on UI payload, or generic update
    const res = await apiClient.post('/hr/v1/attendance/check-out', data);
    return res.data;
  },

  // Leaves
  getLeaves: async (params?: any) => {
    const res = await apiClient.get('/hr/v1/leaves', { params });
    return res.data;
  },
  createLeave: async (data: any) => {
    const res = await apiClient.post('/hr/v1/leaves', data);
    return res.data;
  },
  updateLeave: async (id: string, data: any) => {
    const res = await apiClient.put(`/hr/v1/leaves/${id}`, data);
    return res.data;
  },
  approveLeave: async (id: string, approverId: string) => { 
    const res = await apiClient.put(`/hr/v1/leaves/${id}/approve`, { approver_id: Number(approverId) });
    return res.data;
  },
  rejectLeave: async (id: string, approverId: string, note?: string) => { 
    const res = await apiClient.put(`/hr/v1/leaves/${id}/reject`, { approver_id: Number(approverId), note });
    return res.data;
  },

  // Payroll
  getPayrollRuns: async (params?: any) => {
    const res = await apiClient.get('/hr/v1/payroll/runs', { params });
    return res.data;
  },
  getPayslips: async (runId: number | string) => {
    const res = await apiClient.get(`/hr/v1/payroll/runs/${runId}/payslips`);
    return res.data;
  },
  generatePayroll: async (data: { title: string, cycle_start: string, cycle_end: string, standard_days: number, admin_id: number }) => {
    const res = await apiClient.post('/hr/v1/payroll/generate', data);
    return res.data;
  },
  approvePayroll: async (period: string, approvedBy: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },

  // Performance
  getPerformance: async (params?: any) => mockRespond(mockHRData.getPerformance),
  createPerformance: async (data: any) => {
    const res = await apiClient.post('/hr/performance', data);
    return res.data;
  },
  updatePerformance: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/performance/${id}`, data);
    return res.data;
  },

  // Recruitment
  getJobs: async (status?: string) => mockRespond(mockHRData.getJobs),
  createJob: async (data: any) => {
    const res = await apiClient.post('/hr/jobs', data);
    return res.data;
  },
  updateJob: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/jobs/${id}`, data);
    return res.data;
  },
  deleteJob: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },
  getCandidates: async (params?: any) => mockRespond(mockHRData.getCandidates),
  createCandidate: async (data: any) => {
    const res = await apiClient.post('/hr/candidates', data);
    return res.data;
  },
  updateCandidate: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/candidates/${id}`, data);
    return res.data;
  },
  deleteCandidate: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },

  // Training
  getCourses: async (status?: string) => mockRespond(mockHRData.getCourses),
  createCourse: async (data: any) => {
    const res = await apiClient.post('/hr/courses', data);
    return res.data;
  },
  updateCourse: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/courses/${id}`, data);
    return res.data;
  },
  deleteCourse: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },
  getTrainees: async (params?: any) => mockRespond(mockHRData.getTrainees),
  createTrainee: async (data: any) => {
    const res = await apiClient.post('/hr/trainees', data);
    return res.data;
  },
  updateTrainee: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/trainees/${id}`, data);
    return res.data;
  },
  deleteTrainee: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },

  // Dashboard Extras
  getDashboardEvents: async () => mockRespond(mockHRData.getDashboardEvents),
  getDashboardActivities: async () => mockRespond(mockHRData.getDashboardActivities),

  // Transfer History
  getTransfers: async (employeeId?: string) => mockRespond(mockHRData.getTransfers),

  // Leave Balance
  getLeaveBalances: async (year?: number) => mockRespond(mockHRData.getLeaveBalances),
  getLeaveBalance: async (employeeId: string, year?: number) => {
     const url = year ? `/hr/v1/leaves/balances/${employeeId}?year=${year}` : `/hr/v1/leaves/balances/${employeeId}?year=${new Date().getFullYear()}`;
     const res = await apiClient.get(url);
     return res.data;
  },
  recalculateLeaveBalance: async (employeeId: string, year: number) => {
    const res = await apiClient.post('/hr/leave-balance/recalculate', { employeeId, year });
    return res.data;
  },

  // Benefits
  getBenefits: async (params?: any) => mockRespond(mockHRData.getBenefits),
  createBenefit: async (data: any) => {
    const res = await apiClient.post('/hr/benefits', data);
    return res.data;
  },
  updateBenefit: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/benefits/${id}`, data);
    return res.data;
  },
  deleteBenefit: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },

  // Policies
  getPolicies: async (category?: string) => mockRespond(mockHRData.getPolicies),
  createPolicy: async (data: any) => {
    const res = await apiClient.post('/hr/policies', data);
    return res.data;
  },
  updatePolicy: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/policies/${id}`, data);
    return res.data;
  },
  deletePolicy: async (id: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },

  // Overtime
  getOvertime: async (params?: any) => mockRespond(mockHRData.getOvertime),
  createOvertime: async (data: any) => {
    const res = await apiClient.post('/hr/overtime', data);
    return res.data;
  },
  updateOvertime: async (id: string, data: any) => {
    const res = await apiClient.patch(`/hr/overtime/${id}`, data);
    return res.data;
  },
  approveOvertime: async (id: string, approverId: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },
  rejectOvertime: async (id: string, approverId: string, note?: string) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400)); },
};
